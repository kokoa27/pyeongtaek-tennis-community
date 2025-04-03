// DOM 요소 가져오기
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const logoutBtn = document.getElementById('logoutBtn');
const newPostBtn = document.getElementById('newPostBtn');
const navButtons = document.getElementById('navButtons');
const userInfo = document.getElementById('userInfo');
const usernameSpan = document.getElementById('username');
const postsList = document.getElementById('postsList');
const showTennisCourtsBtn = document.getElementById('showTennisCourts');
const courtsList = document.getElementById('courtsList');

// 모달 요소
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const postModal = document.getElementById('postModal');
const courtInfoModal = document.getElementById('courtInfoModal');
const closeModalBtns = document.querySelectorAll('.closeModal');

// 폼 요소
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const postForm = document.getElementById('postForm');

// 현재 로그인한 사용자 정보
let currentUser = null;

// 페이지 로드 시 사용자 상태 확인
function checkAuthState() {
  const savedUser = localStorage.getItem('user');
  if (savedUser) {
    currentUser = JSON.parse(savedUser);
    updateAuthUI(true);
  } else {
    updateAuthUI(false);
  }
}

// 인증 UI 업데이트
function updateAuthUI(isLoggedIn) {
  if (isLoggedIn && currentUser) {
    navButtons.classList.add('hidden');
    userInfo.classList.remove('hidden');
    usernameSpan.textContent = currentUser.username;
    newPostBtn.classList.remove('hidden');
  } else {
    navButtons.classList.remove('hidden');
    userInfo.classList.add('hidden');
    newPostBtn.classList.add('hidden');
  }
}

// 날씨 정보 가져오기
async function fetchWeather() {
  try {
    const response = await axios.get('/api/weather');
    const weather = response.data;
    
    document.getElementById('location').textContent = weather.location;
    document.getElementById('temperature').textContent = `${weather.temperature}°C`;
    document.getElementById('condition').textContent = weather.condition;
    document.getElementById('humidity').textContent = `${weather.humidity}%`;
    document.getElementById('windSpeed').textContent = `${weather.windSpeed} m/s`;
    
    // 테니스 점수 정보 추가
    if(document.getElementById('tennisScore')) {
      // 점수에 따른 색상 설정
      let scoreColor = 'text-red-500';
      if(weather.tennisScore >= 80) scoreColor = 'text-green-500';
      else if(weather.tennisScore >= 60) scoreColor = 'text-green-400';
      else if(weather.tennisScore >= 40) scoreColor = 'text-yellow-500';
      else if(weather.tennisScore >= 20) scoreColor = 'text-orange-500';
      
      document.getElementById('tennisScore').innerHTML = `
        <div class="mt-4 p-3 bg-gray-50 rounded-lg">
          <div class="flex items-center justify-between mb-2">
            <span class="font-medium">테니스 지수:</span>
            <span class="${scoreColor} font-bold">${weather.tennisScore}점</span>
          </div>
          <p class="text-gray-700 text-sm">${weather.tennisMessage}</p>
        </div>
      `;
    }
    
    // 날씨 아이콘 설정
    const weatherIcon = document.getElementById('weatherIcon');
    let iconClass = 'fas fa-sun';
    
    switch(weather.condition) {
      case '맑음':
        iconClass = 'fas fa-sun';
        break;
      case '흐림':
        iconClass = 'fas fa-cloud';
        break;
      case '비':
        iconClass = 'fas fa-cloud-rain';
        break;
      case '구름조금':
        iconClass = 'fas fa-cloud-sun';
        break;
      default:
        iconClass = 'fas fa-sun';
    }
    
    weatherIcon.innerHTML = `<i class="${iconClass}"></i>`;
    
    // 날씨 예보 표시
    const forecastEl = document.getElementById('forecast');
    forecastEl.innerHTML = '';
    
    weather.forecast.forEach(day => {
      // 날씨 아이콘 설정
      let dayIconClass = 'fas fa-sun';
      
      switch(day.condition) {
        case '맑음':
          dayIconClass = 'fas fa-sun';
          break;
        case '흐림':
          dayIconClass = 'fas fa-cloud';
          break;
        case '비':
          dayIconClass = 'fas fa-cloud-rain';
          break;
        case '구름조금':
          dayIconClass = 'fas fa-cloud-sun';
          break;
        default:
          dayIconClass = 'fas fa-sun';
      }
      
      // 테니스 점수에 따른 색상
      let dayScoreColor = 'text-red-500';
      if(day.tennisScore >= 80) dayScoreColor = 'text-green-500';
      else if(day.tennisScore >= 60) dayScoreColor = 'text-green-400';
      else if(day.tennisScore >= 40) dayScoreColor = 'text-yellow-500';
      else if(day.tennisScore >= 20) dayScoreColor = 'text-orange-500';
      
      const dayEl = document.createElement('div');
      dayEl.className = 'text-center bg-gray-50 rounded-lg p-3 w-24';
      dayEl.innerHTML = `
        <p class="font-semibold text-gray-700 mb-2">${day.day}</p>
        <div class="text-2xl text-green-500 mb-2">
          <i class="${dayIconClass}"></i>
        </div>
        <p class="font-medium text-gray-800">${day.temp}°C</p>
        <p class="text-xs text-gray-500 mb-2">${day.condition}</p>
        <div class="text-center pt-2 border-t border-gray-200">
          <span class="${dayScoreColor} text-xs font-bold">테니스 ${day.tennisScore}점</span>
        </div>
      `;
      forecastEl.appendChild(dayEl);
    });
    
  } catch (error) {
    console.error('날씨 정보를 가져오는데 실패했습니다:', error);
  }
}

