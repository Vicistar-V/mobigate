// Toggle Quiz - High-Stakes Escalating Sessions
// 7 sessions, each requiring 100% correct to win. Toggle = risk all for higher multiplier.

export interface ToggleSession {
  session: number;
  objectives: number;
  nonObjectives: number;
  total: number;
  multiplier: number;
  label: string;
}

export const TOGGLE_SESSIONS: ToggleSession[] = [
  { session: 1, objectives: 7,  nonObjectives: 3,  total: 10, multiplier: 5,  label: "500%" },
  { session: 2, objectives: 10, nonObjectives: 4,  total: 14, multiplier: 7,  label: "700%" },
  { session: 3, objectives: 12, nonObjectives: 5,  total: 17, multiplier: 8,  label: "800%" },
  { session: 4, objectives: 14, nonObjectives: 6,  total: 20, multiplier: 9,  label: "900%" },
  { session: 5, objectives: 14, nonObjectives: 6,  total: 20, multiplier: 10, label: "1000%" },
  { session: 6, objectives: 15, nonObjectives: 7,  total: 22, multiplier: 12, label: "1200%" },
  { session: 7, objectives: 20, nonObjectives: 10, total: 30, multiplier: 15, label: "1500%" },
];

export interface ToggleObjectiveQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  timeLimit: number;
}

export interface ToggleNonObjectiveQuestion {
  id: string;
  question: string;
  acceptedAnswers: string[];
  timeLimit: number;
}

