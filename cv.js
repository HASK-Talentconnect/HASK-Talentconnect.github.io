/* ============================================
   HASK TalentConnect - CV Loader
   Latest First Experience + Direct Download
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

const urlParams = new URLSearchParams(window.location.search);
const isDownloadMode = urlParams.get('download') === '1';

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.replace('login.html?redirect=' + encodeURIComponent('cv.html'));
        return;
    }

    try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const userData = userDoc.exists() ? userDoc.data() : { name: user.displayName, email: user.email };

        const profileDoc = await getDoc(doc(db, "profiles", user.uid));
        const profile = profileDoc.exists() ? profileDoc.data() : {};

        renderCV(userData, profile);

        document.getElementById('loadingScreen').style.display = 'none';
        document.getElementById('cvContent').style.display = 'block';

        // Auto-download if mode
        if (isDownloadMode) {
            setTimeout(() => {
                downloadPDF();
            }, 800);
        }

    } catch (err) {
        console.error(err);
        document.getElementById('loadingScreen').innerHTML = `
            <p style="color:#c33;">❌ Failed to load CV: ${err.message}</p>
            <a href="profile.html" style="color:#1a2a6c;font-weight:bold;margin-top:15px;">← Back to Profile</a>
        `;
    }
});

function renderCV(userData, profile) {
    const p = profile.personal || {};

    document.getElementById('headerDate').textContent = '📅 ' + formatDate(new Date());
    document.getElementById('cvName').textContent = p.fullName || userData.name || 'Your Name';

    // Professional Title from Self Assessment (manual)
    const self = profile.self || {};
    document.getElementById('cvRole').textContent = self.title || 'Professional';

    document.getElementById('cvUserId').textContent = '🆔 ' + (userData.userId || '—');

    if (p.profilePic) {
        document.getElementById('cvPhoto').innerHTML = `<img src="${p.profilePic}" alt="Photo">`;
    }

    // Contacts
    const contacts = [];
    if (p.cell) contacts.push(`<span>📞 ${esc(p.cell)}</span>`);
    if (p.email || userData.email) contacts.push(`<span>✉️ ${esc(p.email || userData.email)}</span>`);
    if (p.city || p.district) contacts.push(`<span>📍 ${esc(p.city || p.district)}${p.province ? ', ' + esc(p.province) : ''}</span>`);
    if (profile.misc && profile.misc.linkedin) contacts.push(`<span>🌐 <a href="${escA(profile.misc.linkedin)}" target="_blank">LinkedIn</a></span>`);
    document.getElementById('cvContact').innerHTML = contacts.join('');

    // Objective
    if (self.objective) {
        document.getElementById('objectiveSection').style.display = 'block';
        document.getElementById('cvObjective').textContent = self.objective;
    }

    // Skills + Strengths
    const skills = profile.skills || [];
    if (skills.length > 0 || self.strengths) {
        document.getElementById('skillsStrengthsSection').style.display = 'grid';

        if (skills.length > 0) {
            document.getElementById('cvSkills').innerHTML = skills.map(s => `
                <div class="skill-item">
                    <span class="skill-name">${esc(s.name)}</span>
                    <span class="skill-level">${esc(s.level)}</span>
                </div>
            `).join('');
        } else {
            document.getElementById('cvSkills').innerHTML = '<p style="color:#888;font-style:italic;">No skills added</p>';
        }

        if (self.strengths) {
            const list = self.strengths.split(/[\n,•]+/).map(s => s.trim()).filter(s => s);
            document.getElementById('cvStrengths').innerHTML = list.map(s => `<div class="list-item">${esc(s)}</div>`).join('');
        } else {
            document.getElementById('cvStrengths').innerHTML = '<p style="color:#888;font-style:italic;">No strengths</p>';
        }
    }

    // Experience — LATEST FIRST (sort by joining date desc)
    const exp = profile.experience || {};
    let entries = (exp.entries || []).slice();
    entries.sort((a, b) => {
        const da = new Date(a.joining || 0);
        const dbb = new Date(b.joining || 0);
        return dbb - da;
    });

    if (entries.length > 0) {
        document.getElementById('experienceSection').style.display = 'block';

        // Calculate total years
        let totalYears = 0;
        entries.forEach(e => {
            const j = new Date(e.joining);
            const l = e.isCurrent || !e.leaving ? new Date() : new Date(e.leaving);
            if (!isNaN(j) && !isNaN(l)) {
                totalYears += Math.max(0, (l - j) / (1000 * 60 * 60 * 24 * 365.25));
            }
        });
        document.getElementById('cvExpYears').textContent = totalYears > 0 ? `(${totalYears.toFixed(1)} Years Total)` : '';

        document.getElementById('cvExperience').innerHTML = entries.map(e => {
            const descLines = (e.description || '').split('\n').map(l => l.trim()).filter(l => l);
            const descHTML = descLines.length > 0
                ? `<div class="exp-desc">${descLines.map(l => `<div>${esc(l.replace(/^[•\-\*]\s*/, ''))}</div>`).join('')}</div>`
                : '';

            const contactHTML = e.contact === 'Yes' && e.contactName
                ? `<div class="exp-contact-info">📞 Contact: <strong>${esc(e.contactName)}</strong>${e.contactTitle ? ' (' + esc(e.contactTitle) + ')' : ''}${e.contactPhone ? ' — ' + esc(e.contactPhone) : ''}</div>`
                : '';

            return `
                <div class="exp-entry">
                    <div class="exp-header">
                        <span class="exp-title">${esc(e.title)}</span>
                        <span class="exp-dates">${fmtMonth(e.joining)} – ${e.isCurrent ? 'Present' : (e.leaving ? fmtMonth(e.leaving) : '—')}</span>
                    </div>
                    <div class="exp-company">${esc(e.employer)}${e.industry ? ' • ' + esc(e.industry) : ''}</div>
                    ${e.location ? `<div class="exp-location">📍 ${esc(e.location)}</div>` : ''}
                    ${descHTML}
                    ${contactHTML}
                </div>
            `;
        }).join('');
    }

    // Education + Certifications
    const edu = profile.education || [];
    const certs = profile.certifications || [];
    if (edu.length > 0 || certs.length > 0) {
        document.getElementById('eduCertSection').style.display = 'grid';

        if (edu.length > 0) {
            document.getElementById('cvEducation').innerHTML = edu.map(e => `
                <div class="edu-entry">
                    <div class="edu-header">
                        <span class="edu-degree">${esc(e.level)}</span>
                        <span class="edu-year">${fmtMonth(e.date)}</span>
                    </div>
                    <div class="edu-institution">${esc(e.title)} — ${esc(e.institution)}</div>
                    ${e.percentage ? `<div class="edu-grade">Grade: ${esc(e.percentage)}</div>` : ''}
                </div>
            `).join('');
        } else {
            document.getElementById('cvEducation').innerHTML = '<p style="color:#888;font-style:italic;">No education</p>';
        }

        if (certs.length > 0) {
            document.getElementById('cvCertifications').innerHTML = certs.map(c => `
                <div class="edu-entry">
                    <div class="edu-header">
                        <span class="edu-degree">${esc(c.name)}</span>
                        <span class="edu-year">${esc(c.year)}</span>
                    </div>
                    <div class="edu-institution">${esc(c.issuer)}</div>
                    ${c.certId ? `<div class="edu-grade" style="color:#666;">ID: ${esc(c.certId)}</div>` : ''}
                </div>
            `).join('');
        } else {
            document.getElementById('cvCertifications').innerHTML = '<p style="color:#888;font-style:italic;">No certifications</p>';
        }
    }

    // Languages
    const langs = profile.languages || [];
    if (langs.length > 0) {
        document.getElementById('languagesSection').style.display = 'block';
        document.getElementById('cvLanguages').innerHTML = `
            <div class="lang-tags">
                ${langs.map(l => `<span class="lang-tag">${esc(l)}</span>`).join('')}
            </div>
        `;
    }

    // References
    const refs = profile.references || {};
    if (refs.ref1Name || refs.ref2Name) {
        document.getElementById('referencesSection').style.display = 'block';
        let html = '';
        if (refs.ref1Name) html += renderRef(refs, 1, 'Personal');
        if (refs.ref2Name) html += renderRef(refs, 2, 'Professional');
        document.getElementById('cvReferences').innerHTML = html;
    }
}

