// Financial Management Data Types and Mock Data

import communityPerson1 from "@/assets/community-person-1.jpg";
import communityPerson2 from "@/assets/community-person-2.jpg";
import communityPerson3 from "@/assets/community-person-3.jpg";
import communityPerson4 from "@/assets/community-person-4.jpg";
import communityPerson5 from "@/assets/community-person-5.jpg";
import communityPerson6 from "@/assets/community-person-6.jpg";

// ============ DUES & LEVIES ============

export type ObligationType = "annual_dues" | "development_levy" | "special_assessment" | "registration_fee" | "emergency_levy" | "project_levy";

export type ObligationStatus = "active" | "expired" | "upcoming" | "suspended";

export interface DuesAndLevies {
  id: string;
  name: string;
  type: ObligationType;
  amount: number;
  description: string;
  dueDate: Date;
  gracePeriodDays: number;
  lateFee: number;
  lateFeeType: "fixed" | "percentage";
  status: ObligationStatus;
  createdAt: Date;
  createdBy: string;
  totalCollected: number;
  totalExpected: number;
  paidCount: number;
  totalMembers: number;
  isRecurring: boolean;
  recurringPeriod?: "monthly" | "quarterly" | "annually";
}

export const mockDuesAndLevies: DuesAndLevies[] = [
  {
    id: "dl-1",
    name: "Annual Dues 2025",
    type: "annual_dues",
    amount: 15000,
    description: "Mandatory annual membership dues for all community members",
    dueDate: new Date("2025-03-31"),
    gracePeriodDays: 30,
    lateFee: 10,
    lateFeeType: "percentage",
    status: "active",
    createdAt: new Date("2025-01-01"),
    createdBy: "Chief Emeka Obi",
    totalCollected: 450000,
    totalExpected: 750000,
    paidCount: 30,
    totalMembers: 50,
    isRecurring: true,
    recurringPeriod: "annually",
  },
  {
    id: "dl-2",
    name: "Community Hall Development Levy",
    type: "development_levy",
    amount: 25000,
    description: "Special levy for the construction of the new community hall",
    dueDate: new Date("2025-06-30"),
    gracePeriodDays: 14,
    lateFee: 2500,
    lateFeeType: "fixed",
    status: "active",
    createdAt: new Date("2025-01-15"),
    createdBy: "Barr. Ngozi Okonkwo",
    totalCollected: 625000,
    totalExpected: 1250000,
    paidCount: 25,
    totalMembers: 50,
    isRecurring: false,
  },
  {
    id: "dl-3",
    name: "Emergency Health Fund",
    type: "emergency_levy",
    amount: 5000,
    description: "Emergency contribution for community health initiatives",
    dueDate: new Date("2025-02-28"),
    gracePeriodDays: 7,
    lateFee: 500,
    lateFeeType: "fixed",
    status: "active",
    createdAt: new Date("2025-01-20"),
    createdBy: "Dr. Amaka Eze",
    totalCollected: 200000,
    totalExpected: 250000,
    paidCount: 40,
    totalMembers: 50,
    isRecurring: false,
  },
  {
    id: "dl-4",
    name: "Annual Dues 2024",
    type: "annual_dues",
    amount: 12000,
    description: "Annual membership dues for 2024",
    dueDate: new Date("2024-03-31"),
    gracePeriodDays: 30,
    lateFee: 10,
    lateFeeType: "percentage",
    status: "expired",
    createdAt: new Date("2024-01-01"),
    createdBy: "Chief Emeka Obi",
    totalCollected: 576000,
    totalExpected: 600000,
    paidCount: 48,
    totalMembers: 50,
    isRecurring: true,
    recurringPeriod: "annually",
  },
];

// ============ ACCOUNT STATEMENTS ============

export type TransactionCategory = 
  | "dues_payment" 
  | "levy_payment" 
  | "donation" 
  | "fundraiser"
  | "event_revenue"
  | "operational_expense"
  | "project_expense"
  | "welfare_disbursement"
  | "administrative_expense"
  | "minutes_download"
  | "transfer_in"
  | "transfer_out";

