/* ============================================
   HASK TalentConnect - Profile JavaScript
   Complete Bestway-style Profile System
   ============================================ */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { 
    getAuth, 
    onAuthStateChanged, 
    signOut 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { 
    getFirestore, 
    doc, 
    getDoc, 
    setDoc, 
    updateDoc 
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

// ============================================
// GLOBAL STATE
// ============================================
let currentUser = null;
let userData = null;
let profileData = {
    personal: null,
    education: [],
    experience: { has: true, overall: 0, industry: 0, entries: [] },
    skills: [],
    self: null,
    references: null,
    misc: null,
    compensation: null
};
let progressData = {
    personal: false,
    education: false,
    experience: false,
    skills: false,
    self: false,
    references: false,
    misc: false,
    compensation: false
};

// Modal editing indices
let editingEduIndex = null;
let editingExpIndex = null;
let editingSkillIndex = null;

// ============================================
// INITIALIZE
// ============================================
onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.replace('login.html?redirect=' + encodeURIComponent('profile.html'));
        return;
    }

    currentUser = user;

    // Load user basic info
    try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
            userData = userDoc.data();
        } else {
            userData = { name: user.displayName || 'User', email: user.email, role: 'seeker' };
        }
    } catch (e) {
        userData = { name: user.displayName || 'User', email: user.email };
    }

    // Load profile data
    await loadProfile();

    // Render everything
    renderSidebarUser();
    renderSidebarChecks();
    renderProgress();

    // Set defaults
    applyDefaults();

    // Listeners
    attachListeners();

    // Character counters
    attachCharCounters();

    // Show first incomplete section or first section
    showFirstIncompleteSection();
});

// ============================================
// LOAD PROFILE FROM FIRESTORE
// ============================================
async function loadProfile() {
    try {
        const profileRef = doc(db, "profiles", currentUser.uid);
        const snap = await getDoc(profileRef);

        if (snap.exists()) {
            const data = snap.data();
            profileData = {
                personal: data.personal || null,
                education: data.education || [],
                experience: data.experience || { has: true, overall: 0, industry: 0, entries: [] },
                skills: data.skills || [],
                self: data.self || null,
                references: data.references || null,
                misc: data.misc || null,
                compensation: data.compensation || null
            };
            updateProgress();
        }
    } catch (e) {
        console.warn("Profile load error:", e);
    }
}

// ============================================
// SAVE PROFILE TO FIRESTORE
// ============================================
async function saveProfile() {
    if (!currentUser) return;

    try {
        const profileRef = doc(db, "profiles", currentUser.uid);
        await setDoc(profileRef, {
            ...profileData,
            userId: currentUser.uid,
            userName: userData.name,
            userEmail: userData.email,
            updatedAt: new Date().toISOString()
        }, { merge: true });
    } catch (e) {
        console.error("Save error:", e);
        throw e;
    }
}

// ============================================
// SIDEBAR USER
// ============================================
function renderSidebarUser() {
    const nameEl = document.getElementById('sidebarName');
    const idEl = document.getElementById('sidebarId');
    const avatarEl = document.getElementById('sidebarAvatar');

    const name = userData.name || 'User';
    const initials = name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

    nameEl.textContent = name;
    avatarEl.textContent = initials;
    idEl.textContent = '🆔 ' + (userData.userId || '—');
}

