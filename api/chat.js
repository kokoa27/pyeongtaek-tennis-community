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
    const chatRoomsCollection = db.collection('chatRooms');
    const messagesCollection = db.collection('messages');

    // URL 파싱
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathSegments = url.pathname.split('/').filter(Boolean);
    
    // 경로 구조:
    // /api/chat/rooms - 채팅방 목록
    // /api/chat/rooms/{roomId}/messages - 특정 채팅방의 메시지

    // 채팅방 목록 가져오기
    if (req.method === 'GET' && pathSegments[1] === 'rooms' && pathSegments.length === 2) {
      const snapshot = await chatRoomsCollection.orderBy('createdAt', 'desc').get();
      const rooms = [];
      
      // 각 채팅방의 마지막 메시지 가져오기
      for (const doc of snapshot.docs) {
        const roomData = doc.data();
        const roomId = doc.id;
        
        // 마지막 메시지 쿼리
        const lastMessageQuery = await messagesCollection
          .where('roomId', '==', roomId)
          .orderBy('timestamp', 'desc')
          .limit(1)
          .get();
        
        let lastMessage = null;
        if (!lastMessageQuery.empty) {
          const lastMessageDoc = lastMessageQuery.docs[0];
          lastMessage = {
            id: lastMessageDoc.id,
            ...lastMessageDoc.data()
          };
        }
        
        rooms.push({
          id: roomId,
          ...roomData,
          lastMessage
        });
      }
      
      return res.status(200).json(rooms);
    }
    
    // 새 채팅방 생성
    if (req.method === 'POST' && pathSegments[1] === 'rooms' && pathSegments.length === 2) {
      const { users, createdAt } = req.body;
      
      if (!users || !Array.isArray(users) || users.length < 2) {
        return res.status(400).json({ error: '채팅방 생성에는 최소 2명의 사용자가 필요합니다.' });
      }
      
      // 두 사용자 간 기존 채팅방이 있는지 확인
      const existingRoomQuery = await chatRoomsCollection
        .where('users', 'array-contains', users[0])
        .get();
      
      let existingRoom = null;
      existingRoomQuery.forEach(doc => {
        const roomData = doc.data();
        if (roomData.users.includes(users[1])) {
          existingRoom = {
            id: doc.id,
            ...roomData
          };
        }
      });
      
      // 기존 채팅방이 있으면 반환
      if (existingRoom) {
        return res.status(200).json(existingRoom);
      }
      
      // 새 채팅방 생성
      const newRoom = {
        users,
        createdAt: createdAt || new Date().toISOString()
      };
      
      const docRef = await chatRoomsCollection.add(newRoom);
      
      return res.status(201).json({
        id: docRef.id,
        ...newRoom
      });
    }
    
    // 채팅방의 메시지 목록 가져오기
    if (req.method === 'GET' && pathSegments[1] === 'rooms' && pathSegments[3] === 'messages' && pathSegments.length === 4) {
      const roomId = pathSegments[2];
      
      // 채팅방 존재 확인
      const roomDoc = await chatRoomsCollection.doc(roomId).get();
      
      if (!roomDoc.exists) {
        return res.status(404).json({ error: '채팅방을 찾을 수 없습니다.' });
      }
      
      // 메시지 쿼리
      const snapshot = await messagesCollection
        .where('roomId', '==', roomId)
        .orderBy('timestamp', 'asc')
        .get();
      
      const messages = [];
      snapshot.forEach(doc => {
        messages.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return res.status(200).json(messages);
    }
    
    // 새 메시지 전송
    if (req.method === 'POST' && pathSegments[1] === 'rooms' && pathSegments[3] === 'messages' && pathSegments.length === 4) {
      const roomId = pathSegments[2];
      const { content, sender, timestamp } = req.body;
      
      if (!content || !sender) {
        return res.status(400).json({ error: '메시지 내용과 발신자 정보가 필요합니다.' });
      }
      
      // 채팅방 존재 확인
      const roomDoc = await chatRoomsCollection.doc(roomId).get();
      
      if (!roomDoc.exists) {
        return res.status(404).json({ error: '채팅방을 찾을 수 없습니다.' });
      }
      
      // 새 메시지 생성
      const newMessage = {
        roomId,
        content,
        sender,
        timestamp: timestamp || new Date().toISOString()
      };
      
      const docRef = await messagesCollection.add(newMessage);
      
      return res.status(201).json({
        id: docRef.id,
        ...newMessage
      });
    }
    
    // 지원하지 않는 메서드 처리
    return res.status(405).json({ error: '지원하지 않는 메서드입니다.' });
    
  } catch (error) {
    console.error('채팅 API 오류:', error);
    return res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
};
