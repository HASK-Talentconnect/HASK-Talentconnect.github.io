/* ============================================
   HASK TalentConnect - Complete Data
   Industries + Languages + Skills + Locations
   ============================================ */

// ============================================
// INDUSTRIES LIST
// ============================================
export const INDUSTRIES = [
    "Accounting & Finance",
    "Advertising & Marketing",
    "Agriculture & Farming",
    "Automotive",
    "Banking & Financial Services",
    "Chemicals",
    "Construction & Real Estate",
    "Consulting",
    "Customer Service & BPO",
    "Education & Training",
    "Engineering",
    "Food & Beverage",
    "Government & Public Sector",
    "Healthcare & Medical",
    "Hospitality & Tourism",
    "HR & Admin",
    "IT & Software",
    "Legal",
    "Logistics & Supply Chain",
    "Manufacturing",
    "Media & Entertainment",
    "Mining & Metals",
    "NGO & Social Services",
    "Oil & Gas",
    "Pharmaceuticals",
    "Retail & Wholesale",
    "Sales & Marketing",
    "Security Services",
    "Telecom",
    "Textile & Garments",
    "Transportation",
    "Utilities (Power, Water)",
    "Warehousing",
    "Other"
];

// ============================================
// PAKISTAN LANGUAGES
// ============================================
export const LANGUAGES = [
    "Urdu",
    "English",
    "Punjabi",
    "Pashto",
    "Sindhi",
    "Saraiki",
    "Balochi",
    "Hindko",
    "Kashmiri",
    "Brahvi",
    "Shina",
    "Balti",
    "Khowar",
    "Wakhi",
    "Arabic",
    "Persian/Farsi",
    "Other"
];

// ============================================
// SKILLS DATABASE (Pakistan)
// ============================================
export const SKILLS_DB = [
    // IT & Software
    "JavaScript", "Python", "Java", "PHP", "C++", "C#", "React", "Node.js", "Angular", "Vue.js",
    "HTML", "CSS", "Bootstrap", "Tailwind CSS", "TypeScript", "SQL", "MySQL", "MongoDB", "PostgreSQL",
    "Firebase", "AWS", "Azure", "Google Cloud", "Docker", "Kubernetes", "Git", "GitHub",
    "Web Development", "Mobile App Development", "Android Development", "iOS Development", "Flutter",
    "React Native", "UI/UX Design", "Graphic Design", "Photoshop", "Illustrator", "Figma",
    "SEO", "Digital Marketing", "Google Ads", "Facebook Ads", "Content Writing", "Copywriting",
    "Video Editing", "Premiere Pro", "After Effects", "Data Analysis", "Data Science", "Machine Learning",
    "Artificial Intelligence", "Cybersecurity", "Ethical Hacking", "Networking", "CCNA", "Linux",
    
    // HR & Admin
    "Recruitment", "Talent Acquisition", "Payroll Processing", "HR Policies", "Employee Relations",
    "Performance Management", "Compensation & Benefits", "Training & Development", "HRIS", "Onboarding",
    "Interviewing", "HR Compliance", "Labor Law", "Conflict Resolution", "Office Administration",
    "Documentation", "Filing", "Scheduling", "Email Management", "MS Office", "MS Excel", "MS Word",
    "PowerPoint", "Google Workspace", "Data Entry",
    
    // Accounting & Finance
    "Bookkeeping", "Financial Reporting", "Taxation", "Auditing", "Budgeting", "Forecasting",
    "Accounts Payable", "Accounts Receivable", "Payroll", "QuickBooks", "Tally", "SAP FICO",
    "Financial Analysis", "Cash Flow Management", "Cost Accounting", "Internal Controls",
    
    // Sales & Marketing
    "Sales", "Business Development", "Lead Generation", "Cold Calling", "Negotiation", "Customer Service",
    "Client Relationship", "Market Research", "Brand Management", "Product Marketing", "B2B Sales",
    "B2C Sales", "Retail Sales", "Channel Sales", "Key Account Management", "CRM", "Salesforce",
    
    // Engineering
    "AutoCAD", "SolidWorks", "MATLAB", "Civil Engineering", "Mechanical Engineering", "Electrical Engineering",
    "Project Management", "Site Supervision", "Quality Control", "Production Planning", "Maintenance",
    "PLC Programming", "SCADA", "HVAC", "Welding", "Machining", "CNC Operation", "3D Printing",
    
    // Healthcare
    "Patient Care", "Medical Coding", "First Aid", "CPR", "Vital Signs Monitoring", "Phlebotomy",
    "Medication Administration", "EMR Systems", "Clinical Research", "Diagnosis", "Medical Records",
    
    // Education
    "Teaching", "Curriculum Development", "Lesson Planning", "Classroom Management", "Student Assessment",
    "Online Teaching", "Zoom", "Google Classroom", "Special Education", "Educational Technology",
    
    // Construction & Labor
    "Masonry", "Carpentry", "Plumbing", "Electrical Wiring", "Painting", "Tiling", "Steel Fixing",
    "Scaffolding", "Concrete Work", "Plastering", "Heavy Equipment Operation", "Crane Operation",
    
    // Transport & Driver
    "Driving", "Heavy Vehicle Driving", "Delivery", "Route Planning", "Vehicle Maintenance",
    "Forklift Operation", "Cargo Handling",
    
    // Hospitality
    "Cooking", "Baking", "Food Preparation", "Customer Service", "Bartending", "Barista", "Housekeeping",
    "Front Desk", "Event Planning",
    
    // Security
    "Security Guarding", "CCTV Monitoring", "Access Control", "Patrolling", "Emergency Response",
    "Fire Safety", "First Aid",
    
    // Textile & Manufacturing
    "Tailoring", "Stitching", "Embroidery", "Quality Checking", "Weaving", "Dyeing", "Pattern Making",
    "Machine Operation", "Assembly", "Packaging", "Inventory Management", "Warehouse Operations",
    
    // Soft Skills
    "Communication", "Teamwork", "Time Management", "Problem Solving", "Leadership", "Critical Thinking",
    "Adaptability", "Creativity", "Work Ethic", "Attention to Detail", "Multitasking", "Decision Making",
    "Conflict Management", "Presentation Skills", "Public Speaking"
];