function renderRef(refs, num, type) {
    return `
        <div class="ref-item">
            <div class="ref-name">${esc(refs['ref'+num+'Name'])} <span style="font-size:8pt;color:#888;font-weight:normal;">(${type})</span></div>
            <div class="ref-designation">${esc(refs['ref'+num+'Designation'])}</div>
            <div class="ref-org">${esc(refs['ref'+num+'Org'])}</div>
            <div class="ref-contact">
                ${refs['ref'+num+'Phone'] ? `<div>📞 ${esc(refs['ref'+num+'Phone'])}</div>` : ''}
                ${refs['ref'+num+'Email'] ? `<div>✉️ ${esc(refs['ref'+num+'Email'])}</div>` : ''}
            </div>
        </div>
    `;
}

// ============ DIRECT PDF DOWNLOAD ============
window.downloadPDF = function() {
    const element = document.getElementById('cvContent');
    const today = new Date();
    const m = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const dateStr = `${String(today.getDate()).padStart(2,'0')}-${m[today.getMonth()]}-${today.getFullYear()}`;

    // Filename: HASK-CV-{CandidateID}-{Name}-{Title}-{Date}.pdf
    const userId = document.getElementById('cvUserId').textContent.replace('🆔', '').trim();
    const name = document.getElementById('cvName').textContent.replace(/\s+/g, '_');
    const role = document.getElementById('cvRole').textContent.replace(/[^\w\s-]/g, '').replace(/\s+/g, '_');
    const filename = `HASK-CV-${userId}-${name}-${role}-${dateStr}.pdf`;

    // Hide toolbar during capture
    document.getElementById('toolbar').style.display = 'none';

    const opt = {
        margin: 0,
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            scrollY: 0
        },
        jsPDF: { 
            unit: 'mm', 
            format: 'a4', 
            orientation: 'portrait'
        },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    html2pdf().set(opt).from(element).save().then(() => {
        document.getElementById('toolbar').style.display = 'flex';
        console.log('✅ CV Downloaded:', filename);
    }).catch(err => {
        document.getElementById('toolbar').style.display = 'flex';
        console.error('Download error:', err);
        alert('Download failed: ' + err.message);
    });
};

// ============ HELPERS ============
function formatDate(d) {
    const m = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${String(d.getDate()).padStart(2,'0')}-${m[d.getMonth()]}-${d.getFullYear()}`;
}

function fmtMonth(dateStr) {
    if (!dateStr) return '—';
    try {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        const m = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        return `${m[d.getMonth()]} ${d.getFullYear()}`;
    } catch (e) { return dateStr; }
}

function esc(s) {
    if (!s) return '';
    return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
}

function escA(s) {
    if (!s) return '';
    return String(s).replace(/["'&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
}
