/* ============================================
   HASK Talent Connect - Profile JS (Final)
   ============================================ */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
    JOB_TITLES_DB, PAKISTAN_DATA, COUNTRIES, UNIVERSITIES,
    INDUSTRIES, LANGUAGES, SKILLS_DB, STRENGTHS_LIST, PROFESSIONAL_TITLES,
    getProvinces, getDistricts, getTehsils, getPostalCode
} from "./data.js";

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

// ============ STATE ============
let currentUser = null;
let userData = null;
let profileData = {
    personal: null,
    education: [],
    certifications: [],
    experience: { has: true, entries: [] },
    skills: [],
    languages: [],
    self: null,
    references: null,
    misc: null,
    compensation: null
};
let progressData = {};
let editingEduIndex = null, editingCertIndex = null, editingExpIndex = null, editingSkillIndex = null;
let selectedStrengths = [];

// ============ INIT ============
onAuthStateChanged(auth, async (user) => {
    if (!user) { window.location.replace('login.html?redirect=' + encodeURIComponent('profile.html')); return; }
    currentUser = user;
    try {
        const ud = await getDoc(doc(db, "users", user.uid));
        userData = ud.exists() ? ud.data() : { name: user.displayName || 'User', email: user.email };
    } catch (e) {
        userData = { name: user.displayName || 'User', email: user.email };
    }

    await loadProfile();

    // Fill title suggestions datalist
    const titleDL = document.getElementById('titleSuggestions');
    if (titleDL) {
        titleDL.innerHTML = PROFESSIONAL_TITLES.map(t => `<option value="${escA(t)}">`).join('');
    }

    populateCountries('pNationality');
    populateCountries('pCountry');
    populateProvinces('pProvince');
    renderLanguages();

    renderSidebarUser();
    updateProgress();
    renderProgress();
    applyDefaults();

    attachCnicFormatter();
    attachPhoneFormatters();
    attachCharCounters();
    attachListeners();
    attachStrengthListeners();
    updateAvatarControls();

    showFirstIncompleteSection();
});

// ============ TOAST ============
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.className = 'toast ' + type + ' show';
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), 3200);
}
window.showToast = showToast;

// ============ COUNTRIES / PROVINCES ============
function populateCountries(selectId) {
    const sel = document.getElementById(selectId);
    if (!sel) return;
    sel.innerHTML = '<option value="Pakistan">Pakistan</option>';
    COUNTRIES.forEach(c => {
        if (c !== 'Pakistan') {
            const o = document.createElement('option');
            o.value = c; o.textContent = c;
            sel.appendChild(o);
        }
    });
}

function populateProvinces(selectId) {
    const sel = document.getElementById(selectId);
    if (!sel) return;
    sel.innerHTML = '<option value="">Select Province</option>';
    getProvinces().forEach(p => {
        const o = document.createElement('option');
        o.value = p; o.textContent = p;
        sel.appendChild(o);
    });
}

window.onProvinceChange = function() {
    const province = document.getElementById('pProvince').value;
    const distSel = document.getElementById('pDistrict');
    const domSel = document.getElementById('pDomicile');
    const tehSel = document.getElementById('pTehsil');
    document.getElementById('pPostalCode').value = '';

    if (!province) {
        distSel.innerHTML = '<option value="">Select Province First</option>';
        domSel.innerHTML = '<option value="">Select Province First</option>';
        tehSel.innerHTML = '<option value="">Select District First</option>';
        return;
    }
    const districts = getDistricts(province);
    distSel.innerHTML = '<option value="">Select District</option>';
    domSel.innerHTML = '<option value="">Select District</option>';
    districts.forEach(d => {
        distSel.innerHTML += `<option value="${d}">${d}</option>`;
        domSel.innerHTML += `<option value="${d}">${d}</option>`;
    });
    tehSel.innerHTML = '<option value="">Select District First</option>';
};

window.onDistrictChange = function() {
    const province = document.getElementById('pProvince').value;
    const district = document.getElementById('pDistrict').value;
    const tehSel = document.getElementById('pTehsil');
    if (!district) { tehSel.innerHTML = '<option value="">Select District First</option>'; return; }
    const tehsils = getTehsils(province, district);
    tehSel.innerHTML = '<option value="">Select Tehsil</option>';
    tehsils.forEach(t => { tehSel.innerHTML += `<option value="${t}">${t}</option>`; });
    document.getElementById('pPostalCode').value = getPostalCode(province, district) || '';
};

window.copyPresentToPermanent = function() {
    const cb = document.getElementById('sameAddress');
    const p = document.getElementById('pAddress');
    const pm = document.getElementById('pPermanentAddress');
    if (cb.checked) {
        pm.value = p.value;
        pm.readOnly = true;
        pm.style.background = '#f5f7fa';
    } else {
        pm.readOnly = false;
        pm.style.background = '';
    }
};

// Auto-sync present → permanent on input if checkbox checked
document.addEventListener('input', (e) => {
    if (e.target.id === 'pAddress') {
        const cb = document.getElementById('sameAddress');
        if (cb && cb.checked) {
            const pm = document.getElementById('pPermanentAddress');
            if (pm) pm.value = e.target.value;
        }
    }
});

// ============ CNIC FORMAT ============
function attachCnicFormatter() {
    const c = document.getElementById('pCnic');
    if (!c) return;
    c.addEventListener('input', function() {
        let d = this.value.replace(/\D/g, '').slice(0, 13);
        let f = '';
        if (d.length > 0) f = d.slice(0, 5);
        if (d.length > 5) f += '-' + d.slice(5, 12);
        if (d.length > 12) f += '-' + d.slice(12, 13);
        this.value = f;
    });
}

// ============ PHONE FORMAT ============
function formatPakPhone(v) {
    let d = v.replace(/\D/g, '');
    if (d.startsWith('92')) d = '0' + d.slice(2);
    if (!d.startsWith('0')) d = '0' + d;
    d = d.slice(0, 11);
    let f = d.slice(0, 4);
    if (d.length > 4) f += '-' + d.slice(4, 11);
    return f;
}

function attachPhoneFormatters() {
    ['pCell', 'ref1Phone', 'ref2Phone'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', function() {
                this.value = formatPakPhone(this.value);
            });
        }
    });
    // For dynamically-created contact phone in modal
    document.addEventListener('input', (e) => {
        if (e.target.id === 'expContactPhone') {
            e.target.value = formatPakPhone(e.target.value);
        }
    });
}

// ============ STRENGTHS ============
function attachStrengthListeners() {
    const inp = document.getElementById('strengthSearch');
    if (!inp) return;

    inp.addEventListener('input', () => {
        const q = inp.value.trim().toLowerCase();
        const box = document.getElementById('strengthSuggestions');
        if (!q) { box.classList.remove('show'); return; }

        const matches = STRENGTHS_LIST
            .filter(s => s.toLowerCase().includes(q) && !selectedStrengths.includes(s))
            .slice(0, 12);

        if (matches.length === 0) {
            box.innerHTML = `<div class="strength-suggestion-empty">Press Enter to add "${esc(q)}"</div>`;
        } else {
            box.innerHTML = matches.map(s => `
                <div class="strength-suggestion-item" onclick="addStrength('${escA(s)}')">
                    <span>${esc(s)}</span>
                    <span class="add-icon">+ Add</span>
                </div>
            `).join('');
        }
        box.classList.add('show');
    });

    inp.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const v = inp.value.trim();
            if (v) addStrength(v);
        }
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
        const box = document.getElementById('strengthSuggestions');
        const wrap = document.querySelector('.strengths-search-wrap');
        if (box && wrap && !wrap.contains(e.target)) box.classList.remove('show');
    });
}

