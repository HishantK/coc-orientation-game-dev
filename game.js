const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const STATIONS = [
  {
    icon: '✳', color: '#ffc96b', tag: 'THE BIG IDEA', title: 'Start with a feeling',
    body: `<p>Before the art or the code, there's a feeling you want a player to have. A game is an interactive experience: the player makes choices, the game responds, and together they create a story.</p>
      <p><b>Game design</b> is deciding what the player can do, what stands in their way, and why they want to keep going.</p>
      <div class="term-list"><span>GAME DESIGN</span><span>PLAYER</span><span>EXPERIENCE</span></div>
      <p class="tip">Start tiny: “I want it to feel satisfying to jump.” That's already a game idea.</p>`
  },
  {
    icon: '⚙', color: '#91d8bd', tag: 'YOUR TOOLBOX', title: 'Pick an engine',
    body: `<p>A <b>game engine</b> is the toolbox that helps you build a game. It brings together a renderer, input, physics, audio, and other building blocks so you don't have to start from scratch.</p>
      <ul>
        <li><a href="https://godotengine.org" target="_blank" rel="noopener noreferrer">Godot</a>: free, open-source, and especially welcoming for 2D.</li>
        <li><a href="https://unity.com" target="_blank" rel="noopener noreferrer">Unity</a>: a popular all-rounder for 2D and 3D games.</li>
        <li><a href="https://gamemaker.io" target="_blank" rel="noopener noreferrer">GameMaker</a>: built with 2D game creation in mind.</li>
        <li><a href="https://www.unrealengine.com" target="_blank" rel="noopener noreferrer">Unreal Engine</a>: a powerful option for ambitious 3D projects.</li>
      </ul>
      <div class="term-list"><span>ENGINE</span><span>RENDERER</span><span>PHYSICS</span></div>
      <p class="tip">There's no forever-choice. Pick one, follow a beginner tutorial, and make something.</p>`
  },
  {
    icon: '⌘', color: '#f2a7bc', tag: 'GIVE IT INSTRUCTIONS', title: 'Talk to the computer',
    body: `<p><b>Programming</b> means writing instructions that tell a game how to behave. Code reads input, moves characters, checks collisions, and decides what happens next.</p>
      <ul>
        <li><b>GDScript</b> is beginner-friendly and designed for Godot.</li>
        <li><b>C#</b> is used with Unity and also works in Godot.</li>
        <li><b>C++</b> is used in Unreal Engine and performance-focused games.</li>
        <li><b>JavaScript</b> can bring games to the browser.</li>
      </ul>
      <div class="term-list"><span>VARIABLE</span><span>FUNCTION</span><span>INPUT</span></div>
      <p class="tip">A character that moves when you press a key is a lovely first programming project.</p>`
  },
  {
    icon: '↻', color: '#f1c978', tag: 'THE HEARTBEAT', title: 'Meet the game loop',
    body: `<p>Games feel alive because a <b>game loop</b> repeats constantly: check input, update the world, draw the next frame, then do it all again.</p>
      <p>Every frame, the game might move your character, advance an animation, check a collision, or update the score. At 60 frames per second, it has only about 16 milliseconds to do that work.</p>
      <div class="term-list"><span>INPUT</span><span>UPDATE</span><span>RENDER</span></div>
      <p class="tip">This repeating rhythm is why pressing a button can make something happen right away.</p>`
  },
  {
    icon: '▧', color: '#9fb8ed', tag: 'MAKE IT A WORLD', title: 'Build with assets',
    body: `<p><b>Assets</b> are the ingredients players see and hear: sprites, backgrounds, music, sound effects, fonts, and animations.</p>
      <p>A <b>sprite</b> is a 2D image used in a game. A <b>sprite sheet</b> groups several images together, often so a character can be animated frame by frame.</p>
      <ul>
        <li><a href="https://itch.io/game-assets" target="_blank" rel="noopener noreferrer">itch.io</a> has an enormous collection of free and paid game assets.</li>
        <li><a href="https://resprite.fengeon.com/" target="_blank" rel="noopener noreferrer">Resprite</a> is one place to try making your own pixel art.</li>
      </ul>
      <div class="term-list"><span>SPRITE</span><span>ANIMATION</span><span>SFX</span></div>
      <p class="tip">Always check an asset's license before using it in a game you share.</p>`
  },
  {
    icon: '↗', color: '#c2a1e6', tag: "THE PLAYER'S PATH", title: 'Shape the level',
    body: `<p><b>Level design</b> is arranging spaces, obstacles, and rewards to guide the player's journey. Platforms, gaps, and safe places can quietly teach someone how to play.</p>
      <p><b>Game feel</b> is how satisfying and responsive the game feels. A little jump buffer, a forgiving landing, or a perfectly timed sound can make a big difference.</p>
      <div class="term-list"><span>LEVEL DESIGN</span><span>COLLISION</span><span>GAME FEEL</span></div>
      <p class="tip">Give a new mechanic a safe place to learn before asking the player to master it.</p>`
  },
  {
    icon: '♡', color: '#ed9d81', tag: 'MAKE IT BETTER', title: 'Test, learn, repeat',
    body: `<p><b>Playtesting</b> means letting someone try your game and noticing what they do, not just what they say. You'll spot confusing bits that are hard to see when you already know how the game works.</p>
      <p><b>Iteration</b> is the cycle: make a change, play it, learn something, and improve it. Most good games are made one small adjustment at a time.</p>
      <div class="term-list"><span>PLAYTEST</span><span>FEEDBACK</span><span>ITERATION</span></div>
      <p class="tip">Make a tiny version first. Finishing a small game teaches more than endlessly planning a huge one.</p>`
  }
];
const W = 960;
const H = 500;
const GROUND = 420;
const WORLD = 6200;
const keys = Object.create(null);
const seen = new Set();
let coins = 0;
let panelOpen = false;
let near = null;
let tick = 0;
let previousFocus = canvas;

