// ========================================
// グローバル関数（HTMLから直接呼ばれる）
// ========================================

// コメントをトグル
function toggleComments(postId) {
  const commentsSection = document.getElementById('comments-section-' + postId);
  if (commentsSection) {
    if (commentsSection.style.display === 'none' || commentsSection.style.display === '') {
      commentsSection.style.display = 'block';
    } else {
      commentsSection.style.display = 'none';
    }
  }
  return false;
}

// 投稿メニューをトグル
function togglePostMenu(postId) {
  const menu = document.getElementById('post-menu-' + postId);
  const allMenus = document.querySelectorAll('.post-menu-dropdown');
  
  // 他のメニューを閉じる
  allMenus.forEach(function(m) {
    if (m.id !== 'post-menu-' + postId) {
      m.style.display = 'none';
    }
  });
  
  // 対象メニューをトグル
  if (menu) {
    menu.style.display = (menu.style.display === 'none' || menu.style.display === '') ? 'block' : 'none';
  }
  
  return false;
}

// プレビュー削除
function removePreview() {
  const previewArea = document.getElementById('media-preview');
  const fileInput = document.getElementById('post_media_file');
  
  if (previewArea) {
    previewArea.innerHTML = '';
    previewArea.style.display = 'none';
  }
  
  if (fileInput) {
    fileInput.value = '';
  }
  
  M.toast({html: 'ファイルを削除しました', classes: 'rounded'});
}

// ========================================
// 内部関数
// ========================================

// ファイルプレビュー処理
function handleFilePreview(file) {
  const previewArea = document.getElementById('media-preview');
  if (!previewArea) return;
  
  previewArea.innerHTML = '';
  previewArea.style.display = 'block';
  
  const reader = new FileReader();
  
  reader.onload = function(event) {
    const previewContainer = document.createElement('div');
    previewContainer.className = 'preview-item';
    
    // メディア要素の作成
    if (file.type.startsWith('image/')) {
      const img = document.createElement('img');
      img.className = 'preview-image';
      img.src = event.target.result;
      img.alt = 'プレビュー画像';
      previewContainer.appendChild(img);
    } else if (file.type.startsWith('video/')) {
      const video = document.createElement('video');
      video.className = 'preview-video';
      video.src = event.target.result;
      video.controls = true;
      previewContainer.appendChild(video);
    }
    
    // ファイル情報エリア
    const fileInfo = document.createElement('div');
    fileInfo.className = 'preview-filename';
    fileInfo.style.cssText = 'display: flex; justify-content: space-between; align-items: center;';
    
    const fileName = document.createElement('span');
    fileName.textContent = file.name;
    fileName.style.cssText = 'overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1;';
    
    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.innerHTML = '<i class="material-icons">close</i>';
    removeBtn.style.cssText = 'background: #f44336; color: white; border: none; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; margin-left: 10px; padding: 0;';
    removeBtn.onclick = removePreview;
    
    fileInfo.appendChild(fileName);
    fileInfo.appendChild(removeBtn);
    previewContainer.appendChild(fileInfo);
    previewArea.appendChild(previewContainer);
  };
  
  reader.readAsDataURL(file);
}

// ========================================
// ページ初期化処理
// ========================================

function initializePage() {
  // Materialize コンポーネントの初期化
  const modals = document.querySelectorAll('.modal');
  M.Modal.init(modals);
  
  const dropdowns = document.querySelectorAll('.dropdown-trigger');
  if (dropdowns.length > 0) {
    M.Dropdown.init(dropdowns, {
      alignment: 'right',
      coverTrigger: false
    });
  }
  
  // メニュー外クリックで閉じる
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.post-actions-menu')) {
      const allMenus = document.querySelectorAll('.post-menu-dropdown');
      allMenus.forEach(function(menu) {
        menu.style.display = 'none';
      });
    }
  });
  
  // ファイル選択のイベントリスナー
  const fileInput = document.getElementById('post_media_file');
  if (fileInput) {
    fileInput.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (file) {
        M.toast({html: 'ファイルを選択しました', classes: 'rounded'});
        handleFilePreview(file);
      }
    });
  }
  
  // 削除モーダルの処理
  const deletePostModal = document.getElementById('modal-delete-post-confirm');
  if (deletePostModal) {
    const deletePostModalInstance = M.Modal.getInstance(deletePostModal);
    let currentPostId = null;
    
    document.querySelectorAll('.delete-post-btn').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        currentPostId = this.getAttribute('data-post-id');
        const postContent = this.getAttribute('data-post-content');
        
        document.getElementById('delete-post-content').textContent = postContent;
        
        const allMenus = document.querySelectorAll('.post-menu-dropdown');
        allMenus.forEach(function(menu) {
          menu.style.display = 'none';
        });
        
        deletePostModalInstance.open();
      });
    });
    
    const confirmDeleteBtn = document.getElementById('confirm-delete-post-btn');
    if (confirmDeleteBtn) {
      confirmDeleteBtn.onclick = function() {
        if (currentPostId) {
          const form = document.getElementById('delete-post-form-' + currentPostId);
          if (form) {
            form.submit();
          }
        }
      };
    }
  }
}

document.addEventListener('DOMContentLoaded', function() {
  initializePage();
});

document.addEventListener('turbo:load', function() {
  initializePage();
});