// Canvas setup
const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Game variables
const paddleHeight = 100;
const paddleWidth = 10;
const ballSize = 8;

let playerScore = 0;
let computerScore = 0;

// Paddles
const paddleLeft = {
    x: 10,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    speed: 6,
    dy: 0
};

const paddleRight = {
    x: canvas.width - paddleWidth - 10,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    speed: 5
};

// Ball
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: ballSize,
    speedX: 5,
    speedY: 5,
    maxSpeed: 8
};

// Input handling
const keys = {};
let mouseY = canvas.height / 2;

document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

document.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseY = e.clientY - rect.top;
});

// Update player paddle position
function updatePlayerPaddle() {
    // Arrow keys
    if (keys['ArrowUp'] && paddleLeft.y > 0) {
        paddleLeft.y -= paddleLeft.speed;
    }
    if (keys['ArrowDown'] && paddleLeft.y < canvas.height - paddleLeft.height) {
        paddleLeft.y += paddleLeft.speed;
    }

    // Mouse control
    const targetY = mouseY - paddleLeft.height / 2;
    if (targetY > 0 && targetY < canvas.height - paddleLeft.height) {
        paddleLeft.y = targetY;
    }
}

// Update computer paddle (AI)
function updateComputerPaddle() {
    const paddleCenter = paddleRight.y + paddleRight.height / 2;
    const ballCenter = ball.y;
    const diff = ballCenter - paddleCenter;

    if (Math.abs(diff) > 10) {
        if (diff > 0 && paddleRight.y < canvas.height - paddleRight.height) {
            paddleRight.y += paddleRight.speed;
        } else if (diff < 0 && paddleRight.y > 0) {
            paddleRight.y -= paddleRight.speed;
        }
    }
}

// Update ball position
function updateBall() {
    ball.x += ball.speedX;
    ball.y += ball.speedY;

    // Ball collision with top and bottom walls
    if (ball.y - ball.size < 0 || ball.y + ball.size > canvas.height) {
        ball.speedY = -ball.speedY;
        ball.y = Math.max(ball.size, Math.min(canvas.height - ball.size, ball.y));
    }

    // Ball collision with paddles
    if (
        ball.x - ball.size < paddleLeft.x + paddleLeft.width &&
        ball.y > paddleLeft.y &&
        ball.y < paddleLeft.y + paddleLeft.height
    ) {
        ball.speedX = -ball.speedX;
        ball.x = paddleLeft.x + paddleLeft.width + ball.size;
        
        // Add spin based on where ball hits paddle
        const collidePoint = (ball.y - (paddleLeft.y + paddleLeft.height / 2)) / (paddleLeft.height / 2);
        ball.speedY = collidePoint * ball.maxSpeed;
        
        // Increase speed slightly
        ball.speedX *= 1.05;
        ball.speedX = Math.min(ball.speedX, ball.maxSpeed);
    }

    if (
        ball.x + ball.size > paddleRight.x &&
        ball.y > paddleRight.y &&
        ball.y < paddleRight.y + paddleRight.height
    ) {
        ball.speedX = -ball.speedX;
        ball.x = paddleRight.x - ball.size;
        
        // Add spin based on where ball hits paddle
        const collidePoint = (ball.y - (paddleRight.y + paddleRight.height / 2)) / (paddleRight.height / 2);
        ball.speedY = collidePoint * ball.maxSpeed;
        
        // Increase speed slightly
        ball.speedX *= 1.05;
        ball.speedX = Math.min(Math.abs(ball.speedX), ball.maxSpeed) * (ball.speedX > 0 ? 1 : -1);
    }

    // Ball out of bounds - score points
    if (ball.x < 0) {
        computerScore++;
        resetBall();
        document.getElementById('computerScore').textContent = computerScore;
    }

    if (ball.x > canvas.width) {
        playerScore++;
        resetBall();
        document.getElementById('playerScore').textContent = playerScore;
    }
}

// Reset ball to center
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speedX = (Math.random() > 0.5 ? 1 : -1) * 5;
    ball.speedY = (Math.random() - 0.5) * 5;
}

// Draw functions
function drawPaddle(paddle, color) {
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 10;
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.shadowBlur = 0;
}

function drawBall() {
    ctx.fillStyle = '#ff1493';
    ctx.shadowColor = '#ff1493';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
}

function drawCenterLine() {
    ctx.strokeStyle = 'rgba(0, 255, 136, 0.3)';
    ctx.setLineDash([5, 15]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
}

// Main game loop
function gameLoop() {
    // Clear canvas
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw center line
    drawCenterLine();

    // Update game state
    updatePlayerPaddle();
    updateComputerPaddle();
    updateBall();

    // Draw game objects
    drawPaddle(paddleLeft, '#00ff88');
    drawPaddle(paddleRight, '#00ff88');
    drawBall();

    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();