canvas.width = W;
canvas.height = H;

STATIONS.forEach((station, index) => {
  station.x = 330 + index * 850;
});

const platforms = [];
const coinList = [];
STATIONS.forEach((station, index) => {
  const offset = index % 2 ? 70 : 0;
  platforms.push(
    { x: station.x - 375, y: 335, w: 120 },
    { x: station.x - 190 + offset, y: 270, w: 120 },
    { x: station.x + 90, y: 350, w: 130 }
  );
});
platforms.forEach((platform) => {
  coinList.push({ x: platform.x + platform.w / 2, y: platform.y - 25, got: false });
});

const stars = Array.from({ length: 75 }, (_, index) => ({
  x: (index * 997) % 1500,
  y: 28 + ((index * 53) % 205),
  size: index % 5 === 0 ? 3 : 2
}));

const player = { x: 62, y: GROUND - 48, w: 30, h: 48, vx: 0, vy: 0, onGround: false, facing: 1 };
const hud = document.getElementById('hud');
const panel = document.getElementById('panel');
const content = document.getElementById('content');
const lessonGrid = document.getElementById('lesson-grid');

function updateHud() {
  hud.innerHTML = `${seen.size} / ${STATIONS.length} stops <span>·</span> ${coins} coins`;
  document.querySelectorAll('[data-lesson-index]').forEach((button) => {
    const index = Number(button.dataset.lessonIndex);
    const isSeen = seen.has(STATIONS[index]);
    button.classList.toggle('is-read', isSeen);
    button.textContent = isSeen ? 'VISITED ✓' : 'TAKE A LOOK ↗';
  });
}

function openLesson(station) {
  panelOpen = true;
  previousFocus = document.activeElement;
  seen.add(station);
  content.innerHTML = `<p class="modal-eyebrow">${station.tag}</p><h2 id="dialog-title">${station.icon} ${station.title}</h2>${station.body}`;
  panel.hidden = false;
  document.getElementById('close').focus();
  updateHud();
}

function closeLesson() {
  if (!panelOpen) return;
  panelOpen = false;
  panel.hidden = true;
  if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus();
  else canvas.focus();
}

function interact() {
  if (!panelOpen && near) openLesson(near);
}

document.getElementById('close').addEventListener('click', closeLesson);
panel.addEventListener('click', (event) => {
  if (event.target === panel) closeLesson();
});

addEventListener('keydown', (event) => {
  const key = event.key.toLowerCase();
  if (key === 'escape') {
    closeLesson();
    return;
  }
  if (panelOpen) return;
  if ([' ', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) event.preventDefault();
  keys[key] = true;
  if (key === 'e') interact();
});

addEventListener('keyup', (event) => {
  keys[event.key.toLowerCase()] = false;
});

addEventListener('blur', () => {
  Object.keys(keys).forEach((key) => { keys[key] = false; });
});

document.querySelectorAll('#touch button').forEach((button) => {
  const key = button.dataset.k;
  const release = () => { keys[key] = false; };
  button.addEventListener('pointerdown', (event) => {
    event.preventDefault();
    keys[key] = true;
    if (key === 'act') interact();
  });
  ['pointerup', 'pointerleave', 'pointercancel'].forEach((name) => button.addEventListener(name, release));
});

const trailNav = document.getElementById('nav');
STATIONS.forEach((station, index) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'stop-button';
  button.title = `Jump to ${station.title}`;
  button.setAttribute('aria-label', `Jump to stop ${index + 1}: ${station.title}`);
  button.innerHTML = `<span>${String(index + 1).padStart(2, '0')}</span>${station.icon}`;
  button.addEventListener('click', () => {
    player.x = Math.max(0, station.x - 60);
    player.y = GROUND - player.h;
    player.vy = 0;
    near = station;
    canvas.focus({ preventScroll: true });
  });
  trailNav.appendChild(button);
});

