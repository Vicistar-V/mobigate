export interface QuizGameRecord {
  id: string;
  gameId: string;
  playerName: string;
  state: string;
  country: string;
  gameMode: string;
  result: "Won" | "Lost";
  stakePaid: number;
  prizeWon: number;
  category: string;
  difficulty: string;
  datePlayed: string;
  score: string;
}

export const quizGamesPlayedData: QuizGameRecord[] = [
  // Group Quiz
  { id: "1", gameId: "QG-2025-00142", playerName: "Adebayo Johnson", state: "Lagos", country: "Nigeria", gameMode: "Group Quiz", result: "Won", stakePaid: 5000, prizeWon: 12000, category: "Sports", difficulty: "Medium", datePlayed: "2025-01-15T14:30:00", score: "8/10" },
  { id: "2", gameId: "QG-2025-00143", playerName: "Chinonso Eze", state: "Enugu", country: "Nigeria", gameMode: "Group Quiz", result: "Lost", stakePaid: 10000, prizeWon: 0, category: "General Knowledge", difficulty: "Hard", datePlayed: "2025-01-14T10:15:00", score: "4/10" },
  { id: "3", gameId: "QG-2025-00144", playerName: "Fatima Bello", state: "Kano", country: "Nigeria", gameMode: "Group Quiz", result: "Won", stakePaid: 7500, prizeWon: 18000, category: "Current Affairs", difficulty: "Easy", datePlayed: "2025-02-03T09:45:00", score: "9/10" },
  { id: "4", gameId: "QG-2024-00098", playerName: "Oluwaseun Adeyemi", state: "Oyo", country: "Nigeria", gameMode: "Group Quiz", result: "Won", stakePaid: 15000, prizeWon: 35000, category: "Entertainment", difficulty: "Medium", datePlayed: "2024-11-20T16:00:00", score: "7/10" },
  { id: "5", gameId: "QG-2024-00099", playerName: "Amara Obi", state: "Anambra", country: "Nigeria", gameMode: "Group Quiz", result: "Lost", stakePaid: 5000, prizeWon: 0, category: "Science", difficulty: "Expert", datePlayed: "2024-12-05T13:20:00", score: "3/10" },

  // Standard Solo
  { id: "6", gameId: "SS-2025-00201", playerName: "Chukwuma Adesanya", state: "Lagos", country: "Nigeria", gameMode: "Standard Solo", result: "Won", stakePaid: 3000, prizeWon: 6000, category: "Sports", difficulty: "Medium", datePlayed: "2025-01-18T11:00:00", score: "10/10" },
  { id: "7", gameId: "SS-2025-00202", playerName: "Ngozi Okoro", state: "Rivers", country: "Nigeria", gameMode: "Standard Solo", result: "Lost", stakePaid: 5000, prizeWon: 0, category: "History", difficulty: "Hard", datePlayed: "2025-01-16T15:30:00", score: "5/10" },
  { id: "8", gameId: "SS-2025-00203", playerName: "Ibrahim Musa", state: "Kaduna", country: "Nigeria", gameMode: "Standard Solo", result: "Won", stakePaid: 8000, prizeWon: 16000, category: "General Knowledge", difficulty: "Easy", datePlayed: "2025-02-01T08:45:00", score: "9/10" },
  { id: "9", gameId: "SS-2024-00150", playerName: "Temitope Adewale", state: "Osun", country: "Nigeria", gameMode: "Standard Solo", result: "Lost", stakePaid: 3000, prizeWon: 0, category: "Science", difficulty: "Medium", datePlayed: "2024-10-22T14:10:00", score: "6/10" },
  { id: "10", gameId: "SS-2024-00151", playerName: "Grace Uchenna", state: "Imo", country: "Nigeria", gameMode: "Standard Solo", result: "Won", stakePaid: 10000, prizeWon: 20000, category: "Current Affairs", difficulty: "Hard", datePlayed: "2024-11-10T17:00:00", score: "8/10" },

  // Interactive
  { id: "11", gameId: "IQ-2025-00050", playerName: "Ngozi Emenike", state: "Delta", country: "Nigeria", gameMode: "Interactive", result: "Won", stakePaid: 12000, prizeWon: 30000, category: "General Knowledge", difficulty: "Medium", datePlayed: "2025-01-20T19:00:00", score: "13/15" },
  { id: "12", gameId: "IQ-2025-00051", playerName: "Uche Nnamdi", state: "Abia", country: "Nigeria", gameMode: "Interactive", result: "Lost", stakePaid: 8000, prizeWon: 0, category: "Entertainment", difficulty: "Hard", datePlayed: "2025-01-12T20:30:00", score: "7/15" },
  { id: "13", gameId: "IQ-2024-00040", playerName: "Yusuf Abdullahi", state: "Borno", country: "Nigeria", gameMode: "Interactive", result: "Won", stakePaid: 15000, prizeWon: 40000, category: "Science", difficulty: "Expert", datePlayed: "2024-12-18T18:15:00", score: "14/15" },
  { id: "14", gameId: "IQ-2024-00041", playerName: "Kemi Fashola", state: "Lagos", country: "Nigeria", gameMode: "Interactive", result: "Lost", stakePaid: 10000, prizeWon: 0, category: "Current Affairs", difficulty: "Medium", datePlayed: "2024-09-25T21:00:00", score: "6/15" },

  // Food for Home
  { id: "15", gameId: "FH-2025-00075", playerName: "Emeka Okonkwo", state: "Anambra", country: "Nigeria", gameMode: "Food for Home", result: "Won", stakePaid: 4500, prizeWon: 22500, category: "General Knowledge", difficulty: "Easy", datePlayed: "2025-01-22T12:00:00", score: "15/15" },
  { id: "16", gameId: "FH-2025-00076", playerName: "Halima Suleiman", state: "Sokoto", country: "Nigeria", gameMode: "Food for Home", result: "Lost", stakePaid: 6000, prizeWon: 0, category: "History", difficulty: "Medium", datePlayed: "2025-01-08T10:30:00", score: "9/15" },
  { id: "17", gameId: "FH-2024-00060", playerName: "Chidinma Agu", state: "Ebonyi", country: "Nigeria", gameMode: "Food for Home", result: "Won", stakePaid: 3500, prizeWon: 17500, category: "Sports", difficulty: "Easy", datePlayed: "2024-11-30T13:45:00", score: "14/15" },
  { id: "18", gameId: "FH-2024-00061", playerName: "Tunde Kolawole", state: "Kwara", country: "Nigeria", gameMode: "Food for Home", result: "Lost", stakePaid: 5000, prizeWon: 0, category: "Science", difficulty: "Hard", datePlayed: "2024-10-15T09:00:00", score: "8/15" },

  // Scholarship
  { id: "19", gameId: "SC-2025-00030", playerName: "Blessing Uzoma", state: "Edo", country: "Nigeria", gameMode: "Scholarship", result: "Won", stakePaid: 50000, prizeWon: 500000, category: "Science", difficulty: "Expert", datePlayed: "2025-01-25T08:00:00", score: "12/15" },
  { id: "20", gameId: "SC-2025-00031", playerName: "Amaka Chukwu", state: "Enugu", country: "Nigeria", gameMode: "Scholarship", result: "Lost", stakePaid: 30000, prizeWon: 0, category: "General Knowledge", difficulty: "Hard", datePlayed: "2025-02-05T11:30:00", score: "9/15" },
  { id: "21", gameId: "SC-2024-00025", playerName: "Adekunle Balogun", state: "Ogun", country: "Nigeria", gameMode: "Scholarship", result: "Won", stakePaid: 75000, prizeWon: 750000, category: "Current Affairs", difficulty: "Expert", datePlayed: "2024-12-10T14:00:00", score: "13/15" },
  { id: "22", gameId: "SC-2024-00026", playerName: "Folake Akinwumi", state: "Ekiti", country: "Nigeria", gameMode: "Scholarship", result: "Lost", stakePaid: 40000, prizeWon: 0, category: "History", difficulty: "Hard", datePlayed: "2024-08-20T16:30:00", score: "7/15" },
  { id: "23", gameId: "SC-2024-00027", playerName: "Obinna Nwachukwu", state: "Imo", country: "Nigeria", gameMode: "Scholarship", result: "Won", stakePaid: 60000, prizeWon: 600000, category: "Entertainment", difficulty: "Medium", datePlayed: "2024-09-15T10:00:00", score: "11/15" },
];
