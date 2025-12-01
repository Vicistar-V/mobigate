export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  category: "community-news" | "culture" | "development" | "education" | "opinion";
  coverImage: string;
  publishDate: Date;
  readTime: number;
  likes: number;
  comments: number;
  shares: number;
  featured: boolean;
  tags: string[];
}

export const articleCategories = [
  { id: "all", name: "All Articles", icon: "Newspaper" },
  { id: "community-news", name: "Community News", icon: "Megaphone" },
  { id: "culture", name: "Culture & Heritage", icon: "Landmark" },
  { id: "development", name: "Development", icon: "TrendingUp" },
  { id: "education", name: "Education", icon: "GraduationCap" },
  { id: "opinion", name: "Opinion Pieces", icon: "MessageSquare" }
];

export const articles: Article[] = [
  {
    id: "article-1",
    title: "Community Development Fund Reaches NGN 5M Milestone",
    excerpt: "Our collective efforts have resulted in a significant achievement as the Community Development Fund surpasses 5 million naira, marking a new chapter in our community's growth.",
    content: `Our collective efforts have resulted in a significant achievement as the Community Development Fund surpasses 5 million naira, marking a new chapter in our community's growth.

This milestone represents years of dedication, sacrifice, and commitment from every member of our community. The fund, established in 2020, has been instrumental in financing various development projects across our community.

Key Projects Funded:
- Construction of the Community Hall
- Scholarship programs for 50+ students
- Health outreach programs
- Road infrastructure improvements
- Youth empowerment initiatives

Looking ahead, the Executive Committee has proposed ambitious plans to utilize these funds effectively, including the establishment of a community hospital and expansion of our educational support programs.

Community President, Chief Emmanuel Okonkwo, expressed his gratitude: "This achievement is a testament to what we can accomplish when we work together. Every contribution, no matter how small, has brought us to this point."

The fund continues to accept contributions from members and well-wishers committed to our community's progress.`,
    author: {
      name: "Chukwudi Okafor",
      avatar: "/placeholder.svg",
      role: "Community Reporter"
    },
    category: "development",
    coverImage: "/placeholder.svg",
    publishDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    readTime: 5,
    likes: 156,
    comments: 34,
    shares: 21,
    featured: true,
    tags: ["development", "milestone", "finance"]
  },
  {
    id: "article-2",
    title: "Preserving Our Cultural Heritage: The Annual Yam Festival Returns",
    excerpt: "After a three-year hiatus, our beloved Annual Yam Festival is set to return this December, promising a spectacular celebration of our cultural traditions.",
    content: `After a three-year hiatus, our beloved Annual Yam Festival is set to return this December, promising a spectacular celebration of our cultural traditions.

The festival, which dates back over 100 years, is one of our community's most cherished cultural events. It celebrates the harvest season and honors our agricultural heritage.

This year's festival promises to be bigger and better than ever before. The organizing committee has lined up an impressive program of events:

Festival Highlights:
- Traditional masquerade performances
- Cultural dance competitions
- Traditional cooking demonstrations
- Youth talent showcase
- Awards for exemplary farmers
- Food fair featuring traditional dishes
- Cultural exhibition

According to the festival coordinator, Mrs. Ngozi Eze: "We're excited to bring back this important celebration. The festival is not just about yam; it's about celebrating our identity, bringing generations together, and passing our traditions to our youth."

The event is scheduled for December 20-22, 2024, at the Community Cultural Center. All members and friends of the community are invited to participate.`,
    author: {
      name: "Amina Hassan",
      avatar: "/placeholder.svg",
      role: "Cultural Affairs Secretary"
    },
    category: "culture",
    coverImage: "/placeholder.svg",
    publishDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    readTime: 4,
    likes: 203,
    comments: 45,
    shares: 67,
    featured: true,
    tags: ["culture", "festival", "tradition"]
  },
  {
    id: "article-3",
    title: "Youth Empowerment Program Graduates First Cohort of 30 Youths",
    excerpt: "Thirty young members of our community have successfully completed the inaugural Youth Empowerment and Skills Acquisition Program, equipped with valuable skills for entrepreneurship.",
    content: `Thirty young members of our community have successfully completed the inaugural Youth Empowerment and Skills Acquisition Program, equipped with valuable skills for entrepreneurship.

The program, which ran for six months, provided intensive training in various vocational skills including:
- Fashion design and tailoring
- Catering and hospitality
- Digital marketing
- Computer skills and programming
- Welding and fabrication
- Hairdressing and beauty therapy

Each graduate received a starter pack containing tools and equipment to kickstart their businesses.

Speaking at the graduation ceremony, the Youth Secretary, Mr. Tunde Adeyemi, emphasized the program's importance: "Our youth are our future. By equipping them with skills, we're not just creating employability; we're creating job creators."

The community has committed to launching a second cohort in Q1 2025, with expanded capacity to train 50 participants.`,
    author: {
      name: "Tunde Adeyemi",
      avatar: "/placeholder.svg",
      role: "Youth Secretary"
    },
    category: "education",
    coverImage: "/placeholder.svg",
    publishDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    readTime: 3,
    likes: 142,
    comments: 28,
    shares: 35,
    featured: false,
    tags: ["youth", "education", "skills"]
  },
  {
    id: "article-4",
    title: "Opinion: Unity in Diversity - The Strength of Our Community",
    excerpt: "A reflection on how our community's diversity has become our greatest strength, fostering innovation, tolerance, and progress.",
    content: `As I reflect on the journey of our community over the past decades, one thing stands out clearly: our diversity has been our greatest strength.

Our community comprises people from various backgrounds, professions, age groups, and perspectives. Yet, we have maintained a remarkable unity of purpose.

This unity in diversity manifests in several ways:

1. Decision Making: Our ability to consider multiple viewpoints before making major decisions has saved us from several costly mistakes.

2. Problem Solving: When challenges arise, we bring diverse expertise to the table - lawyers, doctors, engineers, teachers, farmers, and business people all contribute unique perspectives.

3. Cultural Richness: Our celebrations incorporate traditions from various groups, creating a rich tapestry of cultural experiences.

4. Innovation: Diversity sparks creativity. Some of our best community initiatives emerged from cross-pollination of ideas.

However, maintaining this harmony requires constant effort. We must continue to:
- Create platforms for dialogue
- Respect differing opinions
- Focus on our common goals
- Celebrate our differences

As we move forward, let us remember that our strength lies not in uniformity, but in our ability to unite despite our differences.`,
    author: {
      name: "Dr. Emeka Nwosu",
      avatar: "/placeholder.svg",
      role: "Community Elder"
    },
    category: "opinion",
    coverImage: "/placeholder.svg",
    publishDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    readTime: 6,
    likes: 234,
    comments: 56,
    shares: 89,
    featured: true,
    tags: ["opinion", "unity", "reflection"]
  },
  {
    id: "article-5",
    title: "New Community Hospital Project Breaks Ground",
    excerpt: "Construction officially begins on our long-awaited community hospital, a project that will bring quality healthcare closer to our people.",
    content: `In a historic ceremony attended by over 500 community members, the groundbreaking for our new Community Hospital took place last weekend.

The facility, estimated to cost NGN 150 million, will feature:
- 50-bed capacity
- Modern diagnostic center
- Maternity ward
- Emergency services
- Outpatient clinic
- Pharmacy

Chief Medical Director designate, Dr. Fatima Bello, expressed optimism: "This hospital will transform healthcare delivery in our community. No longer will our people need to travel long distances for quality medical care."

The project is expected to be completed in 18 months, with recruitment for medical staff to begin in Q2 2025.

Community members can still contribute to the building fund through the Community Development Account.`,
    author: {
      name: "Ibrahim Musa",
      avatar: "/placeholder.svg",
      role: "Development Secretary"
    },
    category: "development",
    coverImage: "/placeholder.svg",
    publishDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    readTime: 4,
    likes: 312,
    comments: 78,
    shares: 124,
    featured: true,
    tags: ["healthcare", "development", "project"]
  },
  {
    id: "article-6",
    title: "Community Elders Share Wisdom at Youth Mentorship Session",
    excerpt: "The inaugural Youth-Elders Mentorship Program brings together generations in meaningful dialogue about life, success, and community values.",
    content: `The Community Hall was packed to capacity as young members gathered to hear wisdom from our esteemed elders in the first-ever Youth-Elders Mentorship Session.

Five distinguished elders shared insights on topics including:
- Education and career success
- Family values and relationships
- Financial wisdom
- Leadership and service
- Preserving cultural identity

Participants praised the initiative, with many expressing desire for regular sessions.

"This is what we need," said 23-year-old participant Ada Okonkwo. "The wisdom and life experiences of our elders are invaluable resources we must tap into."

The program will run quarterly, with the next session scheduled for March 2025.`,
    author: {
      name: "Chioma Eze",
      avatar: "/placeholder.svg",
      role: "Elders' Council Secretary"
    },
    category: "community-news",
    coverImage: "/placeholder.svg",
    publishDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
    readTime: 3,
    likes: 187,
    comments: 42,
    shares: 53,
    featured: false,
    tags: ["youth", "mentorship", "tradition"]
  }
];