export interface AccountTransaction {
  id: string;
  date: Date;
  type: "credit" | "debit";
  category: TransactionCategory;
  description: string;
  reference: string;
  amount: number;
  balance: number;
  memberName?: string;
  memberAvatar?: string;
  status: "completed" | "pending" | "failed" | "reversed";
  authorizedBy?: string;
  notes?: string;
}

export const mockAccountTransactions: AccountTransaction[] = [
  {
    id: "at-1",
    date: new Date(Date.now() - 1 * 60 * 60 * 1000),
    type: "credit",
    category: "dues_payment",
    description: "Annual Dues 2025 Payment",
    reference: "DUE-2025-001234",
    amount: 15000,
    balance: 1250000,
    memberName: "Chukwuemeka Okonkwo",
    memberAvatar: communityPerson4,
    status: "completed",
  },
  {
    id: "at-2",
    date: new Date(Date.now() - 3 * 60 * 60 * 1000),
    type: "debit",
    category: "operational_expense",
    description: "Office Supplies Purchase",
    reference: "EXP-2025-000456",
    amount: 25000,
    balance: 1235000,
    status: "completed",
    authorizedBy: "Chief Emeka Obi",
    notes: "Approved by Finance Committee",
  },
  {
    id: "at-3",
    date: new Date(Date.now() - 5 * 60 * 60 * 1000),
    type: "credit",
    category: "levy_payment",
    description: "Development Levy Payment",
    reference: "LEV-2025-000789",
    amount: 25000,
    balance: 1260000,
    memberName: "Adaeze Nnamdi",
    memberAvatar: communityPerson5,
    status: "completed",
  },
  {
    id: "at-4",
    date: new Date(Date.now() - 8 * 60 * 60 * 1000),
    type: "credit",
    category: "donation",
    description: "Community Donation",
    reference: "DON-2025-000321",
    amount: 50000,
    balance: 1235000,
    memberName: "Ifeanyi Ezekwesili",
    memberAvatar: communityPerson6,
    status: "completed",
  },
  {
    id: "at-5",
    date: new Date(Date.now() - 12 * 60 * 60 * 1000),
    type: "debit",
    category: "welfare_disbursement",
    description: "Medical Support - Member Welfare",
    reference: "WEL-2025-000654",
    amount: 100000,
    balance: 1185000,
    status: "completed",
    authorizedBy: "Barr. Ngozi Okonkwo",
    notes: "Emergency medical assistance approved",
  },
  {
    id: "at-6",
    date: new Date(Date.now() - 24 * 60 * 60 * 1000),
    type: "credit",
    category: "fundraiser",
    description: "School Building Fundraiser Contribution",
    reference: "FUN-2025-000987",
    amount: 75000,
    balance: 1285000,
    memberName: "Chief Obiora Chukwuma",
    memberAvatar: communityPerson1,
    status: "completed",
  },
  {
    id: "at-7",
    date: new Date(Date.now() - 36 * 60 * 60 * 1000),
    type: "debit",
    category: "project_expense",
    description: "Community Hall Foundation Work",
    reference: "PRJ-2025-000111",
    amount: 500000,
    balance: 1210000,
    status: "completed",
    authorizedBy: "Chief Emeka Obi",
    notes: "Phase 1 construction payment",
  },
  {
    id: "at-8",
    date: new Date(Date.now() - 48 * 60 * 60 * 1000),
    type: "credit",
    category: "minutes_download",
    description: "Meeting Minutes Download Fees",
    reference: "MIN-2025-000222",
    amount: 2500,
    balance: 1710000,
    status: "completed",
    notes: "50 downloads at M50 each",
  },
  {
    id: "at-9",
    date: new Date(Date.now() - 72 * 60 * 60 * 1000),
    type: "debit",
    category: "administrative_expense",
    description: "Annual Report Printing",
    reference: "ADM-2025-000333",
    amount: 45000,
    balance: 1707500,
    status: "pending",
    authorizedBy: "Dr. Amaka Eze",
  },
  {
    id: "at-10",
    date: new Date(Date.now() - 96 * 60 * 60 * 1000),
    type: "credit",
    category: "event_revenue",
    description: "Cultural Festival Ticket Sales",
    reference: "EVT-2025-000444",
    amount: 150000,
    balance: 1752500,
    status: "completed",
  },
];

