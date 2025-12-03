import person1 from "@/assets/community-person-1.jpg";
import person2 from "@/assets/community-person-2.jpg";
import person3 from "@/assets/community-person-3.jpg";
import person4 from "@/assets/community-person-4.jpg";
import person5 from "@/assets/community-person-5.jpg";
import person6 from "@/assets/community-person-6.jpg";
import person7 from "@/assets/community-person-7.jpg";
import person8 from "@/assets/community-person-8.jpg";

// Personal Profile / Brief Resume interface
export interface ExecutiveProfile {
  bio?: string;
  profession?: string;
  stateOfOrigin?: string;
  lga?: string;
  hometown?: string;
  education?: {
    institution: string;
    qualification: string;
    year?: string;
  }[];
  previousPositions?: {
    position: string;
    period: string;
  }[];
  professionalAchievements?: string[];
  phone?: string;
  email?: string;
}

export interface ExecutiveMember {
  id: string;
  name: string;
  position: string;
  tenure: string;
  imageUrl: string;
  communityImageUrl?: string; // Community-specific profile photo (separate from Mobigate)
  level: "topmost" | "deputy" | "officer" | "staff";
  committee: "executive" | "ad-hoc" | "staff";
  adHocDepartment?: "Finance" | "Welfare" | "Protocol" | "Education" | "Sports";
  isFriend?: boolean;
  electedDate?: string;
  tenureDuration?: string;
  milestones?: string[];
  profile?: ExecutiveProfile;
  // Admin role fields - visible only to the officer themselves
  isAdmin?: boolean;
  adminRole?: string; // e.g., "Admin-1", "Admin-2"
}

