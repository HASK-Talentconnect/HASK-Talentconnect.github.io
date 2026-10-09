/* ============================================
   HASK Talent Connect - Complete Data File
   Final Version — No Errors
   
   Exports:
   - STRENGTHS_LIST (40 items)
   - PROFESSIONAL_TITLES (150+ items)
   - INDUSTRIES (34 items)
   - LANGUAGES (17 items)
   - SKILLS_DB (400+ items)
   - JOB_TITLES_DB (by industry)
   - UNIVERSITIES (45 items)
   - PAKISTAN_DATA (provinces → districts → tehsils + postal)
   - COUNTRIES (100+)
   
   Helper functions:
   - getProvinces()
   - getDistricts(province)
   - getTehsils(province, district)
   - getPostalCode(province, district)
   - getAllTitles()
   - searchSkills(keyword)
   ============================================ */

// ============================================
// STRENGTHS LIST (40 common professional)
// ============================================
export const STRENGTHS_LIST = [
    "Administration",
    "Communication Skills",
    "Computer Skills (MS Office)",
    "Employee Relations",
    "Time Management",
    "Problem Solving",
    "Team Leadership",
    "Attention to Detail",
    "Multitasking",
    "Adaptability",
    "Critical Thinking",
    "Creativity",
    "Decision Making",
    "Conflict Resolution",
    "Customer Service Orientation",
    "Negotiation Skills",
    "Presentation Skills",
    "Public Speaking",
    "Report Writing",
    "Data Analysis",
    "Project Management",
    "Strategic Planning",
    "Team Building",
    "Mentoring & Coaching",
    "Work Under Pressure",
    "Fast Learner",
    "Self-Motivated",
    "Honest & Reliable",
    "Punctual & Disciplined",
    "Positive Attitude",
    "Quick Decision Making",
    "Problem Identification",
    "Resource Management",
    "Interpersonal Skills",
    "Active Listening",
    "Patience & Empathy",
    "Leadership Qualities",
    "Delegation Skills",
    "Quality Focus",
    "Safety Consciousness"
];

// ============================================
// PROFESSIONAL TITLES (Suggestions for Self Assessment)
// ============================================
export const PROFESSIONAL_TITLES = [
    // Accounting & Finance
    "Accountant", "Senior Accountant", "Accounts Manager", "Finance Manager", "Auditor",
    "Cashier", "Financial Analyst", "Tax Consultant",

    // HR & Admin
    "HR Manager", "Senior HR Manager", "HR Executive", "HR Officer", "HR Assistant",
    "HR Coordinator", "HR Specialist", "Recruiter", "Talent Acquisition Specialist",
    "Admin Manager", "Admin Officer", "Admin Executive", "Admin Assistant",
    "Office Manager", "Receptionist", "Front Desk Officer",

    // IT & Software
    "Software Engineer", "Senior Software Engineer", "Software Developer",
    "Web Developer", "Frontend Developer", "Backend Developer", "Full Stack Developer",
    "Mobile App Developer", "Android Developer", "iOS Developer", "Flutter Developer",
    "React Developer", "Node.js Developer", "PHP Developer", "Python Developer",
    "Database Administrator", "System Administrator", "Network Administrator",
    "Network Engineer", "IT Support Engineer", "DevOps Engineer", "Cloud Engineer",
    "QA Engineer", "QA Tester", "UI/UX Designer", "Graphic Designer",
    "Data Analyst", "Data Scientist", "ML Engineer", "Cybersecurity Analyst",

    // Engineering
    "Mechanical Engineer", "Mechanical Technician", "Senior Mechanical Technician",
    "Fitter", "Turner", "Machinist", "Welder", "Millwright",
    "Electrical Engineer", "Electrical Technician", "Electrician", "Wireman", "Lineman",
    "Instrument Technician", "Civil Engineer", "Site Engineer", "Site Supervisor",
    "Mason", "Carpenter", "Plumber", "Painter", "Steel Fixer",
    "Production Manager", "Production Supervisor", "Machine Operator",
    "Quality Inspector", "Quality Control Officer", "Industrial Engineer",

    // Sales & Marketing
    "Sales Manager", "Senior Sales Manager", "Area Sales Manager",
    "Sales Executive", "Sales Officer", "Salesman", "Senior Salesman",
    "Marketing Manager", "Marketing Executive", "Business Development Executive",
    "Digital Marketing Specialist", "SEO Specialist", "Content Writer",
    "Customer Service Representative", "Call Center Agent",

    // Education
    "Teacher", "Senior Teacher", "Lecturer", "Professor", "Principal", "Tutor", "Trainer",

    // Healthcare
    "Doctor", "Nurse", "Staff Nurse", "Pharmacist", "Lab Technician",
    "Physiotherapist", "Medical Officer",

    // Transport & Driver
    "Driver", "Truck Driver", "Trailer Driver", "Bus Driver",
    "Delivery Rider", "Forklift Operator", "Heavy Vehicle Driver",

    // Security
    "Security Guard", "Senior Security Guard", "Security Supervisor", "CCTV Operator",

    // Hospitality
    "Chef", "Head Chef", "Cook", "Baker", "Waiter", "Barista", "Housekeeping",

    // Textile
    "Tailor", "Master Tailor", "Stitcher", "Quality Checker", "Weaver", "Dyer",

    // Retail
    "Shopkeeper", "Sales Associate", "Store Manager", "Inventory Manager",

    // Others
    "Farm Manager", "Agriculture Officer", "Livestock Supervisor", "Veterinary Doctor",
    "Telecom Engineer", "Telecom Technician", "BTS Technician",
    "Lawyer", "Advocate", "Legal Advisor", "Paralegal",
    "Journalist", "Video Editor", "Photographer"
];

