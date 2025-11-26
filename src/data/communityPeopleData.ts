import person1 from "@/assets/community-person-1.jpg";
import person2 from "@/assets/community-person-2.jpg";
import person3 from "@/assets/community-person-3.jpg";
import person4 from "@/assets/community-person-4.jpg";
import person5 from "@/assets/community-person-5.jpg";
import person6 from "@/assets/community-person-6.jpg";
import person7 from "@/assets/community-person-7.jpg";
import person8 from "@/assets/community-person-8.jpg";

export interface CommunityPerson {
  id: string;
  name: string;
  title: string;
  imageUrl: string;
  country?: string;
}

export const communityPeople: CommunityPerson[] = [
  {
    id: "person-1",
    name: "Chief Adebayo Okonkwo",
    title: "Community Elder & Wisdom Keeper",
    imageUrl: person2,
    country: "Nigeria"
  },
  {
    id: "person-2",
    name: "Mama Amara Diallo",
    title: "Cultural Ambassador",
    imageUrl: person6,
    country: "Senegal"
  },
  {
    id: "person-3",
    name: "Dr. Kofi Mensah",
    title: "Heritage Guardian & Educator",
    imageUrl: person7,
    country: "Ghana"
  },
  {
    id: "person-4",
    name: "Bibi Zawadi Mwangi",
    title: "Women's Council Leader",
    imageUrl: person1,
    country: "Kenya"
  },
  {
    id: "person-5",
    name: "Baba Thabo Ndlovu",
    title: "Traditional Council Chairman",
    imageUrl: person8,
    country: "South Africa"
  },
  {
    id: "person-6",
    name: "Nyanya Fatima Ibrahim",
    title: "Community Mother & Mediator",
    imageUrl: person6,
    country: "Tanzania"
  },
  {
    id: "person-7",
    name: "Mzee Solomon Tesfaye",
    title: "Spiritual Leader",
    imageUrl: person5,
    country: "Ethiopia"
  },
  {
    id: "person-8",
    name: "Gogo Lindiwe Dlamini",
    title: "Traditional Healer & Guide",
    imageUrl: person1,
    country: "Zimbabwe"
  },
  {
    id: "person-9",
    name: "Chief Emeka Nwosu",
    title: "Village Head & Justice Arbiter",
    imageUrl: person8,
    country: "Nigeria"
  },
  {
    id: "person-10",
    name: "Mama Grace Achieng",
    title: "Youth Mentor & Educator",
    imageUrl: person1,
    country: "Uganda"
  },
  {
    id: "person-11",
    name: "Professor Kwame Asante",
    title: "Education Pioneer & Historian",
    imageUrl: person7,
    country: "Ghana"
  },
  {
    id: "person-12",
    name: "Aunty Ngozi Eze",
    title: "Skills Training Coordinator",
    imageUrl: person6,
    country: "Nigeria"
  },
  {
    id: "person-13",
    name: "Elder Yusuf Kamara",
    title: "Peace Building Ambassador",
    imageUrl: person4,
    country: "Sierra Leone"
  },
  {
    id: "person-14",
    name: "Mama Esi Owusu",
    title: "Community Organizer",
    imageUrl: person1,
    country: "Ghana"
  },
  {
    id: "person-15",
    name: "Chief Chinedu Okafor",
    title: "Development Advocate",
    imageUrl: person2,
    country: "Nigeria"
  }
];
