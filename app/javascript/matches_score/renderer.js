// ========================================
// 団体戦スコアの初期化と描画
// ========================================

function initializeScores() {
  console.log('Initializing scores...');
  window.kendoScoreApp.teamMembersData.forEach((member, index) => {
    console.log(`Rendering member ${index}:`, member);
    renderMemberScore(member, index);
  });
}

function renderMemberScore(member, index) {
  console.log(`renderMemberScore called for member ${index}:`, member);
  
  // 履歴がない場合は初期化
  if (!member.actionHistory) {
    member.actionHistory = [];
  }

  const myCell = document.getElementById(`cell-my-${index}`);
  const opponentCell = document.getElementById(`cell-opponent-${index}`);
  
  if (!myCell || !opponentCell) {
    console.error(`Cells not found for index ${index}`);
    return;
  }
  
  myCell.innerHTML = '';
  opponentCell.innerHTML = '';
  
  const myParent = myCell.parentElement;
  const opponentParent = opponentCell.parentElement;
  
  myParent.querySelectorAll('.draw-cross, .encho-wrapper, .hansoku-mark, .winner-circle-my, .winner-circle-opponent').forEach(el => el.remove());
  opponentParent.querySelectorAll('.draw-cross, .encho-wrapper, .hansoku-mark, .winner-circle-my, .winner-circle-opponent').forEach(el => el.remove());
  
  // 延長・判定マークを表示
  if (member.is_encho) {
    const encho = document.createElement('div');
    encho.className = 'encho-wrapper';
    encho.innerHTML = '<span class="point-comment">延長</span>';
    myParent.appendChild(encho);
  }
  
  if (member.is_hantei) {
    const hantei = document.createElement('div');
    hantei.className = 'encho-wrapper';
    hantei.innerHTML = '<span class="point-comment">判定</span>';
    myParent.appendChild(hantei);
  }
  
  // 技を表示
  let myPointCount = 0;
  let opponentPointCount = 0;
  
  if (member.points_history && Array.isArray(member.points_history)) {
    member.points_history.forEach((point, overallIndex) => {
      const gridItem = document.createElement('div');
      gridItem.className = 'grid-item';
      gridItem.style.gridColumn = overallIndex + 1;
      
      if (point.player === 'my') {
        myPointCount++;
        gridItem.style.gridRow = 1;
        gridItem.innerHTML = point.is_first 
          ? `<span class="point-circle">${displayPoint(point.point)}</span>` 
          : `<span class="point-text">${displayPoint(point.point)}</span>`;
        myCell.appendChild(gridItem);
      } else {
        opponentPointCount++;
        gridItem.style.gridRow = 2;
        gridItem.innerHTML = point.is_first 
          ? `<span class="point-circle">${displayPoint(point.point)}</span>` 
          : `<span class="point-text">${displayPoint(point.point)}</span>`;
        opponentCell.appendChild(gridItem);
      }
    });
  }
  
  // 勝者の○印を表示
  if (!member.is_draw) {
    const myHas2Points = myPointCount >= 2;
    const opponentHas2Points = opponentPointCount >= 2;
    const isIpponkachi = member.is_ipponkachi;
    
    if (myHas2Points || (isIpponkachi && myPointCount === 1 && opponentPointCount === 0)) {
      const winnerCircle = document.createElement('div');
      winnerCircle.className = 'winner-circle-my';
      myParent.appendChild(winnerCircle);
    } else if (opponentHas2Points || (isIpponkachi && opponentPointCount === 1 && myPointCount === 0)) {
      const winnerCircle = document.createElement('div');
      winnerCircle.className = 'winner-circle-opponent';
      opponentParent.appendChild(winnerCircle);
    } else if (myPointCount > 0 && opponentPointCount > 0 && myPointCount > opponentPointCount) {
      const winnerCircle = document.createElement('div');
      winnerCircle.className = 'winner-circle-my';
      myParent.appendChild(winnerCircle);
    } else if (myPointCount > 0 && opponentPointCount > 0 && opponentPointCount > myPointCount) {
      const winnerCircle = document.createElement('div');
      winnerCircle.className = 'winner-circle-opponent';
      opponentParent.appendChild(winnerCircle);
    }
  }
  
  // 反則マークを表示
  renderHansokuMarks(member, myParent, opponentParent);
  
  // 引き分けの×印を最後に表示
  if (member.is_draw) {
    const drawCross = document.createElement('div');
    drawCross.className = 'draw-cross';
    drawCross.innerHTML = `<svg><line x1="0" y1="0" x2="100%" y2="100%" stroke="#e53935" stroke-width="3"/><line x1="100%" y1="0" x2="0" y2="100%" stroke="#e53935" stroke-width="3"/></svg>`;
    myParent.appendChild(drawCross);
  }
  
  // モバイル版も同時にレンダリング
  renderMobileMemberScore(member, index);
  
  updateTotalScores();
}

