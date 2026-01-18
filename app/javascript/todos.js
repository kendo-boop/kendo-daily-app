document.addEventListener('DOMContentLoaded', function() {
  // モーダルの初期化
  var elems = document.querySelectorAll('.modal');
  M.Modal.init(elems);
  
  // テキストフィールドの初期化
  M.updateTextFields();
  
  // 削除確認モーダルの処理
  var deleteModal = document.getElementById('modal-delete-confirm');
  var deleteModalInstance = M.Modal.getInstance(deleteModal);
  var currentTodoId = null;
  
  // 削除ボタンをクリックしたとき
  document.querySelectorAll('.delete-todo-btn').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      
      currentTodoId = this.getAttribute('data-todo-id');
      var todoTitle = this.getAttribute('data-todo-title');
      
      // モーダルにタイトルを表示
      document.getElementById('delete-todo-title').textContent = todoTitle;
      
      // モーダルを開く
      deleteModalInstance.open();
    });
  });
  
  // 削除確定ボタンをクリックしたとき
  document.getElementById('confirm-delete-btn').addEventListener('click', function() {
    if (currentTodoId) {
      document.getElementById('delete-form-' + currentTodoId).submit();
    }
  });
});