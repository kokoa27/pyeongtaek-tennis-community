// ui-core.js - UI 코어 모듈 (공통 기능)
console.log('ui-core.js 로딩 시작');

// 전역 App 객체가 없으면 생성
if (typeof window.App === 'undefined') {
  console.log('ui-core.js에서 App 객체 생성');
  window.App = {};
}

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
      console.log(`모달 열기 시도: ${modalId}`);
      const modal = document.getElementById(modalId);
      if (modal) {
        console.log(`${modalId} 모달 찾음, 열기 실행`);
        modal.classList.remove('hidden');
      } else {
        console.error(`${modalId} 모달을 찾을 수 없음`);
      }
    },
    
    // 모달 닫기
    close: (modalId) => {
      console.log(`모달 닫기 시도: ${modalId}`);
      const modal = document.getElementById(modalId);
      if (modal) {
        console.log(`${modalId} 모달 찾음, 닫기 실행`);
        modal.classList.add('hidden');
      } else {
        console.error(`${modalId} 모달을 찾을 수 없음`);
      }
    },
    
    // 모달 초기화
    init: () => {
      console.log('모달 초기화 시작');
      
      // 요소들 확인
      console.log('모달 요소 검사:');
      const modals = document.querySelectorAll('.modal-container');
      console.log(`발견된 모달: ${modals.length}개`);
      modals.forEach((modal, index) => {
        console.log(`모달 ${index + 1}: ${modal.id}`);
      });
      
      // 닫기 버튼에 이벤트 리스너 추가
      const closeButtons = document.querySelectorAll('.closeModal');
      console.log(`모달 닫기 버튼: ${closeButtons.length}개`);
      
      closeButtons.forEach(button => {
        button.addEventListener('click', () => {
          console.log('닫기 버튼 클릭됨');
          // 부모 모달 찾기
          const modal = button.closest('.modal-container');
          if (modal) {
            console.log(`부모 모달 찾음: ${modal.id}, 닫기 실행`);
            modal.classList.add('hidden');
          } else {
            console.error('부모 모달을 찾을 수 없음');
          }
        });
      });
      
      console.log('모달 초기화 완료');
    }
  },
  
  // UI 초기화
  init: function() {
    console.log('UI 초기화 시작');
    
    // 모달 초기화
    this.modal.init();
    
    // 각 모듈 초기화
    if (this.auth && typeof this.auth.init === 'function') {
      console.log('UI.auth.init 호출');
      try {
        this.auth.init();
      } catch (error) {
        console.error('auth 초기화 오류:', error);
      }
    } else {
      console.log('UI.auth 모듈이 없거나 init 함수가 없음');
    }
    
    if (this.weather && typeof this.weather.init === 'function') {
      console.log('UI.weather.init 호출');
      try {
        this.weather.init();
      } catch (error) {
        console.error('weather 초기화 오류:', error);
      }
    }
    
    if (this.posts && typeof this.posts.init === 'function') {
      console.log('UI.posts.init 호출');
      try {
        this.posts.init();
      } catch (error) {
        console.error('posts 초기화 오류:', error);
      }
    }
    
    if (this.courts && typeof this.courts.init === 'function') {
      console.log('UI.courts.init 호출');
      try {
        this.courts.init();
      } catch (error) {
        console.error('courts 초기화 오류:', error);
      }
    }
    
    if (this.groups && typeof this.groups.init === 'function') {
      console.log('UI.groups.init 호출');
      try {
        this.groups.init();
      } catch (error) {
        console.error('groups 초기화 오류:', error);
      }
    }
    
    if (this.market && typeof this.market.init === 'function') {
      console.log('UI.market.init 호출');
      try {
        this.market.init();
      } catch (error) {
        console.error('market 초기화 오류:', error);
      }
    }
    
    if (this.chat && typeof this.chat.init === 'function') {
      console.log('UI.chat.init 호출');
      try {
        this.chat.init();
      } catch (error) {
        console.error('chat 초기화 오류:', error);
      }
    }
    
    console.log('UI 초기화 완료');
  }
};

console.log('ui-core.js 로딩 완료');
