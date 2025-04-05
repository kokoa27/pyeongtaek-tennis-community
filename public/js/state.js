// state.js - 애플리케이션 상태 관리 모듈

// 상태 관리 모듈
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
