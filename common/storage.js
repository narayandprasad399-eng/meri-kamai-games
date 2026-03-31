// ===== MERI KAMAI - SHARED STORAGE =====
const Storage = {
  get(key) { try { return JSON.parse(localStorage.getItem('mk_' + key)); } catch(e) { return null; } },
  set(key, val) { try { localStorage.setItem('mk_' + key, JSON.stringify(val)); } catch(e) {} },
  inc(key, by = 1) { const v = this.get(key) || 0; this.set(key, v + by); return v + by; }
};

// ===== SHARED UTILS =====
const Utils = {
  rand(min, max) { return Math.random() * (max - min) + min; },
  randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; },
  clamp(v, min, max) { return Math.min(max, Math.max(min, v)); },
  formatScore(n) { return typeof n === 'number' ? n.toFixed(2) : n; },
};

// ===== RANK SYSTEM =====
const RankSystem = {
  getRank(score, game) {
    const ranks = {
      skyrise: [
        { min: 0, title: 'Rookie', color: '#888' },
        { min: 1.5, title: 'Beginner', color: '#60a5fa' },
        { min: 2.0, title: 'Skilled', color: '#34d399' },
        { min: 2.5, title: 'Pro', color: '#f59e0b' },
        { min: 3.0, title: 'Elite', color: '#8b5cf6' },
        { min: 3.5, title: '1% Club 🔥', color: '#ff6b00' },
      ],
      default: [
        { min: 0, title: 'Rookie', color: '#888' },
        { min: 10, title: 'Beginner', color: '#60a5fa' },
        { min: 25, title: 'Skilled', color: '#34d399' },
        { min: 50, title: 'Pro', color: '#f59e0b' },
        { min: 100, title: 'Elite', color: '#8b5cf6' },
        { min: 150, title: 'Legend 🏆', color: '#ff6b00' },
      ]
    };
    const list = ranks[game] || ranks.default;
    let rank = list[0];
    for (const r of list) { if (score >= r.min) rank = r; }
    return rank;
  }
};

// ===== FEEDBACK MESSAGES =====
const Feedback = {
  skyrise: {
    perfect: ['Perfect decision! 🔥', 'Bilkul sahi timing! 🎯', 'CLUTCH! 🔥', 'Masterful stop! ⚡'],
    early: ['Thoda aur wait karo 😊', 'Jaldi ho gayi! Dobara try karo', 'Risk lena seekho 💪'],
    late: ['Ek second aur rukna tha 😳', 'Almost! 0.1x aur...', 'Itna close tha! Retry?'],
    crash: ['Crash! Risk management sikho 💪', 'BOOM! 💥 Better luck next time', 'Ye tha real risk! Learn karo'],
  },
  improvement(prev, curr) {
    if (!prev) return null;
    const diff = curr - prev;
    if (diff > 0) return `+${diff.toFixed(1)} improvement! 🔥 Tum better ho rahe ho!`;
    if (diff < 0) return 'Aaj ka din nahi — kal phir try karo 💪';
    return 'Same score — push harder! 🎯';
  }
};

// ===== AD TIMING =====
let lastAdTime = 0;
function shouldShowAd() {
  const now = Date.now();
  if (now - lastAdTime > 120000) { // 2 min
    lastAdTime = now;
    return true;
  }
  return false;
}

// ===== NEAR MISS MESSAGES =====
const NearMiss = [
  '0.1x aur hota to perfect tha 😳',
  'Itna close! Ek baar aur? 🔥',
  'Almost perfect... retry karo 😤',
  'Soo close! 99% players yahan fail karte 😏',
];

window.Storage = Storage;
window.Utils = Utils;
window.RankSystem = RankSystem;
window.Feedback = Feedback;
window.NearMiss = NearMiss;
window.shouldShowAd = shouldShowAd;
