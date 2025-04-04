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
    const postsCollection = db.collection('posts');

    // GET 요청 - 게시글 목록 가져오기
    if (req.method === 'GET') {
      const snapshot = await postsCollection.orderBy('createdAt', 'desc').get();
      const posts = [];
      
      snapshot.forEach(doc => {
        posts.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return res.status(200).json(posts);
    }
    
    // POST 요청 - 새 게시글 생성
    if (req.method === 'POST') {
      const { title, content, author } = req.body;
      
      // 필수 필드 검증
      if (!title || !content || !author) {
        return res.status(400).json({ error: '제목, 내용, 작성자는 필수 항목입니다.' });
      }
      
      // 새 게시글 데이터 생성
      const newPost = {
        title,
        content,
        author,
        createdAt: new Date().toISOString()
      };
      
      // Firestore에 저장
      const docRef = await postsCollection.add(newPost);
      
      // 응답 전송
      return res.status(201).json({
        id: docRef.id,
        ...newPost
      });
    }
    
    // 지원하지 않는 메서드 처리
    return res.status(405).json({ error: '지원하지 않는 메서드입니다.' });
    
  } catch (error) {
    console.error('게시글 API 오류:', error);
    return res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
};
