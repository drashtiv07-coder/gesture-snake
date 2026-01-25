const video = document.getElementById("video");
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const statusText = document.getElementById("status");

const box = 20;
const rows = canvas.width / box;
const cols = canvas.height / box;

let snake = [{ x: 10, y: 10 }];
let direction = null;
let food = {
  x: Math.floor(Math.random() * rows),
  y: Math.floor(Math.random() * cols)
};

let gameStarted = false;
let lastGestureTime = 0;

// 🔹 DRAW BACKGROUND ALWAYS
function drawBackground() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// 🔹 DRAW GAME
function drawGame() {
  drawBackground();

  // food
  ctx.fillStyle = "red";
  ctx.fillRect(food.x * box, food.y * box, box, box);

  // snake
  ctx.fillStyle = "lime";
  snake.forEach(part => {
    ctx.fillRect(part.x * box, part.y * box, box, box);
  });
}

// 🔹 MOVE SNAKE
function moveSnake() {
  if (!direction) return;

  let head = { ...snake[0] };

  if (direction === "LEFT") head.x--;
  if (direction === "RIGHT") head.x++;
  if (direction === "UP") head.y--;
  if (direction === "DOWN") head.y++;

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    food = {
      x: Math.floor(Math.random() * rows),
      y: Math.floor(Math.random() * cols)
    };
  } else {
    snake.pop();
  }
}

// 🔹 GAME LOOP
function gameLoop() {
  moveSnake();
  drawGame();
}

// 🔹 START GAME
function startGame() {
  if (gameStarted) return;
  gameStarted = true;
  statusText.innerText = "Game Started!";
  setInterval(gameLoop, 200);
}

// INITIAL DRAW (VERY IMPORTANT)
drawGame();

// 📷 CAMERA
navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
  video.srcObject = stream;
});

// ✋ MEDIAPIPE
const hands = new Hands({
  locateFile: file =>
    `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
});

hands.setOptions({
  maxNumHands: 1,
  minDetectionConfidence: 0.7,
  minTrackingConfidence: 0.7
});

hands.onResults(results => {
  if (!results.multiHandLandmarks) return;

  if (!gameStarted) startGame();

  const now = Date.now();
  if (now - lastGestureTime < 300) return;
  lastGestureTime = now;

  const hand = results.multiHandLandmarks[0];
  const x = hand[9].x;
  const y = hand[9].y;

  if (x < 0.3) direction = "LEFT";
  else if (x > 0.7) direction = "RIGHT";
  else if (y < 0.3) direction = "UP";
  else if (y > 0.7) direction = "DOWN";
});

const camera = new Camera(video, {
  onFrame: async () => {
    await hands.send({ image: video });
  },
  width: 640,
  height: 480
});
camera.start();
