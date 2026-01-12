// ========================================
// 代表戦の処理
// ========================================

function initializeDaihyosen() {
  const app = window.kendoScoreApp;
  
  if (app.matchData && app.matchData.hasDaihyosen && app.daihyosenData) {
    const hasNames = app.daihyosenData.my_member_name || app.daihyosenData.opponent_member_name;
    const hasPoints = app.daihyosenData.points_history && app.daihyosenData.points_history.length > 0;
    
    if (hasNames || hasPoints) {
      app.hasDaihyosen = true;
      showDaihyosen();
      renderDaihyosenScore();
      
      const btn = document.getElementById('toggleDaihyosenBtn');
      if (btn) {
        btn.innerHTML = '<i class="material-icons" style="font-size: 16px;">remove</i>代表戦を削除';
      }
    }
  }
}

function toggleDaihyosen() {
  const app = window.kendoScoreApp;
  app.hasDaihyosen = !app.hasDaihyosen;
  
  const btn = document.getElementById('toggleDaihyosenBtn');
  
  if (app.hasDaihyosen) {
    showDaihyosen();
    if (btn) {
      btn.innerHTML = '<i class="material-icons" style="font-size: 16px;">remove</i>代表戦を削除';
    }
    
    if (!app.daihyosenData || !app.daihyosenData.id) {
      app.daihyosenData = {
        id: null,
        position: 'daihyosen',
        my_member_name: '',
        opponent_member_name: '',
        points_history: [],
        is_draw: false,
        is_encho: false,
        is_fusenshow: false,
        is_hantei: false,
        hansoku_count_my: 0,
        hansoku_count_opponent: 0,
        actionHistory: []
      };
    }
    renderDaihyosenScore();
  } else {
    hideDaihyosen();
    if (btn) {
      btn.innerHTML = '<i class="material-icons" style="font-size: 16px;">add</i>代表戦を追加';
    }
    
    if (app.daihyosenData) {
      app.daihyosenData.points_history = [];
      app.daihyosenData.my_member_name = '';
      app.daihyosenData.opponent_member_name = '';
      app.daihyosenData.is_draw = false;
      app.daihyosenData.is_encho = false;
      app.daihyosenData.is_fusenshow = false;
      app.daihyosenData.is_hantei = false;
      app.daihyosenData.hansoku_count_my = 0;
      app.daihyosenData.hansoku_count_opponent = 0;
      app.daihyosenData.actionHistory = [];
      
      const myNameInput = document.querySelector('[data-field="daihyosen_my_member_name"]');
      const opponentNameInput = document.querySelector('[data-field="daihyosen_opponent_member_name"]');
      if (myNameInput) myNameInput.value = '';
      if (opponentNameInput) opponentNameInput.value = '';
    }
  }
  
  updateTotalScores();
}

function showDaihyosen() {
  const elements = [
    'daihyosen-header',
    'daihyosen-my-name',
    'daihyosen-my-cell',
    'daihyosen-opponent-name',
    'daihyosen-opponent-cell'
  ];
  
  elements.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = '';
  });
  
  // モバイル版の代表戦行も表示
  const mobileRow = document.getElementById('mobile-daihyosen-row');
  if (mobileRow) mobileRow.style.display = '';
}

function hideDaihyosen() {
  const elements = [
    'daihyosen-header',
    'daihyosen-my-name',
    'daihyosen-my-cell',
    'daihyosen-opponent-name',
    'daihyosen-opponent-cell'
  ];
  
  elements.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
  
  // モバイル版の代表戦行も非表示
  const mobileRow = document.getElementById('mobile-daihyosen-row');
  if (mobileRow) mobileRow.style.display = 'none';
}

// ========================================
// 技入力パネルの制御
// ========================================

