// ========================================
// デスクトップとモバイルの入力欄を同期
// ========================================

document.addEventListener('DOMContentLoaded', function() {
  syncInputFields();
});

function syncInputFields() {
  // チーム名の同期
  const myTeamInputs = document.querySelectorAll('[data-field="my_team_name"]');
  const opponentTeamInputs = document.querySelectorAll('[data-field="opponent_team_name"]');
  
  // 自チーム名
  myTeamInputs.forEach(input => {
    input.addEventListener('input', function(e) {
      myTeamInputs.forEach(other => {
        if (other !== input) {
          other.value = e.target.value;
        }
      });
    });
  });
  
  // 相手チーム名
  opponentTeamInputs.forEach(input => {
    input.addEventListener('input', function(e) {
      opponentTeamInputs.forEach(other => {
        if (other !== input) {
          other.value = e.target.value;
        }
      });
    });
  });
  
  // 選手名の同期（団体戦）
  const memberInputs = document.querySelectorAll('[data-member]');
  const memberGroups = {};
  
  memberInputs.forEach(input => {
    const memberId = input.dataset.member;
    const field = input.dataset.field;
    const key = `${memberId}-${field}`;
    
    if (!memberGroups[key]) {
      memberGroups[key] = [];
    }
    memberGroups[key].push(input);
  });
  
  Object.values(memberGroups).forEach(group => {
    group.forEach(input => {
      input.addEventListener('input', function(e) {
        group.forEach(other => {
          if (other !== input) {
            other.value = e.target.value;
          }
        });
      });
    });
  });
  
  // 代表戦選手名の同期
  const daihyosenMyInputs = document.querySelectorAll('[data-field="daihyosen_my_member_name"]');
  const daihyosenOpponentInputs = document.querySelectorAll('[data-field="daihyosen_opponent_member_name"]');
  
  daihyosenMyInputs.forEach(input => {
    input.addEventListener('input', function(e) {
      daihyosenMyInputs.forEach(other => {
        if (other !== input) {
          other.value = e.target.value;
        }
      });
    });
  });
  
  daihyosenOpponentInputs.forEach(input => {
    input.addEventListener('input', function(e) {
      daihyosenOpponentInputs.forEach(other => {
        if (other !== input) {
          other.value = e.target.value;
        }
      });
    });
  });
  
  // 個人戦の同期
  const individualMyNameInputs = document.querySelectorAll('[data-field="individual_my_name"]');
  const individualOpponentNameInputs = document.querySelectorAll('[data-field="individual_opponent_name"]');
  const individualMyTeamInputs = document.querySelectorAll('[data-field="individual_my_team_name"]');
  const individualOpponentTeamInputs = document.querySelectorAll('[data-field="individual_opponent_team_name"]');
  
  individualMyNameInputs.forEach(input => {
    input.addEventListener('input', function(e) {
      individualMyNameInputs.forEach(other => {
        if (other !== input) {
          other.value = e.target.value;
        }
      });
    });
  });
  
  individualOpponentNameInputs.forEach(input => {
    input.addEventListener('input', function(e) {
      individualOpponentNameInputs.forEach(other => {
        if (other !== input) {
          other.value = e.target.value;
        }
      });
    });
  });
  
  individualMyTeamInputs.forEach(input => {
    input.addEventListener('input', function(e) {
      individualMyTeamInputs.forEach(other => {
        if (other !== input) {
          other.value = e.target.value;
        }
      });
    });
  });
  
  individualOpponentTeamInputs.forEach(input => {
    input.addEventListener('input', function(e) {
      individualOpponentTeamInputs.forEach(other => {
        if (other !== input) {
          other.value = e.target.value;
        }
      });
    });
  });
}