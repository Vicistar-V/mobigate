export interface MerchantApplication {
  id: string;
  applicantName: string;
  accountType: "individual" | "corporate";
  merchantType: "quiz" | "voucher";
  businessName?: string;
  regNumber?: string;
  businessAddress?: string;
  email: string;
  phone: string;
  status: "pending" | "approved" | "rejected";
  applicationDate: string;
  referenceNumber: string;
  rejectionReason?: string;
}

export const mockMerchantApplications: MerchantApplication[] = [
  {
    id: "ma-1",
    applicantName: "Adebayo Ogundimu",
    accountType: "individual",
    merchantType: "quiz",
    email: "adebayo.ogundimu@email.com",
    phone: "+234 803 456 7890",
    status: "pending",
    applicationDate: "2026-02-20",
    referenceNumber: "MQA-2026-00147",
  },
  {
    id: "ma-2",
    applicantName: "TechBridge Solutions Ltd",
    accountType: "corporate",
    merchantType: "quiz",
    businessName: "TechBridge Solutions Ltd",
    regNumber: "RC-2891045",
    businessAddress: "14 Marina Road, Lagos Island, Lagos",
    email: "info@techbridge.ng",
    phone: "+234 812 345 6789",
    status: "pending",
    applicationDate: "2026-02-19",
    referenceNumber: "MQA-2026-00146",
  },
  {
    id: "ma-3",
    applicantName: "Fatima Bello",
    accountType: "individual",
    merchantType: "quiz",
    email: "fatima.bello@email.com",
    phone: "+234 907 654 3210",
    status: "pending",
    applicationDate: "2026-02-18",
    referenceNumber: "MQA-2026-00145",
  },
  {
    id: "ma-4",
    applicantName: "GreenLeaf Enterprises",
    accountType: "corporate",
    merchantType: "quiz",
    businessName: "GreenLeaf Enterprises",
    regNumber: "RC-1567892",
    businessAddress: "22 Ahmadu Bello Way, Kaduna",
    email: "apply@greenleaf.com",
    phone: "+234 809 111 2233",
    status: "approved",
    applicationDate: "2026-02-10",
    referenceNumber: "MQA-2026-00130",
  },
  {
    id: "ma-5",
    applicantName: "Chinedu Eze",
    accountType: "individual",
    merchantType: "quiz",
    email: "chinedu.eze@email.com",
    phone: "+234 805 999 8877",
    status: "rejected",
    applicationDate: "2026-02-08",
    referenceNumber: "MQA-2026-00125",
    rejectionReason: "Incomplete documentation provided. Please reapply with valid identification.",
  },
];
