// the game code for ufo dino game.

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

const ufoImg = new Image();
ufoImg.src = "images/ufo.gif";

const rockImgs = [new Image(), new Image(), new Image(), new Image()];
rockImgs[0].src = "images/asteroid_1.png";
rockImgs[1].src = "images/asteroid_2.png";
rockImgs[2].src = "images/asteroid_3.png";
rockImgs[3].src = "images/asteroid_4.png";

const ufo = { x: 60, y: 80, size: 50 };
const keys = {};
const DEBUG = true; // true = show the red hitbox, false = hide it

let rocks = [];
let speed = 4;
let tick = 0;
let score = 0;
let started = false;
let gameOver = false;
let bob = 0; // counter for the hover wobble
let level = 0; // difficulty level

document.addEventListener("keydown", function (e) {
  keys[e.code] = true;
  if (e.code === "Space" || e.code === "ArrowUp" || e.code === "ArrowDown") {
    e.preventDefault();
  }
  if (e.code === "Space") {
    if (gameOver) {
      restart();
    } else {
      started = true;
    }
  }
});

document.addEventListener("keyup", function (e) {
  keys[e.code] = false;
});

function restart() {
  rocks = [];
  speed = 4;
  tick = 0;
  score = 0;
  level = 0;
  ufo.y = 80;
  gameOver = false;
}

function hit(a, b) {
  return a.x < b.x + b.size &&
         a.x + a.size > b.x &&
         a.y < b.y + b.size &&
         a.y + a.size > b.y;
}

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (started && !gameOver) {
    // move: arrows or W/S
    if (keys["ArrowUp"] || keys["KeyW"]) {
      ufo.y = ufo.y - 4;
    }
    if (keys["ArrowDown"] || keys["KeyS"]) {
      ufo.y = ufo.y + 4;
    }

    // stay inside the canvas
    if (ufo.y > canvas.height - ufo.size) {
      ufo.y = canvas.height - ufo.size;
    }
    if (ufo.y < 0) {
      ufo.y = 0;
    }

    // difficulty levels based on the score you see
    const shown = Math.floor(score / 6);
    if (shown < 350) {
      level = 0;
    } else if (shown < 500) {
      level = 1;
    } else {
      level = 2 + Math.floor((shown - 500) / 150);
    }
    speed = Math.min(15, 4 + Math.floor(shown / 75) * 0.37);

    // spawn a wave of rocks
    tick = tick + 1;
    if (tick % 80 === 0) {
      const count = Math.min(4, level + 1);
      for (let i = 0; i < count; i++) {
        const pick = Math.floor(Math.random() * 4);
        let rockY = Math.random() * (canvas.height - 24);
        if (i === 0 && Math.random() < 0.5) {
          rockY = ufo.y; // the first rock of a wave might aim at you
        }
        rocks.push({ x: canvas.width + i * 40, y: rockY, size: 24, img: rockImgs[pick] });
      }
    }

    // move rocks + check for crashes (smaller hitbox that hugs the alien)
    const ufoBox = { x: ufo.x + 12, y: ufo.y + 10, size: ufo.size - 24 };
    for (const rock of rocks) {
      rock.x = rock.x - speed;
      if (hit(ufoBox, rock)) {
        gameOver = true;
      }
    }
    rocks = rocks.filter(rock => rock.x > -rock.size);

    score = score + 1;
  }

  // draw the UFO with a hover wobble (only the picture moves, not the hitbox)
  bob = bob + 1;
  const wobble = Math.sin(bob * 0.08) * 3;
  ctx.drawImage(ufoImg, ufo.x, ufo.y + wobble, ufo.size, ufo.size);

  if (DEBUG) {
    ctx.strokeStyle = "red";
    ctx.strokeRect(ufo.x + 12, ufo.y + 10, ufo.size - 24, ufo.size - 24);
  }

  // draw the rocks
  for (const rock of rocks) {
    ctx.drawImage(rock.img, rock.x, rock.y, rock.size, rock.size);
  }

  // text
  ctx.fillStyle = "white";
  ctx.font = "24px VT323";
  ctx.fillText("score " + Math.floor(score / 6), 10, 26);
  ctx.fillText("level " + level, 520, 26);

  ctx.textAlign = "center";
  if (!started) {
    ctx.fillText("space to start, arrows or W/S to fly", canvas.width / 2, 110);
  }
  if (gameOver) {
    ctx.fillText("game over! space to try again", canvas.width / 2, 110);
  }
  ctx.textAlign = "left";

  requestAnimationFrame(loop);
}

loop();