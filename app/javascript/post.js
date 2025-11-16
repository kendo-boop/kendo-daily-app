document.addEventListener('DOMContentLoaded', function() {
  console.log('Posts JavaScript loaded'); // デバッグ用
  
  // ドロップダウンメニューの初期化
  var dropdowns = document.querySelectorAll('.dropdown-trigger');
  if (dropdowns.length > 0) {
    M.Dropdown.init(dropdowns, {
      alignment: 'right',
      coverTrigger: false
    });
    console.log('Dropdowns initialized:', dropdowns.length); // デバッグ用
  }
  
  // コメントセクションのトグル
  var commentButtons = document.querySelectorAll('.toggle-comments');
  console.log('Found comment buttons:', commentButtons.length); // デバッグ用
  
  commentButtons.forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      console.log('Comment button clicked'); // デバッグ用
      
      var postId = this.getAttribute('data-post-id');
      var commentsSection = document.getElementById('comments-section-' + postId);
      
      console.log('Post ID:', postId); // デバッグ用
      console.log('Comments section:', commentsSection); // デバッグ用
      
      if (commentsSection) {
        if (commentsSection.style.display === 'none' || commentsSection.style.display === '') {
          commentsSection.style.display = 'block';
          console.log('Showing comments'); // デバッグ用
        } else {
          commentsSection.style.display = 'none';
          console.log('Hiding comments'); // デバッグ用
        }
      }
    });
  });
  
  // ファイル選択時の表示
  var fileInput = document.getElementById('post_media_files');
  if (fileInput) {
    fileInput.addEventListener('change', function(e) {
      var files = e.target.files;
      if (files.length > 0) {
        M.toast({html: files.length + '個のファイルを選択しました', classes: 'rounded'});
      }
    });
  }
});