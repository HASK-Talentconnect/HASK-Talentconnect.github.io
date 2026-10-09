/* ============================================
   HASK TalentConnect - Profile JavaScript
   Full Version with Province/District/Tehsil,
   Present+Permanent Address, AI Title, CV Modal
   ============================================ */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { JOB_TITLES_DB, PAKISTAN_DATA, getProvinces, getDistricts, getTehsils, getPostalCode, getAllTitles } from "./data.js";

const firebaseConfig = {
    apiKey: "AIzaSyAreIiCnSheAeXc2wNeU7-qFj-qFhaXZAo",
    authDomain: "hask-talentconnect.firebaseapp.com",
    projectId: "hask-talentconnect",
    storageBucket: "hask-talentconnect.firebasestorage.app",
    messagingSenderId: "532290737820",
    appId: "1:532290737820:web:49f70281b0f34837757f59"
};

const CLOUDINARY_CLOUD_NAME = "mabktzhu";
const CLOUDINARY_PRESET = "hask_unsigned";
const CLOUDINARY_FOLDER = "hask-talentconnect/profiles";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const COUNTRIES = ["Pakistan","Afghanistan","India","Bangladesh","Saudi Arabia","United Arab Emirates","United Kingdom","United States","Canada","Australia","Germany","France","Italy","Spain","Netherlands","China","Japan","Malaysia","Turkey","Iran","Iraq","Qatar","Kuwait","Oman","Bahrain","Sri Lanka","Nepal","Other"];

const UNIVERSITIES = [
    "Air University, Islamabad","Allama Iqbal Open University, Islamabad","Arid Agriculture University, Rawalpindi",
    "Bahauddin Zakariya University, Multan","Bahria University, Islamabad","BUITEMS Quetta","COMSATS University Islamabad",
    "Fatima Jinnah Medical University, Lahore","Federal Urdu University, Karachi","Gomal University, D.I. Khan",
    "Government College University, Faisalabad","Government College University, Lahore","Hazara University, Mansehra",
    "International Islamic University, Islamabad","Islamia University, Bahawalpur","King Edward Medical University, Lahore",
    "Kohat University of Science & Technology","Lahore University of Management Sciences (LUMS)",
    "Liaquat University of Medical & Health Sciences, Jamshoro","Mehran University of Engineering & Technology, Jamshoro",
    "National University of Computer & Emerging Sciences (FAST)","National University of Modern Languages (NUML)",
    "National University of Sciences & Technology (NUST)","Peshawar University","Pir Mehr Ali Shah Arid Agriculture University",
    "Quaid-i-Azam University, Islamabad","Riphah International University","Sindh Agriculture University, Tandojam",
    "University of Agriculture, Faisalabad","University of Balochistan, Quetta","University of Central Punjab, Lahore",
    "University of Engineering & Technology, Lahore","University of Engineering & Technology, Peshawar",
    "University of Engineering & Technology, Taxila","University of Gujrat","University of Karachi","University of Lahore",
    "University of Malakand","University of Management & Technology (UMT)","University of Peshawar",
    "University of Punjab, Lahore","University of Sargodha","University of Sindh, Jamshoro",
    "University of Veterinary & Animal Sciences, Lahore","Virtual University of Pakistan","Other"
];

let currentUser = null;
let userData = null;
let profileData = {
    personal: null, education: [], certifications: [],
    experience: { has: true, overall: 0, industry: 0, entries: [] },
    skills: [], self: null, references: null, misc: null, compensation: null
};
let progressData = {
    personal: false, education: false, certifications: false, experience: false,
    skills: false, self: false, references: false, misc: false, compensation: false
};

let editingEduIndex = null, editingCertIndex = null, editingExpIndex = null, editingSkillIndex = null;

onAuthStateChanged(auth, async (user) => {
    if (!user) { window.location.replace('login.html?redirect=' + encodeURIComponent('profile.html')); return; }
    currentUser = user;
    try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        userData = userDoc.exists() ? userDoc.data() : { name: user.displayName || 'User', email: user.email };
    } catch (e) { userData = { name: user.displayName || 'User', email: user.email }; }

    await loadProfile();

    populateCountries('pNationality');
    populateCountries('pCountry');
    populateProvinces('pProvince');

    renderSidebarUser();
    updateProgress();
    renderProgress();
    applyDefaults();

    attachCnicFormatter();
    attachCharCounters();
    attachListeners();
    updateAvatarControls();

    showFirstIncompleteSection();
});

// ===== COUNTRIES =====
function populateCountries(selectId) {
    const sel = document.getElementById(selectId);
    if (!sel) return;
    sel.innerHTML = '<option value="Pakistan">Pakistan</option>';
    COUNTRIES.forEach(c => {
        if (c !== 'Pakistan') {
            const opt = document.createElement('option');
            opt.value = c; opt.textContent = c;
            sel.appendChild(opt);
        }
    });
}

// ===== PROVINCES =====
function populateProvinces(selectId) {
    const sel = document.getElementById(selectId);
    if (!sel) return;
    sel.innerHTML = '<option value="">Select Province</option>';
    getProvinces().forEach(p => {
        const opt = document.createElement('option');
        opt.value = p; opt.textContent = p;
        sel.appendChild(opt);
    });
}

// ===== PROVINCE → DISTRICT, DOMICILE, TEHSIL =====
window.onProvinceChange = function() {
    const province = document.getElementById('pProvince').value;
    const districtSel = document.getElementById('pDistrict');
    const domicileSel = document.getElementById('pDomicile');
    const tehsilSel = document.getElementById('pTehsil');

    tehsilSel.innerHTML = '<option value="">Select District First</option>';
    document.getElementById('pPostalCode').value = '';

    if (!province) {
        districtSel.innerHTML = '<option value="">Select Province First</option>';
        domicileSel.innerHTML = '<option value="">Select Province First</option>';
        return;
    }

    const districts = getDistricts(province);
    districtSel.innerHTML = '<option value="">Select District</option>';
    domicileSel.innerHTML = '<option value="">Select District</option>';
    districts.forEach(d => {
        const opt1 = document.createElement('option');
        opt1.value = d; opt1.textContent = d;
        districtSel.appendChild(opt1);
        const opt2 = document.createElement('option');
        opt2.value = d; opt2.textContent = d;
        domicileSel.appendChild(opt2);
    });
};

window.onDomicileChange = function() { /* just save domicile */ };

window.onDistrictChange = function() {
    const province = document.getElementById('pProvince').value;
    const district = document.getElementById('pDistrict').value;
    const tehsilSel = document.getElementById('pTehsil');
    const postalInput = document.getElementById('pPostalCode');

    if (!district) {
        tehsilSel.innerHTML = '<option value="">Select District First</option>';
        postalInput.value = '';
        return;
    }

    const tehsils = getTehsils(province, district);
    tehsilSel.innerHTML = '<option value="">Select Tehsil</option>';
    tehsils.forEach(t => {
        const opt = document.createElement('option');
        opt.value = t; opt.textContent = t;
        tehsilSel.appendChild(opt);
    });

    postalInput.value = getPostalCode(province, district) || '';
};

// ===== PRESENT = PERMANENT =====
window.copyPresentToPermanent = function() {
    const cb = document.getElementById('sameAddress');
    const present = document.getElementById('pAddress');
    const permanent = document.getElementById('pPermanentAddress');
    if (cb.checked) {
        permanent.value = present.value;
        permanent.readOnly = true;
        permanent.style.background = '#f5f7fa';
    } else {
        permanent.readOnly = false;
        permanent.style.background = '';
    }
};

