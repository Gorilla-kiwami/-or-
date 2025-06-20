let score = 0;
let bestScore10sec = 0;
let currentIsTarget = null;
let timerId = null;
let timeLeft = 0;
let in10SecMode = false;
let isGameActive = false;

let correctStreak = 0;       // 現在の連続正解（ゲーム中）
let maniaStreak = 0;         // 現在のマニア連続正解
let seniorStreak = 0;        // 現在のシニア連続正解

let maxManiaStreak = 0;      // 今までの最大マニア連続
let maxSeniorStreak = 0;     // 今までの最大シニア連続
let totalCorrect = 0;        // 全ゲーム通算正解数

const achievementsUnlocked = new Set();

const gameArea = document.getElementById('game-area');
const scoreDisplay = document.getElementById('score');
const bestScoreDisplay = document.getElementById('best-score');
const maniaBtn = document.getElementById('mania-btn');
const seniorBtn = document.getElementById('senior-btn');
const startNormalBtn = document.getElementById('start-normal-btn');
const start10SecBtn = document.getElementById('start-10sec-btn');
const timerDisplay = document.getElementById('timer');
const achievementContainer = document.getElementById('achievement-container');
const achievementList = document.getElementById('achievement-list');

// 進捗リスト（最大連続のみ）
const progressList = [
  // マニア最大連続 1〜20
  ...Array.from({ length: 20 }, (_, i) => {
    const n = i + 1;
    return {
      name: `マニア${n}連続`,
      condition: () => maxManiaStreak >= n,
      probPercent: (Math.pow(0.7, n) * 100).toFixed(6) + '%'
    };
  }),
  // シニア最大連続 1〜7
  ...Array.from({ length: 7 }, (_, i) => {
    const n = i + 1;
    return {
      name: `シニア${n}連続`,
      condition: () => maxSeniorStreak >= n,
      probPercent: (Math.pow(0.3, n) * 100).toFixed(6) + '%'
    };
  }),
  // 連続正解50回
  {
    name: '連続正解50回',
    condition: () => correctStreak >= 50
  },
  // 10秒モード5点以上
  {
    name: '10秒モードで5点以上',
    condition: () => bestScore10sec >= 5
  },
  // 10秒モードで20点以上
  {
    name: '10秒モードで20点以上',
    condition: () => bestScore10sec >= 20
  },
  // 合計正解500回
  {
    name: '合計正解500回',
    condition: () => totalCorrect >= 500
  }
];

function spawnIcon() {
  gameArea.innerHTML = '';
  const isTarget = Math.random() < 0.7;
  currentIsTarget = isTarget;

  const icon = document.createElement('img');
  icon.classList.add('icon');
  icon.src = isTarget ? 'images/target.png' : 'images/fake.png';

  const size = Math.floor(Math.random() * 16) + 20;
  icon.style.width = icon.style.height = `${size}px`;
  icon.style.top = `${Math.random() * (300 - size)}px`;
  icon.style.left = `${Math.random() * (300 - size)}px`;

  gameArea.appendChild(icon);
}

function updateScoreDisplay() {
  scoreDisplay.textContent = score;
  bestScoreDisplay.textContent = bestScore10sec;
}

function resetGame() {
  clearInterval(timerId);
  timerId = null;
  timeLeft = 0;
  score = 0;
  correctStreak = 0;
  maniaStreak = 0;
  seniorStreak = 0;

  updateScoreDisplay();
  maniaBtn.disabled = true;
  seniorBtn.disabled = true;
  startNormalBtn.disabled = false;
  start10SecBtn.disabled = false;
  isGameActive = false;

  updateAchievementMenu();
  spawnIcon();
}

function gameOver(message = 'ゲームオーバー！') {
  alert(`${message} スコア: ${score}`);

  if (in10SecMode && score > bestScore10sec) {
    bestScore10sec = score;
    alert(`新記録！ スコア: ${bestScore10sec}`);
  }
  resetGame();
}

function checkAnswer(isManiaSelected) {
  if ((currentIsTarget && isManiaSelected) || (!currentIsTarget && !isManiaSelected)) {
    score++;
    correctStreak++;
    totalCorrect++;

    if (currentIsTarget) {
      maniaStreak++;
      seniorStreak = 0;
      if (maniaStreak > maxManiaStreak) maxManiaStreak = maniaStreak;
    } else {
      seniorStreak++;
      maniaStreak = 0;
      if (seniorStreak > maxSeniorStreak) maxSeniorStreak = seniorStreak;
    }

    updateScoreDisplay();
    checkAchievements();
    spawnIcon();
  } else {
    gameOver();
  }
}

function checkAchievements() {
  for (const ach of progressList) {
    if (ach.condition() && !achievementsUnlocked.has(ach.name)) {
      achievementsUnlocked.add(ach.name);
      showAchievement(`進捗解除: ${ach.name} ${ach.probPercent ? `(確率: ${ach.probPercent})` : ''}`);
      updateAchievementMenu();
    }
  }
}

function showAchievement(text) {
  const div = document.createElement('div');
  div.classList.add('achievement');
  div.textContent = text;
  achievementContainer.appendChild(div);

  setTimeout(() => div.classList.add('show'), 100);
  setTimeout(() => {
    div.classList.remove('show');
    setTimeout(() => div.remove(), 500);
  }, 3000);
}

function updateAchievementMenu() {
  achievementList.innerHTML = '';
  for (const ach of progressList) {
    if (achievementsUnlocked.has(ach.name)) {
      const li = document.createElement('li');
      li.textContent = `${ach.name}${ach.probPercent ? ` (確率: ${ach.probPercent})` : ''}`;
      li.className = 'unlocked';
      achievementList.appendChild(li);
    }
  }
}

function startNormalMode() {
  in10SecMode = false;
  score = 0;
  correctStreak = 0;
  maniaStreak = 0;
  seniorStreak = 0;
  updateScoreDisplay();
  maniaBtn.disabled = false;
  seniorBtn.disabled = false;
  startNormalBtn.disabled = true;
  start10SecBtn.disabled = false;
  isGameActive = true;
  spawnIcon();
}

function start10SecMode() {
  in10SecMode = true;
  score = 0;
  timeLeft = 10;
  correctStreak = 0;
  maniaStreak = 0;
  seniorStreak = 0;
  updateScoreDisplay();
  maniaBtn.disabled = false;
  seniorBtn.disabled = false;
  startNormalBtn.disabled = false;
  start10SecBtn.disabled = true;
  isGameActive = true;
  spawnIcon();

  timerDisplay.textContent = `残り時間: ${timeLeft}秒`;
  timerId = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = `残り時間: ${timeLeft}秒`;
    if (timeLeft <= 0) {
      clearInterval(timerId);
      gameOver('10秒終了！');
    }
  }, 1000);
}

maniaBtn.addEventListener('click', () => {
  if (isGameActive) checkAnswer(true);
});
seniorBtn.addEventListener('click', () => {
  if (isGameActive) checkAnswer(false);
});
startNormalBtn.addEventListener('click', startNormalMode);
start10SecBtn.addEventListener('click', start10SecMode);

document.addEventListener('keydown', (e) => {
  if (!isGameActive) return;
  if (e.key.toLowerCase() === 'f') checkAnswer(true);
  if (e.key.toLowerCase() === 'j') checkAnswer(false);
});

resetGame();
updateAchievementMenu();