STATIONS.forEach((station, index) => {
  const article = document.createElement('article');
  article.className = 'lesson-card';
  article.innerHTML = `
    <div class="lesson-card-top">
      <span class="lesson-number">${String(index + 1).padStart(2, '0')}</span>
      <span class="lesson-icon" style="--station-color:${station.color}">${station.icon}</span>
    </div>
    <p class="lesson-tag">${station.tag}</p>
    <h3>${station.title}</h3>
    <button class="lesson-readout" type="button" data-lesson-index="${index}">TAKE A LOOK ↗</button>`;
  article.querySelector('button').addEventListener('click', () => openLesson(station));
  lessonGrid.appendChild(article);
});

function update() {
  if (panelOpen) return;
  const movingRight = keys.arrowright || keys.d || keys.right;
  const movingLeft = keys.arrowleft || keys.a || keys.left;
  const horizontal = Number(Boolean(movingRight)) - Number(Boolean(movingLeft));
  player.vx = horizontal * 4.5;
  if (horizontal) player.facing = horizontal;
  if ((keys.arrowup || keys.w || keys[' '] || keys.jump) && player.onGround) {
    player.vy = -13.5;
    player.onGround = false;
  }
  player.vy = Math.min(player.vy + 0.58, 15);
  player.x = Math.max(0, Math.min(WORLD - player.w, player.x + player.vx));
  const previousBottom = player.y + player.h;
  player.y += player.vy;
  player.onGround = false;

  if (player.y + player.h >= GROUND) {
    player.y = GROUND - player.h;
    player.vy = 0;
    player.onGround = true;
  } else if (player.vy >= 0) {
    for (const platform of platforms) {
      if (player.x + player.w > platform.x && player.x < platform.x + platform.w &&
          previousBottom <= platform.y && player.y + player.h >= platform.y) {
        player.y = platform.y - player.h;
        player.vy = 0;
        player.onGround = true;
        break;
      }
    }
  }

  for (const coin of coinList) {
    if (!coin.got && Math.abs(coin.x - (player.x + player.w / 2)) < 22 &&
        Math.abs(coin.y - (player.y + player.h / 2)) < 34) {
      coin.got = true;
      coins += 1;
      updateHud();
    }
  }
  near = STATIONS.find((station) => Math.abs(station.x - (player.x + player.w / 2)) < 78) || null;
}

function draw() {
  tick += 1;
  const camera = Math.max(0, Math.min(WORLD - W, player.x + player.w / 2 - W / 2));
  const sky = ctx.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, '#15142f');
  sky.addColorStop(0.58, '#30204f');
  sky.addColorStop(1, '#75405d');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = 'rgba(255, 214, 90, .15)';
  ctx.fillRect(736, 72, 70, 70);
  ctx.fillStyle = '#ffd65a';
  ctx.fillRect(746, 82, 50, 50);
  ctx.fillStyle = '#fff0a8';
  ctx.fillRect(756, 92, 30, 30);
  stars.forEach((star) => {
    const x = ((star.x - camera * 0.08) % W + W) % W;
    ctx.globalAlpha = 0.3 + Math.sin(tick / 30 + star.x) * 0.15;
    ctx.fillStyle = '#e8e0ff';
    ctx.fillRect(x, star.y, star.size, star.size);
  });
  ctx.globalAlpha = 1;
  drawHills(camera);

  ctx.save();
  ctx.translate(-camera, 0);
  ctx.fillStyle = '#1d463e';
  ctx.fillRect(0, GROUND, WORLD, H - GROUND);
  ctx.fillStyle = '#152d35';
  ctx.fillRect(0, GROUND + 13, WORLD, H - GROUND - 13);
  ctx.fillStyle = '#65e6a0';
  ctx.fillRect(0, GROUND, WORLD, 8);
  for (let x = Math.floor(camera / 42) * 42; x < camera + W + 42; x += 42) {
    ctx.fillStyle = '#31514c';
    ctx.fillRect(x, GROUND + 27 + ((x / 42) % 3) * 4, 15, 4);
    ctx.fillStyle = '#243b43';
    ctx.fillRect(x + 16, GROUND + 47 + ((x / 42) % 2) * 5, 8, 4);
  }

  platforms.forEach((platform) => {
    ctx.fillStyle = '#6d50ae';
    ctx.fillRect(platform.x, platform.y, platform.w, 15);
    ctx.fillStyle = '#bc9aff';
    ctx.fillRect(platform.x, platform.y, platform.w, 5);
    ctx.fillStyle = '#30254c';
    for (let x = platform.x + 10; x < platform.x + platform.w; x += 27) {
      ctx.fillRect(x, platform.y + 9, 10, 3);
    }
  });

  coinList.forEach((coin) => {
    if (coin.got) return;
    const width = Math.abs(Math.cos(tick / 14)) * 6 + 4;
    ctx.fillStyle = '#ffd65a';
    ctx.beginPath();
    ctx.ellipse(coin.x, coin.y, width, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff0a8';
    ctx.fillRect(coin.x - 1, coin.y - 5, 2, 10);
  });

  STATIONS.forEach((station, index) => drawStation(station, index));
  drawPlayer();
  ctx.restore();

  if (player.x < 190) {
    ctx.fillStyle = '#354a43';
    ctx.font = '600 14px "DM Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillText('KEEP GOING →', 22, 35);
  }
}