window.addStrength = async function(s) {
    s = s.trim();
    if (!s || selectedStrengths.includes(s)) return;
    selectedStrengths.push(s);
    document.getElementById('strengthSearch').value = '';
    document.getElementById('strengthSuggestions').classList.remove('show');
    renderStrengthTags();
    // Save combined to textarea value
    syncStrengthsToTextarea();
};

window.removeStrength = function(s) {
    selectedStrengths = selectedStrengths.filter(x => x !== s);
    renderStrengthTags();
    syncStrengthsToTextarea();
};

function renderStrengthTags() {
    const box = document.getElementById('strengthsTags');
    if (!box) return;
    box.innerHTML = selectedStrengths.map(s => `
        <span class="strength-tag">
            ${esc(s)}
            <span class="remove-tag" onclick="removeStrength('${escA(s)}')">×</span>
        </span>
    `).join('');
}

function syncStrengthsToTextarea() {
    const ta = document.getElementById('saStrengths');
    if (ta) {
        ta.value = selectedStrengths.join('\n');
        const cnt = document.getElementById('c2');
        if (cnt) cnt.textContent = ta.value.length;
    }
}

// ============ PROFILE PICTURE ============
window.handlePicUpload = function(event) {
    const file = event.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { showToast('Picture must be less than 5MB', 'error'); event.target.value = ''; return; }
    if (!file.type.startsWith('image/')) { showToast('Only images allowed', 'error'); event.target.value = ''; return; }

    const av = document.getElementById('sidebarAvatar');
    const old = av.innerHTML;

    av.innerHTML = `
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
            const p = Math.round((e.loaded / e.total) * 100);
            const r = document.getElementById('progressRingFill');
            const t = document.getElementById('progressText');
            if (r) r.style.strokeDashoffset = 314 - (p / 100) * 314;
            if (t) t.textContent = p + '%';
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
                const o = document.getElementById('uploadOverlay');
                if (o) o.innerHTML = '<div class="progress-check">✅</div>';
                setTimeout(() => {
                    av.innerHTML = `<img src="${url}" alt="Avatar">`;
                    updateAvatarControls();
                    event.target.value = '';
                    showToast('Profile picture updated!');
                }, 700);
            } catch (err) { av.innerHTML = old; }
        } else { av.innerHTML = old; }
    };
    xhr.onerror = function() { av.innerHTML = old; };
    xhr.send(formData);
};

window.removePic = async function() {
    if (!confirm('Remove your profile picture?')) return;
    profileData.personal = profileData.personal || {};
    profileData.personal.profilePic = '';
    await saveProfile();
    renderSidebarUser();
    updateAvatarControls();
    showToast('Picture removed');
};

function updateAvatarControls() {
    const hasPic = !!(profileData.personal && profileData.personal.profilePic);
    const u = document.querySelector('.sidebar-avatar-controls .btn-pic-upload');
    const r = document.querySelector('.sidebar-avatar-controls .btn-pic-remove');
    if (u) u.classList.toggle('hide', hasPic);
    if (r) r.classList.toggle('show', hasPic);
}

// ============ FIRESTORE ============
async function loadProfile() {
    try {
        const snap = await getDoc(doc(db, "profiles", currentUser.uid));
        if (snap.exists()) {
            const d = snap.data();
            profileData = {
                personal: d.personal || null,
                education: d.education || [],
                certifications: d.certifications || [],
                experience: d.experience || { has: true, entries: [] },
                skills: d.skills || [],
                languages: d.languages || [],
                self: d.self || null,
                references: d.references || null,
                misc: d.misc || null,
                compensation: d.compensation || null
            };
        }
    } catch (e) { console.warn(e); }
}

async function saveProfile() {
    if (!currentUser) return;
    await setDoc(doc(db, "profiles", currentUser.uid), {
        ...profileData,
        userId: currentUser.uid,
        userName: userData.name,
        userEmail: userData.email,
        updatedAt: new Date().toISOString()
    }, { merge: true });
}
window.saveProfileSilent = async function() { try { await saveProfile(); } catch(e) {} };

// ============ SIDEBAR USER ============
function renderSidebarUser() {
    const n = userData.name || 'User';
    const init = n.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
    document.getElementById('sidebarName').textContent = n;
    document.getElementById('sidebarId').textContent = '🆔 ' + (userData.userId || '—');
    const av = document.getElementById('sidebarAvatar');
    const pic = profileData.personal && profileData.personal.profilePic;
    if (pic) av.innerHTML = `<img src="${pic}" alt="Avatar">`;
    else av.textContent = init;
}

// ============ PROGRESS ============
function updateProgress() {
    const p = profileData;
    progressData.personal = !!(p.personal && p.personal.fullName && p.personal.fatherName &&
        p.personal.cnic && p.personal.dob && p.personal.gender && p.personal.cell &&
        p.personal.email && p.personal.address && p.personal.permanentAddress &&
        p.personal.province && p.personal.domicile && p.personal.district &&
        p.personal.tehsil && p.personal.availability);
    progressData.education = p.education && p.education.length > 0;
    progressData.certifications = p.certifications && p.certifications.length > 0;
    progressData.experience = p.experience && (p.experience.has === false || (p.experience.entries && p.experience.entries.length > 0));
    progressData.skills = (p.skills && p.skills.length > 0) || (p.languages && p.languages.length > 0);
    progressData.self = !!(p.self && p.self.title && p.self.objective);
    progressData.references = !!(p.references && (p.references.ref1Name || p.references.ref2Name));
    progressData.misc = !!(p.misc && p.misc.crime && p.misc.disability && p.misc.source && p.misc.noticeType);
    progressData.compensation = !!(p.compensation && p.compensation.basic !== undefined && p.compensation.gross !== undefined && p.compensation.expected !== undefined);
}

function renderProgress() {
    const secs = ['personal','education','certifications','experience','skills','self','references','misc','compensation'];
    const done = secs.filter(s => progressData[s]).length;
    const pct = Math.round((done / secs.length) * 100);
    document.getElementById('progressPercent').textContent = pct + '%';
    document.getElementById('progressBarFill').style.width = pct + '%';
    secs.forEach(s => {
        const item = document.querySelector(`.menu-item[data-section="${s}"]`);
        const cb = document.getElementById('check-' + s);
        if (!item || !cb) return;
        if (progressData[s]) { item.classList.add('completed'); cb.textContent = '✅'; }
        else { item.classList.remove('completed'); cb.textContent = '⬜'; }
    });
}

// ============ NAVIGATION ============
function showSection(n) {
    document.querySelectorAll('.profile-section').forEach(s => s.classList.remove('active'));
    const t = document.getElementById('section-' + n);
    if (t) t.classList.add('active');
    document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));
    const mi = document.querySelector(`.menu-item[data-section="${n}"]`);
    if (mi) mi.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
window.goToSection = showSection;

window.nextSection = function(n) {
    saveProfile().then(() => {
        updateProgress();
        renderProgress();
        showSection(n);
        showToast('Saved successfully!');
    }).catch(e => showToast('Save failed: ' + e.message, 'error'));
};

function showFirstIncompleteSection() {
    const order = ['personal','education','certifications','experience','skills','self','references','misc','compensation'];
    for (const s of order) {
        if (!progressData[s]) { showSection(s); return; }
    }
    showSection('personal');
}

// ============ LISTENERS ============
function attachListeners() {
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            showSection(item.dataset.section);
        });
    });

    const lb = document.getElementById('logoutBtn');
    if (lb) lb.addEventListener('click', async (e) => {
        e.preventDefault();
        if (!confirm('Logout?')) return;
        try {
            await saveProfile();
            sessionStorage.removeItem('hask_logged_in');
            await signOut(auth);
            window.location.replace('login.html');
        } catch (err) { alert(err.message); }
    });

    // Auto-save before unload
    window.addEventListener('beforeunload', () => {
        try { saveProfile(); } catch(e) {}
    });

    // Also on visibility change (mobile)
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) { try { saveProfile(); } catch(e) {} }
    });
}

// ============ APPLY DEFAULTS ============
function applyDefaults() {
    const p = profileData.personal || {};
    setVal('pTitle', p.title || '');
    setVal('pFullName', p.fullName || userData.name || '');
    setVal('pFatherName', p.fatherName || '');
    setVal('pNationality', p.nationality || 'Pakistan');
    let cnic = p.cnic || '';
    if (cnic && cnic.length === 13 && !cnic.includes('-')) {
        cnic = cnic.slice(0,5) + '-' + cnic.slice(5,12) + '-' + cnic.slice(12,13);
    }
    setVal('pCnic', cnic);
    setVal('pDob', p.dob || '');
    setVal('pGender', p.gender || '');

    if (p.interest) {
        const std = ['IT & Software','Sales & Marketing','Accounting & Finance','HR & Admin','Engineering','Education','Healthcare','Construction','Transport','Security','Hospitality','Retail','Manufacturing','Textile','Telecom','Other'];
        if (std.includes(p.interest)) {
            setVal('pInterest', p.interest);
            if (p.interest === 'Other') {
                document.getElementById('otherInterestField').style.display = 'flex';
                setVal('pOtherInterest', p.otherInterest || '');
            }
        } else {
            addCustomInterest(p.interest);
            setVal('pInterest', p.interest);
        }
    }

    setVal('pCountry', p.country || 'Pakistan');
    if (p.province) {
        setVal('pProvince', p.province);
        onProvinceChange();
        setTimeout(() => {
            setVal('pDomicile', p.domicile || '');
            setVal('pDistrict', p.district || '');
            onDistrictChange();
            setTimeout(() => { setVal('pTehsil', p.tehsil || ''); }, 60);
        }, 60);
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
    setVal('pAvailability', p.availability || '');
    document.getElementById('candidateId').textContent = userData.userId || '—';

    if (profileData.experience && profileData.experience.has === false) {
        const no = document.querySelector('input[name="hasExp"][value="no"]');
        if (no) no.checked = true;
    }

    // Self
    const sa = profileData.self || {};
    setVal('saTitle', sa.title || '');
    setVal('saObjective', sa.objective || '');
    setVal('saImprovements', sa.improvements || '');
    setVal('saSummary', sa.summary || '');

    // Strengths — from array or text
    selectedStrengths = Array.isArray(sa.strengthsList) && sa.strengthsList.length > 0
        ? sa.strengthsList.slice()
        : ((sa.strengths || '').split(/\n+/).map(s => s.trim()).filter(s => s));
    renderStrengthTags();
    setVal('saStrengths', selectedStrengths.join('\n'));

    setTimeout(() => {
        ['saObjective','saStrengths','saImprovements','saSummary'].forEach((id,i) => {
            const el = document.getElementById(id);
            const c = document.getElementById('c'+(i+1));
            if (el && c) c.textContent = el.value.length;
        });
    }, 100);

    // References
    const r = profileData.references || {};
    ['ref1Title','ref1Name','ref1Designation','ref1Org','ref1Phone','ref1Known','ref1Email',
     'ref2Title','ref2Name','ref2Designation','ref2Org','ref2Phone','ref2Known','ref2Email'].forEach(k => {
        setVal(k, r[k] || '');
    });

    // Misc
    const m = profileData.misc || {};
    setVal('mCrime', m.crime || 'No');
    setVal('mDisability', m.disability || 'No');
    setVal('mSource', m.source || 'Social Media');
    setVal('mLinkedin', m.linkedin || '');
    setVal('mBlood', m.blood || '');
    setVal('mMarital', m.marital || '');

    // Source Other
    if (m.source === 'Other') {
        setVal('mSource', 'Other');
        document.getElementById('sourceOtherField').style.display = 'flex';
        setVal('mSourceOther', m.sourceOther || '');
    }

    // Notice Period
    const noticeType = m.noticeType || 'Immediate';
    const noticeRadios = document.querySelectorAll('input[name="noticeType"]');
    noticeRadios.forEach(r => { r.checked = r.value === noticeType; });
    if (noticeType === 'Period') {
        document.getElementById('noticePeriodBox').style.display = 'block';
        setVal('mNoticeNum', m.noticeNum || 1);
        setVal('mNoticeUnit', m.noticeUnit || 'Day(s)');
    }

    // Religion
    const stdRel = ['Islam','Christianity','Hinduism','Sikhism','Buddhism'];
    if (m.religion && !stdRel.includes(m.religion) && m.religion !== '') {
        setVal('mReligion', 'Other');
        document.getElementById('religionOtherField').style.display = 'flex';
        setVal('mReligionOther', m.religion);
    } else { setVal('mReligion', m.religion || ''); }

    if (m.crime === 'Yes') {
        document.getElementById('crimeDetailsField').style.display = 'flex';
        setVal('mCrimeDetails', m.crimeDetails || '');
    }
    if (m.disability === 'Yes') {
        document.getElementById('disabilityDetailsField').style.display = 'flex';
        setVal('mDisabilityDetails', m.disabilityDetails || '');
    }

    // Compensation
    const c = profileData.compensation || {};
    setVal('cBasic', c.basic !== undefined ? c.basic : 0);
    setVal('cGross', c.gross !== undefined ? c.gross : 0);
    setVal('cExpected', c.expected !== undefined ? c.expected : 0);
    setVal('bonusCount', c.bonusCount || 1);
    setVal('medAmount', c.medAmount || 0);
    setVal('mobileAmount', c.mobileAmount || 0);
    setVal('transportAllowAmount', c.transportAllowAmount || 0);
    setVal('fuelAmount', c.fuelAmount || 0);
    setVal('fuelLiters', c.fuelLiters || 0);
    setVal('vehicleAllowAmount', c.vehicleAllowAmount || 0);
    setVal('vehicleType', c.vehicleType || '');
    setVal('vehicleRegNo', c.vehicleRegNo || '');
    setVal('vehicleBuyback', c.vehicleBuyback || 'No');
    setVal('buybackYears', c.buybackYears || 0);
    setVal('opdAmount', c.opdAmount || 0);
    setVal('leaveAnnual', c.leaveAnnual || 0);
    setVal('leaveCasual', c.leaveCasual || 0);
    setVal('leaveSick', c.leaveSick || 0);
    setVal('workingDays', c.workingDays || 5);
    setVal('otherBenefit', c.otherBenefit || '');

    // Radio state for compensation — already default, skip complex restore

    renderEducationTable();
    renderCertificationsTable();
    renderExperienceTable();
    renderSkillsTable();
    renderExpSummary();
    renderLanguages();

    if (c.vehicleProvided === 'Yes') {
        document.getElementById('vehicleProvidedDetails').style.display = 'flex';
        const r = document.querySelector('input[name="vehicleProvided"][value="Yes"]');
        if (r) r.checked = true;
    }
    if (c.transportAllow === 'Yes') {
        const r = document.querySelector('input[name="transportAllow"][value="Yes"]');
        if (r) r.checked = true;
        toggleTransportAllow(true);
    }
    if (c.vehicleAllow === 'Yes') {
        const r = document.querySelector('input[name="vehicleAllow"][value="Yes"]');
        if (r) r.checked = true;
        toggleVehicleAllow(true);
    }
}

function addCustomInterest(v) {
    const sel = document.getElementById('pInterest');
    if (!sel) return;
    if (Array.from(sel.options).some(o => o.value === v)) return;
    const other = Array.from(sel.options).find(o => o.value === 'Other');
    const o = document.createElement('option');
    o.value = v; o.textContent = v;
    if (other) sel.insertBefore(o, other); else sel.appendChild(o);
}

function setVal(id, v) { const el = document.getElementById(id); if (el) el.value = v === undefined || v === null ? '' : v; }
function getVal(id) { const el = document.getElementById(id); return el ? el.value.trim() : ''; }
function getEmail(id) { return getVal(id).toLowerCase(); }

// ============ TOGGLES ============
window.handleInterestChange = function() {
    const v = document.getElementById('pInterest').value;
    const f = document.getElementById('otherInterestField');
    const i = document.getElementById('pOtherInterest');
    if (v === 'Other') { f.style.display = 'flex'; i.setAttribute('required','required'); }
    else { f.style.display = 'none'; i.removeAttribute('required'); i.value = ''; }
};

window.toggleCrimeDetails = function() {
    const v = document.getElementById('mCrime').value;
    const f = document.getElementById('crimeDetailsField');
    const i = document.getElementById('mCrimeDetails');
    if (v === 'Yes') { f.style.display = 'flex'; i.setAttribute('required','required'); }
    else { f.style.display = 'none'; i.removeAttribute('required'); i.value = ''; }
};

window.toggleDisabilityDetails = function() {
    const v = document.getElementById('mDisability').value;
    const f = document.getElementById('disabilityDetailsField');
    const i = document.getElementById('mDisabilityDetails');
    if (v === 'Yes') { f.style.display = 'flex'; i.setAttribute('required','required'); }
    else { f.style.display = 'none'; i.removeAttribute('required'); i.value = ''; }
};

window.toggleReligionOther = function() {
    const v = document.getElementById('mReligion').value;
    const f = document.getElementById('religionOtherField');
    const i = document.getElementById('mReligionOther');
    if (v === 'Other') { f.style.display = 'flex'; i.setAttribute('required','required'); }
    else { f.style.display = 'none'; i.removeAttribute('required'); i.value = ''; }
};

window.toggleSourceOther = function() {
    const v = document.getElementById('mSource').value;
    const f = document.getElementById('sourceOtherField');
    const i = document.getElementById('mSourceOther');
    if (v === 'Other') { f.style.display = 'flex'; i.setAttribute('required','required'); }
    else { f.style.display = 'none'; i.removeAttribute('required'); i.value = ''; }
};

window.toggleNoticeType = function() {
    const val = document.querySelector('input[name="noticeType"]:checked').value;
    document.getElementById('noticePeriodBox').style.display = val === 'Period' ? 'block' : 'none';
};

window.toggleMed = function(s) { const el = document.getElementById('medAmount'); if (el) el.disabled = !s; };
window.toggleMobile = function(s) { const el = document.getElementById('mobileAmount'); if (el) el.disabled = !s; };
window.toggleFuel = function(s) {
    ['fuelAmount','fuelLiters'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.disabled = !s;
    });
};
window.toggleTransportAllow = function(s) { const el = document.getElementById('transportAllowAmount'); if (el) el.disabled = !s; };
window.toggleVehicleAllow = function(s) { const el = document.getElementById('vehicleAllowAmount'); if (el) el.disabled = !s; };
window.toggleVehicleProvided = function(s) {
    const box = document.getElementById('vehicleProvidedDetails');
    if (box) box.style.display = s ? 'flex' : 'none';
};

// ============ SAVE: PERSONAL ============
window.savePersonal = async function(e) {
    e.preventDefault();
    const btn = e.target.querySelector('.btn-save');
    btn.disabled = true; btn.textContent = 'Saving...';
    try {
        let int = getVal('pInterest'), other = '';
        if (int === 'Other') {
            other = getVal('pOtherInterest');
            if (!other) { showToast('Please specify interest', 'error'); btn.disabled = false; btn.textContent = 'Save & Continue →'; return; }
            addCustomInterest(other);
            int = other;
        }
        const pic = (profileData.personal && profileData.personal.profilePic) || '';
        profileData.personal = {
            title: getVal('pTitle'), fullName: getVal('pFullName'), fatherName: getVal('pFatherName'),
            nationality: getVal('pNationality'), cnic: getVal('pCnic').replace(/\D/g,''), dob: getVal('pDob'),
            gender: getVal('pGender'), interest: int, otherInterest: other,
            country: getVal('pCountry'), province: getVal('pProvince'), domicile: getVal('pDomicile'),
            district: getVal('pDistrict'), tehsil: getVal('pTehsil'), postalCode: getVal('pPostalCode'),
            address: getVal('pAddress'), permanentAddress: getVal('pPermanentAddress'),
            landline: getVal('pLandline'), cell: getVal('pCell'), email: getEmail('pEmail'),
            availability: getVal('pAvailability'),
            profilePic: pic
        };
        await saveProfile();
        updateProgress(); renderProgress(); renderSidebarUser();
        showToast('Personal details saved!');
        setTimeout(() => showSection('education'), 800);
    } catch (err) { showToast('Error: ' + err.message, 'error'); }
    finally { btn.disabled = false; btn.textContent = 'Save & Continue →'; }
};

// ============ SAVE: SELF ============
window.saveSelf = async function(e) {
    e.preventDefault();
    const btn = e.target.querySelector('.btn-save');
    btn.disabled = true; btn.textContent = 'Saving...';
    try {
        syncStrengthsToTextarea();
        profileData.self = {
            title: getVal('saTitle'),
            objective: getVal('saObjective'),
            strengthsList: selectedStrengths.slice(),
            strengths: selectedStrengths.join('\n'),
            improvements: getVal('saImprovements'),
            summary: getVal('saSummary')
        };
        await saveProfile();
        updateProgress(); renderProgress();
        showToast('Self assessment saved!');
        setTimeout(() => showSection('references'), 800);
    } catch (err) { showToast('Error: ' + err.message, 'error'); }
    finally { btn.disabled = false; btn.textContent = 'Save & Continue →'; }
};

// ============ SAVE: REFERENCES ============
window.saveReferences = async function(e) {
    e.preventDefault();
    const btn = e.target.querySelector('.btn-save');
    btn.disabled = true; btn.textContent = 'Saving...';
    try {
        profileData.references = {
            ref1Title: getVal('ref1Title'), ref1Name: getVal('ref1Name'), ref1Designation: getVal('ref1Designation'),
            ref1Org: getVal('ref1Org'), ref1Phone: getVal('ref1Phone'), ref1Known: getVal('ref1Known'), ref1Email: getEmail('ref1Email'),
            ref2Title: getVal('ref2Title'), ref2Name: getVal('ref2Name'), ref2Designation: getVal('ref2Designation'),
            ref2Org: getVal('ref2Org'), ref2Phone: getVal('ref2Phone'), ref2Known: getVal('ref2Known'), ref2Email: getEmail('ref2Email')
        };
        await saveProfile();
        updateProgress(); renderProgress();
        showToast('References saved!');
        setTimeout(() => showSection('misc'), 800);
    } catch (err) { showToast('Error: ' + err.message, 'error'); }
    finally { btn.disabled = false; btn.textContent = 'Save & Continue →'; }
};

// ============ SAVE: MISC ============
window.saveMisc = async function(e) {
    e.preventDefault();
    const btn = e.target.querySelector('.btn-save');
    btn.disabled = true; btn.textContent = 'Saving...';
    try {
        const crime = getVal('mCrime'), dis = getVal('mDisability'), rel = getVal('mReligion'), src = getVal('mSource');
        if (crime === 'Yes' && !getVal('mCrimeDetails')) { showToast('Crime details required', 'error'); btn.disabled = false; btn.textContent = 'Save & Continue →'; return; }
        if (dis === 'Yes' && !getVal('mDisabilityDetails')) { showToast('Disability details required', 'error'); btn.disabled = false; btn.textContent = 'Save & Continue →'; return; }
        if (rel === 'Other' && !getVal('mReligionOther')) { showToast('Religion required', 'error'); btn.disabled = false; btn.textContent = 'Save & Continue →'; return; }
        if (src === 'Other' && !getVal('mSourceOther')) { showToast('Source details required', 'error'); btn.disabled = false; btn.textContent = 'Save & Continue →'; return; }

        const noticeType = document.querySelector('input[name="noticeType"]:checked').value;

        profileData.misc = {
            crime, crimeDetails: crime === 'Yes' ? getVal('mCrimeDetails') : '',
            disability: dis, disabilityDetails: dis === 'Yes' ? getVal('mDisabilityDetails') : '',
            source: src, sourceOther: src === 'Other' ? getVal('mSourceOther') : '',
            noticeType: noticeType,
            noticeNum: noticeType === 'Period' ? getVal('mNoticeNum') : '',
            noticeUnit: noticeType === 'Period' ? getVal('mNoticeUnit') : '',
            linkedin: getVal('mLinkedin'), blood: getVal('mBlood'), marital: getVal('mMarital'),
            religion: rel === 'Other' ? getVal('mReligionOther') : rel,
            religionType: rel
        };
        await saveProfile();
        updateProgress(); renderProgress();
        showToast('Miscellaneous saved!');
        setTimeout(() => showSection('compensation'), 800);
    } catch (err) { showToast('Error: ' + err.message, 'error'); }
    finally { btn.disabled = false; btn.textContent = 'Save & Continue →'; }
};

// ============ SAVE: COMPENSATION ============
window.saveCompensation = async function(e) {
    e.preventDefault();
    const btn = e.target.querySelector('.btn-save');
    btn.disabled = true; btn.textContent = 'Saving...';
    try {
        const R = n => { const el = document.querySelector(`input[name="${n}"]:checked`); return el ? el.value : ''; };
        profileData.compensation = {
            basic: +getVal('cBasic')||0, gross: +getVal('cGross')||0, expected: +getVal('cExpected')||0,
            bonus: R('bonus'), bonusType: R('bonusType'), bonusCount: +getVal('bonusCount')||0,
            leave: R('leave'), medical: R('medical'), medAmount: +getVal('medAmount')||0,
            accom: R('accom'), mobile: R('mobile'), mobileAmount: +getVal('mobileAmount')||0,
            transportAllow: R('transportAllow'), transportAllowAmount: +getVal('transportAllowAmount')||0,
            companyTransport: R('companyTransport'),
            fuel: R('fuel'), fuelAmount: +getVal('fuelAmount')||0, fuelLiters: +getVal('fuelLiters')||0,
            vehicleAllow: R('vehicleAllow'), vehicleAllowAmount: +getVal('vehicleAllowAmount')||0,
            vehicleProvided: R('vehicleProvided'),
            vehicleType: getVal('vehicleType'), vehicleRegNo: getVal('vehicleRegNo'),
            vehicleBuyback: getVal('vehicleBuyback'), buybackYears: +getVal('buybackYears')||0,
            opd: R('opd'), opdAmount: +getVal('opdAmount')||0,
            health: R('health'), life: R('life'), pf: R('pf'),
            gratuity: R('gratuity'), gratuityType: R('gratuityType'), wppf: R('wppf'),
            leaveAnnual: +getVal('leaveAnnual')||0, leaveCasual: +getVal('leaveCasual')||0,
            leaveSick: +getVal('leaveSick')||0, workingDays: +getVal('workingDays')||0,
            otherBenefit: getVal('otherBenefit')
        };
        await saveProfile();
        updateProgress(); renderProgress();
        showToast('Compensation saved! Profile complete! 🎉');
    } catch (err) { showToast('Error: ' + err.message, 'error'); }
    finally { btn.disabled = false; btn.textContent = 'Save & Finish ✓'; }
};

// ============ EDUCATION ============
function renderEducationTable() {
    const tb = document.getElementById('educationTableBody');
    const list = profileData.education || [];
    if (!list.length) { tb.innerHTML = `<tr><td colspan="6" class="empty-row">No education added yet</td></tr>`; return; }
    tb.innerHTML = list.map((e,i) => `
        <tr>
            <td>${esc(e.level)}</td>
            <td>${esc(e.institution)}</td>
            <td>${esc(e.title)}</td>
            <td>${esc(e.date)}</td>
            <td>${esc(e.percentage||'-')}</td>
            <td>
                <button class="btn-edit" onclick="editEducation(${i})">✎</button>
                <button class="btn-delete" onclick="deleteEducation(${i})">✕</button>
            </td>
        </tr>
    `).join('');
}

window.openEducationModal = function() {
    editingEduIndex = null;
    document.getElementById('modalTitle').textContent = 'Add Education';
    document.getElementById('modalBody').innerHTML = `
        <form onsubmit="saveEducationEntry(event)">
            <div class="form-grid">
                <div class="field"><label>Degree Level <span class="req">*</span></label>
                    <select id="eduLevel" required>
                        <option value="">Select</option>
                        <option>Matriculation/O-Level</option><option>Intermediate/A-Level</option>
                        <option>Bachelor</option><option>Master</option><option>MPhil</option>
                        <option>PhD</option><option>Certification</option><option>Diploma</option>
                    </select>
                </div>
                <div class="field"><label>University/Institution <span class="req">*</span></label>
                    <select id="eduInstitution" onchange="handleUniChange()" required>
                        <option value="">Select University</option>
                        ${UNIVERSITIES.map(u => `<option value="${u}">${escA(u)}</option>`).join('')}
                    </select>
                </div>
                <div class="field" id="eduOtherUniField" style="display:none;">
                    <label>Enter Institution Name <span class="req">*</span></label>
                    <input type="text" id="eduOtherUni">
                </div>
                <div class="field"><label>Degree Title <span class="req">*</span></label><input type="text" id="eduTitle" required></div>
                <div class="field"><label>Completion Date <span class="req">*</span></label><input type="date" id="eduDate" required></div>
                <div class="field"><label>Percentage/CGPA</label><input type="text" id="eduPercentage"></div>
            </div>
            <div class="form-actions">
                <button type="button" class="btn-prev" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn-save">Save</button>
            </div>
        </form>
    `;
    openModal();
};

window.handleUniChange = function() {
    const v = document.getElementById('eduInstitution').value;
    const f = document.getElementById('eduOtherUniField');
    const i = document.getElementById('eduOtherUni');
    if (v === 'Other') { f.style.display = 'flex'; i.setAttribute('required','required'); }
    else { f.style.display = 'none'; i.removeAttribute('required'); i.value = ''; }
};

window.editEducation = function(i) {
    editingEduIndex = i;
    const e = profileData.education[i];
    const isCustom = !UNIVERSITIES.includes(e.institution) && e.institution;
    document.getElementById('modalTitle').textContent = 'Edit Education';
    document.getElementById('modalBody').innerHTML = `
        <form onsubmit="saveEducationEntry(event)">
            <div class="form-grid">
                <div class="field"><label>Degree Level <span class="req">*</span></label>
                    <select id="eduLevel" required>
                        ${['Matriculation/O-Level','Intermediate/A-Level','Bachelor','Master','MPhil','PhD','Certification','Diploma'].map(l => `<option ${e.level===l?'selected':''}>${l}</option>`).join('')}
                    </select>
                </div>
                <div class="field"><label>University/Institution <span class="req">*</span></label>
                    <select id="eduInstitution" onchange="handleUniChange()" required>
                        ${UNIVERSITIES.map(u => `<option value="${escA(u)}" ${u===e.institution?'selected':''}>${esc(u)}</option>`).join('')}
                        <option value="Other" ${isCustom?'selected':''}>Other</option>
                    </select>
                </div>
                <div class="field" id="eduOtherUniField" style="display:${isCustom?'flex':'none'};">
                    <label>Enter Institution Name <span class="req">*</span></label>
                    <input type="text" id="eduOtherUni" value="${isCustom?escA(e.institution):''}">
                </div>
                <div class="field"><label>Degree Title <span class="req">*</span></label><input type="text" id="eduTitle" value="${escA(e.title)}" required></div>
                <div class="field"><label>Completion Date <span class="req">*</span></label><input type="date" id="eduDate" value="${escA(e.date)}" required></div>
                <div class="field"><label>Percentage/CGPA</label><input type="text" id="eduPercentage" value="${escA(e.percentage)}"></div>
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
    if (inst === 'Other') {
        inst = getVal('eduOtherUni');
        if (!inst) { showToast('Please enter institution name', 'error'); return; }
    }
    const entry = {
        level: getVal('eduLevel'), institution: inst, title: getVal('eduTitle'),
        date: getVal('eduDate'), percentage: getVal('eduPercentage')
    };
    if (editingEduIndex === null) profileData.education.push(entry);
    else profileData.education[editingEduIndex] = entry;
    await saveProfile();
    renderEducationTable();
    updateProgress(); renderProgress();
    closeModal();
    showToast('Education saved!');
};

