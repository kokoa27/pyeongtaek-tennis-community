// api.js - 백엔드 API 통신 관련 모듈

// API 모듈
App.API = {
  // 인증 관련 API
  auth: {
    login: async (username, password) => {
      try {
        const response = await axios.post('/api/auth', { 
          action: 'login', 
          username, 
          password 
        });
        return response.data;
      } catch (error) {
        console.error('로그인 오류:', error);
        throw error;
      }
    },
    
    register: async (username, password) => {
      try {
        const response = await axios.post('/api/auth', { 
          action: 'register', 
          username, 
          password 
        });
        return response.data;
      } catch (error) {
        console.error('회원가입 오류:', error);
        throw error;
      }
    }
  },
  
  // 게시글 관련 API
  posts: {
    getAll: async () => {
      try {
        const response = await axios.get('/api/posts');
        return response.data;
      } catch (error) {
        console.error('게시글 목록 조회 오류:', error);
        throw error;
      }
    },
    
    create: async (title, content) => {
      try {
        const response = await axios.post('/api/posts', {
          title,
          content,
          author: App.State.currentUser ? App.State.currentUser.username : '익명'
        });
        return response.data;
      } catch (error) {
        console.error('게시글 작성 오류:', error);
        throw error;
      }
    }
  },
  
  // 날씨 관련 API
  weather: {
    getData: async () => {
      try {
        const response = await axios.get('/api/weather');
        return response.data;
      } catch (error) {
        console.error('날씨 정보 조회 오류:', error);
        throw error;
      }
    }
  },
  
  // 테니스장 정보 관련 API
  courts: {
    getAll: async () => {
      try {
        const response = await axios.get('/api/data/courts.json');
        return response.data;
      } catch (error) {
        console.error('테니스장 정보 조회 오류:', error);
        // 오류 발생 시 기본 데이터 제공
        return [
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
      }
    }
  },
  
  // 소모임 관련 API
  groups: {
    getAll: async () => {
      try {
        const response = await axios.get('/api/groups');
        return response.data;
      } catch (error) {
        console.error('소모임 목록 조회 오류:', error);
        throw error;
      }
    },
    
    create: async (groupData) => {
      try {
        const response = await axios.post('/api/groups', {
          ...groupData,
          createdBy: App.State.currentUser ? App.State.currentUser.username : '익명',
          createdAt: new Date().toISOString(),
          members: [App.State.currentUser ? App.State.currentUser.username : '익명']
        });
        return response.data;
      } catch (error) {
        console.error('소모임 생성 오류:', error);
        throw error;
      }
    },
    
    join: async (groupId) => {
      try {
        const response = await axios.post(`/api/groups/${groupId}/join`, {
          username: App.State.currentUser ? App.State.currentUser.username : '익명'
        });
        return response.data;
      } catch (error) {
        console.error('소모임 참여 오류:', error);
        throw error;
      }
    }
  },
  
  // 채팅 관련 API
  chat: {
    getRooms: async () => {
      try {
        const response = await axios.get('/api/chat/rooms');
        return response.data;
      } catch (error) {
        console.error('채팅방 목록 조회 오류:', error);
        throw error;
      }
    },
    
    getMessages: async (roomId) => {
      try {
        const response = await axios.get(`/api/chat/rooms/${roomId}/messages`);
        return response.data;
      } catch (error) {
        console.error('채팅 메시지 조회 오류:', error);
        throw error;
      }
    },
    
    sendMessage: async (roomId, content) => {
      try {
        const response = await axios.post(`/api/chat/rooms/${roomId}/messages`, {
          content,
          sender: App.State.currentUser ? App.State.currentUser.username : '익명',
          timestamp: new Date().toISOString()
        });
        return response.data;
      } catch (error) {
        console.error('메시지 전송 오류:', error);
        throw error;
      }
    },
    
    createRoom: async (targetUser) => {
      try {
        const response = await axios.post('/api/chat/rooms', {
          users: [
            App.State.currentUser ? App.State.currentUser.username : '익명',
            targetUser
          ],
          createdAt: new Date().toISOString()
        });
        return response.data;
      } catch (error) {
        console.error('채팅방 생성 오류:', error);
        throw error;
      }
    }
  },
  
  // 테니스 용품 마켓 관련 API
  market: {
    getItems: async (category = 'all') => {
      try {
        const response = await axios.get(`/api/market?category=${category}`);
        return response.data;
      } catch (error) {
        console.error('마켓 아이템 조회 오류:', error);
        throw error;
      }
    },
    
    createItem: async (itemData) => {
      try {
        const response = await axios.post('/api/market', {
          ...itemData,
          seller: App.State.currentUser ? App.State.currentUser.username : '익명',
          createdAt: new Date().toISOString()
        });
        return response.data;
      } catch (error) {
        console.error('상품 등록 오류:', error);
        throw error;
      }
    },
    
    getItemDetail: async (itemId) => {
      try {
        const response = await axios.get(`/api/market/${itemId}`);
        return response.data;
      } catch (error) {
        console.error('상품 상세 조회 오류:', error);
        throw error;
      }
    }
  }
};
