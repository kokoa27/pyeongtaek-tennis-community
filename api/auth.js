const firebase = require('../config/firebase');
const bcrypt = require('bcryptjs');

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
    const usersCollection = db.collection('users');
    
    // 로그인 처리
    if (req.method === 'POST' && req.body.action === 'login') {
      const { username, password } = req.body;
      
      // 필수 필드 검증
      if (!username || !password) {
        return res.status(400).json({ 
          success: false, 
          message: '아이디와 비밀번호를 모두 입력해주세요.' 
        });
      }
      
      // 사용자 조회
      const userSnapshot = await usersCollection.where('username', '==', username).get();
      
      if (userSnapshot.empty) {
        return res.status(401).json({ 
          success: false, 
          message: '아이디 또는 비밀번호가 일치하지 않습니다.' 
        });
      }
      
      // 첫 번째 문서 가져오기
      const userDoc = userSnapshot.docs[0];
      const userData = userDoc.data();
      
      // 비밀번호 검증
      const isPasswordValid = await bcrypt.compare(password, userData.password);
      
      if (!isPasswordValid) {
        return res.status(401).json({ 
          success: false, 
          message: '아이디 또는 비밀번호가 일치하지 않습니다.' 
        });
      }
      
      // 로그인 성공
      return res.status(200).json({
        success: true,
        user: {
          id: userDoc.id,
          username: userData.username
        }
      });
    }
    
    // 회원가입 처리
    if (req.method === 'POST' && req.body.action === 'register') {
      const { username, password } = req.body;
      
      // 필수 필드 검증
      if (!username || !password) {
        return res.status(400).json({ 
          success: false, 
          message: '아이디와 비밀번호를 모두 입력해주세요.' 
        });
      }
      
      // 사용자명 중복 확인
      const userSnapshot = await usersCollection.where('username', '==', username).get();
      
      if (!userSnapshot.empty) {
        return res.status(400).json({ 
          success: false, 
          message: '이미 존재하는 사용자명입니다.' 
        });
      }
      
      // 비밀번호 해시화
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // 새 사용자 데이터 생성
      const newUser = {
        username,
        password: hashedPassword,
        createdAt: new Date().toISOString()
      };
      
      // Firestore에 저장
      const docRef = await usersCollection.add(newUser);
      
      // 응답 전송
      return res.status(201).json({
        success: true,
        user: {
          id: docRef.id,
          username: newUser.username
        }
      });
    }
    
    // 지원하지 않는 메서드 처리
    return res.status(405).json({ 
      success: false, 
      message: '지원하지 않는 메서드입니다.' 
    });
    
  } catch (error) {
    console.error('인증 API 오류:', error);
    return res.status(500).json({ 
      success: false, 
      message: '서버 오류가 발생했습니다.' 
    });
  }
};
