/* ============================================
   HASK Talent Connect - Job Applied
   Shows only MY applications + Notifications
   ============================================ */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
    getFirestore, collection, query, where, getDocs, doc,
    updateDoc, orderBy, onSnapshot
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
let allApps = [];
let filteredApps = [];
let notifUnsubscribe = null;

// ============ AUTH ============
onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.replace('login.html?redirect=' + encodeURIComponent('job-applied.html'));
        return;
    }
    currentUser = user;

    // Setup logout
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

    // Load apps
    await loadApplications();

    // Setup bell
    initBell();
    listenNotifications();
});

// ============ LOAD MY APPLICATIONS ============
async function loadApplications() {
    try {
        // Only MY applications (userId == currentUser.uid)
        const q = query(
            collection(db, "applications"),
            where("userId", "==", currentUser.uid)
        );
        const snap = await getDocs(q);

        allApps = [];
        snap.forEach(d => allApps.push({ id: d.id, ...d.data() }));

        // Sort by applied date (newest first)
        allApps.sort((a, b) => (b.appliedAt || '').localeCompare(a.appliedAt || ''));

        // Update stats
        updateStats();

        // Show all initially
        filteredApps = allApps.slice();
        renderApplications();

    } catch (err) {
        console.error(err);
        document.getElementById('appliedList').innerHTML = `
            <div class="empty-box">
                <span class="icon">⚠️</span>
                <h3>Error Loading</h3>
                <p>${escapeHtml(err.message)}</p>
            </div>
        `;
    }
}

// ============ UPDATE STATS ============
function updateStats() {
    const total = allApps.length;
    const waiting = allApps.filter(a => (a.status || 'waiting') === 'waiting').length;
    const reviewed = allApps.filter(a => a.status === 'reviewed').length;
    const closed = allApps.filter(a => a.status === 'closed' || a.status === 'rejected').length;

    document.getElementById('statTotal').textContent = total;
    document.getElementById('statWaiting').textContent = waiting;
    document.getElementById('statReview').textContent = reviewed;
    document.getElementById('statClosed').textContent = closed;
}

// ============ RENDER APPLICATIONS ============
function renderApplications() {
    const list = document.getElementById('appliedList');

    if (filteredApps.length === 0) {
        list.innerHTML = `
            <div class="empty-box">
                <span class="icon">📭</span>
                <h3>No Applications Yet</h3>
                <p>You haven't applied for any jobs. Browse jobs and start applying!</p>
                <a href="jobs.html" class="btn-browse">Browse Jobs →</a>
            </div>
        `;
        return;
    }

    list.innerHTML = filteredApps.map(a => {
        const status = a.status || 'waiting';
        const statusInfo = getStatusInfo(status);
        const appliedDate = formatDate(a.appliedAt);
        const deadlineInfo = a.deadline ? `<span>📅 Deadline: ${formatDate(a.deadline)}</span>` : '';

        return `
            <div class="job-app-card" style="border-left-color: ${statusInfo.color};">
                <div class="job-app-info">
                    <h3>${escapeHtml(a.jobTitle || 'Untitled Job')}</h3>
                    <div class="company">🏢 ${escapeHtml(a.company || 'Unknown Company')}</div>
                    <div class="meta">
                        ${a.location ? `<span>📍 ${escapeHtml(a.location)}</span>` : ''}
                        ${a.category ? `<span>📂 ${escapeHtml(a.category)}</span>` : ''}
                        ${deadlineInfo}
                    </div>
                    <div class="applied-date">📅 Applied on: ${appliedDate}</div>
                </div>
                <div class="job-app-status">
                    <span class="status-badge status-${status}">
                        ${statusInfo.icon} ${statusInfo.label}
                    </span>
                </div>
            </div>
        `;
    }).join('');
}

// ============ STATUS INFO ============
function getStatusInfo(status) {
    switch (status) {
        case 'waiting':
            return { icon: '🟡', label: 'Waiting for Employer', color: '#f9c74f' };
        case 'reviewed':
            return { icon: '🔵', label: 'Under Review', color: '#29b6f6' };
        case 'hired':
            return { icon: '🟢', label: 'Hired — Position Filled', color: '#28a745' };
        case 'rejected':
            return { icon: '⚫', label: 'Not Selected', color: '#6c757d' };
        case 'closed':
            return { icon: '🔴', label: 'Date Closed', color: '#dc3545' };
        default:
            return { icon: '🟡', label: 'Waiting for Employer', color: '#f9c74f' };
    }
}

