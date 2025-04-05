// ui-courts.js - 테니스장 정보 관련 UI 모듈

// 테니스장 정보 관련 UI
App.UI.courts = {
  // 테니스장 목록 표시
  renderCourts: async () => {
    try {
      const courts = await App.API.courts.getAll();
      const courtsListElement = App.UI.elements.courtsList;
      
      if (courts.length === 0) {
        courtsListElement.innerHTML = `
          <div class="py-12 text-center text-gray-400">
            <i class="fas fa-map-marker-alt text-5xl mb-4"></i>
            <p>테니스장 정보가 없습니다.</p>
          </div>
        `;
        return;
      }
      
      // 테니스장 목록 HTML 생성
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
      
    } catch (error) {
      console.error('테니스장 정보 렌더링 오류:', error);
      App.UI.elements.courtsList.innerHTML = `
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
    }
  },
  
  // 테니스장 정보 버튼 초기화
  initCourtButton: () => {
    const showTennisCourtsBtn = App.UI.elements.showTennisCourts;
    
    if (showTennisCourtsBtn) {
      showTennisCourtsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // 모달 열기
        App.UI.modal.open('courtInfoModal');
        
        // 테니스장 정보 표시
        App.UI.courts.renderCourts();
      });
    }
  },
  
  init: () => {
    App.UI.courts.initCourtButton();
  }
};
