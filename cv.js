/* ============================================
   HASK TalentConnect - CV/Resume Loader
   ============================================ */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

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

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.replace('login.html?redirect=' + encodeURIComponent('cv.html'));
        return;
    }

    try {
        // Load user basic
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const userData = userDoc.exists() ? userDoc.data() : { name: user.displayName, email: user.email };

        // Load profile
        const profileDoc = await getDoc(doc(db, "profiles", user.uid));
        const profile = profileDoc.exists() ? profileDoc.data() : {};

        renderCV(userData, profile);

        document.getElementById('loadingScreen').style.display = 'none';
        document.getElementById('cvContent').style.display = 'block';

    } catch (err) {
        console.error(err);
        document.getElementById('loadingScreen').innerHTML = `
            <p style="color:#c33;">❌ Failed to load CV: ${err.message}</p>
            <a href="profile.html" style="color:#1a2a6c; font-weight:bold; margin-top:15px;">← Back to Profile</a>
        `;
    }
});

function renderCV(userData, profile) {
    const p = profile.personal || {};

    // Header date
    document.getElementById('headerDate').textContent = '📅 ' + formatDate(new Date());

    // Name
    document.getElementById('cvName').textContent = p.fullName || userData.name || 'Your Name';

    // Role
    const exp = profile.experience || {};
    const latestJob = exp.entries && exp.entries[0];
    const role = latestJob ? latestJob.title : (p.interest || 'Professional');
    document.getElementById('cvRole').textContent = role;

    // User ID
    document.getElementById('cvUserId').textContent = '🆔 ' + (userData.userId || '—');

    // Photo
    if (p.profilePic) {
        document.getElementById('cvPhoto').innerHTML = `<img src="${p.profilePic}" alt="Photo">`;
    }

    // Contact
    const contacts = [];
    if (p.cell) contacts.push(`<span>📞 ${escapeHtml(p.cell)}</span>`);
    if (p.email || userData.email) contacts.push(`<span>✉️ ${escapeHtml(p.email || userData.email)}</span>`);
    if (p.city || p.domicile) contacts.push(`<span>📍 ${escapeHtml(p.city || p.domicile)}${p.province ? ', ' + escapeHtml(p.province) : ''}</span>`);
    if (profile.misc && profile.misc.linkedin) contacts.push(`<span>🌐 <a href="${escapeAttr(profile.misc.linkedin)}" target="_blank">LinkedIn</a></span>`);
    document.getElementById('cvContact').innerHTML = contacts.join('');

    // Objective
    if (profile.self && profile.self.objective) {
        document.getElementById('objectiveSection').style.display = 'block';
        document.getElementById('cvObjective').textContent = profile.self.objective;
    }

    // Skills + Strengths
    const skills = profile.skills || [];
    const self = profile.self || {};

    if (skills.length > 0 || self.strengths) {
        document.getElementById('skillsStrengthsSection').style.display = 'grid';

        if (skills.length > 0) {
            document.getElementById('cvSkills').innerHTML = skills.map(s => `
                <div class="skill-item">
                    <span class="skill-name">${escapeHtml(s.name)}</span>
                    <span class="skill-level">${escapeHtml(s.level)}</span>
                </div>
            `).join('');
        }

        if (self.strengths) {
            const strengthsList = self.strengths.split(/[\n,•]+/).map(s => s.trim()).filter(s => s);
            document.getElementById('cvStrengths').innerHTML = strengthsList.map(s => `
                <div class="list-item">${escapeHtml(s)}</div>
            `).join('');
        }
    }

    // Experience
    const expEntries = (exp.entries || []);
    if (expEntries.length > 0) {
        document.getElementById('experienceSection').style.display = 'block';
        document.getElementById('cvExpYears').textContent = exp.overall ? `(${exp.overall} Years Total)` : '';

        document.getElementById('cvExperience').innerHTML = expEntries.map(e => {
            const descLines = (e.description || '').split('\n').map(l => l.trim()).filter(l => l);
            const descHTML = descLines.length > 0 
                ? `<div class="exp-desc">${descLines.map(l => `<div>${escapeHtml(l.replace(/^[•\-\*]\s*/, ''))}</div>`).join('')}</div>` 
                : '';

            return `
                <div class="exp-entry">
                    <div class="exp-header">
                        <span class="exp-title">${escapeHtml(e.title)}</span>
                        <span class="exp-dates">${formatMonth(e.joining)} – ${e.leaving ? formatMonth(e.leaving) : 'Present'}</span>
                    </div>
                    <div class="exp-company">${escapeHtml(e.employer)}${e.business ? ` • ${escapeHtml(e.business)}` : ''}</div>
                    ${descHTML}
                </div>
            `;
        }).join('');
    }

    // Education + Certifications
    const eduList = profile.education || [];
    const certList = profile.certifications || [];

    if (eduList.length > 0 || certList.length > 0) {
        document.getElementById('eduCertSection').style.display = 'grid';

        if (eduList.length > 0) {
            document.getElementById('cvEducation').innerHTML = eduList.map(e => `
                <div class="edu-entry">
                    <div class="edu-header">
                        <span class="edu-degree">${escapeHtml(e.level)}</span>
                        <span class="edu-year">${formatMonth(e.date)}</span>
                    </div>
                    <div class="edu-institution">${escapeHtml(e.title)} — ${escapeHtml(e.institution)}</div>
                    ${e.percentage ? `<div class="edu-grade">Grade: ${escapeHtml(e.percentage)}</div>` : ''}
                </div>
            `).join('');
        }

        if (certList.length > 0) {
            document.getElementById('cvCertifications').innerHTML = certList.map(c => `
                <div class="edu-entry">
                    <div class="edu-header">
                        <span class="edu-degree">${escapeHtml(c.name)}</span>
                        <span class="edu-year">${escapeHtml(c.year)}</span>
                    </div>
                    <div class="edu-institution">${escapeHtml(c.issuer)}</div>
                    ${c.certId ? `<div class="edu-grade" style="color:#666;">ID: ${escapeHtml(c.certId)}</div>` : ''}
                </div>
            `).join('');
        }
    }

    // References
    const refs = profile.references || {};
    if (refs.ref1Name || refs.ref2Name) {
        document.getElementById('referencesSection').style.display = 'block';
        let refsHTML = '';
        if (refs.ref1Name) refsHTML += renderRef(refs, 1, 'Personal');
        if (refs.ref2Name) refsHTML += renderRef(refs, 2, 'Professional');
        document.getElementById('cvReferences').innerHTML = refsHTML;
    }
}

