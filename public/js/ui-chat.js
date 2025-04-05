// ui-chat.js - 채팅 관련 UI 모듈

// 채팅 관련 UI
App.UI.chat = {
  // 채팅방 목록 표시
  renderChatRooms: async () => {
    try {
      const rooms = await App.API.chat.getRooms();
      const chatListElement = App.UI.elements.chatList;
      
      if (rooms.length === 0) {
        chatListElement.innerHTML = `
          <div class="py-12 text-center text-gray-400">
            <i class="fas fa-comments text-5xl mb-4"></i>
            <p>아직 채팅방이 없습니다.</p>
            <p class="text-sm">다른 사용자와 대화를 시작해보세요!</p>
          </div>
        `;
        return;
      }
      
      // 채팅방 목록 HTML 생성
      const roomsHTML = rooms.map(room => {
        // 상대방 이름 찾기 (내가 아닌 사용자)
        const otherUser = room.users.find(user => user !== App.State.currentUser?.username) || '알 수 없음';
        const lastMessageTime = room.lastMessage ? new Date(room.lastMessage.timestamp) : new Date(room.createdAt);
        
        // 시간 포맷팅
        const now = new Date();
        const today = now.toDateString();
        const messageDate = lastMessageTime.toDateString();
        
        let timeText;
        if (today === messageDate) {
          // 오늘이면 시간만 표시
          timeText = `${lastMessageTime.getHours().toString().padStart(2, '0')}:${lastMessageTime.getMinutes().toString().padStart(2, '0')}`;
        } else {
          // 다른 날짜면 날짜 표시
          timeText = `${lastMessageTime.getMonth() + 1}/${lastMessageTime.getDate()}`;
        }
        
        return `
          <div class="chat-room-item bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer" data-room-id="${room.id}">
            <div class="flex justify-between items-center">
              <div class="flex items-center">
                <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-500 mr-3">
                  <i class="fas fa-user"></i>
                </div>
                <div>
                  <h3 class="font-medium text-gray-800">${otherUser}</h3>
                  <p class="text-sm text-gray-500 truncate max-w-xs">
                    ${room.lastMessage ? room.lastMessage.content : '새로운 대화를 시작하세요'}
                  </p>
                </div>
              </div>
              <div class="text-xs text-gray-400">${timeText}</div>
            </div>
          </div>
        `;
      }).join('');
      
      chatListElement.innerHTML = roomsHTML;
      
      // 채팅방 아이템 클릭 이벤트 추가
      document.querySelectorAll('.chat-room-item').forEach(item => {
        item.addEventListener('click', () => {
          const roomId = item.dataset.roomId;
          
          // 채팅방 ID 저장
          App.State.setChatId(roomId);
          
          // 채팅방 모달 열기
          App.UI.modal.close('chatListModal');
          App.UI.modal.open('chatRoomModal');
          
          // 채팅 메시지 로드
          App.UI.chat.renderChatMessages(roomId);
        });
      });
      
    } catch (error) {
      console.error('채팅방 목록 렌더링 오류:', error);
      App.UI.elements.chatList.innerHTML = `
        <div class="text-center p-8 text-gray-500">
          <i class="fas fa-exclamation-circle text-yellow-500 text-3xl mb-2"></i>
          <p>채팅방 목록을 불러오는데 실패했습니다.</p>
          <button id="retryChat" class="mt-3 px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600">
            다시 시도
          </button>
        </div>
      `;
      
      // 다시 시도 버튼에 이벤트 리스너 추가
      document.getElementById('retryChat')?.addEventListener('click', () => {
        App.UI.chat.renderChatRooms();
      });
    }
  },
  
  // 채팅 메시지 표시
  renderChatMessages: async (roomId) => {
    try {
      const messages = await App.API.chat.getMessages(roomId);
      const chatMessagesElement = App.UI.elements.chatMessages;
      const room = (await App.API.chat.getRooms()).find(r => r.id === roomId);
      
      // 채팅방 제목 (상대방 이름) 설정
      if (room) {
        const otherUser = room.users.find(user => user !== App.State.currentUser?.username) || '알 수 없음';
        document.getElementById('chatRoomTitle').textContent = otherUser;
      }
      
      if (messages.length === 0) {
        chatMessagesElement.innerHTML = `
          <div class="text-center p-8 text-gray-400">
            <p>아직 메시지가 없습니다.</p>
            <p class="text-sm">첫 메시지를 보내보세요!</p>
          </div>
        `;
        return;
      }
      
      // 날짜별로 메시지 그룹화 준비
      let currentDate = null;
      
      // 메시지 HTML 생성
      const messagesHTML = messages.map(message => {
        const messageTime = new Date(message.timestamp);
        const messageDate = messageTime.toDateString();
        
        // 날짜가 바뀌면 날짜 구분선 추가
        let dateHeader = '';
        if (currentDate !== messageDate) {
          currentDate = messageDate;
          
          // 날짜 포맷팅
          const options = { year: 'numeric', month: 'long', day: 'numeric' };
          const formattedDate = messageTime.toLocaleDateString('ko-KR', options);
          
          dateHeader = `
            <div class="flex items-center my-4">
              <div class="flex-grow border-t border-gray-300"></div>
              <div class="mx-4 text-sm text-gray-500">${formattedDate}</div>
              <div class="flex-grow border-t border-gray-300"></div>
            </div>
          `;
        }
        
        const isMyMessage = message.sender === App.State.currentUser?.username;
        const timeString = `${messageTime.getHours().toString().padStart(2, '0')}:${messageTime.getMinutes().toString().padStart(2, '0')}`;
        
        // 메시지 아이템 HTML
        const messageHTML = `
          <div class="flex ${isMyMessage ? 'justify-end' : 'justify-start'} mb-4">
            ${!isMyMessage ? `
              <div class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-500 mr-2 mt-1">
                <i class="fas fa-user"></i>
              </div>
            ` : ''}
            <div class="max-w-xs">
              ${!isMyMessage ? `
                <div class="text-sm text-gray-500 mb-1">${message.sender}</div>
              ` : ''}
              <div class="flex items-end">
                ${!isMyMessage ? '' : `
                  <div class="text-xs text-gray-400 mr-2 mb-1">${timeString}</div>
                `}
                <div class="${isMyMessage ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-800'} rounded-lg py-2 px-3">
                  ${message.content}
                </div>
                ${!isMyMessage ? `
                  <div class="text-xs text-gray-400 ml-2 mb-1">${timeString}</div>
                ` : ''}
              </div>
            </div>
          </div>
        `;
        
        return dateHeader + messageHTML;
      }).join('');
      
      chatMessagesElement.innerHTML = messagesHTML;
      
      // 스크롤을 최하단으로 이동
      chatMessagesElement.scrollTop = chatMessagesElement.scrollHeight;
      
    } catch (error) {
      console.error('채팅 메시지 렌더링 오류:', error);
      App.UI.elements.chatMessages.innerHTML = `
        <div class="text-center p-8 text-gray-500">
          <i class="fas fa-exclamation-circle text-yellow-500 text-3xl mb-2"></i>
          <p>채팅 메시지를 불러오는데 실패했습니다.</p>
          <button id="retryChatMessages" class="mt-3 px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600">
            다시 시도
          </button>
        </div>
      `;
      
      // 다시 시도 버튼에 이벤트 리스너 추가
      document.getElementById('retryChatMessages')?.addEventListener('click', () => {
        App.UI.chat.renderChatMessages(App.State.currentChatId);
      });
    }
  },
  
  // 메시지 전송 폼 초기화
  initSendMessageForm: () => {
    const sendMessageForm = App.UI.elements.sendMessageForm;
    
    if (sendMessageForm) {
      sendMessageForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const messageInput = document.getElementById('messageContent');
        const content = messageInput.value.trim();
        const currentChatId = App.State.currentChatId;
        
        if (!content || !currentChatId) {
          return;
        }
        
        try {
          await App.API.chat.sendMessage(currentChatId, content);
          messageInput.value = '';
          
          // 채팅 메시지 새로고침
          App.UI.chat.renderChatMessages(currentChatId);
        } catch (error) {
          console.error('메시지 전송 오류:', error);
          alert('메시지 전송에 실패했습니다. 다시 시도해주세요.');
        }
      });
    }
  },
  
  init: () => {
    App.UI.chat.initSendMessageForm();
  }
};