// ============================================
// PROGRESS CALCULATION
// ============================================
function updateProgress() {
    const p = profileData;

    // Personal: check all required fields
    progressData.personal = !!(p.personal &&
        p.personal.fullName && p.personal.fatherName &&
        p.personal.cnic && p.personal.dob &&
        p.personal.gender && p.personal.cell &&
        p.personal.email && p.personal.address &&
        p.personal.domicile && p.personal.city);

    // Education: at least 1 entry
    progressData.education = p.education && p.education.length > 0;

    // Experience: if "no" experience, still counts as complete; else at least 1 entry
    progressData.experience = p.experience && (
        p.experience.has === false ||
        (p.experience.entries && p.experience.entries.length > 0)
    );

    // Skills: at least 1 skill
    progressData.skills = p.skills && p.skills.length > 0;

    // Self Assessment
    progressData.self = !!(p.self &&
        p.self.objective && p.self.strengths &&
        p.self.improvements && p.self.summary);

    // References
    progressData.references = !!(p.references &&
        p.references.ref1Name && p.references.ref1Email &&
        p.references.ref2Name && p.references.ref2Email);

    // Misc
    progressData.misc = !!(p.misc &&
        p.misc.crime && p.misc.relatives &&
        p.misc.disability && p.misc.source);

    // Compensation
    progressData.compensation = !!(p.compensation &&
        p.compensation.basic !== undefined &&
        p.compensation.gross !== undefined &&
        p.compensation.expected !== undefined);
}

function renderProgress() {
    const sections = ['personal', 'education', 'experience', 'skills', 'self', 'references', 'misc', 'compensation'];
    const completed = sections.filter(s => progressData[s]).length;
    const total = sections.length;
    const percent = Math.round((completed / total) * 100);

    document.getElementById('progressPercent').textContent = percent + '%';
    document.getElementById('progressBarFill').style.width = percent + '%';

    // Show green checkmarks
    sections.forEach(s => {
        const item = document.querySelector(`.menu-item[data-section="${s}"]`);
        const checkBox = document.getElementById('check-' + s);
        if (progressData[s]) {
            item.classList.add('completed');
            checkBox.textContent = '✅';
        } else {
            item.classList.remove('completed');
            checkBox.textContent = '⬜';
        }
    });
}

function renderSidebarChecks() {
    updateProgress();
    renderProgress();
}

// ============================================
// SECTION NAVIGATION
// ============================================
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.profile-section').forEach(s => s.classList.remove('active'));
    // Show target
    const target = document.getElementById('section-' + sectionName);
    if (target) target.classList.add('active');

    // Update menu active state
    document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));
    const menuItem = document.querySelector(`.menu-item[data-section="${sectionName}"]`);
    if (menuItem) menuItem.classList.add('active');

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.goToSection = showSection;

window.nextSection = function(nextName) {
    saveProfile()
        .then(() => {
            updateProgress();
            renderProgress();
            showSection(nextName);
        })
        .catch(e => showMessage('❌ Save failed: ' + e.message, 'error'));
};

function showFirstIncompleteSection() {
    const order = ['personal', 'education', 'experience', 'skills', 'self', 'references', 'misc', 'compensation'];
    for (const s of order) {
        if (!progressData[s]) {
            showSection(s);
            return;
        }
    }
    showSection('personal');
}

// ============================================
// ATTACH LISTENERS
// ============================================
function attachListeners() {
    // Sidebar menu clicks
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const section = item.dataset.section;
            showSection(section);
        });
    });

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', async (e) => {
        e.preventDefault();
        if (!confirm('Logout from your account?')) return;
        try {
            sessionStorage.removeItem('hask_logged_in');
            await signOut(auth);
            window.location.replace('login.html');
        } catch (err) {
            alert('Error: ' + err.message);
        }
    });
}