// ========================================
// 個人戦スコアの初期化と描画
// ========================================

function initializeIndividualScore() {
  console.log('Initializing individual score...');
  renderIndividualScore();
}

function renderIndividualScore() {
  const app = window.kendoScoreApp;
  const score = app.individualScoreData;
  
  if (!score) return;
  
  // 履歴がない場合は初期化
  if (!score.actionHistory) {
    score.actionHistory = [];
  }

  const myCell = document.getElementById('cell-my-individual');
  const opponentCell = document.getElementById('cell-opponent-individual');
  
  if (!myCell || !opponentCell) {
    console.error('Individual cells not found');
    return;
  }
  
  myCell.innerHTML = '';
  opponentCell.innerHTML = '';
  
  const myParent = myCell.parentElement;
  const opponentParent = opponentCell.parentElement;
  
  // 既存のマークをクリア
  myParent.querySelectorAll('.draw-cross, .encho-wrapper, .hansoku-mark, .winner-circle-my, .winner-circle-opponent').forEach(el => el.remove());
  opponentParent.querySelectorAll('.draw-cross, .encho-wrapper, .hansoku-mark, .winner-circle-my, .winner-circle-opponent').forEach(el => el.remove());
  
  // 延長・判定マークを表示
  if (score.is_encho) {
    const encho = document.createElement('div');
    encho.className = 'encho-wrapper';
    encho.innerHTML = '<span class="point-comment">延長</span>';
    myParent.appendChild(encho);
  }
  
  if (score.is_hantei) {
    const hantei = document.createElement('div');
    hantei.className = 'encho-wrapper';
    hantei.innerHTML = '<span class="point-comment">判定</span>';
    myParent.appendChild(hantei);
  }
  
  // 技を表示
  let myPointCount = 0;
  let opponentPointCount = 0;
  
  if (score.points_history && Array.isArray(score.points_history)) {
    score.points_history.forEach((point, overallIndex) => {
      const gridItem = document.createElement('div');
      gridItem.className = 'grid-item';
      gridItem.style.gridColumn = overallIndex + 1;
      
      if (point.player === 'my') {
        myPointCount++;
        gridItem.style.gridRow = 1;
        gridItem.innerHTML = point.is_first 
          ? `<span class="point-circle">${displayPoint(point.point)}</span>` 
          : `<span class="point-text">${displayPoint(point.point)}</span>`;
        myCell.appendChild(gridItem);
      } else {
        opponentPointCount++;
        gridItem.style.gridRow = 2;
        gridItem.innerHTML = point.is_first 
          ? `<span class="point-circle">${displayPoint(point.point)}</span>` 
          : `<span class="point-text">${displayPoint(point.point)}</span>`;
        opponentCell.appendChild(gridItem);
      }
    });
  }
  
  // 勝者の○印を表示
  if (!score.is_draw) {
    const myHas2Points = myPointCount >= 2;
    const opponentHas2Points = opponentPointCount >= 2;
    
    if (myHas2Points) {
      const winnerCircle = document.createElement('div');
      winnerCircle.className = 'winner-circle-my';
      myParent.appendChild(winnerCircle);
    } else if (opponentHas2Points) {
      const winnerCircle = document.createElement('div');
      winnerCircle.className = 'winner-circle-opponent';
      opponentParent.appendChild(winnerCircle);
    } else if (myPointCount > 0 && opponentPointCount > 0) {
      if (myPointCount > opponentPointCount) {
        const winnerCircle = document.createElement('div');
        winnerCircle.className = 'winner-circle-my';
        myParent.appendChild(winnerCircle);
      } else if (opponentPointCount > myPointCount) {
        const winnerCircle = document.createElement('div');
        winnerCircle.className = 'winner-circle-opponent';
        opponentParent.appendChild(winnerCircle);
      }
    }
  }
  
  // 反則マークを表示
  renderHansokuMarks(score, myParent, opponentParent);
  
  // 引き分けの×印を表示
  if (score.is_draw) {
    const drawCross = document.createElement('div');
    drawCross.className = 'draw-cross';
    drawCross.innerHTML = `<svg><line x1="0" y1="0" x2="100%" y2="100%" stroke="#e53935" stroke-width="3"/><line x1="100%" y1="0" x2="0" y2="100%" stroke="#e53935" stroke-width="3"/></svg>`;
    myParent.appendChild(drawCross);
  }
  
  updateIndividualTotalScore();
}

