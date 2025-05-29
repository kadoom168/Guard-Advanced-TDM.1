const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth * 0.95;
canvas.height = window.innerHeight * 0.75;

let gameState = "menu"; // menu, playing, paused, gameover
let towers = [];
let enemies = [];
let bullets = [];
let gold = 100;
let baseHealth = 100;
let gameLevel = 1;
let lastTime = 0;

// Temel oyun fonksiyonları

function startGame() {
  gameState = "playing";
  document.getElementById("mainMenu").classList.add("hidden");
  document.getElementById("gameCanvas").classList.remove("hidden");
  resetGame();
  requestAnimationFrame(gameLoop);
}

function resetGame() {
  towers = [];
  enemies = [];
  bullets = [];
  gold = 100;
  baseHealth = 100;
  gameLevel = 1;
  spawnEnemies();
}

function spawnEnemies() {
  for(let i=0; i<gameLevel + 3; i++) {
    enemies.push({
      x: canvas.width,
      y: canvas.height * 0.6,
      width: 30,
      height: 30,
      health: 20 + gameLevel * 10,
      speed: 1 + gameLevel * 0.2,
      alive: true,
      type: "basic"
    });
  }
}

function update(dt) {
  // Düşman hareketleri
  enemies.forEach(enemy => {
    enemy.x -= enemy.speed * dt;
    if(enemy.x < 50) {
      baseHealth -= 10;
      enemy.alive = false;
    }
  });

  enemies = enemies.filter(e => e.alive && e.health > 0);

  if(enemies.length === 0) {
    gameLevel++;
    spawnEnemies();
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Üs
  ctx.fillStyle = "darkred";
  ctx.fillRect(20, canvas.height * 0.55, 40, 70);

  // Düşmanlar
  enemies.forEach(enemy => {
    ctx.fillStyle = "red";
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
  });

  // Durum bilgisi
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText(`Seviye: ${gameLevel}`, 10, 25);
  ctx.fillText(`Üs Sağlığı: ${baseHealth}`, 10, 50);
  ctx.fillText(`Altın: ${gold}`, 10, 75);
}

function gameLoop(timestamp) {
  if(!lastTime) lastTime = timestamp;
  const dt = (timestamp - lastTime) / 16; // normalize frame rate
  lastTime = timestamp;

  if(gameState === "playing") {
    update(dt);
    draw();

    if(baseHealth <= 0) {
      gameState = "gameover";
      alert("Oyun bitti!");
      location.reload();
      return;
    }
  }
  requestAnimationFrame(gameLoop);
}

// Menü fonksiyonları

function toggleSettings() {
  document.getElementById("mainMenu").classList.add("hidden");
  document.getElementById("settingsMenu").classList.remove("hidden");
}

function toggleAbout() {
  document.getElementById("mainMenu").classList.add("hidden");
  document.getElementById("aboutMenu").classList.remove("hidden");
}

function backToMain() {
  document.getElementById("settingsMenu").classList.add("hidden");
  document.getElementById("aboutMenu").classList.add("hidden");
  document.getElementById("mainMenu").classList.remove("hidden");
}

// Oyun alanına tıklayınca kule yerleştirme

canvas.addEventListener("click", e => {
  if(gameState !== "playing") return;
  if(gold < 50) return;

  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  towers.push({ x, y, range: 100, damage: 10, cooldown: 0 });
  gold -= 50;
});
