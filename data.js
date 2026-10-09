/* ============================================
   HASK TalentConnect - Pakistan Data
   Complete Titles + Districts + Tehsils + Postal Codes
   ============================================ */

// ============================================
// COMPLETE JOB TITLES DATABASE (Pakistan)
// ============================================
// Format: { industry: [titles...] }
// Used for AI-based title generation from Education/Experience

export const JOB_TITLES_DB = {
    "Mechanical": [
        "Mechanical Engineer", "Mechanical Technician", "Mechanical Supervisor",
        "Mechanical Foreman", "Senior Mechanical Technician", "Junior Mechanical Technician",
        "Fitter", "Senior Fitter", "Turner", "Machinist", "CNC Operator",
        "Welder", "Senior Welder", "Millwright", "Boiler Operator",
        "HVAC Technician", "AC Technician", "Refrigeration Technician",
        "Auto Mechanic", "Diesel Mechanic", "Motor Mechanic",
        "Plant Operator", "Machine Operator", "Production Supervisor",
        "Maintenance Technician", "Preventive Maintenance Engineer",
        "Mechanical Draftsman", "CAD Mechanical Designer"
    ],
    "Electrical": [
        "Electrical Engineer", "Electrical Technician", "Electrical Supervisor",
        "Electrician", "Senior Electrician", "Junior Electrician",
        "Wireman", "Lineman", "Cable Jointer",
        "Instrument Technician", "Instrumentation Engineer",
        "Power Plant Operator", "Grid Station Operator",
        "Solar Technician", "Solar Installer", "Solar Engineer",
        "Electronics Technician", "Electronics Engineer",
        "Electrical Draftsman", "Auto Electrician"
    ],
    "Civil": [
        "Civil Engineer", "Site Engineer", "Site Supervisor",
        "Civil Supervisor", "Civil Foreman", "Civil Technician",
        "Quantity Surveyor", "Estimator", "Billing Engineer",
        "Structure Engineer", "RCC Designer", "Steel Fixer",
        "Mason", "Senior Mason", "Carpenter", "Shuttering Carpenter",
        "Painter", "Plumber", "Pipe Fitter", "Tiler",
        "Steel Fabricator", "Welder (Structure)",
        "Draftsman Civil", "AutoCAD Civil Designer",
        "Construction Manager", "Project Manager (Civil)",
        "Surveyor", "Land Surveyor"
    ],
    "HR & Admin": [
        "HR Manager", "Senior HR Manager", "HR Director",
        "HR Executive", "Senior HR Executive", "HR Officer",
        "HR Assistant", "HR Coordinator", "HR Generalist",
        "HR Specialist", "HR Business Partner",
        "Recruiter", "Senior Recruiter", "Talent Acquisition Specialist",
        "Admin Manager", "Admin Officer", "Admin Executive",
        "Admin Assistant", "Office Manager", "Office Assistant",
        "Receptionist", "Front Desk Officer",
        "Payroll Officer", "Payroll Manager", "Compensation Specialist",
        "Training Manager", "Training Officer", "L&D Manager",
        "Employee Relations Officer", "IR Officer",
        "HRIS Analyst", "HR Analyst"
    ],
    "IT & Software": [
        "Software Engineer", "Senior Software Engineer", "Software Developer",
        "Web Developer", "Frontend Developer", "Backend Developer",
        "Full Stack Developer", "Mobile App Developer",
        "Android Developer", "iOS Developer", "Flutter Developer",
        "React Developer", "Node.js Developer", "PHP Developer",
        "Python Developer", "Java Developer", ".NET Developer",
        "Database Administrator", "DBA", "SQL Developer",
        "System Administrator", "Network Administrator",
        "Network Engineer", "IT Support Engineer",
        "DevOps Engineer", "Cloud Engineer", "AWS Engineer",
        "QA Engineer", "QA Tester", "Test Automation Engineer",
        "UI/UX Designer", "Graphic Designer", "Product Designer",
        "Project Manager (IT)", "Scrum Master", "Product Manager",
        "Data Analyst", "Data Scientist", "ML Engineer",
        "Cybersecurity Analyst", "Information Security Officer"
    ],
    "Sales & Marketing": [
        "Sales Manager", "Senior Sales Manager", "Regional Sales Manager",
        "Area Sales Manager", "Territory Sales Manager",
        "Sales Executive", "Senior Sales Executive", "Sales Officer",
        "Sales Representative", "Salesman", "Senior Salesman",
        "Business Development Manager", "Business Development Executive",
        "Marketing Manager", "Marketing Executive", "Marketing Officer",
        "Digital Marketing Manager", "Digital Marketing Executive",
        "SEO Specialist", "SEM Specialist",
        "Social Media Manager", "Social Media Executive",
        "Content Writer", "Copywriter",
        "Brand Manager", "Brand Executive",
        "Customer Service Representative", "CSR",
        "Customer Support Executive", "Call Center Agent",
        "Retail Sales Associate", "Showroom Manager"
    ],
    "Accounting & Finance": [
        "Accountant", "Senior Accountant", "Chief Accountant",
        "Accounts Manager", "Accounts Officer", "Accounts Executive",
        "Accounts Assistant", "Junior Accountant",
        "Finance Manager", "Finance Director", "Finance Officer",
        "Finance Analyst", "Financial Analyst",
        "Auditor", "Internal Auditor", "External Auditor",
        "Tax Consultant", "Tax Officer", "Tax Manager",
        "Cashier", "Senior Cashier", "Head Cashier",
        "Bookkeeper", "Payroll Accountant",
        "Cost Accountant", "Management Accountant",
        "Chief Financial Officer", "CFO", "Controller"
    ],
    "Education": [
        "Teacher", "Senior Teacher", "Head Teacher",
        "Primary Teacher", "Secondary Teacher", "High School Teacher",
        "Subject Teacher", "Class Teacher",
        "Lecturer", "Senior Lecturer", "Assistant Professor",
        "Associate Professor", "Professor",
        "Tutor", "Home Tutor", "Online Tutor",
        "Principal", "Vice Principal", "Headmaster",
        "Education Coordinator", "Academic Coordinator",
        "Curriculum Developer", "Education Consultant",
        "Trainer", "Corporate Trainer", "Soft Skills Trainer",
        "Montessori Teacher", "Kindergarten Teacher"
    ],
    "Healthcare": [
        "Doctor", "MBBS Doctor", "Consultant", "Surgeon",
        "Specialist", "Medical Officer", "House Officer",
        "Nurse", "Senior Nurse", "Head Nurse", "Staff Nurse",
        "Lady Health Visitor", "LHV", "Midwife",
        "Pharmacist", "Senior Pharmacist", "Pharmacy Assistant",
        "Lab Technician", "Lab Technologist", "Pathologist",
        "Radiologist", "X-Ray Technician", "Ultrasound Technician",
        "Physiotherapist", "Dietitian", "Nutritionist",
        "Dentist", "Dental Assistant",
        "Hospital Administrator", "Healthcare Manager",
        "Emergency Medical Technician", "EMT", "Paramedic"
    ],
    "Construction & Labor": [
        "Laborer", "Helper", "Mason", "Senior Mason",
        "Painter", "Senior Painter", "Spray Painter",
        "Plumber", "Senior Plumber", "Pipe Fitter",
        "Carpenter", "Senior Carpenter", "Furniture Carpenter",
        "Welder", "Fabricator", "Steel Fixer",
        "Tiler", "Marble Fixer", "Pop Worker",
        "Glass Fitter", "Aluminum Fitter",
        "Scaffolder", "Rigger", "Crane Operator",
        "Heavy Equipment Operator", "Excavator Operator",
        "Bulldozer Operator", "Loader Operator"
    ],
    "Transport & Driver": [
        "Driver", "Senior Driver", "Personal Driver",
        "Truck Driver", "Trailer Driver", "Bus Driver",
        "Taxi Driver", "Ride Hailing Driver",
        "Delivery Rider", "Food Delivery Rider",
        "Bike Rider", "Courier",
        "Loader", "Unloader", "Helper (Transport)",
        "Forklift Operator", "Crane Operator",
        "Dispatch Rider", "Transport Supervisor"
    ],
    "Security": [
        "Security Guard", "Senior Security Guard", "Head Guard",
        "Security Supervisor", "Security Officer", "Security Manager",
        "Night Watchman", "Watchman",
        "Bodyguard", "Personal Security Officer",
        "Bouncer", "Gatekeeper",
        "CCTV Operator", "Monitoring Officer"
    ],
    "Hospitality": [
        "Chef", "Head Chef", "Sous Chef", "Executive Chef",
        "Cook", "Senior Cook", "Assistant Cook",
        "Baker", "Pastry Chef",
        "Waiter", "Senior Waiter", "Head Waiter",
        "Server", "Steward", "Kitchen Helper",
        "Restaurant Manager", "Hotel Manager",
        "Front Desk Officer", "Receptionist (Hotel)",
        "Housekeeping", "Housekeeping Supervisor",
        "Bartender", "Barista"
    ],
    "Textile": [
        "Tailor", "Master Tailor", "Senior Tailor",
        "Stitcher", "Machine Operator (Stitching)",
        "Quality Checker", "QC Inspector", "Quality Manager",
        "Weaver", "Loom Operator", "Warp Knitter",
        "Dyer", "Printing Operator",
        "Cutting Master", "Pattern Master",
        "Textile Engineer", "Textile Technologist",
        "Garment Supervisor", "Production Manager (Textile)"
    ],
    "Manufacturing & Production": [
        "Production Manager", "Production Supervisor",
        "Production Officer", "Production Executive",
        "Shift Supervisor", "Line Supervisor",
        "Machine Operator", "CNC Operator",
        "Packaging Operator", "Assembly Line Worker",
        "Quality Control Inspector", "QC Officer", "QA Officer",
        "Quality Manager", "Plant Manager",
        "Factory Manager", "Industrial Engineer",
        "Process Engineer", "Manufacturing Engineer",
        "Store Keeper", "Warehouse Supervisor"
    ],
    "Agriculture": [
        "Farm Manager", "Farm Supervisor", "Farm Worker",
        "Agriculture Officer", "Agriculture Extension Officer",
        "Agronomist", "Horticulturist", "Soil Scientist",
        "Livestock Supervisor", "Dairy Farm Manager",
        "Poultry Farm Manager", "Poultry Supervisor",
        "Veterinary Doctor", "Vet Assistant",
        "Tractor Operator", "Irrigation Supervisor"
    ],
    "Retail & Sales": [
        "Shopkeeper", "Shop Manager", "Store Manager",
        "Sales Associate", "Sales Assistant",
        "Cashier", "Senior Cashier",
        "Stock Keeper", "Inventory Manager",
        "Visual Merchandiser", "Floor Supervisor",
        "Buyer", "Merchandiser"
    ],
    "Telecom": [
        "Telecom Engineer", "Telecom Technician",
        "Network Engineer (Telecom)", "RF Engineer",
        "BTS Technician", "Tower Technician",
        "Fiber Optic Technician", "Splicer",
        "Customer Service Officer (Telecom)",
        "Sales Officer (Telecom)"
    ],
    "Oil & Gas": [
        "Drilling Engineer", "Drilling Supervisor",
        "Rig Worker", "Roughneck", "Derrickman",
        "Petroleum Engineer", "Reservoir Engineer",
        "Pipeline Engineer", "Pipeline Technician",
        "Refinery Operator", "Process Operator",
        "Safety Officer (Oil & Gas)", "HSE Officer"
    ],
    "Government & Public": [
        "Clerk", "Senior Clerk", "Head Clerk",
        "Naib Qasid", "Office Boy",
        "Patwari", "Tehsildar", "Assistant Commissioner",
        "Police Officer", "ASI", "SI", "Inspector",
        "Traffic Warden", "Constable",
        "Postman", "Post Office Clerk",
        "Health Inspector", "Food Inspector",
        "Tax Inspector", "Customs Officer"
    ]
};

