// ui-market.js - 마켓 관련 UI 모듈

// 마켓 관련 UI
App.UI.market = {
  // 상품 목록 표시
  renderMarketItems: async () => {
    try {
      const category = App.State.currentCategory;
      const items = await App.API.market.getItems(category);
      const marketItemsListElement = App.UI.elements.marketItemsList;
      
      if (!marketItemsListElement) return;
      
      if (items.length === 0) {
        marketItemsListElement.innerHTML = `
          <div class="py-12 text-center text-gray-400">
            <i class="fas fa-shopping-basket text-5xl mb-4"></i>
            <p>아직 등록된 상품이 없습니다.</p>
            <p class="text-sm">첫 상품을 등록해보세요!</p>
          </div>
        `;
        return;
      }
      
      // 최신순으로 정렬
      items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      // 카테고리 이름 매핑
      const categoryNames = {
        'racket': '라켓',
        'shoes': '신발',
        'apparel': '의류',
        'ball': '공',
        'etc': '기타'
      };
      
      // 상태 이름 매핑
      const conditionNames = {
        'new': '새 상품',
        'almost-new': '거의 새 것',
        'used': '중고',
        'old': '오래됨'
      };
      
      // 상품 목록 HTML 생성
      const itemsHTML = items.map(item => {
        const itemDate = new Date(item.createdAt);
        const now = new Date();
        const diffTime = Math.abs(now - itemDate);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        let timeText;
        if (diffDays === 0) {
          timeText = '오늘';
        } else if (diffDays === 1) {
          timeText = '어제';
        } else {
          timeText = `${diffDays}일 전`;
        }
        
        return `
          <div class="market-item bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer" data-item-id="${item.id}">
            <div class="relative pb-3/4 mb-3">
              <img 
                src="${item.imageUrl || 'https://via.placeholder.com/300x300?text=상품이미지'}" 
                alt="${item.title}" 
                class="absolute h-full w-full object-cover rounded-lg"
              >
            </div>
            <h3 class="text-lg font-medium text-gray-800 mb-1">${item.title}</h3>
            <p class="text-xl font-bold text-gray-900 mb-2">${item.price.toLocaleString()}원</p>
            <div class="flex justify-between items-center mb-2">
              <span class="text-sm px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                ${categoryNames[item.category] || item.category}
              </span>
              <span class="text-sm px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                ${conditionNames[item.condition] || item.condition}
              </span>
            </div>
            <div class="flex justify-between items-center text-sm text-gray-500">
              <span>${item.seller}</span>
              <span>${timeText}</span>
            </div>
          </div>
        `;
      }).join('');
      
      marketItemsListElement.innerHTML = itemsHTML;
      
      // 상품 아이템 클릭 이벤트 추가
      document.querySelectorAll('.market-item').forEach(item => {
        item.addEventListener('click', async () => {
          const itemId = item.dataset.itemId;
          
          try {
            const itemDetail = await App.API.market.getItemDetail(itemId);
            App.UI.market.renderItemDetail(itemDetail);
            App.UI.modal.open('marketItemDetailModal');
          } catch (error) {
            console.error('상품 상세 정보 조회 오류:', error);
            alert('상품 정보를 불러오는데 실패했습니다. 다시 시도해주세요.');
          }
        });
      });
      
    } catch (error) {
      console.error('마켓 아이템 렌더링 오류:', error);
      const marketItemsListElement = App.UI.elements.marketItemsList;
      
      if (marketItemsListElement) {
        marketItemsListElement.innerHTML = `
          <div class="text-center p-8 text-gray-500">
            <i class="fas fa-exclamation-circle text-yellow-500 text-3xl mb-2"></i>
            <p>상품 목록을 불러오는데 실패했습니다.</p>
            <button id="retryMarket" class="mt-3 px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600">
              다시 시도
            </button>
          </div>
        `;
        
        // 다시 시도 버튼에 이벤트 리스너 추가
        document.getElementById('retryMarket')?.addEventListener('click', () => {
          App.UI.market.renderMarketItems();
        });
      }
    }
  },
  
  // 상품 상세 정보 표시
  renderItemDetail: (item) => {
    const detailElement = App.UI.elements.marketItemDetail;
    const detailTitleElement = document.getElementById('detailItemTitle');
    
    if (detailTitleElement) {
      detailTitleElement.textContent = item.title;
    }
    
    // 카테고리 이름 매핑
    const categoryNames = {
      'racket': '라켓',
      'shoes': '신발',
      'apparel': '의류',
      'ball': '공',
      'etc': '기타'
    };
    
    // 상태 이름 매핑
    const conditionNames = {
      'new': '새 상품',
      'almost-new': '거의 새 것',
      'used': '중고',
      'old': '오래됨'
    };
    
    const itemDate = new Date(item.createdAt);
    const formattedDate = `${itemDate.getFullYear()}-${String(itemDate.getMonth() + 1).padStart(2, '0')}-${String(itemDate.getDate()).padStart(2, '0')} ${String(itemDate.getHours()).padStart(2, '0')}:${String(itemDate.getMinutes()).padStart(2, '0')}`;
    
    if (detailElement) {
      detailElement.innerHTML = `
        <div class="mb-6">
          <img 
            src="${item.imageUrl || 'https://via.placeholder.com/600x400?text=상품이미지'}" 
            alt="${item.title}" 
            class="w-full h-64 object-cover rounded-lg"
          >
        </div>
        <div class="mb-4">
          <div class="flex flex-wrap gap-2 mb-3">
            <span class="text-sm px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
              ${categoryNames[item.category] || item.category}
            </span>
            <span class="text-sm px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
              ${conditionNames[item.condition] || item.condition}
            </span>
          </div>
          <h2 class="text-2xl font-bold text-gray-800 mb-2">${item.title}</h2>
          <p class="text-3xl font-bold text-gray-900 mb-4">${item.price.toLocaleString()}원</p>
          <div class="bg-gray-50 p-4 rounded-lg mb-4">
            <p class="text-gray-700 whitespace-pre-line">${item.description}</p>
          </div>
        </div>
        <div class="border-t border-gray-200 pt-4">
          <div class="flex justify-between items-center mb-3">
            <div class="flex items-center">
              <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-500 mr-3">
                <i class="fas fa-user"></i>
              </div>
              <span class="font-medium">${item.seller}</span>
            </div>
            <span class="text-sm text-gray-500">${formattedDate}</span>
          </div>
          ${item.contact ? `
            <div class="bg-gray-50 p-3 rounded-lg mb-4">
              <p class="flex items-center text-gray-700">
                <i class="fas fa-phone text-green-500 mr-2"></i>
                연락처: ${item.contact}
              </p>
            </div>
          ` : ''}
          <div class="flex justify-end">
            <button id="chatWithSellerBtn" class="px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500">
              <i class="fas fa-comments mr-2"></i>
              판매자와 채팅하기
            </button>
          </div>
        </div>
      `;
      
      // 판매자와 채팅하기 버튼 이벤트 리스너 추가
      document.getElementById('chatWithSellerBtn')?.addEventListener('click', async () => {
        // 로그인 확인
        if (!App.State.currentUser) {
          alert('로그인 후 이용해주세요.');
          App.UI.modal.close('marketItemDetailModal');
          App.UI.modal.open('loginModal');
          return;
        }
        
        // 자기 자신이 판매자인 경우
        if (item.seller === App.State.currentUser.username) {
          alert('자신이 등록한 상품입니다.');
          return;
        }
        
        try {
          // 채팅방 생성
          const room = await App.API.chat.createRoom(item.seller);
          
          // 모달 전환
          App.UI.modal.close('marketItemDetailModal');
          
          // 채팅방 ID 저장
          App.State.setChatId(room.id);
          
          // 채팅방 열기
          App.UI.modal.open('chatRoomModal');
          
          // 채팅 메시지 로드
          App.UI.chat.renderChatMessages(room.id);
        } catch (error) {
          console.error('채팅방 생성 오류:', error);
          alert('채팅방 생성에 실패했습니다. 다시 시도해주세요.');
        }
      });
    }
  },
  
  // 카테고리 버튼 초기화
  initCategoryButtons: () => {
    const categoryButtons = App.UI.elements.marketCategoryButtons;
    
    if (categoryButtons) {
      categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
          const category = button.dataset.category;
          
          // 현재 카테고리 설정
          App.State.setCategory(category);
          
          // 버튼 활성화 스타일 변경
          categoryButtons.forEach(btn => {
            btn.classList.remove('bg-green-500', 'text-white');
            btn.classList.add('bg-gray-200', 'text-gray-700');
          });
          
          button.classList.remove('bg-gray-200', 'text-gray-700');
          button.classList.add('bg-green-500', 'text-white');
          
          // 상품 목록 갱신
          App.UI.market.renderMarketItems();
        });
      });
    }
  },
  
  // 상품 등록 버튼 초기화
  initNewItemButton: () => {
    const newMarketItemBtn = App.UI.elements.newMarketItemBtn;
    
    if (newMarketItemBtn) {
      newMarketItemBtn.addEventListener('click', () => {
        // 로그인 확인
        if (!App.State.currentUser) {
          alert('로그인 후 이용해주세요.');
          App.UI.modal.open('loginModal');
          return;
        }
        
        App.UI.modal.open('createMarketItemModal');
      });
    }
  },
  
  // 상품 등록 폼 초기화
  initCreateItemForm: () => {
    const createMarketItemForm = App.UI.elements.createMarketItemForm;
    
    if (createMarketItemForm) {
      createMarketItemForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // 로그인 확인
        if (!App.State.currentUser) {
          alert('로그인 후 이용해주세요.');
          App.UI.modal.close('createMarketItemModal');
          App.UI.modal.open('loginModal');
          return;
        }
        
        // 폼 데이터 수집
        const formData = {
          title: document.getElementById('itemTitle').value.trim(),
          description: document.getElementById('itemDescription').value.trim(),
          price: parseInt(document.getElementById('itemPrice').value),
          category: document.getElementById('itemCategory').value,
          condition: document.getElementById('itemCondition').value,
          imageUrl: document.getElementById('itemImageUrl').value.trim(),
          contact: document.getElementById('itemContact').value.trim()
        };
        
        // 필수 입력값 확인
        if (!formData.title || !formData.description || isNaN(formData.price)) {
          alert('필수 항목을 모두 입력해주세요.');
          return;
        }
        
        try {
          await App.API.market.createItem(formData);
          createMarketItemForm.reset();
          App.UI.modal.close('createMarketItemModal');
          alert('상품이 등록되었습니다.');
          
          // 상품 목록 갱신
          App.UI.market.renderMarketItems();
        } catch (error) {
          console.error('상품 등록 오류:', error);
          alert('상품 등록에 실패했습니다. 다시 시도해주세요.');
        }
      });
    }
  },
  
  init: () => {
    App.UI.market.initCategoryButtons();
    App.UI.market.initNewItemButton();
    App.UI.market.initCreateItemForm();
    App.UI.market.renderMarketItems();
  }
};
