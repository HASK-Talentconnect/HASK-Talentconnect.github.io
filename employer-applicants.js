/* ============================================
   HASK Talent Connect - Employer Applicants
   View applicants + Change status + Notify
   ============================================ */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
    getFirestore, collection, query, where, getDocs, doc,
    updateDoc, addDoc, getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

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
let allApplicants = [];
let filteredApplicants = [];
let myJobs = [];

// ============ AUTH ============
onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.replace('login.html?redirect=' + encodeURIComponent('employer-applicants.html'));
        return;
    }
    currentUser = user;

    const lb = document.getElementById('logoutBtn');
    if (lb) lb.addEventListener('click', async (e) => {
        e.preventDefault();
        if (!confirm('Logout?')) return;
        try {
            await signOut(auth);
            window.location.replace('login.html');
        } catch (err) { alert(err.message); }
    });

    await loadApplicants();
});

// ============ LOAD APPLICANTS ============
async function loadApplicants() {
    try {
        // 1. Get MY jobs (employerId == currentUser.uid)
        const jobsQ = query(
            collection(db, "jobs"),
            where("employerId", "==", currentUser.uid)
        );
        const jobsSnap = await getDocs(jobsQ);
        myJobs = [];
        const jobIds = [];
        jobsSnap.forEach(d => {
            myJobs.push({ id: d.id, ...d.data() });
            jobIds.push(d.id);
        });

        // 2. Get applications for these jobs
        allApplicants = [];
        if (jobIds.length > 0) {
            for (const jobId of jobIds) {
                const appQ = query(
                    collection(db, "applications"),
                    where("jobId", "==", jobId)
                );
                const appSnap = await getDocs(appQ);
                appSnap.forEach(d => allApplicants.push({ id: d.id, ...d.data() }));
            }
        }

        // Sort by applied date desc
        allApplicants.sort((a, b) => (b.appliedAt || '').localeCompare(a.appliedAt || ''));

        // Build job filter
        buildJobFilter();

        // Update stats
        updateStats();

        // Render all
        filteredApplicants = allApplicants.slice();
        renderApplicants();

    } catch (err) {
        console.error(err);
        document.getElementById('applicantsList').innerHTML = `
            <div class="empty-box">
                <span class="icon">⚠️</span>
                <h3>Error Loading</h3>
                <p>${escapeHtml(err.message)}</p>
            </div>
        `;
    }
}

// ============ BUILD JOB FILTER ============
function buildJobFilter() {
    const row = document.getElementById('jobFilterRow');
    row.innerHTML = `<button class="filter-btn active" data-job="all" onclick="filterByJob('all', this)">All Jobs (${allApplicants.length})</button>`;
    myJobs.forEach(j => {
        const count = allApplicants.filter(a => a.jobId === j.id).length;
        if (count > 0) {
            row.innerHTML += `<button class="filter-btn" data-job="${j.id}" onclick="filterByJob('${j.id}', this)">${escapeHtml(j.title)} (${count})</button>`;
        }
    });
}

// ============ UPDATE STATS ============
function updateStats() {
    document.getElementById('statTotal').textContent = allApplicants.length;
    document.getElementById('statWaiting').textContent = allApplicants.filter(a => (a.status || 'waiting') === 'waiting').length;
    document.getElementById('statReview').textContent = allApplicants.filter(a => a.status === 'reviewed').length;
    document.getElementById('statHired').textContent = allApplicants.filter(a => a.status === 'hired').length;
}

// ============ FILTER ============
window.filterByJob = function(jobId, btn) {
    document.querySelectorAll('#jobFilterRow .filter-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');

    if (jobId === 'all') {
        filteredApplicants = allApplicants.slice();
    } else {
        filteredApplicants = allApplicants.filter(a => a.jobId === jobId);
    }
    renderApplicants();
};