// ============ MEMBERS FINANCIAL REPORTS ============

export interface MemberPayment {
  id: string;
  memberId: string;
  memberName: string;
  memberAvatar: string;
  obligationType: ObligationType;
  obligationName: string;
  amountPaid: number;
  paymentDate: Date;
  paymentMethod: "wallet" | "bank_transfer" | "card" | "cash";
  reference: string;
  status: "completed" | "pending" | "failed";
}

export interface MemberDisbursement {
  id: string;
  memberId: string;
  memberName: string;
  memberAvatar: string;
  disbursementType: "welfare" | "loan" | "refund" | "award" | "scholarship";
  description: string;
  amount: number;
  disbursementDate: Date;
  approvedBy: string;
  status: "completed" | "pending" | "approved" | "rejected";
}

export interface MemberObligation {
  id: string;
  memberId: string;
  memberName: string;
  memberAvatar: string;
  obligationType: ObligationType;
  obligationName: string;
  amountDue: number;
  amountPaid: number;
  dueDate: Date;
  status: "compliant" | "partial" | "defaulting" | "suspended";
  lastPaymentDate?: Date;
}

export const mockMemberPayments: MemberPayment[] = [
  {
    id: "mp-1",
    memberId: "m1",
    memberName: "Chukwuemeka Okonkwo",
    memberAvatar: communityPerson4,
    obligationType: "annual_dues",
    obligationName: "Annual Dues 2025",
    amountPaid: 15000,
    paymentDate: new Date(Date.now() - 1 * 60 * 60 * 1000),
    paymentMethod: "wallet",
    reference: "PAY-2025-001234",
    status: "completed",
  },
  {
    id: "mp-2",
    memberId: "m2",
    memberName: "Adaeze Nnamdi",
    memberAvatar: communityPerson5,
    obligationType: "development_levy",
    obligationName: "Community Hall Development Levy",
    amountPaid: 25000,
    paymentDate: new Date(Date.now() - 5 * 60 * 60 * 1000),
    paymentMethod: "bank_transfer",
    reference: "PAY-2025-001235",
    status: "completed",
  },
  {
    id: "mp-3",
    memberId: "m3",
    memberName: "Ifeanyi Ezekwesili",
    memberAvatar: communityPerson6,
    obligationType: "emergency_levy",
    obligationName: "Emergency Health Fund",
    amountPaid: 5000,
    paymentDate: new Date(Date.now() - 12 * 60 * 60 * 1000),
    paymentMethod: "card",
    reference: "PAY-2025-001236",
    status: "completed",
  },
  {
    id: "mp-4",
    memberId: "m4",
    memberName: "Chief Obiora Chukwuma",
    memberAvatar: communityPerson1,
    obligationType: "annual_dues",
    obligationName: "Annual Dues 2025",
    amountPaid: 15000,
    paymentDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
    paymentMethod: "wallet",
    reference: "PAY-2025-001237",
    status: "completed",
  },
  {
    id: "mp-5",
    memberId: "m5",
    memberName: "Dr. Amaka Eze",
    memberAvatar: communityPerson3,
    obligationType: "development_levy",
    obligationName: "Community Hall Development Levy",
    amountPaid: 12500,
    paymentDate: new Date(Date.now() - 36 * 60 * 60 * 1000),
    paymentMethod: "wallet",
    reference: "PAY-2025-001238",
    status: "pending",
  },
];