// ========================================
// 代表戦スコアの描画
// ========================================

function renderDaihyosenScore() {
  const app = window.kendoScoreApp;
  const member = app.daihyosenData;
  
  if (!member) return;
  
  // 履歴がない場合は初期化
  if (!member.actionHistory) {
    member.actionHistory = [];
  }

  const myCell = document.getElementById('cell-my-daihyosen');
  const opponentCell = document.getElementById('cell-opponent-daihyosen');
  
  if (!myCell || !opponentCell) {
    console.error('Daihyosen cells not found');
    return;
  }
  
  myCell.innerHTML = '';
  opponentCell.innerHTML = '';
  
  const myParent = myCell.parentElement;
  const opponentParent = opponentCell.parentElement;
  
  myParent.querySelectorAll('.draw-cross, .encho-wrapper, .hansoku-mark, .winner-circle-my, .winner-circle-opponent').forEach(el => el.remove());
  opponentParent.querySelectorAll('.draw-cross, .encho-wrapper, .hansoku-mark, .winner-circle-my, .winner-circle-opponent').forEach(el => el.remove());
  
  // 延長・判定マークを表示
  if (member.is_encho) {
    const encho = document.createElement('div');
    encho.className = 'encho-wrapper';
    encho.innerHTML = '<span class="point-comment">延長</span>';
    myParent.appendChild(encho);
  }
  
  if (member.is_hantei) {
    const hantei = document.createElement('div');
    hantei.className = 'encho-wrapper';
    hantei.innerHTML = '<span class="point-comment">判定</span>';
    myParent.appendChild(hantei);
  }
  
  // 技を表示（代表戦は1本勝負）
  let myPointCount = 0;
  let opponentPointCount = 0;
  
  if (member.points_history && Array.isArray(member.points_history)) {
    member.points_history.forEach((point, overallIndex) => {
      const gridItem = document.createElement('div');
      gridItem.className = 'grid-item';
      gridItem.style.gridColumn = overallIndex + 1;
      
      if (point.player === 'my') {
        myPointCount++;
        gridItem.style.gridRow = 1;
        gridItem.innerHTML = point.is_first 
          ? `<span class="point-circle">${displayPoint(point.point)}</span>` 
          : `<span class="point-text">${displayPoint(point.point)}</span>`;
        myCell.appendChild(gridItem);
      } else {
        opponentPointCount++;
        gridItem.style.gridRow = 2;
        gridItem.innerHTML = point.is_first 
          ? `<span class="point-circle">${displayPoint(point.point)}</span>` 
          : `<span class="point-text">${displayPoint(point.point)}</span>`;
        opponentCell.appendChild(gridItem);
      }
    });
  }
  
  // 勝者の○印を表示（代表戦は1本勝負）
  if (!member.is_draw) {
    if (myPointCount === 1) {
      const winnerCircle = document.createElement('div');
      winnerCircle.className = 'winner-circle-my';
      myParent.appendChild(winnerCircle);
    } else if (opponentPointCount === 1) {
      const winnerCircle = document.createElement('div');
      winnerCircle.className = 'winner-circle-opponent';
      opponentParent.appendChild(winnerCircle);
    }
  }
  
  // 反則マークを表示
  renderHansokuMarks(member, myParent, opponentParent);
  
  // 引き分けの×印を表示
  if (member.is_draw) {
    const drawCross = document.createElement('div');
    drawCross.className = 'draw-cross';
    drawCross.innerHTML = `<svg><line x1="0" y1="0" x2="100%" y2="100%" stroke="#e53935" stroke-width="3"/><line x1="100%" y1="0" x2="0" y2="100%" stroke="#e53935" stroke-width="3"/></svg>`;
    myParent.appendChild(drawCross);
  }
  
  // モバイル版も同時にレンダリング
  renderMobileDaihyosenScore();
  
  updateTotalScores();
}

