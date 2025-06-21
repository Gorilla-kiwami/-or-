let score = 0;
const gameArea = document.getElementById('game-area');
const scoreDisplay = document.getElementById('score');
const maniaBtn = document.getElementById('mania-btn');
const seniorBtn = document.getElementById('senior-btn');

let currentIsTarget = null;

function randomPosition() {
    return Math.floor(Math.random() * (300 - 30)); // 安全なランダム位置
}

function spawnIcon() {
    gameArea.innerHTML = '';

    const isTarget = Math.random() < 0.7;
    currentIsTarget = isTarget;

    const icon = document.createElement('img');
    icon.classList.add('icon');
    icon.src = isTarget ? 'images/target.png' : 'images/fake.png';
    icon.style.top = `${randomPosition()}px`;
    icon.style.left = `${randomPosition()}px`;

    gameArea.appendChild(icon);
}

function gameOver() {
    alert('ゲームオーバー！スコア: ' + score);
    score = 0;
    scoreDisplay.textContent = score;
    spawnIcon();
}

function checkAnswer(isManiaSelected) {
    if ((currentIsTarget && isManiaSelected) || (!currentIsTarget && !isManiaSelected)) {
        score++;
        scoreDisplay.textContent = score;
        spawnIcon();
    } else {
        gameOver();
    }
}

maniaBtn.addEventListener('click', () => checkAnswer(true));
seniorBtn.addEventListener('click', () => checkAnswer(false));

spawnIcon();