function openTechPanel(cell) {
  const app = window.kendoScoreApp;
  app.currentCell = cell;
  app.currentTeam = cell.dataset.team;
  app.currentPosition = cell.dataset.position;
  
  if (app.currentPosition === 'daihyosen') {
    app.currentMemberId = null;
  } else {
    app.currentMemberId = cell.dataset.memberId;
    app.currentPosition = parseInt(app.currentPosition);
  }
  
  document.querySelectorAll('.points-cell').forEach(c => c.classList.remove('active'));
  cell.classList.add('active');
  document.getElementById('techPanel').classList.add('active');
}

function closeTechPanel() {
  document.getElementById('techPanel').classList.remove('active');
  document.querySelectorAll('.points-cell').forEach(c => c.classList.remove('active'));
  window.kendoScoreApp.currentCell = null;
}

// ========================================
// 技の追加
// ========================================

function addTech(tech) {
  const app = window.kendoScoreApp;
  if (!app.currentCell) return;
  
  // 個人戦の場合
  if (app.matchData && app.matchData.matchType === 'individual') {
    addIndividualTech(tech);
    return;
  }
  
  // 代表戦の場合
  if (app.currentPosition === 'daihyosen') {
    addDaihyosenTech(tech);
    return;
  }
  
  // 通常の試合
  if (app.currentPosition === null) return;
  
  const member = app.teamMembersData[app.currentPosition];
  if (!member.points_history) member.points_history = [];
  if (!member.actionHistory) member.actionHistory = [];
  
  // 1試合の合計本数をチェック（最大3本）
  const totalPoints = member.points_history.length;
  if (totalPoints >= 3) {
    alert('1試合の合計は最大3本までです');
    return;
  }
  
  const currentTeamPoints = member.points_history.filter(p => p.player === app.currentTeam).length;
  if (currentTeamPoints >= 2) {
    alert('1人が取れる技は最大2本までです');
    return;
  }
  
  const isFirst = member.points_history.length === 0;
  member.points_history.push({ player: app.currentTeam, point: tech, is_first: isFirst });
  
  member.actionHistory.push({
    team: app.currentTeam,
    type: 'tech',
    tech: tech
  });
  
  member.is_draw = false;
  
  renderMemberScore(member, app.currentPosition);
}

function addIndividualTech(tech) {
  const app = window.kendoScoreApp;
  const score = app.individualScoreData;
  
  if (!score) return;
  if (!score.points_history) score.points_history = [];
  if (!score.actionHistory) score.actionHistory = [];
  
  // 1試合の合計本数をチェック（最大3本）
  const totalPoints = score.points_history.length;
  if (totalPoints >= 3) {
    alert('1試合の合計は最大3本までです');
    return;
  }
  
  const currentTeamPoints = score.points_history.filter(p => p.player === app.currentTeam).length;
  if (currentTeamPoints >= 2) {
    alert('1人が取れる技は最大2本までです');
    return;
  }
  
  const isFirst = score.points_history.length === 0;
  score.points_history.push({ player: app.currentTeam, point: tech, is_first: isFirst });
  
  score.actionHistory.push({
    team: app.currentTeam,
    type: 'tech',
    tech: tech
  });
  
  score.is_draw = false;
  
  renderIndividualScore();
}

function addDaihyosenTech(tech) {
  const app = window.kendoScoreApp;
  const member = app.daihyosenData;
  
  if (!member) return;
  if (!member.points_history) member.points_history = [];
  if (!member.actionHistory) member.actionHistory = [];
  
  const currentTeamPoints = member.points_history.filter(p => p.player === app.currentTeam).length;
  if (currentTeamPoints >= 1) {
    alert('代表戦は1本勝負です');
    return;
  }
  
  const isFirst = member.points_history.length === 0;
  member.points_history.push({ player: app.currentTeam, point: tech, is_first: isFirst });
  
  member.actionHistory.push({
    team: app.currentTeam,
    type: 'tech',
    tech: tech
  });
  
  member.is_draw = false;
  
  renderDaihyosenScore();
}

// ========================================
// 反則の追加
// ========================================