// ============ FILTER ============
window.filterApplications = function(status, btn) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');

    if (status === 'all') {
        filteredApps = allApps.slice();
    } else if (status === 'closed') {
        filteredApps = allApps.filter(a => a.status === 'closed' || a.status === 'rejected');
    } else {
        filteredApps = allApps.filter(a => (a.status || 'waiting') === status);
    }
    renderApplications();
};

// ============ NOTIFICATION BELL ============
function initBell() {
    const bell = document.getElementById('notifBell');
    if (!bell) return;

    bell.addEventListener('click', (e) => {
        e.stopPropagation();
        const dropdown = document.getElementById('notifDropdown');
        if (!dropdown) return;
        if (dropdown.classList.contains('show')) {
            dropdown.classList.remove('show');
        } else {
            dropdown.classList.add('show');
            renderNotifications();
        }
    });

    document.addEventListener('click', (e) => {
        const dropdown = document.getElementById('notifDropdown');
        const bellEl = document.getElementById('notifBell');
        if (dropdown && bellEl && !dropdown.contains(e.target) && !bellEl.contains(e.target)) {
            dropdown.classList.remove('show');
        }
    });
}

function listenNotifications() {
    if (!currentUser) return;
    if (notifUnsubscribe) notifUnsubscribe();

    const q = query(
        collection(db, "notifications"),
        where("userId", "==", currentUser.uid)
    );

    notifUnsubscribe = onSnapshot(q, (snap) => {
        const unread = snap.docs.filter(d => !d.data().read).length;
        updateBadge(unread);
    }, (err) => {
        console.warn("Notif listener error:", err.message);
    });
}

function updateBadge(count) {
    const badge = document.getElementById('notifBadge');
    if (!badge) return;
    if (count > 0) {
        badge.textContent = count > 9 ? '9+' : count;
        badge.style.display = 'flex';
    } else {
        badge.style.display = 'none';
    }
}

async function renderNotifications() {
    const list = document.getElementById('notifList');
    if (!list || !currentUser) return;

    list.innerHTML = '<div class="notif-empty">Loading...</div>';

    try {
        const q = query(
            collection(db, "notifications"),
            where("userId", "==", currentUser.uid)
        );
        const snap = await getDocs(q);

        let notifs = [];
        snap.forEach(d => notifs.push({ id: d.id, ...d.data() }));
        notifs.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));

        if (notifs.length === 0) {
            list.innerHTML = `
                <div class="notif-empty">
                    <div style="font-size:2rem; margin-bottom:10px;">🔔</div>
                    <p>No notifications yet</p>
                </div>
            `;
            return;
        }

        list.innerHTML = notifs.map(n => `
            <div class="notif-item ${n.read ? '' : 'unread'}" data-id="${n.id}">
                <div class="notif-icon">${n.icon || '🔔'}</div>
                <div class="notif-content">
                    <div class="notif-title">${escapeHtml(n.title || 'Notification')}</div>
                    <div class="notif-message">${escapeHtml(n.message || '')}</div>
                    <div class="notif-time">${timeAgo(n.createdAt)}</div>
                </div>
            </div>
        `).join('');

        list.querySelectorAll('.notif-item').forEach(item => {
            item.addEventListener('click', async () => {
                const id = item.dataset.id;
                try {
                    await updateDoc(doc(db, "notifications", id), { read: true });
                    item.classList.remove('unread');
                    setTimeout(() => renderNotifications(), 300);
                } catch (e) { console.warn(e); }
            });
        });

    } catch (err) {
        list.innerHTML = '<div class="notif-empty">Error loading</div>';
    }
}

window.markAllRead = async function() {
    if (!currentUser) return;
    try {
        const q = query(
            collection(db, "notifications"),
            where("userId", "==", currentUser.uid)
        );
        const snap = await getDocs(q);
        for (const d of snap.docs) {
            if (!d.data().read) {
                await updateDoc(doc(db, "notifications", d.id), { read: true });
            }
        }
        renderNotifications();
    } catch (e) { console.warn(e); }
};

// ============ HELPERS ============
function formatDate(dateStr) {
    if (!dateStr) return '—';
    try {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        return `${String(d.getDate()).padStart(2,'0')}-${months[d.getMonth()]}-${d.getFullYear()}`;
    } catch (e) { return dateStr; }
}

function timeAgo(dateStr) {
    if (!dateStr) return 'just now';
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins} min ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} hr ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
    return new Date(dateStr).toLocaleDateString('en-GB');
}

function escapeHtml(s) {
    if (!s) return '';
    return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
}

console.log('✅ Job-applied.js loaded');