// ============================================
// JOB TITLES BY INDUSTRY (For AI Title Generation)
// ============================================
export const JOB_TITLES_DB = {
    "Accounting & Finance": ["Accountant","Senior Accountant","Accounts Manager","Finance Manager","Auditor","Cashier","Financial Analyst","Tax Consultant"],
    "Agriculture & Farming": ["Farm Manager","Agriculture Officer","Agronomist","Livestock Supervisor","Veterinary Doctor","Poultry Supervisor"],
    "Automotive": ["Auto Mechanic","Diesel Mechanic","Auto Electrician","Service Advisor","Automotive Technician"],
    "Banking & Financial Services": ["Bank Officer","Branch Manager","Relationship Manager","Cash Officer","Credit Analyst","Teller"],
    "Construction & Real Estate": ["Civil Engineer","Site Engineer","Site Supervisor","Mason","Carpenter","Painter","Plumber","Steel Fixer","Quantity Surveyor"],
    "Consulting": ["Business Consultant","Management Consultant","Strategy Consultant","HR Consultant"],
    "Customer Service & BPO": ["Customer Service Representative","Call Center Agent","Customer Support Executive","Team Lead (BPO)"],
    "Education & Training": ["Teacher","Senior Teacher","Lecturer","Professor","Principal","Tutor","Trainer","Education Coordinator"],
    "Engineering": ["Mechanical Engineer","Electrical Engineer","Civil Engineer","Chemical Engineer","Industrial Engineer","Project Engineer"],
    "Food & Beverage": ["Chef","Head Chef","Cook","Baker","Waiter","Barista","Restaurant Manager"],
    "Government & Public Sector": ["Clerk","Patwari","Police Officer","Inspector","Postmaster","Tehsildar","Tax Officer"],
    "Healthcare & Medical": ["Doctor","Nurse","Staff Nurse","Pharmacist","Lab Technician","Physiotherapist","Radiologist","Medical Officer"],
    "Hospitality & Tourism": ["Hotel Manager","Front Desk Officer","Housekeeping Supervisor","Chef","Tour Guide","Receptionist"],
    "HR & Admin": ["HR Manager","HR Executive","HR Officer","HR Assistant","HR Coordinator","Admin Manager","Admin Officer","Receptionist","Recruiter"],
    "IT & Software": ["Software Engineer","Software Developer","Web Developer","Mobile App Developer","Frontend Developer","Backend Developer","Full Stack Developer","QA Engineer","DevOps Engineer","Data Analyst","Data Scientist","UI/UX Designer","IT Support Engineer","Network Administrator","System Administrator","Cybersecurity Analyst"],
    "Legal": ["Lawyer","Advocate","Legal Advisor","Paralegal","Legal Assistant"],
    "Logistics & Supply Chain": ["Logistics Manager","Supply Chain Manager","Warehouse Supervisor","Store Keeper","Dispatch Officer","Procurement Officer"],
    "Manufacturing": ["Production Manager","Production Supervisor","Machine Operator","Quality Inspector","Quality Control Officer","Shift Supervisor","Industrial Engineer"],
    "Media & Entertainment": ["Journalist","Content Writer","Video Editor","Photographer","News Anchor","Graphic Designer"],
    "Mining & Metals": ["Mining Engineer","Geologist","Mine Supervisor","Metallurgist"],
    "NGO & Social Services": ["Project Manager","Field Officer","Social Worker","Program Coordinator","Community Mobilizer"],
    "Oil & Gas": ["Petroleum Engineer","Drilling Engineer","Pipeline Engineer","Rig Worker","HSE Officer","Process Operator"],
    "Pharmaceuticals": ["Pharmacist","Production Pharmacist","QA Officer","QC Officer","Medical Representative"],
    "Retail & Wholesale": ["Shopkeeper","Sales Associate","Store Manager","Cashier","Inventory Manager","Merchandiser"],
    "Sales & Marketing": ["Sales Manager","Sales Executive","Salesman","Marketing Manager","Marketing Executive","Business Development Executive","Digital Marketing Specialist","SEO Specialist"],
    "Security Services": ["Security Guard","Senior Security Guard","Security Supervisor","CCTV Operator","Bodyguard"],
    "Telecom": ["Telecom Engineer","Telecom Technician","Network Engineer","RF Engineer","BTS Technician","Fiber Optic Technician"],
    "Textile & Garments": ["Tailor","Master Tailor","Stitcher","Quality Checker","Weaver","Dyer","Pattern Master","Textile Engineer"],
    "Transportation": ["Driver","Truck Driver","Trailer Driver","Bus Driver","Delivery Rider","Forklift Operator"],
    "Utilities (Power, Water)": ["Power Plant Operator","Grid Station Operator","Electrical Technician","Lineman","Water Treatment Operator"],
    "Warehousing": ["Warehouse Manager","Warehouse Supervisor","Inventory Controller","Packer","Picker"]
};

