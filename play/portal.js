// ==========================================
// 1. UI ANIMATIONS & EFFECTS (Particles, Live Players)
// ==========================================

const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resize(){ canvas.width = innerWidth; canvas.height = innerHeight; }
resize(); 
window.addEventListener('resize', resize);

for(let i=0; i<100; i++) {
    particles.push({
        x: Math.random() * innerWidth, 
        y: Math.random() * innerHeight,
        vx: (Math.random() - .5) * .4, 
        vy: (Math.random() - .5) * .4,
        r: Math.random() * 1.4 + .4, 
        a: Math.random() * .4 + .06,
        c: Math.random() > .7 ? '#ff6b00' : Math.random() > .5 ? '#00d4ff' : '#8b5cf6'
    });
}

function drawBG(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if(p.x < 0) p.x = canvas.width; if(p.x > canvas.width) p.x = 0;
        if(p.y < 0) p.y = canvas.height; if(p.y > canvas.height) p.y = 0;
        ctx.save(); ctx.globalAlpha = p.a; ctx.fillStyle = p.c;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2); ctx.fill(); ctx.restore();
    });
    requestAnimationFrame(drawBG);
}
drawBG();

// Live Players Counter Logic
function updateLive(){
    const el = document.getElementById('live-players');
    if(el) el.textContent = (380 + Math.floor(Math.random() * 80)) + '+';
    setTimeout(updateLive, 4000 + Math.random() * 3000);
}
updateLive();

// Scroll Animations
const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('visible'); });
}, {threshold: 0.1});
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

// Header Scroll Effect
window.addEventListener('scroll', () => {
    document.getElementById('header').style.background = scrollY > 50 ? 'rgba(5,5,10,0.98)' : 'rgba(5,5,10,0.9)';
});


// ==========================================
// 2. DYNAMIC SAAS LOGIC (Routing & Injection)
// ==========================================

// Dummy Data (Supabase connect karne se pehle testing ke liye)
const DUMMY_DB = {
    "rahul": {
        portalName: "Rahul's Gaming Zone",
        ads: {
            top: `<span style="color:#ffcc00">Adsterra Ad Code (Rahul)</span>`,
            mid: `<span style="color:#ffcc00">Adsterra Ad Code (Rahul)</span>`,
            overlay: `<span style="color:#ffcc00">Adsterra Overlay Ad (Rahul)</span>`
        },
        selectedGames: [
            { id: "fire-strike-123", name: "Fire Strike", cat: "action", thumb: "🔫", bg: "thumb-action", rating: "4.7", players: "1.2k" },
            { id: "turbo-drift-456", name: "Turbo Drift", cat: "racing", thumb: "🏎️", bg: "thumb-racing", rating: "4.9", players: "800+" },
            { id: "brain-test-789", name: "Brain Puzzle", cat: "puzzle", thumb: "🧩", bg: "thumb-puzzle", rating: "4.5", players: "500+" },
            { id: "fashion-star-101", name: "Fashion Star", cat: "girls", thumb: "💅", bg: "thumb-girls", rating: "4.8", players: "2.1k" },
            { id: "cricket-blitz-202", name: "Cricket Blitz", cat: "sports", thumb: "⚽", bg: "thumb-sports", rating: "4.9", players: "3.5k" },
            { id: "bubble-pop-303", name: "Bubble Pop", cat: "casual", thumb: "🎲", bg: "thumb-casual", rating: "4.4", players: "900+" }
        ]
    },
    "default": {
        portalName: "Meri Kamai Games",
        ads: {
            top: `<span style="color:#00ff88">Merikamai Default Ad</span>`,
            mid: `<span style="color:#00ff88">Merikamai Default Ad</span>`,
            overlay: `<span style="color:#00ff88">Merikamai Overlay Ad</span>`
        },
        // Agar koi username match nahi hua, to yeh default games dikhenge
        selectedGames: [
             { id: "default-action", name: "Shadow Fight", cat: "action", thumb: "🥷", bg: "thumb-action", rating: "4.6", players: "1k+" },
             { id: "default-racing", name: "Highway Rider", cat: "racing", thumb: "🏍️", bg: "thumb-racing", rating: "4.8", players: "2k+" }
        ]
    }
};

// Step 2.1: Extract Username from URL (e.g., games.merikamai.in/rahul)
const pathSegments = window.location.pathname.split('/').filter(Boolean);
const username = pathSegments.length > 0 ? pathSegments[0].toLowerCase() : "default";

// Fetch data (Dummy now, Supabase later)
const portalData = DUMMY_DB[username] || DUMMY_DB["default"];

