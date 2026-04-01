// ==========================================
// 1. SUPABASE INITIALIZATION
// ==========================================
// Note: Apni dashboard/index.html ke <head> me ye line zaroor daalna:
// <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

const supabaseUrl = 'https://kdgjhgnkpdfrddcifmii.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtkZ2poZ25rcGRmcmRkY2lmbWlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2Mjc4NTMsImV4cCI6MjA5MDIwMzg1M30.oY-ZpnvXhlwZ9ucMM4jXKjZJsx3ugY9oeCs-z3euIpo';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// ==========================================
// 2. GOOGLE LOGIN FUNCTION (The Routing Magic)
// ==========================================
async function loginWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            // YAHI HAI WOH MAGIC! 
            // Ye line Supabase ko batati hai ki login ke baad explicitly isi gaming dashboard par wapas aana hai.
            redirectTo: window.location.origin + '/dashboard/index.html' 
        }
    });

    if (error) {
        console.error("Login Error:", error.message);
        alert("Login failed! Please try again.");
    }
}

// ==========================================
// 3. CHECK SESSION & UPDATE UI (Page load hone par)
// ==========================================
async function checkUserSession() {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (session) {
        // User logged in hai! Dummy data hata kar asli data dikhao
        const user = session.user;
        const username = user.user_metadata.full_name || user.email.split('@')[0]; // Default username
        
        // UI Update kar rahe hain
        document.getElementById('displayUsername').textContent = username;
        document.getElementById('portalSlug').textContent = username.toLowerCase().replace(/\s+/g, '');
        
        // Avatar ke liye naam ka pehla akshar
        document.querySelector('.user-avatar').textContent = username.charAt(0).toUpperCase();

        // 🚀 DATABASE CALL (Jo humne SQL tables banayi thi)
        fetchUserPortalData(user.id);

    } else {
        // User login nahi hai, usko login ka option do ya home page bhej do
        // Filhal hum seedha login trigger kar sakte hain ya ek screen dikha sakte hain
        document.querySelector('.main-content').innerHTML = `
            <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%;">
                <h2 style="font-family:'Teko'; font-size:40px; margin-bottom:20px;">Creator Login Required</h2>
                <button onclick="loginWithGoogle()" style="background:#fff; color:#000; padding:12px 24px; border-radius:30px; font-weight:bold; cursor:pointer; display:flex; align-items:center; gap:10px; border:none;">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" width="20">
                    Sign in with Google
                </button>
            </div>
        `;
    }
}

// ==========================================
// 4. LOGOUT FUNCTION
// ==========================================
async function logout() {
    const { error } = await supabase.auth.signOut();
    if (!error) {
        window.location.reload(); // Page refresh to show login screen
    }
}

// Jab page load ho tab session check karo
window.onload = checkUserSession;

// ==========================================
// 5. FETCH DATA FROM DATABASE (Example)
// ==========================================
async function fetchUserPortalData(userId) {
    // Ye function Supabase ki 'portals' table se is user ka data layega
    let { data: portal, error } = await supabase
        .from('portals')
        .select('*')
        .eq('user_id', userId)
        .single();

    if (portal) {
        // Agar portal hai, to input fields me data bhar do
        document.getElementById('inputPortalName').value = portal.portal_name;
        // Baaki settings update...
    } else {
        console.log("New user - Portal DB entry will be created when they save settings.");
    }
}