// ============================================
// UNIVERSITIES OF PAKISTAN
// ============================================
export const UNIVERSITIES = [
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
    "University of Veterinary & Animal Sciences, Lahore","Virtual University of Pakistan",
    "Other"
];

// ============================================
// PAKISTAN PROVINCES → DISTRICTS → TEHSILS + POSTAL
// ============================================
export const PAKISTAN_DATA = {
    "Punjab": {
        "Attock": { tehsils: ["Attock","Fateh Jang","Hazro","Hassan Abdal","Jand","Pindi Gheb"], postal: "43600" },
        "Bahawalnagar": { tehsils: ["Bahawalnagar","Chishtian","Fort Abbas","Haroonabad","Minchinabad"], postal: "62300" },
        "Bahawalpur": { tehsils: ["Bahawalpur","Ahmadpur East","Hasilpur","Khairpur Tamewali","Yazman"], postal: "63100" },
        "Bhakkar": { tehsils: ["Bhakkar","Darya Khan","Kaloorkot","Mankera"], postal: "30000" },
        "Chakwal": { tehsils: ["Chakwal","Choa Saidan Shah","Kallar Kahar","Talagang"], postal: "48800" },
        "Chiniot": { tehsils: ["Chiniot","Bhawana","Lalian"], postal: "35400" },
        "Dera Ghazi Khan": { tehsils: ["D.G. Khan","Taunsa","Kot Chutta"], postal: "32200" },
        "Faisalabad": { tehsils: ["Faisalabad City","Faisalabad Sadar","Chak Jhumra","Jaranwala","Samundri","Tandlianwala"], postal: "38000" },
        "Gujranwala": { tehsils: ["Gujranwala","Kamoke","Nowshera Virkan","Wazirabad"], postal: "52250" },
        "Gujrat": { tehsils: ["Gujrat","Kharian","Sarai Alamgir"], postal: "50700" },
        "Hafizabad": { tehsils: ["Hafizabad","Pindi Bhattian"], postal: "52110" },
        "Jhang": { tehsils: ["Jhang","Ahmadpur Sial","Shorkot"], postal: "35200" },
        "Jhelum": { tehsils: ["Jhelum","Dina","Pind Dadan Khan","Sohawa"], postal: "49600" },
        "Kasur": { tehsils: ["Kasur","Chunian","Kot Radha Kishan","Pattoki"], postal: "55050" },
        "Khanewal": { tehsils: ["Khanewal","Jahanian","Kabirwala","Mian Channu"], postal: "58150" },
        "Khushab": { tehsils: ["Khushab","Noorpur Thal","Quaidabad"], postal: "41000" },
        "Lahore": { tehsils: ["Lahore Cantt","Lahore City","Model Town","Raiwind","Shalimar"], postal: "54000" },
        "Layyah": { tehsils: ["Layyah","Chaubara","Karor Lal Esan"], postal: "31200" },
        "Lodhran": { tehsils: ["Lodhran","Dunyapur","Kahror Pacca"], postal: "59320" },
        "Mandi Bahauddin": { tehsils: ["Mandi Bahauddin","Malakwal","Phalia"], postal: "50400" },
        "Mianwali": { tehsils: ["Mianwali","Isakhel","Piplan"], postal: "42200" },
        "Multan": { tehsils: ["Multan City","Multan Sadar","Jalalpur Pirwala","Shujabad"], postal: "60000" },
        "Muzaffargarh": { tehsils: ["Muzaffargarh","Alipur","Jatoi","Kot Addu"], postal: "34200" },
        "Nankana Sahib": { tehsils: ["Nankana Sahib","Sangla Hill","Shah Kot"], postal: "39100" },
        "Narowal": { tehsils: ["Narowal","Shakargarh","Zafarwal"], postal: "51600" },
        "Okara": { tehsils: ["Okara","Depalpur","Renala Khurd"], postal: "56300" },
        "Pakpattan": { tehsils: ["Pakpattan","Arifwala"], postal: "57400" },
        "Rahim Yar Khan": { tehsils: ["Rahim Yar Khan","Khanpur","Liaquatpur","Sadiqabad"], postal: "64200" },
        "Rajanpur": { tehsils: ["Rajanpur","Jampur","Rojhan"], postal: "33500" },
        "Rawalpindi": { tehsils: ["Rawalpindi","Gujar Khan","Kahuta","Kallar Syedan","Kotli Sattian","Murree","Taxila"], postal: "46000" },
        "Sahiwal": { tehsils: ["Sahiwal","Chichawatni"], postal: "57000" },
        "Sargodha": { tehsils: ["Sargodha","Bhalwal","Kot Momin","Shahpur","Sillanwali"], postal: "40100" },
        "Sheikhupura": { tehsils: ["Sheikhupura","Ferozewala","Muridke","Sharaqpur","Kot Abdul Malik"], postal: "39350" },
        "Sialkot": { tehsils: ["Sialkot","Daska","Pasrur","Sambrial"], postal: "51310" },
        "Toba Tek Singh": { tehsils: ["Toba Tek Singh","Gojra","Kamalia","Pir Mahal"], postal: "36000" },
        "Vehari": { tehsils: ["Vehari","Burewala","Mailsi"], postal: "61100" }
    },
    "Sindh": {
        "Badin": { tehsils: ["Badin","Golarchi","Matli","Talhar","Tando Bago"], postal: "72100" },
        "Dadu": { tehsils: ["Dadu","Johi","Khairpur Nathan Shah","Mehar"], postal: "76200" },
        "Ghotki": { tehsils: ["Ghotki","Daharki","Mirpur Mathelo","Ubauro"], postal: "65010" },
        "Hyderabad": { tehsils: ["Hyderabad City","Hyderabad Rural","Latifabad","Qasimabad"], postal: "71000" },
        "Jacobabad": { tehsils: ["Jacobabad","Garhi Khairo","Thul"], postal: "79000" },
        "Jamshoro": { tehsils: ["Jamshoro","Kotri","Manjhand","Sehwan"], postal: "76090" },
        "Karachi Central": { tehsils: ["Gulberg","Liaquatabad","Nazimabad","North Nazimabad"], postal: "74700" },
        "Karachi East": { tehsils: ["Gulshan","Jamshed","Gulzar-e-Hijri"], postal: "75300" },
        "Karachi South": { tehsils: ["Aram Bagh","Civil Line","Garden","Lyari","Saddar"], postal: "74400" },
        "Karachi West": { tehsils: ["Baldia","Manghopir","Orangi","Site"], postal: "75800" },
        "Kashmore": { tehsils: ["Kandhkot","Kashmore","Tangwani"], postal: "79300" },
        "Khairpur": { tehsils: ["Khairpur","Faiz Ganj","Gambat","Kot Diji","Nara","Sobho Dero"], postal: "66020" },
        "Korangi": { tehsils: ["Korangi","Landhi","Model Colony","Shah Faisal"], postal: "74900" },
        "Larkana": { tehsils: ["Larkana","Bakrani","Dokri","Kambar","Ratodero","Shahdadkot"], postal: "77150" },
        "Malir": { tehsils: ["Bin Qasim","Gadap","Malir","Quaidabad"], postal: "75080" },
        "Matiari": { tehsils: ["Matiari","Hala","Saeedabad"], postal: "76100" },
        "Mirpur Khas": { tehsils: ["Mirpur Khas","Digri","Jhuddo","Kot Ghulam Muhammad","Sindhri"], postal: "69000" },
        "Naushahro Feroze": { tehsils: ["Naushahro Feroze","Bhiria","Kandiaro","Moro"], postal: "67450" },
        "Sanghar": { tehsils: ["Sanghar","Jam Nawaz Ali","Khipro","Shahdadpur","Sinjhoro","Tando Adam"], postal: "68100" },
        "Shaheed Benazirabad": { tehsils: ["Nawabshah","Daur","Kazi Ahmed","Sakrand"], postal: "67450" },
        "Shikarpur": { tehsils: ["Shikarpur","Garhi Yasin","Khanpur","Lakhi"], postal: "78100" },
        "Sukkur": { tehsils: ["Sukkur","New Sukkur","Pano Aqil","Rohri","Salehpat"], postal: "65200" },
        "Tando Allahyar": { tehsils: ["Tando Allahyar","Chambar","Jhando Mari"], postal: "70700" },
        "Tando Muhammad Khan": { tehsils: ["Tando Muhammad Khan","Bulri Shah Karim"], postal: "70050" },
        "Tharparkar": { tehsils: ["Mithi","Chachro","Diplo","Islamkot","Nagar Parkar"], postal: "69200" },
        "Thatta": { tehsils: ["Thatta","Ghorabari","Keti Bunder","Mirpur Sakro"], postal: "73130" },
        "Umerkot": { tehsils: ["Umerkot","Kunri","Pithoro","Samaro"], postal: "69100" }
    },
    "Khyber Pakhtunkhwa": {
        "Abbottabad": { tehsils: ["Abbottabad","Havelian","Lora"], postal: "22010" },
        "Bannu": { tehsils: ["Bannu","Domel","Miryan","Wazir"], postal: "28100" },
        "Battagram": { tehsils: ["Battagram","Allai"], postal: "21230" },
        "Buner": { tehsils: ["Daggar","Gadezai","Khudu Khel","Mandanr"], postal: "19290" },
        "Charsadda": { tehsils: ["Charsadda","Shabqadar","Tangi"], postal: "24420" },
        "Chitral": { tehsils: ["Chitral","Mastuj"], postal: "17200" },
        "Dera Ismail Khan": { tehsils: ["D.I. Khan","Kulachi","Paharpur","Paroa"], postal: "29050" },
        "Hangu": { tehsils: ["Hangu","Thall"], postal: "26100" },
        "Haripur": { tehsils: ["Haripur","Ghazi","Khanpur"], postal: "22620" },
        "Karak": { tehsils: ["Karak","Banda Daud Shah","Takht-e-Nasrati"], postal: "27200" },
        "Kohat": { tehsils: ["Kohat","Lachi"], postal: "26000" },
        "Lakki Marwat": { tehsils: ["Lakki Marwat","Naurang"], postal: "28420" },
        "Lower Dir": { tehsils: ["Timergara","Balambat","Adenzai"], postal: "18300" },
        "Malakand": { tehsils: ["Batkhela","Dargai","Sam Ranizai"], postal: "23100" },
        "Mansehra": { tehsils: ["Mansehra","Balakot","Oghi","Baffa Pakhal"], postal: "21300" },
        "Mardan": { tehsils: ["Mardan","Takht Bhai","Katlang","Shergarh"], postal: "23200" },
        "Nowshera": { tehsils: ["Nowshera","Pabbi","Jehangira"], postal: "24100" },
        "Peshawar": { tehsils: ["Peshawar","Peshawar Cantt","Badaber","Mathra"], postal: "25000" },
        "Shangla": { tehsils: ["Alpuri","Bisham","Chakesar","Puran"], postal: "19500" },
        "Swabi": { tehsils: ["Swabi","Lahor","Razzar","Topi"], postal: "23530" },
        "Swat": { tehsils: ["Mingora","Babuzai","Barikot","Kabal","Khwazakhela","Matta"], postal: "19130" },
        "Tank": { tehsils: ["Tank","Jandola"], postal: "29200" },
        "Upper Dir": { tehsils: ["Dir","Wari","Sheringal","Barawal"], postal: "18000" }
    },
    "Balochistan": {
        "Awaran": { tehsils: ["Awaran","Mashkay"], postal: "93000" },
        "Chagai": { tehsils: ["Chagai","Dalbandin","Nokundi","Taftan"], postal: "95100" },
        "Chaman": { tehsils: ["Chaman"], postal: "86000" },
        "Dera Bugti": { tehsils: ["Dera Bugti","Sui","Phelawagh"], postal: "80500" },
        "Gwadar": { tehsils: ["Gwadar","Jiwani","Ormara","Pasni"], postal: "91200" },
        "Jaffarabad": { tehsils: ["Dera Allah Yar","Usta Muhammad","Gandakha"], postal: "80300" },
        "Kalat": { tehsils: ["Kalat","Manguchar","Surab"], postal: "88300" },
        "Kech": { tehsils: ["Turbat","Buleda","Dasht","Mand"], postal: "92600" },
        "Kharan": { tehsils: ["Kharan"], postal: "94100" },
        "Khuzdar": { tehsils: ["Khuzdar","Moola","Nal","Wadh","Zehri"], postal: "89100" },
        "Killa Abdullah": { tehsils: ["Chaman","Dobandi","Gulistan"], postal: "86100" },
        "Lasbela": { tehsils: ["Bela","Uthal","Hub","Dureji","Winder"], postal: "90050" },
        "Loralai": { tehsils: ["Loralai","Duki","Mekhtar"], postal: "84800" },
        "Mastung": { tehsils: ["Mastung","Khada Koocha","Dasht"], postal: "88400" },
        "Nushki": { tehsils: ["Nushki","Dak"], postal: "94200" },
        "Panjgur": { tehsils: ["Panjgur","Gichk","Parome"], postal: "93000" },
        "Pishin": { tehsils: ["Pishin","Barshore","Karezat"], postal: "86500" },
        "Quetta": { tehsils: ["Quetta City","Quetta Sadar","Chiltan","Zarghoon"], postal: "87300" },
        "Sibi": { tehsils: ["Sibi","Harnai","Kutmandai","Lehri"], postal: "82000" },
        "Zhob": { tehsils: ["Zhob","Killa Saifullah","Sherani"], postal: "85200" }
    },
    "Islamabad Capital Territory": {
        "Islamabad": { tehsils: ["Islamabad Urban","Islamabad Rural"], postal: "44000" }
    },
    "Gilgit-Baltistan": {
        "Astore": { tehsils: ["Astore","Shounter"], postal: "14100" },
        "Diamer": { tehsils: ["Chilas","Darel","Tangir"], postal: "14000" },
        "Ghanche": { tehsils: ["Khaplu","Mashabrum"], postal: "16800" },
        "Ghizer": { tehsils: ["Gahkuch","Punial","Ishkoman"], postal: "15200" },
        "Gilgit": { tehsils: ["Gilgit","Danyore","Juglot"], postal: "15100" },
        "Hunza": { tehsils: ["Aliabad","Gulmit","Sost"], postal: "15700" },
        "Nagar": { tehsils: ["Nagar","Chalt"], postal: "15500" },
        "Skardu": { tehsils: ["Skardu","Shigar","Kharmang"], postal: "16100" }
    },
    "Azad Jammu & Kashmir": {
        "Bagh": { tehsils: ["Bagh","Dhir Kot","Hari Ghel"], postal: "12500" },
        "Bhimber": { tehsils: ["Bhimber","Barnala","Samahni"], postal: "12200" },
        "Kotli": { tehsils: ["Kotli","Charhoi","Khuiratta","Sehnsa"], postal: "12000" },
        "Mirpur": { tehsils: ["Mirpur","Dadyal","Chakswari"], postal: "10250" },
        "Muzaffarabad": { tehsils: ["Muzaffarabad","Nasirabad","Ghori"], postal: "13100" },
        "Poonch": { tehsils: ["Rawalakot","Hajira","Abbaspur"], postal: "12350" },
        "Sudhnoti": { tehsils: ["Pallandri","Baloch","Tarar Khel"], postal: "12200" }
    }
};

