export interface CommunityIDCard {
  id: string;
  memberName: string;
  memberId: string;
  memberPhoto: string;
  qrCode: string;
  issueDate: Date;
  expiryDate: Date;
  status: "active" | "expired" | "suspended";
  cardNumber: string;
}

export interface LetterTemplate {
  id: string;
  title: string;
  description: string;
  category: "recommendation" | "confirmation" | "clearance" | "invitation" | "general";
  icon: string;
  requiresApproval: boolean;
}

export interface LetterRequest {
  id: string;
  templateId: string;
  requestedBy: string;
  requestDate: Date;
  purpose: string;
  status: "pending" | "approved" | "rejected" | "issued";
  approvedBy?: string;
  approvalDate?: Date;
  letterNumber?: string;
}

export interface Publication {
  id: string;
  title: string;
  description: string;
  type: "magazine" | "journal" | "newsletter" | "report";
  coverImage: string;
  publishDate: Date;
  edition: string;
  pages: number;
  fileSize: string;
  downloadUrl: string;
  featured: boolean;
}

export const mockIDCard: CommunityIDCard = {
  id: "id-001",
  memberName: "John Doe",
  memberId: "MEM-2024-0123",
  memberPhoto: "/placeholder.svg",
  qrCode: "QR-MEM-2024-0123",
  issueDate: new Date("2024-01-15"),
  expiryDate: new Date("2026-01-14"),
  status: "active",
  cardNumber: "CMT-001-0123"
};

export const letterTemplates: LetterTemplate[] = [
  {
    id: "template-1",
    title: "Letter of Recommendation",
    description: "Official recommendation letter for employment or educational purposes",
    category: "recommendation",
    icon: "FileCheck",
    requiresApproval: true
  },
  {
    id: "template-2",
    title: "Membership Confirmation Letter",
    description: "Confirms active membership status in the community",
    category: "confirmation",
    icon: "UserCheck",
    requiresApproval: true
  },
  {
    id: "template-3",
    title: "Financial Clearance Letter",
    description: "Confirms that member has no outstanding financial obligations",
    category: "clearance",
    icon: "DollarSign",
    requiresApproval: true
  },
  {
    id: "template-4",
    title: "Good Standing Certificate",
    description: "Certificate confirming member is in good standing with the community",
    category: "confirmation",
    icon: "Award",
    requiresApproval: true
  },
  {
    id: "template-5",
    title: "Event Invitation Letter",
    description: "Formal invitation to community events and ceremonies",
    category: "invitation",
    icon: "Mail",
    requiresApproval: false
  },
  {
    id: "template-6",
    title: "Character Reference Letter",
    description: "Character reference from the community leadership",
    category: "recommendation",
    icon: "Shield",
    requiresApproval: true
  },
  {
    id: "template-7",
    title: "Participation Certificate",
    description: "Certificate of participation in community activities",
    category: "confirmation",
    icon: "Trophy",
    requiresApproval: false
  },
  {
    id: "template-8",
    title: "General Request Letter",
    description: "General purpose letter for various needs",
    category: "general",
    icon: "FileText",
    requiresApproval: false
  }
];

export const mockLetterRequests: LetterRequest[] = [
  {
    id: "req-1",
    templateId: "template-2",
    requestedBy: "John Doe",
    requestDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    purpose: "Required for visa application",
    status: "approved",
    approvedBy: "Community Secretary",
    approvalDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    letterNumber: "CMT/LTR/2024/001"
  },
  {
    id: "req-2",
    templateId: "template-3",
    requestedBy: "Jane Smith",
    requestDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    purpose: "Required for employment application",
    status: "pending",
  },
  {
    id: "req-3",
    templateId: "template-1",
    requestedBy: "Michael Johnson",
    requestDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    purpose: "Graduate school application",
    status: "issued",
    approvedBy: "Community President",
    approvalDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    letterNumber: "CMT/LTR/2024/002"
  }
];

export const publications: Publication[] = [
  {
    id: "pub-1",
    title: "Community Voice - December 2024",
    description: "Monthly magazine featuring community news, member profiles, and upcoming events",
    type: "magazine",
    coverImage: "/placeholder.svg",
    publishDate: new Date("2024-12-01"),
    edition: "Vol. 5, Issue 12",
    pages: 48,
    fileSize: "12.5 MB",
    downloadUrl: "#",
    featured: true
  },
  {
    id: "pub-2",
    title: "Annual Development Report 2023",
    description: "Comprehensive report on community development projects and achievements",
    type: "report",
    coverImage: "/placeholder.svg",
    publishDate: new Date("2024-03-15"),
    edition: "2023 Edition",
    pages: 86,
    fileSize: "25.3 MB",
    downloadUrl: "#",
    featured: true
  },
  {
    id: "pub-3",
    title: "Community Newsletter - Q4 2024",
    description: "Quarterly newsletter with updates, announcements, and member stories",
    type: "newsletter",
    coverImage: "/placeholder.svg",
    publishDate: new Date("2024-11-01"),
    edition: "Q4 2024",
    pages: 16,
    fileSize: "4.2 MB",
    downloadUrl: "#",
    featured: false
  },
  {
    id: "pub-4",
    title: "Heritage & Culture Journal",
    description: "Academic journal exploring our community's history, traditions, and cultural practices",
    type: "journal",
    coverImage: "/placeholder.svg",
    publishDate: new Date("2024-08-20"),
    edition: "Vol. 3, Issue 2",
    pages: 124,
    fileSize: "18.7 MB",
    downloadUrl: "#",
    featured: true
  },
  {
    id: "pub-5",
    title: "Community Voice - November 2024",
    description: "Monthly magazine featuring community news, member profiles, and upcoming events",
    type: "magazine",
    coverImage: "/placeholder.svg",
    publishDate: new Date("2024-11-01"),
    edition: "Vol. 5, Issue 11",
    pages: 44,
    fileSize: "11.8 MB",
    downloadUrl: "#",
    featured: false
  },
  {
    id: "pub-6",
    title: "Financial Transparency Report 2024",
    description: "Detailed financial report showing income, expenditure, and asset management",
    type: "report",
    coverImage: "/placeholder.svg",
    publishDate: new Date("2024-10-10"),
    edition: "2024 Mid-Year",
    pages: 52,
    fileSize: "8.9 MB",
    downloadUrl: "#",
    featured: false
  }
];