export const mockMemberDisbursements: MemberDisbursement[] = [
  {
    id: "md-1",
    memberId: "m1",
    memberName: "Obiora Chukwuma",
    memberAvatar: communityPerson4,
    disbursementType: "welfare",
    description: "Medical Emergency Support",
    amount: 100000,
    disbursementDate: new Date(Date.now() - 12 * 60 * 60 * 1000),
    approvedBy: "Chief Emeka Obi",
    status: "completed",
  },
  {
    id: "md-2",
    memberId: "m2",
    memberName: "Chiamaka Eze",
    memberAvatar: communityPerson5,
    disbursementType: "scholarship",
    description: "Education Support - University Fees",
    amount: 250000,
    disbursementDate: new Date(Date.now() - 48 * 60 * 60 * 1000),
    approvedBy: "Barr. Ngozi Okonkwo",
    status: "completed",
  },
  {
    id: "md-3",
    memberId: "m3",
    memberName: "Nnamdi Okafor",
    memberAvatar: communityPerson6,
    disbursementType: "loan",
    description: "Business Development Loan",
    amount: 500000,
    disbursementDate: new Date(Date.now() - 72 * 60 * 60 * 1000),
    approvedBy: "Dr. Amaka Eze",
    status: "approved",
  },
  {
    id: "md-4",
    memberId: "m4",
    memberName: "Adaeze Nnamdi",
    memberAvatar: communityPerson1,
    disbursementType: "refund",
    description: "Event Ticket Refund",
    amount: 5000,
    disbursementDate: new Date(Date.now() - 96 * 60 * 60 * 1000),
    approvedBy: "Chief Emeka Obi",
    status: "pending",
  },
];

export const mockMemberObligations: MemberObligation[] = [
  {
    id: "mo-1",
    memberId: "m1",
    memberName: "Chukwuemeka Okonkwo",
    memberAvatar: communityPerson4,
    obligationType: "annual_dues",
    obligationName: "Annual Dues 2025",
    amountDue: 15000,
    amountPaid: 15000,
    dueDate: new Date("2025-03-31"),
    status: "compliant",
    lastPaymentDate: new Date(Date.now() - 1 * 60 * 60 * 1000),
  },
  {
    id: "mo-2",
    memberId: "m2",
    memberName: "Obiora Chukwuma",
    memberAvatar: communityPerson1,
    obligationType: "annual_dues",
    obligationName: "Annual Dues 2025",
    amountDue: 15000,
    amountPaid: 0,
    dueDate: new Date("2025-03-31"),
    status: "defaulting",
  },
  {
    id: "mo-3",
    memberId: "m3",
    memberName: "Chiamaka Eze",
    memberAvatar: communityPerson5,
    obligationType: "development_levy",
    obligationName: "Community Hall Development Levy",
    amountDue: 25000,
    amountPaid: 12500,
    dueDate: new Date("2025-06-30"),
    status: "partial",
    lastPaymentDate: new Date(Date.now() - 36 * 60 * 60 * 1000),
  },
  {
    id: "mo-4",
    memberId: "m4",
    memberName: "Nnamdi Okafor",
    memberAvatar: communityPerson6,
    obligationType: "annual_dues",
    obligationName: "Annual Dues 2024",
    amountDue: 12000,
    amountPaid: 0,
    dueDate: new Date("2024-03-31"),
    status: "suspended",
  },
  {
    id: "mo-5",
    memberId: "m5",
    memberName: "Adaeze Nnamdi",
    memberAvatar: communityPerson3,
    obligationType: "emergency_levy",
    obligationName: "Emergency Health Fund",
    amountDue: 5000,
    amountPaid: 5000,
    dueDate: new Date("2025-02-28"),
    status: "compliant",
    lastPaymentDate: new Date(Date.now() - 12 * 60 * 60 * 1000),
  },
];

// ============ FINANCIAL AUDIT ============

export interface YearlyFinancialAudit {
  year: number;
  openingBalance: number;
  totalFundsReceived: number;
  totalFundsSpent: number;
  closingBalance: number;
  totalDeficits: number;
  floatingFunds: number;
  breakdown: {
    income: {
      duesCollected: number;
      leviesCollected: number;
      donations: number;
      fundraisers: number;
      eventRevenue: number;
      otherIncome: number;
    };
    expenses: {
      operationalExpenses: number;
      projectExpenses: number;
      welfarePayouts: number;
      administrativeExpenses: number;
      otherExpenses: number;
    };
    deficits: {
      unpaidDues: number;
      unpaidLevies: number;
      pendingObligations: number;
    };
    floating: {
      pendingLoans: number;
      advancesGiven: number;
      recoverableExpenses: number;
    };
  };
}

