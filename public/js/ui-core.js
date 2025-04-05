// ui-core.js - UI 코어 모듈 (공통 기능)

// UI 코어 모듈
App.UI = {
  // DOM 요소들
  elements: {
    // 인증 관련
    loginForm: document.getElementById('loginForm'),
    registerForm: document.getElementById('registerForm'),
    loginBtn: document.getElementById('loginBtn'),
    registerBtn: document.getElementById('registerBtn'),
    logoutBtn: document.getElementById('logoutBtn'),
    navButtons: document.getElementById('navButtons'),
    userInfo: document.getElementById('userInfo'),
    username: document.getElementById('username'),
    
    // 모달
    loginModal: document.getElementById('loginModal'),
    registerModal: document.getElementById('registerModal'),
    postModal: document.getElementById('postModal'),
    courtInfoModal: document.getElementById('courtInfoModal'),
    groupsModal: document.getElementById('groupsModal'),
    createGroupModal: document.getElementById('createGroupModal'),
    createMarketItemModal: document.getElementById('createMarketItemModal'),
    marketItemDetailModal: document.getElementById('marketItemDetailModal'),
    chatListModal: document.getElementById('chatListModal'),
    chatRoomModal: document.getElementById('chatRoomModal'),
    
    // 날씨 위젯
    weatherWidget: document.getElementById('weatherWidget'),
    location: document.getElementById('location'),
    temperature: document.getElementById('temperature'),
    condition: document.getElementById('condition'),
    humidity: document.getElementById('humidity'),
    windSpeed: document.getElementById('windSpeed'),
    weatherIcon: document.getElementById('weatherIcon'),
    tennisScore: document.getElementById('tennisScore'),
    forecast: document.getElementById('forecast'),
    
    // 게시판
    postsList: document.getElementById('postsList'),
    postForm: document.getElementById('postForm'),
    newPostBtn: document.getElementById('newPostBtn'),
    
    // 테니스장 정보
    courtsList: document.getElementById('courtsList'),
    showTennisCourts: document.getElementById('showTennisCourts'),
    
    // 소모임
    groupsList: document.getElementById('groupsList'),
    showGroupsBtn: document.getElementById('showGroupsBtn'),
    newGroupBtn: document.getElementById('newGroupBtn'),
    createGroupForm: document.getElementById('createGroupForm'),
    
    // 마켓
    marketItemsList: document.getElementById('marketItemsList'),
    marketCategoryButtons: document.querySelectorAll('.marketCategoryBtn'),
    createMarketItemForm: document.getElementById('createMarketItemForm'),
    newMarketItemBtn: document.getElementById('newMarketItemBtn'),
    marketItemDetail: document.getElementById('marketItemDetail'),
    
    // 채팅
    chatList: document.getElementById('chatList'),
    chatMessages: document.getElementById('chatMessages'),
    sendMessageForm: document.getElementById('sendMessageForm')
  },
  
  // 모달 관련
  modal: {
    // 모달 열기
    open: (modalId) => {
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.remove('hidden');
      }
    },
    
    // 모달 닫기
    close: (modalId) => {
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.add('hidden');
      }
    },
    
    // 모달 초기화
    init: () => {
      // 닫기 버튼에 이벤트 리스너 추가
      document.querySelectorAll('.closeModal').forEach(button => {
        button.addEventListener('click', () => {
          // 부모 모달 찾기
          const modal = button.closest('.modal-container');
          if (modal) {
            modal.classList.add('hidden');
          }
        });
      });
    }
  },
  
  // UI 초기화
  init: () => {
    // 모달 초기화
    App.UI.modal.init();
    
    // 각 모듈 초기화
    if (App.UI.auth && typeof App.UI.auth.init === 'function') {
      App.UI.auth.init();
    }
    
    if (App.UI.weather && typeof App.UI.weather.init === 'function') {
      App.UI.weather.init();
    }
    
    if (App.UI.posts && typeof App.UI.posts.init === 'function') {
      App.UI.posts.init();
    }
    
    if (App.UI.courts && typeof App.UI.courts.init === 'function') {
      App.UI.courts.init();
    }
    
    if (App.UI.groups && typeof App.UI.groups.init === 'function') {
      App.UI.groups.init();
    }
    
    if (App.UI.market && typeof App.UI.market.init === 'function') {
      App.UI.market.init();
    }
    
    if (App.UI.chat && typeof App.UI.chat.init === 'function') {
      App.UI.chat.init();
    }
  }
};
