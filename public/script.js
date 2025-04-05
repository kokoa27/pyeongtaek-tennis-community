// 테니스 커뮤니티 MVP - 모듈식 JavaScript 코드
// 2025.04.04

// 모듈 객체들 선언
const App = {};

// 상태 관리 모듈 - 애플리케이션 상태 관리
App.State = {
  currentUser: null,
  currentChatId: null,
  currentCategory: 'all',
  
  // 사용자 상태 업데이트
  setUser: (user) => {
    App.State.currentUser = user;
    localStorage.setItem('user', JSON.stringify(user));
    App.UI.auth.updateUI(!!user);
  },
  
  // 사용자 상태 제거
  clearUser: () => {
    App.State.currentUser = null;
    localStorage.removeItem('user');
    App.UI.auth.updateUI(false);
  },
  
  // 현재 채팅방 ID 설정
  setChatId: (chatId) => {
    App.State.currentChatId = chatId;
  },
  
  // 현재 마켓 카테고리 설정
  setCategory: (category) => {
    App.State.currentCategory = category;
  },
  
  // 페이지 로드 시 사용자 상태 확인
  init: () => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      App.State.currentUser = JSON.parse(savedUser);
      App.UI.auth.updateUI(true);
    } else {
      App.UI.auth.updateUI(false);
    }
  }
};

// API 모듈 - 백엔드 통신 담당
App.API = {
  // 인증 관련 API
  auth: {
    login: async (username, password) => {
      try {
        const response = await axios.post('/api/auth', { 
          action: 'login', 
          username, 
          password 
        });
        return response.data;
      } catch (error) {
        console.error('로그인 오류:', error);
        throw error;
      }
    },
    
    register: async (username, password) => {
      try {
        const response = await axios.post('/api/auth', { 
          action: 'register', 
          username, 
          password 
        });
        return response.data;
      } catch (error) {
        console.error('회원가입 오류:', error);
        throw error;
      }
    }
  },
  
  // 게시글 관련 API
  posts: {
    getAll: async () => {
      try {
        const response = await axios.get('/api/posts');