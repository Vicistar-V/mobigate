export interface Transaction {
  id: string;
  type: "credit" | "debit";
  description: string;
  amount: number;
  currency: string;
  date: Date;
  status: "completed" | "pending" | "failed";
  category: string;
}

export interface FinancialObligation {
  id: string;
  title: string;
  description: string;
  amount: number;
  currency: string;
  dueDate: Date;
  status: "paid" | "pending" | "overdue";
  category: "dues" | "levy" | "fine" | "subscription";
  recurrence?: "monthly" | "quarterly" | "annually" | "one-time";
}

export interface AuditReport {
  id: string;
  period: string;
  startDate: Date;
  endDate: Date;
  totalIncome: number;
  totalExpenditure: number;
  balance: number;
  currency: string;
  discrepancies: number;
  status: "completed" | "in-progress" | "pending";
  generatedDate: Date;
}

export interface WalletData {
  balance: number;
  currency: string;
  lastUpdated: Date;
  monthlyIncome: number;
  monthlyExpenditure: number;
}

export const mockWalletData: WalletData = {
  balance: 125000,
  currency: "NGN",
  lastUpdated: new Date(),
  monthlyIncome: 45000,
  monthlyExpenditure: 28000
};

export const mockTransactions: Transaction[] = [
  {
    id: "txn-1",
    type: "credit",
    description: "Monthly Dues Payment",
    amount: 5000,
    currency: "NGN",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    status: "completed",
    category: "Dues"
  },
  {
    id: "txn-2",
    type: "debit",
    description: "Community Event Registration",
    amount: 3000,
    currency: "NGN",
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    status: "completed",
    category: "Events"
  },
  {
    id: "txn-3",
    type: "credit",
    description: "Quarterly Levy",
    amount: 10000,
    currency: "NGN",
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    status: "completed",
    category: "Levy"
  },
  {
    id: "txn-4",
    type: "debit",
    description: "Community Magazine Subscription",
    amount: 2000,
    currency: "NGN",
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    status: "completed",
    category: "Subscription"
  },
  {
    id: "txn-5",
    type: "credit",
    description: "Special Assessment",
    amount: 15000,
    currency: "NGN",
    date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    status: "completed",
    category: "Assessment"
  }
];

export const mockObligations: FinancialObligation[] = [
  {
    id: "obl-1",
    title: "Monthly Dues - December 2024",
    description: "Regular monthly membership dues",
    amount: 5000,
    currency: "NGN",
    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    status: "pending",
    category: "dues",
    recurrence: "monthly"
  },
  {
    id: "obl-2",
    title: "Annual Development Levy",
    description: "Yearly levy for community development projects",
    amount: 20000,
    currency: "NGN",
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    status: "pending",
    category: "levy",
    recurrence: "annually"
  },
  {
    id: "obl-3",
    title: "Monthly Dues - November 2024",
    description: "Regular monthly membership dues",
    amount: 5000,
    currency: "NGN",
    dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    status: "paid",
    category: "dues",
    recurrence: "monthly"
  },
  {
    id: "obl-4",
    title: "Community Magazine Subscription",
    description: "Annual subscription to community magazine",
    amount: 8000,
    currency: "NGN",
    dueDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    status: "overdue",
    category: "subscription",
    recurrence: "annually"
  },
  {
    id: "obl-5",
    title: "Q4 2024 Special Levy",
    description: "Special levy for end-of-year activities",
    amount: 10000,
    currency: "NGN",
    dueDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    status: "pending",
    category: "levy",
    recurrence: "quarterly"
  }
];

export const mockAuditReports: AuditReport[] = [
  {
    id: "audit-1",
    period: "Q3 2024",
    startDate: new Date("2024-07-01"),
    endDate: new Date("2024-09-30"),
    totalIncome: 450000,
    totalExpenditure: 380000,
    balance: 70000,
    currency: "NGN",
    discrepancies: 0,
    status: "completed",
    generatedDate: new Date("2024-10-05")
  },
  {
    id: "audit-2",
    period: "Q2 2024",
    startDate: new Date("2024-04-01"),
    endDate: new Date("2024-06-30"),
    totalIncome: 520000,
    totalExpenditure: 445000,
    balance: 75000,
    currency: "NGN",
    discrepancies: 2,
    status: "completed",
    generatedDate: new Date("2024-07-10")
  },
  {
    id: "audit-3",
    period: "Q1 2024",
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-03-31"),
    totalIncome: 480000,
    totalExpenditure: 420000,
    balance: 60000,
    currency: "NGN",
    discrepancies: 1,
    status: "completed",
    generatedDate: new Date("2024-04-08")
  },
  {
    id: "audit-4",
    period: "Q4 2024",
    startDate: new Date("2024-10-01"),
    endDate: new Date("2024-12-31"),
    totalIncome: 0,
    totalExpenditure: 0,
    balance: 0,
    currency: "NGN",
    discrepancies: 0,
    status: "in-progress",
    generatedDate: new Date()
  }
];

export interface FinancialStatus {
  standing: "good" | "defaulting" | "suspended";
  outstandingBalance: number;
  currency: string;
  lastPaymentDate: Date;
  complianceRate: number;
  totalPaid: number;
  totalDue: number;
}

export const mockFinancialStatus: FinancialStatus = {
  standing: "good",
  outstandingBalance: 8000,
  currency: "NGN",
  lastPaymentDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  complianceRate: 92,
  totalPaid: 68000,
  totalDue: 76000
};
