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

    // POST 요청만 처리
    if (req.method !== 'POST') {
      return res.status(405).json({ error: '지원하지 않는 메서드입니다.' });
    }

    const { action, username, password } = req.body;

    // 로그인 처리
    if (action === 'login') {
      if (!username || !password) {
        return res.status(400).json({ success: false, message: '아이디와 비밀번호를 모두 입력해주세요.' });
      }

      // 사용자 검색
      const userSnapshot = await usersCollection.where('username', '==', username).get();
      
      if (userSnapshot.empty) {
        return res.status(401).json({ success: false, message: '아이디 또는 비밀번호가 올바르지 않습니다.' });
      }

      const userDoc = userSnapshot.docs[0];
      const userData = userDoc.data();

      // 비밀번호 확인
      const isPasswordValid = await bcrypt.compare(password, userData.password);
      
      if (!isPasswordValid) {
        return res.status(401).json({ success: false, message: '아이디 또는 비밀번호가 올바르지 않습니다.' });
      }

      // 응답 데이터에서 비밀번호 제외
      const { password: _, ...userResponse } = userData;

      return res.status(200).json({
        success: true,
        user: {
          id: userDoc.id,
          username: userResponse.username
        }
      });
    }

    // 회원가입 처리
    if (action === 'register') {
      if (!username || !password) {
        return res.status(400).json({ success: false, message: '아이디와 비밀번호를 모두 입력해주세요.' });
      }

      // 아이디 중복 확인
      const existingUser = await usersCollection.where('username', '==', username).get();
      
      if (!existingUser.empty) {
        return res.status(400).json({ success: false, message: '이미 사용 중인 아이디입니다.' });
      }

      // 비밀번호 해싱
      const hashedPassword = await bcrypt.hash(password, 10);

      // 새 사용자 데이터
      const newUser = {
        username,
        password: hashedPassword,
        createdAt: new Date().toISOString()
      };

      // Firestore에 저장
      const docRef = await usersCollection.add(newUser);

      return res.status(201).json({
        success: true,
        user: {
          id: docRef.id,
          username
        }
      });
    }

    // 지원하지 않는 액션 처리
    return res.status(400).json({ success: false, message: '지원하지 않는 액션입니다.' });

  } catch (error) {
    console.error('인증 API 오류:', error);
    return res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
  }
};