// ========================================
// モバイル版スコアの描画
// ========================================

function renderMobileMemberScore(member, index) {
  const myCell = document.getElementById(`cell-my-mobile-${index}`);
  const opponentCell = document.getElementById(`cell-opponent-mobile-${index}`);
  
  if (!myCell || !opponentCell) return;
  
  myCell.innerHTML = '';
  opponentCell.innerHTML = '';
  
  const myParent = myCell.parentElement;
  const opponentParent = opponentCell.parentElement;
  
  myParent.querySelectorAll('.draw-cross, .encho-wrapper, .hansoku-mark, .winner-circle-my, .winner-circle-opponent').forEach(el => el.remove());
  opponentParent.querySelectorAll('.draw-cross, .encho-wrapper, .hansoku-mark, .winner-circle-my, .winner-circle-opponent').forEach(el => el.remove());
  
  // 延長・判定マークを表示
  if (member.is_encho) {
    const encho = document.createElement('div');
    encho.className = 'encho-wrapper';
    encho.innerHTML = '<span class="point-comment">延長</span>';
    myParent.appendChild(encho);
  }
  
  if (member.is_hantei) {
    const hantei = document.createElement('div');
    hantei.className = 'encho-wrapper';
    hantei.innerHTML = '<span class="point-comment">判定</span>';
    myParent.appendChild(hantei);
  }
  
  // 技を表示
  let myPointCount = 0;
  let opponentPointCount = 0;
  
  if (member.points_history && Array.isArray(member.points_history)) {
    member.points_history.forEach((point, overallIndex) => {
      const gridItem = document.createElement('div');
      gridItem.className = 'grid-item';
      gridItem.style.gridColumn = overallIndex + 1;
      
      if (point.player === 'my') {
        myPointCount++;
        gridItem.style.gridRow = 1;
        gridItem.innerHTML = point.is_first 
          ? `<span class="point-circle">${displayPoint(point.point)}</span>` 
          : `<span class="point-text">${displayPoint(point.point)}</span>`;
        myCell.appendChild(gridItem);
      } else {
        opponentPointCount++;
        gridItem.style.gridRow = 2;
        gridItem.innerHTML = point.is_first 
          ? `<span class="point-circle">${displayPoint(point.point)}</span>` 
          : `<span class="point-text">${displayPoint(point.point)}</span>`;
        opponentCell.appendChild(gridItem);
      }
    });
  }
  
  // 勝者の○印を表示
  if (!member.is_draw) {
    const myHas2Points = myPointCount >= 2;
    const opponentHas2Points = opponentPointCount >= 2;
    const isIpponkachi = member.is_ipponkachi;
    
    if (myHas2Points || (isIpponkachi && myPointCount === 1 && opponentPointCount === 0)) {
      const winnerCircle = document.createElement('div');
      winnerCircle.className = 'winner-circle-my';
      myParent.appendChild(winnerCircle);
    } else if (opponentHas2Points || (isIpponkachi && opponentPointCount === 1 && myPointCount === 0)) {
      const winnerCircle = document.createElement('div');
      winnerCircle.className = 'winner-circle-opponent';
      opponentParent.appendChild(winnerCircle);
    } else if (myPointCount > 0 && opponentPointCount > 0 && myPointCount > opponentPointCount) {
      const winnerCircle = document.createElement('div');
      winnerCircle.className = 'winner-circle-my';
      myParent.appendChild(winnerCircle);
    } else if (myPointCount > 0 && opponentPointCount > 0 && opponentPointCount > myPointCount) {
      const winnerCircle = document.createElement('div');
      winnerCircle.className = 'winner-circle-opponent';
      opponentParent.appendChild(winnerCircle);
    }
  }
  
  // 反則マークを表示
  renderHansokuMarks(member, myParent, opponentParent);
  
  // 引き分けの×印を表示
  if (member.is_draw) {
    const drawCross = document.createElement('div');
    drawCross.className = 'draw-cross';
    drawCross.innerHTML = `<svg><line x1="0" y1="0" x2="100%" y2="100%" stroke="#e53935" stroke-width="3"/><line x1="100%" y1="0" x2="0" y2="100%" stroke="#e53935" stroke-width="3"/></svg>`;
    myParent.appendChild(drawCross);
  }
}

