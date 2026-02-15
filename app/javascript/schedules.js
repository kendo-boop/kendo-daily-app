(function() {
  'use strict';
  
  var deleteModalInstance = null;
  var currentScheduleId = null;
  
  console.log('Initializing schedules page...');
  console.log('Materialize available:', typeof M !== 'undefined');
  console.log('jQuery available:', typeof $ !== 'undefined');
  
  // 初期化関数
  function initSchedulePage() {
    console.log('initSchedulePage called');
    
    // モーダルの初期化
    var modals = document.querySelectorAll('.modal');
    console.log('Found modals:', modals.length);
    
    if (modals.length > 0) {
      M.Modal.init(modals);
      
      // 削除確認モーダル
      var deleteModal = document.getElementById('modal-delete-confirm');
      if (deleteModal) {
        deleteModalInstance = M.Modal.getInstance(deleteModal);
        console.log('Delete modal instance:', deleteModalInstance);
      }
      
      // 追加モーダルの初期化（日付設定処理付き）
      var addModal = document.getElementById('modal-add-schedule');
      if (addModal) {
        var addModalInstance = M.Modal.init(addModal, {
          onOpenStart: function() {
            console.log('Add modal opening...');
            // 選択中の日付を取得
            var selectedDateEl = document.querySelector('.calendar-day.selected');
            var selectedDate = null;
            
            if (selectedDateEl) {
              selectedDate = selectedDateEl.getAttribute('data-date');
              console.log('Selected date from calendar:', selectedDate);
            }
            
            // hidden fieldに日付を設定
            var hiddenDateInput = document.querySelector('input[name="schedule[schedule_date]"]');
            if (hiddenDateInput && selectedDate) {
              hiddenDateInput.value = selectedDate;
              console.log('Set hidden field to:', selectedDate);
            } else {
              console.warn('Hidden date field not found or no selected date');
            }
            
            M.updateTextFields();
          }
        });
      }
    }
    
    // テキストフィールドの初期化
    M.updateTextFields();
    
    // 削除ボタンのイベント（イベント委譲）
    document.addEventListener('click', handleDeleteClick);
    
    // 削除確定ボタン
    var confirmBtn = document.getElementById('confirm-delete-schedule-btn');
    if (confirmBtn) {
      confirmBtn.addEventListener('click', handleConfirmDelete);
    }
    
    // キャンセルボタンのイベントリスナーを追加
    var cancelBtns = document.querySelectorAll('#modal-delete-confirm .modal-close');
    cancelBtns.forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.preventDefault(); // ページ遷移を防ぐ
        e.stopPropagation();
        console.log('Cancel button clicked');
        if (deleteModalInstance) {
          deleteModalInstance.close();
        }
      });
    });
    
    // カレンダーの日付クリック
    initCalendarClicks();
    
    // 「スケジュールを追加」ボタンのクリックイベント
    var addScheduleBtn = document.querySelector('.modal-trigger[href="#modal-add-schedule"]');
    if (addScheduleBtn) {
      addScheduleBtn.addEventListener('click', function(e) {
        console.log('Add schedule button clicked');
        // 選択中の日付を確認
        var selectedDateEl = document.querySelector('.calendar-day.selected');
        if (selectedDateEl) {
          var selectedDate = selectedDateEl.getAttribute('data-date');
          console.log('Current selected date:', selectedDate);
          
          // hidden fieldに設定
          setTimeout(function() {
            var hiddenDateInput = document.querySelector('input[name="schedule[schedule_date]"]');
            if (hiddenDateInput) {
              hiddenDateInput.value = selectedDate;
              console.log('Updated hidden field to:', selectedDate);
            }
          }, 100);
        }
      });
    }
    
    console.log('Initialization complete');
  }
  
  // 削除ボタンクリックハンドラ
  function handleDeleteClick(e) {
    var deleteBtn = e.target.closest('.delete-schedule-btn');
    if (!deleteBtn) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Delete button clicked');
    
    currentScheduleId = deleteBtn.getAttribute('data-schedule-id');
    var scheduleTitle = deleteBtn.getAttribute('data-schedule-title');
    
    console.log('ID:', currentScheduleId, 'Title:', scheduleTitle);
    
    // タイトルを設定
    var titleEl = document.getElementById('delete-schedule-title');
    if (titleEl) {
      titleEl.textContent = scheduleTitle;
    }
    
    // モーダルを開く
    if (deleteModalInstance) {
      console.log('Opening modal...');
      deleteModalInstance.open();
      
      // 開いた後にスタイルを確認・修正
      setTimeout(function() {
        var modalEl = document.getElementById('modal-delete-confirm');
        if (modalEl && window.getComputedStyle(modalEl).display === 'none') {
          console.warn('Modal not visible, forcing display');
          modalEl.style.display = 'block';
          modalEl.style.zIndex = '1003';
          modalEl.style.opacity = '1';
          
          var overlay = document.querySelector('.modal-overlay');
          if (overlay) {
            overlay.style.display = 'block';
            overlay.style.opacity = '0.5';
          }
        }
      }, 50);
    } else {
      console.error('Modal instance not found!');
    }
  }
  
  // 削除確定ハンドラ
  function handleConfirmDelete(e) {
    e.preventDefault(); // ページ遷移を防ぐ
    e.stopPropagation();
    console.log('Confirm delete:', currentScheduleId);
    
    if (currentScheduleId) {
      var form = document.getElementById('delete-form-' + currentScheduleId);
      if (form) {
        console.log('Submitting form');
        
        // モーダルを閉じてからフォーム送信
        if (deleteModalInstance) {
          deleteModalInstance.close();
        }
        
        // 少し遅延させてからフォーム送信
        setTimeout(function() {
          form.submit();
        }, 100);
      } else {
        console.error('Form not found:', 'delete-form-' + currentScheduleId);
      }
    }
  }
  
  // カレンダークリックの初期化
  function initCalendarClicks() {
    document.querySelectorAll('.calendar-day:not(.other-month):not(.empty)').forEach(function(dayEl) {
      dayEl.addEventListener('click', function(e) {
        e.preventDefault();
        var date = this.getAttribute('data-date');
        if (!date) return;
        
        console.log('Date clicked:', date);
        
        // 選択状態を更新
        document.querySelectorAll('.calendar-day').forEach(function(el) {
          el.classList.remove('selected');
        });
        this.classList.add('selected');
        
        // Ajaxでスケジュール取得
        fetchSchedules(date);
      });
    });
  }
  
  // スケジュール取得
  function fetchSchedules(date) {
    fetch('/schedules/by_date/' + date)
      .then(response => response.json())
      .then(data => {
        console.log('Schedules fetched:', data.schedules.length);
        
        // 日付表示を更新
        document.getElementById('selected-date-text').textContent = data.date + 'のスケジュール';
        
        // リスト更新
        var listContainer = document.getElementById('schedules-list');
        
        if (data.schedules.length === 0) {
          listContainer.innerHTML = `
            <div class="schedules-empty-message">
              <i class="material-icons">event_busy</i>
              <p>この日のスケジュールはありません</p>
            </div>
          `;
        } else {
          var html = '<ul class="schedules-collection">';
          data.schedules.forEach(function(schedule) {
            html += renderScheduleItem(schedule);
          });
          html += '</ul>';
          listContainer.innerHTML = html;
        }
      })
      .catch(error => {
        console.error('Error:', error);
        M.toast({html: 'スケジュールの取得に失敗しました'});
      });
  }
  
  // スケジュールアイテムのHTML生成
  function renderScheduleItem(schedule) {
    var categoryClass = schedule.category === '大会' ? 'tournament' : 'practice';
    var locationHtml = schedule.location ? 
      `<div class="schedule-location">
        <i class="material-icons">place</i>
        ${escapeHtml(schedule.location)}
      </div>` : '';
    var categoryHtml = schedule.category ? 
      `<span class="schedule-category-chip ${categoryClass}">${escapeHtml(schedule.category)}</span>` : '';
    var memoHtml = schedule.memo ? 
      `<div class="schedule-memo">${escapeHtml(schedule.memo)}</div>` : '';
    
    var csrfToken = document.querySelector('meta[name="csrf-token"]');
    var csrfContent = csrfToken ? csrfToken.content : '';
    
    return `
      <li class="collection-item">
        <div class="schedule-item-container">
          <div class="schedule-content">
            <div class="schedule-time">
              <i class="material-icons">access_time</i>
              ${escapeHtml(schedule.start_time)} - ${escapeHtml(schedule.end_time)}
            </div>
            <div class="schedule-title">${escapeHtml(schedule.title)}</div>
            ${locationHtml}
            ${categoryHtml}
            ${memoHtml}
          </div>
          <div class="schedule-actions">
            <a href="#!" class="schedule-action-btn delete-schedule-btn" 
              data-schedule-id="${schedule.id}"
              data-schedule-title="${escapeHtml(schedule.title)}">
              <i class="material-icons schedule-action-icon">delete</i>
            </a>
            <form id="delete-form-${schedule.id}" action="/schedules/${schedule.id}" method="post" class="schedule-delete-form" style="display: none;">
              <input type="hidden" name="_method" value="delete">
              <input type="hidden" name="authenticity_token" value="${csrfContent}">
            </form>
          </div>
        </div>
      </li>
    `;
  }
  
  // XSSエスケープ
  function escapeHtml(text) {
    if (!text) return '';
    var map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.toString().replace(/[&<>"']/g, function(m) { return map[m]; });
  }
  
  // DOMContentLoaded または 即座に実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSchedulePage);
  } else {
    initSchedulePage();
  }
})();