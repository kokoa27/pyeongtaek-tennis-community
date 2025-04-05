const firebase = require('../config/firebase');

module.exports = async (req, res) => {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const db = firebase.firestore();
    const groupsCollection = db.collection('groups');

    // 경로에서 groupId 추출
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathSegments = url.pathname.split('/').filter(Boolean);
    
    // 기본 경로: /api/groups 
    // 소모임 참여 경로: /api/groups/{groupId}/join

    // GET 요청 - 소모임 목록 가져오기
    if (req.method === 'GET' && pathSegments.length === 1) {
      const snapshot = await groupsCollection.orderBy('createdAt', 'desc').get();
      const groups = [];
      
      snapshot.forEach(doc => {
        groups.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return res.status(200).json(groups);
    }
    
    // POST 요청 - 새 소모임 생성
    if (req.method === 'POST' && pathSegments.length === 1) {
      const { title, description, location, date, level, maxMembers, contact, createdBy, createdAt, members } = req.body;
      
      // 필수 필드 검증
      if (!title || !description || !location || !date || !level) {
        return res.status(400).json({ error: '제목, 설명, 장소, 날짜, 레벨은 필수 항목입니다.' });
      }
      
      // 새 소모임 데이터 생성
      const newGroup = {
        title,
        description,
        location,
        date,
        level,
        maxMembers: maxMembers || 0,
        contact: contact || '',
        createdBy,
        createdAt: createdAt || new Date().toISOString(),
        members: members || [createdBy]
      };
      
      // Firestore에 저장
      const docRef = await groupsCollection.add(newGroup);
      
      // 응답 전송
      return res.status(201).json({
        id: docRef.id,
        ...newGroup
      });
    }
    
    // POST 요청 - 소모임 참여
    if (req.method === 'POST' && pathSegments.length === 3 && pathSegments[2] === 'join') {
      const groupId = pathSegments[1];
      const { username } = req.body;
      
      if (!username) {
        return res.status(400).json({ error: '사용자 이름이 필요합니다.' });
      }
      
      // 소모임 데이터 가져오기
      const groupDoc = await groupsCollection.doc(groupId).get();
      
      if (!groupDoc.exists) {
        return res.status(404).json({ error: '소모임을 찾을 수 없습니다.' });
      }
      
      const groupData = groupDoc.data();
      
      // 이미 참여 중인지 확인
      if (groupData.members && groupData.members.includes(username)) {
        return res.status(400).json({ error: '이미 참여 중인 소모임입니다.' });
      }
      
      // 최대 인원 확인
      if (groupData.maxMembers > 0 && groupData.members.length >= groupData.maxMembers) {
        return res.status(400).json({ error: '소모임이 이미 가득 찼습니다.' });
      }
      
      // 새 멤버 추가
      const updatedMembers = [...groupData.members, username];
      
      // Firestore 업데이트
      await groupsCollection.doc(groupId).update({
        members: updatedMembers
      });
      
      return res.status(200).json({
        success: true,
        message: '소모임에 참여했습니다.'
      });
    }
    
    // 지원하지 않는 메서드 처리
    return res.status(405).json({ error: '지원하지 않는 메서드입니다.' });
    
  } catch (error) {
    console.error('소모임 API 오류:', error);
    return res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
};
