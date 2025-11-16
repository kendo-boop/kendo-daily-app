// ========================================
// スコアを保存
// ========================================

function saveScore() {
  const app = window.kendoScoreApp;
  const matchData = app.matchData;
  
  if (!matchData) {
    alert('試合データが読み込まれていません');
    return;
  }
  
  // 個人戦の場合
  if (matchData.matchType === 'individual') {
    saveIndividualScore();
    return;
  }
  
  // 団体戦の保存処理
  const formData = {
    match: {
      title: document.querySelector('[data-field="title"]')?.value || '',
      match_date: document.querySelector('[data-field="match_date"]')?.value || ''
    },
    team_score: {
      my_team_name: document.querySelector('[data-field="my_team_name"]')?.value || '',
      opponent_team_name: document.querySelector('[data-field="opponent_team_name"]')?.value || '',
      has_daihyosen: app.hasDaihyosen,
      team_members_attributes: []
    }
  };
  
  let myWinCount = 0;
  let opponentWinCount = 0;
  let myTotalPoints = 0;
  let opponentTotalPoints = 0;
  
  // 通常の5試合
  app.teamMembersData.forEach((member, index) => {
    const myName = document.querySelector(`[data-member="${member.id}"][data-field="my_member_name"]`)?.value || '';
    const opponentName = document.querySelector(`[data-member="${member.id}"][data-field="opponent_member_name"]`)?.value || '';
    
    const myPoints = (member.points_history || []).filter(p => p.player === 'my').length;
    const opponentPoints = (member.points_history || []).filter(p => p.player === 'opponent').length;
    
    myTotalPoints += myPoints;
    opponentTotalPoints += opponentPoints;
    
    let result = 'draw';
    
    if (member.is_draw) {
      result = 'draw';
    } else if (member.is_hantei) {
      if (myPoints > opponentPoints) {
        result = 'win';
        myWinCount++;
      } else if (opponentPoints > myPoints) {
        result = 'lose';
        opponentWinCount++;
      } else {
        const firstPoint = (member.points_history || []).find(p => p.is_first);
        if (firstPoint && firstPoint.player === 'my') {
          result = 'win';
          myWinCount++;
        } else {
          result = 'lose';
          opponentWinCount++;
        }
      }
    } else {
      if (myPoints > opponentPoints) {
        result = 'win';
        myWinCount++;
      } else if (opponentPoints > myPoints) {
        result = 'lose';
        opponentWinCount++;
      }
    }
    
    formData.team_score.team_members_attributes.push({
      id: member.id,
      my_member_name: myName,
      opponent_member_name: opponentName,
      points_history: JSON.stringify(member.points_history || []),
      is_draw: member.is_draw || false,
      is_encho: member.is_encho || false,
      is_hantei: member.is_hantei || false,
      is_fusenshow: member.is_fusenshow || false,
      is_ipponkachi: member.is_ipponkachi || false,
      hansoku_count_my: member.hansoku_count_my || 0,
      hansoku_count_opponent: member.hansoku_count_opponent || 0,
      result: result
    });
  });
  
  // 代表戦データを追加
  if (app.hasDaihyosen && app.daihyosenData) {
    const myName = document.querySelector('[data-field="daihyosen_my_member_name"]')?.value || '';
    const opponentName = document.querySelector('[data-field="daihyosen_opponent_member_name"]')?.value || '';
    
    const myPoints = (app.daihyosenData.points_history || []).filter(p => p.player === 'my').length;
    const opponentPoints = (app.daihyosenData.points_history || []).filter(p => p.player === 'opponent').length;
    
    myTotalPoints += myPoints;
    opponentTotalPoints += opponentPoints;
    
    let result = 'draw';
    if (!app.daihyosenData.is_draw) {
      if (myPoints > opponentPoints) {
        result = 'win';
        myWinCount++;
      } else if (opponentPoints > myPoints) {
        result = 'lose';
        opponentWinCount++;
      }
    }
    
    formData.team_score.team_members_attributes.push({
      id: app.daihyosenData.id,
      position: 'daihyosen',
      my_member_name: myName,
      opponent_member_name: opponentName,
      points_history: JSON.stringify(app.daihyosenData.points_history || []),
      is_draw: app.daihyosenData.is_draw || false,
      is_encho: app.daihyosenData.is_encho || false,
      is_hantei: app.daihyosenData.is_hantei || false,
      is_fusenshow: app.daihyosenData.is_fusenshow || false,
      hansoku_count_my: app.daihyosenData.hansoku_count_my || 0,
      hansoku_count_opponent: app.daihyosenData.hansoku_count_opponent || 0,
      result: result
    });
  }
  
  if (myWinCount > opponentWinCount) {
    formData.team_score.result = 'win';
  } else if (opponentWinCount > myWinCount) {
    formData.team_score.result = 'lose';
  } else {
    formData.team_score.result = myTotalPoints >= opponentTotalPoints ? 'win' : 'lose';
  }
  
  const saveButton = document.querySelector('.btn-primary');
  if (!saveButton) return;
  
  saveButton.disabled = true;
  saveButton.innerHTML = '<i class="material-icons" style="font-size: 18px;">hourglass_empty</i>保存中...';
  
  fetch(matchData.updateScorePath, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': matchData.csrfToken,
      'Accept': 'application/json'
    },
    body: JSON.stringify(formData)
  })
  .then(response => {
    if (!response.ok) {
      return response.json().then(data => {
        throw new Error(data.errors ? data.errors.join(', ') : '保存に失敗しました');
      });
    }
    return response.json();
  })
  .then(data => {
    if (data.success) {
      window.location.href = matchData.matchesPath;
    } else {
      throw new Error(data.errors ? data.errors.join(', ') : '保存に失敗しました');
    }
  })
  .catch(error => {
    console.error('Save error:', error);
    alert(error.message || '保存に失敗しました');
    saveButton.disabled = false;
    saveButton.innerHTML = '<i class="material-icons" style="font-size: 18px;">save</i>保存';
  });
}

