import person1 from "@/assets/community-person-1.jpg";
import person2 from "@/assets/community-person-2.jpg";
import person3 from "@/assets/community-person-3.jpg";
import person4 from "@/assets/community-person-4.jpg";
import person5 from "@/assets/community-person-5.jpg";
import person6 from "@/assets/community-person-6.jpg";
import person7 from "@/assets/community-person-7.jpg";
import person8 from "@/assets/community-person-8.jpg";

export interface ExecutiveMember {
  id: string;
  name: string;
  position: string;
  tenure: string;
  imageUrl: string;
  level: "topmost" | "deputy" | "officer" | "staff";
  committee: "executive" | "ad-hoc" | "staff";
  adHocDepartment?: "Finance" | "Welfare" | "Protocol" | "Education" | "Sports";
  isFriend?: boolean;
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
  },
  {
    id: "exec-4",
    name: "Mr. Chidi Adebayo",
    position: "Treasurer",
    tenure: "[2024 - 2028]",
    imageUrl: person7,
    level: "officer",
    committee: "executive",
  },
  {
    id: "exec-5",
    name: "Mrs. Amara Diallo",
    position: "Financial Secretary",
    tenure: "[2024 - 2028]",
    imageUrl: person1,
    level: "officer",
    committee: "executive",
  },
  {
    id: "exec-6",
    name: "Mr. Kofi Mensah",
    position: "Public Relations Officer",
    tenure: "[2024 - 2028]",
    imageUrl: person4,
    level: "officer",
    committee: "executive",
  },
  {
    id: "exec-7",
    name: "Dr. Zawadi Mwangi",
    position: "Social Director",
    tenure: "[2024 - 2028]",
    imageUrl: person1,
    level: "officer",
    committee: "executive",
  },
  {
    id: "exec-8",
    name: "Rev. Thabo Ndlovu",
    position: "Provost",
    tenure: "[2024 - 2028]",
    imageUrl: person5,
    level: "officer",
    committee: "executive",
  },
  {
    id: "exec-9",
    name: "Prof. Fatima Ibrahim",
    position: "Auditor",
    tenure: "[2024 - 2028]",
    imageUrl: person6,
    level: "officer",
    committee: "executive",
  },
  {
    id: "exec-10",
    name: "Mr. Solomon Tesfaye",
    position: "Welfare Officer",
    tenure: "[2024 - 2028]",
    imageUrl: person7,
    level: "officer",
    committee: "executive",
  },
  {
    id: "exec-11",
    name: "Mrs. Lindiwe Dlamini",
    position: "Protocol Officer",
    tenure: "[2024 - 2028]",
    imageUrl: person1,
    level: "officer",
    committee: "executive",
  },
  {
    id: "exec-12",
    name: "Chief Grace Achieng",
    position: "Legal Adviser",
    tenure: "[2024 - 2028]",
    imageUrl: person6,
    level: "officer",
    committee: "executive",
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
  {
    id: "tenure-9",
    position: "Auditor",
    currentHolder: "Prof. Fatima Ibrahim",
    termStart: "January 2024",
    termEnd: "December 2028",
    duration: "4 Years",
  },
];