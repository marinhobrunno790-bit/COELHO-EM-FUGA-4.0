const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const bg = new Image(); bg.src="assets/bg.png";
const trees = new Image(); trees.src="assets/trees.png";
const track = new Image(); track.src="assets/track.png";
const playerImg = new Image(); playerImg.src="assets/player.png";
const obstacleImg = new Image(); obstacleImg.src="assets/rock.png";

let lane = 1;
let lanes = [-200,0,200];
let playerY = canvas.height-300;

let obstacles = [];
let speed = 6;
let score = 0;
let gameOver = false;
let difficultyIncrease = 0.002;

function spawnObstacle(){
  let randomLane = Math.floor(Math.random()*3);
  obstacles.push({
    lane: randomLane,
    y: -200
  });
}

function drawBackground(){
  ctx.drawImage(bg,0,0,canvas.width,canvas.height);
  ctx.drawImage(trees,0,canvas.height-600,canvas.width,600);
  ctx.drawImage(track,canvas.width/2-300,0,600,canvas.height);
}

function drawPlayer(){
  ctx.drawImage(playerImg, canvas.width/2+lanes[lane]-100, playerY, 200, 200);
}

function drawObstacles(){
  obstacles.forEach(obs=>{
    ctx.drawImage(obstacleImg, canvas.width/2+lanes[obs.lane]-100, obs.y, 200, 200);
  });
}

function updateObstacles(){
  obstacles.forEach(obs=>{
    obs.y += speed;

    if(obs.lane === lane && obs.y > playerY-150 && obs.y < playerY+150){
      gameOver = true;
    }
  });

  obstacles = obstacles.filter(obs=>obs.y < canvas.height+200);
}

function drawScore(){
  ctx.fillStyle="white";
  ctx.font="40px Arial";
  ctx.fillText("Score: "+score,50,80);
}

function drawGameOver(){
  ctx.fillStyle="red";
  ctx.font="80px Arial";
  ctx.fillText("GAME OVER", canvas.width/2-250, canvas.height/2);
  ctx.font="40px Arial";
  ctx.fillText("Toque para reiniciar", canvas.width/2-170, canvas.height/2+60);
}

function resetGame(){
  obstacles = [];
  speed = 6;
  score = 0;
  gameOver = false;
}

function loop(){
  ctx.clearRect(0,0,canvas.width,canvas.height);

  drawBackground();

  if(!gameOver){
    updateObstacles();
    drawObstacles();
    drawPlayer();

    score++;
    speed += difficultyIncrease;

    drawScore();
    requestAnimationFrame(loop);
  } else {
    drawObstacles();
    drawPlayer();
    drawScore();
    drawGameOver();
  }
}

setInterval(spawnObstacle,1500);

window.addEventListener("click", e=>{
  if(gameOver){
    resetGame();
    loop();
    return;
  }

  if(e.clientX<canvas.width/3 && lane>0) lane--;
  else if(e.clientX>canvas.width*2/3 && lane<2) lane++;
});

loop();
