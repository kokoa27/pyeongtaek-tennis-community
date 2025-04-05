// ui-auth.js - 인증 관련 UI 모듈

// 인증 관련 UI
App.UI.auth = {
  // 로그인 상태에 따른 UI 업데이트
  updateUI: (isLoggedIn) => {
    const navButtons = App.UI.elements.navButtons;
    const userInfo = App.UI.elements.userInfo;
    const usernameSpan = App.UI.elements.username;
    
    if (isLoggedIn && App.State.currentUser) {
      navButtons.classList.add('hidden');
      userInfo.classList.remove('hidden');
      usernameSpan.textContent = App.State.currentUser.username;
    } else {
      navButtons.classList.remove('hidden');
      userInfo.classList.add('hidden');
      usernameSpan.textContent = '';
    }
  },
  
  // 로그인 폼 초기화
  initLoginForm: () => {
    const loginForm = App.UI.elements.loginForm;
    if (!loginForm) return;
    
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('loginUsername').value.trim();
      const password = document.getElementById('loginPassword').value;
      
      try {
        const data = await App.API.auth.login(username, password);
        if (data.success) {
          App.State.setUser(data.user);
          App.UI.modal.close('loginModal');
          loginForm.reset();
        } else {
          alert(data.message || '로그인에 실패했습니다.');
        }
      } catch (error) {
        console.error('로그인 오류:', error);
        alert('로그인에 실패했습니다. 다시 시도해주세요.');
      }
    });
  },
  
  // 회원가입 폼 초기화
  initRegisterForm: () => {
    const registerForm = App.UI.elements.registerForm;
    if (!registerForm) return;
    
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('registerUsername').value.trim();
      const password = document.getElementById('registerPassword').value;
      const confirmPassword = document.getElementById('confirmPassword').value;
      
      if (password !== confirmPassword) {
        alert('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
        return;
      }
      
      try {
        const data = await App.API.auth.register(username, password);
        if (data.success) {
          App.State.setUser(data.user);
          App.UI.modal.close('registerModal');
          registerForm.reset();
          alert('회원가입이 완료되었습니다.');
        } else {
          alert(data.message || '회원가입에 실패했습니다.');
        }
      } catch (error) {
        console.error('회원가입 오류:', error);
        alert('회원가입에 실패했습니다. 다시 시도해주세요.');
      }
    });
  },
  
  // 로그아웃 버튼 초기화
  initLogoutButton: () => {
    const logoutBtn = App.UI.elements.logoutBtn;
    if (!logoutBtn) return;
    
    logoutBtn.addEventListener('click', () => {
      App.State.clearUser();
    });
  },
  
  // 인증 버튼 초기화
  initAuthButtons: () => {
    const loginBtn = App.UI.elements.loginBtn;
    const registerBtn = App.UI.elements.registerBtn;
    
    if (loginBtn) {
      loginBtn.addEventListener('click', () => {
        App.UI.modal.open('loginModal');
      });
    }
    
    if (registerBtn) {
      registerBtn.addEventListener('click', () => {
        App.UI.modal.open('registerModal');
      });
    }
  },
  
  init: () => {
    App.UI.auth.initLoginForm();
    App.UI.auth.initRegisterForm();
    App.UI.auth.initLogoutButton();
    App.UI.auth.initAuthButtons();
  }
};