// Step 2.2: Apply Portal Data to HTML
document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Update Hero Titles
    if(username !== "default" && DUMMY_DB[username]) {
        document.getElementById('portal-title-1').textContent = "WELCOME TO";
        document.getElementById('portal-title-2').textContent = portalData.portalName.toUpperCase();
    }

    // 2. Inject Ads
    document.getElementById('top-ad-banner').innerHTML = portalData.ads.top;
    document.getElementById('mid-ad-banner').innerHTML = portalData.ads.mid;
    document.getElementById('overlay-ad-banner').innerHTML = portalData.ads.overlay;

    // 3. Inject GameDistribution Games into Grid
    const gamesGrid = document.getElementById('gamesGrid');
    
    portalData.selectedGames.forEach(game => {
        const gameCard = document.createElement('div');
        gameCard.className = 'game-card dynamic-game';
        gameCard.setAttribute('data-cat', game.cat);
        gameCard.setAttribute('data-name', game.name.toLowerCase());
        
        // Link points to our generic game viewer with ID parameter
        const playUrl = `/game-view.html?id=${game.id}&u=${username}`;

        gameCard.innerHTML = `
            <div class="game-thumb ${game.bg}">
                <div class="card-badge-sm new">NEW</div>
                ${game.thumb}
            </div>
            <div class="game-info">
                <div class="game-name">${game.name}</div>
                <div class="game-cat-tag">${game.cat}</div>
                <div class="game-meta">
                    <span class="game-rating">⭐ ${game.rating}</span>
                    <span class="game-players">${game.players} playing</span>
                </div>
                <button class="btn-play-sm" onclick="playGame('${playUrl}')">Play ▶</button>
            </div>
        `;
        gamesGrid.appendChild(gameCard);
    });
    // ==========================================
    // THE PWA MAGIC: Dynamic App Name (White-label)
    // ==========================================
    // Yeh code player ke phone mein App ka naam "Meri Kamai" ki jagah "Rahul's Gaming Zone" save karega
    
    const manifestJSON = {
        "name": portalData.portalName, // Yaha se Rahul ka naam aayega
        "short_name": portalData.portalName.split(' ')[0], // Sirf pehla shabd (e.g., "Rahul's")
        "description": "Play top free HTML5 games instantly.",
        "start_url": window.location.pathname, // Install hone ke baad seedha Rahul ka portal khulega
        "display": "standalone",
        "background_color": "#05050a",
        "theme_color": "#ff6b00",
        "icons": [
            { "src": "/assets/images/icon-192.png", "sizes": "192x192", "type": "image/png" },
            { "src": "/assets/images/icon-512.png", "sizes": "512x512", "type": "image/png" }
        ]
    };

    // JSON ko Blob me convert karke naya manifest URL banana
    const manifestBlob = new Blob([JSON.stringify(manifestJSON)], {type: 'application/json'});
    const manifestUrl = URL.createObjectURL(manifestBlob);
    
    // HTML ke purane manifest ko is naye URL se replace kar dena
    document.getElementById('app-manifest').setAttribute('href', manifestUrl);

    // Populate Leaderboard Dummy Data
    populateLeaderboard();
});

// ==========================================
// 3. FILTER LOGIC & AD OVERLAY INTERACTION
// ==========================================

let activeCat = 'all';
let searchQuery = '';

document.getElementById('catTabs').addEventListener('click', e => {
    const tab = e.target.closest('.cat-tab');
    if(!tab) return;
    document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    activeCat = tab.dataset.cat;
    filterGames();
});

document.getElementById('searchInput').addEventListener('input', e => {
    searchQuery = e.target.value.toLowerCase().trim();
    filterGames();
});

function filterGames(){
    const cards = document.querySelectorAll('#gamesGrid .game-card');
    cards.forEach(card => {
        const cat = card.dataset.cat || '';
        const name = (card.dataset.name || '').toLowerCase();
        const catMatch = activeCat === 'all' || cat === activeCat;
        const searchMatch = !searchQuery || name.includes(searchQuery);
        card.classList.toggle('hidden-card', !(catMatch && searchMatch));
    });
}

// Intercept Play Click to Show Ad Overlay First
window.playGame = function(targetUrl) {
    const ov = document.getElementById('adOverlay');
    const btn = document.getElementById('adClose');
    
    ov.classList.add('active');
    
    let t = 4; // 4 second wait time
    btn.textContent = `Wait ${t}s...`; 
    btn.disabled = true;
    
    const iv = setInterval(() => {
        t--;
        if(t <= 0){ 
            clearInterval(iv); 
            btn.textContent = 'Skip Ad ▶'; 
            btn.disabled = false; 
        } else {
            btn.textContent = `Wait ${t}s...`;
        }
    }, 1000);

    // After clicking skip, redirect to the game view
    btn.onclick = () => { 
        window.location.href = targetUrl;
    };
};

function populateLeaderboard() {
    const lbData = [
        {name:'Rahul K.', score:'3.8x', title:'1% Club'},
        {name:'Priya S.', score:'3.5x', title:'Elite'},
        {name:'Aman V.', score:'134', title:'Legend'},
        {name:'Deepak M.', score:'3.2x', title:'Pro'}
    ];
    const ranks = ['🥇','🥈','🥉','4'];
    const rCls = ['gold','silver','bronze',''];
    const lb = document.getElementById('lbList');
    if(!lb) return;
    
    lbData.forEach((p,i) => {
        const row = document.createElement('div');
        row.className='lb-row';
        row.innerHTML=`<span class="lb-rank ${rCls[i]}">${ranks[i]}</span><span class="lb-name">${p.name}</span><span class="lb-score">${p.score}</span><span class="lb-title">${p.title}</span>`;
        lb.appendChild(row);
    });
}