// ============================================
// INDUSTRIES (34 items)
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
// LANGUAGES (17 items)
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
// SKILLS DATABASE (400+ comprehensive)
// ============================================
export const SKILLS_DB = [
    // ===== IT & Software =====
    "JavaScript", "TypeScript", "Python", "Java", "PHP", "C++", "C#", "Kotlin", "Swift", "Go", "Ruby", "Rust",
    "React", "React Native", "Angular", "Vue.js", "Next.js", "Node.js", "Express.js",
    "Django", "Flask", "Laravel", "Spring Boot", ".NET",
    "HTML", "HTML5", "CSS", "CSS3", "SASS", "Bootstrap", "Tailwind CSS", "Material UI",
    "SQL", "MySQL", "PostgreSQL", "MongoDB", "Oracle", "SQLite", "Redis",
    "Firebase", "Supabase",
    "REST API", "GraphQL", "WebSockets",
    "AWS", "Azure", "Google Cloud", "Docker", "Kubernetes", "Jenkins", "CI/CD",
    "Git", "GitHub", "GitLab", "Bitbucket",
    "Web Development", "Mobile App Development", "Android Development", "iOS Development", "Flutter",
    "UI/UX Design", "Graphic Design", "Photoshop", "Illustrator", "Figma", "Adobe XD", "Sketch", "Canva",
    "WordPress", "Shopify", "WooCommerce", "Magento",
    "QA Testing", "Manual Testing", "Automation Testing", "Selenium", "Cypress", "Jest",
    "Data Analysis", "Data Science", "Machine Learning", "Deep Learning", "Artificial Intelligence",
    "Pandas", "NumPy", "TensorFlow", "PyTorch",
    "Cybersecurity", "Ethical Hacking", "Penetration Testing", "Network Security",
    "Networking", "CCNA", "CCNP", "Linux", "Windows Server", "Active Directory",
    "SEO", "SEM", "Google Ads", "Facebook Ads", "Google Analytics",
    "Digital Marketing", "Content Marketing", "Affiliate Marketing", "Email Marketing",
    "Video Editing", "Premiere Pro", "After Effects", "Final Cut Pro", "Animation", "Motion Graphics",
    "3D Modeling", "Blender", "AutoCAD", "SolidWorks", "SketchUp", "3ds Max",

    // ===== HR & Admin =====
    "Recruitment", "Talent Acquisition", "Headhunting", "Interviewing", "Onboarding", "Exit Interviews",
    "Payroll Processing", "Salary Structures", "Tax & EOBI", "Attendance Management",
    "HR Policies", "Employee Handbook", "HR Compliance", "Labor Law", "Industrial Relations",
    "Performance Management", "KPI Setting", "Appraisal Systems",
    "Compensation & Benefits", "Job Evaluation", "Benchmarking",
    "Training & Development", "Training Needs Analysis", "L&D Program Design",
    "HRIS", "SAP HR", "Oracle HRMS", "Workday", "BambooHR",
    "Employee Relations", "Grievance Handling", "Conflict Resolution", "Disciplinary Procedures",
    "Office Administration", "Documentation", "Filing", "Scheduling", "Email Management", "Travel Arrangements",
    "Event Management", "Meeting Coordination", "Vendor Management",

    // ===== Accounting & Finance =====
    "Bookkeeping", "Financial Reporting", "Financial Analysis", "Financial Modeling",
    "Taxation", "Income Tax Return", "Sales Tax", "Withholding Tax",
    "Auditing", "Internal Audit", "External Audit", "Statutory Audit",
    "Budgeting", "Forecasting", "Variance Analysis", "Cost Accounting", "Costing",
    "Accounts Payable", "Accounts Receivable", "Reconciliation", "Bank Reconciliation",
    "Cash Flow Management", "Treasury", "Fund Management",
    "QuickBooks", "Tally ERP", "SAP FICO", "Peachtree", "Xero", "Wave",
    "Payroll Accounting", "Fixed Assets Management", "Inventory Accounting",
    "IFRS", "GAAP", "Financial Statements", "Balance Sheet", "P&L Analysis",

    // ===== Sales & Marketing =====
    "Sales", "B2B Sales", "B2C Sales", "Retail Sales", "Channel Sales", "Field Sales", "Inside Sales",
    "Business Development", "Lead Generation", "Cold Calling", "Telemarketing", "Door-to-Door Sales",
    "Negotiation", "Closing Deals", "Sales Funnel Management", "Sales Forecasting",
    "Account Management", "Key Account Management", "Customer Retention", "After-Sales Support",
    "CRM", "Salesforce", "HubSpot", "Zoho CRM", "Pipedrive",
    "Market Research", "Competitor Analysis", "Product Launch", "Brand Management", "Positioning",
    "Customer Service", "Complaint Handling", "Client Relationship", "Customer Success",
    "Tender Management", "Government Tenders", "RFQ Preparation",

    // ===== Engineering =====
    "AutoCAD", "SolidWorks", "CATIA", "ANSYS", "MATLAB", "Simulink", "LabVIEW",
    "Civil Engineering", "Structural Engineering", "Geotechnical", "Transportation Engineering",
    "Site Supervision", "Construction Management", "Quantity Surveying", "Estimating",
    "Mechanical Engineering", "Thermodynamics", "Fluid Mechanics", "Machine Design", "CAD/CAM",
    "Electrical Engineering", "Power Systems", "Control Systems", "Instrumentation", "PLC Programming",
    "SCADA", "HMI Programming", "VFD Drives", "Motor Control",
    "HVAC", "Chiller Systems", "Refrigeration", "Air Conditioning",
    "Welding", "Arc Welding", "MIG Welding", "TIG Welding", "Gas Welding",
    "Machining", "Lathe Operation", "Milling", "Grinding", "CNC Operation",
    "Sheet Metal Work", "Fabrication", "Pipe Fitting", "Millwright",
    "Quality Control", "Quality Assurance", "ISO 9001", "Six Sigma", "Lean Manufacturing", "Kaizen", "5S",
    "Production Planning", "Scheduling", "Work Orders", "Shop Floor Management", "Industrial Engineering",

    // ===== Healthcare =====
    "Patient Care", "Vital Signs Monitoring", "Medication Administration", "IV Therapy",
    "Phlebotomy", "Blood Sampling", "ECG", "First Aid", "CPR", "BLS", "ACLS",
    "Medical Coding", "ICD-10", "CPT Coding", "EMR Systems", "HIS",
    "Clinical Research", "Data Collection", "Patient Assessment", "Wound Care", "Emergency Care",

    // ===== Education =====
    "Teaching", "Lesson Planning", "Curriculum Development", "Classroom Management", "Student Assessment",
    "Online Teaching", "Zoom", "Google Classroom", "MS Teams", "LMS Management", "Moodle",
    "Special Education", "Early Childhood Education", "Montessori", "Child Psychology",
    "Educational Technology", "Smart Board", "E-Learning Content", "Academic Advising", "Exam Invigilation",

    // ===== Construction & Labor =====
    "Masonry", "Brick Laying", "Block Work", "Plastering", "Concrete Work", "RCC Work", "Shuttering",
    "Carpentry", "Furniture Making", "Wood Polishing",
    "Plumbing", "Pipe Installation", "Sanitary Fittings", "Leak Repair",
    "Electrical Wiring", "Conduit Installation", "Panel Wiring", "Switch Board Fitting",
    "Painting", "Wall Putty", "Spray Painting", "Texture Painting", "Wallpaper Installation",
    "Tiling", "Marble Fixing", "Granite Fitting", "Pop Work", "False Ceiling",
    "Steel Fixing", "Rebar", "Fabrication (Structural)", "Scaffolding", "Rigger",
    "Heavy Equipment Operation", "Crane Operation", "Excavator Operation", "Bulldozer Operation",

    // ===== Transport & Driver =====
    "Driving", "Heavy Vehicle Driving", "HTV License", "LTV License", "Trailer Driving",
    "Truck Driving", "Bus Driving", "Taxi Driving", "Ride Hailing",
    "Delivery", "Food Delivery", "Parcel Delivery", "Courier",
    "Route Planning", "Vehicle Maintenance", "Forklift Operation", "Cargo Handling",

    // ===== Hospitality =====
    "Cooking", "Continental Cooking", "Desi Cooking", "BBQ", "Baking", "Pastry", "Cake Decoration",
    "Food Preparation", "Food Plating", "Menu Planning", "Food Costing", "Food Safety", "HACCP",
    "Waiter", "Table Service", "Banquet Service", "Room Service", "Bartending", "Barista", "Coffee Making",
    "Housekeeping", "Room Cleaning", "Laundry", "Front Desk", "Guest Relations", "Event Planning",

    // ===== Security =====
    "Security Guarding", "Gatekeeping", "Patrolling", "Access Control", "CCTV Monitoring",
    "Emergency Response", "Fire Fighting", "Fire Safety", "First Aid (Security)", "Bodyguard", "Bouncer",

    // ===== Textile & Manufacturing =====
    "Tailoring", "Stitching", "Embroidery", "Pattern Making", "Cutting", "Fabric Cutting", "Sample Making",
    "Garment Quality Checking", "AQL Inspection", "Final Inspection", "Inline Checking",
    "Weaving", "Loom Operation", "Warping", "Sizing", "Dyeing", "Fabric Dyeing", "Yarn Dyeing", "Printing",
    "Machine Operation", "Assembly", "Packaging", "Labeling", "Barcode Scanner",
    "Inventory Management", "Store Keeping", "Warehouse Operations", "Picking", "Packing",

    // ===== Soft Skills =====
    "Communication", "Verbal Communication", "Written Communication", "Presentations",
    "Teamwork", "Collaboration", "Team Building", "Mentoring",
    "Time Management", "Prioritization", "Multitasking", "Meeting Deadlines",
    "Problem Solving", "Analytical Thinking", "Critical Thinking", "Root Cause Analysis",
    "Leadership", "Supervisory Skills", "Delegation", "Decision Making",
    "Adaptability", "Flexibility", "Learning Agility", "Willingness to Learn",
    "Creativity", "Innovation", "Out-of-the-Box Thinking",
    "Work Ethic", "Professionalism", "Integrity", "Accountability",
    "Attention to Detail", "Accuracy", "Quality Focus", "Precision",
    "Customer Orientation", "Empathy", "Patience", "Conflict Resolution",
    "Stress Management", "Work Under Pressure", "Emotional Intelligence",
    "Negotiation (Soft)", "Persuasion", "Influencing Skills", "Public Speaking (Soft)",

    // ===== Tools =====
    "MS Office", "MS Word", "MS Excel", "MS PowerPoint", "MS Outlook", "MS Access",
    "Google Workspace", "Google Sheets", "Google Docs", "Google Slides", "Google Forms",
    "Slack", "Zoom (Tool)", "MS Teams (Tool)", "Trello", "Asana", "Jira", "Notion", "Monday.com",
    "CapCut", "Google Ads Manager", "Meta Business Suite",

    // ===== Others =====
    "Technical Writing", "Report Writing", "Business Writing", "Email Etiquette",
    "Photography", "Videography", "Drone Operation", "Sound Engineering", "DJ",
    "Bookkeeping (Basic)", "Data Entry", "Typing Speed (40+ WPM)", "Transcription"
];