// ===== CNIC FORMAT =====
function attachCnicFormatter() {
    const cnicInput = document.getElementById('pCnic');
    if (!cnicInput) return;
    cnicInput.addEventListener('input', function() {
        let digits = this.value.replace(/\D/g, '').slice(0, 13);
        let formatted = '';
        if (digits.length > 0) formatted = digits.slice(0, 5);
        if (digits.length > 5) formatted += '-' + digits.slice(5, 12);
        if (digits.length > 12) formatted += '-' + digits.slice(12, 13);
        this.value = formatted;
    });
}

// ===== PROFILE PICTURE UPLOAD =====
window.handlePicUpload = function(event) {
    const file = event.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { showMessage('❌ Picture must be less than 5MB.', 'error'); event.target.value = ''; return; }
    if (!file.type.startsWith('image/')) { showMessage('❌ Only image files are allowed.', 'error'); event.target.value = ''; return; }

    const avatarEl = document.getElementById('sidebarAvatar');
    const oldContent = avatarEl.innerHTML;
    avatarEl.innerHTML = `
        <div class="upload-progress-overlay" id="uploadOverlay">
            <svg class="progress-ring" viewBox="0 0 100 100">
                <circle class="ring-bg" cx="50" cy="50" r="50"></circle>
                <circle class="ring-fill" id="progressRingFill" cx="50" cy="50" r="50"></circle>
            </svg>
            <div class="progress-text" id="progressText">0%</div>
        </div>
    `;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_PRESET);
    formData.append('folder', CLOUDINARY_FOLDER);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, true);

    xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
            const percent = Math.round((e.loaded / e.total) * 100);
            const ring = document.getElementById('progressRingFill');
            const text = document.getElementById('progressText');
            if (ring) ring.style.strokeDashoffset = 314 - (percent / 100) * 314;
            if (text) text.textContent = percent + '%';
        }
    });

    xhr.onload = async function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            try {
                const data = JSON.parse(xhr.responseText);
                const url = data.secure_url;
                if (!profileData.personal) profileData.personal = {};
                profileData.personal.profilePic = url;
                await saveProfile();
                const overlay = document.getElementById('uploadOverlay');
                if (overlay) overlay.innerHTML = '<div class="progress-check">✅</div>';
                setTimeout(() => {
                    avatarEl.innerHTML = `<img src="${url}" alt="Avatar">`;
                    updateAvatarControls();
                    event.target.value = '';
                }, 700);
            } catch (err) { avatarEl.innerHTML = oldContent; event.target.value = ''; }
        } else { avatarEl.innerHTML = oldContent; event.target.value = ''; }
    };
    xhr.onerror = function() { avatarEl.innerHTML = oldContent; event.target.value = ''; };
    xhr.send(formData);
};

window.removePic = async function() {
    if (!confirm('Remove your profile picture?')) return;
    profileData.personal = profileData.personal || {};
    profileData.personal.profilePic = '';
    await saveProfile();
    renderSidebarUser();
    updateAvatarControls();
};

function updateAvatarControls() {
    const hasPic = !!(profileData.personal && profileData.personal.profilePic);
    const uploadBtn = document.querySelector('.sidebar-avatar-controls .btn-pic-upload');
    const removeBtn = document.querySelector('.sidebar-avatar-controls .btn-pic-remove');
    if (uploadBtn) uploadBtn.classList.toggle('hide', hasPic);
    if (removeBtn) removeBtn.classList.toggle('show', hasPic);
}

// ===== AI TITLE GENERATOR =====
function generateAITitle(profile) {
    const exp = profile.experience || {};
    const edu = profile.education || [];
    const skills = profile.skills || [];
    const entries = exp.entries || [];

    let matchedTitle = '';
    let industry = '';

    // 1. Try to match from latest experience
    if (entries.length > 0) {
        const latest = entries[0];
        const titleText = (latest.title || '').toLowerCase();
        const bizText = (latest.business || '').toLowerCase();

        // Search in JOB_TITLES_DB
        for (const [ind, titles] of Object.entries(JOB_TITLES_DB)) {
            for (const t of titles) {
                if (titleText.includes(t.toLowerCase()) || t.toLowerCase().includes(titleText)) {
                    matchedTitle = t;
                    industry = ind;
                    break;
                }
            }
            if (matchedTitle) break;
        }

        // If not exact, try keyword match
        if (!matchedTitle && titleText) {
            for (const [ind, titles] of Object.entries(JOB_TITLES_DB)) {
                const kw = ind.toLowerCase();
                if (titleText.includes(kw) || bizText.includes(kw)) {
                    matchedTitle = titles[0];
                    industry = ind;
                    break;
                }
            }
        }

        // Fallback — use latest title as-is
        if (!matchedTitle) matchedTitle = latest.title || '';
    }

    // 2. If no experience, use education
    if (!matchedTitle && edu.length > 0) {
        const latestEdu = edu[0];
        const degreeText = (latestEdu.title || '').toLowerCase();

        for (const [ind, titles] of Object.entries(JOB_TITLES_DB)) {
            if (degreeText.includes(ind.toLowerCase())) {
                matchedTitle = titles[0]; // e.g. "Mechanical Engineer"
                industry = ind;
                break;
            }
        }

        if (!matchedTitle) {
            // Generic from degree
            matchedTitle = latestEdu.title || 'Fresh Graduate';
        }
    }

    // 3. Try skills
    if (!matchedTitle && skills.length > 0) {
        const skillNames = skills.map(s => (s.name || '').toLowerCase()).join(' ');
        for (const [ind, titles] of Object.entries(JOB_TITLES_DB)) {
            if (skillNames.includes(ind.toLowerCase())) {
                matchedTitle = titles[0];
                industry = ind;
                break;
            }
        }
    }

    // Fallback
    if (!matchedTitle) {
        const interest = profile.personal && profile.personal.interest;
        matchedTitle = interest || 'Professional';
    }

    // Add "Experienced" prefix if there's experience
    const totalExp = exp.overall || 0;
    if (totalExp >= 5 && !matchedTitle.toLowerCase().startsWith('senior')) {
        matchedTitle = 'Senior ' + matchedTitle;
    } else if (totalExp >= 1 && totalExp < 5 && !matchedTitle.toLowerCase().startsWith('experienced')) {
        matchedTitle = 'Experienced ' + matchedTitle;
    } else if (entries.length === 0 && edu.length > 0) {
        if (!matchedTitle.includes('Fresh')) {
            matchedTitle = matchedTitle + ' (Fresh Graduate)';
        }
    }

    return matchedTitle;
}

// ===== CV MODAL =====
window.openCVModal = async function() {
    const modal = document.getElementById('cvModalOverlay');
    const body = document.getElementById('cvModalBody');

    modal.classList.add('show');
    body.innerHTML = `<div class="cv-loading"><div class="loader"></div><p>Generating your CV...</p></div>`;

    try {
        // Save current data first
        await saveProfile();
        // Load from Firestore to be sure
        await loadProfile();

        // Generate CV HTML
        const cvHTML = buildCVHTML(userData, profileData);
        body.innerHTML = cvHTML;
    } catch (err) {
        body.innerHTML = `<div style="padding:30px; text-align:center; color:#c33;">❌ Error: ${err.message}</div>`;
    }
};

window.closeCVModal = function() {
    document.getElementById('cvModalOverlay').classList.remove('show');
};

window.downloadCV = function() {
    // Trigger print for the CV content
    const cvContent = document.getElementById('cvModalBody').innerHTML;
    const w = window.open('', '_blank');
    w.document.write(`
        <html><head><title>My CV - HASK TalentConnect</title>
        <link rel="stylesheet" href="${window.location.origin}/cv.css">
        </head><body>${cvContent}</body></html>
    `);
    w.document.close();
    setTimeout(() => { w.print(); }, 800);
};

