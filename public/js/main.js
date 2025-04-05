// main.js - 메인 애플리케이션 진입점

// 앱 초기화 함수
function initApp() {
  // 전역 App 객체 확인
  if (!window.App) {
    console.error('App 객체가 정의되지 않았습니다.');
    return;
  }
  
  // 상태 초기화
  if (App.State && typeof App.State.init === 'function') {
    App.State.init();
  }
  
  // UI 초기화 
  if (App.UI && typeof App.UI.init === 'function') {
    App.UI.init();
  }
  
  console.log('평택 테니스 커뮤니티 앱이 초기화되었습니다.');
}

// DOM이 로드된 후 앱 초기화
document.addEventListener('DOMContentLoaded', initApp);
