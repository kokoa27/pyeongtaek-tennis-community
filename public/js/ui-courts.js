// ui-courts.js - 테니스장 정보 관련 UI 모듈
console.log('ui-courts.js 로딩 시작');

// 테니스장 정보 관련 UI
App.UI.courts = {
  // 테니스장 목록 표시
  renderCourts: async () => {
    console.log('테니스장 정보 렌더링 시작');
    try {
      console.log('테니스장 데이터 요청');
      let courts = [];
      
      try {
        courts = await App.API.courts.getAll();
        console.log('테니스장 데이터 로드 성공:', courts);
      } catch (apiError) {
        console.error('API에서 테니스장 데이터 로드 실패:', apiError);
        // API 실패 시 하드코딩된 데이터 사용
        courts = [
          {
            name: '평택시립테니스장',
            location: '평택시 중앙로 123',
            courts: 6,
            surface: '하드코트',
            indoorOutdoor: '야외',
            price: '무료',
            image: 'https://via.placeholder.com/300x200?text=평택시립테니스장',
            contact: '031-123-4567',
            openHours: '06:00 - 22:00'
          },
          {
            name: '송탄국제테니스장',
            location: '평택시 송탄로 456',
            courts: 4,
            surface: '클레이코트',
            indoorOutdoor: '실내/실외',
            price: '시간당 10,000원~',
            image: 'https://via.placeholder.com/300x200?text=송탄국제테니스장',
            contact: '031-234-5678',
            openHours: '08:00 - 23:00'
          },
          {
            name: '안중테니스구장',
            location: '평택시 안중읍 안중로 789',
            courts: 2,
            surface: '하드코트',
            indoorOutdoor: '야외',
            price: '무료',
            image: 'https://via.placeholder.com/300x200?text=안중테니스구장',
            contact: '031-345-6789',
            openHours: '06:00 - 20:00'
          }
        ];
        console.log('하드코딩된 테니스장 데이터 사용:', courts);
      }
      
      const courtsListElement = document.getElementById('courtsList');
      console.log('테니스장 목록 표시 요소:', courtsListElement);
      
      if (!courtsListElement) {
        console.error('테니스장 목록을 표시할 요소(#courtsList)를 찾을 수 없음');
        return;
      }
      
      if (courts.length === 0) {
        console.log('테니스장 데이터가 없음, 안내 메시지 표시');
        courtsListElement.innerHTML = `
          <div class="py-12 text-center text-gray-400">
            <i class="fas fa-map-marker-alt text-5xl mb-4"></i>
            <p>테니스장 정보가 없습니다.</p>
          </div>
        `;
        return;
      }
      
      // 테니스장 목록 HTML 생성
      console.log('테니스장 HTML 생성');
      const courtsHTML = courts.map(court => {
        return `
          <div class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div class="md:flex">
              <div class="md:w-1/3 mb-4 md:mb-0">
                <img src="${court.image}" alt="${court.name}" class="w-full h-48 object-cover rounded-lg">
              </div>
              <div class="md:w-2/3 md:pl-6">
                <h3 class="text-xl font-bold text-gray-800">${court.name}</h3>
                <div class="mt-2 space-y-2">
                  <div class="flex">
                    <i class="fas fa-map-marker-alt text-red-500 mr-2 mt-1"></i>
                    <p class="text-gray-700">${court.location}</p>
                  </div>
                  <div class="flex">
                    <i class="fas fa-tennis-ball text-green-500 mr-2 mt-1"></i>
                    <p class="text-gray-700">코트 수: ${court.courts}</p>
                  </div>
                  <div class="flex">
                    <i class="fas fa-layer-group text-blue-500 mr-2 mt-1"></i>
                    <p class="text-gray-700">코트 종류: ${court.surface}</p>
                  </div>
                  <div class="flex">
                    <i class="fas fa-home text-purple-500 mr-2 mt-1"></i>
                    <p class="text-gray-700">실내/실외: ${court.indoorOutdoor}</p>
                  </div>
                  <div class="flex">
                    <i class="fas fa-dollar-sign text-yellow-500 mr-2 mt-1"></i>
                    <p class="text-gray-700">이용 요금: ${court.price}</p>
                  </div>
                  <div class="flex">
                    <i class="fas fa-clock text-gray-500 mr-2 mt-1"></i>
                    <p class="text-gray-700">운영 시간: ${court.openHours}</p>
                  </div>
                  <div class="flex">
                    <i class="fas fa-phone text-teal-500 mr-2 mt-1"></i>
                    <p class="text-gray-700">연락처: ${court.contact}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
      }).join('');
      
      courtsListElement.innerHTML = courtsHTML;
      console.log('테니스장 HTML 렌더링 완료');
      
    } catch (error) {
      console.error('테니스장 정보 렌더링 오류:', error);
      const courtsListElement = document.getElementById('courtsList');
      
      if (courtsListElement) {
        courtsListElement.innerHTML = `
          <div class="text-center p-8 text-gray-500">
            <i class="fas fa-exclamation-circle text-yellow-500 text-3xl mb-2"></i>
            <p>테니스장 정보를 불러오는데 실패했습니다.</p>
            <button id="retryCourts" class="mt-3 px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600">
              다시 시도
            </button>
          </div>
        `;
        
        // 다시 시도 버튼에 이벤트 리스너 추가
        document.getElementById('retryCourts')?.addEventListener('click', () => {
          App.UI.courts.renderCourts();
        });
      } else {
        console.error('테니스장 목록을 표시할 요소(#courtsList)를 찾을 수 없음');
      }
    }
  },
  
  // 테니스장 정보 버튼 초기화
  initCourtButton: () => {
    console.log('테니스장 정보 버튼 초기화');
    const showTennisCourtsBtn = document.getElementById('showTennisCourts');
    
    if (showTennisCourtsBtn) {
      console.log('테니스장 정보 버튼 발견, 이벤트 리스너 추가');
      showTennisCourtsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('테니스장 정보 버튼 클릭됨');
        
        // 모달 열기
        if (App.UI.modal) {
          App.UI.modal.open('courtInfoModal');
          // 테니스장 정보 표시
          App.UI.courts.renderCourts();
        } else {
          console.error('UI.modal이 정의되지 않음');
        }
      });
    } else {
      console.error('테니스장 정보 버튼(#showTennisCourts)을 찾을 수 없음');
    }
  },
  
  init: () => {
    console.log('테니스장 UI 초기화');
    App.UI.courts.initCourtButton();
  }
};

console.log('ui-courts.js 로딩 완료');
