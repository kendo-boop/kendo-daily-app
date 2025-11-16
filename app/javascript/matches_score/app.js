// ========================================
// グローバル変数の初期化
// ========================================

if (typeof window.kendoScoreApp === 'undefined') {
  window.kendoScoreApp = {
    currentCell: null,
    currentMemberId: null,
    currentTeam: null,
    currentPosition: null,
    teamMembersData: [],
    matchData: null,
    daihyosenData: null,
    hasDaihyosen: false,
    individualScoreData: null
  };
}

// ========================================
// ページ読み込み時の初期化
// ========================================

document.addEventListener('DOMContentLoaded', function() {
  initializeData();
  
  // 試合タイプに応じて初期化
  if (window.kendoScoreApp.matchData && window.kendoScoreApp.matchData.matchType === 'individual') {
    initializeIndividualScore();
  } else {
    initializeScores();
    initializeDaihyosen();
  }
});

// ========================================
// データの初期化
// ========================================

function initializeData() {
  const teamMembersDataEl = document.getElementById('team-members-data');
  const matchDataEl = document.getElementById('match-data');
  const daihyosenDataEl = document.getElementById('daihyosen-data');
  const individualScoreDataEl = document.getElementById('individual-score-data');
  
  if (teamMembersDataEl) {
    window.kendoScoreApp.teamMembersData = JSON.parse(teamMembersDataEl.textContent);
    console.log('Loaded team members data:', window.kendoScoreApp.teamMembersData);
  }
  
  if (matchDataEl) {
    window.kendoScoreApp.matchData = JSON.parse(matchDataEl.textContent);
    console.log('Loaded match data:', window.kendoScoreApp.matchData);
  }
  
  if (daihyosenDataEl) {
    window.kendoScoreApp.daihyosenData = JSON.parse(daihyosenDataEl.textContent);
    console.log('Loaded daihyosen data:', window.kendoScoreApp.daihyosenData);
  }
  
  if (individualScoreDataEl) {
    window.kendoScoreApp.individualScoreData = JSON.parse(individualScoreDataEl.textContent);
    // actionHistoryを初期化
    if (!window.kendoScoreApp.individualScoreData.actionHistory) {
      window.kendoScoreApp.individualScoreData.actionHistory = [];
    }
    console.log('Loaded individual score data:', window.kendoScoreApp.individualScoreData);
  }
}

// ========================================
// 技の表示名を取得
// ========================================

function displayPoint(point) {
  const map = { 'men': 'メ', 'kote': 'コ', 'do': 'ド', 'tsuki': 'ツ', '反': '反' };
  return map[point] || point;
}

// ========================================
// パネル外をクリックしたら閉じる
// ========================================

document.addEventListener('click', function(e) {
  const panel = document.getElementById('techPanel');
  if (panel && !panel.contains(e.target) && !e.target.closest('.points-cell')) {
    closeTechPanel();
  }
});