export const mockYearlyAudits: YearlyFinancialAudit[] = [
  {
    year: 2025,
    openingBalance: 1500000,
    totalFundsReceived: 2850000,
    totalFundsSpent: 2100000,
    closingBalance: 2250000,
    totalDeficits: 325000,
    floatingFunds: 750000,
    breakdown: {
      income: {
        duesCollected: 750000,
        leviesCollected: 1250000,
        donations: 350000,
        fundraisers: 300000,
        eventRevenue: 150000,
        otherIncome: 50000,
      },
      expenses: {
        operationalExpenses: 450000,
        projectExpenses: 1200000,
        welfarePayouts: 250000,
        administrativeExpenses: 150000,
        otherExpenses: 50000,
      },
      deficits: {
        unpaidDues: 150000,
        unpaidLevies: 125000,
        pendingObligations: 50000,
      },
      floating: {
        pendingLoans: 500000,
        advancesGiven: 150000,
        recoverableExpenses: 100000,
      },
    },
  },
  {
    year: 2024,
    openingBalance: 850000,
    totalFundsReceived: 3200000,
    totalFundsSpent: 2550000,
    closingBalance: 1500000,
    totalDeficits: 180000,
    floatingFunds: 420000,
    breakdown: {
      income: {
        duesCollected: 1200000,
        leviesCollected: 800000,
        donations: 500000,
        fundraisers: 450000,
        eventRevenue: 200000,
        otherIncome: 50000,
      },
      expenses: {
        operationalExpenses: 550000,
        projectExpenses: 1500000,
        welfarePayouts: 300000,
        administrativeExpenses: 150000,
        otherExpenses: 50000,
      },
      deficits: {
        unpaidDues: 100000,
        unpaidLevies: 50000,
        pendingObligations: 30000,
      },
      floating: {
        pendingLoans: 300000,
        advancesGiven: 80000,
        recoverableExpenses: 40000,
      },
    },
  },
  {
    year: 2023,
    openingBalance: 450000,
    totalFundsReceived: 2100000,
    totalFundsSpent: 1700000,
    closingBalance: 850000,
    totalDeficits: 95000,
    floatingFunds: 180000,
    breakdown: {
      income: {
        duesCollected: 900000,
        leviesCollected: 500000,
        donations: 300000,
        fundraisers: 250000,
        eventRevenue: 100000,
        otherIncome: 50000,
      },
      expenses: {
        operationalExpenses: 400000,
        projectExpenses: 900000,
        welfarePayouts: 250000,
        administrativeExpenses: 100000,
        otherExpenses: 50000,
      },
      deficits: {
        unpaidDues: 60000,
        unpaidLevies: 25000,
        pendingObligations: 10000,
      },
      floating: {
        pendingLoans: 120000,
        advancesGiven: 40000,
        recoverableExpenses: 20000,
      },
    },
  },
];

// Helper functions
export const getObligationTypeLabel = (type: ObligationType): string => {
  const labels: Record<ObligationType, string> = {
    annual_dues: "Annual Dues",
    development_levy: "Development Levy",
    special_assessment: "Special Assessment",
    registration_fee: "Registration Fee",
    emergency_levy: "Emergency Levy",
    project_levy: "Project Levy",
  };
  return labels[type];
};

export const getObligationStatusColor = (status: ObligationStatus): string => {
  const colors: Record<ObligationStatus, string> = {
    active: "bg-green-500/10 text-green-600",
    expired: "bg-gray-500/10 text-gray-600",
    upcoming: "bg-blue-500/10 text-blue-600",
    suspended: "bg-red-500/10 text-red-600",
  };
  return colors[status];
};

export const getMemberObligationStatusColor = (status: MemberObligation["status"]): string => {
  const colors: Record<MemberObligation["status"], string> = {
    compliant: "bg-green-500/10 text-green-600",
    partial: "bg-amber-500/10 text-amber-600",
    defaulting: "bg-red-500/10 text-red-600",
    suspended: "bg-gray-500/10 text-gray-600",
  };
  return colors[status];
};
