/* ============================================
   HASK Talent Connect - Smart Job Dashboard
   Matching Algorithm + Score
   ============================================ */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, collection, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAreIiCnSheAeXc2wNeU7-qFj-qFhaXZAo",
    authDomain: "hask-talentconnect.firebaseapp.com",
    projectId: "hask-talentconnect",
    storageBucket: "hask-talentconnect.firebasestorage.app",
    messagingSenderId: "532290737820",
    appId: "1:532290737820:web:49f70281b0f34837757f59"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let currentUser = null;
let userData = null;
let profile = null;
let allJobs = [];
let matchedJobs = [];
let currentFilter = 'all';

// ============ INIT ============
onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.replace('login.html?redirect=' + encodeURIComponent('dashboard.html'));
        return;
    }
    currentUser = user;

    // Logout
    const lb = document.getElementById('logoutBtn');
    if (lb) lb.addEventListener('click', async (e) => {
        e.preventDefault();
        if (!confirm('Logout?')) return;
        try {
            sessionStorage.removeItem('hask_logged_in');
            await signOut(auth);
            window.location.replace('login.html');
        } catch (err) { alert(err.message); }
    });

    // Load data
    await loadUser();
    await loadProfile();
    await loadJobs();

    // Update UI
    renderUserHeader();
    renderProfileSnapshot();
    renderProfileCompletion();

    // Match jobs
    runMatching();

    document.getElementById('loadingScreen') && (document.getElementById('loadingScreen').style.display = 'none');
});

// ============ LOAD USER ============
async function loadUser() {
    try {
        const ud = await getDoc(doc(db, "users", currentUser.uid));
        userData = ud.exists() ? ud.data() : { name: currentUser.displayName || 'User', email: currentUser.email };
    } catch (e) {
        userData = { name: currentUser.displayName || 'User', email: currentUser.email };
    }
}

// ============ LOAD PROFILE ============
async function loadProfile() {
    try {
        const pd = await getDoc(doc(db, "profiles", currentUser.uid));
        profile = pd.exists() ? pd.data() : {};
    } catch (e) { profile = {}; }
}

// ============ LOAD ALL JOBS ============
async function loadJobs() {
    try {
        const snap = await getDocs(collection(db, "jobs"));
        allJobs = [];
        snap.forEach(d => allJobs.push({ id: d.id, ...d.data() }));
    } catch (e) {
        console.error('Jobs load error:', e);
        allJobs = [];
    }
}

// ============ RENDER USER HEADER ============
function renderUserHeader() {
    const name = (userData.name || 'User').split(' ')[0];
    document.getElementById('userName').textContent = name;
}

// ============ RENDER PROFILE SNAPSHOT ============
function renderProfileSnapshot() {
    const p = profile.personal || {};
    const skills = profile.skills || [];
    const education = profile.education || [];
    const exp = profile.experience || {};

    document.getElementById('snapSkills').textContent = skills.length;

    const eduLevels = ['PhD', 'MPhil', 'Master', 'Bachelor', 'Intermediate/A-Level', 'Matriculation/O-Level'];
    let topEdu = '—';
    for (const lvl of eduLevels) {
        if (education.find(e => e.level === lvl)) {
            topEdu = lvl.replace('/O-Level', '').replace('/A-Level', '');
            break;
        }
    }
    document.getElementById('snapEdu').textContent = topEdu;

    const totalYears = calculateTotalExp(exp.entries || []);
    document.getElementById('snapExp').textContent = totalYears.toFixed(1) + ' yrs';

    document.getElementById('snapLoc').textContent = p.city || p.district || '—';
}

function calculateTotalExp(entries) {
    let total = 0;
    entries.forEach(e => {
        const j = new Date(e.joining);
        const l = e.isCurrent || !e.leaving ? new Date() : new Date(e.leaving);
        if (!isNaN(j) && !isNaN(l)) {
            total += Math.max(0, (l - j) / (1000 * 60 * 60 * 24 * 365.25));
        }
    });
    return total;
}

// ============ RENDER PROFILE COMPLETION ============
function renderProfileCompletion() {
    const p = profile;
    let score = 0;

    if (p.personal && p.personal.fullName) score += 15;
    if (p.personal && p.personal.cnic) score += 5;
    if (p.education && p.education.length > 0) score += 15;
    if (p.experience && (p.experience.has === false || (p.experience.entries && p.experience.entries.length > 0))) score += 20;
    if (p.skills && p.skills.length > 0) score += 15;
    if (p.languages && p.languages.length > 0) score += 5;
    if (p.self && p.self.title && p.self.objective) score += 10;
    if (p.references && (p.references.ref1Name || p.references.ref2Name)) score += 5;
    if (p.misc && p.misc.source) score += 5;
    if (p.compensation && (p.compensation.basic > 0 || p.compensation.gross > 0)) score += 5;

    score = Math.min(score, 100);

    document.getElementById('pcBarFill').style.width = score + '%';
    document.getElementById('pcPercent').textContent = score + '%';
}