function renderMobileDaihyosenScore() {
  const app = window.kendoScoreApp;
  const member = app.daihyosenData;
  
  if (!member) return;
  
  const myCell = document.getElementById('cell-my-mobile-daihyosen');
  const opponentCell = document.getElementById('cell-opponent-mobile-daihyosen');
  
  if (!myCell || !opponentCell) return;
  
  myCell.innerHTML = '';
  opponentCell.innerHTML = '';
  
  const myParent = myCell.parentElement;
  const opponentParent = opponentCell.parentElement;
  
  myParent.querySelectorAll('.draw-cross, .encho-wrapper, .hansoku-mark, .winner-circle-my, .winner-circle-opponent').forEach(el => el.remove());
  opponentParent.querySelectorAll('.draw-cross, .encho-wrapper, .hansoku-mark, .winner-circle-my, .winner-circle-opponent').forEach(el => el.remove());
  
  // デスクトップ版と同じロジックで描画
  if (member.is_encho) {
    const encho = document.createElement('div');
    encho.className = 'encho-wrapper';
    encho.innerHTML = '<span class="point-comment">延長</span>';
    myParent.appendChild(encho);
  }
  
  if (member.is_hantei) {
    const hantei = document.createElement('div');
    hantei.className = 'encho-wrapper';
    hantei.innerHTML = '<span class="point-comment">判定</span>';
    myParent.appendChild(hantei);
  }
  
  let myPointCount = 0;
  let opponentPointCount = 0;
  
  if (member.points_history && Array.isArray(member.points_history)) {
    member.points_history.forEach((point, overallIndex) => {
      const gridItem = document.createElement('div');
      gridItem.className = 'grid-item';
      gridItem.style.gridColumn = overallIndex + 1;
      
      if (point.player === 'my') {
        myPointCount++;
        gridItem.style.gridRow = 1;
        gridItem.innerHTML = point.is_first 
          ? `<span class="point-circle">${displayPoint(point.point)}</span>` 
          : `<span class="point-text">${displayPoint(point.point)}</span>`;
        myCell.appendChild(gridItem);
      } else {
        opponentPointCount++;
        gridItem.style.gridRow = 2;
        gridItem.innerHTML = point.is_first 
          ? `<span class="point-circle">${displayPoint(point.point)}</span>` 
          : `<span class="point-text">${displayPoint(point.point)}</span>`;
        opponentCell.appendChild(gridItem);
      }
    });
  }
  
  if (!member.is_draw) {
    if (myPointCount === 1) {
      const winnerCircle = document.createElement('div');
      winnerCircle.className = 'winner-circle-my';
      myParent.appendChild(winnerCircle);
    } else if (opponentPointCount === 1) {
      const winnerCircle = document.createElement('div');
      winnerCircle.className = 'winner-circle-opponent';
      opponentParent.appendChild(winnerCircle);
    }
  }
  
  renderHansokuMarks(member, myParent, opponentParent);
  
  if (member.is_draw) {
    const drawCross = document.createElement('div');
    drawCross.className = 'draw-cross';
    drawCross.innerHTML = `<svg><line x1="0" y1="0" x2="100%" y2="100%" stroke="#e53935" stroke-width="3"/><line x1="100%" y1="0" x2="0" y2="100%" stroke="#e53935" stroke-width="3"/></svg>`;
    myParent.appendChild(drawCross);
  }
}

