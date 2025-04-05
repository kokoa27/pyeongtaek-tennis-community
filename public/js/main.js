// main.js - 메인 애플리케이션 진입점
console.log('main.js 로딩 시작');

// 앱 초기화 함수
function initApp() {
  console.log('initApp 함수 호출됨');
  
  // 전역 App 객체 확인
  if (!window.App) {
    console.error('App 객체가 정의되지 않았습니다.');
    window.App = {}; // 기본 객체 생성
    return;
  }
  
  console.log('App 객체 구조:', Object.keys(App));
  
  // 상태 초기화
  if (App.State && typeof App.State.init === 'function') {
    console.log('App.State.init 호출');
    try {
      App.State.init();
    } catch (error) {
      console.error('State 초기화 오류:', error);
    }
  } else {
    console.error('App.State 또는 App.State.init이 없습니다.');
  }
  
  // UI 초기화 
  if (App.UI && typeof App.UI.init === 'function') {
    console.log('App.UI.init 호출');
    try {
      App.UI.init();
    } catch (error) {
      console.error('UI 초기화 오류:', error);
    }
  } else {
    console.error('App.UI 또는 App.UI.init이 없습니다.');
  }
  
  // 이벤트 리스너 다시 확인 (디버깅 용도)
  console.log('DOM 요소 확인:');
  console.log('loginBtn:', document.getElementById('loginBtn'));
  console.log('showTennisCourts:', document.getElementById('showTennisCourts'));
  console.log('loginModal:', document.getElementById('loginModal'));
  
  // 이벤트 리스너 등록 (중복 등록 방지를 위해 기존 리스너 제거)
  const addSafeEventListener = (elementId, eventType, handler) => {
    const element = document.getElementById(elementId);
    if (element) {
      // 기존 이벤트 리스너 복제 후 제거 (선택적)
      const newElement = element.cloneNode(true);
      element.parentNode.replaceChild(newElement, element);
      
      // 새 이벤트 리스너 등록
      newElement.addEventListener(eventType, handler);
      console.log(`${elementId}에 이벤트 리스너 등록 완료`);
    } else {
      console.error(`${elementId} 요소를 찾을 수 없음`);
    }
  };
  
  // 핵심 버튼 이벤트 리스너 직접 등록 (디버깅 용도)
  addSafeEventListener('loginBtn', 'click', () => {
    console.log('로그인 버튼 클릭 (main.js)');
    if (App.UI && App.UI.modal) {
      App.UI.modal.open('loginModal');
    } else {
      alert('UI 모듈이 제대로 로드되지 않았습니다.');
    }
  });
  
  addSafeEventListener('showTennisCourts', 'click', (e) => {
    e.preventDefault();
    console.log('테니스장 정보 버튼 클릭 (main.js)');
    if (App.UI && App.UI.modal) {
      App.UI.modal.open('courtInfoModal');
      if (App.UI.courts && typeof App.UI.courts.renderCourts === 'function') {
        App.UI.courts.renderCourts();
      }
    } else {
      alert('UI 모듈이 제대로 로드되지 않았습니다.');
    }
  });
  
  console.log('평택 테니스 커뮤니티 앱이 초기화되었습니다.');
}

// DOM이 로드된 후 앱 초기화
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded 이벤트 발생');
  initApp();
});

// 추가 안전장치: 이미 DOM이 로드된 경우
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  console.log('문서가 이미 로드되어 있음, 지연 초기화 예약');
  setTimeout(initApp, 1000); // 약간의 지연을 두고 초기화
}

console.log('main.js 로딩 완료');