// ============================================
// COUNTRIES
// ============================================
export const COUNTRIES = [
    "Pakistan","Afghanistan","Albania","Algeria","Argentina","Australia","Austria","Azerbaijan","Bahrain","Bangladesh",
    "Belgium","Bhutan","Bolivia","Bosnia and Herzegovina","Brazil","Brunei","Bulgaria","Cambodia","Cameroon","Canada",
    "Chad","Chile","China","Colombia","Croatia","Cuba","Cyprus","Czech Republic","Denmark","Ecuador","Egypt",
    "Ethiopia","Finland","France","Georgia","Germany","Ghana","Greece","Hungary","Iceland","India","Indonesia",
    "Iran","Iraq","Ireland","Italy","Japan","Jordan","Kazakhstan","Kenya","Kuwait","Kyrgyzstan","Lebanon",
    "Libya","Malaysia","Maldives","Malta","Mexico","Monaco","Mongolia","Morocco","Myanmar","Nepal","Netherlands",
    "New Zealand","Nigeria","North Korea","Norway","Oman","Palestine","Panama","Peru","Philippines","Poland",
    "Portugal","Qatar","Romania","Russia","Saudi Arabia","Singapore","Slovakia","Slovenia","Somalia","South Africa",
    "South Korea","Spain","Sri Lanka","Sudan","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania",
    "Thailand","Tunisia","Turkey","Turkmenistan","Uganda","Ukraine","United Arab Emirates","United Kingdom",
    "United States","Uzbekistan","Venezuela","Vietnam","Yemen","Zambia","Zimbabwe","Other"
];

// ============================================
// HELPER FUNCTIONS
// ============================================
export function getProvinces() { return Object.keys(PAKISTAN_DATA); }
export function getDistricts(province) { return PAKISTAN_DATA[province] ? Object.keys(PAKISTAN_DATA[province]) : []; }
export function getTehsils(province, district) {
    if (!PAKISTAN_DATA[province] || !PAKISTAN_DATA[province][district]) return [];
    return PAKISTAN_DATA[province][district].tehsils || [];
}
export function getPostalCode(province, district) {
    if (!PAKISTAN_DATA[province] || !PAKISTAN_DATA[province][district]) return '';
    return PAKISTAN_DATA[province][district].postal || '';
}
export function getAllTitles() {
    const all = [];
    Object.values(JOB_TITLES_DB).forEach(t => all.push(...t));
    return all;
}
export function searchSkills(keyword) {
    if (!keyword) return [];
    const k = keyword.toLowerCase();
    return SKILLS_DB.filter(s => s.toLowerCase().includes(k));
}
