const firebase = require('firebase-admin');

// Firebase 초기화 (환경 변수 사용)
if (!firebase.apps.length) {
  try {
    // 서버리스 함수에서 사용하기 위한 설정
    firebase.initializeApp({
      credential: firebase.credential.cert({
        "type": process.env.FIREBASE_TYPE,
        "project_id": process.env.FIREBASE_PROJECT_ID,
        "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
        "private_key": process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        "client_email": process.env.FIREBASE_CLIENT_EMAIL,
        "client_id": process.env.FIREBASE_CLIENT_ID,
        "auth_uri": process.env.FIREBASE_AUTH_URI,
        "token_uri": process.env.FIREBASE_TOKEN_URI,
        "auth_provider_x509_cert_url": process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
        "client_x509_cert_url": process.env.FIREBASE_CLIENT_CERT_URL
      }),
      databaseURL: process.env.FIREBASE_DATABASE_URL
    });
    console.log('Firebase 초기화 성공');
  } catch (error) {
    console.error('Firebase 초기화 오류:', error.stack);
  }
}

module.exports = firebase;