export const executiveMembers: ExecutiveMember[] = [
  // TOPMOST - President-General (Featured)
  {
    id: "exec-1",
    name: "DR. MARK ANTHONY ONWUDINJO",
    position: "President-General",
    tenure: "[2024 - 2028]",
    imageUrl: person2,
    level: "topmost",
    committee: "executive",
    isAdmin: true,
    adminRole: "Admin-1",
    electedDate: "January 2024",
    tenureDuration: "Four Years",
    milestones: [
      "Anambra Hospital Project, Jos.",
      "Igbo Cultural Centre, Jos.",
      "Free Scholarship Scheme for Anambra Less-privileged in Jos.",
      "Community Development Fund Initiative",
      "Youth Empowerment Program Launch",
    ],
    profile: {
      bio: "A distinguished legal practitioner and community leader with over 25 years of experience in corporate law and real estate development. Passionate about youth empowerment, education, and community development.",
      profession: "Lawyer / Real Estate Developer",
      stateOfOrigin: "Anambra State",
      lga: "Onitsha North",
      hometown: "Onitsha",
      education: [
        { institution: "University of Nigeria, Nsukka", qualification: "LL.B (Hons)", year: "1995" },
        { institution: "Nigerian Law School", qualification: "B.L.", year: "1996" },
        { institution: "Harvard Business School", qualification: "Executive MBA", year: "2010" },
      ],
      previousPositions: [
        { position: "Vice-President-General", period: "2020 - 2024" },
        { position: "Financial Secretary", period: "2016 - 2020" },
        { position: "Youth Leader", period: "2008 - 2012" },
      ],
      professionalAchievements: [
        "Founder & CEO, BeamColumn PCC Limited",
        "Member, Nigerian Bar Association (NBA)",
        "Fellow, Institute of Chartered Mediators & Conciliators",
        "Award: Outstanding Community Leader 2023",
      ],
      phone: "+234-806-408-9171",
      email: "dr.onwudinjo@email.com",
    },
  },
  
  // DEPUTY LEVEL
  {
    id: "exec-2",
    name: "Chief Emeka Nwosu",
    position: "Vice-President-General",
    tenure: "[2024 - 2028]",
    imageUrl: person8,
    level: "deputy",
    committee: "executive",
    isAdmin: true,
    adminRole: "Admin-2",
    electedDate: "January 2024",
    tenureDuration: "Four Years",
    milestones: [
      "Infrastructure Development Committee Chair",
      "Inter-Community Relations Program",
      "Strategic Planning Implementation",
    ],
    profile: {
      bio: "A seasoned businessman and philanthropist with extensive experience in community leadership. Known for his strategic vision and commitment to infrastructure development.",
      profession: "Businessman / Philanthropist",
      stateOfOrigin: "Anambra State",
      lga: "Nnewi North",
      hometown: "Nnewi",
      education: [
        { institution: "University of Lagos", qualification: "B.Sc. Business Administration", year: "1992" },
        { institution: "Lagos Business School", qualification: "AMP", year: "2005" },
      ],
      previousPositions: [
        { position: "Secretary-General", period: "2016 - 2020" },
        { position: "Social Director", period: "2012 - 2016" },
      ],
      professionalAchievements: [
        "CEO, Nwosu Holdings Limited",
        "Board Member, Chamber of Commerce",
        "Patron, Youth Development Foundation",
      ],
      phone: "+234-803-555-1234",
      email: "chief.nwosu@email.com",
    },
  },
  
  // OFFICERS
  {
    id: "exec-3",
    name: "Barr. Ngozi Okonkwo",
    position: "Secretary-General",
    tenure: "[2024 - 2028]",
    imageUrl: person6,
    level: "officer",
    committee: "executive",
    isAdmin: true,
    adminRole: "Admin-3",
    electedDate: "January 2024",
    tenureDuration: "Four Years",
    milestones: [
      "Digital Record Management System",
      "Meeting Documentation Excellence",
      "Communication Framework Development",
    ],
    profile: {
      bio: "An accomplished legal practitioner specializing in corporate law and governance. Known for meticulous record-keeping and effective communication strategies.",
      profession: "Legal Practitioner",
      stateOfOrigin: "Anambra State",
      lga: "Awka South",
      hometown: "Awka",
      education: [
        { institution: "Nnamdi Azikiwe University", qualification: "LL.B (Hons)", year: "2005" },
        { institution: "Nigerian Law School", qualification: "B.L.", year: "2006" },
        { institution: "University of Ibadan", qualification: "LL.M", year: "2012" },
      ],
      previousPositions: [
        { position: "Assistant Secretary", period: "2020 - 2024" },
        { position: "Legal Committee Member", period: "2016 - 2020" },
      ],
      professionalAchievements: [
        "Partner, Okonkwo & Associates",
        "Member, International Bar Association",
        "Award: Best Secretary 2022",
      ],
      phone: "+234-805-666-7890",
      email: "barr.okonkwo@email.com",
    },
  },
  {
    id: "exec-4",
    name: "Mr. Chidi Adebayo",
    position: "Treasurer",
    tenure: "[2024 - 2028]",
    imageUrl: person7,
    level: "officer",
    committee: "executive",
    isAdmin: true,
    adminRole: "Admin-4",
    electedDate: "January 2024",
    tenureDuration: "Four Years",
    milestones: [
      "Financial Transparency Initiative",
      "Budget Optimization Program",
      "Investment Portfolio Management",
    ],
    profile: {
      bio: "A chartered accountant with over 15 years experience in financial management. Expert in treasury operations and investment strategies.",
      profession: "Chartered Accountant",
      stateOfOrigin: "Anambra State",
      lga: "Aguata",
      hometown: "Ekwulobia",
      education: [
        { institution: "University of Nigeria, Nsukka", qualification: "B.Sc. Accounting", year: "2003" },
        { institution: "ICAN", qualification: "FCA", year: "2010" },
      ],
      previousPositions: [
        { position: "Finance Committee Member", period: "2018 - 2024" },
        { position: "Assistant Treasurer", period: "2016 - 2018" },
      ],
      professionalAchievements: [
        "Senior Partner, Adebayo & Co. Chartered Accountants",
        "Fellow, ICAN",
        "Certified Treasury Professional",
      ],
      phone: "+234-802-777-4567",
      email: "chidi.adebayo@email.com",
    },
  },
  {
    id: "exec-5",
    name: "Mrs. Amara Diallo",
    position: "Financial Secretary",
    tenure: "[2024 - 2028]",
    imageUrl: person1,
    level: "officer",
    committee: "executive",
    isAdmin: true,
    adminRole: "Admin-5",
    electedDate: "January 2024",
    tenureDuration: "Four Years",
    milestones: [
      "Automated Payment System Implementation",
      "Financial Reporting Standards",
      "Member Contribution Tracking",
    ],
    profile: {
      bio: "A finance professional with expertise in financial administration and record management. Passionate about implementing modern financial systems.",
      profession: "Finance Administrator",
      stateOfOrigin: "Anambra State",
      lga: "Idemili North",
      hometown: "Ogidi",
      education: [
        { institution: "Ahmadu Bello University", qualification: "B.Sc. Finance", year: "2008" },
        { institution: "University of Lagos", qualification: "MBA Finance", year: "2015" },
      ],
      previousPositions: [
        { position: "Auditor", period: "2020 - 2024" },
        { position: "Finance Committee Secretary", period: "2016 - 2020" },
      ],
      professionalAchievements: [
        "Certified Financial Analyst",
        "Member, Chartered Institute of Bankers",
      ],
      phone: "+234-806-888-2345",
      email: "amara.diallo@email.com",
    },
  },
  {
    id: "exec-6",
    name: "Mr. Kofi Mensah",
    position: "Public Relations Officer",
    tenure: "[2024 - 2028]",
    imageUrl: person4,
    level: "officer",
    committee: "executive",
    electedDate: "January 2024",
    tenureDuration: "Four Years",
    milestones: [
      "Media Engagement Strategy",
      "Community Brand Development",
      "Digital Presence Enhancement",
    ],
    profile: {
      bio: "A communications expert with extensive experience in public relations and media management. Known for building strong community brands.",
      profession: "Communications Consultant",
      stateOfOrigin: "Anambra State",
      lga: "Anaocha",
      hometown: "Neni",
      education: [
        { institution: "University of Ghana", qualification: "B.A. Mass Communication", year: "2007" },
        { institution: "Pan-Atlantic University", qualification: "MSc. Marketing", year: "2014" },
      ],
      previousPositions: [
        { position: "Assistant PRO", period: "2020 - 2024" },
        { position: "Media Committee Chair", period: "2018 - 2020" },
      ],
      professionalAchievements: [
        "CEO, Mensah Media Group",
        "Member, NIPR",
        "Award: Best PR Campaign 2021",
      ],
      phone: "+234-803-999-6789",
      email: "kofi.mensah@email.com",
    },
  },
  {
    id: "exec-7",
    name: "Dr. Zawadi Mwangi",
    position: "Social Director",
    tenure: "[2024 - 2028]",
    imageUrl: person1,
    level: "officer",
    committee: "executive",
    electedDate: "January 2024",
    tenureDuration: "Four Years",
    milestones: [
      "Annual Gala Organization",
      "Member Engagement Programs",
      "Cultural Events Coordination",
    ],
    profile: {
      bio: "An event management specialist with a flair for creating memorable experiences. Expert in social coordination and cultural programming.",
      profession: "Event Manager",
      stateOfOrigin: "Anambra State",
      lga: "Onitsha South",
      hometown: "Fegge",
      education: [
        { institution: "Kenyatta University", qualification: "B.A. Hospitality", year: "2010" },
        { institution: "Cornell University", qualification: "Certificate in Event Management", year: "2016" },
      ],
      previousPositions: [
        { position: "Social Committee Chair", period: "2018 - 2024" },
      ],
      professionalAchievements: [
        "Director, Zawadi Events",
        "Certified Event Planner",
        "Award: Best Community Event 2023",
      ],
      phone: "+234-805-111-3456",
      email: "zawadi.mwangi@email.com",
    },
  },
  {
    id: "exec-8",
    name: "Rev. Thabo Ndlovu",
    position: "Provost",
    tenure: "[2024 - 2028]",
    imageUrl: person5,
    level: "officer",
    committee: "executive",
    electedDate: "January 2024",
    tenureDuration: "Four Years",
    milestones: [
      "Spiritual Guidance Programs",
      "Community Prayer Initiatives",
      "Interfaith Dialogue Sessions",
    ],
    profile: {
      bio: "A respected religious leader with decades of experience in spiritual guidance and community building. Known for promoting unity and moral values.",
      profession: "Clergy / Religious Leader",
      stateOfOrigin: "Anambra State",
      lga: "Orumba South",
      hometown: "Umunze",
      education: [
        { institution: "Bigard Memorial Seminary", qualification: "B.Phil. & B.Th.", year: "1995" },
        { institution: "Pontifical University", qualification: "MA Theology", year: "2002" },
      ],
      previousPositions: [
        { position: "Chaplain", period: "2016 - 2024" },
        { position: "Spiritual Adviser", period: "2012 - 2016" },
      ],
      professionalAchievements: [
        "Parish Priest, St. Anthony's Parish",
        "Vicar General, Diocese",
        "Founder, Youth Moral Rearmament",
      ],
      phone: "+234-806-222-4567",
      email: "rev.ndlovu@email.com",
    },
  },
  {
    id: "exec-9",
    name: "Prof. Fatima Ibrahim",
    position: "Auditor",
    tenure: "[2024 - 2028]",
    imageUrl: person6,
    level: "officer",
    committee: "executive",
    electedDate: "January 2024",
    tenureDuration: "Four Years",
    milestones: [
      "Annual Financial Audit Excellence",
      "Compliance Framework Development",
      "Risk Management Systems",
    ],
    profile: {
      bio: "An esteemed professor of accounting with expertise in auditing and financial compliance. Known for integrity and thoroughness.",
      profession: "Professor of Accounting",
      stateOfOrigin: "Anambra State",
      lga: "Dunukofia",
      hometown: "Ukpo",
      education: [
        { institution: "Ahmadu Bello University", qualification: "B.Sc. Accounting", year: "1990" },
        { institution: "University of Manchester", qualification: "PhD Accounting", year: "2000" },
      ],
      previousPositions: [
        { position: "Finance Committee Auditor", period: "2016 - 2024" },
      ],
      professionalAchievements: [
        "Professor, University of Jos",
        "Fellow, ICAN",
        "Consultant, World Bank",
      ],
      phone: "+234-802-333-5678",
      email: "prof.ibrahim@email.com",
    },
  },
  {
    id: "exec-10",
    name: "Mr. Solomon Tesfaye",
    position: "Welfare Officer",
    tenure: "[2024 - 2028]",
    imageUrl: person7,
    level: "officer",
    committee: "executive",
    electedDate: "January 2024",
    tenureDuration: "Four Years",
    milestones: [
      "Member Support Programs",
      "Health Insurance Scheme",
      "Emergency Assistance Fund",
    ],
    profile: {
      bio: "A social worker with passion for community welfare and member support. Expert in designing and implementing welfare programs.",
      profession: "Social Worker / NGO Manager",
      stateOfOrigin: "Anambra State",
      lga: "Ihiala",
      hometown: "Ihiala",
      education: [
        { institution: "University of Ibadan", qualification: "B.Sc. Social Work", year: "2005" },
        { institution: "University of Cape Town", qualification: "MSc. Development Studies", year: "2012" },
      ],
      previousPositions: [
        { position: "Welfare Committee Chair", period: "2020 - 2024" },
        { position: "Assistant Welfare Officer", period: "2016 - 2020" },
      ],
      professionalAchievements: [
        "Executive Director, Hope Foundation",
        "Member, Nigerian Institute of Social Workers",
        "Award: Humanitarian Service 2022",
      ],
      phone: "+234-805-444-6789",
      email: "solomon.tesfaye@email.com",
    },
  },
  {
    id: "exec-11",
    name: "Mrs. Lindiwe Dlamini",
    position: "Protocol Officer",
    tenure: "[2024 - 2028]",
    imageUrl: person1,
    level: "officer",
    committee: "executive",
    electedDate: "January 2024",
    tenureDuration: "Four Years",
    milestones: [
      "Event Protocol Standards",
      "VIP Guest Management",
      "Ceremonial Procedures Development",
    ],
    profile: {
      bio: "A protocol specialist with experience in diplomatic and ceremonial affairs. Expert in guest management and event coordination.",
      profession: "Protocol Specialist",
      stateOfOrigin: "Anambra State",
      lga: "Njikoka",
      hometown: "Abagana",
      education: [
        { institution: "University of South Africa", qualification: "BA International Relations", year: "2008" },
        { institution: "Diplomatic Academy Vienna", qualification: "Diploma in Protocol", year: "2015" },
      ],
      previousPositions: [
        { position: "Protocol Committee Chair", period: "2020 - 2024" },
        { position: "Assistant Protocol Officer", period: "2018 - 2020" },
      ],
      professionalAchievements: [
        "Chief Protocol Officer, Embassy Experience",
        "Certified Protocol Professional",
        "Award: Excellence in Protocol 2021",
      ],
      phone: "+234-803-555-7890",
      email: "lindiwe.dlamini@email.com",
    },
  },
  {
    id: "exec-12",
    name: "Chief Grace Achieng",
    position: "Legal Adviser",
    tenure: "[2024 - 2028]",
    imageUrl: person6,
    level: "officer",
    committee: "executive",
    electedDate: "January 2024",
    tenureDuration: "Four Years",
    milestones: [
      "Legal Framework Modernization",
      "Contract Review Systems",
      "Dispute Resolution Mechanisms",
    ],
    profile: {
      bio: "A senior legal practitioner with expertise in community law and dispute resolution. Known for fair and effective legal guidance.",
      profession: "Senior Advocate / Arbitrator",
      stateOfOrigin: "Anambra State",
      lga: "Nnewi South",
      hometown: "Ukpor",
      education: [
        { institution: "University of Nigeria, Nsukka", qualification: "LL.B (Hons)", year: "1988" },
        { institution: "Nigerian Law School", qualification: "B.L.", year: "1989" },
        { institution: "Harvard Law School", qualification: "LL.M", year: "1995" },
      ],
      previousPositions: [
        { position: "Legal Committee Chair", period: "2016 - 2024" },
        { position: "Constitution Review Chair", period: "2012 - 2016" },
      ],
      professionalAchievements: [
        "Senior Advocate of Nigeria (SAN)",
        "Chartered Arbitrator",
        "Board Member, Nigerian Bar Association",
        "Award: Legal Icon 2020",
      ],
      phone: "+234-806-666-8901",
      email: "chief.achieng@email.com",
    },
  },
];

