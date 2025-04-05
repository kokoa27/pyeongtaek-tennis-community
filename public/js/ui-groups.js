// ui-groups.js - 소모임 관련 UI 모듈

// 소모임 관련 UI
App.UI.groups = {
  // 소모임 목록 표시
  renderGroups: async () => {
    try {
      const groups = await App.API.groups.getAll();
      const groupsListElement = App.UI.elements.groupsList;
      
      if (groups.length === 0) {
        groupsListElement.innerHTML = `
          <div class="py-12 text-center text-gray-400">
            <i class="fas fa-users text-5xl mb-4"></i>
            <p>아직 소모임이 없습니다.</p>
            <p class="text-sm">첫 번째 소모임을 만들어보세요!</p>
          </div>
        `;
        return;
      }
      
      // 최신순으로 정렬
      groups.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      // 소모임 목록 HTML 생성
      const groupsHTML = groups.map(group => {
        const groupDate = new Date(group.date);
        const formattedDate = `${groupDate.getFullYear()}-${String(groupDate.getMonth() + 1).padStart(2, '0')}-${String(groupDate.getDate()).padStart(2, '0')} ${String(groupDate.getHours()).padStart(2, '0')}:${String(groupDate.getMinutes()).padStart(2, '0')}`;
        
        // 인원 수 계산
        const memberCount = group.members ? group.members.length : 1;
        const maxMembers = group.maxMembers || '제한 없음';
        const isFull = group.maxMembers && memberCount >= group.maxMembers;
        
        return `
          <div class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div class="flex justify-between items-start">
              <h3 class="text-xl font-bold text-gray-800">${group.title}</h3>
              <span class="px-3 py-1 text-sm rounded-full ${isFull ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}">
                ${isFull ? '모집 완료' : '모집 중'} (${memberCount}/${maxMembers})
              </span>
            </div>
            <p class="mt-2 text-gray-600">${group.description}</p>
            <div class="mt-4 grid grid-cols-2 gap-3">
              <div class="flex items-center">
                <i class="fas fa-map-marker-alt text-red-500 mr-2"></i>
                <span class="text-gray-700">${group.location}</span>
              </div>
              <div class="flex items-center">
                <i class="fas fa-calendar text-blue-500 mr-2"></i>
                <span class="text-gray-700">${formattedDate}</span>
              </div>
              <div class="flex items-center">
                <i class="fas fa-signal text-green-500 mr-2"></i>
                <span class="text-gray-700">레벨: ${group.level}</span>
              </div>
              <div class="flex items-center">
                <i class="fas fa-user text-purple-500 mr-2"></i>
                <span class="text-gray-700">주최자: ${group.createdBy}</span>
              </div>
            </div>
            ${group.contact ? `
              <div class="mt-3 flex items-center">
                <i class="fas fa-phone text-teal-500 mr-2"></i>
                <span class="text-gray-700">연락처: ${group.contact}</span>
              </div>
            ` : ''}
            <div class="mt-4 flex justify-end">
              <button 
                class="group-join-btn px-4 py-2 rounded-full ${isFull ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-green-500 text-white hover:bg-green-600'}" 
                data-group-id="${group.id}"
                ${isFull ? 'disabled' : ''}
              >
                ${isFull ? '모집 완료' : '참여하기'}
              </button>
            </div>
          </div>
        `;
      }).join('');
      
      groupsListElement.innerHTML = groupsHTML;
      
      // 참여하기 버튼에 이벤트 리스너 추가
      document.querySelectorAll('.group-join-btn').forEach(button => {
        if (!button.disabled) {
          button.addEventListener('click', async (e) => {
            const groupId = e.target.dataset.groupId;
            
            // 로그인 확인
            if (!App.State.currentUser) {
              alert('로그인 후 이용해주세요.');
              App.UI.modal.close('groupsModal');
              App.UI.modal.open('loginModal');
              return;
            }
            
            try {
              await App.API.groups.join(groupId);
              alert('소모임에 참여했습니다.');
              App.UI.groups.renderGroups(); // 소모임 목록 업데이트
            } catch (error) {
              console.error('소모임 참여 오류:', error);
              alert('소모임 참여에 실패했습니다. 다시 시도해주세요.');
            }
          });
        }
      });
      
    } catch (error) {
      console.error('소모임 목록 렌더링 오류:', error);
      App.UI.elements.groupsList.innerHTML = `
        <div class="text-center p-8 text-gray-500">
          <i class="fas fa-exclamation-circle text-yellow-500 text-3xl mb-2"></i>
          <p>소모임 목록을 불러오는데 실패했습니다.</p>
          <button id="retryGroups" class="mt-3 px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600">
            다시 시도
          </button>
        </div>
      `;
      
      // 다시 시도 버튼에 이벤트 리스너 추가
      document.getElementById('retryGroups')?.addEventListener('click', () => {
        App.UI.groups.renderGroups();
      });
    }
  },
  
  // 소모임 버튼 초기화
  initGroupButtons: () => {
    const showGroupsBtn = App.UI.elements.showGroupsBtn;
    const newGroupBtn = App.UI.elements.newGroupBtn;
    
    if (showGroupsBtn) {
      showGroupsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // 모달 열기
        App.UI.modal.open('groupsModal');
        
        // 소모임 목록 표시
        App.UI.groups.renderGroups();
      });
    }
    
    if (newGroupBtn) {
      newGroupBtn.addEventListener('click', () => {
        // 로그인 확인
        if (!App.State.currentUser) {
          alert('로그인 후 이용해주세요.');
          App.UI.modal.close('groupsModal');
          App.UI.modal.open('loginModal');
          return;
        }
        
        App.UI.modal.close('groupsModal');
        App.UI.modal.open('createGroupModal');
      });
    }
  },
  
  // 소모임 생성 폼 초기화
  initCreateGroupForm: () => {
    const createGroupForm = App.UI.elements.createGroupForm;
    
    if (createGroupForm) {
      createGroupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // 로그인 확인
        if (!App.State.currentUser) {
          alert('로그인 후 이용해주세요.');
          App.UI.modal.close('createGroupModal');
          App.UI.modal.open('loginModal');
          return;
        }
        
        // 폼 데이터 수집
        const formData = {
          title: document.getElementById('groupTitle').value.trim(),
          description: document.getElementById('groupDescription').value.trim(),
          location: document.getElementById('groupLocation').value.trim(),
          date: document.getElementById('groupDate').value,
          level: document.getElementById('groupLevel').value,
          maxMembers: parseInt(document.getElementById('groupMaxMembers').value) || 0,
          contact: document.getElementById('groupContact').value.trim()
        };
        
        // 필수 입력값 확인
        if (!formData.title || !formData.description || !formData.location || !formData.date) {
          alert('필수 항목을 모두 입력해주세요.');
          return;
        }
        
        try {
          await App.API.groups.create(formData);
          createGroupForm.reset();
          App.UI.modal.close('createGroupModal');
          alert('소모임이 생성되었습니다.');
          
          // 소모임 목록 모달 열기 및 목록 새로고침
          App.UI.modal.open('groupsModal');
          App.UI.groups.renderGroups();
        } catch (error) {
          console.error('소모임 생성 오류:', error);
          alert('소모임 생성에 실패했습니다. 다시 시도해주세요.');
        }
      });
    }
  },
  
  init: () => {
    App.UI.groups.initGroupButtons();
    App.UI.groups.initCreateGroupForm();
  }
};
