import { QuizQuestion } from "@/types/chat";

export const quizQuestions: QuizQuestion[] = [
  // Geography Questions
  {
    id: 'geo1',
    question: 'What is the capital of France?',
    options: ['London', 'Paris', 'Berlin', 'Madrid'],
    correctAnswer: 1,
    category: 'Geography',
    difficulty: 'easy',
    timeLimit: 15,
    points: 10
  },
  {
    id: 'geo2',
    question: 'Which is the largest ocean on Earth?',
    options: ['Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean', 'Pacific Ocean'],
    correctAnswer: 3,
    category: 'Geography',
    difficulty: 'easy',
    timeLimit: 15,
    points: 10
  },
  {
    id: 'geo3',
    question: 'Mount Everest is located in which mountain range?',
    options: ['Alps', 'Andes', 'Himalayas', 'Rockies'],
    correctAnswer: 2,
    category: 'Geography',
    difficulty: 'medium',
    timeLimit: 20,
    points: 20
  },
  {
    id: 'geo4',
    question: 'Which African country has the most pyramids?',
    options: ['Egypt', 'Sudan', 'Libya', 'Tunisia'],
    correctAnswer: 1,
    category: 'Geography',
    difficulty: 'hard',
    timeLimit: 30,
    points: 30
  },
  {
    id: 'geo5',
    question: 'What is the smallest country in the world?',
    options: ['Monaco', 'Vatican City', 'San Marino', 'Liechtenstein'],
    correctAnswer: 1,
    category: 'Geography',
    difficulty: 'medium',
    timeLimit: 20,
    points: 20
  },

  // Science Questions
  {
    id: 'sci1',
    question: 'What is the chemical symbol for gold?',
    options: ['Go', 'Gd', 'Au', 'Ag'],
    correctAnswer: 2,
    category: 'Science',
    difficulty: 'easy',
    timeLimit: 15,
    points: 10
  },
  {
    id: 'sci2',
    question: 'How many planets are in our solar system?',
    options: ['7', '8', '9', '10'],
    correctAnswer: 1,
    category: 'Science',
    difficulty: 'easy',
    timeLimit: 15,
    points: 10
  },
  {
    id: 'sci3',
    question: 'What is the speed of light?',
    options: ['299,792 km/s', '199,792 km/s', '399,792 km/s', '99,792 km/s'],
    correctAnswer: 0,
    category: 'Science',
    difficulty: 'hard',
    timeLimit: 30,
    points: 30
  },
  {
    id: 'sci4',
    question: 'What is the hardest natural substance on Earth?',
    options: ['Gold', 'Iron', 'Diamond', 'Titanium'],
    correctAnswer: 2,
    category: 'Science',
    difficulty: 'medium',
    timeLimit: 20,
    points: 20
  },
  {
    id: 'sci5',
    question: 'What organ in the human body produces insulin?',
    options: ['Liver', 'Pancreas', 'Kidney', 'Heart'],
    correctAnswer: 1,
    category: 'Science',
    difficulty: 'medium',
    timeLimit: 20,
    points: 20
  },

  // History Questions
  {
    id: 'hist1',
    question: 'In which year did World War II end?',
    options: ['1943', '1944', '1945', '1946'],
    correctAnswer: 2,
    category: 'History',
    difficulty: 'easy',
    timeLimit: 15,
    points: 10
  },
  {
    id: 'hist2',
    question: 'Who was the first President of the United States?',
    options: ['Thomas Jefferson', 'George Washington', 'John Adams', 'Benjamin Franklin'],
    correctAnswer: 1,
    category: 'History',
    difficulty: 'easy',
    timeLimit: 15,
    points: 10
  },
  {
    id: 'hist3',
    question: 'The fall of the Berlin Wall occurred in which year?',
    options: ['1987', '1988', '1989', '1990'],
    correctAnswer: 2,
    category: 'History',
    difficulty: 'medium',
    timeLimit: 20,
    points: 20
  },
  {
    id: 'hist4',
    question: 'Which ancient wonder of the world still exists today?',
    options: ['Hanging Gardens of Babylon', 'Great Pyramid of Giza', 'Colossus of Rhodes', 'Lighthouse of Alexandria'],
    correctAnswer: 1,
    category: 'History',
    difficulty: 'medium',
    timeLimit: 20,
    points: 20
  },
  {
    id: 'hist5',
    question: 'Who painted the Mona Lisa?',
    options: ['Michelangelo', 'Leonardo da Vinci', 'Raphael', 'Donatello'],
    correctAnswer: 1,
    category: 'History',
    difficulty: 'easy',
    timeLimit: 15,
    points: 10
  },

  // Math Questions
  {
    id: 'math1',
    question: 'What is 15 × 12?',
    options: ['170', '180', '190', '200'],
    correctAnswer: 1,
    category: 'Math',
    difficulty: 'easy',
    timeLimit: 15,
    points: 10
  },
  {
    id: 'math2',
    question: 'What is the square root of 144?',
    options: ['10', '11', '12', '13'],
    correctAnswer: 2,
    category: 'Math',
    difficulty: 'easy',
    timeLimit: 15,
    points: 10
  },
  {
    id: 'math3',
    question: 'What is 25% of 200?',
    options: ['25', '50', '75', '100'],
    correctAnswer: 1,
    category: 'Math',
    difficulty: 'easy',
    timeLimit: 15,
    points: 10
  },
  {
    id: 'math4',
    question: 'What is the value of π (pi) to two decimal places?',
    options: ['3.12', '3.14', '3.16', '3.18'],
    correctAnswer: 1,
    category: 'Math',
    difficulty: 'medium',
    timeLimit: 20,
    points: 20
  },
  {
    id: 'math5',
    question: 'If a train travels 120 km in 2 hours, what is its average speed?',
    options: ['50 km/h', '60 km/h', '70 km/h', '80 km/h'],
    correctAnswer: 1,
    category: 'Math',
    difficulty: 'medium',
    timeLimit: 20,
    points: 20
  },

  // General Knowledge Questions
  {
    id: 'gen1',
    question: 'How many continents are there?',
    options: ['5', '6', '7', '8'],
    correctAnswer: 2,
    category: 'General Knowledge',
    difficulty: 'easy',
    timeLimit: 15,
    points: 10
  },
  {
    id: 'gen2',
    question: 'What is the largest mammal in the world?',
    options: ['African Elephant', 'Blue Whale', 'Giraffe', 'Polar Bear'],
    correctAnswer: 1,
    category: 'General Knowledge',
    difficulty: 'easy',
    timeLimit: 15,
    points: 10
  },
  {
    id: 'gen3',
    question: 'How many colors are in a rainbow?',
    options: ['5', '6', '7', '8'],
    correctAnswer: 2,
    category: 'General Knowledge',
    difficulty: 'easy',
    timeLimit: 15,
    points: 10
  },
  {
    id: 'gen4',
    question: 'What is the currency of Japan?',
    options: ['Yuan', 'Won', 'Yen', 'Ringgit'],
    correctAnswer: 2,
    category: 'General Knowledge',
    difficulty: 'medium',
    timeLimit: 20,
    points: 20
  },
  {
    id: 'gen5',
    question: 'Which planet is known as the Red Planet?',
    options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
    correctAnswer: 1,
    category: 'General Knowledge',
    difficulty: 'easy',
    timeLimit: 15,
    points: 10
  }
];

export const getRandomQuestions = (count: number = 10): QuizQuestion[] => {
  const shuffled = [...quizQuestions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const getQuestionsByCategory = (category: string): QuizQuestion[] => {
  return quizQuestions.filter(q => q.category === category);
};

export const getQuestionsByDifficulty = (difficulty: 'easy' | 'medium' | 'hard'): QuizQuestion[] => {
  return quizQuestions.filter(q => q.difficulty === difficulty);
};