// ============ SMART MATCHING ============
function runMatching() {
    if (!allJobs || allJobs.length === 0) {
        document.getElementById('jobsList').innerHTML = `
            <div class="empty-box">
                <span class="icon">📭</span>
                <h3>No Jobs Available</h3>
                <p>No jobs have been posted yet. Please check back later.</p>
                <a href="index.html" class="btn-browse-all" style="margin-top:15px;">← Back to Homepage</a>
            </div>
        `;
        return;
    }

    matchedJobs = allJobs.map(job => {
        const matchResult = calculateMatchScore(job, profile);
        return { ...job, ...matchResult };
    });

    // Sort by score desc
    matchedJobs.sort((a, b) => b.score - a.score);

    // Update stats
    updateStats();

    // Render
    renderMatchedJobs();
}

// ============ MATCH SCORE CALCULATION ============
function calculateMatchScore(job, profile) {
    let score = 0;
    const reasons = [];
    const missing = [];

    // ---------- 1. SKILLS MATCH (40%) ----------
    const userSkills = (profile.skills || []).map(s => (s.name || '').toLowerCase());
    const jobText = ((job.title || '') + ' ' + (job.description || '') + ' ' + (job.requirements || '')).toLowerCase();

    let skillMatches = 0;
    let skillTotal = 0;

    if (userSkills.length > 0) {
        userSkills.forEach(skill => {
            if (!skill) return;
            skillTotal++;
            if (jobText.includes(skill)) {
                skillMatches++;
                if (reasons.length < 4) reasons.push(`✅ ${skill}`);
            }
        });

        const skillRatio = skillTotal > 0 ? skillMatches / skillTotal : 0;
        score += skillRatio * 40;

        if (skillMatches === 0 && userSkills.length > 0) {
            missing.push('⚠️ No skill matches');
        }
    } else {
        missing.push('⚠️ Add skills to profile');
    }

    // ---------- 2. EDUCATION MATCH (20%) ----------
    const education = profile.education || [];
    if (education.length > 0) {
        const eduLevels = ['PhD', 'MPhil', 'Master', 'Bachelor', 'Intermediate/A-Level', 'Matriculation/O-Level'];
        let userEduRank = -1;

        for (let i = 0; i < eduLevels.length; i++) {
            if (education.find(e => e.level === eduLevels[i])) {
                userEduRank = i;
                break;
            }
        }

        const jobEduText = (job.education || '').toLowerCase();
        const jobRequiresDegree = ['bachelor', 'master', 'mphil', 'phd', 'graduation', 'degree', 'ba', 'bs', 'bba', 'mba', 'msc', 'bsc'].some(kw => jobEduText.includes(kw));

        if (jobRequiresDegree) {
            if (userEduRank <= 3) {
                score += 20;
                reasons.push('✅ Education matches');
            } else {
                score += 8;
                missing.push('⚠️ Higher degree preferred');
            }
        } else {
            score += 15;
            reasons.push('✅ Education OK');
        }
    } else {
        missing.push('⚠️ Add education');
    }

    // ---------- 3. EXPERIENCE MATCH (20%) ----------
    const expEntries = (profile.experience && profile.experience.entries) || [];
    const totalYears = calculateTotalExp(expEntries);

    const jobExpText = (job.experience || '').toLowerCase();
    let jobRequires = 0;
    if (jobExpText.includes('5+')) jobRequires = 5;
    else if (jobExpText.includes('3-5')) jobRequires = 3;
    else if (jobExpText.includes('1-2')) jobRequires = 1;
    else if (jobExpText.includes('fresh')) jobRequires = 0;

    if (totalYears >= jobRequires) {
        score += 20;
        if (totalYears > 0) reasons.push(`✅ ${totalYears.toFixed(1)} yrs exp`);
    } else if (totalYears > 0) {
        const ratio = Math.max(0, totalYears / Math.max(jobRequires, 1));
        score += ratio * 15;
        missing.push(`⚠️ Need ${jobRequires} yrs (have ${totalYears.toFixed(1)})`);
    } else {
        missing.push('⚠️ Add experience');
    }

    // ---------- 4. CATEGORY/INTEREST MATCH (10%) ----------
    const p = profile.personal || {};
    const userInterest = (p.interest || '').toLowerCase();
    const jobCategory = (job.category || '').toLowerCase();

    if (userInterest && jobCategory) {
        // Map interest text to category keywords
        const interestMap = {
            'it & software': ['it', 'software', 'developer', 'web'],
            'sales & marketing': ['sales', 'marketing'],
            'accounting & finance': ['account', 'finance', 'audit'],
            'hr & admin': ['hr', 'admin', 'human resource'],
            'engineering': ['engineer', 'mechanic', 'civil', 'electric'],
            'education': ['teach', 'education', 'tutor', 'lecturer'],
            'healthcare': ['health', 'medical', 'nurse', 'doctor'],
            'construction': ['construction', 'build', 'mason'],
            'transport': ['transport', 'driver', 'delivery'],
            'security': ['security', 'guard'],
            'hospitality': ['hotel', 'hospitality', 'chef', 'waiter'],
            'retail': ['retail', 'shop', 'store'],
            'manufacturing': ['manufactur', 'production', 'factory'],
            'textile': ['textile', 'tailor', 'stitch'],
            'telecom': ['telecom', 'network']
        };

        const kws = interestMap[userInterest] || [];
        const matches = kws.some(kw => jobCategory.includes(kw) || jobText.includes(kw));
        if (matches) {
            score += 10;
            reasons.push('✅ Category match');
        } else {
            missing.push('⚠️ Different category');
        }
    } else {
        score += 