// ============ RENDER ============
function renderApplicants() {
    const list = document.getElementById('applicantsList');

    if (filteredApplicants.length === 0) {
        list.innerHTML = `
            <div class="empty-box">
                <span class="icon">📭</span>
                <h3>No Applicants Yet</h3>
                <p>When job seekers apply for your jobs, they will appear here.</p>
            </div>
        `;
        return;
    }

    list.innerHTML = filteredApplicants.map(a => {
        const status = a.status || 'waiting';
        return `
            <div class="applicant-card" style="border-left-color: ${statusColor(status)};">
                <div class="applicant-info">
                    <span class="status-pill ${status}">${statusLabel(status)}</span>
                    <h3>${escapeHtml(a.userName || 'Unknown Applicant')}</h3>
                    <div class="email">✉️ ${escapeHtml(a.userEmail || '—')}</div>
                    <div class="job-title">💼 Applied for: ${escapeHtml(a.jobTitle || '—')}</div>
                    <div class="meta">
                        <span>🏢 ${escapeHtml(a.company || '—')}</span>
                        ${a.userId ? `<span>🆔 ${escapeHtml(a.userId)}</span>` : ''}
                    </div>
                    <div class="applied-date">📅 Applied: ${formatDate(a.appliedAt)}</div>
                </div>
                <div class="applicant-actions">
                    <button class="action-btn view" onclick="viewApplicant('${a.id}')">👁️ View</button>
                    <button class="action-btn review" onclick="changeStatus('${a.id}', 'reviewed')">🔵 Review</button>
                    <button class="action-btn hire" onclick="changeStatus('${a.id}', 'hired')">🟢 Hire</button>
                    <button class="action-btn reject" onclick="changeStatus('${a.id}', 'rejected')">🔴 Reject</button>
                </div>
            </div>
        `;
    }).join('');
}

function statusColor(s) {
    return { waiting: '#f9c74f', reviewed: '#29b6f6', hired: '#28a745', rejected: '#dc3545', closed: '#6c757d' }[s] || '#f9c74f';
}

function statusLabel(s) {
    return {
        waiting: '🟡 Waiting',
        reviewed: '🔵 Under Review',
        hired: '🟢 Hired',
        rejected: '⚫ Rejected',
        closed: '🔴 Closed'
    }[s] || '🟡 Waiting';
}

// ============ VIEW APPLICANT DETAILS ============
window.viewApplicant = async function(appId) {
    const a = allApplicants.find(x => x.id === appId);
    if (!a) return;

    // Mark as reviewed automatically when viewed
    if ((a.status || 'waiting') === 'waiting') {
        await updateStatusSilent(appId, 'reviewed');
        a.status = 'reviewed';
        updateStats();
        renderApplicants();
        await notifyUser(a.userId, {
            title: '📖 Application Reviewed',
            message: `Your application for "${a.jobTitle}" at ${a.company} has been viewed by the employer.`,
            icon: '🔵'
        });
    }

    // Show modal with details
    showApplicantModal(a);
};