function addHansoku() {
  const app = window.kendoScoreApp;
  if (!app.currentCell) return;
  
  if (app.matchData && app.matchData.matchType === 'individual') {
    addIndividualHansoku();
    return;
  }
  
  if (app.currentPosition === 'daihyosen') {
    addDaihyosenHansoku();
    return;
  }
  
  if (app.currentPosition === null) return;
  
  const member = app.teamMembersData[app.currentPosition];
  
  if (!member.hansoku_count_my) member.hansoku_count_my = 0;
  if (!member.hansoku_count_opponent) member.hansoku_count_opponent = 0;
  if (!member.actionHistory) member.actionHistory = [];
  
  if (app.currentTeam === 'my') {
    if (member.hansoku_count_my >= 4) {
      alert('反則は最大4回までです');
      return;
    }
    member.hansoku_count_my++;
    
    member.actionHistory.push({
      team: app.currentTeam,
      type: 'hansoku',
      addedPoint: false
    });
    
    if (member.hansoku_count_my % 2 === 0) {
      if (!member.points_history) member.points_history = [];
      
      // 1試合の合計本数をチェック（最大3本）
      const totalPoints = member.points_history.length;
      if (totalPoints >= 3) {
        return;
      }
      
      const opponentPoints = (member.points_history || []).filter(p => p.player === 'opponent').length;
      if (opponentPoints < 2) {
        const isFirst = member.points_history.length === 0;
        member.points_history.push({ 
          player: 'opponent', 
          point: '反', 
          is_first: isFirst,
          is_hansoku: true
        });
        member.actionHistory[member.actionHistory.length - 1].addedPoint = true;
      }
    }
  } else {
    if (member.hansoku_count_opponent >= 4) {
      alert('反則は最大4回までです');
      return;
    }
    member.hansoku_count_opponent++;
    
    member.actionHistory.push({
      team: app.currentTeam,
      type: 'hansoku',
      addedPoint: false
    });
    
    if (member.hansoku_count_opponent % 2 === 0) {
      if (!member.points_history) member.points_history = [];
      
      // 1試合の合計本数をチェック（最大3本）
      const totalPoints = member.points_history.length;
      if (totalPoints >= 3) {
        return;
      }
      
      const myPoints = (member.points_history || []).filter(p => p.player === 'my').length;
      if (myPoints < 2) {
        const isFirst = member.points_history.length === 0;
        member.points_history.push({ 
          player: 'my', 
          point: '反', 
          is_first: isFirst,
          is_hansoku: true
        });
        member.actionHistory[member.actionHistory.length - 1].addedPoint = true;
      }
    }
  }
  
  renderMemberScore(member, app.currentPosition);
}

function addIndividualHansoku() {
  const app = window.kendoScoreApp;
  const score = app.individualScoreData;
  
  if (!score) return;
  if (!score.hansoku_count_my) score.hansoku_count_my = 0;
  if (!score.hansoku_count_opponent) score.hansoku_count_opponent = 0;
  if (!score.actionHistory) score.actionHistory = [];
  
  if (app.currentTeam === 'my') {
    if (score.hansoku_count_my >= 4) {
      alert('反則は最大4回までです');
      return;
    }
    score.hansoku_count_my++;
    
    score.actionHistory.push({
      team: app.currentTeam,
      type: 'hansoku',
      addedPoint: false
    });
    
    if (score.hansoku_count_my % 2 === 0) {
      if (!score.points_history) score.points_history = [];
      
      // 1試合の合計本数をチェック（最大3本）
      const totalPoints = score.points_history.length;
      if (totalPoints >= 3) {
        return;
      }
      
      const opponentPoints = (score.points_history || []).filter(p => p.player === 'opponent').length;
      if (opponentPoints < 2) {
        const isFirst = score.points_history.length === 0;
        score.points_history.push({ 
          player: 'opponent', 
          point: '反', 
          is_first: isFirst,
          is_hansoku: true
        });
        score.actionHistory[score.actionHistory.length - 1].addedPoint = true;
      }
    }
  } else {
    if (score.hansoku_count_opponent >= 4) {
      alert('反則は最大4回までです');
      return;
    }
    score.hansoku_count_opponent++;
    
    score.actionHistory.push({
      team: app.currentTeam,
      type: 'hansoku',
      addedPoint: false
    });
    
    if (score.hansoku_count_opponent % 2 === 0) {
      if (!score.points_history) score.points_history = [];
      
      // 1試合の合計本数をチェック（最大3本）
      const totalPoints = score.points_history.length;
      if (totalPoints >= 3) {
        return;
      }
      
      const myPoints = (score.points_history || []).filter(p => p.player === 'my').length;
      if (myPoints < 2) {
        const isFirst = score.points_history.length === 0;
        score.points_history.push({ 
          player: 'my', 
          point: '反', 
          is_first: isFirst,
          is_hansoku: true
        });
        score.actionHistory[score.actionHistory.length - 1].addedPoint = true;
      }
    }
  }
  
  renderIndividualScore();
}