// ============================================
// APPLY DEFAULTS (fill forms from data)
// ============================================
function applyDefaults() {
    // Personal
    const p = profileData.personal || {};
    setVal('pTitle', p.title || '');
    setVal('pFullName', p.fullName || userData.name || '');
    setVal('pFatherName', p.fatherName || '');
    setVal('pNationality', p.nationality || 'Pakistan');
    setVal('pCnic', p.cnic || '');
    setVal('pDob', p.dob || '');
    setVal('pGender', p.gender || '');
    setVal('pInterest', p.interest || '');
    setVal('pOtherInterest', p.otherInterest || '');
    setVal('pDomicile', p.domicile || '');
    setVal('pAddress', p.address || '');
    setVal('pCountry', p.country || 'Pakistan');
    setVal('pCity', p.city || '');
    setVal('pTehsil', p.tehsil || '');
    setVal('pPostalCode', p.postalCode || '');
    setVal('pLandline', p.landline || '');
    setVal('pCell', p.cell || '');
    setVal('pEmail', p.email || userData.email || '');

    // Candidate ID
    document.getElementById('candidateId').textContent = userData.userId || '—';

    // Experience
    const exp = profileData.experience || {};
    setVal('overallExp', exp.overall || 0);
    setVal('industryExp', exp.industry || 0);
    if (exp.has === false) {
        document.querySelector('input[name="hasExp"][value="no"]').checked = true;
    }

    // Self
    const sa = profileData.self || {};
    setVal('saObjective', sa.objective || '');
    setVal('saStrengths', sa.strengths || '');
    setVal('saImprovements', sa.improvements || '');
    setVal('saSummary', sa.summary || '');

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
    setVal('mRelatives', m.relatives || 'No');
    setVal('mDisability', m.disability || 'No');
    setVal('mSource', m.source || 'Social Media');
    setVal('mNoticeNum', m.noticeNum || 1);
    setVal('mNoticeUnit', m.noticeUnit || 'Month');
    setVal('mLinkedin', m.linkedin || '');
    setVal('mBlood', m.blood || '');
    setVal('mMarital', m.marital || '');
    setVal('mReligion', m.religion || '');

    // Compensation
    const c = profileData.compensation || {};
    setVal('cBasic', c.basic !== undefined ? c.basic : 0);
    setVal('cGross', c.gross !== undefined ? c.gross : 0);
    setVal('cExpected', c.expected !== undefined ? c.expected : 0);
    setVal('bonusCount', c.bonusCount || 1);
    setVal('medAmount', c.medAmount || 0);
    setVal('fuelAmount', c.fuelAmount || 0);
    setVal('fuelLiters', c.fuelLiters || 0);
    setVal('vehicleDetail', c.vehicleDetail || '');
    setVal('buybackYears', c.buybackYears || 3);
    setVal('mobileAmount', c.mobileAmount || 0);
    setVal('opdAmount', c.opdAmount || 0);
    setVal('leaveAnnual', c.leaveAnnual || 0);
    setVal('leaveCasual', c.leaveCasual || 0);
    setVal('leaveSick', c.leaveSick || 0);
    setVal('workingDays', c.workingDays || 5);
    setVal('otherBenefit', c.otherBenefit || '');

    // Render tables
    renderEducationTable();
    renderExperienceTable();
    renderSkillsTable();
}

function setVal(id, value) {
    const el = document.getElementById(id);
    if (el) el.value = value || '';
}

function getVal(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : '';
}

// ============================================
// SAVE: PERSONAL
// ============================================
window.savePersonal = async function(e) {
    e.preventDefault();
    const btn = e.target.querySelector('.btn-save');
    btn.disabled = true;
    btn.textContent = 'Saving...';

    try {
        profileData.personal = {
            title: getVal('pTitle'),
            fullName: getVal('pFullName'),
            fatherName: getVal('pFatherName'),
            nationality: getVal('pNationality'),
            cnic: getVal('pCnic'),
            dob: getVal('pDob'),
            gender: getVal('pGender'),
            interest: getVal('pInterest'),
            otherInterest: getVal('pOtherInterest'),
            domicile: getVal('pDomicile'),
            address: getVal('pAddress'),
            country: getVal('pCountry'),
            city: getVal('pCity'),
            tehsil: getVal('pTehsil'),
            postalCode: getVal('pPostalCode'),
            landline: getVal('pLandline'),
            cell: getVal('pCell'),
            email: getVal('pEmail')
        };

        await saveProfile();
        updateProgress();
        renderProgress();
        showMessage('✅ Personal details saved!', 'success');
        setTimeout(() => showSection('education'), 500);
    } catch (err) {
        showMessage('❌ ' + err.message, 'error');
    } finally {
        btn.disabled = false;
        btn.textContent = 'Save & Continue →';
    }
};