window.printCV = function() { window.downloadCV(); };

// ===== BUILD CV HTML =====
function buildCVHTML(userData, profile) {
    const p = profile.personal || {};
    const exp = profile.experience || {};
    const self = profile.self || {};
    const refs = profile.references || {};
    const skills = profile.skills || [];
    const edu = profile.education || [];
    const certs = profile.certifications || [];
    const entries = exp.entries || [];

    const aiTitle = generateAITitle(profile);
    const today = new Date();
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const dateStr = `${String(today.getDate()).padStart(2,'0')}-${months[today.getMonth()]}-${today.getFullYear()}`;

    // Contact
    const contacts = [];
    if (p.cell) contacts.push(`📞 ${escapeHtml(p.cell)}`);
    if (p.email) contacts.push(`✉️ ${escapeHtml(p.email)}`);
    if (p.city || p.district) contacts.push(`📍 ${escapeHtml(p.city || p.district)}${p.province ? ', ' + escapeHtml(p.province) : ''}`);
    if (profile.misc && profile.misc.linkedin) contacts.push(`🌐 <a href="${escapeAttr(profile.misc.linkedin)}">LinkedIn</a>`);

    // Skills
    const skillsHTML = skills.length > 0 ? skills.map(s => `
        <div class="skill-item">
            <span class="skill-name">${escapeHtml(s.name)}</span>
            <span class="skill-level">${escapeHtml(s.level)}</span>
        </div>
    `).join('') : '<p style="color:#888; font-style:italic;">No skills added</p>';

    // Strengths
    const strengthsList = (self.strengths || '').split(/[\n,•]+/).map(s => s.trim()).filter(s => s);
    const strengthsHTML = strengthsList.length > 0
        ? strengthsList.map(s => `<div class="list-item">${escapeHtml(s)}</div>`).join('')
        : '<p style="color:#888; font-style:italic;">No strengths listed</p>';

    // Experience
    const expHTML = entries.length > 0 ? entries.map(e => {
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
    }).join('') : '<p style="color:#888; font-style:italic;">No experience</p>';

    // Education
    const eduHTML = edu.length > 0 ? edu.map(e => `
        <div class="edu-entry">
            <div class="edu-header">
                <span class="edu-degree">${escapeHtml(e.level)}</span>
                <span class="edu-year">${formatMonth(e.date)}</span>
            </div>
            <div class="edu-institution">${escapeHtml(e.title)} — ${escapeHtml(e.institution)}</div>
            ${e.percentage ? `<div class="edu-grade">Grade: ${escapeHtml(e.percentage)}</div>` : ''}
        </div>
    `).join('') : '<p style="color:#888; font-style:italic;">No education</p>';

    // Certifications
    const certHTML = certs.length > 0 ? certs.map(c => `
        <div class="edu-entry">
            <div class="edu-header">
                <span class="edu-degree">${escapeHtml(c.name)}</span>
                <span class="edu-year">${escapeHtml(c.year)}</span>
            </div>
            <div class="edu-institution">${escapeHtml(c.issuer)}</div>
            ${c.certId ? `<div class="edu-grade" style="color:#666;">ID: ${escapeHtml(c.certId)}</div>` : ''}
        </div>
    `).join('') : '<p style="color:#888; font-style:italic;">No certifications</p>';

    // References
    let refsHTML = '';
    if (refs.ref1Name) refsHTML += renderRef(refs, 1, 'Personal');
    if (refs.ref2Name) refsHTML += renderRef(refs, 2, 'Professional');
    if (!refsHTML) refsHTML = '<p style="color:#888; font-style:italic;">No references</p>';

    // Photo
    const photoHTML = p.profilePic
        ? `<img src="${escapeAttr(p.profilePic)}" alt="Photo">`
        : '📷';

    return `
        <div class="cv-page">
            <div class="cv-header">
                <div class="header-brand">
                    <div class="brand-logo">HASK TalentConnect</div>
                    <div class="brand-tagline">Careers • Connect • Grow • Succeed</div>
                </div>
                <div class="header-date">📅 ${dateStr}</div>
            </div>

            <div class="profile-section">
                <div class="photo-wrap">
                    <div class="photo">${photoHTML}</div>
                </div>
                <div class="profile-info">
                    <h1>${escapeHtml(p.fullName || userData.name || 'Your Name')}</h1>
                    <div class="role">${escapeHtml(aiTitle)}</div>
                    <div class="userid">🆔 ${escapeHtml(userData.userId || '—')}</div>
                </div>
            </div>

            <div class="contact-strip">
                ${contacts.map(c => `<span>${c}</span>`).join('')}
            </div>

            ${self.objective ? `
                <div class="section">
                    <h2 class="section-title">🎯 Career Objective</h2>
                    <div class="section-body">${escapeHtml(self.objective)}</div>
                </div>
            ` : ''}

            <div class="two-column">
                <div class="col">
                    <h2 class="section-title">🛠️ Skills</h2>
                    <div class="section-body">${skillsHTML}</div>
                </div>
                <div class="col">
                    <h2 class="section-title">📝 Strengths</h2>
                    <div class="section-body">${strengthsHTML}</div>
                </div>
            </div>

            <div class="section">
                <h2 class="section-title">💼 Work Experience ${exp.overall ? `(${exp.overall} Years Total)` : ''}</h2>
                <div class="section-body">${expHTML}</div>
            </div>

            <div class="two-column">
                <div class="col">
                    <h2 class="section-title">🎓 Education</h2>
                    <div class="section-body">${eduHTML}</div>
                </div>
                <div class="col">
                    <h2 class="section-title">📜 Certifications</h2>
                    <div class="section-body">${certHTML}</div>
                </div>
            </div>

            <div class="section">
                <h2 class="section-title">👥 References</h2>
                <div class="section-body">
                    <div class="two-column-inner">${refsHTML}</div>
                </div>
            </div>

            <div class="cv-footer">
                <div>📄 Generated from <strong>HASK TalentConnect</strong></div>
                <div>🌐 hask-talentconnect.github.io</div>
            </div>
        </div>
    `;
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

function formatMonth(dateStr) {
    if (!dateStr) return '—';
    try {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        return `${months[d.getMonth()]} ${d.getFullYear()}`;
    } catch (e) { return dateStr; }
}

// ===== OTHER HANDLERS =====
window.handleInterestChange = function() {
    const val = document.getElementById('pInterest').value;
    const field = document.getElementById('otherInterestField');
    const input = document.getElementById('pOtherInterest');
    if (val === 'Other') { field.style.display = 'flex'; input.setAttribute('required', 'required'); }
    else { field.style.display = 'none'; input.removeAttribute('required'); input.value = ''; }
};

window.toggleCrimeDetails = function() {
    const val = document.getElementById('mCrime').value;
    const field = document.getElementById('crimeDetailsField');
    const input = document.getElementById('mCrimeDetails');
    if (val === 'Yes') { field.style.display = 'flex'; input.setAttribute('required', 'required'); }
    else { field.style.display = 'none'; input.removeAttribute('required'); input.value = ''; }
};

window.toggleDisabilityDetails = function() {
    const val = document.getElementById('mDisability').value;
    const field = document.getElementById('disabilityDetailsField');
    const input = document.getElementById('mDisabilityDetails');
    if (val === 'Yes') { field.style.display = 'flex'; input.setAttribute('required', 'required'); }
    else { field.style.display = 'none'; input.removeAttribute('required'); input.value = ''; }
};

window.toggleReligionOther = function() {
    const val = document.getElementById('mReligion').value;
    const field = document.getElementById('religionOtherField');
    const input = document.getElementById('mReligionOther');
    if (val === 'Other') { field.style.display = 'flex'; input.setAttribute('required', 'required'); }
    else { field.style.display = 'none'; input.removeAttribute('required'); input.value = ''; }
};

// ===== FIRESTORE =====
async function loadProfile() {
    try {
        const ref = doc(db, "profiles", currentUser.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
            const data = snap.data();
            profileData = {
                personal: data.personal || null,
                education: data.education || [],
                certifications: data.certifications || [],
                experience: data.experience || { has: true, overall: 0, industry: 0, entries: [] },
                skills: data.skills || [],
                self: data.self || null,
                references: data.references || null,
                misc: data.misc || null,
                compensation: data.compensation || null
            };
        }
    } catch (e) { console.warn(e); }
}

async function saveProfile() {
    if (!currentUser) return;
    const ref = doc(db, "profiles", currentUser.uid);
    await setDoc(ref, {
        ...profileData,
        userId: currentUser.uid,
        userName: userData.name,
        userEmail: userData.email,
        updatedAt: new Date().toISOString()
    }, { merge: true });
}

// ===== SIDEBAR USER =====
function renderSidebarUser() {
    const name = userData.name || 'User';
    const initials = name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
    document.getElementById('sidebarName').textContent = name;
    document.getElementById('sidebarId').textContent = '🆔 ' + (userData.userId || '—');
    const av = document.getElementById('sidebarAvatar');
    const pic = profileData.personal && profileData.personal.profilePic;
    if (pic) av.innerHTML = `<img src="${pic}" alt="Avatar">`;
    else av.textContent = initials;
}

// ===== PROGRESS =====
function updateProgress() {
    const p = profileData;
    progressData.personal = !!(p.personal && p.personal.fullName && p.personal.fatherName &&
        p.personal.cnic && p.personal.dob && p.personal.gender && p.personal.cell &&
        p.personal.email && p.personal.address && p.personal.permanentAddress &&
        p.personal.province && p.personal.domicile && p.personal.district && p.personal.tehsil);
    progressData.education = p.education && p.education.length > 0;
    progressData.certifications = p.certifications && p.certifications.length > 0;
    progressData.experience = p.experience && (p.experience.has === false || (p.experience.entries && p.experience.entries.length > 0));
    progressData.skills = p.skills && p.skills.length > 0;
    progressData.self = !!(p.self && p.self.objective && p.self.strengths && p.self.improvements && p.self.summary);
    progressData.references = !!(p.references && p.references.ref1Name && p.references.ref1Email && p.references.ref2Name && p.references.ref2Email);
    progressData.misc = !!(p.misc && p.misc.crime && p.misc.disability && p.misc.source);
    progressData.compensation = !!(p.compensation && p.compensation.basic !== undefined && p.compensation.gross !== undefined && p.compensation.expected !== undefined);
}

function renderProgress() {
    const sections = ['personal', 'education', 'certifications', 'experience', 'skills', 'self', 'references', 'misc', 'compensation'];
    const completed = sections.filter(s => progressData[s]).length;
    const percent = Math.round((completed / sections.length) * 100);
    document.getElementById('progressPercent').textContent = percent + '%';
    document.getElementById('progressBarFill').style.width = percent + '%';
    sections.forEach(s => {
        const item = document.querySelector(`.menu-item[data-section="${s}"]`);
        const cb = document.getElementById('check-' + s);
        if (!item || !cb) return;
        if (progressData[s]) { item.classList.add('completed'); cb.textContent = '✅'; }
        else { item.classList.remove('completed'); cb.textContent = '⬜'; }
    });
}

// ===== NAVIGATION =====
function showSection(name) {
    document.querySelectorAll('.profile-section').forEach(s => s.classList.remove('active'));
    const t = document.getElementById('section-' + name);
    if (t) t.classList.add('active');
    document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));
    const mi = document.querySelector(`.menu-item[data-section="${name}"]`);
    if (mi) mi.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.goToSection = showSection;
