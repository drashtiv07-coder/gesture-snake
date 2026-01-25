const video = document.getElementById("video");
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let snake = [{ x: 200, y: 200 }];
let direction = "RIGHT";
let food = { x: 100, y: 100 };
let size = 20;

let gameStarted = false;
let gameInterval = null;

// gesture control helpers
let lastGestureTime = 0;
const GESTURE_DELAY = 300; // ms

// 🎮 START GAME AFTER CAMERA
function startGame() {
  if (!gameStarted) {
    gameStarted = true;
    gameInterval = setInterval(gameLoop, 200);
  }
}

function gameLoop() {
  moveSnake();
  drawGame();
}

function moveSnake() {
  let head = { ...snake[0] };

  if (direction === "LEFT") head.x -= size;
  if (direction === "RIGHT") head.x += size;
  if (direction === "UP") head.y -= size;
  if (direction === "DOWN") head.y += size;

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    food = {
      x: Math.floor(Math.random() * 20) * size,
      y: Math.floor(Math.random() * 20) * size
    };
  } else {
    snake.pop();
  }
}

function drawGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "lime";
  snake.forEach(s => ctx.fillRect(s.x, s.y, size, size));

  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, size, size);
}

// 🚫 BLOCK OPPOSITE DIRECTION
function setDirection(newDir) {
  if (
    (direction === "LEFT" && newDir === "RIGHT") ||
    (direction === "RIGHT" && newDir === "LEFT") ||
    (direction === "UP" && newDir === "DOWN") ||
    (direction === "DOWN" && newDir === "UP")
  ) return;

  direction = newDir;
}

// 📷 CAMERA PERMISSION
navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
  video.srcObject = stream;
  startGame();
});

// ✋ MEDIAPIPE HANDS
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

  const now = Date.now();
  if (now - lastGestureTime < GESTURE_DELAY) return;

  const hand = results.multiHandLandmarks[0];

  // 🖐️ Palm center (more stable)
  const x = hand[9].x;
  const y = hand[9].y;

  // 🛑 DEAD ZONE (center)
  if (x > 0.4 && x < 0.6 && y > 0.4 && y < 0.6) return;

  if (x < 0.3) setDirection("LEFT");
  else if (x > 0.7) setDirection("RIGHT");
  else if (y < 0.3) setDirection("UP");
  else if (y > 0.7) setDirection("DOWN");

  lastGestureTime = now;
});

const camera = new Camera(video, {
  onFrame: async () => {
    await hands.send({ image: video });
  },
  width: 640,
  height: 480
});
camera.start();
