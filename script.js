const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Game constants
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 100;
const BALL_SIZE = 16;
const PLAYER_X = 20;
const AI_X = canvas.width - PLAYER_X - PADDLE_WIDTH;
const PADDLE_SPEED = 7;
const BALL_SPEED = 6;
const AI_SPEED = 5;

// State
let playerY = canvas.height / 2 - PADDLE_HEIGHT / 2;
let aiY = canvas.height / 2 - PADDLE_HEIGHT / 2;
let ball = {
  x: canvas.width / 2 - BALL_SIZE / 2,
  y: canvas.height / 2 - BALL_SIZE / 2,
  vx: BALL_SPEED * (Math.random() > 0.5 ? 1 : -1),
  vy: BALL_SPEED * (Math.random() * 2 - 1),
};
let playerScore = 0;
let aiScore = 0;

// Mouse movement controls player paddle
canvas.addEventListener('mousemove', function(e) {
  const rect = canvas.getBoundingClientRect();
  const mouseY = e.clientY - rect.top;
  playerY = mouseY - PADDLE_HEIGHT / 2;
  // Clamp within canvas
  playerY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, playerY));
});

// Utility: Draw everything
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw paddles
  ctx.fillStyle = '#fff';
  ctx.fillRect(PLAYER_X, playerY, PADDLE_WIDTH, PADDLE_HEIGHT);
  ctx.fillRect(AI_X, aiY, PADDLE_WIDTH, PADDLE_HEIGHT);

  // Draw ball
  ctx.fillStyle = '#ffd700';
  ctx.fillRect(ball.x, ball.y, BALL_SIZE, BALL_SIZE);
}

// Ball movement and collision
function updateBall() {
  ball.x += ball.vx;
  ball.y += ball.vy;

  // Top/bottom wall collision
  if (ball.y <= 0) {
    ball.y = 0;
    ball.vy *= -1;
  }
  if (ball.y + BALL_SIZE >= canvas.height) {
    ball.y = canvas.height - BALL_SIZE;
    ball.vy *= -1;
  }

  // Left paddle collision
  if (
    ball.x <= PLAYER_X + PADDLE_WIDTH &&
    ball.y + BALL_SIZE > playerY &&
    ball.y < playerY + PADDLE_HEIGHT
  ) {
    ball.x = PLAYER_X + PADDLE_WIDTH;
    ball.vx *= -1;
    // Add variation based on where it hit
    ball.vy = ((ball.y + BALL_SIZE / 2) - (playerY + PADDLE_HEIGHT / 2)) * 0.2;
  }

  // Right paddle (AI) collision
  if (
    ball.x + BALL_SIZE >= AI_X &&
    ball.y + BALL_SIZE > aiY &&
    ball.y < aiY + PADDLE_HEIGHT
  ) {
    ball.x = AI_X - BALL_SIZE;
    ball.vx *= -1;
    ball.vy = ((ball.y + BALL_SIZE / 2) - (aiY + PADDLE_HEIGHT / 2)) * 0.2;
  }

  // Left/Right wall (score)
  if (ball.x < 0) {
    aiScore++;
    resetBall(-1);
  }
  if (ball.x + BALL_SIZE > canvas.width) {
    playerScore++;
    resetBall(1);
  }
}

// Reset ball after scoring
function resetBall(direction) {
  ball.x = canvas.width / 2 - BALL_SIZE / 2;
  ball.y = canvas.height / 2 - BALL_SIZE / 2;
  ball.vx = BALL_SPEED * direction;
  ball.vy = BALL_SPEED * (Math.random() * 2 - 1);
  document.getElementById('playerScore').textContent = playerScore;
  document.getElementById('aiScore').textContent = aiScore;
}

// AI paddle movement (follows ball)
function updateAI() {
  const target = ball.y + BALL_SIZE / 2 - PADDLE_HEIGHT / 2;
  if (aiY < target) {
    aiY += AI_SPEED;
    if (aiY > target) aiY = target;
  } else if (aiY > target) {
    aiY -= AI_SPEED;
    if (aiY < target) aiY = target;
  }
  // Clamp within canvas
  aiY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, aiY));
}

// Main game loop
function gameLoop() {
  updateBall();
  updateAI();
  draw();
  requestAnimationFrame(gameLoop);
}

// Start game
gameLoop();