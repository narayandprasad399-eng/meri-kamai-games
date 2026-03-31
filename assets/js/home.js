// ===== PARTICLE BACKGROUND =====
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let W, H;

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.size = Math.random() * 1.5 + 0.5;
    this.alpha = Math.random() * 0.5 + 0.1;
    this.color = Math.random() > 0.7 ? '#ff6b00' : Math.random() > 0.5 ? '#00d4ff' : '#8b5cf6';
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

for (let i = 0; i < 120; i++) particles.push(new Particle());

function drawLines() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const d = Math.sqrt(dx*dx + dy*dy);
      if (d < 100) {
        ctx.save();
        ctx.globalAlpha = (1 - d/100) * 0.08;
        ctx.strokeStyle = '#ff6b00';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
        ctx.restore();
      }
    }
  }
}

function animBG() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => { p.update(); p.draw(); });
  drawLines();
  requestAnimationFrame(animBG);
}
animBG();

// ===== LIVE PLAYER COUNT =====
function updateLivePlayers() {
  const base = 387;
  const el = document.getElementById('live-players');
  if (el) {
    const n = base + Math.floor(Math.random() * 50);
    el.textContent = n + '+';
  }
  document.querySelectorAll('.live-count').forEach(el => {
    const counts = [412, 287, 198, 334, 156];
    const bases = [380, 260, 170, 300, 130];
    const idx = parseInt(el.dataset.idx || 0);
    el.textContent = bases[idx] + Math.floor(Math.random() * 50);
  });
  setTimeout(updateLivePlayers, 4000 + Math.random() * 3000);
}
document.querySelectorAll('.live-count').forEach((el, i) => { el.dataset.idx = i; });
updateLivePlayers();

// ===== FAKE LEADERBOARD =====
const leaderboardData = [
  { name: 'Rahul K.', score: '3.8x', title: '1% Club', game: 'SkyRise' },
  { name: 'Priya S.', score: '3.5x', title: 'Elite', game: 'SkyRise' },
  { name: 'Aman V.', score: '3.2x', title: 'Pro', game: 'SkyRise' },
  { name: 'Deepak M.', score: '142', title: 'Legend', game: 'Legend Run' },
  { name: 'Sneha R.', score: '3.0x', title: 'Elite', game: 'SkyRise' },
  { name: 'Vikram T.', score: '2.9x', title: 'Skilled', game: 'SkyRise' },
  { name: 'Ankita J.', score: '2.7x', title: 'Pro', game: 'SkyRise' },
];
const rankClasses = ['gold', 'silver', 'bronze', '', '', '', ''];
const rankIcons = ['🥇', '🥈', '🥉', '4', '5', '6', '7'];

const lbList = document.getElementById('lbList');
if (lbList) {
  leaderboardData.forEach((p, i) => {
    const row = document.createElement('div');
    row.className = 'lb-row';
    row.innerHTML = `
      <span class="lb-rank ${rankClasses[i]}">${rankIcons[i]}</span>
      <span class="lb-name">${p.name}</span>
      <span class="lb-score">${p.score}</span>
      <span class="lb-title">${p.title}</span>
    `;
    lbList.appendChild(row);
  });
}

// ===== SCROLL REVEAL =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.game-card, .why-card, .why-section, .video-section, .leaderboard-section, .download-content').forEach(el => {
  el.classList.add('reveal');
  observer.observe(el);
});

// ===== HEADER SCROLL =====
window.addEventListener('scroll', () => {
  const h = document.getElementById('header');
  if (window.scrollY > 50) h.style.background = 'rgba(5,5,10,0.98)';
  else h.style.background = 'rgba(5,5,10,0.85)';
});

// ===== PHONE PREVIEW MULTIPLIER =====
let mult = 1.0;
let crashTimer;
function runPhonePreview() {
  const el = document.getElementById('previewMult');
  if (!el) return;
  const interval = setInterval(() => {
    mult += 0.1 + Math.random() * 0.05;
    el.textContent = mult.toFixed(1) + 'x';
    if (mult > 2 + Math.random() * 2) {
      clearInterval(interval);
      el.textContent = '💥';
      el.style.color = '#ff4444';
      setTimeout(() => {
        mult = 1.0;
        el.textContent = '1.0x';
        el.style.color = '';
        setTimeout(runPhonePreview, 1000);
      }, 1000);
    }
  }, 120);
}
runPhonePreview();

// ===== PWA INSTALL =====
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  const btn = document.getElementById('installBtn');
  if (btn) {
    btn.style.display = 'inline-flex';
    btn.textContent = '📥 Install App (PWA)';
  }
});

function handleInstall(e) {
  e.preventDefault();
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(choice => {
      if (choice.outcome === 'accepted') {
        console.log('PWA installed');
      }
      deferredPrompt = null;
    });
  } else {
    alert('Apne browser me "Add to Home Screen" option use karo!\n\nChrome: Menu (⋮) → Add to Home Screen');
  }
}
window.handleInstall = handleInstall;

// ===== AD SYSTEM =====
let adShownCount = 0;
function showAd(onClose) {
  const overlay = document.getElementById('adOverlay');
  const closeBtn = document.getElementById('adClose');
  if (!overlay) return onClose && onClose();
  overlay.classList.add('active');
  let countdown = 5;
  closeBtn.textContent = `Wait ${countdown}s...`;
  closeBtn.disabled = true;
  const timer = setInterval(() => {
    countdown--;
    if (countdown <= 0) {
      clearInterval(timer);
      closeBtn.textContent = 'Skip Ad ▶';
      closeBtn.disabled = false;
    } else {
      closeBtn.textContent = `Wait ${countdown}s...`;
    }
  }, 1000);
  closeBtn.onclick = () => {
    overlay.classList.remove('active');
    if (onClose) onClose();
  };
}
window.showAd = showAd;