// AD-HOC COMMITTEE MEMBERS
export const adHocMembers: ExecutiveMember[] = [
  // Finance Committee
  {
    id: "adhoc-1",
    name: "Mr. Kwame Asante",
    position: "Finance Committee Chairman",
    tenure: "[2024 - 2025]",
    imageUrl: person7,
    level: "officer",
    committee: "ad-hoc",
    adHocDepartment: "Finance",
    profile: {
      bio: "A finance professional with expertise in budget management and financial planning.",
      profession: "Financial Analyst",
      stateOfOrigin: "Anambra State",
      lga: "Oyi",
      hometown: "Nteje",
      phone: "+234-802-111-2222",
    },
  },
  {
    id: "adhoc-2",
    name: "Mrs. Esi Owusu",
    position: "Finance Committee Secretary",
    tenure: "[2024 - 2025]",
    imageUrl: person1,
    level: "officer",
    committee: "ad-hoc",
    adHocDepartment: "Finance",
    profile: {
      bio: "An administrative professional with strong organizational skills.",
      profession: "Administrator",
      stateOfOrigin: "Anambra State",
      lga: "Awka North",
      hometown: "Amawbia",
    },
  },
  {
    id: "adhoc-3",
    name: "Mr. Yusuf Kamara",
    position: "Finance Committee Member",
    tenure: "[2024 - 2025]",
    imageUrl: person4,
    level: "officer",
    committee: "ad-hoc",
    adHocDepartment: "Finance",
  },
  {
    id: "adhoc-4",
    name: "Dr. Chinedu Okafor",
    position: "Finance Committee Member",
    tenure: "[2024 - 2025]",
    imageUrl: person2,
    level: "officer",
    committee: "ad-hoc",
    adHocDepartment: "Finance",
  },
  
  // Welfare Committee
  {
    id: "adhoc-5",
    name: "Mama Adebayo",
    position: "Welfare Committee Chairman",
    tenure: "[2024 - 2025]",
    imageUrl: person6,
    level: "officer",
    committee: "ad-hoc",
    adHocDepartment: "Welfare",
    profile: {
      bio: "A compassionate community elder with decades of experience in welfare services.",
      profession: "Retired Civil Servant",
      stateOfOrigin: "Anambra State",
      lga: "Ogbaru",
      hometown: "Atani",
    },
  },
  {
    id: "adhoc-6",
    name: "Mr. Kofi Mensah",
    position: "Welfare Committee Secretary",
    tenure: "[2024 - 2025]",
    imageUrl: person7,
    level: "officer",
    committee: "ad-hoc",
    adHocDepartment: "Welfare",
  },
  {
    id: "adhoc-7",
    name: "Dr. Zawadi Mwangi",
    position: "Welfare Committee Member",
    tenure: "[2024 - 2025]",
    imageUrl: person1,
    level: "officer",
    committee: "ad-hoc",
    adHocDepartment: "Welfare",
  },
  {
    id: "adhoc-8",
    name: "Chief Thabo Ndlovu",
    position: "Welfare Committee Member",
    tenure: "[2024 - 2025]",
    imageUrl: person8,
    level: "officer",
    committee: "ad-hoc",
    adHocDepartment: "Welfare",
  },
  
  // Protocol Committee
  {
    id: "adhoc-9",
    name: "Mrs. Fatima Ibrahim",
    position: "Protocol Committee Chairman",
    tenure: "[2024 - 2025]",
    imageUrl: person6,
    level: "officer",
    committee: "ad-hoc",
    adHocDepartment: "Protocol",
  },
  {
    id: "adhoc-10",
    name: "Mr. Solomon Tesfaye",
    position: "Protocol Committee Secretary",
    tenure: "[2024 - 2025]",
    imageUrl: person5,
    level: "officer",
    committee: "ad-hoc",
    adHocDepartment: "Protocol",
  },
  {
    id: "adhoc-11",
    name: "Mrs. Lindiwe Dlamini",
    position: "Protocol Committee Member",
    tenure: "[2024 - 2025]",
    imageUrl: person1,
    level: "officer",
    committee: "ad-hoc",
    adHocDepartment: "Protocol",
  },
  {
    id: "adhoc-12",
    name: "Chief Grace Achieng",
    position: "Protocol Committee Member",
    tenure: "[2024 - 2025]",
    imageUrl: person6,
    level: "officer",
    committee: "ad-hoc",
    adHocDepartment: "Protocol",
  },

  // Education Committee
  {
    id: "adhoc-13",
    name: "Prof. Kwame Asante",
    position: "Education Committee Chairman",
    tenure: "[2024 - 2025]",
    imageUrl: person7,
    level: "officer",
    committee: "ad-hoc",
    adHocDepartment: "Education",
  },
  {
    id: "adhoc-14",
    name: "Dr. Esi Owusu",
    position: "Education Committee Secretary",
    tenure: "[2024 - 2025]",
    imageUrl: person1,
    level: "officer",
    committee: "ad-hoc",
    adHocDepartment: "Education",
  },
  
  // Sports Committee
  {
    id: "adhoc-15",
    name: "Mr. Yusuf Kamara",
    position: "Sports Committee Chairman",
    tenure: "[2024 - 2025]",
    imageUrl: person4,
    level: "officer",
    committee: "ad-hoc",
    adHocDepartment: "Sports",
  },
  {
    id: "adhoc-16",
    name: "Coach Chinedu Okafor",
    position: "Sports Committee Secretary",
    tenure: "[2024 - 2025]",
    imageUrl: person2,
    level: "officer",
    committee: "ad-hoc",
    adHocDepartment: "Sports",
  },
];