window.nextSection = function(n) { saveProfile().then(() => { updateProgress(); renderProgress(); showSection(n); }).catch(e => showMessage('❌ ' + e.message, 'error')); };

function showFirstIncompleteSection() {
    const order = ['personal', 'education', 'certifications', 'experience', 'skills', 'self', 'references', 'misc', 'compensation'];
    for (const s of order) { if (!progressData[s]) { showSection(s); return; } }
    showSection('personal');
}

function attachListeners() {
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', (e) => { e.preventDefault(); showSection(item.dataset.section); });
    });
    const lb = document.getElementById('logoutBtn');
    if (lb) lb.addEventListener('click', async (e) => {
        e.preventDefault();
        if (!confirm('Logout?')) return;
        try { sessionStorage.removeItem('hask_logged_in'); await signOut(auth); window.location.replace('login.html'); }
        catch (err) { alert(err.message); }
    });
    // Close modal on outside click
    const cvOv = document.getElementById('cvModalOverlay');
    if (cvOv) cvOv.addEventListener('click', (e) => { if (e.target === cvOv) closeCVModal(); });
}

// ===== APPLY DEFAULTS =====
function applyDefaults() {
    const p = profileData.personal || {};
    setVal('pTitle', p.title || '');
    setVal('pFullName', p.fullName || userData.name || '');
    setVal('pFatherName', p.fatherName || '');
    setVal('pNationality', p.nationality || 'Pakistan');
    let cnic = p.cnic || '';
    if (cnic && cnic.length === 13 && !cnic.includes('-')) cnic = cnic.slice(0,5) + '-' + cnic.slice(5,12) + '-' + cnic.slice(12,13);
    setVal('pCnic', cnic);
    setVal('pDob', p.dob || '');
    setVal('pGender', p.gender || '');

    if (p.interest) {
        const std = ['IT & Software','Sales & Marketing','Accounting & Finance','HR & Admin','Engineering','Education','Healthcare','Construction','Transport','Security','Hospitality','Retail','Manufacturing','Textile','Telecom','Other'];
        if (std.includes(p.interest)) {
            setVal('pInterest', p.interest);
            if (p.interest === 'Other') { document.getElementById('otherInterestField').style.display = 'flex'; setVal('pOtherInterest', p.otherInterest || ''); }
        } else { addCustomInterest(p.interest); setVal('pInterest', p.interest); }
    }

    // Location
    setVal('pCountry', p.country || 'Pakistan');
    if (p.province) {
        setVal('pProvince', p.province);
        onProvinceChange();
        setTimeout(() => {
            setVal('pDomicile', p.domicile || '');
            setVal('pDistrict', p.district || '');
            onDistrictChange();
            setTimeout(() => { setVal('pTehsil', p.tehsil || ''); }, 50);
        }, 50);
    }
    setVal('pPostalCode', p.postalCode || '');
    setVal('pAddress', p.address || '');
    setVal('pPermanentAddress', p.permanentAddress || '');
    if (p.address && p.address === p.permanentAddress) {
        document.getElementById('sameAddress').checked = true;
        document.getElementById('pPermanentAddress').readOnly = true;
        document.getElementById('pPermanentAddress').style.background = '#f5f7fa';
    }
    setVal('pLandline', p.landline || '');
    setVal('pCell', p.cell || '');
    setVal('pEmail', p.email || userData.email || '');

    document.getElementById('candidateId').textContent = userData.userId || '—';

    // Experience
    const exp = profileData.experience || {};
    setVal('overallExp', exp.overall || 0);
    setVal('industryExp', exp.industry || 0);
    if (exp.has === false) {
        const no = document.querySelector('input[name="hasExp"][value="no"]');
        if (no) no.checked = true;
    }

    // Self
    const sa = profileData.self || {};
    setVal('saObjective', sa.objective || '');
    setVal('saStrengths', sa.strengths || '');
    setVal('saImprovements', sa.improvements || '');
    setVal('saSummary', sa.summary || '');
    setTimeout(() => {
        ['saObjective','saStrengths','saImprovements','saSummary'].forEach((id,i) => {
            const el = document.getElementById(id);
            const cnt = document.getElementById('c' + (i+1));
            if (el && cnt) cnt.textContent = el.value.length;
        });
    }, 100);

    // References
    const r = profileData.references || {};
    setVal('ref1Title', r.ref1Title || 'Mr.');
    setVal('ref1Name', r.ref1Name || '');
    setVal('ref1Designation', r.ref1Designation || '');
    setVal('ref1Org', r.ref1Org || '');
    setVal('ref1Phone', r.ref1Phone || '');
    setVal('ref1Known', r.ref1Known || '');
    setVal('ref1Email', r.ref1Email || '');
    setVal('ref2Title', r.ref2Title || 'Mr.');
    setVal('ref2Name', r.ref2Name || '');
    setVal('ref2Designation', r.ref2Designation || '');
    setVal('ref2Org', r.ref2Org || '');
    setVal('ref2Phone', r.ref2Phone || '');
    setVal('ref2Known', r.ref2Known || '');
    setVal('ref2Email', r.ref2Email || '');

    // Misc
    const m = profileData.misc || {};
    setVal('mCrime', m.crime || 'No');
    setVal('mDisability', m.disability || 'No');
    setVal('mSource', m.source || 'Social Media');
    setVal('mNoticeNum', m.noticeNum || 1);
    setVal('mNoticeUnit', m.noticeUnit || 'Month');
    setVal('mLinkedin', m.linkedin || '');
    setVal('mBlood', m.blood || '');
    setVal('mMarital', m.marital || '');
    const stdRel = ['Islam','Christianity','Hinduism','Sikhism','Buddhism'];
    if (m.religion && !stdRel.includes(m.religion) && m.religion !== '') {
        setVal('mReligion', 'Other');
        document.getElementById('religionOtherField').style.display = 'flex';
        setVal('mReligionOther', m.religion);
    } else { setVal('mReligion', m.religion || ''); }
    if (m.crime === 'Yes') { document.getElementById('crimeDetailsField').style.display = 'flex'; setVal('mCrimeDetails', m.crimeDetails || ''); }
    if (m.disability === 'Yes') { document.getElementById('disabilityDetailsField').style.display = 'flex'; setVal('mDisabilityDetails', m.disabilityDetails || ''); }

    // Compensation
    const c = profileData.compensation || {};
    ['cBasic','cGross','cExpected','bonusCount','medAmount','fuelAmount','fuelLiters','buybackYears','mobileAmount','opdAmount','leaveAnnual','leaveCasual','leaveSick','workingDays'].forEach(id => setVal(id, c[id.replace('c','').toLowerCase()] !== undefined ? c[id.replace('c','').toLowerCase()] : 0));
    setVal('vehicleDetail', c.vehicleDetail || '');
    setVal('otherBenefit', c.otherBenefit || '');

    renderEducationTable();
    renderCertificationsTable();
    renderExperienceTable();
    renderSkillsTable();
}

