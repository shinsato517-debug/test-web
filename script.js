const character = document.getElementById('character');
const obstacle = document.getElementById('obstacle');
const scoreSpan = document.getElementById('score');
const gameOverScreen = document.getElementById('game-over');
const restartButton = document.getElementById('restart-button');

let score = 0;
let gameInterval;
let obstacleInterval;
let isJumping = false;
let isGameOver = false;

// ジャンプ処理
function jump() {
    if (isJumping || isGameOver) return;
    isJumping = true;
    character.classList.add('jump');
    setTimeout(() => {
        character.classList.remove('jump');
        isJumping = false;
    }, 500); // アニメーションの時間と合わせる
}

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        jump();
    }
});

document.addEventListener('click', jump);

// 障害物を動かす
function moveObstacle() {
    if (isGameOver) return;
    let obstaclePosition = 800; // game-containerの幅
    obstacle.style.right = obstaclePosition + 'px';

    const move = () => {
        if (isGameOver) {
            clearInterval(obstacleInterval);
            return;
        }
        obstaclePosition -= 5; // 障害物の速度
        obstacle.style.right = obstaclePosition + 'px';

        if (obstaclePosition < -30) { // 画面外に出たら
            obstaclePosition = 800;
        }
    };
    obstacleInterval = setInterval(move, 10);
}

// 衝突判定
function checkCollision() {
    const characterRect = character.getBoundingClientRect();
    const obstacleRect = obstacle.getBoundingClientRect();

    if (
        characterRect.bottom > obstacleRect.top &&
        characterRect.top < obstacleRect.bottom &&
        characterRect.right > obstacleRect.left &&
        characterRect.left < obstacleRect.right
    ) {
        endGame();
    }
}

// スコアを更新
function updateScore() {
    if (isGameOver) return;
    score++;
    scoreSpan.textContent = score;
}

// ゲーム開始
function startGame() {
    isGameOver = false;
    score = 0;
    scoreSpan.textContent = score;
    gameOverScreen.classList.add('hidden');
    
    // 障害物の位置を初期化
    obstacle.style.right = '-30px';

    gameInterval = setInterval(() => {
        updateScore();
        checkCollision();
    }, 100);

    moveObstacle();
}

// ゲームオーバー処理
function endGame() {
    isGameOver = true;
    clearInterval(gameInterval);
    clearInterval(obstacleInterval); // 障害物の動きを止める
    gameOverScreen.classList.remove('hidden');
}

// リスタート処理
restartButton.addEventListener('click', () => {
    // 障害物のインターバルが残っていればクリア
    if(obstacleInterval) clearInterval(obstacleInterval);
    startGame();
});

// ゲーム開始
startGame();