// ============================================
// SAVE: SELF ASSESSMENT
// ============================================
window.saveSelf = async function(e) {
    e.preventDefault();
    const btn = e.target.querySelector('.btn-save');
    btn.disabled = true;
    btn.textContent = 'Saving...';

    try {
        profileData.self = {
            objective: getVal('saObjective'),
            strengths: getVal('saStrengths'),
            improvements: getVal('saImprovements'),
            summary: getVal('saSummary')
        };
        await saveProfile();
        updateProgress();
        renderProgress();
        showMessage('✅ Self assessment saved!', 'success');
        setTimeout(() => showSection('references'), 500);
    } catch (err) {
        showMessage('❌ ' + err.message, 'error');
    } finally {
        btn.disabled = false;
        btn.textContent = 'Save & Continue →';
    }
};

// ============================================
// SAVE: REFERENCES
// ============================================
window.saveReferences = async function(e) {
    e.preventDefault();
    const btn = e.target.querySelector('.btn-save');
    btn.disabled = true;
    btn.textContent = 'Saving...';

    try {
        profileData.references = {
            ref1Title: getVal('ref1Title'),
            ref1Name: getVal('ref1Name'),
            ref1Designation: getVal('ref1Designation'),
            ref1Org: getVal('ref1Org'),
            ref1Phone: getVal('ref1Phone'),
            ref1Known: getVal('ref1Known'),
            ref1Email: getVal('ref1Email'),
            ref2Title: getVal('ref2Title'),
            ref2Name: getVal('ref2Name'),
            ref2Designation: getVal('ref2Designation'),
            ref2Org: getVal('ref2Org'),
            ref2Phone: getVal('ref2Phone'),
            ref2Known: getVal('ref2Known'),
            ref2Email: getVal('ref2Email')
        };
        await saveProfile();
        updateProgress();
        renderProgress();
        showMessage('✅ References saved!', 'success');
        setTimeout(() => showSection('misc'), 500);
    } catch (err) {
        showMessage('❌ ' + err.message, 'error');
    } finally {
        btn.disabled = false;
        btn.textContent = 'Save & Continue →';
    }
};

// ============================================
// SAVE: MISCELLANEOUS
// ============================================
window.saveMisc = async function(e) {
    e.preventDefault();
    const btn = e.target.querySelector('.btn-save');
    btn.disabled = true;
    btn.textContent = 'Saving...';

    try {
        profileData.misc = {
            crime: getVal('mCrime'),
            relatives: getVal('mRelatives'),
            disability: getVal('mDisability'),
            source: getVal('mSource'),
            noticeNum: getVal('mNoticeNum'),
            noticeUnit: getVal('mNoticeUnit'),
            linkedin: getVal('mLinkedin'),
            blood: getVal('mBlood'),
            marital: getVal('mMarital'),
            religion: getVal('mReligion')
        };
        await saveProfile();
        updateProgress();
        renderProgress();
        showMessage('✅ Miscellaneous saved!', 'success');
        setTimeout(() => showSection('compensation'), 500);
    } catch (err) {
        showMessage('❌ ' + err.message, 'error');
    } finally {
        btn.disabled = false;
        btn.textContent = 'Save & Continue →';
    }
};