function addDaihyosenHansoku() {
  const app = window.kendoScoreApp;
  const member = app.daihyosenData;
  
  if (!member) return;
  if (!member.hansoku_count_my) member.hansoku_count_my = 0;
  if (!member.hansoku_count_opponent) member.hansoku_count_opponent = 0;
  if (!member.actionHistory) member.actionHistory = [];
  
  if (app.currentTeam === 'my') {
    if (member.hansoku_count_my >= 2) {
      alert('反則は最大2回までです');
      return;
    }
    member.hansoku_count_my++;
    
    member.actionHistory.push({
      team: app.currentTeam,
      type: 'hansoku',
      addedPoint: false
    });
    
    if (member.hansoku_count_my % 2 === 0) {
      if (!member.points_history) member.points_history = [];
      
      const opponentPoints = (member.points_history || []).filter(p => p.player === 'opponent').length;
      if (opponentPoints < 1) {
        const isFirst = member.points_history.length === 0;
        member.points_history.push({ 
          player: 'opponent', 
          point: '反', 
          is_first: isFirst,
          is_hansoku: true
        });
        member.actionHistory[member.actionHistory.length - 1].addedPoint = true;
      }
    }
  } else {
    if (member.hansoku_count_opponent >= 2) {
      alert('反則は最大2回までです');
      return;
    }
    member.hansoku_count_opponent++;
    
    member.actionHistory.push({
      team: app.currentTeam,
      type: 'hansoku',
      addedPoint: false
    });
    
    if (member.hansoku_count_opponent % 2 === 0) {
      if (!member.points_history) member.points_history = [];
      
      const myPoints = (member.points_history || []).filter(p => p.player === 'my').length;
      if (myPoints < 1) {
        const isFirst = member.points_history.length === 0;
        member.points_history.push({ 
          player: 'my', 
          point: '反', 
          is_first: isFirst,
          is_hansoku: true
        });
        member.actionHistory[member.actionHistory.length - 1].addedPoint = true;
      }
    }
  }
  
  renderDaihyosenScore();
}

// ========================================
// 特殊状態の追加
// ========================================

function addSpecial(type) {
  const app = window.kendoScoreApp;
  if (!app.currentCell) return;
  
  if (app.matchData && app.matchData.matchType === 'individual') {
    addIndividualSpecial(type);
    return;
  }
  
  if (app.currentPosition === 'daihyosen') {
    addDaihyosenSpecial(type);
    return;
  }
  
  if (app.currentPosition === null) return;
  
  const member = app.teamMembersData[app.currentPosition];
  
  member.is_draw = false;
  member.is_hantei = false;
  member.is_fusenshow = false;
  member.is_ipponkachi = false;
  
  if (type === 'draw') {
    member.is_draw = true;
  } else if (type === 'encho') {
    member.is_encho = true;
  } else if (type === 'hantei') {
    member.is_hantei = true;
  } else if (type === 'ipponkachi') {
    member.is_ipponkachi = true;
  } else if (type === 'fusenshow') {
    member.points_history = [
      { player: app.currentTeam, point: '○', is_first: true },
      { player: app.currentTeam, point: '○', is_first: false }
    ];
    member.is_fusenshow = true;
  }
  
  renderMemberScore(member, app.currentPosition);
}