function showApplicantModal(a) {
    // Remove existing modal
    const old = document.getElementById('appDetailModal');
    if (old) old.remove();

    const modal = document.createElement('div');
    modal.className = 'app-detail-modal show';
    modal.id = 'appDetailModal';
    modal.innerHTML = `
        <div class="app-detail-box">
            <div class="app-detail-header">
                <h3>📋 Applicant Details</h3>
                <button class="app-detail-close" onclick="document.getElementById('appDetailModal').remove()">✕</button>
            </div>
            <div class="app-detail-body">
                <div class="app-detail-row"><span class="lbl">Full Name:</span><span class="val">${escapeHtml(a.userName || '—')}</span></div>
                <div class="app-detail-row"><span class="lbl">Email:</span><span class="val">${escapeHtml(a.userEmail || '—')}</span></div>
                <div class="app-detail-row"><span class="lbl">Job Title:</span><span class="val">${escapeHtml(a.jobTitle || '—')}</span></div>
                <div class="app-detail-row"><span class="lbl">Company:</span><span class="val">${escapeHtml(a.company || '—')}</span></div>
                ${a.location ? `<div class="app-detail-row"><span class="lbl">Location:</span><span class="val">${escapeHtml(a.location)}</span></div>` : ''}
                ${a.userId ? `<div class="app-detail-row"><span class="lbl">User ID:</span><span class="val">${escapeHtml(a.userId)}</span></div>` : ''}
                <div class="app-detail-row"><span class="lbl">Applied Date:</span><span class="val">${formatDate(a.appliedAt)}</span></div>
                <div class="app-detail-row"><span class="lbl">Status:</span><span class="val">${statusLabel(a.status || 'waiting')}</span></div>
                <div class="app-detail-row">
                    <span class="lbl">Profile:</span>
                    <span class="val">
                        <a href="cv.html?user=${a.userId}" target="_blank" style="color:#1a2a6c; font-weight:600;">📄 View Full CV →</a>
                    </span>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
}

// ============ CHANGE STATUS ============
window.changeStatus = async function(appId, newStatus) {
    const a = allApplicants.find(x => x.id === appId);
    if (!a) return;

    const labels = {
        reviewed: 'Under Review',
        hired: 'Hired',
        rejected: 'Rejected',
        closed: 'Closed'
    };

    if (!confirm(`Mark this application as "${labels[newStatus]}"?`)) return;

    try {
        await updateDoc(doc(db, "applications", appId), { status: newStatus });
        a.status = newStatus;

        // Send notification to job seeker
        const notifData = {
            reviewed: {
                title: '🔵 Application Under Review',
                message: `Your application for "${a.jobTitle}" at ${a.company} is now under review.`,
                icon: '🔵'
            },
            hired: {
                title: '🎉 Congratulations! You Are Hired',
                message: `The employer has selected you for "${a.jobTitle}" at ${a.company}. Position Filled.`,
                icon: '🎉'
            },
            rejected: {
                title: '📩 Application Update',
                message: `Your application for "${a.jobTitle}" at ${a.company} was not selected this time.`,
                icon: '📩'
            },
            closed: {
                title: '🔴 Position Closed',
                message: `The position "${a.jobTitle}" at ${a.company} has been closed.`,
                icon: '🔴'
            }
        }[newStatus];

        if (notifData) {
            await notifyUser(a.userId, notifData);
        }

        updateStats();
        renderApplicants();
        showToast(`✅ Status updated to "${labels[newStatus]}"`);

    } catch (err) {
        console.error(err);
        showToast('❌ Failed: ' + err.message, true);
    }
};

// Silent status update (no notification)
async function updateStatusSilent(appId, newStatus) {
    try {
        await updateDoc(doc(db, "applications", appId), { status: newStatus });
    } catch (e) { console.warn(e); }
}

// ============ SEND NOTIFICATION TO USER ============
async function notifyUser(userId, data) {
    if (!userId) return;
    try {
        await addDoc(collection(db, "notifications"), {
            userId: userId,
            title: data.title || 'Notification',
            message: data.message || '',
            icon: data.icon || '🔔',
            read: false,
            createdAt: new Date().toISOString()
        });
    } catch (e) { console.warn('Notify error:', e); }
}

// ============ HELPERS ============
function formatDate(dateStr) {
    if (!dateStr) return '—';
    try {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        const m = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        return `${String(d.getDate()).padStart(2,'0')}-${m[d.getMonth()]}-${d.getFullYear()}`;
    } catch (e) { return dateStr; }
}

function escapeHtml(s) {
    if (!s) return '';
    return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
}

function showToast(msg, isError) {
    let t = document.getElementById('miniToast');
    if (!t) {
        t = document.createElement('div');
        t.id = 'miniToast';
        t.className = 'toast-mini';
        document.body.appendChild(t);
    }
    t.textContent = msg;
    t.className = 'toast-mini' + (isError ? ' error' : '') + ' show';
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.remove('show'), 3000);
}

console.log('✅ Employer-applicants.js loaded');
