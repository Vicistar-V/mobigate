import { useState, useMemo } from "react";
import { Trophy, Gamepad2, TrendingUp, XCircle, Calendar, ArrowLeft, Clock, Users, Coins, Target, ChevronRight, Hash, Award, Zap, BookOpen, Home, GraduationCap, Filter, ArrowUpDown, X, CalendarDays, ChevronDown, Eye, Wallet, AlertTriangle, Loader2, CheckCircle2, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useWalletBalance } from "@/hooks/useWindowData";
import { getQuestionViewFee } from "@/data/platformSettingsData";
import { formatMobiAmount, formatLocalAmount, convertFromMobi } from "@/lib/mobiCurrencyTranslation";

interface GameQuestion {
  question: string;
  yourAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

interface GroupPlayerResult {
  name: string;
  score: number;
  total: number;
  isYou?: boolean;
}

interface GameEntry {
  id: number;
  mode: "Standard Solo" | "Group Quiz" | "Interactive" | "Food for Home" | "Scholarship";
  date: string;
  time: string;
  score: string;
  scoreNum: number;
  scoreTotal: number;
  stake: number;
  prize: number;
  won: boolean;
  duration: string;
  category: string;
  tier: string;
  players?: number;
  bonusRound?: boolean;
  bonusResult?: string;
  itemWon?: string;
  scholarshipName?: string;
  // Group Quiz specific
  groupRank?: number;
  groupPlayers?: GroupPlayerResult[];
  groupWinReason?: string; // e.g. "Highest scorer (≥40%)" or "No winner — all lose"
  questions: GameQuestion[];
}

const mockHistory: GameEntry[] = [
  {
    id: 1, mode: "Standard Solo", date: "2026-02-13", time: "14:32", score: "10/10", scoreNum: 10, scoreTotal: 10,
    stake: 5000, prize: 10000, won: true, duration: "2m 48s", category: "General Knowledge", tier: "Gold",
    bonusRound: true, bonusResult: "Won +M2,500",
    questions: [
      { question: "What is the capital of France?", yourAnswer: "Paris", correctAnswer: "Paris", isCorrect: true },
      { question: "Who painted the Mona Lisa?", yourAnswer: "Da Vinci", correctAnswer: "Leonardo da Vinci", isCorrect: true },
      { question: "What year did WW2 end?", yourAnswer: "1945", correctAnswer: "1945", isCorrect: true },
      { question: "What is the largest planet?", yourAnswer: "Jupiter", correctAnswer: "Jupiter", isCorrect: true },
      { question: "How many continents are there?", yourAnswer: "7", correctAnswer: "7", isCorrect: true },
      { question: "What is H2O?", yourAnswer: "Water", correctAnswer: "Water", isCorrect: true },
      { question: "Who wrote Romeo and Juliet?", yourAnswer: "Shakespeare", correctAnswer: "Shakespeare", isCorrect: true },
      { question: "What is the speed of light?", yourAnswer: "299,792 km/s", correctAnswer: "299,792 km/s", isCorrect: true },
      { question: "What is the smallest prime number?", yourAnswer: "2", correctAnswer: "2", isCorrect: true },
      { question: "What element has symbol 'O'?", yourAnswer: "Oxygen", correctAnswer: "Oxygen", isCorrect: true },
    ],
  },
  {
    id: 2, mode: "Group Quiz", date: "2026-02-12", time: "19:15", score: "8/10", scoreNum: 8, scoreTotal: 10,
    stake: 10000, prize: 0, won: false, duration: "4m 12s", category: "Science & Tech", tier: "Platinum",
    players: 5,
    groupRank: 2,
    groupWinReason: "Not highest scorer",
    groupPlayers: [
      { name: "AdekunleGold", score: 9, total: 10 },
      { name: "You", score: 8, total: 10, isYou: true },
      { name: "ChimaObi99", score: 7, total: 10 },
      { name: "FunkeAdeyemi", score: 6, total: 10 },
      { name: "TundeKings", score: 5, total: 10 },
    ],
    questions: [
      { question: "What is DNA's full name?", yourAnswer: "Deoxyribonucleic acid", correctAnswer: "Deoxyribonucleic acid", isCorrect: true },
      { question: "Who discovered penicillin?", yourAnswer: "Fleming", correctAnswer: "Alexander Fleming", isCorrect: true },
      { question: "What is the chemical symbol for gold?", yourAnswer: "Au", correctAnswer: "Au", isCorrect: true },
      { question: "What planet is closest to the sun?", yourAnswer: "Venus", correctAnswer: "Mercury", isCorrect: false },
      { question: "What is the powerhouse of the cell?", yourAnswer: "Mitochondria", correctAnswer: "Mitochondria", isCorrect: true },
      { question: "Who invented the telephone?", yourAnswer: "Bell", correctAnswer: "Alexander Graham Bell", isCorrect: true },
      { question: "What gas do plants absorb?", yourAnswer: "CO2", correctAnswer: "Carbon dioxide", isCorrect: true },
      { question: "What is absolute zero in Celsius?", yourAnswer: "-273", correctAnswer: "-273.15°C", isCorrect: true },
      { question: "What is the speed of sound?", yourAnswer: "300 m/s", correctAnswer: "343 m/s", isCorrect: false },
      { question: "How many bones in the human body?", yourAnswer: "206", correctAnswer: "206", isCorrect: true },
    ],
  },
  {
    id: 3, mode: "Interactive", date: "2026-02-11", time: "11:05", score: "13/15", scoreNum: 13, scoreTotal: 15,
    stake: 7500, prize: 15000, won: true, duration: "6m 33s", category: "Entertainment", tier: "Diamond",
    questions: [
      { question: "Who directed Inception?", yourAnswer: "Nolan", correctAnswer: "Christopher Nolan", isCorrect: true },
      { question: "What year was Spotify launched?", yourAnswer: "2008", correctAnswer: "2008", isCorrect: true },
      { question: "Who played Iron Man?", yourAnswer: "Robert Downey Jr.", correctAnswer: "Robert Downey Jr.", isCorrect: true },
      { question: "What is the highest-grossing film?", yourAnswer: "Avatar", correctAnswer: "Avatar", isCorrect: true },
      { question: "Who sang 'Thriller'?", yourAnswer: "Michael Jackson", correctAnswer: "Michael Jackson", isCorrect: true },
      { question: "What year was Netflix founded?", yourAnswer: "1999", correctAnswer: "1997", isCorrect: false },
      { question: "Who created Mickey Mouse?", yourAnswer: "Walt Disney", correctAnswer: "Walt Disney", isCorrect: true },
      { question: "What is the longest-running TV show?", yourAnswer: "The Simpsons", correctAnswer: "The Simpsons", isCorrect: true },
      { question: "Who wrote Harry Potter?", yourAnswer: "J.K. Rowling", correctAnswer: "J.K. Rowling", isCorrect: true },
      { question: "What instrument has 88 keys?", yourAnswer: "Piano", correctAnswer: "Piano", isCorrect: true },
      { question: "Name the Beatles' drummer", yourAnswer: "Ringo Starr", correctAnswer: "Ringo Starr", isCorrect: true },
      { question: "What was Elvis's last name?", yourAnswer: "Presley", correctAnswer: "Presley", isCorrect: true },
      { question: "Who played Jack in Titanic?", yourAnswer: "DiCaprio", correctAnswer: "Leonardo DiCaprio", isCorrect: true },
      { question: "What year did YouTube launch?", yourAnswer: "2006", correctAnswer: "2005", isCorrect: false },
      { question: "Who is the 'King of Pop'?", yourAnswer: "Michael Jackson", correctAnswer: "Michael Jackson", isCorrect: true },
    ],
  },
  {
    id: 4, mode: "Food for Home", date: "2026-02-10", time: "16:45", score: "12/15", scoreNum: 12, scoreTotal: 15,
    stake: 3000, prize: 0, won: false, duration: "5m 20s", category: "Food & Nutrition", tier: "Silver",
    itemWon: "5kg Bag of Rice (Market Value: M15,000)",
    questions: [
      { question: "What vitamin is in oranges?", yourAnswer: "Vitamin C", correctAnswer: "Vitamin C", isCorrect: true },
      { question: "What grain is sushi made from?", yourAnswer: "Rice", correctAnswer: "Rice", isCorrect: true },
      { question: "What is tofu made from?", yourAnswer: "Soybeans", correctAnswer: "Soybeans", isCorrect: true },
      { question: "How many calories in 1g of fat?", yourAnswer: "7", correctAnswer: "9", isCorrect: false },
      { question: "What is the main ingredient in guacamole?", yourAnswer: "Avocado", correctAnswer: "Avocado", isCorrect: true },
      { question: "What mineral is in bananas?", yourAnswer: "Potassium", correctAnswer: "Potassium", isCorrect: true },
      { question: "What cheese is on pizza traditionally?", yourAnswer: "Mozzarella", correctAnswer: "Mozzarella", isCorrect: true },
      { question: "What country does sushi originate from?", yourAnswer: "Japan", correctAnswer: "Japan", isCorrect: true },
      { question: "What is the most consumed meat globally?", yourAnswer: "Beef", correctAnswer: "Pork", isCorrect: false },
      { question: "How many cups in a liter?", yourAnswer: "4", correctAnswer: "4.2", isCorrect: false },
      { question: "What is ghee?", yourAnswer: "Clarified butter", correctAnswer: "Clarified butter", isCorrect: true },
      { question: "What nut is marzipan made from?", yourAnswer: "Almond", correctAnswer: "Almond", isCorrect: true },
      { question: "What fruit is dried to make raisins?", yourAnswer: "Grapes", correctAnswer: "Grapes", isCorrect: true },
      { question: "What is the hottest chili pepper?", yourAnswer: "Carolina Reaper", correctAnswer: "Carolina Reaper", isCorrect: true },
      { question: "What does MSG stand for?", yourAnswer: "Monosodium glutamate", correctAnswer: "Monosodium glutamate", isCorrect: true },
    ],
  },
  {
    id: 5, mode: "Standard Solo", date: "2026-02-09", time: "09:22", score: "9/10", scoreNum: 9, scoreTotal: 10,
    stake: 5000, prize: 8000, won: true, duration: "3m 05s", category: "History", tier: "Gold",
    bonusRound: false,
    questions: [
      { question: "Who was the first US president?", yourAnswer: "George Washington", correctAnswer: "George Washington", isCorrect: true },
      { question: "When did the Berlin Wall fall?", yourAnswer: "1989", correctAnswer: "1989", isCorrect: true },
      { question: "Who discovered America?", yourAnswer: "Columbus", correctAnswer: "Christopher Columbus", isCorrect: true },
      { question: "What year did the Titanic sink?", yourAnswer: "1912", correctAnswer: "1912", isCorrect: true },
      { question: "Who was Cleopatra?", yourAnswer: "Egyptian queen", correctAnswer: "Queen of Egypt", isCorrect: true },
      { question: "What was the Roman Empire's capital?", yourAnswer: "Rome", correctAnswer: "Rome", isCorrect: true },
      { question: "When did WW1 start?", yourAnswer: "1915", correctAnswer: "1914", isCorrect: false },
      { question: "Who invented the printing press?", yourAnswer: "Gutenberg", correctAnswer: "Johannes Gutenberg", isCorrect: true },
      { question: "What ancient wonder was in Egypt?", yourAnswer: "Great Pyramid", correctAnswer: "Great Pyramid of Giza", isCorrect: true },
      { question: "Who wrote the Communist Manifesto?", yourAnswer: "Karl Marx", correctAnswer: "Karl Marx", isCorrect: true },
    ],
  },
  {
    id: 6, mode: "Group Quiz", date: "2026-02-08", time: "20:00", score: "7/10", scoreNum: 7, scoreTotal: 10,
    stake: 8000, prize: 16000, won: true, duration: "3m 55s", category: "Sports", tier: "Gold",
    players: 4,
    groupRank: 1,
    groupWinReason: "Highest scorer (≥40%)",
    groupPlayers: [
      { name: "You", score: 7, total: 10, isYou: true },
      { name: "BlessedBoy", score: 6, total: 10 },
      { name: "NaijaQuizKing", score: 5, total: 10 },
      { name: "SportsFanatic", score: 3, total: 10 },
    ],
    questions: [
      { question: "How many players on a soccer team?", yourAnswer: "11", correctAnswer: "11", isCorrect: true },
      { question: "Who has the most Ballon d'Or?", yourAnswer: "Messi", correctAnswer: "Lionel Messi", isCorrect: true },
      { question: "What sport uses a shuttlecock?", yourAnswer: "Badminton", correctAnswer: "Badminton", isCorrect: true },
      { question: "How many sets in a tennis match (men)?", yourAnswer: "3", correctAnswer: "5", isCorrect: false },
      { question: "What country hosted 2022 FIFA World Cup?", yourAnswer: "Qatar", correctAnswer: "Qatar", isCorrect: true },
      { question: "How long is a marathon in km?", yourAnswer: "42km", correctAnswer: "42.195 km", isCorrect: true },
      { question: "What sport is Tiger Woods famous for?", yourAnswer: "Golf", correctAnswer: "Golf", isCorrect: true },
      { question: "How many rings on the Olympic flag?", yourAnswer: "5", correctAnswer: "5", isCorrect: true },
      { question: "What is a perfect score in bowling?", yourAnswer: "300", correctAnswer: "300", isCorrect: true },
      { question: "Who holds the 100m world record?", yourAnswer: "Bolt", correctAnswer: "Usain Bolt", isCorrect: false },
    ],
  },
  {
    id: 7, mode: "Scholarship", date: "2026-02-07", time: "13:00", score: "18/20", scoreNum: 18, scoreTotal: 20,
    stake: 20000, prize: 0, won: false, duration: "8m 42s", category: "Academic Excellence", tier: "Diamond",
    scholarshipName: "Mobigate STEM Scholarship 2026 (Annual Budget: M100,000)",
    questions: [
      { question: "What is the derivative of x²?", yourAnswer: "2x", correctAnswer: "2x", isCorrect: true },
      { question: "What is Newton's second law?", yourAnswer: "F=ma", correctAnswer: "F = ma", isCorrect: true },
      { question: "What is the pH of pure water?", yourAnswer: "7", correctAnswer: "7", isCorrect: true },
      { question: "What is Avogadro's number?", yourAnswer: "6.022×10²³", correctAnswer: "6.022 × 10²³", isCorrect: true },
      { question: "What is the integral of 1/x?", yourAnswer: "ln|x| + C", correctAnswer: "ln|x| + C", isCorrect: true },
      { question: "What is Ohm's law?", yourAnswer: "V=IR", correctAnswer: "V = IR", isCorrect: true },
      { question: "What organelle does photosynthesis?", yourAnswer: "Chloroplast", correctAnswer: "Chloroplast", isCorrect: true },
      { question: "What is the Pythagorean theorem?", yourAnswer: "a²+b²=c²", correctAnswer: "a² + b² = c²", isCorrect: true },
      { question: "What is the atomic number of carbon?", yourAnswer: "6", correctAnswer: "6", isCorrect: true },
      { question: "What is the value of pi to 4 decimals?", yourAnswer: "3.1416", correctAnswer: "3.1416", isCorrect: true },
      { question: "What causes tides?", yourAnswer: "Moon's gravity", correctAnswer: "Gravitational pull of the Moon", isCorrect: true },
      { question: "What is the charge of an electron?", yourAnswer: "-1.6×10⁻¹⁹ C", correctAnswer: "-1.6 × 10⁻¹⁹ C", isCorrect: true },
      { question: "What is the formula for kinetic energy?", yourAnswer: "½mv²", correctAnswer: "½mv²", isCorrect: true },
      { question: "What gas is most abundant in Earth's atmosphere?", yourAnswer: "Nitrogen", correctAnswer: "Nitrogen", isCorrect: true },
      { question: "What is the boiling point of water in Kelvin?", yourAnswer: "373", correctAnswer: "373.15 K", isCorrect: true },
      { question: "What is Planck's constant?", yourAnswer: "6.63×10⁻³⁴", correctAnswer: "6.626 × 10⁻³⁴ J·s", isCorrect: true },
      { question: "What is the mitochondria's function?", yourAnswer: "Energy production", correctAnswer: "Cellular energy production (ATP)", isCorrect: true },
      { question: "What is the SI unit of force?", yourAnswer: "Newton", correctAnswer: "Newton", isCorrect: true },
      { question: "What is the half-life of Carbon-14?", yourAnswer: "5000 years", correctAnswer: "5,730 years", isCorrect: false },
      { question: "What is Heisenberg's uncertainty principle about?", yourAnswer: "Position and speed", correctAnswer: "Position and momentum", isCorrect: false },
    ],
  },
  {
    id: 8, mode: "Standard Solo", date: "2026-02-06", time: "17:10", score: "10/10", scoreNum: 10, scoreTotal: 10,
    stake: 5000, prize: 10000, won: true, duration: "2m 30s", category: "Geography", tier: "Silver",
    bonusRound: true, bonusResult: "Lost bonus round",
    questions: [
      { question: "What is the largest continent?", yourAnswer: "Asia", correctAnswer: "Asia", isCorrect: true },
      { question: "What is the longest river?", yourAnswer: "Nile", correctAnswer: "Nile", isCorrect: true },
      { question: "What country has the most people?", yourAnswer: "India", correctAnswer: "India", isCorrect: true },
      { question: "What is the smallest country?", yourAnswer: "Vatican City", correctAnswer: "Vatican City", isCorrect: true },
      { question: "What ocean is the largest?", yourAnswer: "Pacific", correctAnswer: "Pacific Ocean", isCorrect: true },
      { question: "What is the capital of Japan?", yourAnswer: "Tokyo", correctAnswer: "Tokyo", isCorrect: true },
      { question: "What desert is the largest?", yourAnswer: "Sahara", correctAnswer: "Sahara Desert", isCorrect: true },
      { question: "What mountain is the tallest?", yourAnswer: "Everest", correctAnswer: "Mount Everest", isCorrect: true },
      { question: "How many time zones does Russia have?", yourAnswer: "11", correctAnswer: "11", isCorrect: true },
      { question: "What is the capital of Australia?", yourAnswer: "Canberra", correctAnswer: "Canberra", isCorrect: true },
    ],
  },
];

const modeIcons: Record<string, typeof Gamepad2> = {
  "Standard Solo": Zap,
  "Group Quiz": Users,
  "Interactive": Gamepad2,
  "Food for Home": Home,
  "Scholarship": GraduationCap,
};

const modeColors: Record<string, { bg: string; text: string; border: string }> = {
  "Standard Solo": { bg: "bg-primary/10", text: "text-primary", border: "border-primary/20" },
  "Group Quiz": { bg: "bg-blue-500/10", text: "text-blue-600 dark:text-blue-400", border: "border-blue-500/20" },
  "Interactive": { bg: "bg-purple-500/10", text: "text-purple-600 dark:text-purple-400", border: "border-purple-500/20" },
  "Food for Home": { bg: "bg-orange-500/10", text: "text-orange-600 dark:text-orange-400", border: "border-orange-500/20" },
  "Scholarship": { bg: "bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-500/20" },
};

const ALL_MODES: GameEntry["mode"][] = ["Standard Solo", "Group Quiz", "Interactive", "Food for Home", "Scholarship"];

type SortOption = "date_desc" | "date_asc" | "stake_desc" | "stake_asc" | "score_desc" | "score_asc";
const sortLabels: Record<SortOption, string> = {
  date_desc: "Newest First",
  date_asc: "Oldest First",
  stake_desc: "Highest Stake",
  stake_asc: "Lowest Stake",
  score_desc: "Best Score",
  score_asc: "Worst Score",
};

export default function MyQuizHistory() {
  const [selectedGame, setSelectedGame] = useState<GameEntry | null>(null);
  const [showQuestions, setShowQuestions] = useState(false);

  // Payment gate state
  const { toast } = useToast();
  const walletBalance = useWalletBalance();
  const [questionAccessGranted, setQuestionAccessGranted] = useState<Set<number>>(new Set());
  const [paymentGameId, setPaymentGameId] = useState<number | null>(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  const questionViewFee = getQuestionViewFee();
  const hasSufficientFunds = walletBalance.mobi >= questionViewFee;
  const localFee = convertFromMobi(questionViewFee, "NGN");

  // Filter state
  const [filterMode, setFilterMode] = useState<GameEntry["mode"] | "all">("all");
  const [filterResult, setFilterResult] = useState<"all" | "won" | "lost">("all");
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);
  const [sortBy, setSortBy] = useState<SortOption>("date_desc");
  const [showFilters, setShowFilters] = useState(false);
  const [showSortDrawer, setShowSortDrawer] = useState(false);

  const hasActiveFilters = filterMode !== "all" || filterResult !== "all" || !!dateFrom || !!dateTo;

  const clearFilters = () => {
    setFilterMode("all");
    setFilterResult("all");
    setDateFrom(undefined);
    setDateTo(undefined);
  };

  const filteredAndSorted = useMemo(() => {
    let result = [...mockHistory];

    // Filter by mode
    if (filterMode !== "all") {
      result = result.filter(g => g.mode === filterMode);
    }
    // Filter by result
    if (filterResult === "won") result = result.filter(g => g.won);
    if (filterResult === "lost") result = result.filter(g => !g.won);
    // Filter by date range
    if (dateFrom) result = result.filter(g => new Date(g.date) >= dateFrom);
    if (dateTo) result = result.filter(g => new Date(g.date) <= dateTo);

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case "date_desc": return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "date_asc": return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "stake_desc": return b.stake - a.stake;
        case "stake_asc": return a.stake - b.stake;
        case "score_desc": return (b.scoreNum / b.scoreTotal) - (a.scoreNum / a.scoreTotal);
        case "score_asc": return (a.scoreNum / a.scoreTotal) - (b.scoreNum / b.scoreTotal);
        default: return 0;
      }
    });

