/* ============================================
   HASK TalentConnect - Profile JavaScript
   With Province/District, Universities, Certifications
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
    setDoc 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ============================================
// FIREBASE CONFIG
// ============================================
const firebaseConfig = {
    apiKey: "AIzaSyAreIiCnSheAeXc2wNeU7-qFj-qFhaXZAo",
    authDomain: "hask-talentconnect.firebaseapp.com",
    projectId: "hask-talentconnect",
    storageBucket: "hask-talentconnect.firebasestorage.app",
    messagingSenderId: "532290737820",
    appId: "1:532290737820:web:49f70281b0f34837757f59"
};

// ============================================
// CLOUDINARY CONFIG
// ============================================
const CLOUDINARY_CLOUD_NAME = "mabktzhu";
const CLOUDINARY_API_KEY = "958262513531712";
const CLOUDINARY_PRESET = "hask_unsigned";
const CLOUDINARY_FOLDER = "hask-talentconnect/profiles";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ============================================
// COUNTRIES LIST (A to Z)
// ============================================
const COUNTRIES = [
    "Afghanistan","Albania","Algeria","Andorra","Angola","Antigua and Barbuda","Argentina","Armenia","Australia","Austria","Azerbaijan",
    "Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bhutan","Bolivia",
    "Bosnia and Herzegovina","Botswana","Brazil","Brunei","Bulgaria","Burkina Faso","Burundi",
    "Cabo Verde","Cambodia","Cameroon","Canada","Central African Republic","Chad","Chile","China","Colombia",
    "Comoros","Congo","Costa Rica","Croatia","Cuba","Cyprus","Czech Republic",
    "Denmark","Djibouti","Dominica","Dominican Republic",
    "Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Eswatini","Ethiopia",
    "Fiji","Finland","France",
    "Gabon","Gambia","Georgia","Germany","Ghana","Greece","Grenada","Guatemala","Guinea","Guinea-Bissau","Guyana",
    "Haiti","Honduras","Hungary",
    "Iceland","India","Indonesia","Iran","Iraq","Ireland","Israel","Italy","Ivory Coast",
    "Jamaica","Japan","Jordan",
    "Kazakhstan","Kenya","Kiribati","Kosovo","Kuwait","Kyrgyzstan",
    "Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg",
    "Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Mauritania","Mauritius",
    "Mexico","Micronesia","Moldova","Monaco","Mongolia","Montenegro","Morocco","Mozambique","Myanmar",
    "Namibia","Nauru","Nepal","Netherlands","New Zealand","Nicaragua","Niger","Nigeria","North Korea","North Macedonia","Norway",
    "Oman",
    "Pakistan","Palau","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal",
    "Qatar",
    "Romania","Russia","Rwanda",
    "Saint Kitts and Nevis","Saint Lucia","Saint Vincent and the Grenadines","Samoa","San Marino",
    "Sao Tome and Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia",
    "Slovenia","Solomon Islands","Somalia","South Africa","South Korea","South Sudan","Spain","Sri Lanka","Sudan",
    "Suriname","Sweden","Switzerland","Syria",
    "Taiwan","Tajikistan","Tanzania","Thailand","Timor-Leste","Togo","Tonga","Trinidad and Tobago","Tunisia","Turkey",
    "Turkmenistan","Tuvalu",
    "Uganda","Ukraine","United Arab Emirates","United Kingdom","United States","Uruguay","Uzbekistan",
    "Vanuatu","Vatican City","Venezuela","Vietnam",
    "Yemen",
    "Zambia","Zimbabwe"
];

// ============================================
// PROVINCE → DISTRICTS
// ============================================
const PROVINCE_DISTRICTS = {
    "Punjab": [
        "Attock","Bahawalnagar","Bahawalpur","Bhakkar","Chakwal","Chiniot","Dera Ghazi Khan","Faisalabad",
        "Gujranwala","Gujrat","Hafizabad","Jhang","Jhelum","Kasur","Khanewal","Khushab","Lahore","Layyah",
        "Lodhran","Mandi Bahauddin","Mianwali","Multan","Muzaffargarh","Nankana Sahib","Narowal","Okara",
        "Pakpattan","Rahim Yar Khan","Rajanpur","Rawalpindi","Sahiwal","Sargodha","Sheikhupura","Sialkot",
        "Toba Tek Singh","Vehari"
    ],
    "Sindh": [
        "Badin","Dadu","Ghotki","Hyderabad","Jacobabad","Jamshoro","Karachi Central","Karachi East",
        "Karachi South","Karachi West","Kashmore","Khairpur","Korangi","Larkana","Malir","Matiari",
        "Mirpur Khas","Naushahro Feroze","Qambar Shahdadkot","Sanghar","Shaheed Benazirabad","Shikarpur",
        "Sujawal","Sukkur","Tando Allahyar","Tando Muhammad Khan","Tharparkar","Thatta","Umerkot","Kemari"
    ],
    "Khyber Pakhtunkhwa": [
        "Abbottabad","Bajaur","Bannu","Battagram","Buner","Charsadda","Chitral","Dera Ismail Khan",
        "Hangu","Haripur","Karak","Khyber","Kohat","Kohistan","Kurram","Lakki Marwat","Lower Dir",
        "Lower Kohistan","Malakand","Mansehra","Mardan","Mohmand","North Waziristan","Nowshera","Orakzai",
        "Peshawar","Shangla","South Waziristan","Swabi","Swat","Tank","Tor Ghar","Upper Chitral",
        "Upper Dir","Upper Kohistan"
    ],
    "Balochistan": [
        "Awaran","Barkhan","Chagai","Chaman","Dera Bugti","Duki","Gwadar","Harnai","Jaffarabad","Jhal Magsi",
        "Kachhi","Kalat","Kech","Kharan","Khuzdar","Killa Abdullah","Killa Saifullah","Kohlu","Lasbela",
        "Loralai","Mastung","Musakhel","Nasirabad","Nushki","Panjgur","Pishin","Quetta","Sherani","Sibi",
        "Sohbatpur","Washuk","Zhob","Ziarat"
    ],
    "Islamabad Capital Territory": [
        "Islamabad"
    ],
    "Gilgit-Baltistan": [
        "Astore","Diamer","Ghanche","Ghizer","Gilgit","Hunza","Kharmang","Nagar","Shigar","Skardu"
    ],
    "Azad Jammu & Kashmir": [
        "Bagh","Bhimber","Haveli","Jhelum Valley","Kotli","Mirpur","Muzaffarabad","Neelum","Poonch","Sudhnoti"
    ]
};

// ============================================
// UNIVERSITIES OF PAKISTAN (Major)
// ============================================
const UNIVERSITIES = [
    "Air University, Islamabad",
    "Allama Iqbal Open University, Islamabad",
    "Arid Agriculture University, Rawalpindi",
    "Bahauddin Zakariya University, Multan",
    "Bahria University, Islamabad",
    "Balochistan University of Information Technology, Quetta",
    "COMSATS University Islamabad",
    "Fatima Jinnah Medical University, Lahore",
    "Federal Urdu University, Karachi",
    "Gomal University, Dera Ismail Khan",
    "Government College University, Faisalabad",
    "Government College University, Lahore",
    "Hazara University, Mansehra",
    "International Islamic University, Islamabad",
    "Islamia University, Bahawalpur",
    "King Edward Medical University, Lahore",
    "Kohat University of Science & Technology",
    "Lahore University of Management Sciences (LUMS)",
    "Liaquat University of Medical & Health Sciences, Jamshoro",
    "Mehran University of Engineering & Technology, Jamshoro",
    "National University of Computer & Emerging Sciences (FAST)",
    "National University of Modern Languages (NUML), Islamabad",
    "National University of Sciences & Technology (NUST), Islamabad",
    "Peshawar University",
    "Pir Mehr Ali Shah Arid Agriculture University, Rawalpindi",
    "Quaid-i-Azam University, Islamabad",
    "Riphah International University, Islamabad",
    "Sindh Agriculture University, Tandojam",
    "University of Agriculture, Faisalabad",
    "University of Balochistan, Quetta",
    "University of Central Punjab, Lahore",
    "University of Engineering & Technology, Lahore",
    "University of Engineering & Technology, Peshawar",
    "University of Engineering & Technology, Taxila",
    "University of Gujrat",
    "University of Karachi",
    "University of Lahore",
    "University of Malakand",
    "University of Management & Technology (UMT), Lahore",
    "University of Peshawar",
    "University of Punjab, Lahore",
    "University of Sargodha",
    "University of Sindh, Jamshoro",
    "University of Veterinary & Animal Sciences, Lahore",
    "Virtual University of Pakistan",
    "Other"
];

// ============================================
// GLOBAL STATE
// ============================================
let currentUser = null;
let userData = null;
let profileData = {
    personal: null,
    education: [],
    certifications: [],
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
    certifications: false,
    experience: false,
    skills: false,
    self: false,
    references: false,
    misc: false,
    compensation: false
};

let editingEduIndex = null;
let editingCertIndex = null;
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

    await loadProfile();

    populateCountries('pNationality');
    populateCountries('pCountry');

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

// ============================================
// POPULATE COUNTRIES
// ============================================
function populateCountries(selectId) {
    const sel = document.getElementById(selectId);
    if (!sel) return;
    sel.innerHTML = '<option value="Pakistan">Pakistan</option>';
    COUNTRIES.forEach(c => {
        if (c !== 'Pakistan') {
            const opt = document.createElement('option');
            opt.value = c;
            opt.textContent = c;
            sel.appendChild(opt);
        }
    });
}

// ============================================
// PROVINCE → DISTRICT HANDLER
// ============================================
window.handleProvinceChange = function(provinceId, districtId) {
    const province = document.getElementById(provinceId).value;
    const districtSel = document.getElementById(districtId);

    if (!province) {
        districtSel.innerHTML = '<option value="">Select Province First</option>';
        return;
    }

    const districts = PROVINCE_DISTRICTS[province] || [];
    districtSel.innerHTML = '<option value="">Select District</option>';
    districts.forEach(d => {
        const opt = document.createElement('option');
        opt.value = d;
        opt.textContent = d;
        districtSel.appendChild(opt);
    });
};

// ============================================
// CNIC AUTO-FORMAT
// ============================================
function attachCnicFormatter() {
    const cnicInput = document.getElementById('pCnic');
    if (!cnicInput) return;

    cnicInput.addEventListener('input', function() {
        let digits = this.value.replace(/\D/g, '');
        digits = digits.slice(0, 13);

        let formatted = '';
        if (digits.length > 0) formatted = digits.slice(0, 5);
        if (digits.length > 5) formatted += '-' + digits.slice(5, 12);
        if (digits.length > 12) formatted += '-' + digits.slice(12, 13);

        this.value = formatted;
    });
}

// ============================================
// PROFILE PICTURE UPLOAD (Cloudinary)
// ============================================
window.handlePicUpload = function(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
        showMessage('❌ Picture must be less than 5MB.', 'error');
        event.target.value = '';
        return;
    }
    if (!file.type.startsWith('image/')) {
        showMessage('❌ Only image files are allowed.', 'error');
        event.target.value = '';
        return;
    }

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
            if (ring) {
                const circumference = 314;
                ring.style.strokeDashoffset = circumference - (percent / 100) * circumference;
            }
            if (text) text.textContent = percent + '%';
        }
    });

    xhr.onload = async function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            try {
                const data = JSON.parse(xhr.responseText);
                const downloadURL = data.secure_url;

                if (!profileData.personal) profileData.personal = {};
                profileData.personal.profilePic = downloadURL;
                await saveProfile();

                const overlay = document.getElementById('uploadOverlay');
                if (overlay) overlay.innerHTML = '<div class="progress-check">✅</div>';

                setTimeout(() => {
                    avatarEl.innerHTML = `<img src="${downloadURL}" alt="Avatar">`;
                    updateAvatarControls();
                    event.target.value = '';
                }, 700);
            } catch (err) {
                console.error(err);
                avatarEl.innerHTML = oldContent;
                event.target.value = '';
            }
        } else {
            console.error('Upload failed:', xhr.responseText);
            avatarEl.innerHTML = oldContent;
            event.target.value = '';
        }
    };

    xhr.onerror = function() {
        avatarEl.innerHTML = oldContent;
        event.target.value = '';
    };

    xhr.send(formData);
};

// ============================================
// REMOVE PICTURE
// ============================================
window.removePic = async function() {
    if (!confirm('Remove your profile picture?')) return;
    try {
        profileData.personal = profileData.personal || {};
        profileData.personal.profilePic = '';
        await saveProfile();
        renderSidebarUser();
        updateAvatarControls();
    } catch (err) {
        showMessage('❌ ' + err.message, 'error');
    }
};

function updateAvatarControls() {
    const hasPic = !!(profileData.personal && profileData.personal.profilePic);
    const uploadBtn = document.querySelector('.sidebar-avatar-controls .btn-pic-upload');
    const removeBtn = document.querySelector('.sidebar-avatar-controls .btn-pic-remove');
    if (uploadBtn) uploadBtn.classList.toggle('hide', hasPic);
    if (removeBtn) removeBtn.classList.toggle('show', hasPic);
}

// ============================================
// PREVIEW CV
// ============================================
window.previewCV = function() {
    // Save first, then open CV in new tab
    saveProfile().then(() => {
        window.open('cv.html', '_blank');
    }).catch(err => {
        showMessage('❌ Please save your data first: ' + err.message, 'error');
    });
};

// ============================================
// AREA OF INTEREST — Other
// ============================================
window.handleInterestChange = function() {
    const val = document.getElementById('pInterest').value;
    const otherField = document.getElementById('otherInterestField');
    const otherInput = document.getElementById('pOtherInterest');
    if (val === 'Other') {
        otherField.style.display = 'flex';
        otherInput.setAttribute('required', 'required');
    } else {
        otherField.style.display = 'none';
        otherInput.removeAttribute('required');
        otherInput.value = '';
    }
};

// ============================================
// TOGGLE: Crime / Disability / Religion
// ============================================
window.toggleCrimeDetails = function() {
    const val = document.getElementById('mCrime').value;
    const field = document.getElementById('crimeDetailsField');
    const input = document.getElementById('mCrimeDetails');
    if (val === 'Yes') {
        field.style.display = 'flex';
        input.setAttribute('required', 'required');
    } else {
        field.style.display = 'none';
        input.removeAttribute('required');
        input.value = '';
    }
};

window.toggleDisabilityDetails = function() {
    const val = document.getElementById('mDisability').value;
    const field = document.getElementById('disabilityDetailsField');
    const input = document.getElementById('mDisabilityDetails');
    if (val === 'Yes') {
        field.style.display = 'flex';
        input.setAttribute('required', 'required');
    } else {
        field.style.display = 'none';
        input.removeAttribute('required');
        input.value = '';
    }
};

window.toggleReligionOther = function() {
    const val = document.getElementById('mReligion').value;
    const field = document.getElementById('religionOtherField');
    const input = document.getElementById('mReligionOther');
    if (val === 'Other') {
        field.style.display = 'flex';
        input.setAttribute('required', 'required');
    } else {
        field.style.display = 'none';
        input.removeAttribute('required');
        input.value = '';
    }
};

// ============================================
// LOAD PROFILE
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

// ============================================
// SAVE PROFILE
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
    } catch (e) { throw e; }
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
    idEl.textContent = '🆔 ' + (userData.userId || '—');
    const pic = profileData.personal && profileData.personal.profilePic;
    if (pic) avatarEl.innerHTML = `<img src="${pic}" alt="Avatar">`;
    else avatarEl.textContent = initials;
}

// ============================================
// PROGRESS
// ============================================
function updateProgress() {
    const p = profileData;

    progressData.personal = !!(p.personal &&
        p.personal.fullName && p.personal.fatherName &&
        p.personal.cnic && p.personal.dob &&
        p.personal.gender && p.personal.cell &&
        p.personal.email && p.personal.address &&
        p.personal.province && p.personal.domicile && p.personal.city);

    progressData.education = p.education && p.education.length > 0;
    progressData.certifications = p.certifications && p.certifications.length > 0;
    progressData.experience = p.experience && (
        p.experience.has === false ||
        (p.experience.entries && p.experience.entries.length > 0)
    );
    progressData.skills = p.skills && p.skills.length > 0;
    progressData.self = !!(p.self && p.self.objective && p.self.strengths && p.self.improvements && p.self.summary);
    progressData.references = !!(p.references && p.references.ref1Name && p.references.ref1Email && p.references.ref2Name && p.references.ref2Email);
    progressData.misc = !!(p.misc && p.misc.crime && p.misc.disability && p.misc.source);
    progressData.compensation = !!(p.compensation &&
        p.compensation.basic !== undefined &&
        p.compensation.gross !== undefined &&
        p.compensation.expected !== undefined);
}

function renderProgress() {
    const sections = ['personal', 'education', 'certifications', 'experience', 'skills', 'self', 'references', 'misc', 'compensation'];
    const completed = sections.filter(s => progressData[s]).length;
    const total = sections.length;
    const percent = Math.round((completed / total) * 100);

    document.getElementById('progressPercent').textContent = percent + '%';
    document.getElementById('progressBarFill').style.width = percent + '%';

    sections.forEach(s => {
        const item = document.querySelector(`.menu-item[data-section="${s}"]`);
        const checkBox = document.getElementById('check-' + s);
        if (!item || !checkBox) return;
        if (progressData[s]) {
            item.classList.add('completed');
            checkBox.textContent = '✅';
        } else {
            item.classList.remove('completed');
            checkBox.textContent = '⬜';
        }
    });
}

// ============================================
// SECTION NAVIGATION
// ============================================
function showSection(sectionName) {
    document.querySelectorAll('.profile-section').forEach(s => s.classList.remove('active'));
    const target = document.getElementById('section-' + sectionName);
    if (target) target.classList.add('active');

    document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));
    const menuItem = document.querySelector(`.menu-item[data-section="${sectionName}"]`);
    if (menuItem) menuItem.classList.add('active');

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.goToSection = showSection;

window.nextSection = function(nextName) {
    saveProfile().then(() => {
        updateProgress();
        renderProgress();
        showSection(nextName);
    }).catch(e => showMessage('❌ Save failed: ' + e.message, 'error'));
};

function showFirstIncompleteSection() {
    const order = ['personal', 'education', 'certifications', 'experience', 'skills', 'self', 'references', 'misc', 'compensation'];
    for (const s of order) {
        if (!progressData[s]) { showSection(s); return; }
    }
    showSection('personal');
}

// ============================================
// ATTACH LISTENERS
// ============================================
function attachListeners() {
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            showSection(item.dataset.section);
        });
    });

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            if (!confirm('Logout from your account?')) return;
            try {
                sessionStorage.removeItem('hask_logged_in');
                await signOut(auth);
                window.location.replace('login.html');
            } catch (err) { alert('Error: ' + err.message); }
        });
    }
}

// ============================================
// APPLY DEFAULTS
// ============================================
function applyDefaults() {
    const p = profileData.personal || {};
    setVal('pTitle', p.title || '');
    setVal('pFullName', p.fullName || userData.name || '');
    setVal('pFatherName', p.fatherName || '');
    setVal('pNationality', p.nationality || 'Pakistan');

    let cnicVal = p.cnic || '';
    if (cnicVal && cnicVal.length === 13 && !cnicVal.includes('-')) {
        cnicVal = cnicVal.slice(0, 5) + '-' + cnicVal.slice(5, 12) + '-' + cnicVal.slice(12, 13);
    }
    setVal('pCnic', cnicVal);
    setVal('pDob', p.dob || '');
    setVal('pGender', p.gender || '');

    if (p.interest) {
        const standardOptions = ['IT & Software','Sales & Marketing','Accounting & Finance','HR & Admin','Engineering','Education','Healthcare','Construction','Transport','Security','Hospitality','Retail','Manufacturing','Textile','Telecom','Other'];
        if (standardOptions.includes(p.interest)) {
            setVal('pInterest', p.interest);
            if (p.interest === 'Other') {
                document.getElementById('otherInterestField').style.display = 'flex';
                setVal('pOtherInterest', p.otherInterest || '');
            }
        } else {
            addCustomInterestOption(p.interest);
            setVal('pInterest', p.interest);
        }
    }

    // Province + District
    if (p.province) {
        setVal('pProvince', p.province);
        handleProvinceChange('pProvince', 'pDomicile');
        setTimeout(() => {
            setVal('pDomicile', p.domicile || '');
        }, 100);
    }

    setVal('pAddress', p.address || '');
    setVal('pCountry', p.country || 'Pakistan');
    setVal('pCity', p.city || '');
    setVal('pTehsil', p.tehsil || '');
    setVal('pPostalCode', p.postalCode || '');
    setVal('pLandline', p.landline || '');
    setVal('pCell', p.cell || '');
    setVal('pEmail', p.email || userData.email || '');

    document.getElementById('candidateId').textContent = userData.userId || '—';

    const exp = profileData.experience || {};
    setVal('overallExp', exp.overall || 0);
    setVal('industryExp', exp.industry || 0);
    if (exp.has === false) {
        const noRadio = document.querySelector('input[name="hasExp"][value="no"]');
        if (noRadio) noRadio.checked = true;
    }

    const sa = profileData.self || {};
    setVal('saObjective', sa.objective || '');
    setVal('saStrengths', sa.strengths || '');
    setVal('saImprovements', sa.improvements || '');
    setVal('saSummary', sa.summary || '');
    setTimeout(() => {
        ['saObjective', 'saStrengths', 'saImprovements', 'saSummary'].forEach((id, i) => {
            const el = document.getElementById(id);
            const counter = document.getElementById('c' + (i + 1));
            if (el && counter) counter.textContent = el.value.length;
        });
    }, 100);

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

    const m = profileData.misc || {};
    setVal('mCrime', m.crime || 'No');
    setVal('mDisability', m.disability || 'No');
    setVal('mSource', m.source || 'Social Media');
    setVal('mNoticeNum', m.noticeNum || 1);
    setVal('mNoticeUnit', m.noticeUnit || 'Month');
    setVal('mLinkedin', m.linkedin || '');
    setVal('mBlood', m.blood || '');
    setVal('mMarital', m.marital || '');

    const standardReligions = ['Islam', 'Christianity', 'Hinduism', 'Sikhism', 'Buddhism'];
    if (m.religion && !standardReligions.includes(m.religion) && m.religion !== '') {
        setVal('mReligion', 'Other');
        document.getElementById('religionOtherField').style.display = 'flex';
        setVal('mReligionOther', m.religion);
    } else {
        setVal('mReligion', m.religion || '');
    }

    if (m.crime === 'Yes') {
        document.getElementById('crimeDetailsField').style.display = 'flex';
        setVal('mCrimeDetails', m.crimeDetails || '');
    }
    if (m.disability === 'Yes') {
        document.getElementById('disabilityDetailsField').style.display = 'flex';
        setVal('mDisabilityDetails', m.disabilityDetails || '');
    }

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

    renderEducationTable();
    renderCertificationsTable();
    renderExperienceTable();
    renderSkillsTable();
}

function addCustomInterestOption(value) {
    const sel = document.getElementById('pInterest');
    if (!sel) return;
    const exists = Array.from(sel.options).some(o => o.value === value);
    if (exists) return;
    const otherOption = Array.from(sel.options).find(o => o.value === 'Other');
    const newOpt = document.createElement('option');
    newOpt.value = value;
    newOpt.textContent = value;
    if (otherOption) sel.insertBefore(newOpt, otherOption);
    else sel.appendChild(newOpt);
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
        let interestValue = getVal('pInterest');
        let otherInterest = '';
        if (interestValue === 'Other') {
            otherInterest = getVal('pOtherInterest');
            if (!otherInterest) {
                showMessage('❌ Please specify your area of interest.', 'error');
                btn.disabled = false;
                btn.textContent = 'Save & Continue →';
                return;
            }
            addCustomInterestOption(otherInterest);
            interestValue = otherInterest;
        }

        const profilePic = (profileData.personal && profileData.personal.profilePic) || '';

        profileData.personal = {
            title: getVal('pTitle'),
            fullName: getVal('pFullName'),
            fatherName: getVal('pFatherName'),
            nationality: getVal('pNationality'),
            cnic: getVal('pCnic').replace(/\D/g, ''),
            dob: getVal('pDob'),
            gender: getVal('pGender'),
            interest: interestValue,
            otherInterest: otherInterest,
            province: getVal('pProvince'),
            domicile: getVal('pDomicile'),
            address: getVal('pAddress'),
            country: getVal('pCountry'),
            city: getVal('pCity'),
            tehsil: getVal('pTehsil'),
            postalCode: getVal('pPostalCode'),
            landline: getVal('pLandline'),
            cell: getVal('pCell'),
            email: getVal('pEmail'),
            profilePic: profilePic
        };

        await saveProfile();
        updateProgress();
        renderProgress();
        renderSidebarUser();
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
// SAVE: SELF
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
        const crimeVal = getVal('mCrime');
        const disabilityVal = getVal('mDisability');
        const religionVal = getVal('mReligion');

        if (crimeVal === 'Yes' && !getVal('mCrimeDetails')) {
            showMessage('❌ Please provide crime details.', 'error');
            btn.disabled = false; btn.textContent = 'Save & Continue →';
            return;
        }
        if (disabilityVal === 'Yes' && !getVal('mDisabilityDetails')) {
            showMessage('❌ Please provide disability details.', 'error');
            btn.disabled = false; btn.textContent = 'Save & Continue →';
            return;
        }
        if (religionVal === 'Other' && !getVal('mReligionOther')) {
            showMessage('❌ Please specify your religion.', 'error');
            btn.disabled = false; btn.textContent = 'Save & Continue →';
            return;
        }

        profileData.misc = {
            crime: crimeVal,
            crimeDetails: crimeVal === 'Yes' ? getVal('mCrimeDetails') : '',
            disability: disabilityVal,
            disabilityDetails: disabilityVal === 'Yes' ? getVal('mDisabilityDetails') : '',
            source: getVal('mSource'),
            noticeNum: getVal('mNoticeNum'),
            noticeUnit: getVal('mNoticeUnit'),
            linkedin: getVal('mLinkedin'),
            blood: getVal('mBlood'),
            marital: getVal('mMarital'),
            religion: religionVal === 'Other' ? getVal('mReligionOther') : religionVal,
            religionType: religionVal
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

function getUniversityOptions(selected = '') {
    return UNIVERSITIES.map(u => 
        `<option value="${u}" ${u === selected ? 'selected' : ''}>${u}</option>`
    ).join('');
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
                    <label>University / Institution <span class="req">*</span></label>
                    <select id="eduInstitution" onchange="handleUniChange()" required>
                        <option value="">Select University</option>
                        ${getUniversityOptions()}
                    </select>
                </div>
                <div class="field" id="eduOtherUniField" style="display:none;">
                    <label>Enter Institution Name <span class="req">*</span></label>
                    <input type="text" id="eduOtherUni" placeholder="e.g. Bahria University">
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

window.handleUniChange = function() {
    const val = document.getElementById('eduInstitution').value;
    const otherField = document.getElementById('eduOtherUniField');
    const otherInput = document.getElementById('eduOtherUni');
    if (val === 'Other') {
        otherField.style.display = 'flex';
        otherInput.setAttribute('required', 'required');
    } else {
        otherField.style.display = 'none';
        otherInput.removeAttribute('required');
        otherInput.value = '';
    }
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
                    <label>University / Institution <span class="req">*</span></label>
                    <select id="eduInstitution" onchange="handleUniChange()" required>
                        <option value="">Select University</option>
                        ${getUniversityOptions(e.institution)}
                        <option value="__custom__" ${!UNIVERSITIES.includes(e.institution) && e.institution ? 'selected' : ''}>Enter Custom</option>
                    </select>
                </div>
                <div class="field" id="eduOtherUniField" style="display:${(!UNIVERSITIES.includes(e.institution) && e.institution) ? 'flex' : 'none'};">
                    <label>Enter Institution Name <span class="req">*</span></label>
                    <input type="text" id="eduOtherUni" value="${escapeAttr(!UNIVERSITIES.includes(e.institution) ? e.institution : '')}" placeholder="e.g. Bahria University">
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
    let institutionVal = getVal('eduInstitution');
    if (institutionVal === 'Other' || institutionVal === '__custom__') {
        institutionVal = getVal('eduOtherUni');
        if (!institutionVal) {
            showMessage('❌ Please enter institution name.', 'error');
            return;
        }
    }
    const entry = {
        level: getVal('eduLevel'),
        institution: institutionVal,
        title: getVal('eduTitle'),
        date: getVal('eduDate'),
        percentage: getVal('eduPercentage')
    };
    if (editingEduIndex === null) profileData.education.push(entry);
    else profileData.education[editingEduIndex] = entry;
    try {
        await saveProfile();
        renderEducationTable();
        updateProgress();
        renderProgress();
        closeModal();
        showMessage('✅ Education saved!', 'success');
    } catch (err) { showMessage('❌ ' + err.message, 'error'); }
};

window.deleteEducation = async function(i) {
    if (!confirm('Delete this education entry?')) return;
    profileData.education.splice(i, 1);
    try {
        await saveProfile();
        renderEducationTable();
        updateProgress();
        renderProgress();
    } catch (err) { showMessage('❌ ' + err.message, 'error'); }
};

// ============================================
// CERTIFICATIONS TABLE
// ============================================
function renderCertificationsTable() {
    const tbody = document.getElementById('certificationsTableBody');
    const list = profileData.certifications || [];
    if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="empty-row">No certifications added yet</td></tr>`;
        return;
    }
    tbody.innerHTML = list.map((c, i) => `
        <tr>
            <td>${escapeHtml(c.name)}</td>
            <td>${escapeHtml(c.issuer)}</td>
            <td>${escapeHtml(c.year)}</td>
            <td>${escapeHtml(c.certId || '-')}</td>
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
                <div class="field full">
                    <label>Certificate Name <span class="req">*</span></label>
                    <input type="text" id="certName" placeholder="e.g. CHRP - Certified HR Professional" required>
                </div>
                <div class="field">
                    <label>Issuing Authority <span class="req">*</span></label>
                    <input type="text" id="certIssuer" placeholder="e.g. PIPD, Microsoft" required>
                </div>
                <div class="field">
                    <label>Year <span class="req">*</span></label>
                    <input type="text" id="certYear" placeholder="e.g. 2024" required>
                </div>
                <div class="field">
                    <label>Certificate ID (Optional)</label>
                    <input type="text" id="certId">
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

window.editCertification = function(i) {
    editingCertIndex = i;
    const c = profileData.certifications[i];
    document.getElementById('modalTitle').textContent = 'Edit Certification';
    document.getElementById('modalBody').innerHTML = `
        <form onsubmit="saveCertificationEntry(event)">
            <div class="form-grid">
                <div class="field full">
                    <label>Certificate Name <span class="req">*</span></label>
                    <input type="text" id="certName" value="${escapeAttr(c.name)}" required>
                </div>
                <div class="field">
                    <label>Issuing Authority <span class="req">*</span></label>
                    <input type="text" id="certIssuer" value="${escapeAttr(c.issuer)}" required>
                </div>
                <div class="field">
                    <label>Year <span class="req">*</span></label>
                    <input type="text" id="certYear" value="${escapeAttr(c.year)}" required>
                </div>
                <div class="field">
                    <label>Certificate ID (Optional)</label>
                    <input type="text" id="certId" value="${escapeAttr(c.certId)}">
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

window.saveCertificationEntry = async function(e) {
    e.preventDefault();
    const entry = {
        name: getVal('certName'),
        issuer: getVal('certIssuer'),
        year: getVal('certYear'),
        certId: getVal('certId')
    };
    if (editingCertIndex === null) profileData.certifications.push(entry);
    else profileData.certifications[editingCertIndex] = entry;
    try {
        await saveProfile();
        renderCertificationsTable();
        updateProgress();
        renderProgress();
        closeModal();
        showMessage('✅ Certification saved!', 'success');
    } catch (err) { showMessage('❌ ' + err.message, 'error'); }
};

window.deleteCertification = async function(i) {
    if (!confirm('Delete this certification?')) return;
    profileData.certifications.splice(i, 1);
    try {
        await saveProfile();
        renderCertificationsTable();
        updateProgress();
        renderProgress();
    } catch (err) { showMessage('❌ ' + err.message, 'error'); }
};

// ============================================
// EXPERIENCE TABLE
// ============================================
function renderExperienceTable() {
    const tbody = document.getElementById('experienceTableBody');
    const list = (profileData.experience && profileData.experience.entries) || [];
    if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="empty-row">No experience added yet</td></tr>`;
        return;
    }
    tbody.innerHTML = list.map((e, i) => `
        <tr>
            <td>${escapeHtml(e.employer)}</td>
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
    if (!profileData.experience) profileData.experience = { has: true, overall: 0, industry: 0, entries: [] };
    profileData.experience.has = has;
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
                <div class="field full">
                    <label>Job Description / Key Responsibilities (Optional)</label>
                    <textarea id="expDescription" rows="4" maxlength="1000" placeholder="• Managed payroll for 200+ employees&#10;• Handled recruitment and onboarding&#10;• Prepared monthly HR reports"></textarea>
                    <small class="char-count"><span id="expDescCount">0</span> / 1000 characters</small>
                </div>
            </div>
            <div class="form-actions">
                <button type="button" class="btn-prev" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn-save">Save</button>
            </div>
        </form>
    `;
    const ta = document.getElementById('expDescription');
    if (ta) ta.addEventListener('input', () => {
        document.getElementById('expDescCount').textContent = ta.value.length;
    });
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
                <div class="field full">
                    <label>Job Description / Key Responsibilities (Optional)</label>
                    <textarea id="expDescription" rows="4" maxlength="1000">${escapeHtml(e.description || '')}</textarea>
                    <small class="char-count"><span id="expDescCount">${(e.description || '').length}</span> / 1000 characters</small>
                </div>
            </div>
            <div class="form-actions">
                <button type="button" class="btn-prev" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn-save">Update</button>
            </div>
        </form>
    `;
    const ta = document.getElementById('expDescription');
    if (ta) ta.addEventListener('input', () => {
        document.getElementById('expDescCount').textContent = ta.value.length;
    });
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
        contact: getVal('expContact'),
        description: getVal('expDescription')
    };
    if (!profileData.experience) profileData.experience = { has: true, overall: 0, industry: 0, entries: [] };
    if (!profileData.experience.entries) profileData.experience.entries = [];
    if (editingExpIndex === null) profileData.experience.entries.push(entry);
    else profileData.experience.entries[editingExpIndex] = entry;
    profileData.experience.overall = Number(getVal('overallExp')) || 0;
    profileData.experience.industry = Number(getVal('industryExp')) || 0;
    try {
        await saveProfile();
        renderExperienceTable();
        updateProgress();
        renderProgress();
        closeModal();
        showMessage('✅ Experience saved!', 'success');
    } catch (err) { showMessage('❌ ' + err.message, 'error'); }
};

window.deleteExperience = async function(i) {
    if (!confirm('Delete this experience entry?')) return;
    profileData.experience.entries.splice(i, 1);
    try {
        await saveProfile();
        renderExperienceTable();
        updateProgress();
        renderProgress();
    } catch (err) { showMessage('❌ ' + err.message, 'error'); }
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
    if (editingSkillIndex === null) profileData.skills.push(entry);
    else profileData.skills[editingSkillIndex] = entry;
    try {
        await saveProfile();
        renderSkillsTable();
        updateProgress();
        renderProgress();
        closeModal();
        showMessage('✅ Skill saved!', 'success');
    } catch (err) { showMessage('❌ ' + err.message, 'error'); }
};

window.deleteSkill = async function(i) {
    if (!confirm('Delete this skill?')) return;
    profileData.skills.splice(i, 1);
    try {
        await saveProfile();
        renderSkillsTable();
        updateProgress();
        renderProgress();
    } catch (err) { showMessage('❌ ' + err.message, 'error'); }
};

// ============================================
// MODAL CONTROL
// ============================================
function openModal() { document.getElementById('modalOverlay').classList.add('show'); }
window.closeModal = function() { document.getElementById('modalOverlay').classList.remove('show'); };

// ============================================
// TOGGLES
// ============================================
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
        ['saObjective', 'c1'],
        ['saStrengths', 'c2'],
        ['saImprovements', 'c3'],
        ['saSummary', 'c4']
    ];
    map.forEach(([inputId, countId]) => {
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
    }, 5000);
}