// ============================================
// PROVINCE → DISTRICT → TEHSILS + POSTAL CODES
// ============================================
// Format: { province: { district: { tehsils: [...], postal: "code" } } }

export const PAKISTAN_DATA = {
    "Punjab": {
        "Attock": { tehsils: ["Attock", "Fateh Jang", "Hazro", "Hassan Abdal", "Jand", "Pindi Gheb"], postal: "43600" },
        "Bahawalnagar": { tehsils: ["Bahawalnagar", "Chishtian", "Fort Abbas", "Haroonabad", "Minchinabad"], postal: "62300" },
        "Bahawalpur": { tehsils: ["Bahawalpur", "Ahmadpur East", "Hasilpur", "Khairpur Tamewali", "Yazman"], postal: "63100" },
        "Bhakkar": { tehsils: ["Bhakkar", "Darya Khan", "Kaloorkot", "Mankera"], postal: "30000" },
        "Chakwal": { tehsils: ["Chakwal", "Choa Saidan Shah", "Kallar Kahar", "Talagang", "Lawa"], postal: "48800" },
        "Chiniot": { tehsils: ["Chiniot", "Bhawana", "Lalian"], postal: "35400" },
        "Dera Ghazi Khan": { tehsils: ["Dera Ghazi Khan", "De-Excluded Area D.G. Khan", "Taunsa", "Kot Chutta"], postal: "32200" },
        "Faisalabad": { tehsils: ["Faisalabad City", "Faisalabad Sadar", "Chak Jhumra", "Jaranwala", "Samundri", "Tandlianwala"], postal: "38000" },
        "Gujranwala": { tehsils: ["Gujranwala", "Kamoke", "Nowshera Virkan", "Wazirabad"], postal: "52250" },
        "Gujrat": { tehsils: ["Gujrat", "Kharian", "Sarai Alamgir"], postal: "50700" },
        "Hafizabad": { tehsils: ["Hafizabad", "Pindi Bhattian"], postal: "52110" },
        "Jhang": { tehsils: ["Jhang", "Ahmadpur Sial", "Shorkot", "18-Hazari"], postal: "35200" },
        "Jhelum": { tehsils: ["Jhelum", "Dina", "Pind Dadan Khan", "Sohawa"], postal: "49600" },
        "Kasur": { tehsils: ["Kasur", "Chunian", "Kot Radha Kishan", "Pattoki"], postal: "55050" },
        "Khanewal": { tehsils: ["Khanewal", "Jahanian", "Kabirwala", "Mian Channu"], postal: "58150" },
        "Khushab": { tehsils: ["Khushab", "Noorpur Thal", "Quaidabad", "Naushera"], postal: "41000" },
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
        "Sargodha": { tehsils: ["Sargodha", "Bhalwal", "Kot Momin", "Sahiwal (Sargodha)", "Shahpur", "Sillanwali"], postal: "40100" },
        "Sheikhupura": { tehsils: ["Sheikhupura", "Ferozewala", "Muridke", "Sharaqpur", "Kot Abdul Malik"], postal: "39350" },
        "Sialkot": { tehsils: ["Sialkot", "Daska", "Pasrur", "Sambrial"], postal: "51310" },
        "Toba Tek Singh": { tehsils: ["Toba Tek Singh", "Gojra", "Kamalia", "Pir Mahal"], postal: "36000" },
        "Vehari": { tehsils: ["Vehari", "Burewala", "Mailsi"], postal: "61100" }
    },
    "Sindh": {
        "Badin": { tehsils: ["Badin", "Golarchi", "Matli", "Shaheed Fazil Rahu", "Talhar", "Tando Bago"], postal: "72100" },
        "Dadu": { tehsils: ["Dadu", "Johi", "Khairpur Nathan Shah", "Mehar"], postal: "76200" },
        "Ghotki": { tehsils: ["Ghotki", "Daharki", "Khangarh", "Mirpur Mathelo", "Ubauro"], postal: "65010" },
        "Hyderabad": { tehsils: ["Hyderabad City", "Hyderabad Rural", "Latifabad", "Qasimabad"], postal: "71000" },
        "Jacobabad": { tehsils: ["Jacobabad", "Garhi Khairo", "Thul"], postal: "79000" },
        "Jamshoro": { tehsils: ["Jamshoro", "Kotri", "Manjhand", "Sehwan", "Thano Bula Khan"], postal: "76090" },
        "Karachi Central": { tehsils: ["Gulberg", "Liaquatabad", "Nazimabad", "North Nazimabad"], postal: "74700" },
        "Karachi East": { tehsils: ["Gulshan", "Jamshed", "Gulzar-e-Hijri"], postal: "75300" },
        "Karachi South": { tehsils: ["Aram Bagh", "Civil Line", "Garden", "Lyari", "Saddar"], postal: "74400" },
        "Karachi West": { tehsils: ["Baldia", "Manghopir", "Orangi", "Site"], postal: "75800" },
        "Kashmore": { tehsils: ["Kandhkot", "Kashmore", "Tangwani"], postal: "79300" },
        "Khairpur": { tehsils: ["Khairpur", "Faiz Ganj", "Gambat", "Kingri", "Kot Diji", "Nara", "Sobho Dero", "Thari Mirwah"], postal: "66020" },
        "Korangi": { tehsils: ["Korangi", "Landhi", "Model Colony", "Shah Faisal"], postal: "74900" },
        "Larkana": { tehsils: ["Larkana", "Bakrani", "Dokri", "Kambar", "Ratodero", "Shahdadkot", "Warah"], postal: "77150" },
        "Malir": { tehsils: ["Bin Qasim", "Gadap", "Malir", "Quaidabad"], postal: "75080" },
        "Matiari": { tehsils: ["Matiari", "Hala", "Saeedabad"], postal: "76100" },
        "Mirpur Khas": { tehsils: ["Mirpur Khas", "Digri", "Hussain Bux Mari", "Jhuddo", "Kot Ghulam Muhammad", "Shujabad", "Sindhri"], postal: "69000" },
        "Naushahro Feroze": { tehsils: ["Naushahro Feroze", "Bhiria", "Kandiaro", "Moro"], postal: "67450" },
        "Qambar Shahdadkot": { tehsils: ["Qambar", "Miro Khan", "Nasirabad", "Qubo Saeed Khan", "Shahdadkot", "Sijawal Junejo", "Warah"], postal: "77210" },
        "Sanghar": { tehsils: ["Sanghar", "Jam Nawaz Ali", "Khipro", "Shahdadpur", "Sinjhoro", "Tando Adam"], postal: "68100" },
        "Shaheed Benazirabad": { tehsils: ["Nawabshah", "Daur", "Kazi Ahmed", "Sakrand"], postal: "67450" },
        "Shikarpur": { tehsils: ["Shikarpur", "Garhi Yasin", "Khanpur", "Lakhi"], postal: "78100" },
        "Sujawal": { tehsils: ["Sujawal", "Jati", "Kharo Chan", "Mirpur Bathoro", "Shah Bunder"], postal: "79100" },
        "Sukkur": { tehsils: ["Sukkur", "New Sukkur", "Pano Aqil", "Rohri", "Salehpat"], postal: "65200" },
        "Tando Allahyar": { tehsils: ["Tando Allahyar", "Chambar", "Jhando Mari"], postal: "70700" },
        "Tando Muhammad Khan": { tehsils: ["Tando Muhammad Khan", "Bulri Shah Karim", "Tando Ghulam Hyder"], postal: "70050" },
        "Tharparkar": { tehsils: ["Mithi", "Chachro", "Diplo", "Islamkot", "Nagar Parkar", "Dahli"], postal: "69200" },
        "Thatta": { tehsils: ["Thatta", "Ghorabari", "Keti Bunder", "Mirpur Sakro", "Sujawal"], postal: "73130" },
        "Umerkot": { tehsils: ["Umerkot", "Kunri", "Pithoro", "Samaro"], postal: "69100" },
        "Kemari": { tehsils: ["Kemari"], postal: "75600" }
    },
    "Khyber Pakhtunkhwa": {
        "Abbottabad": { tehsils: ["Abbottabad", "Havelian", "Lora", "Lower Tanawal"], postal: "22010" },
        "Bajaur": { tehsils: ["Bajaur"], postal: "23000" },
        "Bannu": { tehsils: ["Bannu", "Domel", "Kakki", "Miryan", "Wazir"], postal: "28100" },
        "Battagram": { tehsils: ["Battagram", "Allai"], postal: "21230" },
        "Buner": { tehsils: ["Daggar", "Gadezai", "Khudu Khel", "Mandanr", "Totalai"], postal: "19290" },
        "Charsadda": { tehsils: ["Charsadda", "Shabqadar", "Tangi"], postal: "24420" },
        "Chitral": { tehsils: ["Chitral", "Mastuj"], postal: "17200" },
        "Dera Ismail Khan": { tehsils: ["D.I. Khan", "Kulachi", "Paharpur", "Paroa", "Daraban"], postal: "29050" },
        "Hangu": { tehsils: ["Hangu", "Thall"], postal: "26100" },
        "Haripur": { tehsils: ["Haripur", "Ghazi", "Khanpur"], postal: "22620" },
        "Karak": { tehsils: ["Karak", "Banda Daud Shah", "Takht-e-Nasrati"], postal: "27200" },
        "Khyber": { tehsils: ["Jamrud", "Bara", "Landi Kotal"], postal: "25000" },
        "Kohat": { tehsils: ["Kohat", "Lachi"], postal: "26000" },
        "Kohistan": { tehsils: ["Dassu", "Pattan", "Palas"], postal: "21000" },
        "Kurram": { tehsils: ["Parachinar", "Sadda", "Alizai"], postal: "21400" },
        "Lakki Marwat": { tehsils: ["Lakki Marwat", "Naurang", "Sarai Naurang"], postal: "28420" },
        "Lower Dir": { tehsils: ["Timergara", "Balambat", "Adenzai", "Munda", "Samar Bagh"], postal: "18300" },
        "Lower Kohistan": { tehsils: ["Pattan"], postal: "21100" },
        "Malakand": { tehsils: ["Batkhela", "Dargai", "Sam Ranizai", "Swat Ranizai"], postal: "23100" },
        "Mansehra": { tehsils: ["Mansehra", "Balakot", "Oghi", "Baffa Pakhal", "Darband", "Tanawal"], postal: "21300" },
        "Mardan": { tehsils: ["Mardan", "Takht Bhai", "Katlang", "Shergarh"], postal: "23200" },
        "Mohmand": { tehsils: ["Ghalanai"], postal: "24000" },
        "North Waziristan": { tehsils: ["Miranshah", "Mirali", "Razmak"], postal: "28200" },
        "Nowshera": { tehsils: ["Nowshera", "Pabbi", "Jehangira"], postal: "24100" },
        "Orakzai": { tehsils: ["Kalaya"], postal: "21500" },
        "Peshawar": { tehsils: ["Peshawar", "Peshawar Cantt", "Badaber", "Mathra"], postal: "25000" },
        "Shangla": { tehsils: ["Alpuri", "Bisham", "Chakesar", "Puran", "Martung"], postal: "19500" },
        "South Waziristan": { tehsils: ["Wana", "Ladha", "Sararogha", "Tiarza"], postal: "29000" },
        "Swabi": { tehsils: ["Swabi", "Lahor", "Razzar", "Topi"], postal: "23530" },
        "Swat": { tehsils: ["Mingora", "Babuzai", "Barikot", "Kabal", "Khwazakhela", "Matta", "Charbagh"], postal: "19130" },
        "Tank": { tehsils: ["Tank", "Jandola"], postal: "29200" },
        "Tor Ghar": { tehsils: ["Judba", "Khander"], postal: "21000" },
        "Upper Chitral": { tehsils: ["Mastuj"], postal: "17300" },
        "Upper Dir": { tehsils: ["Dir", "Wari", "Sheringal", "Barawal", "Kalkot"], postal: "18000" },
        "Upper Kohistan": { tehsils: ["Dassu"], postal: "21200" }
    },
    "Balochistan": {
        "Awaran": { tehsils: ["Awaran", "Mashkay"], postal: "93000" },
        "Barkhan": { tehsils: ["Barkhan"], postal: "81300" },
        "Chagai": { tehsils: ["Chagai", "Dalbandin", "Nokundi", "Taftan"], postal: "95100" },
        "Chaman": { tehsils: ["Chaman"], postal: "86000" },
        "Dera Bugti": { tehsils: ["Dera Bugti", "Sui", "Phelawagh", "Baiker"], postal: "80500" },
        "Duki": { tehsils: ["Duki"], postal: "81100" },
        "Gwadar": { tehsils: ["Gwadar", "Jiwani", "Ormara", "Pasni", "Suntsar"], postal: "91200" },
        "Harnai": { tehsils: ["Harnai", "Shahrig"], postal: "81300" },
        "Jaffarabad": { tehsils: ["Dera Allah Yar", "Usta Muhammad", "Gandakha", "Jhat Pat"], postal: "80300" },
        "Jhal Magsi": { tehsils: ["Jhal Magsi", "Gandawah"], postal: "81200" },
        "Kachhi": { tehsils: ["Bolan", "Bhag", "Dhadar", "Mach"], postal: "82000" },
        "Kalat": { tehsils: ["Kalat", "Manguchar", "Surab"], postal: "88300" },
        "Kech": { tehsils: ["Turbat", "Buleda", "Dasht", "Mand", "Tump"], postal: "92600" },
        "Kharan": { tehsils: ["Kharan"], postal: "94100" },
        "Khuzdar": { tehsils: ["Khuzdar", "Moola", "Nal", "Wadh", "Zehri"], postal: "89100" },
        "Killa Abdullah": { tehsils: ["Chaman", "Dobandi", "Gulistan"], postal: "86100" },
        "Killa Saifullah": { tehsils: ["Killa Saifullah", "Muslim Bagh", "Loi Band"], postal: "85200" },
        "Kohlu": { tehsils: ["Kohlu", "Mawand"], postal: "81400" },
        "Lasbela": { tehsils: ["Bela", "Uthal", "Hub", "Dureji", "Kanraj", "Lakhra", "Liari", "Sonniani", "Winder"], postal: "90050" },
        "Loralai": { tehsils: ["Loralai", "Duki", "Mekhtar", "Bori"], postal: "84800" },
        "Mastung": { tehsils: ["Mastung", "Khada Koocha", "Dasht"], postal: "88400" },
        "Musakhel": { tehsils: ["Musakhel", "Kingri", "Drug"], postal: "84700" },
        "Nasirabad": { tehsils: ["Dera Murad Jamali", "Chattar", "Tamboo"], postal: "80700" },
        "Nushki": { tehsils: ["Nushki", "Dak"], postal: "94200" },
        "Panjgur": { tehsils: ["Panjgur", "Gichk", "Parome"], postal: "93000" },
        "Pishin": { tehsils: ["Pishin", "Barshore", "Karezat", "Huramzai"], postal: "86500" },
        "Quetta": { tehsils: ["Quetta City", "Quetta Sadar", "Chiltan", "Zarghoon"], postal: "87300" },
        "Sherani": { tehsils: ["Sherani"], postal: "85000" },
        "Sibi": { tehsils: ["Sibi", "Harnai", "Kutmandai", "Lehri"], postal: "82000" },
        "Sohbatpur": { tehsils: ["Sohbatpur", "Manjho Shori"], postal: "80600" },
        "Washuk": { tehsils: ["Washuk", "Basima", "Mashkhel", "Nag"], postal: "94000" },
        "Zhob": { tehsils: ["Zhob", "Killa Saifullah", "Sherani"], postal: "85200" },
        "Ziarat": { tehsils: ["Ziarat", "Sinjawi"], postal: "96200" }
    },
    "Islamabad Capital Territory": {
        "Islamabad": { tehsils: ["Islamabad Urban", "Islamabad Rural"], postal: "44000" }
    },
    "Gilgit-Baltistan": {
        "Astore": { tehsils: ["Astore", "Shounter", "Eidgah"], postal: "14100" },
        "Diamer": { tehsils: ["Chilas", "Darel", "Tangir", "Babusar"], postal: "14000" },
        "Ghanche": { tehsils: ["Khaplu", "Mashabrum", "Daghoni"], postal: "16800" },
        "Ghizer": { tehsils: ["Gahkuch", "Punial", "Ishkoman", "Yasin"], postal: "15200" },
        "Gilgit": { tehsils: ["Gilgit", "Danyore", "Juglot", "Oshikhandass"], postal: "15100" },
        "Hunza": { tehsils: ["Aliabad", "Gulmit", "Sost"], postal: "15700" },
        "Kharmang": { tehsils: ["Tolti", "Kharmang"], postal: "16300" },
        "Nagar": { tehsils: ["Nagar", "Chalt"], postal: "15500" },
        "Shigar": { tehsils: ["Shigar", "Dassu"], postal: "16100" },
        "Skardu": { tehsils: ["Skardu", "Ghanche", "Shigar", "Kharmang"], postal: "16100" }
    },
    "Azad Jammu & Kashmir": {
        "Bagh": { tehsils: ["Bagh", "Dhir Kot", "Hari Ghel", "Rera"], postal: "12500" },
        "Bhimber": { tehsils: ["Bhimber", "Barnala", "Samahni"], postal: "12200" },
        "Haveli": { tehsils: ["Forward Kahuta", "Haveli"], postal: "12550" },
        "Jhelum Valley": { tehsils: ["Hattian Bala", "Chikar", "Leepa"], postal: "12450" },
        "Kotli": { tehsils: ["Kotli", "Charhoi", "Khuiratta", "Sehnsa", "Fatehpur Thakiala"], postal: "12000" },
        "Mirpur": { tehsils: ["Mirpur", "Dadyal", "Chakswari"], postal: "10250" },
        "Muzaffarabad": { tehsils: ["Muzaffarabad", "Nasirabad", "Ghori", "Pattika"], postal: "13100" },
        "Neelum": { tehsils: ["Athmuqam", "Sharda"], postal: "13250" },
        "Poonch": { tehsils: ["Rawalakot", "Hajira", "Abbaspur", "Thorar"], postal: "12350" },
        "Sudhnoti": { tehsils: ["Pallandri", "Baloch", "Tarar Khel"], postal: "12200" }
    }
};

// ============================================
// HELPER FUNCTIONS
// ============================================

// Get all provinces
export function getProvinces() {
    return Object.keys(PAKISTAN_DATA);
}

// Get districts by province
export function getDistricts(province) {
    if (!PAKISTAN_DATA[province]) return [];
    return Object.keys(PAKISTAN_DATA[province]);
}

// Get tehsils by province + district
export function getTehsils(province, district) {
    if (!PAKISTAN_DATA[province] || !PAKISTAN_DATA[province][district]) return [];
    return PAKISTAN_DATA[province][district].tehsils || [];
}

// Get postal code by province + district
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

// Get titles by keyword (search)
export function searchTitles(keyword) {
    if (!keyword) return [];
    const k = keyword.toLowerCase();
    const result = [];
    Object.values(JOB_TITLES_DB).forEach(titles => {
        titles.forEach(t => {
            if (t.toLowerCase().includes(k)) result.push(t);
        });
    });
    return result;
}