function renderRef(refs, num, type) {
    const name = refs[`ref${num}Name`] || '';
    const designation = refs[`ref${num}Designation`] || '';
    const org = refs[`ref${num}Org`] || '';
    const phone = refs[`ref${num}Phone`] || '';
    const email = refs[`ref${num}Email`] || '';

    return `
        <div class="ref-item">
            <div class="ref-name">${escapeHtml(name)} <span style="font-size:8pt;color:#888;font-weight:normal;">(${type})</span></div>
            <div class="ref-designation">${escapeHtml(designation)}</div>
            <div class="ref-org">${escapeHtml(org)}</div>
            <div class="ref-contact">
                ${phone ? `<div>📞 ${escapeHtml(phone)}</div>` : ''}
                ${email ? `<div>✉️ ${escapeHtml(email)}</div>` : ''}
            </div>
        </div>
    `;
}

function formatDate(d) {
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${String(d.getDate()).padStart(2,'0')}-${months[d.getMonth()]}-${d.getFullYear()}`;
}

function formatMonth(dateStr) {
    if (!dateStr) return '—';
    try {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        return `${months[d.getMonth()]} ${d.getFullYear()}`;
    } catch (e) {
        return dateStr;
    }
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>"']/g, c => ({
        '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
    })[c]);
}

function escapeAttr(str) {
    if (!str) return '';
    return String(str).replace(/["'&<>]/g, c => ({
        '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
    })[c]);
}

// ============================================
// DOWNLOAD PDF
// ============================================
window.downloadPDF = function() {
    // Trigger print dialog → user selects "Save as PDF"
    window.print();
};