// Large pool of objective questions (need at least 20 for session 7)
const toggleObjectivePool: ToggleObjectiveQuestion[] = [
  { id: "tq-1", question: "Which country has won the most FIFA World Cup titles?", options: ["Germany", "Argentina", "Brazil", "France", "Italy", "Spain", "England", "Uruguay"], correctAnswer: 2, timeLimit: 10 },
  { id: "tq-2", question: "Who painted the Mona Lisa?", options: ["Michelangelo", "Van Gogh", "Leonardo da Vinci", "Picasso", "Raphael", "Rembrandt", "Monet", "Dalí"], correctAnswer: 2, timeLimit: 10 },
  { id: "tq-3", question: "What is the largest planet in our solar system?", options: ["Saturn", "Neptune", "Jupiter", "Uranus", "Earth", "Mars", "Venus", "Mercury"], correctAnswer: 2, timeLimit: 10 },
  { id: "tq-4", question: "Which streaming platform released 'Squid Game'?", options: ["Amazon Prime", "Disney+", "Netflix", "HBO Max", "Apple TV+", "Hulu", "Paramount+", "Peacock"], correctAnswer: 2, timeLimit: 10 },
  { id: "tq-5", question: "What is the capital city of Australia?", options: ["Sydney", "Melbourne", "Canberra", "Brisbane", "Perth", "Adelaide", "Darwin", "Hobart"], correctAnswer: 2, timeLimit: 10 },
  { id: "tq-6", question: "Who is the current CEO of Tesla?", options: ["Jeff Bezos", "Tim Cook", "Elon Musk", "Zuckerberg", "Sundar Pichai", "Satya Nadella", "Bill Gates", "Larry Page"], correctAnswer: 2, timeLimit: 10 },
  { id: "tq-7", question: "Which artist has the most Grammy Awards?", options: ["Michael Jackson", "Quincy Jones", "Beyoncé", "Stevie Wonder", "Taylor Swift", "Adele", "Paul Simon", "Kanye West"], correctAnswer: 2, timeLimit: 10 },
  { id: "tq-8", question: "What year did the first iPhone launch?", options: ["2005", "2006", "2007", "2008", "2009", "2010", "2004", "2011"], correctAnswer: 2, timeLimit: 10 },
  { id: "tq-9", question: "Which country hosted the 2022 FIFA World Cup?", options: ["Russia", "Brazil", "Qatar", "USA", "Germany", "England", "France", "Japan"], correctAnswer: 2, timeLimit: 10 },
  { id: "tq-10", question: "What is the chemical symbol for gold?", options: ["Ag", "Fe", "Au", "Cu", "Pt", "Pb", "Hg", "Sn"], correctAnswer: 2, timeLimit: 10 },
  { id: "tq-11", question: "Which social media platform is owned by ByteDance?", options: ["Instagram", "Snapchat", "TikTok", "Twitter", "YouTube", "Pinterest", "WhatsApp", "Telegram"], correctAnswer: 2, timeLimit: 10 },
  { id: "tq-12", question: "Who wrote the Harry Potter series?", options: ["Stephen King", "Dan Brown", "J.K. Rowling", "G.R.R. Martin", "Rick Riordan", "S. Collins", "S. Meyer", "John Green"], correctAnswer: 2, timeLimit: 10 },
  { id: "tq-13", question: "Which footballer has won the most Ballon d'Or awards?", options: ["C. Ronaldo", "Pelé", "Lionel Messi", "Maradona", "Zidane", "Ronaldinho", "Neymar", "Mbappé"], correctAnswer: 2, timeLimit: 10 },
  { id: "tq-14", question: "What cryptocurrency was created by Satoshi Nakamoto?", options: ["Ethereum", "Dogecoin", "Bitcoin", "Litecoin", "Ripple", "Cardano", "Solana", "Polkadot"], correctAnswer: 2, timeLimit: 10 },
  { id: "tq-15", question: "Which planet is known as the Red Planet?", options: ["Venus", "Jupiter", "Mars", "Mercury", "Saturn", "Neptune", "Uranus", "Pluto"], correctAnswer: 2, timeLimit: 10 },
  { id: "tq-16", question: "What is the hardest natural substance on Earth?", options: ["Gold", "Iron", "Diamond", "Platinum", "Titanium", "Quartz", "Ruby", "Sapphire"], correctAnswer: 2, timeLimit: 10 },
  { id: "tq-17", question: "Who discovered penicillin?", options: ["Marie Curie", "Louis Pasteur", "Alexander Fleming", "Isaac Newton", "Einstein", "Darwin", "Watson", "Crick"], correctAnswer: 2, timeLimit: 10 },
  { id: "tq-18", question: "Which ocean is the largest?", options: ["Atlantic", "Indian", "Pacific", "Arctic", "Southern", "Mediterranean", "Caribbean", "Baltic"], correctAnswer: 2, timeLimit: 10 },
  { id: "tq-19", question: "What is the tallest mountain in the world?", options: ["K2", "Kangchenjunga", "Mount Everest", "Lhotse", "Makalu", "Cho Oyu", "Dhaulagiri", "Manaslu"], correctAnswer: 2, timeLimit: 10 },
  { id: "tq-20", question: "Which country is known as the Land of the Rising Sun?", options: ["China", "South Korea", "Japan", "Thailand", "Vietnam", "Philippines", "Taiwan", "Indonesia"], correctAnswer: 2, timeLimit: 10 },
  { id: "tq-21", question: "What gas do plants absorb from the atmosphere?", options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen", "Helium", "Methane", "Argon", "Ozone"], correctAnswer: 2, timeLimit: 10 },
  { id: "tq-22", question: "Which element has the chemical symbol 'O'?", options: ["Gold", "Silver", "Oxygen", "Iron", "Carbon", "Zinc", "Neon", "Lead"], correctAnswer: 2, timeLimit: 10 },
  { id: "tq-23", question: "Who was the first person to walk on the Moon?", options: ["Buzz Aldrin", "Yuri Gagarin", "Neil Armstrong", "John Glenn", "Alan Shepard", "Michael Collins", "Pete Conrad", "Jim Lovell"], correctAnswer: 2, timeLimit: 10 },
  { id: "tq-24", question: "What is the smallest continent by land area?", options: ["Europe", "Antarctica", "Australia", "South America", "North America", "Africa", "Asia", "Greenland"], correctAnswer: 2, timeLimit: 10 },
  { id: "tq-25", question: "Which animal is the largest living land animal?", options: ["Hippo", "Rhino", "African Elephant", "Giraffe", "Polar Bear", "Bison", "Gorilla", "Moose"], correctAnswer: 2, timeLimit: 10 },
];

// Large pool of non-objective questions (need at least 10 for session 7)
const toggleNonObjectivePool: ToggleNonObjectiveQuestion[] = [
  { id: "tnq-1", question: "Name the process by which plants make food using sunlight", acceptedAnswers: ["photosynthesis"], timeLimit: 15 },
  { id: "tnq-2", question: "What is the capital city of France?", acceptedAnswers: ["paris"], timeLimit: 15 },
  { id: "tnq-3", question: "Name the gas humans breathe out", acceptedAnswers: ["carbon dioxide", "co2"], timeLimit: 15 },
  { id: "tnq-4", question: "What is the largest organ of the human body?", acceptedAnswers: ["skin"], timeLimit: 15 },
  { id: "tnq-5", question: "Name the author of 'Romeo and Juliet'", acceptedAnswers: ["shakespeare", "william shakespeare"], timeLimit: 15 },
  { id: "tnq-6", question: "What does DNA stand for?", acceptedAnswers: ["deoxyribonucleic acid", "deoxyribonucleic"], timeLimit: 15 },
  { id: "tnq-7", question: "Name the currency used in Japan", acceptedAnswers: ["yen", "japanese yen"], timeLimit: 15 },
  { id: "tnq-8", question: "What planet is closest to the Sun?", acceptedAnswers: ["mercury"], timeLimit: 15 },
  { id: "tnq-9", question: "Name the inventor of the telephone", acceptedAnswers: ["alexander graham bell", "graham bell", "bell"], timeLimit: 15 },
  { id: "tnq-10", question: "What is the boiling point of water in Celsius?", acceptedAnswers: ["100", "100 degrees", "100°c"], timeLimit: 15 },
  { id: "tnq-11", question: "Name the continent where the Sahara Desert is located", acceptedAnswers: ["africa"], timeLimit: 15 },
  { id: "tnq-12", question: "What is the speed of light approximately in km/s?", acceptedAnswers: ["300000", "300,000", "3 x 10^8", "299792"], timeLimit: 15 },
];

export const TOGGLE_ANSWER_LABELS = ["A", "B", "C", "D", "E", "F", "G", "H"] as const;

/**
 * Pick random questions for a given Toggle session index (0-6).
 * Returns a fresh shuffled subset from the pools.
 */
export function pickToggleQuestions(sessionIndex: number) {
  const config = TOGGLE_SESSIONS[sessionIndex];
  const shuffledObj = [...toggleObjectivePool].sort(() => Math.random() - 0.5);
  const shuffledNonObj = [...toggleNonObjectivePool].sort(() => Math.random() - 0.5);
  return {
    objectives: shuffledObj.slice(0, config.objectives),
    nonObjectives: shuffledNonObj.slice(0, config.nonObjectives),
  };
}
