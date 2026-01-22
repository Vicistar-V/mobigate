// Extended Previous Election Results Data with detailed office results

export interface PreviousElectionOfficeResult {
  id: string;
  officeName: string;
  shortCode: string;
  totalVotes: number;
  candidates: PreviousElectionCandidateResult[];
  winner: string;
}

export interface PreviousElectionCandidateResult {
  id: string;
  name: string;
  votes: number;
  percentage: number;
  isWinner: boolean;
}

export interface PreviousElectionDetail {
  id: string;
  name: string;
  date: Date;
  type: string;
  status: 'completed';
  totalAccreditedVoters: number;
  totalVotesCast: number;
  turnoutPercentage: number;
  offices: PreviousElectionOfficeResult[];
  chatMessages: PreviousElectionChatMessage[];
}

export interface PreviousElectionChatMessage {
  id: string;
  senderName: string;
  avatar: string;
  content: string;
  timestamp: Date;
}

// Detailed mock data for previous elections
export const previousElectionDetails: Record<string, PreviousElectionDetail> = {
  "prev-1": {
    id: "prev-1",
    name: "General Election 2024",
    date: new Date("2024-03-15"),
    type: "General Election",
    status: "completed",
    totalAccreditedVoters: 1200,
    totalVotesCast: 1156,
    turnoutPercentage: 96.3,
    offices: [
      {
        id: "office-pg-2024",
        officeName: "President General",
        shortCode: "PG",
        totalVotes: 1156,
        winner: "John Chukwuemeka Doe",
        candidates: [
          { id: "c1", name: "John Chukwuemeka Doe", votes: 542, percentage: 46.9, isWinner: true },
          { id: "c2", name: "Peter Obiora Nnamdi", votes: 398, percentage: 34.4, isWinner: false },
          { id: "c3", name: "Emmanuel Ike Okafor", votes: 216, percentage: 18.7, isWinner: false }
        ]
      },
      {
        id: "office-vp-2024",
        officeName: "Vice President",
        shortCode: "VP",
        totalVotes: 1142,
        winner: "Grace Adaeze Obi",
        candidates: [
          { id: "c4", name: "Grace Adaeze Obi", votes: 612, percentage: 53.6, isWinner: true },
          { id: "c5", name: "Mary Ngozi Eze", votes: 530, percentage: 46.4, isWinner: false }
        ]
      },
      {
        id: "office-sec-2024",
        officeName: "Secretary",
        shortCode: "SEC",
        totalVotes: 1138,
        winner: "Daniel Obiora Nweke",
        candidates: [
          { id: "c6", name: "Daniel Obiora Nweke", votes: 623, percentage: 54.7, isWinner: true },
          { id: "c7", name: "Francis Chidi Okwu", votes: 515, percentage: 45.3, isWinner: false }
        ]
      },
      {
        id: "office-trs-2024",
        officeName: "Treasurer",
        shortCode: "TRS",
        totalVotes: 1145,
        winner: "Benjamin Uchenna Okoro",
        candidates: [
          { id: "c8", name: "Benjamin Uchenna Okoro", votes: 489, percentage: 42.7, isWinner: true },
          { id: "c9", name: "Victoria Chiamaka Eze", votes: 412, percentage: 36.0, isWinner: false },
          { id: "c10", name: "Kenneth Obinna Nwachukwu", votes: 244, percentage: 21.3, isWinner: false }
        ]
      },
      {
        id: "office-fs-2024",
        officeName: "Financial Secretary",
        shortCode: "FS",
        totalVotes: 1130,
        winner: "Anthony Chijioke Oguike",
        candidates: [
          { id: "c11", name: "Anthony Chijioke Oguike", votes: 598, percentage: 52.9, isWinner: true },
          { id: "c12", name: "Rebecca Chidinma Anyanwu", votes: 532, percentage: 47.1, isWinner: false }
        ]
      }
    ],
    chatMessages: [
      { id: "cm1", senderName: "James Wilson", avatar: "/src/assets/profile-james-wilson.jpg", content: "Congratulations to all winners! Looking forward to great leadership.", timestamp: new Date("2024-03-15T19:30:00") },
      { id: "cm2", senderName: "Sarah Johnson", avatar: "/src/assets/profile-sarah-johnson.jpg", content: "It was a well-organized election. Kudos to the electoral committee!", timestamp: new Date("2024-03-15T19:45:00") },
      { id: "cm3", senderName: "Michael Chen", avatar: "/src/assets/profile-michael-chen.jpg", content: "Democracy at work! Every vote counted.", timestamp: new Date("2024-03-15T20:00:00") }
    ]
  },
  "prev-2": {
    id: "prev-2",
    name: "Emergency Secretary Election",
    date: new Date("2024-09-22"),
    type: "Emergency Election",
    status: "completed",
    totalAccreditedVoters: 1180,
    totalVotesCast: 892,
    turnoutPercentage: 75.6,
    offices: [
      {
        id: "office-sec-emergency",
        officeName: "Secretary",
        shortCode: "SEC",
        totalVotes: 892,
        winner: "Jane Adaeze Smith",
        candidates: [
          { id: "e1", name: "Jane Adaeze Smith", votes: 512, percentage: 57.4, isWinner: true },
          { id: "e2", name: "Patricia Ngozi Udeh", votes: 380, percentage: 42.6, isWinner: false }
        ]
      }
    ],
    chatMessages: [
      { id: "em1", senderName: "Emily Davis", avatar: "/src/assets/profile-emily-davis.jpg", content: "Jane will do a great job as Secretary!", timestamp: new Date("2024-09-22T18:00:00") },
      { id: "em2", senderName: "Robert Brown", avatar: "/src/assets/profile-robert-brown.jpg", content: "Quick and efficient election process.", timestamp: new Date("2024-09-22T18:15:00") }
    ]
  },
  "prev-3": {
    id: "prev-3",
    name: "By-Election Treasurer",
    date: new Date("2024-06-10"),
    type: "By-Election",
    status: "completed",
    totalAccreditedVoters: 1150,
    totalVotesCast: 745,
    turnoutPercentage: 64.8,
    offices: [
      {
        id: "office-trs-by",
        officeName: "Treasurer",
        shortCode: "TRS",
        totalVotes: 745,
        winner: "Robert Chinedu Brown",
        candidates: [
          { id: "b1", name: "Robert Chinedu Brown", votes: 398, percentage: 53.4, isWinner: true },
          { id: "b2", name: "Victoria Chiamaka Eze", votes: 245, percentage: 32.9, isWinner: false },
          { id: "b3", name: "Paul Emeka Johnson", votes: 102, percentage: 13.7, isWinner: false }
        ]
      }
    ],
    chatMessages: [
      { id: "bm1", senderName: "Jennifer Taylor", avatar: "/src/assets/profile-jennifer-taylor.jpg", content: "Robert has the experience we need for this role.", timestamp: new Date("2024-06-10T17:30:00") }
    ]
  },
  "prev-4": {
    id: "prev-4",
    name: "General Election 2023",
    date: new Date("2023-03-15"),
    type: "General Election",
    status: "completed",
    totalAccreditedVoters: 1100,
    totalVotesCast: 1034,
    turnoutPercentage: 94.0,
    offices: [
      {
        id: "office-pg-2023",
        officeName: "President General",
        shortCode: "PG",
        totalVotes: 1034,
        winner: "David Emeka Martinez",
        candidates: [
          { id: "d1", name: "David Emeka Martinez", votes: 534, percentage: 51.6, isWinner: true },
          { id: "d2", name: "Samuel Ifeanyi Okoro", votes: 320, percentage: 30.9, isWinner: false },
          { id: "d3", name: "Charles Obiora Nwosu", votes: 180, percentage: 17.5, isWinner: false }
        ]
      },
      {
        id: "office-vp-2023",
        officeName: "Vice President",
        shortCode: "VP",
        totalVotes: 1028,
        winner: "Angela Chidinma Okafor",
        candidates: [
          { id: "d4", name: "Angela Chidinma Okafor", votes: 598, percentage: 58.2, isWinner: true },
          { id: "d5", name: "Helen Ngozi Ibe", votes: 430, percentage: 41.8, isWinner: false }
        ]
      },
      {
        id: "office-sec-2023",
        officeName: "Secretary",
        shortCode: "SEC",
        totalVotes: 1020,
        winner: "Francis Chidi Okwu",
        candidates: [
          { id: "d6", name: "Francis Chidi Okwu", votes: 545, percentage: 53.4, isWinner: true },
          { id: "d7", name: "Monica Nneka Obi", votes: 475, percentage: 46.6, isWinner: false }
        ]
      },
      {
        id: "office-trs-2023",
        officeName: "Treasurer",
        shortCode: "TRS",
        totalVotes: 1015,
        winner: "Kenneth Obinna Nwachukwu",
        candidates: [
          { id: "d8", name: "Kenneth Obinna Nwachukwu", votes: 512, percentage: 50.4, isWinner: true },
          { id: "d9", name: "Benjamin Uchenna Okoro", votes: 503, percentage: 49.6, isWinner: false }
        ]
      }
    ],
    chatMessages: [
      { id: "dm1", senderName: "David Martinez", avatar: "/src/assets/profile-david-martinez.jpg", content: "Thank you all for your support and trust!", timestamp: new Date("2023-03-15T19:00:00") },
      { id: "dm2", senderName: "Lisa Anderson", avatar: "/src/assets/profile-lisa-anderson.jpg", content: "Congratulations to the new executive team!", timestamp: new Date("2023-03-15T19:30:00") }
    ]
  },
  "prev-5": {
    id: "prev-5",
    name: "Emergency VP Election",
    date: new Date("2023-07-20"),
    type: "Emergency Election",
    status: "completed",
    totalAccreditedVoters: 1120,
    totalVotesCast: 921,
    turnoutPercentage: 82.2,
    offices: [
      {
        id: "office-vp-emergency",
        officeName: "Vice President",
        shortCode: "VP",
        totalVotes: 921,
        winner: "Lisa Adaeze Anderson",
        candidates: [
          { id: "l1", name: "Lisa Adaeze Anderson", votes: 523, percentage: 56.8, isWinner: true },
          { id: "l2", name: "Patricia Ngozi Udeh", votes: 398, percentage: 43.2, isWinner: false }
        ]
      }
    ],
    chatMessages: [
      { id: "lm1", senderName: "Lisa Anderson", avatar: "/src/assets/profile-lisa-anderson.jpg", content: "I'm honored to serve as your Vice President!", timestamp: new Date("2023-07-20T18:30:00") }
    ]
  }
};

// Helper function to get previous election detail by ID
export const getPreviousElectionDetail = (electionId: string): PreviousElectionDetail | undefined => {
  return previousElectionDetails[electionId];
};