// ============================================
// JOB TITLES BY INDUSTRY (for AI Title Generation)
// ============================================
export const JOB_TITLES_DB = {
    "Accounting & Finance": [
        "Accountant", "Senior Accountant", "Accounts Manager", "Finance Manager",
        "Auditor", "Cashier", "Financial Analyst", "Tax Consultant"
    ],
    "Agriculture & Farming": [
        "Farm Manager", "Agriculture Officer", "Agronomist",
        "Livestock Supervisor", "Veterinary Doctor", "Poultry Supervisor"
    ],
    "Automotive": [
        "Auto Mechanic", "Diesel Mechanic", "Auto Electrician",
        "Service Advisor", "Automotive Technician"
    ],
    "Banking & Financial Services": [
        "Bank Officer", "Branch Manager", "Relationship Manager",
        "Cash Officer", "Credit Analyst", "Teller"
    ],
    "Construction & Real Estate": [
        "Civil Engineer", "Site Engineer", "Site Supervisor", "Mason",
        "Carpenter", "Painter", "Plumber", "Steel Fixer", "Quantity Surveyor"
    ],
    "Consulting": [
        "Business Consultant", "Management Consultant",
        "Strategy Consultant", "HR Consultant"
    ],
    "Customer Service & BPO": [
        "Customer Service Representative", "Call Center Agent",
        "Customer Support Executive", "Team Lead (BPO)"
    ],
    "Education & Training": [
        "Teacher", "Senior Teacher", "Lecturer", "Professor",
        "Principal", "Tutor", "Trainer", "Education Coordinator"
    ],
    "Engineering": [
        "Mechanical Engineer", "Electrical Engineer", "Civil Engineer",
        "Chemical Engineer", "Industrial Engineer", "Project Engineer"
    ],
    "Food & Beverage": [
        "Chef", "Head Chef", "Cook", "Baker", "Waiter",
        "Barista", "Restaurant Manager"
    ],
    "Government & Public Sector": [
        "Clerk", "Patwari", "Police Officer", "Inspector",
        "Postmaster", "Tehsildar", "Tax Officer"
    ],
    "Healthcare & Medical": [
        "Doctor", "Nurse", "Staff Nurse", "Pharmacist", "Lab Technician",
        "Physiotherapist", "Radiologist", "Medical Officer"
    ],
    "Hospitality & Tourism": [
        "Hotel Manager", "Front Desk Officer", "Housekeeping Supervisor",
        "Chef (Hotel)", "Tour Guide", "Receptionist (Hotel)"
    ],
    "HR & Admin": [
        "HR Manager", "HR Executive", "HR Officer", "HR Assistant",
        "HR Coordinator", "Admin Manager", "Admin Officer",
        "Receptionist", "Recruiter"
    ],
    "IT & Software": [
        "Software Engineer", "Software Developer", "Web Developer",
        "Mobile App Developer", "Frontend Developer", "Backend Developer",
        "Full Stack Developer", "QA Engineer", "DevOps Engineer",
        "Data Analyst", "Data Scientist", "UI/UX Designer",
        "IT Support Engineer", "Network Administrator",
        "System Administrator", "Cybersecurity Analyst"
    ],
    "Legal": [
        "Lawyer", "Advocate", "Legal Advisor", "Paralegal", "Legal Assistant"
    ],
    "Logistics & Supply Chain": [
        "Logistics Manager", "Supply Chain Manager", "Warehouse Supervisor",
        "Store Keeper", "Dispatch Officer", "Procurement Officer"
    ],
    "Manufacturing": [
        "Production Manager", "Production Supervisor", "Machine Operator",
        "Quality Inspector", "Quality Control Officer", "Shift Supervisor",
        "Industrial Engineer"
    ],
    "Media & Entertainment": [
        "Journalist", "Content Writer", "Video Editor",
        "Photographer", "News Anchor", "Graphic Designer"
    ],
    "Mining & Metals": [
        "Mining Engineer", "Geologist", "Mine Supervisor", "Metallurgist"
    ],
    "NGO & Social Services": [
        "Project Manager", "Field Officer", "Social Worker",
        "Program Coordinator", "Community Mobilizer"
    ],
    "Oil & Gas": [
        "Petroleum Engineer", "Drilling Engineer", "Pipeline Engineer",
        "Rig Worker", "HSE Officer", "Process Operator"
    ],
    "Pharmaceuticals": [
        "Pharmacist", "Production Pharmacist", "QA Officer",
        "QC Officer", "Medical Representative"
    ],
    "Retail & Wholesale": [
        "Shopkeeper", "Sales Associate", "Store Manager",
        "Cashier", "Inventory Manager", "Merchandiser"
    ],
    "Sales & Marketing": [
        "Sales Manager", "Sales Executive", "Salesman",
        "Marketing Manager", "Marketing Executive",
        "Business Development Executive", "Digital Marketing Specialist",
        "SEO Specialist"
    ],
    "Security Services": [
        "Security Guard", "Senior Security Guard", "Security Supervisor",
        "CCTV Operator", "Bodyguard"
    ],
    "Telecom": [
        "Telecom Engineer", "Telecom Technician", "Network Engineer",
        "RF Engineer", "BTS Technician", "Fiber Optic Technician"
    ],
    "Textile & Garments": [
        "Tailor", "Master Tailor", "Stitcher", "Quality Checker",
        "Weaver", "Dyer", "Pattern Master", "Textile Engineer"
    ],
    "Transportation": [
        "Driver", "Truck Driver", "Trailer Driver", "Bus Driver",
        "Delivery Rider", "Forklift Operator"
    ],
    "Utilities (Power, Water)": [
        "Power Plant Operator", "Grid Station Operator",
        "Electrical Technician", "Lineman", "Water Treatment Operator"
    ],
    "Warehousing": [
        "Warehouse Manager", "Warehouse Supervisor",
        "Inventory Controller", "Packer", "Picker"
    ]
};

