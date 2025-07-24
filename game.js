const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game settings
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 100;
const BALL_RADIUS = 10;
const PLAYER_X = 10;
const AI_X = canvas.width - PADDLE_WIDTH - 10;

let playerY = (canvas.height - PADDLE_HEIGHT) / 2;
let aiY = (canvas.height - PADDLE_HEIGHT) / 2;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 5 * (Math.random() > 0.5 ? 1 : -1);
let ballSpeedY = 4 * (Math.random() > 0.5 ? 1 : -1);

let playerScore = 0;
let aiScore = 0;

// Listen for mouse movement to control the left paddle
canvas.addEventListener('mousemove', function(evt) {
    const rect = canvas.getBoundingClientRect();
    const mouseY = evt.clientY - rect.top;
    playerY = mouseY - PADDLE_HEIGHT / 2;
    // Clamp paddle within canvas
    playerY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, playerY));
});

// Draw functions
function drawRect(x, y, w, h, color = '#fff') {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color = '#fff') {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
}

function drawText(text, x, y, size = '32px', color = '#fff') {
    ctx.fillStyle = color;
    ctx.font = `${size} Arial`;
    ctx.fillText(text, x, y);
}

// Reset ball to center
function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = 5 * (Math.random() > 0.5 ? 1 : -1);
    ballSpeedY = 4 * (Math.random() > 0.5 ? 1 : -1);
}

// Simple AI to follow the ball
function aiMove() {
    const centerAIPaddle = aiY + PADDLE_HEIGHT / 2;
    if(centerAIPaddle < ballY - 10) {
        aiY += 5;
    } else if(centerAIPaddle > ballY + 10) {
        aiY -= 5;
    }
    // Clamp AI paddle within canvas
    aiY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, aiY));
}

// Collision detection
function collision(x, y, paddleX, paddleY) {
    return (
        x + BALL_RADIUS > paddleX &&
        x - BALL_RADIUS < paddleX + PADDLE_WIDTH &&
        y + BALL_RADIUS > paddleY &&
        y - BALL_RADIUS < paddleY + PADDLE_HEIGHT
    );
}

// Main game loop
function game() {
    // Move ball
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Wall collision (top/bottom)
    if(ballY - BALL_RADIUS < 0 || ballY + BALL_RADIUS > canvas.height) {
        ballSpeedY = -ballSpeedY;
    }

    // Paddle collision (player)
    if(collision(ballX, ballY, PLAYER_X, playerY)) {
        ballSpeedX = -ballSpeedX;
        // Add spin based on where ball hits the paddle
        let deltaY = ballY - (playerY + PADDLE_HEIGHT / 2);
        ballSpeedY = deltaY * 0.25;
    }

    // Paddle collision (AI)
    if(collision(ballX, ballY, AI_X, aiY)) {
        ballSpeedX = -ballSpeedX;
        let deltaY = ballY - (aiY + PADDLE_HEIGHT / 2);
        ballSpeedY = deltaY * 0.25;
    }

    // Score tracking
    if(ballX - BALL_RADIUS < 0) {
        aiScore++;
        resetBall();
    } else if(ballX + BALL_RADIUS > canvas.width) {
        playerScore++;
        resetBall();
    }

    // AI movement
    aiMove();

    // Draw everything
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw paddles
    drawRect(PLAYER_X, playerY, PADDLE_WIDTH, PADDLE_HEIGHT);
    drawRect(AI_X, aiY, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Draw ball
    drawCircle(ballX, ballY, BALL_RADIUS);

    // Draw net
    for(let i = 0; i < canvas.height; i += 30) {
        drawRect(canvas.width/2 - 1, i, 2, 15, '#888');
    }

    // Draw scores
    drawText(playerScore, canvas.width/4, 50, '32px');
    drawText(aiScore, 3*canvas.width/4, 50, '32px');

    requestAnimationFrame(game);
}

// Start the game
game();