// ============================================
// SAVE: COMPENSATION
// ============================================
window.saveCompensation = async function(e) {
    e.preventDefault();
    const btn = e.target.querySelector('.btn-save');
    btn.disabled = true;
    btn.textContent = 'Saving...';

    try {
        const getRadio = (name) => {
            const el = document.querySelector(`input[name="${name}"]:checked`);
            return el ? el.value : '';
        };

        profileData.compensation = {
            basic: Number(getVal('cBasic')) || 0,
            gross: Number(getVal('cGross')) || 0,
            expected: Number(getVal('cExpected')) || 0,
            bonus: getRadio('bonus'),
            bonusType: getRadio('bonusType'),
            bonusCount: Number(getVal('bonusCount')) || 0,
            leave: getRadio('leave'),
            medical: getRadio('medical'),
            medAmount: Number(getVal('medAmount')) || 0,
            transport: getRadio('transport'),
            fuel: getRadio('fuel'),
            fuelAmount: Number(getVal('fuelAmount')) || 0,
            fuelLiters: Number(getVal('fuelLiters')) || 0,
            accom: getRadio('accom'),
            vehicle: getRadio('vehicle'),
            vehicleDetail: getVal('vehicleDetail'),
            buyback: getRadio('buyback'),
            buybackYears: Number(getVal('buybackYears')) || 0,
            mobile: getRadio('mobile'),
            mobileAmount: Number(getVal('mobileAmount')) || 0,
            opd: getRadio('opd'),
            opdAmount: Number(getVal('opdAmount')) || 0,
            health: getRadio('health'),
            life: getRadio('life'),
            pf: getRadio('pf'),
            gratuity: getRadio('gratuity'),
            gratuityType: getRadio('gratuityType'),
            wppf: getRadio('wppf'),
            leaveAnnual: Number(getVal('leaveAnnual')) || 0,
            leaveCasual: Number(getVal('leaveCasual')) || 0,
            leaveSick: Number(getVal('leaveSick')) || 0,
            workingDays: Number(getVal('workingDays')) || 0,
            otherBenefit: getVal('otherBenefit')
        };
        await saveProfile();
        updateProgress();
        renderProgress();
        showMessage('✅ Compensation saved! Profile complete! 🎉', 'success');
    } catch (err) {
        showMessage('❌ ' + err.message, 'error');
    } finally {
        btn.disabled = false;
        btn.textContent = 'Save & Finish ✓';
    }
};

// ============================================
// EDUCATION TABLE
// ============================================
function renderEducationTable() {
    const tbody = document.getElementById('educationTableBody');
    const list = profileData.education || [];

    if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="empty-row">No education added yet</td></tr>`;
        return;
    }

    tbody.innerHTML = list.map((e, i) => `
        <tr>
            <td>${escapeHtml(e.level)}</td>
            <td>${escapeHtml(e.institution)}</td>
            <td>${escapeHtml(e.title)}</td>
            <td>${escapeHtml(e.date)}</td>
            <td>${escapeHtml(e.percentage || '-')}</td>
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
                <div class="field">
                    <label>Degree Level <span class="req">*</span></label>
                    <select id="eduLevel" required>
                        <option value="">Select</option>
                        <option value="Matriculation/O-Level">Matriculation/O-Level</option>
                        <option value="Intermediate/A-Level">Intermediate/A-Level</option>
                        <option value="Bachelor">Bachelor</option>
                        <option value="Master">Master</option>
                        <option value="MPhil">MPhil</option>
                        <option value="PhD">PhD</option>
                        <option value="Certification">Certification</option>
                        <option value="Diploma">Diploma</option>
                    </select>
                </div>
                <div class="field">
                    <label>Institution <span class="req">*</span></label>
                    <input type="text" id="eduInstitution" required>
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
                    <label>Percentage / CGPA</label>
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
                        ${['Matriculation/O-Level','Intermediate/A-Level','Bachelor','Master','MPhil','PhD','Certification','Diploma'].map(l => 
                            `<option value="${l}" ${e.level === l ? 'selected' : ''}>${l}</option>`
                        ).join('')}
                    </select>
                </div>
                <div class="field">
                    <label>Institution <span class="req">*</span></label>
                    <input type="text" id="eduInstitution" value="${escapeAttr(e.institution)}" required>
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
                    <label>Percentage / CGPA</label>
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
    const entry = {
        level: getVal('eduLevel'),
        institution: getVal('eduInstitution'),
        title: getVal('eduTitle'),
        date: getVal('eduDate'),
        percentage: getVal('eduPercentage')
    };

    if (editingEduIndex === null) {
        profileData.education.push(entry);
    } else {
        profileData.education[editingEduIndex] = entry;
    }

    try {
        await saveProfile();
        renderEducationTable();
        updateProgress();
        renderProgress();
        closeModal();
        showMessage('✅ Education saved!', 'success');
    } catch (err) {
        showMessage('❌ ' + err.message, 'error');
    }
};

