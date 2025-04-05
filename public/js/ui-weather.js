// ui-weather.js - 날씨 관련 UI 모듈

// 날씨 위젯 관련 UI
App.UI.weather = {
  // 날씨 아이콘 설정
  setWeatherIcon: (condition) => {
    const iconElement = App.UI.elements.weatherIcon;
    let iconClass = 'fas fa-sun';
    
    if (condition.includes('비') || condition.includes('rain') || condition.includes('소나기')) {
      iconClass = 'fas fa-cloud-rain';
    } else if (condition.includes('구름') || condition.includes('흐림')) {
      iconClass = 'fas fa-cloud';
    } else if (condition.includes('눈')) {
      iconClass = 'fas fa-snowflake';
    }
    
    iconElement.innerHTML = `<i class="${iconClass}"></i>`;
  },
  
  // 날씨 정보 표시
  renderWeatherData: async () => {
    try {
      const weatherData = await App.API.weather.getData();
      
      // 기본 날씨 정보 표시
      App.UI.elements.location.textContent = weatherData.location;
      App.UI.elements.temperature.textContent = `${weatherData.temperature}°C`;
      App.UI.elements.condition.textContent = weatherData.condition;
      App.UI.elements.humidity.textContent = `${weatherData.humidity}%`;
      App.UI.elements.windSpeed.textContent = `${weatherData.windSpeed}m/s`;
      
      // 날씨 아이콘 설정
      App.UI.weather.setWeatherIcon(weatherData.condition);
      
      // 테니스 점수 표시
      App.UI.elements.tennisScore.innerHTML = `
        <div class="flex items-center">
          <i class="fas fa-tennis-ball text-green-500 mr-2"></i>
          <div>
            <div class="w-full bg-gray-200 rounded-full h-2.5 mb-1">
              <div class="bg-green-500 h-2.5 rounded-full" style="width: ${weatherData.tennisScore}%"></div>
            </div>
            <p class="text-sm">${weatherData.tennisMessage}</p>
          </div>
        </div>
      `;
      
      // 일일 예보 표시
      const forecastHTML = weatherData.forecast.map(day => {
        // 날씨 아이콘 결정
        let dayIconClass = 'fas fa-sun';
        if (day.condition.includes('비') || day.condition.includes('rain') || day.condition.includes('소나기')) {
          dayIconClass = 'fas fa-cloud-rain';
        } else if (day.condition.includes('구름') || day.condition.includes('흐림')) {
          dayIconClass = 'fas fa-cloud';
        } else if (day.condition.includes('눈')) {
          dayIconClass = 'fas fa-snowflake';
        }
        
        return `
          <div class="bg-white p-3 rounded-lg shadow-sm text-center">
            <p class="font-medium text-gray-800">${day.day}</p>
            <i class="${dayIconClass} text-2xl my-2 ${day.condition.includes('맑음') ? 'text-yellow-500' : 'text-gray-500'}"></i>
            <p class="text-lg font-bold">${day.temp}°C</p>
            <p class="text-sm text-gray-600">${day.condition}</p>
            <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div class="bg-green-500 h-2 rounded-full" style="width: ${day.tennisScore}%"></div>
            </div>
          </div>
        `;
      }).join('');
      
      App.UI.elements.forecast.innerHTML = forecastHTML;
      
    } catch (error) {
      console.error('날씨 정보 렌더링 오류:', error);
      App.UI.elements.weatherWidget.innerHTML = `
        <div class="text-center p-4">
          <i class="fas fa-exclamation-circle text-yellow-500 text-4xl mb-2"></i>
          <p>날씨 정보를 불러오는데 실패했습니다.</p>
          <button id="retryWeather" class="mt-2 px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600">
            다시 시도
          </button>
        </div>
      `;
      
      // 다시 시도 버튼에 이벤트 리스너 추가
      document.getElementById('retryWeather')?.addEventListener('click', () => {
        App.UI.weather.renderWeatherData();
      });
    }
  },
  
  init: () => {
    // 페이지 로드 시 날씨 정보 표시
    App.UI.weather.renderWeatherData();
    
    // 날씨 정보 주기적 업데이트 (30분마다)
    setInterval(() => {
      App.UI.weather.renderWeatherData();
    }, 30 * 60 * 1000);
  }
};