function drawHills(camera) {
  [
    { color: '#45346a', y: 298, amplitude: 42, scale: 0.22 },
    { color: '#343858', y: 352, amplitude: 35, scale: 0.4 }
  ].forEach((hill) => {
    ctx.fillStyle = hill.color;
    ctx.beginPath();
    ctx.moveTo(0, H);
    for (let x = 0; x <= W; x += 16) {
      const worldX = x + camera * hill.scale;
      const y = hill.y - Math.abs(Math.sin(worldX / 150)) * hill.amplitude
        - Math.abs(Math.sin(worldX / 315)) * hill.amplitude * 0.55;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(W, H);
    ctx.fill();
  });
}

function drawStation(station, index) {
  const signY = GROUND - 142;
  ctx.fillStyle = '#e4b46f';
  ctx.fillRect(station.x - 4, GROUND - 60, 8, 60);
  ctx.fillStyle = '#32213f';
  ctx.fillRect(station.x - 50, signY + 8, 100, 62);
  ctx.fillStyle = station.color;
  ctx.fillRect(station.x - 54, signY, 108, 64);
  ctx.strokeStyle = '#fff0c2';
  ctx.lineWidth = 4;
  ctx.strokeRect(station.x - 54, signY, 108, 64);
  ctx.fillStyle = '#352343';
  ctx.font = '500 11px "DM Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText(`STOP ${String(index + 1).padStart(2, '0')}`, station.x, signY + 16);
  ctx.fillStyle = '#33493f';
  ctx.font = '24px "DM Sans", sans-serif';
  ctx.fillText(station.icon, station.x, signY + 47);
  if (seen.has(station)) {
    ctx.fillStyle = '#67f5dc';
    ctx.beginPath();
    ctx.arc(station.x + 39, signY + 9, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#1e3041';
    ctx.font = 'bold 12px "DM Sans", sans-serif';
    ctx.fillText('✓', station.x + 39, signY + 14);
  }
  if (station === near) {
    ctx.fillStyle = '#fff0c2';
    ctx.font = '500 11px "DM Mono", monospace';
    ctx.fillText('PRESS E TO READ', station.x, signY - 13 - Math.sin(tick / 8) * 2);
  }
}

function drawPlayer() {
  const { x, y, w, h, facing } = player;
  ctx.fillStyle = 'rgba(12, 9, 30, .45)';
  ctx.fillRect(x - 4, y + h - 1, w + 8, 5);
  ctx.fillStyle = '#ff70a8';
  ctx.fillRect(x + 2, y + 13, w - 4, h - 15);
  ctx.fillStyle = '#ffb6cf';
  ctx.fillRect(x + 5, y + 2, w - 10, 16);
  ctx.fillStyle = '#67f5dc';
  ctx.fillRect(x + 3, y, w - 6, 6);
  ctx.fillRect(x + 2, y + h - 4, 11, 5);
  ctx.fillRect(x + 17, y + h - 4, 11, 5);
  ctx.fillStyle = '#fff9e8';
  ctx.fillRect(facing > 0 ? x + 17 : x + 7, y + 8, 5, 5);
  ctx.fillStyle = '#28213e';
  ctx.fillRect(facing > 0 ? x + 19 : x + 7, y + 10, 2, 2);
  ctx.fillStyle = '#ffd65a';
  ctx.fillRect(x + 5, y + 20, 20, 3);
}

(function frame() {
  update();
  draw();
  requestAnimationFrame(frame);
})();

updateHud();