// ========================================
// 反則マークの描画（共通処理）
// ========================================

function renderHansokuMarks(data, myParent, opponentParent) {
  // 自分側の反則マーク
  if (data.hansoku_count_my > 0) {
    const hansokuMark = document.createElement('div');
    hansokuMark.className = 'hansoku-mark';
    hansokuMark.style.left = '5px';
    
    for (let i = 0; i < data.hansoku_count_my; i++) {
      const triangle = document.createElement('div');
      triangle.className = 'hansoku-triangle';
      hansokuMark.appendChild(triangle);
    }
    
    if (data.hansoku_count_my >= 2) {
      const line1 = document.createElement('div');
      line1.className = 'hansoku-line';
      line1.style.left = '0px';
      hansokuMark.appendChild(line1);
    }
    
    if (data.hansoku_count_my >= 4) {
      const line2 = document.createElement('div');
      line2.className = 'hansoku-line';
      line2.style.left = '38px';
      hansokuMark.appendChild(line2);
    }
    
    myParent.appendChild(hansokuMark);
  }

  // 相手側の反則マーク
  if (data.hansoku_count_opponent > 0) {
    const hansokuMark = document.createElement('div');
    hansokuMark.className = 'hansoku-mark hansoku-mark-opponent';
    hansokuMark.style.left = '5px';
    
    for (let i = 0; i < data.hansoku_count_opponent; i++) {
      const triangle = document.createElement('div');
      triangle.className = 'hansoku-triangle';
      hansokuMark.appendChild(triangle);
    }
    
    if (data.hansoku_count_opponent >= 2) {
      const line1 = document.createElement('div');
      line1.className = 'hansoku-line';
      line1.style.left = '0px';
      hansokuMark.appendChild(line1);
    }
    
    if (data.hansoku_count_opponent >= 4) {
      const line2 = document.createElement('div');
      line2.className = 'hansoku-line';
      line2.style.left = '38px';
      hansokuMark.appendChild(line2);
    }
    
    opponentParent.appendChild(hansokuMark);
  }
}

// ========================================
// 合計スコアの更新
// ========================================