function addCustomInterest(value) {
    const sel = document.getElementById('pInterest');
    if (!sel) return;
    if (Array.from(sel.options).some(o => o.value === value)) return;
    const other = Array.from(sel.options).find(o => o.value === 'Other');
    const opt = document.createElement('option');
    opt.value = value; opt.textContent = value;
    if (other) sel.insertBefore(opt, other); else sel.appendChild(opt);
}

function setVal(id, v) { const el = document.getElementById(id); if (el) el.value = v || ''; }
function getVal(id) { const el = document.getElementById(id); return el ? el.value.trim() : ''; }

// ===== SAVE: PERSONAL =====
window.savePersonal = async function(e) {
    e.preventDefault();
    const btn = e.target.querySelector('.btn-save');
    btn.disabled = true; btn.textContent = 'Saving...';
    try {
        let interest = getVal('pInterest'), other = '';
        if (interest === 'Other') {
            other = getVal('pOtherInterest');
            if (!other) { showMessage('❌ Specify interest.', 'error'); btn.disabled = false; btn.textContent = 'Save & Continue →'; return; }
            addCustomInterest(other); interest = other;
        }
        const pic = (profileData.personal && profileData.personal.profilePic) || '';
        profileData.personal = {
            title: getVal('pTitle'), fullName: getVal('pFullName'), fatherName: getVal('pFatherName'),
            nationality: getVal('pNationality'), cnic: getVal('pCnic').replace(/\D/g,''), dob: getVal('pDob'),
            gender: getVal('pGender'), interest: interest, otherInterest: other,
            country: getVal('pCountry'), province: getVal('pProvince'), domicile: getVal('pDomicile'),
            district: getVal('pDistrict'), tehsil: getVal('pTehsil'), postalCode: getVal('pPostalCode'),
            address: getVal('pAddress'), permanentAddress: getVal('pPermanentAddress'),
            landline: getVal('pLandline'), cell: getVal('pCell'), email: getVal('pEmail'),
            profilePic: pic
        };
        await saveProfile();
        updateProgress(); renderProgress(); renderSidebarUser();
        showMessage('✅ Personal details saved!', 'success');
        setTimeout(() => showSection('education'), 500);
    } catch (err) { showMessage('❌ ' + err.message, 'error'); }
    finally { btn.disabled = false; btn.textContent = 'Save & Continue →'; }
};

// ===== SAVE: SELF =====
window.saveSelf = async function(e) {
    e.preventDefault();
    const btn = e.target.querySelector('.btn-save');
    btn.disabled = true; btn.textContent = 'Saving...';
    try {
        profileData.self = { objective: getVal('saObjective'), strengths: getVal('saStrengths'), improvements: getVal('saImprovements'), summary: getVal('saSummary') };
        await saveProfile(); updateProgress(); renderProgress();
        showMessage('✅ Self assessment saved!', 'success');
        setTimeout(() => showSection('references'), 500);
    } catch (err) { showMessage('❌ ' + err.message, 'error'); }
    finally { btn.disabled = false; btn.textContent = 'Save & Continue →'; }
};

// ===== SAVE: REFERENCES =====
window.saveReferences = async function(e) {
    e.preventDefault();
    const btn = e.target.querySelector('.btn-save');
    btn.disabled = true; btn.textContent = 'Saving...';
    try {
        profileData.references = {
            ref1Title: getVal('ref1Title'), ref1Name: getVal('ref1Name'), ref1Designation: getVal('ref1Designation'),
            ref1Org: getVal('ref1Org'), ref1Phone: getVal('ref1Phone'), ref1Known: getVal('ref1Known'), ref1Email: getVal('ref1Email'),
            ref2Title: getVal('ref2Title'), ref2Name: getVal('ref2Name'), ref2Designation: getVal('ref2Designation'),
            ref2Org: getVal('ref2Org'), ref2Phone: getVal('ref2Phone'), ref2Known: getVal('ref2Known'), ref2Email: getVal('ref2Email')
        };
        await saveProfile(); updateProgress(); renderProgress();
        showMessage('✅ References saved!', 'success');
        setTimeout(() => showSection('misc'), 500);
    } catch (err) { showMessage('❌ ' + err.message, 'error'); }
    finally { btn.disabled = false; btn.textContent = 'Save & Continue →'; }
};