// ============================================
// UNIVERSITIES OF PAKISTAN
// ============================================
export const UNIVERSITIES = [
    "Air University, Islamabad",
    "Allama Iqbal Open University, Islamabad",
    "Arid Agriculture University, Rawalpindi",
    "Bahauddin Zakariya University, Multan",
    "Bahria University, Islamabad",
    "Balochistan University of Information Technology (BUITEMS), Quetta",
    "COMSATS University Islamabad",
    "Fatima Jinnah Medical University, Lahore",
    "Federal Urdu University, Karachi",
    "Gomal University, D.I. Khan",
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
// PAKISTAN LOCATIONS
// Province → District → Tehsils + Postal Code
// ============================================
export const PAKISTAN_DATA = {
    "Punjab": {
        "Attock": { tehsils: ["Attock", "Fateh Jang", "Hazro", "Hassan Abdal", "Jand", "Pindi Gheb"], postal: "43600" },
        "Bahawalnagar": { tehsils: ["Bahawalnagar", "Chishtian", "Fort Abbas", "Haroonabad", "Minchinabad"], postal: "62300" },
        "Bahawalpur": { tehsils: ["Bahawalpur", "Ahmadpur East", "Hasilpur", "Khairpur Tamewali", "Yazman"], postal: "63100" },
        "Bhakkar": { tehsils: ["Bhakkar", "Darya Khan", "Kaloorkot", "Mankera"], postal: "30000" },
        "Chakwal": { tehsils: ["Chakwal", "Choa Saidan Shah", "Kallar Kahar", "Talagang"], postal: "48800" },
        "Chiniot": { tehsils: ["Chiniot", "Bhawana", "Lalian"], postal: "35400" },
        "Dera Ghazi Khan": { tehsils: ["D.G. Khan", "Taunsa", "Kot Chutta"], postal: "32200" },
        "Faisalabad": { tehsils: ["Faisalabad City", "Faisalabad Sadar", "Chak Jhumra", "Jaranwala", "Samundri", "Tandlianwala"], postal: "38000" },
        "Gujranwala": { tehsils: ["Gujranwala", "Kamoke", "Nowshera Virkan", "Wazirabad"], postal: "52250" },
        "Gujrat": { tehsils: ["Gujrat", "Kharian", "Sarai Alamgir"], postal: "50700" },
        "Hafizabad": { tehsils: ["Hafizabad", "Pindi Bhattian"], postal: "52110" },
        "Jhang": { tehsils: ["Jhang", "Ahmadpur Sial", "Shorkot"], postal: "35200" },
        "Jhelum": { tehsils: ["Jhelum", "Dina", "Pind Dadan Khan", "Sohawa"], postal: "49600" },
        "Kasur": { tehsils: ["Kasur", "Chunian", "Kot Radha Kishan", "Pattoki"], postal: "55050" },
        "Khanewal": { tehsils: ["Khanewal", "Jahanian", "Kabirwala", "Mian Channu"], postal: "58150" },
        "Khushab": { tehsils: ["Khushab", "Noorpur Thal", "Quaidabad"], postal: "41000" },
        "Lahore": { tehsils: ["Lahore Cantt", "Lahore City", "Model Town", "Raiwind", "Shalimar"], postal: "54000" },
        "Layyah": { tehsils: ["Layyah", "Chaubara", "Karor Lal Esan"], postal: "31200" },
        "Lodhran": { tehsils: ["Lodhran", "Dunyapur", "Kahror Pacca"], postal: "59320" },
        "Mandi Bahauddin": { tehsils: ["Mandi Bahauddin", "Malakwal", "Phalia"], postal: "50400" },
        "Mianwali": { tehsils: ["Mianwali", "Isakhel", "Piplan"], postal: "42200" },
        "Multan": { tehsils: ["Multan City", "Multan Sadar", "Jalalpur Pirwala", "Shujabad"], postal: "60000" },
        "Muzaffargarh": { tehsils: ["Muzaffargarh", "Alipur", "Jatoi", "Kot Addu"], postal: "34200" },
        "Nankana Sahib": { tehsils: ["Nankana Sahib", "Sangla Hill", "Shah Kot"], postal: "39100" },
        "Narowal": { tehsils: ["Narowal", "Shakargarh", "Zafarwal"], postal: "51600" },
        "Okara": { tehsils: ["Okara", "Depalpur", "Renala Khurd"], postal: "56300" },
        "Pakpattan": { tehsils: ["Pakpattan", "Arifwala"], postal: "57400" },
        "Rahim Yar Khan": { tehsils: ["Rahim Yar Khan", "Khanpur", "Liaquatpur", "Sadiqabad"], postal: "64200" },
        "Rajanpur": { tehsils: ["Rajanpur", "Jampur", "Rojhan"], postal: "33500" },
        "Rawalpindi": { tehsils: ["Rawalpindi", "Gujar Khan", "Kahuta", "Kallar Syedan", "Kotli Sattian", "Murree", "Taxila"], postal: "46000" },
        "Sahiwal": { tehsils: ["Sahiwal", "Chichawatni"], postal: "57000" },
        "Sargodha": { tehsils: ["Sargodha", "Bhalwal", "Kot Momin", "Shahpur", "Sillanwali"], postal: "40100" },
        "Sheikhupura": { tehsils: ["Sheikhupura", "Ferozewala", "Muridke", "Sharaqpur", "Kot Abdul Malik"], postal: "39350" },
        "Sialkot": { tehsils: ["Sialkot", "Daska", "Pasrur", "Sambrial"], postal: "51310" },
        "Toba Tek Singh": { tehsils: ["Toba Tek Singh", "Gojra", "Kamalia", "Pir Mahal"], postal: "36000" },
        "Vehari": { tehsils: ["Vehari", "Burewala", "Mailsi"], postal: "61100" }
    },

    "Sindh": {
        "Badin": { tehsils: ["Badin", "Golarchi", "Matli", "Talhar", "Tando Bago"], postal: "72100" },
        "Dadu": { tehsils: ["Dadu", "Johi", "Khairpur Nathan Shah", "Mehar"], postal: "76200" },
        "Ghotki": { tehsils: ["Ghotki", "Daharki", "Mirpur Mathelo", "Ubauro"], postal: "65010" },
        "Hyderabad": { tehsils: ["Hyderabad City", "Hyderabad Rural", "Latifabad", "Qasimabad"], postal: "71000" },
        "Jacobabad": { tehsils: ["Jacobabad", "Garhi Khairo", "Thul"], postal: "79000" },
        "Jamshoro": { tehsils: ["Jamshoro", "Kotri", "Manjhand", "Sehwan"], postal: "76090" },
        "Karachi Central": { tehsils: ["Gulberg", "Liaquatabad", "Nazimabad", "North Nazimabad"], postal: "74700" },
        "Karachi East": { tehsils: ["Gulshan", "Jamshed", "Gulzar-e-Hijri"], postal: "75300" },
        "Karachi South": { tehsils: ["Aram Bagh", "Civil Line", "Garden", "Lyari", "Saddar"], postal: "74400" },
        "Karachi West": { tehsils: ["Baldia", "Manghopir", "Orangi", "Site"], postal: "75800" },
        "Kashmore": { tehsils: ["Kandhkot", "Kashmore", "Tangwani"], postal: "79300" },
        "Khairpur": { tehsils: ["Khairpur", "Faiz Ganj", "Gambat", "Kot Diji", "Nara", "Sobho Dero"], postal: "66020" },
        "Korangi": { tehsils: ["Korangi", "Landhi", "Model Colony", "Shah Faisal"], postal: "74900" },
        "Larkana": { tehsils: ["Larkana", "Bakrani", "Dokri", "Kambar", "Ratodero", "Shahdadkot"], postal: "77150" },
        "Malir": { tehsils: ["Bin Qasim", "Gadap", "Malir", "Quaidabad"], postal: "75080" },
        "Matiari": { tehsils: ["Matiari", "Hala", "Saeedabad"], postal: "76100" },
        "Mirpur Khas": { tehsils: ["Mirpur Khas", "Digri", "Jhuddo", "Kot Ghulam Muhammad", "Sindhri"], postal: "69000" },
        "Naushahro Feroze": { tehsils: ["Naushahro Feroze", "Bhiria", "Kandiaro", "Moro"], postal: "67450" },
        "Sanghar": { tehsils: ["Sanghar", "Jam Nawaz Ali", "Khipro", "Shahdadpur", "Sinjhoro", "Tando Adam"], postal: "68100" },
        "Shaheed Benazirabad": { tehsils: ["Nawabshah", "Daur", "Kazi Ahmed", "Sakrand"], postal: "67450" },
        "Shikarpur": { tehsils: ["Shikarpur", "Garhi Yasin", "Khanpur", "Lakhi"], postal: "78100" },
        "Sukkur": { tehsils: ["Sukkur", "New Sukkur", "Pano Aqil", "Rohri", "Salehpat"], postal: "65200" },
        "Tando Allahyar": { tehsils: ["Tando Allahyar", "Chambar", "Jhando Mari"], postal: "70700" },
        "Tando Muhammad Khan": { tehsils: ["Tando Muhammad Khan", "Bulri Shah Karim"], postal: "70050" },
        "Tharparkar": { tehsils: ["Mithi", "Chachro", "Diplo", "Islamkot", "Nagar Parkar"], postal: "69200" },
        "Thatta": { tehsils: ["Thatta", "Ghorabari", "Keti Bunder", "Mirpur Sakro"], postal: "73130" },
        "Umerkot": { tehsils: ["Umerkot", "Kunri", "Pithoro", "Samaro"], postal: "69100" }
    },

    "Khyber Pakhtunkhwa": {
        "Abbottabad": { tehsils: ["Abbottabad", "Havelian", "Lora"], postal: "22010" },
        "Bannu": { tehsils: ["Bannu", "Domel", "Miryan", "Wazir"], postal: "28100" },
        "Battagram": { tehsils: ["Battagram", "Allai"], postal: "21230" },
        "Buner": { tehsils: ["Daggar", "Gadezai", "Khudu Khel", "Mandanr"], postal: "19290" },
        "Charsadda": { tehsils: ["Charsadda", "Shabqadar", "Tangi"], postal: "24420" },
        "Chitral": { tehsils: ["Chitral", "Mastuj"], postal: "17200" },
        "Dera Ismail Khan": { tehsils: ["D.I. Khan", "Kulachi", "Paharpur", "Paroa"], postal: "29050" },
        "Hangu": { tehsils: ["Hangu", "Thall"], postal: "26100" },
        "Haripur": { tehsils: ["Haripur", "Ghazi", "Khanpur"], postal: "22620" },
        "Karak": { tehsils: ["Karak", "Banda Daud Shah", "Takht-e-Nasrati"], postal: "27200" },
        "Kohat": { tehsils: ["Kohat", "Lachi"], postal: "26000" },
        "Lakki Marwat": { tehsils: ["Lakki Marwat", "Naurang"], postal: "28420" },
        "Lower Dir": { tehsils: ["Timergara", "Balambat", "Adenzai"], postal: "18300" },
        "Malakand": { tehsils: ["Batkhela", "Dargai", "Sam Ranizai"], postal: "23100" },
        "Mansehra": { tehsils: ["Mansehra", "Balakot", "Oghi", "Baffa Pakhal"], postal: "21300" },
        "Mardan": { tehsils: ["Mardan", "Takht Bhai", "Katlang", "Shergarh"], postal: "23200" },
        "Nowshera": { tehsils: ["Nowshera", "Pabbi", "Jehangira"], postal: "24100" },
        "Peshawar": { tehsils: ["Peshawar", "Peshawar Cantt", "Badaber", "Mathra"], postal: "25000" },
        "Shangla": { tehsils: ["Alpuri", "Bisham", "Chakesar", "Puran"], postal: "19500" },
        "Swabi": { tehsils: ["Swabi", "Lahor", "Razzar", "Topi"], postal: "23530" },
        "Swat": { tehsils: ["Mingora", "Babuzai", "Barikot", "Kabal", "Khwazakhela", "Matta"], postal: "19130" },
        "Tank": { tehsils: ["Tank", "Jandola"], postal: "29200" },
        "Upper Dir": { tehsils: ["Dir", "Wari", "Sheringal", "Barawal"], postal: "18000" }
    },

    "Balochistan": {
        "Awaran": { tehsils: ["Awaran", "Mashkay"], postal: "93000" },
        "Chagai": { tehsils: ["Chagai", "Dalbandin", "Nokundi", "Taftan"], postal: "95100" },
        "Chaman": { tehsils: ["Chaman"], postal: "86000" },
        "Dera Bugti": { tehsils: ["Dera Bugti", "Sui", "Phelawagh"], postal: "80500" },
        "Gwadar": { tehsils: ["Gwadar", "Jiwani", "Ormara", "Pasni"], postal: "91200" },
        "Jaffarabad": { tehsils: ["Dera Allah Yar", "Usta Muhammad", "Gandakha"], postal: "80300" },
        "Kalat": { tehsils: ["Kalat", "Manguchar", "Surab"], postal: "88300" },
        "Kech": { tehsils: ["Turbat", "Buleda", "Dasht", "Mand"], postal: "92600" },
        "Kharan": { tehsils: ["Kharan"], postal: "94100" },
        "Khuzdar": { tehsils: ["Khuzdar", "Moola", "Nal", "Wadh", "Zehri"], postal: "89100" },
        "Killa Abdullah": { tehsils: ["Chaman", "Dobandi", "Gulistan"], postal: "86100" },
        "Lasbela": { tehsils: ["Bela", "Uthal", "Hub", "Dureji", "Winder"], postal: "90050" },
        "Loralai": { tehsils: ["Loralai", "Duki", "Mekhtar"], postal: "84800" },
        "Mastung": { tehsils: ["Mastung", "Khada Koocha", "Dasht"], postal: "88400" },
        "Nushki": { tehsils: ["Nushki", "Dak"], postal: "94200" },
        "Panjgur": { tehsils: ["Panjgur", "Gichk", "Parome"], postal: "93000" },
        "Pishin": { tehsils: ["Pishin", "Barshore", "Karezat"], postal: "86500" },
        "Quetta": { tehsils: ["Quetta City", "Quetta Sadar", "Chiltan", "Zarghoon"], postal: "87300" },
        "Sibi": { tehsils: ["Sibi", "Harnai", "Kutmandai", "Lehri"], postal: "82000" },
        "Zhob": { tehsils: ["Zhob", "Killa Saifullah", "Sherani"], postal: "85200" }
    },

    "Islamabad Capital Territory": {
        "Islamabad": { tehsils: ["Islamabad Urban", "Islamabad Rural"], postal: "44000" }
    },

    "Gilgit-Baltistan": {
        "Astore": { tehsils: ["Astore", "Shounter"], postal: "14100" },
        "Diamer": { tehsils: ["Chilas", "Darel", "Tangir"], postal: "14000" },
        "Ghanche": { tehsils: ["Khaplu", "Mashabrum"], postal: "16800" },
        "Ghizer": { tehsils: ["Gahkuch", "Punial", "Ishkoman"], postal: "15200" },
        "Gilgit": { tehsils: ["Gilgit", "Danyore", "Juglot"], postal: "15100" },
        "Hunza": { tehsils: ["Aliabad", "Gulmit", "Sost"], postal: "15700" },
        "Nagar": { tehsils: ["Nagar", "Chalt"], postal: "15500" },
        "Skardu": { tehsils: ["Skardu", "Shigar", "Kharmang"], postal: "16100" }
    },

    "Azad Jammu & Kashmir": {
        "Bagh": { tehsils: ["Bagh", "Dhir Kot", "Hari Ghel"], postal: "12500" },
        "Bhimber": { tehsils: ["Bhimber", "Barnala", "Samahni"], postal: "12200" },
        "Kotli": { tehsils: ["Kotli", "Charhoi", "Khuiratta", "Sehnsa"], postal: "12000" },
        "Mirpur": { tehsils: ["Mirpur", "Dadyal", "Chakswari"], postal: "10250" },
        "Muzaffarabad": { tehsils: ["Muzaffarabad", "Nasirabad", "Ghori"], postal: "13100" },
        "Poonch": { tehsils: ["Rawalakot", "Hajira", "Abbaspur"], postal: "12350" },
        "Sudhnoti": { tehsils: ["Pallandri", "Baloch", "Tarar Khel"], postal: "12200" }
    }
};

// ============================================
// COUNTRIES (100+)
// ============================================
export const COUNTRIES = [
    "Pakistan", "Afghanistan", "Albania", "Algeria", "Argentina", "Australia", "Austria", "Azerbaijan",
    "Bahrain", "Bangladesh", "Belgium", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Brazil",
    "Brunei", "Bulgaria", "Cambodia", "Cameroon", "Canada", "Chad", "Chile", "China", "Colombia",
    "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Ecuador", "Egypt", "Ethiopia",
    "Finland", "France", "Georgia", "Germany", "Ghana", "Greece", "Hungary", "Iceland",
    "India", "Indonesia", "Iran", "Iraq", "Ireland", "Italy", "Japan", "Jordan",
    "Kazakhstan", "Kenya", "Kuwait", "Kyrgyzstan", "Lebanon", "Libya", "Malaysia", "Maldives",
    "Malta", "Mexico", "Monaco", "Mongolia", "Morocco", "Myanmar", "Nepal", "Netherlands",
    "New Zealand", "Nigeria", "North Korea", "Norway", "Oman", "Palestine", "Panama", "Peru",
    "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Saudi Arabia",
    "Singapore", "Slovakia", "Slovenia", "Somalia", "South Africa", "South Korea", "Spain",
    "Sri Lanka", "Sudan", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania",
    "Thailand", "Tunisia", "Turkey", "Turkmenistan", "Uganda", "Ukraine",
    "United Arab Emirates", "United Kingdom", "United States", "Uzbekistan",
    "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe",
    "Other"
];

// ============================================
// HELPER FUNCTIONS
// ============================================

// Get all provinces
export function getProvinces() {
    return Object.keys(PAKISTAN_DATA);
}

// Get districts of a province
export function getDistricts(province) {
    if (!PAKISTAN_DATA[province]) return [];
    return Object.keys(PAKISTAN_DATA[province]);
}

// Get tehsils of a district
export function getTehsils(province, district) {
    if (!PAKISTAN_DATA[province] || !PAKISTAN_DATA[province][district]) return [];
    return PAKISTAN_DATA[province][district].tehsils || [];
}

// Get postal code of a district
export function getPostalCode(province, district) {
    if (!PAKISTAN_DATA[province] || !PAKISTAN_DATA[province][district]) return '';
    return PAKISTAN_DATA[province][district].postal || '';
}

// Get all job titles (flat list)
export function getAllTitles() {
    const all = [];
    Object.values(JOB_TITLES_DB).forEach(titles => {
        titles.forEach(t => all.push(t));
    });
    return all;
}

// Search skills by keyword
export function searchSkills(keyword) {
    if (!keyword) return [];
    const k = keyword.toLowerCase();
    return SKILLS_DB.filter(s => s.toLowerCase().includes(k));
}