function updateTotalScores() {
  const app = window.kendoScoreApp;
  let myTotalPoints = 0;
  let myWinCount = 0;
  let opponentTotalPoints = 0;
  let opponentWinCount = 0;
  
  // 通常の5試合
  app.teamMembersData.forEach(member => {
    if (!member.points_history) return;
    
    const myPoints = member.points_history.filter(p => p.player === 'my').length;
    const opponentPoints = member.points_history.filter(p => p.player === 'opponent').length;
    
    myTotalPoints += myPoints;
    opponentTotalPoints += opponentPoints;
    
    if (member.is_draw) {
      // 引き分け：勝者数に加算しない
    } else if (member.is_hantei) {
      if (myPoints > opponentPoints) {
        myWinCount++;
      } else if (opponentPoints > myPoints) {
        opponentWinCount++;
      } else {
        const firstPoint = member.points_history.find(p => p.is_first);
        if (firstPoint && firstPoint.player === 'my') {
          myWinCount++;
        } else {
          opponentWinCount++;
        }
      }
    } else {
      if (myPoints > opponentPoints) {
        myWinCount++;
      } else if (opponentPoints > myPoints) {
        opponentWinCount++;
      }
    }
  });
  
  // 代表戦がある場合
  if (app.hasDaihyosen && app.daihyosenData && app.daihyosenData.points_history) {
    const myPoints = app.daihyosenData.points_history.filter(p => p.player === 'my').length;
    const opponentPoints = app.daihyosenData.points_history.filter(p => p.player === 'opponent').length;
    
    myTotalPoints += myPoints;
    opponentTotalPoints += opponentPoints;
    
    if (!app.daihyosenData.is_draw) {
      if (myPoints > opponentPoints) {
        myWinCount++;
      } else if (opponentPoints > myPoints) {
        opponentWinCount++;
      }
    }
  }
  
  const isMyWin = myWinCount > opponentWinCount || (myWinCount === opponentWinCount && myTotalPoints > opponentTotalPoints);
  
  // デスクトップ版の更新
  const myScoreEl = document.getElementById('my-total-score');
  const opponentScoreEl = document.getElementById('opponent-total-score');
  
  if (myScoreEl) {
    myScoreEl.innerHTML = `<div class="${isMyWin ? 'score-winner' : 'score-loser'}"><div class="score-fraction"><div class="score-numerator">${myTotalPoints}</div><div class="score-line"></div><div class="score-denominator">${myWinCount}</div></div></div>`;
  }
  
  if (opponentScoreEl) {
    opponentScoreEl.innerHTML = `<div class="${!isMyWin ? 'score-winner' : 'score-loser'}"><div class="score-fraction"><div class="score-numerator">${opponentTotalPoints}</div><div class="score-line"></div><div class="score-denominator">${opponentWinCount}</div></div></div>`;
  }
  
  // モバイル版の更新
  const myScoreMobileEl = document.getElementById('my-total-score-mobile');
  const opponentScoreMobileEl = document.getElementById('opponent-total-score-mobile');
  
  if (myScoreMobileEl) {
    myScoreMobileEl.innerHTML = `<div class="${isMyWin ? 'score-winner' : 'score-loser'}"><div class="score-fraction"><div class="score-numerator">${myTotalPoints}</div><div class="score-line"></div><div class="score-denominator">${myWinCount}</div></div></div>`;
  }
  
  if (opponentScoreMobileEl) {
    opponentScoreMobileEl.innerHTML = `<div class="${!isMyWin ? 'score-winner' : 'score-loser'}"><div class="score-fraction"><div class="score-numerator">${opponentTotalPoints}</div><div class="score-line"></div><div class="score-denominator">${opponentWinCount}</div></div></div>`;
  }
}

function updateIndividualTotalScore() {
  const app = window.kendoScoreApp;
  const score = app.individualScoreData;
  
  if (!score) return;
  
  const myPoints = (score.points_history || []).filter(p => p.player === 'my').length;
  const opponentPoints = (score.points_history || []).filter(p => p.player === 'opponent').length;
  
  let isMyWin = false;
  let isOpponentWin = false;
  
  if (score.is_draw) {
    // 引き分け
  } else if (score.is_hantei) {
    if (myPoints > opponentPoints) {
      isMyWin = true;
    } else if (opponentPoints > myPoints) {
      isOpponentWin = true;
    } else {
      const firstPoint = (score.points_history || []).find(p => p.is_first);
      if (firstPoint && firstPoint.player === 'my') {
        isMyWin = true;
      } else {
        isOpponentWin = true;
      }
    }
  } else {
    if (myPoints >= 2 || myPoints > opponentPoints) {
      isMyWin = true;
    } else if (opponentPoints >= 2 || opponentPoints > myPoints) {
      isOpponentWin = true;
    }
  }
  
  const myScoreEl = document.getElementById('individual-my-score');
  const opponentScoreEl = document.getElementById('individual-opponent-score');
  
  if (myScoreEl) {
    myScoreEl.innerHTML = `<div class="${isMyWin ? 'score-winner' : 'score-loser'}"><div class="score-fraction"><div class="score-numerator">${myPoints}</div><div class="score-line"></div><div class="score-denominator">${isMyWin ? '1' : '0'}</div></div></div>`;
  }
  
  if (opponentScoreEl) {
    opponentScoreEl.innerHTML = `<div class="${isOpponentWin ? 'score-winner' : 'score-loser'}"><div class="score-fraction"><div class="score-numerator">${opponentPoints}</div><div class="score-line"></div><div class="score-denominator">${isOpponentWin ? '1' : '0'}</div></div></div>`;
  }
}