// ===== SAVE: MISC =====
window.saveMisc = async function(e) {
    e.preventDefault();
    const btn = e.target.querySelector('.btn-save');
    btn.disabled = true; btn.textContent = 'Saving...';
    try {
        const crime = getVal('mCrime'), dis = getVal('mDisability'), rel = getVal('mReligion');
        if (crime === 'Yes' && !getVal('mCrimeDetails')) { showMessage('❌ Crime details required.', 'error'); btn.disabled = false; btn.textContent = 'Save & Continue →'; return; }
        if (dis === 'Yes' && !getVal('mDisabilityDetails')) { showMessage('❌ Disability details required.', 'error'); btn.disabled = false; btn.textContent = 'Save & Continue →'; return; }
        if (rel === 'Other' && !getVal('mReligionOther')) { showMessage('❌ Religion required.', 'error'); btn.disabled = false; btn.textContent = 'Save & Continue →'; return; }
        profileData.misc = {
            crime: crime, crimeDetails: crime === 'Yes' ? getVal('mCrimeDetails') : '',
            disability: dis, disabilityDetails: dis === 'Yes' ? getVal('mDisabilityDetails') : '',
            source: getVal('mSource'), noticeNum: getVal('mNoticeNum'), noticeUnit: getVal('mNoticeUnit'),
            linkedin: getVal('mLinkedin'), blood: getVal('mBlood'), marital: getVal('mMarital'),
            religion: rel === 'Other' ? getVal('mReligionOther') : rel, religionType: rel
        };
        await saveProfile(); updateProgress(); renderProgress();
        showMessage('✅ Miscellaneous saved!', 'success');
        setTimeout(() => showSection('compensation'), 500);
    } catch (err) { showMessage('❌ ' + err.message, 'error'); }
    finally { btn.disabled = false; btn.textContent = 'Save & Continue →'; }
};

// ===== SAVE: COMPENSATION =====
window.saveCompensation = async function(e) {
    e.preventDefault();
    const btn = e.target.querySelector('.btn-save');
    btn.disabled = true; btn.textContent = 'Saving...';
    try {
        const R = n => { const el = document.querySelector(`input[name="${n}"]:checked`); return el ? el.value : ''; };
        profileData.compensation = {
            basic: Number(getVal('cBasic'))||0, gross: Number(getVal('cGross'))||0, expected: Number(getVal('cExpected'))||0,
            bonus: R('bonus'), bonusType: R('bonusType'), bonusCount: Number(getVal('bonusCount'))||0,
            leave: R('leave'), medical: R('medical'), medAmount: Number(getVal('medAmount'))||0,
            transport: R('transport'), fuel: R('fuel'), fuelAmount: Number(getVal('fuelAmount'))||0, fuelLiters: Number(getVal('fuelLiters'))||0,
            accom: R('accom'), vehicle: R('vehicle'), vehicleDetail: getVal('vehicleDetail'),
            buyback: R('buyback'), buybackYears: Number(getVal('buybackYears'))||0,
            mobile: R('mobile'), mobileAmount: Number(getVal('mobileAmount'))||0,
            opd: R('opd'), opdAmount: Number(getVal('opdAmount'))||0,
            health: R('health'), life: R('life'), pf: R('pf'),
            gratuity: R('gratuity'), gratuityType: R('gratuityType'), wppf: R('wppf'),
            leaveAnnual: Number(getVal('leaveAnnual'))||0, leaveCasual: Number(getVal('leaveCasual'))||0,
            leaveSick: Number(getVal('leaveSick'))||0, workingDays: Number(getVal('workingDays'))||0,
            otherBenefit: getVal('otherBenefit')
        };
        await saveProfile(); updateProgress(); renderProgress();
        showMessage('✅ Compensation saved! Profile complete! 🎉', 'success');
    } catch (err) { showMessage('❌ ' + err.message, 'error'); }
    finally { btn.disabled = false; btn.textContent = 'Save & Finish ✓'; }
};

// ===== EDUCATION =====
function renderEducationTable() {
    const tbody = document.getElementById('educationTableBody');
    const list = profileData.education || [];
    if (!list.length) { tbody.innerHTML = `<tr><td colspan="6" class="empty-row">No education added yet</td></tr>`; return; }
    tbody.innerHTML = list.map((e,i) => `
        <tr><td>${escapeHtml(e.level)}</td><td>${escapeHtml(e.institution)}</td><td>${escapeHtml(e.title)}</td><td>${escapeHtml(e.date)}</td><td>${escapeHtml(e.percentage||'-')}</td>
        <td><button class="btn-edit" onclick="editEducation(${i})">✎</button><button class="btn-delete" onclick="deleteEducation(${i})">✕</button></td></tr>
    `).join('');
}

function uniOpts(sel='') { return UNIVERSITIES.map(u => `<option value="${u}" ${u===sel?'selected':''}>${u}</option>`).join(''); }

window.openEducationModal = function() {
    editingEduIndex = null;
    document.getElementById('modalTitle').textContent = 'Add Education';
    document.getElementById('modalBody').innerHTML = `
        <form onsubmit="saveEducationEntry(event)">
            <div class="form-grid">
                <div class="field">
                    <label>Degree Level <span class="req">*</span></label>
                    <select id="eduLevel" required>
                        <option value="">Select</option>
                        <option>Matriculation/O-Level</option><option>Intermediate/A-Level</option>
                        <option>Bachelor</option><option>Master</option><option>MPhil</option>
                        <option>PhD</option><option>Certification</option><option>Diploma</option>
                    </select>
                </div>
                <div class="field">
                    <label>University/Institution <span class="req">*</span></label>
                    <select id="eduInstitution" required>
                        <option value="">Select</option>
                        ${uniOpts()}
                    </select>
                </div>
                <div class="field">
                    <label>Degree Title <span class="req">*</span></label>
                    <input type="text" id="eduTitle" required>
                </div>
                <div class="field">
                    <label>Completion Date <span class="req">*</span></label>
                    <input type="date" id="eduDate" required>
                </div>
                <div class="field">
                    <label>Percentage/CGPA</label>
                    <input type="text" id="eduPercentage">
                </div>
            </div>
            <div class="form-actions">
                <button type="button" class="btn-prev" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn-save">Save</button>
            </div>
        </form>
    `;
    openModal();
};

window.editEducation = function(i) {
    editingEduIndex = i;
    const e = profileData.education[i];
    document.getElementById('modalTitle').textContent = 'Edit Education';
    document.getElementById('modalBody').innerHTML = `
        <form onsubmit="saveEducationEntry(event)">
            <div class="form-grid">
                <div class="field">
                    <label>Degree Level <span class="req">*</span></label>
                    <select id="eduLevel" required>
                        ${['Matriculation/O-Level','Intermediate/A-Level','Bachelor','Master','MPhil','PhD','Certification','Diploma'].map(l => `<option value="${l}" ${e.level===l?'selected':''}>${l}</option>`).join('')}
                    </select>
                </div>
                <div class="field">
                    <label>University/Institution <span class="req">*</span></label>
                    <select id="eduInstitution" required>
                        ${uniOpts(e.institution)}
                        <option value="__custom__" ${!UNIVERSITIES.includes(e.institution) && e.institution?'selected':''}>Enter Custom</option>
                    </select>
                </div>
                <div class="field">
                    <label>Degree Title <span class="req">*</span></label>
                    <input type="text" id="eduTitle" value="${escapeAttr(e.title)}" required>
                </div>
                <div class="field">
                    <label>Completion Date <span class="req">*</span></label>
                    <input type="date" id="eduDate" value="${escapeAttr(e.date)}" required>
                </div>
                <div class="field">
                    <label>Percentage/CGPA</label>
                    <input type="text" id="eduPercentage" value="${escapeAttr(e.percentage)}">
                </div>
            </div>
            <div class="form-actions">
                <button type="button" class="btn-prev" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn-save">Update</button>
            </div>
        </form>
    `;
    openModal();
};