function addIndividualSpecial(type) {
  const app = window.kendoScoreApp;
  const score = app.individualScoreData;
  
  if (!score) return;
  
  score.is_draw = false;
  score.is_hantei = false;
  score.is_fusenshow = false;
  
  if (type === 'draw') {
    score.is_draw = true;
  } else if (type === 'encho') {
    score.is_encho = true;
  } else if (type === 'hantei') {
    score.is_hantei = true;
  } else if (type === 'fusenshow') {
    score.points_history = [
      { player: app.currentTeam, point: '○', is_first: true },
      { player: app.currentTeam, point: '○', is_first: false }
    ];
    score.is_fusenshow = true;
  }
  
  renderIndividualScore();
}

function addDaihyosenSpecial(type) {
  const app = window.kendoScoreApp;
  const member = app.daihyosenData;
  
  if (!member) return;
  
  member.is_draw = false;
  member.is_hantei = false;
  member.is_fusenshow = false;
  
  if (type === 'draw') {
    member.is_draw = true;
  } else if (type === 'encho') {
    member.is_encho = true;
  } else if (type === 'hantei') {
    member.is_hantei = true;
  } else if (type === 'fusenshow') {
    member.points_history = [
      { player: app.currentTeam, point: '○', is_first: true }
    ];
    member.is_fusenshow = true;
  } else if (type === 'ipponkachi') {
    alert('代表戦は1本勝負です');
    return;
  }
  
  renderDaihyosenScore();
}

// ========================================
// クリア・Undo処理
// ========================================

function clearCell() {
  const app = window.kendoScoreApp;
  if (!app.currentCell) return;
  
  if (app.matchData && app.matchData.matchType === 'individual') {
    const score = app.individualScoreData;
    if (!score) return;
    
    score.points_history = [];
    score.is_draw = false;
    score.is_encho = false;
    score.is_hantei = false;
    score.is_fusenshow = false;
    score.hansoku_count_my = 0;
    score.hansoku_count_opponent = 0;
    score.actionHistory = [];
    
    renderIndividualScore();
    return;
  }
  
  if (app.currentPosition === 'daihyosen') {
    const member = app.daihyosenData;
    if (!member) return;
    
    member.points_history = [];
    member.is_draw = false;
    member.is_encho = false;
    member.is_hantei = false;
    member.is_fusenshow = false;
    member.hansoku_count_my = 0;
    member.hansoku_count_opponent = 0;
    member.actionHistory = [];
    
    renderDaihyosenScore();
    return;
  }
  
  if (app.currentPosition === null) return;
  
  const member = app.teamMembersData[app.currentPosition];
  member.points_history = [];
  member.is_draw = false;
  member.is_encho = false;
  member.is_hantei = false;
  member.is_fusenshow = false;
  member.hansoku_count_my = 0;
  member.hansoku_count_opponent = 0;
  member.actionHistory = [];
  
  renderMemberScore(member, app.currentPosition);
}