// 테니스장 정보 가져오기
async function fetchTennisCourts() {
  try {
    const response = await axios.get('/data/tennis_courts.json');
    const courts = response.data.courts;
    
    if (courts.length === 0) {
      courtsList.innerHTML = '<p class="text-gray-500 text-center py-8">테니스장 정보가 없습니다.</p>';
      return;
    }
    
    courtsList.innerHTML = '';
    courts.forEach(court => {
      const courtEl = document.createElement('div');
      courtEl.className = 'card bg-white p-6 border border-gray-100 hover:border-green-200 mb-6';
      
      // 테니스장 정보 HTML 생성
      courtEl.innerHTML = `
        <div class="flex flex-col md:flex-row justify-between">
          <div>
            <h3 class="text-xl font-bold mb-2 text-green-600">${court.name}</h3>
            <p class="text-gray-600 mb-1"><i class="fas fa-map-marker-alt text-red-500 mr-2"></i>${court.address}</p>
            <p class="text-gray-600 mb-1"><i class="fas fa-phone text-blue-500 mr-2"></i>${court.phone}</p>
            <p class="text-gray-600 mb-1"><i class="fas fa-clock text-yellow-500 mr-2"></i>운영시간: ${court.openHours}</p>
          </div>
          <div class="md:text-right mt-4 md:mt-0">
            <p class="text-gray-700 mb-1"><i class="fas fa-table-tennis text-green-500 mr-2"></i>코트 수: <span class="font-semibold">${court.courts}개</span></p>
            <p class="text-gray-700 mb-1"><i class="fas fa-layer-group text-purple-500 mr-2"></i>코트 유형: <span class="font-semibold">${court.surface}</span></p>
            <p class="text-gray-700 mb-1"><i class="fas fa-dollar-sign text-green-500 mr-2"></i>이용료: <span class="font-semibold">${court.fee}</span></p>
          </div>
        </div>
        <div class="mt-4 pt-4 border-t border-gray-100">
          <p class="text-gray-700 mb-2"><i class="fas fa-info-circle text-blue-500 mr-2"></i>예약 방법: ${court.reservation}</p>
          <p class="text-gray-700 mb-4"><i class="fas fa-umbrella-beach text-green-500 mr-2"></i>시설: ${court.facilities.join(', ')}</p>
          <p class="text-gray-600 italic bg-gray-50 p-3 rounded-lg">${court.description}</p>
        </div>
      `;
      
      courtsList.appendChild(courtEl);
    });
    
  } catch (error) {
    console.error('테니스장 정보를 가져오는데 실패했습니다:', error);
    courtsList.innerHTML = '<p class="text-red-500 text-center py-8">테니스장 정보를 불러오는 중 오류가 발생했습니다.</p>';
  }
}