window.saveEducationEntry = async function(e) {
    e.preventDefault();
    let inst = getVal('eduInstitution');
    if (inst === '__custom__') { showMessage('❌ Please select a university.', 'error'); return; }
    const entry = { level: getVal('eduLevel'), institution: inst, title: getVal('eduTitle'), date: getVal('eduDate'), percentage: getVal('eduPercentage') };
    if (editingEduIndex === null) profileData.education.push(entry);
    else profileData.education[editingEduIndex] = entry;
    await saveProfile();
    renderEducationTable(); updateProgress(); renderProgress(); closeModal();
    showMessage('✅ Education saved!', 'success');
};

window.deleteEducation = async function(i) {
    if (!confirm('Delete?')) return;
    profileData.education.splice(i,1);
    await saveProfile();
    renderEducationTable(); updateProgress(); renderProgress();
};

// ===== CERTIFICATIONS =====
function renderCertificationsTable() {
    const tbody = document.getElementById('certificationsTableBody');
    const list = profileData.certifications || [];
    if (!list.length) { tbody.innerHTML = `<tr><td colspan="5" class="empty-row">No certifications added yet</td></tr>`; return; }
    tbody.innerHTML = list.map((c,i) => `
        <tr><td>${escapeHtml(c.name)}</td><td>${escapeHtml(c.issuer)}</td><td>${escapeHtml(c.year)}</td><td>${escapeHtml(c.certId||'-')}</td>
        <td><button class="btn-edit" onclick="editCertification(${i})">✎</button><button class="btn-delete" onclick="deleteCertification(${i})">✕</button></td></tr>
    `).join('');
}

window.openCertificationModal = function() {
    editingCertIndex = null;
    document.getElementById('modalTitle').textContent = 'Add Certification';
    document.getElementById('modalBody').innerHTML = `
        <form onsubmit="saveCertificationEntry(event)">
            <div class="form-grid">
                <div class="field full"><label>Certificate Name <span class="req">*</span></label><input type="text" id="certName" required></div>
                <div class="field"><label>Issuing Authority <span class="req">*</span></label><input type="text" id="certIssuer" required></div>
                <div class="field"><label>Year <span class="req">*</span></label><input type="text" id="certYear" required></div>
                <div class="field"><label>Certificate ID</label><input type="text" id="certId"></div>
            </div>
            <div class="form-actions"><button type="button" class="btn-prev" onclick="closeModal()">Cancel</button><button type="submit" class="btn-save">Save</button></div>
        </form>
    `;
    openModal();
};

window.editCertification = function(i) {
    editingCertIndex = i;
    const c = profileData.certifications[i];
    document.getElementById('modalTitle').textContent = 'Edit Certification';
    document.getElementById('modalBody').innerHTML = `
        <form onsubmit="saveCertificationEntry(event)">
            <div class="form-grid">
                <div class="field full"><label>Certificate Name <span class="req">*</span></label><input type="text" id="certName" value="${escapeAttr(c.name)}" required></div>
                <div class="field"><label>Issuing Authority <span class="req">*</span></label><input type="text" id="certIssuer" value="${escapeAttr(c.issuer)}" required></div>
                <div class="field"><label>Year <span class="req">*</span></label><input type="text" id="certYear" value="${escapeAttr(c.year)}" required></div>
                <div class="field"><label>Certificate ID</label><input type="text" id="certId" value="${escapeAttr(c.certId)}"></div>
            </div>
            <div class="form-actions"><button type="button" class="btn-prev" onclick="closeModal()">Cancel</button><button type="submit" class="btn-save">Update</button></div>
        </form>
    `;
    openModal();
};

window.saveCertificationEntry = async function(e) {
    e.preventDefault();
    const entry = { name: getVal('certName'), issuer: getVal('certIssuer'), year: getVal('certYear'), certId: getVal('certId') };
    if (editingCertIndex === null) profileData.certifications.push(entry);
    else profileData.certifications[editingCertIndex] = entry;
    await saveProfile();
    renderCertificationsTable(); updateProgress(); renderProgress(); closeModal();
    showMessage('✅ Certification saved!', 'success');
};

window.deleteCertification = async function(i) {
    if (!confirm('Delete?')) return;
    profileData.certifications.splice(i,1);
    await saveProfile();
    renderCertificationsTable(); updateProgress(); renderProgress();
};

// ===== EXPERIENCE =====
function renderExperienceTable() {
    const tbody = document.getElementById('experienceTableBody');
    const list = (profileData.experience && profileData.experience.entries) || [];
    if (!list.length) { tbody.innerHTML = `<tr><td colspan="5" class="empty-row">No experience added yet</td></tr>`; return; }
    tbody.innerHTML = list.map((e,i) => `
        <tr><td>${escapeHtml(e.employer)}</td><td>${escapeHtml(e.title)}</td><td>${escapeHtml(e.joining)}</td><td>${escapeHtml(e.leaving||'Present')}</td>
        <td><button class="btn-edit" onclick="editExperience(${i})">✎</button><button class="btn-delete" onclick="deleteExperience(${i})">✕</button></td></tr>
    `).join('');
}

window.toggleExperience = function(h) {
    if (!profileData.experience) profileData.experience = { has:true, overall:0, industry:0, entries:[] };
    profileData.experience.has = h;
};

window.openExperienceModal = function() {
    editingExpIndex = null;
    document.getElementById('modalTitle').textContent = 'Add Job Detail';
    document.getElementById('modalBody').innerHTML = `
        <form onsubmit="saveExperienceEntry(event)">
            <div class="form-grid">
                <div class="field"><label>Employer <span class="req">*</span></label><input type="text" id="expEmployer" required></div>
                <div class="field"><label>Manager's Name</label><input type="text" id="expManager"></div>
                <div class="field"><label>Nature of Business <span class="req">*</span></label><input type="text" id="expBusiness" required></div>
                <div class="field"><label>Job Title <span class="req">*</span></label><input type="text" id="expTitle" required></div>
                <div class="field"><label>Joining Date <span class="req">*</span></label><input type="date" id="expJoining" required></div>
                <div class="field"><label>Leaving Date</label><input type="date" id="expLeaving"></div>
                <div class="field"><label>Contact Employer?</label><select id="expContact"><option>Yes</option><option>No</option></select></div>
                <div class="field full">
                    <label>Job Description / Key Responsibilities (Optional)</label>
                    <textarea id="expDescription" rows="4" maxlength="1000" placeholder="• Managed payroll for 200+ employees&#10;• Handled recruitment"></textarea>
                    <small class="char-count"><span id="expDescCount">0</span> / 1000 characters</small>
                </div>
            </div>
            <div class="form-actions"><button type="button" class="btn-prev" onclick="closeModal()">Cancel</button><button type="submit" class="btn-save">Save</button></div>
        </form>
    `;
    const ta = document.getElementById('expDescription');
    if (ta) ta.addEventListener('input', () => { document.getElementById('expDescCount').textContent = ta.value.length; });
    openModal();
};

