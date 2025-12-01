export interface RollCall {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  status: "active" | "completed" | "scheduled";
  totalMembers: number;
  attendedMembers: number;
  absentMembers: number;
  attendancePercentage: number;
  category: "meeting" | "event" | "general" | "emergency";
}

export interface AttendanceRecord {
  id: string;
  rollCallId: string;
  memberName: string;
  memberAvatar: string;
  memberId: string;
  markedAt: Date;
  status: "present" | "absent" | "excused";
  reason?: string;
}

export interface MemberAttendanceStats {
  memberId: string;
  memberName: string;
  memberAvatar: string;
  totalRollCalls: number;
  attended: number;
  absent: number;
  excused: number;
  attendanceRate: number;
}

export const activeRollCall: RollCall = {
  id: "rollcall-active",
  title: "December 2024 General Meeting Roll Call",
  description: "Monthly general meeting attendance - All members expected",
  startTime: new Date(Date.now() - 30 * 60 * 1000), // Started 30 minutes ago
  endTime: new Date(Date.now() + 90 * 60 * 1000), // Ends in 90 minutes
  status: "active",
  totalMembers: 250,
  attendedMembers: 187,
  absentMembers: 63,
  attendancePercentage: 74.8,
  category: "meeting"
};

export const rollCallHistory: RollCall[] = [
  {
    id: "rollcall-1",
    title: "November 2024 General Meeting",
    description: "Monthly general meeting attendance",
    startTime: new Date("2024-11-15T14:00:00"),
    endTime: new Date("2024-11-15T17:00:00"),
    status: "completed",
    totalMembers: 248,
    attendedMembers: 203,
    absentMembers: 45,
    attendancePercentage: 81.9,
    category: "meeting"
  },
  {
    id: "rollcall-2",
    title: "Annual Thanksgiving Event 2024",
    description: "Community thanksgiving service and reception",
    startTime: new Date("2024-11-28T09:00:00"),
    endTime: new Date("2024-11-28T15:00:00"),
    status: "completed",
    totalMembers: 250,
    attendedMembers: 234,
    absentMembers: 16,
    attendancePercentage: 93.6,
    category: "event"
  },
  {
    id: "rollcall-3",
    title: "October 2024 General Meeting",
    description: "Monthly general meeting attendance",
    startTime: new Date("2024-10-20T14:00:00"),
    endTime: new Date("2024-10-20T17:00:00"),
    status: "completed",
    totalMembers: 245,
    attendedMembers: 189,
    absentMembers: 56,
    attendancePercentage: 77.1,
    category: "meeting"
  },
  {
    id: "rollcall-4",
    title: "Community Clean-Up Exercise",
    description: "Quarterly environmental sanitation exercise",
    startTime: new Date("2024-10-05T07:00:00"),
    endTime: new Date("2024-10-05T11:00:00"),
    status: "completed",
    totalMembers: 250,
    attendedMembers: 156,
    absentMembers: 94,
    attendancePercentage: 62.4,
    category: "event"
  },
  {
    id: "rollcall-5",
    title: "September 2024 General Meeting",
    description: "Monthly general meeting attendance",
    startTime: new Date("2024-09-15T14:00:00"),
    endTime: new Date("2024-09-15T17:00:00"),
    status: "completed",
    totalMembers: 243,
    attendedMembers: 198,
    absentMembers: 45,
    attendancePercentage: 81.5,
    category: "meeting"
  }
];

export const upcomingRollCalls: RollCall[] = [
  {
    id: "rollcall-upcoming-1",
    title: "End of Year Party 2024",
    description: "Annual end of year celebration and awards night",
    startTime: new Date("2024-12-28T18:00:00"),
    endTime: new Date("2024-12-28T23:59:00"),
    status: "scheduled",
    totalMembers: 250,
    attendedMembers: 0,
    absentMembers: 0,
    attendancePercentage: 0,
    category: "event"
  },
  {
    id: "rollcall-upcoming-2",
    title: "January 2025 General Meeting",
    description: "First general meeting of the new year",
    startTime: new Date("2025-01-18T14:00:00"),
    endTime: new Date("2025-01-18T17:00:00"),
    status: "scheduled",
    totalMembers: 250,
    attendedMembers: 0,
    absentMembers: 0,
    attendancePercentage: 0,
    category: "meeting"
  }
];

export const recentAttendance: AttendanceRecord[] = [
  {
    id: "att-1",
    rollCallId: "rollcall-active",
    memberName: "Chukwudi Okafor",
    memberAvatar: "/placeholder.svg",
    memberId: "MEM-001",
    markedAt: new Date(Date.now() - 25 * 60 * 1000),
    status: "present"
  },
  {
    id: "att-2",
    rollCallId: "rollcall-active",
    memberName: "Amina Hassan",
    memberAvatar: "/placeholder.svg",
    memberId: "MEM-002",
    markedAt: new Date(Date.now() - 20 * 60 * 1000),
    status: "present"
  },
  {
    id: "att-3",
    rollCallId: "rollcall-active",
    memberName: "Emeka Nwosu",
    memberAvatar: "/placeholder.svg",
    memberId: "MEM-003",
    markedAt: new Date(Date.now() - 18 * 60 * 1000),
    status: "present"
  },
  {
    id: "att-4",
    rollCallId: "rollcall-active",
    memberName: "Fatima Bello",
    memberAvatar: "/placeholder.svg",
    memberId: "MEM-004",
    markedAt: new Date(Date.now() - 15 * 60 * 1000),
    status: "present"
  },
  {
    id: "att-5",
    rollCallId: "rollcall-active",
    memberName: "Tunde Adeyemi",
    memberAvatar: "/placeholder.svg",
    memberId: "MEM-005",
    markedAt: new Date(Date.now() - 10 * 60 * 1000),
    status: "excused",
    reason: "Work commitment"
  }
];

export const memberStats: MemberAttendanceStats[] = [
  {
    memberId: "MEM-001",
    memberName: "Chukwudi Okafor",
    memberAvatar: "/placeholder.svg",
    totalRollCalls: 12,
    attended: 11,
    absent: 1,
    excused: 0,
    attendanceRate: 91.7
  },
  {
    memberId: "MEM-002",
    memberName: "Amina Hassan",
    memberAvatar: "/placeholder.svg",
    totalRollCalls: 12,
    attended: 12,
    absent: 0,
    excused: 0,
    attendanceRate: 100
  },
  {
    memberId: "MEM-003",
    memberName: "Emeka Nwosu",
    memberAvatar: "/placeholder.svg",
    totalRollCalls: 12,
    attended: 10,
    absent: 2,
    excused: 0,
    attendanceRate: 83.3
  },
  {
    memberId: "MEM-004",
    memberName: "Fatima Bello",
    memberAvatar: "/placeholder.svg",
    totalRollCalls: 12,
    attended: 9,
    absent: 1,
    excused: 2,
    attendanceRate: 91.7
  }
];

export const absenceReasons = [
  "Work commitment",
  "Health issues",
  "Travel/Out of town",
  "Family emergency",
  "Prior engagement",
  "Other"
];