// STAFF & EMPLOYEES
export const staffMembers: ExecutiveMember[] = [
  {
    id: "staff-1",
    name: "Mr. Adebayo Johnson",
    position: "General Manager",
    tenure: "[2023 - Present]",
    imageUrl: person7,
    level: "staff",
    committee: "staff",
    profile: {
      bio: "A seasoned administrator with extensive experience in organizational management.",
      profession: "Administrator",
      education: [
        { institution: "University of Lagos", qualification: "MBA", year: "2015" },
      ],
    },
  },
  {
    id: "staff-2",
    name: "Mrs. Amina Hassan",
    position: "Personal Assistant to President",
    tenure: "[2023 - Present]",
    imageUrl: person6,
    level: "staff",
    committee: "staff",
  },
  {
    id: "staff-3",
    name: "Mr. David Okonkwo",
    position: "Chief Accountant",
    tenure: "[2022 - Present]",
    imageUrl: person4,
    level: "staff",
    committee: "staff",
  },
  {
    id: "staff-4",
    name: "Mr. Emmanuel Nwankwo",
    position: "IT Administrator",
    tenure: "[2023 - Present]",
    imageUrl: person5,
    level: "staff",
    committee: "staff",
  },
  {
    id: "staff-5",
    name: "Mrs. Blessing Adeyemi",
    position: "Administrative Officer",
    tenure: "[2023 - Present]",
    imageUrl: person1,
    level: "staff",
    committee: "staff",
  },
  {
    id: "staff-6",
    name: "Mr. Joshua Okafor",
    position: "Security Officer",
    tenure: "[2022 - Present]",
    imageUrl: person8,
    level: "staff",
    committee: "staff",
  },
  {
    id: "staff-7",
    name: "Mrs. Rose Adeola",
    position: "Office Cleaner",
    tenure: "[2021 - Present]",
    imageUrl: person6,
    level: "staff",
    committee: "staff",
  },
  {
    id: "staff-8",
    name: "Mr. Samuel Ugochukwu",
    position: "Maintenance Officer",
    tenure: "[2022 - Present]",
    imageUrl: person7,
    level: "staff",
    committee: "staff",
  },
];