window.deleteEducation = async function(i) {
    if (!confirm('Delete this education entry?')) return;
    profileData.education.splice(i, 1);
    try {
        await saveProfile();
        renderEducationTable();
        updateProgress();
        renderProgress();
    } catch (err) {
        showMessage('❌ ' + err.message, 'error');
    }
};

// ============================================
// EXPERIENCE TABLE
// ============================================
function renderExperienceTable() {
    const tbody = document.getElementById('experienceTableBody');
    const list = (profileData.experience && profileData.experience.entries) || [];

    if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="empty-row">No experience added yet</td></tr>`;
        return;
    }

    tbody.innerHTML = list.map((e, i) => `
        <tr>
            <td>${escapeHtml(e.employer)}</td>
            <td>${escapeHtml(e.manager)}</td>
            <td>${escapeHtml(e.business)}</td>
            <td>${escapeHtml(e.title)}</td>
            <td>${escapeHtml(e.joining)}</td>
            <td>${escapeHtml(e.leaving || 'Present')}</td>
            <td>
                <button class="btn-edit" onclick="editExperience(${i})">✎</button>
                <button class="btn-delete" onclick="deleteExperience(${i})">✕</button>
            </td>
        </tr>
    `).join('');
}

window.toggleExperience = function(has) {
    profileData.experience.has = has;
    // save silently later
};

window.openExperienceModal = function() {
    editingExpIndex = null;
    document.getElementById('modalTitle').textContent = 'Add Job Detail';
    document.getElementById('modalBody').innerHTML = `
        <form onsubmit="saveExperienceEntry(event)">
            <div class="form-grid">
                <div class="field">
                    <label>Employer <span class="req">*</span></label>
                    <input type="text" id="expEmployer" required>
                </div>
                <div class="field">
                    <label>Manager's Name</label>
                    <input type="text" id="expManager">
                </div>
                <div class="field">
                    <label>Nature of Business <span class="req">*</span></label>
                    <input type="text" id="expBusiness" required>
                </div>
                <div class="field">
                    <label>Job Title <span class="req">*</span></label>
                    <input type="text" id="expTitle" required>
                </div>
                <div class="field">
                    <label>Joining Date <span class="req">*</span></label>
                    <input type="date" id="expJoining" required>
                </div>
                <div class="field">
                    <label>Leaving Date</label>
                    <input type="date" id="expLeaving">
                </div>
                <div class="field">
                    <label>Contact Employer?</label>
                    <select id="expContact">
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                    </select>
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

window.editExperience = function(i) {
    editingExpIndex = i;
    const e = profileData.experience.entries[i];
    document.getElementById('modalTitle').textContent = 'Edit Job Detail';
    document.getElementById('modalBody').innerHTML = `
        <form onsubmit="saveExperienceEntry(event)">
            <div class="form-grid">
                <div class="field">
                    <label>Employer <span class="req">*</span></label>
                    <input type="text" id="expEmployer" value="${escapeAttr(e.employer)}" required>
                </div>
                <div class="field">
                    <label>Manager's Name</label>
                    <input type="text" id="expManager" value="${escapeAttr(e.manager)}">
                </div>
                <div class="field">
                    <label>Nature of Business <span class="req">*</span></label>
                    <input type="text" id="expBusiness" value="${escapeAttr(e.business)}" required>
                </div>
                <div class="field">
                    <label>Job Title <span class="req">*</span></label>
                    <input type="text" id="expTitle" value="${escapeAttr(e.title)}" required>
                </div>
                <div class="field">
                    <label>Joining Date <span class="req">*</span></label>
                    <input type="date" id="expJoining" value="${escapeAttr(e.joining)}" required>
                </div>
                <div class="field">
                    <label>Leaving Date</label>
                    <input type="date" id="expLeaving" value="${escapeAttr(e.leaving)}">
                </div>
                <div class="field">
                    <label>Contact Employer?</label>
                    <select id="expContact">
                        <option value="Yes" ${e.contact === 'Yes' ? 'selected' : ''}>Yes</option>
                        <option value="No" ${e.contact === 'No' ? 'selected' : ''}>No</option>
                    </select>
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

window.saveExperienceEntry = async function(e) {
    e.preventDefault();
    const entry = {
        employer: getVal('expEmployer'),
        manager: getVal('expManager'),
        business: getVal('expBusiness'),
        title: getVal('expTitle'),
        joining: getVal('expJoining'),
        leaving: getVal('expLeaving'),
        contact: getVal('expContact')
    };

    if (!profileData.experience) profileData.experience = { has: true, overall: 0, industry: 0, entries: [] };
    if (!profileData.experience.entries) profileData.experience.entries = [];

    if (editingExpIndex === null) {
        profileData.experience.entries.push(entry);
    } else {
        profileData.experience.entries[editingExpIndex] = entry;
    }

    profileData.experience.overall = Number(getVal('overallExp')) || 0;
    profileData.experience.industry = Number(getVal('industryExp')) || 0;

    try {
        await saveProfile();
        renderExperienceTable();
        updateProgress();
        renderProgress();
        closeModal();
        showMessage('✅ Experience saved!', 'success');
    } catch (err) {
        showMessage('❌ ' + err.message, 'error');
    }
};

window.deleteExperience = async function(i) {
    if (!confirm('Delete this experience entry?')) return;
    profileData.experience.entries.splice(i, 1);
    try {
        await saveProfile();
        renderExperienceTable();
        updateProgress();
        renderProgress();
    } catch (err) {
        showMessage('❌ ' + err.message, 'error');
    }
};

// ============================================
// SKILLS TABLE
// ============================================
function renderSkillsTable() {
    const tbody = document.getElementById('skillsTableBody');
    const list = profileData.skills || [];

    if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" class="empty-row">No skills added yet</td></tr>`;
        return;
    }

    tbody.innerHTML = list.map((s, i) => `
        <tr>
            <td>${escapeHtml(s.name)}</td>
            <td>${escapeHtml(s.level)}</td>
            <td>${escapeHtml(s.description)}</td>
            <td>
                <button class="btn-edit" onclick="editSkill(${i})">✎</button>
                <button class="btn-delete" onclick="deleteSkill(${i})">✕</button>
            </td>
        </tr>
    `).join('');
}