// 게시글 가져오기
async function fetchPosts() {
  try {
    const response = await axios.get('/api/posts');
    const posts = response.data;
    
    if (posts.length === 0) {
      postsList.innerHTML = `
        <div class="py-12 text-center text-gray-400">
          <i class="fas fa-clipboard text-5xl mb-4"></i>
          <p>아직 게시글이 없습니다.</p>
          <p class="text-sm">첫 번째 게시글을 작성해보세요!</p>
        </div>
      `;
      return;
    }
    
    postsList.innerHTML = '';
    posts.forEach(post => {
      const postEl = document.createElement('div');
      postEl.className = 'post-item p-4 mb-3 rounded-lg hover:bg-gray-50';
      
      // 날짜 포맷팅
      const postDate = new Date(post.createdAt);
      const formattedDate = postDate.toLocaleDateString('ko-KR', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      
      postEl.innerHTML = `
        <h3 class="text-lg font-semibold mb-2">${post.title}</h3>
        <p class="text-gray-600 mb-3">${post.content}</p>
        <div class="flex justify-between items-center text-sm text-gray-500">
          <span class="flex items-center">
            <i class="fas fa-user-circle mr-2"></i>
            ${post.author}
          </span>
          <span class="flex items-center">
            <i class="far fa-clock mr-2"></i>
            ${formattedDate}
          </span>
        </div>
      `;
      postsList.appendChild(postEl);
    });
    
    // 게시글 있을 때 구분선 추가
    const separator = document.createElement('div');
    separator.className = 'border-t border-gray-200 my-6';
    
  } catch (error) {
    console.error('게시글을 가져오는데 실패했습니다:', error);
  }
}

// 모달 열기
function openModal(modal) {
  modal.classList.remove('hidden');
}

// 모달 닫기
function closeModal(modal) {
  modal.classList.add('hidden');
}

// 이벤트 리스너: 로그인 버튼
loginBtn.addEventListener('click', () => {
  openModal(loginModal);
});

// 이벤트 리스너: 회원가입 버튼
registerBtn.addEventListener('click', () => {
  openModal(registerModal);
});

// 이벤트 리스너: 로그아웃 버튼
logoutBtn.addEventListener('click', () => {
  currentUser = null;
  localStorage.removeItem('user');
  updateAuthUI(false);
});

// 이벤트 리스너: 글쓰기 버튼
newPostBtn.addEventListener('click', () => {
  if (!currentUser) {
    alert('로그인이 필요합니다.');
    return;
  }
  openModal(postModal);
});

// 이벤트 리스너: 테니스장 정보 버튼
showTennisCourtsBtn.addEventListener('click', (e) => {
  e.preventDefault();
  fetchTennisCourts();
  openModal(courtInfoModal);
});

// 모달 닫기 버튼들
closeModalBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    const modal = e.target.closest('div[id$="Modal"]');
    closeModal(modal);
  });
});

// 이벤트 리스너: 로그인 폼 제출
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;
  
  try {
    const response = await axios.post('/api/login', { username, password });
    if (response.data.success) {
      currentUser = response.data.user;
      localStorage.setItem('user', JSON.stringify(currentUser));
      updateAuthUI(true);
      closeModal(loginModal);
      loginForm.reset();
    }
  } catch (error) {
    alert('로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.');
    console.error('로그인 오류:', error);
  }
});

// 이벤트 리스너: 회원가입 폼 제출
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const username = document.getElementById('registerUsername').value;
  const password = document.getElementById('registerPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  
  if (password !== confirmPassword) {
    alert('비밀번호가 일치하지 않습니다.');
    return;
  }
  
  try {
    const response = await axios.post('/api/register', { username, password });
    if (response.data.success) {
      alert('회원가입이 완료되었습니다. 로그인해주세요.');
      closeModal(registerModal);
      registerForm.reset();
      openModal(loginModal);
    }
  } catch (error) {
    alert('회원가입에 실패했습니다. 다른 아이디를 사용해주세요.');
    console.error('회원가입 오류:', error);
  }
});

// 이벤트 리스너: 글쓰기 폼 제출
postForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  if (!currentUser) {
    alert('로그인이 필요합니다.');
    return;
  }
  
  const title = document.getElementById('postTitle').value;
  const content = document.getElementById('postContent').value;
  
  try {
    await axios.post('/api/posts', {
      title,
      content,
      author: currentUser.username
    });
    
    closeModal(postModal);
    postForm.reset();
    fetchPosts(); // 게시글 목록 새로고침
  } catch (error) {
    alert('게시글 작성에 실패했습니다.');
    console.error('게시글 작성 오류:', error);
  }
});

// 초기화 함수
function init() {
  checkAuthState();
  fetchWeather();
  fetchPosts();
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', init);