// Office Tenure Information
export interface OfficeTenure {
  id: string;
  position: string;
  currentHolder: string;
  termStart: string;
  termEnd: string;
  duration: string;
}

export const officeTenures: OfficeTenure[] = [
  {
    id: "tenure-1",
    position: "President-General",
    currentHolder: "DR. MARK ANTHONY ONWUDINJO",
    termStart: "January 2024",
    termEnd: "December 2028",
    duration: "4 Years",
  },
  {
    id: "tenure-2",
    position: "Vice-President-General",
    currentHolder: "Chief Emeka Nwosu",
    termStart: "January 2024",
    termEnd: "December 2028",
    duration: "4 Years",
  },
  {
    id: "tenure-3",
    position: "Secretary-General",
    currentHolder: "Barr. Ngozi Okonkwo",
    termStart: "January 2024",
    termEnd: "December 2028",
    duration: "4 Years",
  },
  {
    id: "tenure-4",
    position: "Treasurer",
    currentHolder: "Mr. Chidi Adebayo",
    termStart: "January 2024",
    termEnd: "December 2028",
    duration: "4 Years",
  },
  {
    id: "tenure-5",
    position: "Financial Secretary",
    currentHolder: "Mrs. Amara Diallo",
    termStart: "January 2024",
    termEnd: "December 2028",
    duration: "4 Years",
  },
  {
    id: "tenure-6",
    position: "Public Relations Officer",
    currentHolder: "Mr. Kofi Mensah",
    termStart: "January 2024",
    termEnd: "December 2028",
    duration: "4 Years",
  },
  {
    id: "tenure-7",
    position: "Social Director",
    currentHolder: "Dr. Zawadi Mwangi",
    termStart: "January 2024",
    termEnd: "December 2028",
    duration: "4 Years",
  },
  {
    id: "tenure-8",
    position: "Provost",
    currentHolder: "Rev. Thabo Ndlovu",
    termStart: "January 2024",
    termEnd: "December 2028",
    duration: "4 Years",
  },
];