function undoLastAction() {
  const app = window.kendoScoreApp;
  if (!app.currentCell) return;
  
  if (app.matchData && app.matchData.matchType === 'individual') {
    undoIndividualLastAction();
    return;
  }
  
  if (app.currentPosition === 'daihyosen') {
    undoDaihyosenLastAction();
    return;
  }
  
  if (app.currentPosition === null) return;
  
  const member = app.teamMembersData[app.currentPosition];
  
  if (!member.actionHistory || member.actionHistory.length === 0) {
    alert('戻せる操作がありません');
    return;
  }
  
  const lastAction = member.actionHistory.pop();
  
  if (lastAction.type === 'tech') {
    for (let i = member.points_history.length - 1; i >= 0; i--) {
      if (member.points_history[i].player === lastAction.team && !member.points_history[i].is_hansoku) {
        member.points_history.splice(i, 1);
        break;
      }
    }
  } else if (lastAction.type === 'hansoku') {
    if (lastAction.team === 'my') {
      member.hansoku_count_my--;
      if (lastAction.addedPoint) {
        for (let i = member.points_history.length - 1; i >= 0; i--) {
          if (member.points_history[i].player === 'opponent' && member.points_history[i].is_hansoku) {
            member.points_history.splice(i, 1);
            break;
          }
        }
      }
    } else {
      member.hansoku_count_opponent--;
      if (lastAction.addedPoint) {
        for (let i = member.points_history.length - 1; i >= 0; i--) {
          if (member.points_history[i].player === 'my' && member.points_history[i].is_hansoku) {
            member.points_history.splice(i, 1);
            break;
          }
        }
      }
    }
  }
  
  renderMemberScore(member, app.currentPosition);
}

function undoIndividualLastAction() {
  const app = window.kendoScoreApp;
  const score = app.individualScoreData;
  
  if (!score) return;
  
  if (!score.actionHistory || score.actionHistory.length === 0) {
    alert('戻せる操作がありません');
    return;
  }
  
  const lastAction = score.actionHistory.pop();
  
  if (lastAction.type === 'tech') {
    for (let i = score.points_history.length - 1; i >= 0; i--) {
      if (score.points_history[i].player === lastAction.team && !score.points_history[i].is_hansoku) {
        score.points_history.splice(i, 1);
        break;
      }
    }
  } else if (lastAction.type === 'hansoku') {
    if (lastAction.team === 'my') {
      score.hansoku_count_my--;
      if (lastAction.addedPoint) {
        for (let i = score.points_history.length - 1; i >= 0; i--) {
          if (score.points_history[i].player === 'opponent' && score.points_history[i].is_hansoku) {
            score.points_history.splice(i, 1);
            break;
          }
        }
      }
    } else {
      score.hansoku_count_opponent--;
      if (lastAction.addedPoint) {
        for (let i = score.points_history.length - 1; i >= 0; i--) {
          if (score.points_history[i].player === 'my' && score.points_history[i].is_hansoku) {
            score.points_history.splice(i, 1);
            break;
          }
        }
      }
    }
  }
  
  renderIndividualScore();
}

function undoDaihyosenLastAction() {
  const app = window.kendoScoreApp;
  const member = app.daihyosenData;
  
  if (!member) return;
  
  if (!member.actionHistory || member.actionHistory.length === 0) {
    alert('戻せる操作がありません');
    return;
  }
  
  const lastAction = member.actionHistory.pop();
  
  if (lastAction.type === 'tech') {
    for (let i = member.points_history.length - 1; i >= 0; i--) {
      if (member.points_history[i].player === lastAction.team && !member.points_history[i].is_hansoku) {
        member.points_history.splice(i, 1);
        break;
      }
    }
  } else if (lastAction.type === 'hansoku') {
    if (lastAction.team === 'my') {
      member.hansoku_count_my--;
      if (lastAction.addedPoint) {
        for (let i = member.points_history.length - 1; i >= 0; i--) {
          if (member.points_history[i].player === 'opponent' && member.points_history[i].is_hansoku) {
            member.points_history.splice(i, 1);
            break;
          }
        }
      }
    } else {
      member.hansoku_count_opponent--;
      if (lastAction.addedPoint) {
        for (let i = member.points_history.length - 1; i >= 0; i--) {
          if (member.points_history[i].player === 'my' && member.points_history[i].is_hansoku) {
            member.points_history.splice(i, 1);
            break;
          }
        }
      }
    }
  }
  
  renderDaihyosenScore();
}