// ui-posts.js - 게시판 관련 UI 모듈

// 게시판 관련 UI
App.UI.posts = {
  // 게시글 목록 표시
  renderPosts: async () => {
    try {
      const posts = await App.API.posts.getAll();
      const postsListElement = App.UI.elements.postsList;
      
      if (posts.length === 0) {
        postsListElement.innerHTML = `
          <div class="py-12 text-center text-gray-400">
            <i class="fas fa-clipboard text-5xl mb-4"></i>
            <p>아직 게시글이 없습니다.</p>
            <p class="text-sm">첫 번째 게시글을 작성해보세요!</p>
          </div>
        `;
        return;
      }
      
      // 최신순으로 정렬
      posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      // 게시글 목록 HTML 생성
      const postsHTML = posts.map(post => {
        const postDate = new Date(post.createdAt);
        const formattedDate = `${postDate.getFullYear()}-${String(postDate.getMonth() + 1).padStart(2, '0')}-${String(postDate.getDate()).padStart(2, '0')} ${String(postDate.getHours()).padStart(2, '0')}:${String(postDate.getMinutes()).padStart(2, '0')}`;
        
        return `
          <div class="post-item p-4 hover:bg-gray-50 transition-colors">
            <h3 class="text-lg font-medium text-gray-800">${post.title}</h3>
            <p class="text-gray-600 mt-2 line-clamp-2">${post.content}</p>
            <div class="flex justify-between items-center mt-3">
              <div class="flex items-center text-sm text-gray-500">
                <i class="fas fa-user-circle mr-1"></i>
                <span>${post.author}</span>
              </div>
              <span class="text-sm text-gray-400">${formattedDate}</span>
            </div>
          </div>
        `;
      }).join('');
      
      postsListElement.innerHTML = postsHTML;
      
    } catch (error) {
      console.error('게시글 목록 렌더링 오류:', error);
      App.UI.elements.postsList.innerHTML = `
        <div class="text-center p-8 text-gray-500">
          <i class="fas fa-exclamation-circle text-yellow-500 text-3xl mb-2"></i>
          <p>게시글을 불러오는데 실패했습니다.</p>
          <button id="retryPosts" class="mt-3 px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600">
            다시 시도
          </button>
        </div>
      `;
      
      // 다시 시도 버튼에 이벤트 리스너 추가
      document.getElementById('retryPosts')?.addEventListener('click', () => {
        App.UI.posts.renderPosts();
      });
    }
  },
  
  // 게시글 작성 폼 초기화
  initPostForm: () => {
    const postForm = App.UI.elements.postForm;
    const newPostBtn = App.UI.elements.newPostBtn;
    
    if (newPostBtn) {
      newPostBtn.addEventListener('click', () => {
        // 로그인 확인
        if (!App.State.currentUser) {
          alert('로그인 후 이용해주세요.');
          App.UI.modal.open('loginModal');
          return;
        }
        
        App.UI.modal.open('postModal');
      });
    }
    
    if (postForm) {
      postForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const titleInput = document.getElementById('postTitle');
        const contentInput = document.getElementById('postContent');
        
        const title = titleInput.value.trim();
        const content = contentInput.value.trim();
        
        if (!title || !content) {
          alert('제목과 내용을 모두 입력해주세요.');
          return;
        }
        
        try {
          await App.API.posts.create(title, content);
          postForm.reset();
          App.UI.modal.close('postModal');
          App.UI.posts.renderPosts(); // 게시글 목록 업데이트
        } catch (error) {
          console.error('게시글 작성 오류:', error);
          alert('게시글 작성에 실패했습니다. 다시 시도해주세요.');
        }
      });
    }
  },
  
  init: () => {
    App.UI.posts.renderPosts();
    App.UI.posts.initPostForm();
  }
};