window.editExperience = function(i) {
    editingExpIndex = i;
    const e = profileData.experience.entries[i];
    document.getElementById('modalTitle').textContent = 'Edit Job Detail';
    document.getElementById('modalBody').innerHTML = `
        <form onsubmit="saveExperienceEntry(event)">
            <div class="form-grid">
                <div class="field"><label>Employer <span class="req">*</span></label><input type="text" id="expEmployer" value="${escapeAttr(e.employer)}" required></div>
                <div class="field"><label>Manager's Name</label><input type="text" id="expManager" value="${escapeAttr(e.manager)}"></div>
                <div class="field"><label>Nature of Business <span class="req">*</span></label><input type="text" id="expBusiness" value="${escapeAttr(e.business)}" required></div>
                <div class="field"><label>Job Title <span class="req">*</span></label><input type="text" id="expTitle" value="${escapeAttr(e.title)}" required></div>
                <div class="field"><label>Joining Date <span class="req">*</span></label><input type="date" id="expJoining" value="${escapeAttr(e.joining)}" required></div>
                <div class="field"><label>Leaving Date</label><input type="date" id="expLeaving" value="${escapeAttr(e.leaving)}"></div>
                <div class="field"><label>Contact Employer?</label><select id="expContact"><option ${e.contact==='Yes'?'selected':''}>Yes</option><option ${e.contact==='No'?'selected':''}>No</option></select></div>
                <div class="field full">
                    <label>Job Description (Optional)</label>
                    <textarea id="expDescription" rows="4" maxlength="1000">${escapeHtml(e.description||'')}</textarea>
                    <small class="char-count"><span id="expDescCount">${(e.description||'').length}</span> / 1000 characters</small>
                </div>
            </div>
            <div class="form-actions"><button type="button" class="btn-prev" onclick="closeModal()">Cancel</button><button type="submit" class="btn-save">Update</button></div>
        </form>
    `;
    const ta = document.getElementById('expDescription');
    if (ta) ta.addEventListener('input', () => { document.getElementById('expDescCount').textContent = ta.value.length; });
    openModal();
};

window.saveExperienceEntry = async function(e) {
    e.preventDefault();
    const entry = {
        employer: getVal('expEmployer'), manager: getVal('expManager'), business: getVal('expBusiness'),
        title: getVal('expTitle'), joining: getVal('expJoining'), leaving: getVal('expLeaving'),
        contact: getVal('expContact'), description: getVal('expDescription')
    };
    if (!profileData.experience) profileData.experience = { has:true, overall:0, industry:0, entries:[] };
    if (!profileData.experience.entries) profileData.experience.entries = [];
    if (editingExpIndex === null) profileData.experience.entries.push(entry);
    else profileData.experience.entries[editingExpIndex] = entry;
    profileData.experience.overall = Number(getVal('overallExp'))||0;
    profileData.experience.industry = Number(getVal('industryExp'))||0;
    await saveProfile();
    renderExperienceTable(); updateProgress(); renderProgress(); closeModal();
    showMessage('✅ Experience saved!', 'success');
};

window.deleteExperience = async function(i) {
    if (!confirm('Delete?')) return;
    profileData.experience.entries.splice(i,1);
    await saveProfile();
    renderExperienceTable(); updateProgress(); renderProgress();
};

// ===== SKILLS =====
function renderSkillsTable() {
    const tbody = document.getElementById('skillsTableBody');
    const list = profileData.skills || [];
    if (!list.length) { tbody.innerHTML = `<tr><td colspan="4" class="empty-row">No skills added yet</td></tr>`; return; }
    tbody.innerHTML = list.map((s,i) => `
        <tr><td>${escapeHtml(s.name)}</td><td>${escapeHtml(s.level)}</td><td>${escapeHtml(s.description)}</td>
        <td><button class="btn-edit" onclick="editSkill(${i})">✎</button><button class="btn-delete" onclick="deleteSkill(${i})">✕</button></td></tr>
    `).join('');
}

window.openSkillModal = function() {
    editingSkillIndex = null;
    document.getElementById('modalTitle').textContent = 'Add Skill';
    document.getElementById('modalBody').innerHTML = `
        <form onsubmit="saveSkillEntry(event)">
            <div class="form-grid">
                <div class="field"><label>Skill Name <span class="req">*</span></label><input type="text" id="skillName" required></div>
                <div class="field"><label>Skill Level <span class="req">*</span></label><select id="skillLevel" required><option>Beginner</option><option>Intermediate</option><option selected>Expert</option></select></div>
                <div class="field full"><label>Description</label><input type="text" id="skillDesc"></div>
            </div>
            <div class="form-actions"><button type="button" class="btn-prev" onclick="closeModal()">Cancel</button><button type="submit" class="btn-save">Save</button></div>
        </form>
    `;
    openModal();
};

window.editSkill = function(i) {
    editingSkillIndex = i;
    const s = profileData.skills[i];
    document.getElementById('modalTitle').textContent = 'Edit Skill';
    document.getElementById('modalBody').innerHTML = `
        <form onsubmit="saveSkillEntry(event)">
            <div class="form-grid">
                <div class="field"><label>Skill Name <span class="req">*</span></label><input type="text" id="skillName" value="${escapeAttr(s.name)}" required></div>
                <div class="field"><label>Skill Level <span class="req">*</span></label><select id="skillLevel"><option ${s.level==='Beginner'?'selected':''}>Beginner</option><option ${s.level==='Intermediate'?'selected':''}>Intermediate</option><option ${s.level==='Expert'?'selected':''}>Expert</option></select></div>
                <div class="field full"><label>Description</label><input type="text" id="skillDesc" value="${escapeAttr(s.description)}"></div>
            </div>
            <div class="form-actions"><button type="button" class="btn-prev" onclick="closeModal()">Cancel</button><button type="submit" class="btn-save">Update</button></div>
        </form>
    `;
    openModal();
};

window.saveSkillEntry = async function(e) {
    e.preventDefault();
    const entry = { name: getVal('skillName'), level: getVal('skillLevel'), description: getVal('skillDesc') };
    if (editingSkillIndex === null) profileData.skills.push(entry);
    else profileData.skills[editingSkillIndex] = entry;
    await saveProfile();
    renderSkillsTable(); updateProgress(); renderProgress(); closeModal();
    showMessage('✅ Skill saved!', 'success');
};

window.deleteSkill = async function(i) {
    if (!confirm('Delete?')) return;
    profileData.skills.splice(i,1);
    await saveProfile();
    renderSkillsTable(); updateProgress(); renderProgress();
};

// ===== MODAL CONTROL =====
function openModal() { document.getElementById('modalOverlay').classList.add('show'); }
window.closeModal = function() { document.getElementById('modalOverlay').classList.remove('show'); };

// ===== TOGGLES =====
window.toggleMed = function(s) { const el = document.getElementById('medAmount'); if (el) el.disabled = !s; };
window.toggleFuel = function(s) { ['fuelAmount','fuelLiters'].forEach(id => { const el = document.getElementById(id); if (el) el.disabled = !s; }); };
window.toggleVehicle = function(s) { const r = document.getElementById('vehicleDetailsRow'); if (r) r.style.display = s ? 'flex' : 'none'; };
window.toggleMobile = function(s) { const el = document.getElementById('mobileAmount'); if (el) el.disabled = !s; };

// ===== CHAR COUNTERS =====
function attachCharCounters() {
    [['saObjective','c1'],['saStrengths','c2'],['saImprovements','c3'],['saSummary','c4']].forEach(([id, cid]) => {
        const i = document.getElementById(id), c = document.getElementById(cid);
        if (i && c) i.addEventListener('input', () => { c.textContent = i.value.length; });
    });
}

// ===== HELPERS =====
function escapeHtml(s) { if (!s) return ''; return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]); }
function escapeAttr(s) { if (!s) return ''; return String(s).replace(/["'&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]); }

function showMessage(text, type = 'info') {
    const b = document.getElementById('messageBox');
    if (!b) return;
    b.textContent = text;
    b.className = 'message-box show ' + type;
    setTimeout(() => b.classList.remove('show'), 5000);
}
