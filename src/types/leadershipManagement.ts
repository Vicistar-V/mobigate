export type ChangeReason = 
  | "election" 
  | "resignation" 
  | "appointment" 
  | "interim" 
  | "death" 
  | "impeachment" 
  | "term_expiry"
  | "manual";

export type CommitteeType = "executive" | "adhoc" | "staff";

export type ChangeType = "add" | "remove" | "update" | "transfer";

export interface LeadershipChange {
  id: string;
  changeType: ChangeType;
  memberName: string;
  memberId: string;
  previousPosition?: string;
  newPosition?: string;
  committee: CommitteeType;
  reason: ChangeReason;
  effectiveDate: Date;
  changedBy: string;
  changedAt: Date;
  notes?: string;
  electionId?: string;
}

export interface ElectionWinner {
  id: string;
  position: string;
  winnerName: string;
  winnerId: string;
  winnerImage?: string;
  currentHolderName?: string;
  currentHolderId?: string;
  voteCount: number;
  votePercentage: number;
  electionDate: Date;
  applied: boolean;
}

export const changeReasonLabels: Record<ChangeReason, string> = {
  election: "Election Result",
  resignation: "Resignation",
  appointment: "Manual Appointment",
  interim: "Interim/Acting",
  death: "Death",
  impeachment: "Impeachment",
  term_expiry: "Term Expiry",
  manual: "Manual Override",
};

export const committeeLabels: Record<CommitteeType, string> = {
  executive: "Executive Committee",
  adhoc: "Ad-hoc Committee",
  staff: "Staff & Employees",
};

export const changeTypeLabels: Record<ChangeType, string> = {
  add: "Added",
  remove: "Removed",
  update: "Updated",
  transfer: "Transferred",
};
