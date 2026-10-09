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
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const userData = userDoc.exists() ? userDoc.data() : { name: user.displayName, email: user.email };

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

    document.getElementById('headerDate').textContent = '📅 ' + formatDate(new Date());
    document.getElementById('cvName').textContent = p.fullName || userData.name || 'Your Name';

    // AI Title
    const aiTitle = generateAITitle(profile);
    document.getElementById('cvRole').textContent = aiTitle;
    document.getElementById('cvUserId').textContent = '🆔 ' + (userData.userId || '—');

    if (p.profilePic) {
        document.getElementById('cvPhoto').innerHTML = `<img src="${p.profilePic}" alt="Photo">`;
    }

    const contacts = [];
    if (p.cell) contacts.push(`<span>📞 ${escapeHtml(p.cell)}</span>`);
    if (p.email || userData.email) contacts.push(`<span>✉️ ${escapeHtml(p.email || userData.email)}</span>`);
    if (p.city || p.district) contacts.push(`<span>📍 ${escapeHtml(p.city || p.district)}${p.province ? ', ' + escapeHtml(p.province) : ''}</span>`);
    if (profile.misc && profile.misc.linkedin) contacts.push(`<span>🌐 <a href="${escapeAttr(profile.misc.linkedin)}" target="_blank">LinkedIn</a></span>`);
    document.getElementById('cvContact').innerHTML = contacts.join('');

    const self = profile.self || {};
    if (self.objective) {
        document.getElementById('objectiveSection').style.display = 'block';
        document.getElementById('cvObjective').textContent = self.objective;
    }

    const skills = profile.skills || [];
    if (skills.length > 0 || self.strengths) {
        document.getElementById('skillsStrengthsSection').style.display = 'grid';

        if (skills.length > 0) {
            document.getElementById('cvSkills').innerHTML = skills.map(s => `
                <div class="skill-item">
                    <span class="skill-name">${escapeHtml(s.name)}</span>
                    <span class="skill-level">${escapeHtml(s.level)}</span>
                </div>
            `).join('');
        } else {
            document.getElementById('cvSkills').innerHTML = '<p style="color:#888;font-style:italic;">No skills added</p>';
        }

        if (self.strengths) {
            const strengthsList = self.strengths.split(/[\n,•]+/).map(s => s.trim()).filter(s => s);
            document.getElementById('cvStrengths').innerHTML = strengthsList.map(s => `<div class="list-item">${escapeHtml(s)}</div>`).join('');
        } else {
            document.getElementById('cvStrengths').innerHTML = '<p style="color:#888;font-style:italic;">No strengths</p>';
        }
    }

    const exp = profile.experience || {};
    const entries = exp.entries || [];
    if (entries.length > 0) {
        document.getElementById('experienceSection').style.display = 'block';
        document.getElementById('cvExpYears').textContent = exp.overall ? `(${exp.overall} Years Total)` : '';

        document.getElementById('cvExperience').innerHTML = entries.map(e => {
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
                    <div class="exp-company">${escapeHtml(e.employer)}${e.business ? ' • ' + escapeHtml(e.business) : ''}</div>
                    ${descHTML}
                </div>
            `;
        }).join('');
    }

    const edu = profile.education || [];
    const certs = profile.certifications || [];
    if (edu.length > 0 || certs.length > 0) {
        document.getElementById('eduCertSection').style.display = 'grid';

        if (edu.length > 0) {
            document.getElementById('cvEducation').innerHTML = edu.map(e => `
                <div class="edu-entry">
                    <div class="edu-header">
                        <span class="edu-degree">${escapeHtml(e.level)}</span>
                        <span class="edu-year">${formatMonth(e.date)}</span>
                    </div>
                    <div class="edu-institution">${escapeHtml(e.title)} — ${escapeHtml(e.institution)}</div>
                    ${e.percentage ? `<div class="edu-grade">Grade: ${escapeHtml(e.percentage)}</div>` : ''}
                </div>
            `).join('');
        } else {
            document.getElementById('cvEducation').innerHTML = '<p style="color:#888;font-style:italic;">No education</p>';
        }

        if (certs.length > 0) {
            document.getElementById('cvCertifications').innerHTML = certs.map(c => `
                <div class="edu-entry">
                    <div class="edu-header">
                        <span class="edu-degree">${escapeHtml(c.name)}</span>
                        <span class="edu-year">${escapeHtml(c.year)}</span>
                    </div>
                    <div class="edu-institution">${escapeHtml(c.issuer)}</div>
                    ${c.certId ? `<div class="edu-grade" style="color:#666;">ID: ${escapeHtml(c.certId)}</div>` : ''}
                </div>
            `).join('');
        } else {
            document.getElementById('cvCertifications').innerHTML = '<p style="color:#888;font-style:italic;">No certifications</p>';
        }
    }

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
            <div class="ref-name">${escapeHtml(refs['ref'+num+'Name'])} <span style="font-size:8pt;color:#888;font-weight:normal;">(${type})</span></div>
            <div class="ref-designation">${escapeHtml(refs['ref'+num+'Designation'])}</div>
            <div class="ref-org">${escapeHtml(refs['ref'+num+'Org'])}</div>
            <div class="ref-contact">
                ${refs['ref'+num+'Phone'] ? `<div>📞 ${escapeHtml(refs['ref'+num+'Phone'])}</div>` : ''}
                ${refs['ref'+num+'Email'] ? `<div>✉️ ${escapeHtml(refs['ref'+num+'Email'])}</div>` : ''}
            </div>
        </div>
    `;
}

// ===== AI TITLE GENERATOR =====
function generateAITitle(profile) {
    const exp = profile.experience || {};
    const edu = profile.education || [];
    const skills = profile.skills || [];
    const entries = exp.entries || [];

    const TITLES = {
        "Mechanical": ["Mechanical Engineer","Mechanical Technician","Senior Mechanical Technician","Fitter","Turner","Machinist","Welder","Millwright"],
        "Electrical": ["Electrical Engineer","Electrical Technician","Electrician","Wireman","Lineman","Instrument Technician"],
        "Civil": ["Civil Engineer","Site Engineer","Site Supervisor","Mason","Carpenter","Painter","Plumber"],
        "HR & Admin": ["HR Manager","HR Executive","HR Officer","HR Assistant","Admin Manager","Admin Officer","Receptionist"],
        "IT & Software": ["Software Engineer","Software Developer","Web Developer","Mobile App Developer","IT Support Engineer","Network Administrator"],
        "Sales & Marketing": ["Sales Manager","Sales Executive","Salesman","Marketing Manager","Business Development Executive"],
        "Accounting & Finance": ["Accountant","Senior Accountant","Accounts Manager","Finance Manager","Auditor","Cashier"],
        "Education": ["Teacher","Senior Teacher","Lecturer","Professor","Principal","Tutor","Trainer"],
        "Healthcare": ["Doctor","Nurse","Pharmacist","Lab Technician","Physiotherapist","Medical Officer"],
        "Construction": ["Laborer","Mason","Painter","Plumber","Carpenter","Welder","Steel Fixer"],
        "Transport & Driver": ["Driver","Truck Driver","Delivery Rider","Forklift Operator"],
        "Security": ["Security Guard","Security Supervisor","Watchman","CCTV Operator"],
        "Hospitality": ["Chef","Cook","Waiter","Baker","Housekeeping"],
        "Textile": ["Tailor","Stitcher","Quality Checker","Weaver"],
        "Manufacturing": ["Production Manager","Production Supervisor","Machine Operator","Quality Inspector"],
        "Agriculture": ["Farm Manager","Agriculture Officer","Livestock Supervisor","Veterinary Doctor"],
        "Retail": ["Shopkeeper","Sales Associate","Cashier","Store Manager"],
        "Telecom": ["Telecom Engineer","Telecom Technician","Network Engineer","BTS Technician"]
    };

    let matched = '', industry = '';

    if (entries.length > 0) {
        const latest = entries[0];
        const titleText = (latest.title || '').toLowerCase();
        const bizText = (latest.business || '').toLowerCase();

        for (const [ind, titles] of Object.entries(TITLES)) {
            for (const t of titles) {
                if (titleText.includes(t.toLowerCase()) || t.toLowerCase().includes(titleText)) {
                    matched = t; industry = ind; break;
                }
            }
            if (matched) break;
        }

        if (!matched && titleText) {
            for (const [ind, titles] of Object.entries(TITLES)) {
                if (titleText.includes(ind.toLowerCase()) || bizText.includes(ind.toLowerCase())) {
                    matched = titles[0]; industry = ind; break;
                }
            }
        }

        if (!matched) matched = latest.title || '';
    }

    if (!matched && edu.length > 0) {
        const latestEdu = edu[0];
        const degText = (latestEdu.title || '').toLowerCase();
        for (const [ind, titles] of Object.entries(TITLES)) {
            if (degText.includes(ind.toLowerCase())) {
                matched = titles[0]; industry = ind; break;
            }
        }
        if (!matched) matched = latestEdu.title || 'Fresh Graduate';
    }

    if (!matched && skills.length > 0) {
        const skillText = skills.map(s => (s.name || '').toLowerCase()).join(' ');
        for (const [ind, titles] of Object.entries(TITLES)) {
            if (skillText.includes(ind.toLowerCase())) {
                matched = titles[0]; industry = ind; break;
            }
        }
    }

    if (!matched) {
        matched = (profile.personal && profile.personal.interest) || 'Professional';
    }

    const totalExp = exp.overall || 0;
    if (totalExp >= 5 && !matched.toLowerCase().startsWith('senior')) matched = 'Senior ' + matched;
    else if (totalExp >= 1 && totalExp < 5 && !matched.toLowerCase().startsWith('experienced')) matched = 'Experienced ' + matched;
    else if (entries.length === 0 && edu.length > 0 && !matched.includes('Fresh')) matched = matched + ' (Fresh Graduate)';

    return matched;
}

function formatDate(d) {
    const m = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${String(d.getDate()).padStart(2,'0')}-${m[d.getMonth()]}-${d.getFullYear()}`;
}

function formatMonth(dateStr) {
    if (!dateStr) return '—';
    try {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        const m = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        return `${m[d.getMonth()]} ${d.getFullYear()}`;
    } catch (e) { return dateStr; }
}

function escapeHtml(s) {
    if (!s) return '';
    return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
}

function escapeAttr(s) {
    if (!s) return '';
    return String(s).replace(/["'&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
}

window.downloadPDF = function() { window.print(); };