window.openSkillModal = function() {
    editingSkillIndex = null;
    document.getElementById('modalTitle').textContent = 'Add Skill';
    document.getElementById('modalBody').innerHTML = `
        <form onsubmit="saveSkillEntry(event)">
            <div class="form-grid">
                <div class="field">
                    <label>Skill Name <span class="req">*</span></label>
                    <input type="text" id="skillName" required>
                </div>
                <div class="field">
                    <label>Skill Level <span class="req">*</span></label>
                    <select id="skillLevel" required>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Expert" selected>Expert</option>
                    </select>
                </div>
                <div class="field full">
                    <label>Description</label>
                    <input type="text" id="skillDesc">
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

window.editSkill = function(i) {
    editingSkillIndex = i;
    const s = profileData.skills[i];
    document.getElementById('modalTitle').textContent = 'Edit Skill';
    document.getElementById('modalBody').innerHTML = `
        <form onsubmit="saveSkillEntry(event)">
            <div class="form-grid">
                <div class="field">
                    <label>Skill Name <span class="req">*</span></label>
                    <input type="text" id="skillName" value="${escapeAttr(s.name)}" required>
                </div>
                <div class="field">
                    <label>Skill Level <span class="req">*</span></label>
                    <select id="skillLevel" required>
                        <option value="Beginner" ${s.level === 'Beginner' ? 'selected' : ''}>Beginner</option>
                        <option value="Intermediate" ${s.level === 'Intermediate' ? 'selected' : ''}>Intermediate</option>
                        <option value="Expert" ${s.level === 'Expert' ? 'selected' : ''}>Expert</option>
                    </select>
                </div>
                <div class="field full">
                    <label>Description</label>
                    <input type="text" id="skillDesc" value="${escapeAttr(s.description)}">
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

window.saveSkillEntry = async function(e) {
    e.preventDefault();
    const entry = {
        name: getVal('skillName'),
        level: getVal('skillLevel'),
        description: getVal('skillDesc')
    };

    if (editingSkillIndex === null) {
        profileData.skills.push(entry);
    } else {
        profileData.skills[editingSkillIndex] = entry;
    }

    try {
        await saveProfile();
        renderSkillsTable();
        updateProgress();
        renderProgress();
        closeModal();
        showMessage('✅ Skill saved!', 'success');
    } catch (err) {
        showMessage('❌ ' + err.message, 'error');
    }
};

window.deleteSkill = async function(i) {
    if (!confirm('Delete this skill?')) return;
    profileData.skills.splice(i, 1);
    try {
        await saveProfile();
        renderSkillsTable();
        updateProgress();
        renderProgress();
    } catch (err) {
        showMessage('❌ ' + err.message, 'error');
    }
};

// ============================================
// MODAL CONTROL
// ============================================
function openModal() {
    document.getElementById('modalOverlay').classList.add('show');
}

window.closeModal = function() {
    document.getElementById('modalOverlay').classList.remove('show');
};

// ============================================
// TOGGLES (Compensation)
// ============================================
window.toggleBonus = function(show) {
    // no special UI, kept for future
};
window.toggleMed = function(show) {
    const el = document.getElementById('medAmount');
    if (el) el.disabled = !show;
};
window.toggleFuel = function(show) {
    ['fuelAmount', 'fuelLiters'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.disabled = !show;
    });
};
window.toggleVehicle = function(show) {
    const row = document.getElementById('vehicleDetailsRow');
    if (row) row.style.display = show ? 'flex' : 'none';
};
window.toggleMobile = function(show) {
    const el = document.getElementById('mobileAmount');
    if (el) el.disabled = !show;
};

// ============================================
// CHARACTER COUNTERS
// ============================================
function attachCharCounters() {
    const map = [
        ['saObjective', 'c1', 500],
        ['saStrengths', 'c2', 500],
        ['saImprovements', 'c3', 500],
        ['saSummary', 'c4', 800]
    ];
    map.forEach(([inputId, countId, max]) => {
        const input = document.getElementById(inputId);
        const counter = document.getElementById(countId);
        if (input && counter) {
            input.addEventListener('input', () => {
                counter.textContent = input.value.length;
            });
        }
    });
}

// ============================================
// HELPERS
// ============================================
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

function showMessage(text, type = 'info') {
    const box = document.getElementById('messageBox');
    if (!box) return;
    box.textContent = text;
    box.className = 'message-box show ' + type;
    setTimeout(() => {
        box.classList.remove('show');
    }, 4000);
}

// ============================================
// PAGE VISIT COUNTER (bonus)
// ============================================
if (!sessionStorage.getItem('hask_profile_visit')) {
    sessionStorage.setItem('hask_profile_visit', '1');
}