    return result;
  }, [filterMode, filterResult, dateFrom, dateTo, sortBy]);

  // Dynamic stats based on filtered results
  const totalGames = filteredAndSorted.length;
  const wins = filteredAndSorted.filter(g => g.won).length;
  const losses = totalGames - wins;
  const winRate = totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0;

  const handleOpenDetail = (game: GameEntry) => {
    setSelectedGame(game);
    setShowQuestions(false);
  };

  const handleViewQuestions = (gameId: number) => {
    if (questionAccessGranted.has(gameId)) {
      setShowQuestions(!showQuestions);
    } else {
      setPaymentGameId(gameId);
    }
  };

  const handlePayAndView = async () => {
    if (!hasSufficientFunds || paymentGameId === null) return;
    setPaymentProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setQuestionAccessGranted(prev => new Set(prev).add(paymentGameId));
    setShowQuestions(true);
    setPaymentProcessing(false);
    setPaymentGameId(null);
    toast({
      title: "Payment Successful",
      description: `${formatMobiAmount(questionViewFee)} charged. Questions are now visible.`,
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border/50 px-4 py-3">
        <div className="flex items-center gap-3">
          <Link to="/" className="p-1.5 rounded-lg hover:bg-accent/50 transition-colors">
            <ArrowLeft className="h-5 w-5 text-muted-foreground" />
          </Link>
          <div className="flex items-center gap-2 flex-1">
            <Gamepad2 className="h-5 w-5 text-primary" />
            <h1 className="text-lg font-bold">My Quiz History</h1>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "relative p-2 rounded-lg transition-colors",
              showFilters ? "bg-primary/10 text-primary" : "hover:bg-accent/50 text-muted-foreground"
            )}
          >
            <Filter className="h-5 w-5" />
            {hasActiveFilters && (
              <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-primary" />
            )}
          </button>
        </div>
      </div>

      {/* Filter & Sort Bar */}
      {showFilters && (
        <div className="px-4 py-3 bg-muted/30 border-b border-border/50 space-y-3">
          {/* Mode Filter */}
          <div>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Game Mode</p>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setFilterMode("all")}
                className={cn(
                  "px-2.5 py-1 rounded-full text-[11px] font-medium transition-all border",
                  filterMode === "all"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card border-border/50 text-muted-foreground"
                )}
              >
                All
              </button>
              {ALL_MODES.map(mode => {
                const MIcon = modeIcons[mode];
                const colors = modeColors[mode];
                return (
                  <button
                    key={mode}
                    onClick={() => setFilterMode(filterMode === mode ? "all" : mode)}
                    className={cn(
                      "px-2.5 py-1 rounded-full text-[11px] font-medium transition-all border flex items-center gap-1",
                      filterMode === mode
                        ? `${colors.bg} ${colors.text} ${colors.border}`
                        : "bg-card border-border/50 text-muted-foreground"
                    )}
                  >
                    <MIcon className="h-3 w-3" />
                    {mode}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Result Filter */}
          <div>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Result</p>
            <div className="flex gap-1.5">
              {([["all", "All"], ["won", "Won"], ["lost", "Lost"]] as const).map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => setFilterResult(val)}
                  className={cn(
                    "px-3 py-1 rounded-full text-[11px] font-medium transition-all border",
                    filterResult === val
                      ? val === "won" ? "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30"
                        : val === "lost" ? "bg-red-500/10 text-destructive border-red-500/30"
                        : "bg-primary text-primary-foreground border-primary"
                      : "bg-card border-border/50 text-muted-foreground"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Date Range</p>
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <button className={cn(
                    "flex-1 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[11px] transition-colors",
                    dateFrom ? "border-primary/30 bg-primary/5 text-foreground" : "border-border/50 bg-card text-muted-foreground"
                  )}>
                    <CalendarDays className="h-3 w-3 shrink-0" />
                    {dateFrom ? format(dateFrom, "MMM d, yyyy") : "From"}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 z-50 bg-popover" align="start">
                  <CalendarPicker
                    mode="single"
                    selected={dateFrom}
                    onSelect={(d) => setDateFrom(d)}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger asChild>
                  <button className={cn(
                    "flex-1 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[11px] transition-colors",
                    dateTo ? "border-primary/30 bg-primary/5 text-foreground" : "border-border/50 bg-card text-muted-foreground"
                  )}>
                    <CalendarDays className="h-3 w-3 shrink-0" />
                    {dateTo ? format(dateTo, "MMM d, yyyy") : "To"}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 z-50 bg-popover" align="end">
                  <CalendarPicker
                    mode="single"
                    selected={dateTo}
                    onSelect={(d) => setDateTo(d)}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Sort + Clear Row */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSortDrawer(true)}
              className="flex-1 flex items-center justify-between px-3 py-1.5 rounded-lg border border-border/50 bg-card text-[11px]"
            >
              <div className="flex items-center gap-1.5">
                <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
                <span className="font-medium">{sortLabels[sortBy]}</span>
              </div>
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </button>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-destructive/30 bg-destructive/5 text-destructive text-[11px] font-medium"
              >
                <X className="h-3 w-3" />
                Clear
              </button>
            )}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2 px-4 py-4">
        {[
          { label: "Games", value: totalGames, icon: Gamepad2, color: "text-primary" },
          { label: "Wins", value: wins, icon: Trophy, color: "text-green-600 dark:text-green-400" },
          { label: "Losses", value: losses, icon: XCircle, color: "text-destructive" },
          { label: "Win %", value: `${winRate}%`, icon: TrendingUp, color: "text-amber-600 dark:text-amber-400" },
        ].map(stat => (
          <div key={stat.label} className="bg-card rounded-xl border border-border/50 p-3 text-center">
            <stat.icon className={`h-4 w-4 mx-auto mb-1 ${stat.color}`} />
            <p className="text-lg font-bold">{stat.value}</p>
            <p className="text-[10px] text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Game List */}
      <div className="px-4 space-y-2">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-muted-foreground">
            {hasActiveFilters ? `Filtered Results (${filteredAndSorted.length})` : "Recent Games"}
          </h2>
          {!showFilters && (
            <button
              onClick={() => setShowSortDrawer(true)}
              className="flex items-center gap-1 text-[11px] text-muted-foreground"
            >
              <ArrowUpDown className="h-3 w-3" />
              {sortLabels[sortBy]}
            </button>
          )}
        </div>

        {filteredAndSorted.length === 0 ? (
          <div className="py-12 text-center">
            <Gamepad2 className="h-10 w-10 mx-auto mb-2 text-muted-foreground/30" />
            <p className="text-sm font-medium text-muted-foreground">No games match your filters</p>
            <button onClick={clearFilters} className="mt-2 text-xs text-primary font-medium">Clear all filters</button>
          </div>
        ) : (
          filteredAndSorted.map(game => {
            const ModeIcon = modeIcons[game.mode] || Gamepad2;
            const colors = modeColors[game.mode] || modeColors["Standard Solo"];
            return (
              <button
                key={game.id}
                onClick={() => handleOpenDetail(game)}
                className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border/50 w-full text-left active:scale-[0.98] transition-all"
              >
                <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${
                  game.won ? "bg-green-100 dark:bg-green-900/30" : "bg-red-100 dark:bg-red-900/30"
                }`}>
                  {game.won ? (
                    <Trophy className="h-5 w-5 text-green-600 dark:text-green-400" />
                  ) : (
                    <XCircle className="h-5 w-5 text-destructive" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <ModeIcon className={`h-3 w-3 ${colors.text}`} />
                    <p className="font-semibold text-sm">{game.mode}</p>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{game.date}</span>
                    <span className="mx-0.5">•</span>
                    <span>{game.score}</span>
                  </div>
                </div>
                <div className="text-right shrink-0 flex items-center gap-1.5">
                  <div>
                    <p className={`text-sm font-bold ${game.won ? "text-green-600 dark:text-green-400" : "text-destructive"}`}>
                      {game.won ? `+M${game.prize.toLocaleString()}` : `-M${game.stake.toLocaleString()}`}
                    </p>
                    <p className={`text-[10px] font-medium ${game.won ? "text-green-600/70 dark:text-green-400/70" : "text-destructive/70"}`}>
                      {game.won ? "Won" : "Lost"}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Sort Drawer */}
      <Drawer open={showSortDrawer} onOpenChange={setShowSortDrawer}>
        <DrawerContent className="pb-6">
          <DrawerHeader className="text-center pb-2">
            <div className="flex items-center justify-center gap-2">
              <ArrowUpDown className="h-5 w-5 text-primary" />
              <DrawerTitle className="text-lg font-bold">Sort Games</DrawerTitle>
            </div>
          </DrawerHeader>
          <div className="px-4 space-y-1">
            {(Object.entries(sortLabels) as [SortOption, string][]).map(([key, label]) => (
              <button
                key={key}
                onClick={() => { setSortBy(key); setShowSortDrawer(false); }}
                className={cn(
                  "w-full flex items-center justify-between p-3 rounded-xl transition-all text-sm",
                  sortBy === key
                    ? "bg-primary/10 text-primary font-semibold border border-primary/20"
                    : "bg-card border border-border/50 text-foreground hover:bg-accent/30"
                )}
              >
                <span>{label}</span>
                {sortBy === key && <span className="text-xs">✓</span>}
              </button>
            ))}
          </div>
        </DrawerContent>
      </Drawer>

      {/* Game Detail Drawer */}
      <Drawer open={!!selectedGame} onOpenChange={(open) => { if (!open) setSelectedGame(null); }}>
        <DrawerContent className="max-h-[92vh] p-0">
          {selectedGame && (() => {
            const game = selectedGame;
            const ModeIcon = modeIcons[game.mode] || Gamepad2;
            const colors = modeColors[game.mode] || modeColors["Standard Solo"];
            const scorePercent = Math.round((game.scoreNum / game.scoreTotal) * 100);
            const correctCount = game.questions.filter(q => q.isCorrect).length;
            const wrongCount = game.questions.length - correctCount;

            return (
              <div className="flex-1 overflow-y-auto overscroll-contain pb-8" style={{ touchAction: "pan-y", WebkitOverflowScrolling: "touch" }}>
                <DrawerHeader className="text-center pb-3 pt-2">
                  <div className={`h-14 w-14 rounded-full mx-auto mb-2 flex items-center justify-center ${colors.bg}`}>
                    <ModeIcon className={`h-7 w-7 ${colors.text}`} />
                  </div>
                  <DrawerTitle className="text-lg font-bold">{game.mode} Quiz</DrawerTitle>
                  <p className="text-xs text-muted-foreground">{game.date} at {game.time}</p>
                </DrawerHeader>

                {/* Result Banner */}
                <div className={`mx-4 p-4 rounded-xl text-center mb-4 ${
                  game.won
                    ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                    : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                }`}>
                  <div className="flex items-center justify-center gap-2 mb-1">
                    {game.won ? (
                      <Trophy className="h-6 w-6 text-green-600 dark:text-green-400" />
                    ) : (
                      <XCircle className="h-6 w-6 text-destructive" />
                    )}
                    <span className={`text-xl font-bold ${game.won ? "text-green-700 dark:text-green-300" : "text-destructive"}`}>
                      {game.won ? "Victory!" : "Defeated"}
                    </span>
                  </div>
                  <p className={`text-2xl font-black ${game.won ? "text-green-600 dark:text-green-400" : "text-destructive"}`}>
                    {game.won ? `+M${game.prize.toLocaleString()}` : `-M${game.stake.toLocaleString()}`}
                  </p>
                </div>

                {/* Score Progress */}
                <div className="mx-4 mb-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium text-muted-foreground">Score</span>
                    <span className="text-sm font-bold">{game.score} ({scorePercent}%)</span>
                  </div>
                  <Progress value={scorePercent} className="h-2.5" />
                  <div className="flex justify-between mt-1">
                    <span className="text-[10px] text-green-600 dark:text-green-400">{correctCount} correct</span>
                    <span className="text-[10px] text-destructive">{wrongCount} wrong</span>
                  </div>
                </div>

                <Separator className="mx-4 mb-3" />

                {/* Game Info Grid */}
                <div className="grid grid-cols-2 gap-2 px-4 mb-4">
                  <div className="bg-muted/50 rounded-lg p-2.5 flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div>
                      <p className="text-[10px] text-muted-foreground">Category</p>
                      <p className="text-xs font-semibold leading-tight">{game.category}</p>
                    </div>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-2.5 flex items-center gap-2">
                    <Award className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div>
                      <p className="text-[10px] text-muted-foreground">Tier</p>
                      <p className="text-xs font-semibold">{game.tier}</p>
                    </div>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-2.5 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div>
                      <p className="text-[10px] text-muted-foreground">Duration</p>
                      <p className="text-xs font-semibold">{game.duration}</p>
                    </div>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-2.5 flex items-center gap-2">
                    <Coins className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div>
                      <p className="text-[10px] text-muted-foreground">Stake</p>
                      <p className="text-xs font-semibold">M{game.stake.toLocaleString()}</p>
                    </div>
                  </div>
                  {game.players && (
                    <div className="bg-muted/50 rounded-lg p-2.5 flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground shrink-0" />
                      <div>
                        <p className="text-[10px] text-muted-foreground">Players</p>
                        <p className="text-xs font-semibold">{game.players} players</p>
                      </div>
                    </div>
                  )}
                  <div className="bg-muted/50 rounded-lg p-2.5 flex items-center gap-2">
                    <Hash className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div>
                      <p className="text-[10px] text-muted-foreground">Game ID</p>
                      <p className="text-xs font-semibold">#{game.id.toString().padStart(5, "0")}</p>
                    </div>
                  </div>
                </div>

                {/* Mode-Specific Info */}
                {game.bonusRound !== undefined && (
                  <div className="mx-4 mb-3 p-3 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50/60 dark:bg-amber-950/30">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                      <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">
                        Bonus Round: {game.bonusRound ? game.bonusResult : "Not qualified"}
                      </span>
                    </div>
                  </div>
                )}

                {game.itemWon && (
                  <div className="mx-4 mb-3 p-3 rounded-lg border border-orange-200 dark:border-orange-800 bg-orange-50/60 dark:bg-orange-950/30">
                    <div className="flex items-center gap-2">
                      <Home className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                      <span className="text-xs font-semibold text-orange-700 dark:text-orange-300">
                        Item: {game.itemWon}
                      </span>
                    </div>
                  </div>
                )}

                {game.scholarshipName && (
                  <div className="mx-4 mb-3 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-950/30">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 leading-tight">
                        {game.scholarshipName}
                      </span>
                    </div>
                  </div>
                )}

                {/* Group Quiz Leaderboard & Rules */}
                {game.mode === "Group Quiz" && game.groupPlayers && (
                  <div className="mx-4 mb-3 space-y-2">
                    {/* Leaderboard */}
                    <div className="p-3 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20">
                      <div className="flex items-center gap-2 mb-2.5">
                        <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-xs font-bold text-blue-700 dark:text-blue-300">Group Leaderboard</span>
                        {game.groupRank && (
                          <Badge variant="secondary" className="ml-auto text-[10px] px-1.5 py-0 bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20">
                            #{game.groupRank} of {game.groupPlayers.length}
                          </Badge>
                        )}
                      </div>
                      <div className="space-y-1">
                        {game.groupPlayers.map((p, idx) => {
                          const pPercent = Math.round((p.score / p.total) * 100);
                          const isWinner = idx === 0 && pPercent >= 40;
                          return (
                            <div
                              key={idx}
                              className={cn(
                                "flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs",
                                p.isYou
                                  ? "bg-primary/10 border border-primary/20 font-bold"
                                  : "bg-muted/40"
                              )}
                            >
                              <span className={cn(
                                "h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0",
                                idx === 0 && isWinner
                                  ? "bg-amber-500 text-white"
                                  : "bg-muted text-muted-foreground"
                              )}>
                                {idx + 1}
                              </span>
                              <span className="flex-1 truncate">
                                {p.isYou ? "You" : p.name}
                              </span>
                              <span className="font-semibold">{p.score}/{p.total}</span>
                              <span className="text-[10px] text-muted-foreground w-8 text-right">{pPercent}%</span>
                              {idx === 0 && isWinner && (
                                <Trophy className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Win Condition Rule */}
                    <div className={cn(
                      "p-2.5 rounded-lg border flex items-start gap-2",
                      game.won
                        ? "border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20"
                        : "border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20"
                    )}>
                      <AlertTriangle className={cn("h-3.5 w-3.5 shrink-0 mt-0.5", game.won ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400")} />
                      <div>
                        <p className={cn("text-[11px] font-semibold", game.won ? "text-green-700 dark:text-green-300" : "text-amber-700 dark:text-amber-300")}>
                          {game.groupWinReason}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          Winner must be the highest scorer with a minimum of 40%. Otherwise, all players lose.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <Separator className="mx-4 mb-3" />

                {/* Questions Toggle - Payment Gated */}
                <button
                  onClick={() => handleViewQuestions(game.id)}
                  className="mx-4 w-[calc(100%-2rem)] flex items-center justify-between p-3 rounded-xl bg-muted/50 border border-border/50 active:scale-[0.98] transition-all"
                >
                  <div className="flex items-center gap-2">
                    {questionAccessGranted.has(game.id) ? (
                      <Target className="h-4 w-4 text-primary" />
                    ) : (
                      <Lock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    )}
                    <span className="text-sm font-semibold">View All Questions ({game.questions.length})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {!questionAccessGranted.has(game.id) && (
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20">
                        {formatMobiAmount(questionViewFee)}
                      </Badge>
                    )}
                    <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform ${showQuestions && questionAccessGranted.has(game.id) ? "rotate-90" : ""}`} />
                  </div>
                </button>

                {/* Questions List (only if paid) */}
                {showQuestions && questionAccessGranted.has(game.id) && (
                  <div className="mx-4 mt-3 space-y-2">
                    {game.questions.map((q, i) => (
                      <div
                        key={i}
                        className={`p-3 rounded-lg border ${
                          q.isCorrect
                            ? "border-green-200 dark:border-green-800/50 bg-green-50/50 dark:bg-green-950/20"
                            : "border-red-200 dark:border-red-800/50 bg-red-50/50 dark:bg-red-950/20"
                        }`}
                      >
                        <p className="text-xs font-medium mb-1.5">
                          <span className="text-muted-foreground">Q{i + 1}.</span> {q.question}
                        </p>
                        <div className="flex items-start gap-1.5 text-[11px]">
                          <span className={`font-semibold shrink-0 ${q.isCorrect ? "text-green-600 dark:text-green-400" : "text-destructive"}`}>
                            You:
                          </span>
                          <span className={q.isCorrect ? "text-green-700 dark:text-green-300" : "text-destructive line-through"}>
                            {q.yourAnswer}
                          </span>
                        </div>
                        {!q.isCorrect && (
                          <div className="flex items-start gap-1.5 text-[11px] mt-0.5">
                            <span className="font-semibold text-green-600 dark:text-green-400 shrink-0">Ans:</span>
                            <span className="text-green-700 dark:text-green-300">{q.correctAnswer}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}
        </DrawerContent>
      </Drawer>

      {/* Payment Confirmation AlertDialog */}
      <AlertDialog open={paymentGameId !== null} onOpenChange={(open) => { if (!open && !paymentProcessing) setPaymentGameId(null); }}>
        <AlertDialogContent className="max-w-[92vw] rounded-xl p-0 gap-0">
          <AlertDialogHeader className="p-4 pb-3 text-center">
            <div className="h-12 w-12 rounded-full bg-amber-500/10 mx-auto mb-2 flex items-center justify-center">
              <Eye className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <AlertDialogTitle className="text-base font-bold">View Quiz Questions</AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-muted-foreground">
              This is a premium feature. A one-time fee will be charged to your Mobi Wallet.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="px-4 space-y-3 pb-3">
            {/* Fee Card */}
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-center">
              <p className="text-[10px] uppercase tracking-wider text-amber-600 dark:text-amber-400 font-semibold mb-1">Viewing Fee</p>
              <p className="text-2xl font-black text-amber-700 dark:text-amber-300">{formatMobiAmount(questionViewFee)}</p>
              <p className="text-[11px] text-amber-600/70 dark:text-amber-400/70">
                ≈ {formatLocalAmount(localFee.toAmount, "NGN")}
              </p>
            </div>

            {/* Wallet Balance Card */}
            <div className="p-3 rounded-xl bg-muted/50 border border-border/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wallet className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-[10px] text-muted-foreground">Wallet Balance</p>
                    <p className="text-sm font-bold">{formatMobiAmount(walletBalance.mobi)}</p>
                  </div>
                </div>
                <Badge
                  variant="secondary"
                  className={cn(
                    "text-[10px] px-2 py-0.5",
                    hasSufficientFunds
                      ? "bg-green-500/10 text-green-700 dark:text-green-300 border-green-500/20"
                      : "bg-destructive/10 text-destructive border-destructive/20"
                  )}
                >
                  {hasSufficientFunds ? (
                    <><CheckCircle2 className="h-3 w-3 mr-1" />Sufficient</>
                  ) : (
                    <><AlertTriangle className="h-3 w-3 mr-1" />Insufficient</>
                  )}
                </Badge>
              </div>
            </div>

            {/* Insufficient Funds Warning */}
            {!hasSufficientFunds && (
              <div className="p-3 rounded-xl bg-destructive/5 border border-destructive/20">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-destructive">Insufficient Funds</p>
                    <p className="text-[11px] text-destructive/80 mt-0.5">
                      Top up your wallet with at least {formatMobiAmount(questionViewFee - walletBalance.mobi)} more to access this feature.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <AlertDialogFooter className="flex-col gap-2 p-4 pt-1 sm:flex-col">
            <Button
              onClick={handlePayAndView}
              disabled={!hasSufficientFunds || paymentProcessing}
              className="w-full min-h-[44px] bg-green-600 hover:bg-green-700 text-white touch-manipulation"
            >
              {paymentProcessing ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Processing Payment...</>
              ) : (
                <><Coins className="h-4 w-4 mr-2 shrink-0" />Pay {formatMobiAmount(questionViewFee)} & View Questions</>
              )}
            </Button>
            <AlertDialogCancel
              disabled={paymentProcessing}
              className="w-full min-h-[44px] mt-0 touch-manipulation"
            >
              Cancel
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