window.deleteEducation = async function(i) {
    if (!confirm('Delete?')) return;
    profileData.education.splice(i,1);
    await saveProfile();
    renderEducationTable();
    updateProgress(); renderProgress();
    showToast('Education deleted');
};

// ============ CERTIFICATIONS ============
function renderCertificationsTable() {
    const tb = document.getElementById('certificationsTableBody');
    const list = profileData.certifications || [];
    if (!list.length) { tb.innerHTML = `<tr><td colspan="5" class="empty-row">No certifications added yet</td></tr>`; return; }
    tb.innerHTML = list.map((c,i) => `
        <tr>
            <td>${esc(c.name)}</td><td>${esc(c.issuer)}</td><td>${esc(c.year)}</td>
            <td>${esc(c.certId||'-')}</td>
            <td>
                <button class="btn-edit" onclick="editCertification(${i})">✎</button>
                <button class="btn-delete" onclick="deleteCertification(${i})">✕</button>
            </td>
        </tr>
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
            <div class="form-actions">
                <button type="button" class="btn-prev" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn-save">Save</button>
            </div>
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
                <div class="field full"><label>Certificate Name <span class="req">*</span></label><input type="text" id="certName" value="${escA(c.name)}" required></div>
                <div class="field"><label>Issuing Authority <span class="req">*</span></label><input type="text" id="certIssuer" value="${escA(c.issuer)}" required></div>
                <div class="field"><label>Year <span class="req">*</span></label><input type="text" id="certYear" value="${escA(c.year)}" required></div>
                <div class="field"><label>Certificate ID</label><input type="text" id="certId" value="${escA(c.certId)}"></div>
            </div>
            <div class="form-actions">
                <button type="button" class="btn-prev" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn-save">Update</button>
            </div>
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
    renderCertificationsTable();
    updateProgress(); renderProgress();
    closeModal();
    showToast('Certification saved!');
};

window.deleteCertification = async function(i) {
    if (!confirm('Delete?')) return;
    profileData.certifications.splice(i,1);
    await saveProfile();
    renderCertificationsTable();
    updateProgress(); renderProgress();
    showToast('Certification deleted');
};

// ============ EXPERIENCE ============
function calculateDuration(j, l, isCurrent) {
    if (!j) return 0;
    const a = new Date(j);
    const b = isCurrent || !l ? new Date() : new Date(l);
    if (isNaN(a) || isNaN(b)) return 0;
    return Math.max(0, (b - a) / (1000 * 60 * 60 * 24 * 365.25));
}

function renderExperienceTable() {
    const tb = document.getElementById('experienceTableBody');
    const list = (profileData.experience && profileData.experience.entries) || [];
    if (!list.length) { tb.innerHTML = `<tr><td colspan="5" class="empty-row">No experience added yet</td></tr>`; return; }
    tb.innerHTML = list.map((e,i) => {
        const years = calculateDuration(e.joining, e.leaving, e.isCurrent).toFixed(1);
        const leaving = e.isCurrent ? 'Present' : (e.leaving || '—');
        return `
        <tr>
            <td>${esc(e.employer)}</td>
            <td>${esc(e.location || '-')}</td>
            <td>${esc(e.title)}</td>
            <td>${esc(e.joining||'—')} – ${esc(leaving)}<br><small style="color:#28a745;font-weight:600;">${years} yrs</small></td>
            <td>
                <button class="btn-edit" onclick="editExperience(${i})">✎</button>
                <button class="btn-delete" onclick="deleteExperience(${i})">✕</button>
            </td>
        </tr>
    `}).join('');
    renderExpSummary();
}

function renderExpSummary() {
    const list = (profileData.experience && profileData.experience.entries) || [];
    const box = document.getElementById('expSummaryBox');
    const totalEl = document.getElementById('expTotalYears');
    const listEl = document.getElementById('expSummaryList');
    if (!box) return;
    if (list.length === 0) { box.style.display = 'none'; return; }
    box.style.display = 'block';

    let total = 0;
    const indMap = {};
    list.forEach(e => {
        const y = calculateDuration(e.joining, e.leaving, e.isCurrent);
        total += y;
        const ind = e.industry || 'Other';
        indMap[ind] = (indMap[ind] || 0) + y;
    });

    totalEl.textContent = `Total: ${total.toFixed(1)} years`;
    const tags = Object.entries(indMap).sort((a,b) => b[1]-a[1])
        .map(([ind, y]) => `<span class="exp-industry-tag"><strong>${esc(ind)}:</strong> ${y.toFixed(1)} yrs</span>`)
        .join('');
    listEl.innerHTML = tags || '<span style="color:#888;font-style:italic;">No industry data</span>';
}

window.toggleExperience = function(h) {
    if (!profileData.experience) profileData.experience = { has: true, entries: [] };
    profileData.experience.has = h;
};

window.openExperienceModal = function() {
    editingExpIndex = null;
    document.getElementById('modalTitle').textContent = 'Add Job Detail';
    document.getElementById('modalBody').innerHTML = `
        <form onsubmit="saveExperienceEntry(event)">
            <div class="form-grid">
                <div class="field"><label>Employer <span class="req">*</span></label><input type="text" id="expEmployer" required></div>
                <div class="field"><label>Employer City/District <span class="req">*</span></label><input type="text" id="expLocation" placeholder="e.g. Sheikhupura" required></div>
                <div class="field"><label>Industry <span class="req">*</span></label>
                    <select id="expIndustry" required>
                        <option value="">Select Industry</option>
                        ${INDUSTRIES.map(i => `<option value="${escA(i)}">${esc(i)}</option>`).join('')}
                    </select>
                </div>
                <div class="field"><label>Manager's Name</label><input type="text" id="expManager"></div>
                <div class="field"><label>Job Title <span class="req">*</span></label><input type="text" id="expTitle" required></div>
                <div class="field"><label>Joining Date <span class="req">*</span></label><input type="date" id="expJoining" required></div>
                <div class="field">
                    <label>Leaving Date</label>
                    <input type="date" id="expLeaving">
                    <label class="radio-label" style="margin-top:6px;">
                        <input type="checkbox" id="expCurrent" onchange="toggleCurrentEmployer()"> 
                        <span>Current Employer</span>
                    </label>
                </div>
                <div class="field">
                    <label>Contact Employer?</label>
                    <select id="expContact" onchange="toggleContactInfo()">
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                    </select>
                </div>
            </div>

            <div id="contactInfoBox" style="display:none; background:#f8f9fc; padding:16px; border-radius:8px; margin-top:12px; border:1px solid #eef1f5;">
                <h4 class="sub-heading" style="margin-top:0;">Contact Person Info</h4>
                <div class="form-grid">
                    <div class="field"><label>Contact Name <span class="req">*</span></label><input type="text" id="expContactName"></div>
                    <div class="field"><label>Contact Title <span class="req">*</span></label><input type="text" id="expContactTitle"></div>
                    <div class="field"><label>Contact Mobile <span class="req">*</span></label><input type="tel" id="expContactPhone" placeholder="0300-8195675" maxlength="12"></div>
                </div>
            </div>

            <div class="field full" style="margin-top:12px;">
                <label>Job Description / Key Responsibilities (Optional)</label>
                <textarea id="expDescription" rows="4" maxlength="1000" placeholder="• Managed payroll for 200+ employees&#10;• Handled recruitment"></textarea>
                <small class="char-count"><span id="expDescCount">0</span> / 1000 characters</small>
            </div>
            <div class="form-actions">
                <button type="button" class="btn-prev" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn-save">Save</button>
            </div>
        </form>
    `;
    const ta = document.getElementById('expDescription');
    if (ta) ta.addEventListener('input', () => { document.getElementById('expDescCount').textContent = ta.value.length; });
    openModal();
};

window.toggleCurrentEmployer = function() {
    const cb = document.getElementById('expCurrent');
    const l = document.getElementById('expLeaving');
    if (cb.checked) { l.disabled = true; l.value = ''; l.style.background = '#f5f7fa'; }
    else { l.disabled = false; l.style.background = ''; }
};

window.toggleContactInfo = function() {
    const v = document.getElementById('expContact').value;
    const box = document.getElementById('contactInfoBox');
    const n = document.getElementById('expContactName');
    const t = document.getElementById('expContactTitle');
    const p = document.getElementById('expContactPhone');
    if (v === 'Yes') {
        box.style.display = 'block';
        n.setAttribute('required','required');
        t.setAttribute('required','required');
        p.setAttribute('required','required');
    } else {
        box.style.display = 'none';
        n.removeAttribute('required');
        t.removeAttribute('required');
        p.removeAttribute('required');
        n.value = ''; t.value = ''; p.value = '';
    }
};

window.editExperience = function(i) {
    editingExpIndex = i;
    const e = profileData.experience.entries[i];
    document.getElementById('modalTitle').textContent = 'Edit Job Detail';
    document.getElementById('modalBody').innerHTML = `
        <form onsubmit="saveExperienceEntry(event)">
            <div class="form-grid">
                <div class="field"><label>Employer <span class="req">*</span></label><input type="text" id="expEmployer" value="${escA(e.employer)}" required></div>
                <div class="field"><label>Employer City/District <span class="req">*</span></label><input type="text" id="expLocation" value="${escA(e.location)}" required></div>
                <div class="field"><label>Industry <span class="req">*</span></label>
                    <select id="expIndustry" required>
                        <option value="">Select</option>
                        ${INDUSTRIES.map(i => `<option value="${escA(i)}" ${e.industry===i?'selected':''}>${esc(i)}</option>`).join('')}
                    </select>
                </div>
                <div class="field"><label>Manager's Name</label><input type="text" id="expManager" value="${escA(e.manager)}"></div>
                <div class="field"><label>Job Title <span class="req">*</span></label><input type="text" id="expTitle" value="${escA(e.title)}" required></div>
                <div class="field"><label>Joining Date <span class="req">*</span></label><input type="date" id="expJoining" value="${escA(e.joining)}" required></div>
                <div class="field">
                    <label>Leaving Date</label>
                    <input type="date" id="expLeaving" value="${escA(e.leaving)}" ${e.isCurrent?'disabled':''}>
                    <label class="radio-label" style="margin-top:6px;">
                        <input type="checkbox" id="expCurrent" onchange="toggleCurrentEmployer()" ${e.isCurrent?'checked':''}> 
                        <span>Current Employer</span>
                    </label>
                </div>
                <div class="field">
                    <label>Contact Employer?</label>
                    <select id="expContact" onchange="toggleContactInfo()">
                        <option value="No" ${e.contact==='No'?'selected':''}>No</option>
                        <option value="Yes" ${e.contact==='Yes'?'selected':''}>Yes</option>
                    </select>
                </div>
            </div>

            <div id="contactInfoBox" style="display:${e.contact==='Yes'?'block':'none'}; background:#f8f9fc; padding:16px; border-radius:8px; margin-top:12px; border:1px solid #eef1f5;">
                <h4 class="sub-heading" style="margin-top:0;">Contact Person Info</h4>
                <div class="form-grid">
                    <div class="field"><label>Contact Name <span class="req">*</span></label><input type="text" id="expContactName" value="${escA(e.contactName)}"></div>
                    <div class="field"><label>Contact Title <span class="req">*</span></label><input type="text" id="expContactTitle" value="${escA(e.contactTitle)}"></div>
                    <div class="field"><label>Contact Mobile <span class="req">*</span></label><input type="tel" id="expContactPhone" value="${escA(e.contactPhone)}" maxlength="12"></div>
                </div>
            </div>

            <div class="field full" style="margin-top:12px;">
                <label>Job Description (Optional)</label>
                <textarea id="expDescription" rows="4" maxlength="1000">${esc(e.description||'')}</textarea>
                <small class="char-count"><span id="expDescCount">${(e.description||'').length}</span> / 1000</small>
            </div>
            <div class="form-actions">
                <button type="button" class="btn-prev" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn-save">Update</button>
            </div>
        </form>
    `;
    const ta = document.getElementById('expDescription');
    if (ta) ta.addEventListener('input', () => { document.getElementById('expDescCount').textContent = ta.value.length; });
    if (e.contact === 'Yes') {
        ['expContactName','expContactTitle','expContactPhone'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.setAttribute('required','required');
        });
    }
    openModal();
};

window.saveExperienceEntry = async function(e) {
    e.preventDefault();
    const isCurrent = document.getElementById('expCurrent')?.checked || false;
    const contactYes = getVal('expContact') === 'Yes';
    if (contactYes) {
        if (!getVal('expContactName') || !getVal('expContactTitle') || !getVal('expContactPhone')) {
            showToast('Please fill contact person info', 'error'); return;
        }
    }
    const entry = {
        employer: getVal('expEmployer'), location: getVal('expLocation'), industry: getVal('expIndustry'),
        manager: getVal('expManager'), title: getVal('expTitle'),
        joining: getVal('expJoining'), leaving: isCurrent ? '' : getVal('expLeaving'),
        isCurrent, contact: getVal('expContact'),
        contactName: contactYes ? getVal('expContactName') : '',
        contactTitle: contactYes ? getVal('expContactTitle') : '',
        contactPhone: contactYes ? getVal('expContactPhone') : '',
        description: getVal('expDescription')
    };
    if (!profileData.experience) profileData.experience = { has: true, entries: [] };
    if (!profileData.experience.entries) profileData.experience.entries = [];
    if (editingExpIndex === null) profileData.experience.entries.push(entry);
    else profileData.experience.entries[editingExpIndex] = entry;
    await saveProfile();
    renderExperienceTable();
    updateProgress(); renderProgress();
    closeModal();
    showToast('Experience saved!');
};

window.deleteExperience = async function(i) {
    if (!confirm('Delete?')) return;
    profileData.experience.entries.splice(i,1);
    await saveProfile();
    renderExperienceTable();
    updateProgress(); renderProgress();
    showToast('Experience deleted');
};

// ============ SKILLS ============
function renderSkillsTable() {
    const tb = document.getElementById('skillsTableBody');
    const list = profileData.skills || [];
    if (!list.length) { tb.innerHTML = `<tr><td colspan="4" class="empty-row">No skills added yet</td></tr>`; return; }
    tb.innerHTML = list.map((s,i) => `
        <tr>
            <td>${esc(s.name)}</td>
            <td>${esc(s.level)}</td>
            <td>${esc(s.description)}</td>
            <td>
                <button class="btn-edit" onclick="editSkill(${i})">✎</button>
                <button class="btn-delete" onclick="deleteSkill(${i})">✕</button>
            </td>
        </tr>
    `).join('');
}

window.filterSkillSuggestions = function() {
    const q = getVal('skillSearch').toLowerCase();
    const box = document.getElementById('skillSuggestions');
    if (!q) { box.classList.remove('show'); return; }
    const existing = (profileData.skills || []).map(s => s.name.toLowerCase());
    const matches = SKILLS_DB.filter(s => s.toLowerCase().includes(q) && !existing.includes(s.toLowerCase())).slice(0, 15);
    if (matches.length === 0) {
        box.innerHTML = `<div class="skill-suggestion-empty">No matches. Click "Add Custom Skill" to add "${esc(q)}"</div>`;
    } else {
        box.innerHTML = matches.map(s => `
            <div class="skill-suggestion-item" onclick="quickAddSkill('${escA(s)}')">
                <span>${esc(s)}</span><span class="add-icon">+ Add</span>
            </div>
        `).join('');
    }
    box.classList.add('show');
};

window.quickAddSkill = async function(s) {
    if (!profileData.skills) profileData.skills = [];
    profileData.skills.push({ name: s, level: 'Intermediate', description: '' });
    await saveProfile();
    document.getElementById('skillSearch').value = '';
    document.getElementById('skillSuggestions').classList.remove('show');
    renderSkillsTable();
    updateProgress(); renderProgress();
    showToast(`Skill "${s}" added`);
};

document.addEventListener('click', function(e) {
    const box = document.getElementById('skillSuggestions');
    const wrap = document.querySelector('.skills-search-wrap');
    if (box && wrap && !wrap.contains(e.target)) box.classList.remove('show');
});

window.openSkillModal = function() {
    editingSkillIndex = null;
    document.getElementById('modalTitle').textContent = 'Add Custom Skill';
    document.getElementById('modalBody').innerHTML = `
        <form onsubmit="saveSkillEntry(event)">
            <div class="form-grid">
                <div class="field"><label>Skill Name <span class="req">*</span></label><input type="text" id="skillName" required></div>
                <div class="field"><label>Skill Level <span class="req">*</span></label>
                    <select id="skillLevel" required><option>Beginner</option><option>Intermediate</option><option selected>Expert</option></select>
                </div>
                <div class="field full"><label>Description</label><input type="text" id="skillDesc"></div>
            </div>
            <div class="form-actions">
                <button type="button" class="btn-prev" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn-save">Save</button>
            </div>
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
                <div class="field"><label>Skill Name <span class="req">*</span></label><input type="text" id="skillName" value="${escA(s.name)}" required></div>
                <div class="field"><label>Skill Level <span class="req">*</span></label>
                    <select id="skillLevel">
                        <option ${s.level==='Beginner'?'selected':''}>Beginner</option>
                        <option ${s.level==='Intermediate'?'selected':''}>Intermediate</option>
                        <option ${s.level==='Expert'?'selected':''}>Expert</option>
                    </select>
                </div>
                <div class="field full"><label>Description</label><input type="text" id="skillDesc" value="${escA(s.description)}"></div>
            </div>
            <div class="form-actions">
                <button type="button" class="btn-prev" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn-save">Update</button>
            </div>
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
    renderSkillsTable();
    updateProgress(); renderProgress();
    closeModal();
    showToast('Skill saved!');
};

window.deleteSkill = async function(i) {
    if (!confirm('Delete?')) return;
    profileData.skills.splice(i,1);
    await saveProfile();
    renderSkillsTable();
    updateProgress(); renderProgress();
    showToast('Skill deleted');
};

// ============ LANGUAGES ============
function renderLanguages() {
    const grid = document.getElementById('languagesGrid');
    if (!grid) return;
    const saved = profileData.languages || [];
    grid.innerHTML = LANGUAGES.map(l => {
        const checked = saved.includes(l);
        return `
            <label class="lang-checkbox ${checked?'checked':''}">
                <input type="checkbox" value="${escA(l)}" ${checked?'checked':''} onchange="toggleLanguage(this)">
                <span>${esc(l)}</span>
            </label>
        `;
    }).join('');
}

window.toggleLanguage = async function(cb) {
    const label = cb.closest('.lang-checkbox');
    if (cb.checked) label.classList.add('checked');
    else label.classList.remove('checked');
    const sel = Array.from(document.querySelectorAll('#languagesGrid input:checked')).map(c => c.value);
    profileData.languages = sel;
    await saveProfile();
    updateProgress(); renderProgress();
};

// ============ MODAL ============
function openModal() { document.getElementById('modalOverlay').classList.add('show'); }
window.closeModal = function() { document.getElementById('modalOverlay').classList.remove('show'); };

// ============ CHAR COUNTERS ============
function attachCharCounters() {
    [['saObjective','c1'],['saStrengths','c2'],['saImprovements','c3'],['saSummary','c4']].forEach(([id,cid]) => {
        const i = document.getElementById(id), c = document.getElementById(cid);
        if (i && c) i.addEventListener('input', () => { c.textContent = i.value.length; });
    });
}

// ============ HELPERS ============
function esc(s) { if (!s) return ''; return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]); }
function escA(s) { if (!s) return ''; return String(s).replace(/["'&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]); }

// ============ DIRECT DOWNLOAD ============
window.directDownloadCV = async function() {
    showToast('Preparing your CV...', 'info');
    try { await saveProfile(); } catch(e) {}
    setTimeout(() => { window.open('cv.html?download=1', '_blank'); }, 500);
};

// ============ EXPOSE FOR CV.JS ============
window.generateAITitle = function(profile) {
    // Kept for backward compatibility (cv.js has its own)
};

console.log('✅ Profile.js (Final) loaded');