// ========================================
// 個人戦のスコアを保存
// ========================================

function saveIndividualScore() {
  const app = window.kendoScoreApp;
  const matchData = app.matchData;
  const score = app.individualScoreData;
  
  if (!score) {
    alert('スコアデータが読み込まれていません');
    return;
  }
  
  const myPoints = (score.points_history || []).filter(p => p.player === 'my').length;
  const opponentPoints = (score.points_history || []).filter(p => p.player === 'opponent').length;
  
  let result = 'lose';
  if (myPoints > opponentPoints) {
    result = 'win';
  } else if (myPoints === opponentPoints && myPoints > 0) {
    const firstPoint = (score.points_history || []).find(p => p.is_first);
    if (firstPoint && firstPoint.player === 'my') {
      result = 'win';
    }
  }
  
  const formData = {
    match: {
      title: document.querySelector('[data-field="title"]')?.value || '',
      match_date: document.querySelector('[data-field="match_date"]')?.value || ''
    },
    individual_score: {
      my_name: document.querySelector('[data-field="individual_my_name"]')?.value || '',
      my_team_name: document.querySelector('[data-field="individual_my_team_name"]')?.value || '',
      opponent_name: document.querySelector('[data-field="individual_opponent_name"]')?.value || '',
      opponent_team_name: document.querySelector('[data-field="individual_opponent_team_name"]')?.value || '',
      points_history: JSON.stringify(score.points_history || []),
      is_draw: score.is_draw || false,
      is_encho: score.is_encho || false,
      is_hantei: score.is_hantei || false,
      is_fusenshow: score.is_fusenshow || false,
      hansoku_count_my: score.hansoku_count_my || 0,
      hansoku_count_opponent: score.hansoku_count_opponent || 0,
      result: result
    }
  };
  
  const saveButton = document.querySelector('.btn-primary');
  if (!saveButton) return;
  
  saveButton.disabled = true;
  saveButton.innerHTML = '<i class="material-icons" style="font-size: 18px;">hourglass_empty</i>保存中...';
  
  fetch(matchData.updateScorePath, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': matchData.csrfToken,
      'Accept': 'application/json'
    },
    body: JSON.stringify(formData)
  })
  .then(response => {
    if (!response.ok) {
      return response.json().then(data => {
        throw new Error(data.errors ? data.errors.join(', ') : '保存に失敗しました');
      });
    }
    return response.json();
  })
  .then(data => {
    if (data.success) {
      window.location.href = matchData.matchesPath;
    } else {
      throw new Error(data.errors ? data.errors.join(', ') : '保存に失敗しました');
    }
  })
  .catch(error => {
    console.error('Save error:', error);
    alert(error.message || '保存に失敗しました');
    saveButton.disabled = false;
    saveButton.innerHTML = '<i class="material-icons" style="font-size: 18px;">save</i>保存';
  });
}