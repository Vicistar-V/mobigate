import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import mobifaceLogo from "@/assets/mobiface-logo.png";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Loader2, Eye, EyeOff, Mail, KeyRound, ArrowLeft,
  CheckCircle2, Phone, AtSign, AlertCircle, X, Check,
  Vote, Landmark, CalendarDays, HeartHandshake,
} from "lucide-react";

const API_BASE = (import.meta.env.VITE_API_URL as string) || "/api";

type Screen = "login" | "register" | "reg-otp";
type UsernameState = "idle" | "checking" | "available" | "taken";

function detectIdentifierType(val: string): "email" | "phone" | "username" {
  if (val.includes("@")) return "email";
  if (/^\+[\d\s\-()]{5,}$/.test(val) || /^[\d\s\-()]{7,}$/.test(val)) return "phone";
  return "username";
}

function identifierPlaceholder(type: "email" | "phone" | "username") {
  if (type === "email") return "you@example.com";
  if (type === "phone") return "+234-806-408-9171";
  return "johndoe";
}

// What this platform actually does — rotates in the branded panel
const PILLARS = [
  { icon: Vote, label: "Run elections your members trust", detail: "Nominations, accreditation, and results — all transparent." },
  { icon: Landmark, label: "Keep community funds accountable", detail: "Dues, levies, and ledgers everyone can see." },
  { icon: CalendarDays, label: "Never lose a resolution again", detail: "Minutes, attendance, and votes, permanently on record." },
  { icon: HeartHandshake, label: "Raise support when it matters", detail: "Fundraisers your whole community can back." },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();
  const referralCode = (searchParams.get("ref") || "").trim();
  const [screen, setScreen] = useState<Screen>(referralCode ? "register" : "login");
  const [pillarIndex, setPillarIndex] = useState(0);

  const [identifier, setIdentifier] = useState("");
  const [identType, setIdentType] = useState<"email" | "phone" | "username">("email");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);

  const [regName, setRegName] = useState("");
  const [regUser, setRegUser] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPass, setRegPass] = useState("");
  const [showRPw, setShowRPw] = useState(false);

  const [usernameState, setUsernameState] = useState<UsernameState>("idle");
  const [usernameSuggestions, setUsernameSuggestions] = useState<string[]>([]);
  const usernameTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [emailTaken, setEmailTaken] = useState(false);
  const [phoneTaken, setPhoneTaken] = useState(false);
  const emailTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const phoneTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [otp, setOtp] = useState("");
  const [otpSending, setOtpSending] = useState(false);
  const [devOtp, setDevOtp] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const clearErrors = () => { setError(""); setSuccess(""); };

  useEffect(() => {
    if (isAuthenticated) navigate("/", { replace: true });
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const t = setInterval(() => setPillarIndex((i) => (i + 1) % PILLARS.length), 4500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (identifier) setIdentType(detectIdentifierType(identifier));
  }, [identifier]);

  useEffect(() => {
    if (screen !== "register") return;
    const u = regUser.trim();
    if (u.length < 3) { setUsernameState("idle"); setUsernameSuggestions([]); return; }
    setUsernameState("checking");
    if (usernameTimer.current) clearTimeout(usernameTimer.current);
    usernameTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(`${API_BASE}/auth/check_username.php?username=${encodeURIComponent(u)}`, { credentials: "include" });
        const data = await res.json();
        if (data.available) { setUsernameState("available"); setUsernameSuggestions([]); }
        else { setUsernameState("taken"); setUsernameSuggestions(data.suggestions || []); }
      } catch { setUsernameState("idle"); }
    }, 600);
  }, [regUser, screen]);

  useEffect(() => {
    if (screen !== "register" || !regEmail.includes("@")) { setEmailTaken(false); return; }
    if (emailTimer.current) clearTimeout(emailTimer.current);
    emailTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(`${API_BASE}/auth/check_username.php?email=${encodeURIComponent(regEmail)}`, { credentials: "include" });
        const data = await res.json();
        setEmailTaken(!data.available);
      } catch { setEmailTaken(false); }
    }, 700);
  }, [regEmail, screen]);

  useEffect(() => {
    if (screen !== "register" || !regPhone || regPhone.length < 7) { setPhoneTaken(false); return; }
    if (phoneTimer.current) clearTimeout(phoneTimer.current);
    phoneTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(`${API_BASE}/auth/check_username.php?phone=${encodeURIComponent(regPhone)}`, { credentials: "include" });
        const data = await res.json();
        setPhoneTaken(!data.available);
      } catch { setPhoneTaken(false); }
    }, 700);
  }, [regPhone, screen]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    if (!identifier.trim()) { setError("Please enter your email, username or phone number."); return; }
    if (!password) { setError("Please enter your password."); return; }
    const type = detectIdentifierType(identifier);
    if (type === "phone" && !/^\+\d[\d\s\-()]{6,}$/.test(identifier.trim())) {
      setError("Phone number must include country code, e.g. +234-806-408-9171");
      return;
    }
    setLoading(true);
    const r = await login(identifier.trim(), password);
    setLoading(false);
    if (!r.success) setError(r.error || "Login failed. Check your credentials.");
  };

  const handleSendRegOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    if (!regName.trim()) { setError("Please enter your full name."); return; }
    if (!regUser.trim()) { setError("Please enter a username."); return; }
    if (regUser.length < 3) { setError("Username must be at least 3 characters."); return; }
    if (!/^[a-z0-9_.]+$/.test(regUser)) { setError("Username may only contain letters, numbers, underscores and dots."); return; }
    if (usernameState === "taken") { setError("That username is already taken. Please choose another."); return; }
    if (usernameState === "checking") { setError("Please wait — checking username availability..."); return; }
    if (!regEmail.includes("@")) { setError("Please enter a valid email address."); return; }
    if (regPhone && !/^\+\d[\d\s\-()]{6,}$/.test(regPhone.trim())) { setError("Phone must include country code, e.g. +234-806-408-9171"); return; }
    if (regPass.length < 8) { setError("Password must be at least 8 characters."); return; }

    setOtpSending(true);
    try {
      const res = await fetch(`${API_BASE}/auth/send_otp.php`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: regEmail, type: "verify" }),
      });
      const data = await res.json();
      if (data.success) {
        setScreen("reg-otp");
        setSuccess(`Verification code sent to ${regEmail}`);
        if (data.dev_otp) setDevOtp(data.dev_otp);
      } else {
        setError(data.error || "Could not send OTP.");
      }
    } catch { setError("Cannot reach server."); }
    setOtpSending(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    if (!otp || otp.length !== 6) { setError("Enter the 6-digit code from your email."); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/register.php`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: regName.trim(), username: regUser.trim(),
          email: regEmail.trim(), phone: regPhone.trim(),
          password: regPass, otp_code: otp,
          referral_code: referralCode || undefined,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        await login(regEmail.trim(), regPass);
      } else {
        setError(data.error || "Registration failed.");
        if (data.suggestions) {
          setUsernameSuggestions(data.suggestions);
          setUsernameState("taken");
          setScreen("register");
        }
      }
    } catch { setError("Cannot reach server."); }
    setLoading(false);
  };

  const handleResendOtp = async () => {
    clearErrors(); setOtpSending(true);
    try {
      const res = await fetch(`${API_BASE}/auth/send_otp.php`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: regEmail, type: "verify" }),
      });
      const data = await res.json();
      if (data.success) { setSuccess("New OTP sent!"); if (data.dev_otp) setDevOtp(data.dev_otp); }
      else setError(data.error || "Could not resend.");
    } catch { setError("Cannot reach server."); }
    setOtpSending(false);
  };

  const UsernameIcon = () => {
    if (usernameState === "checking") return <Loader2 className="h-4 w-4 animate-spin text-gray-400" />;
    if (usernameState === "available") return <Check className="h-4 w-4 text-emerald-500" />;
    if (usernameState === "taken") return <X className="h-4 w-4 text-red-500" />;
    return null;
  };

  const usernameBorder = usernameState === "available"
    ? "border-emerald-400 focus-visible:ring-emerald-200"
    : usernameState === "taken"
    ? "border-red-400 focus-visible:ring-red-200"
    : "";

  const ActivePillar = PILLARS[pillarIndex].icon;

  return (
    <div className="min-h-screen w-full flex bg-white">
      {/* ── Branded panel (hidden on small screens) ───────────────────────── */}
      <div className="hidden lg:flex lg:w-[46%] relative overflow-hidden bg-[#0b3a78] text-white flex-col justify-between p-12">
        {/* Connection-node pattern signature */}
        <svg className="absolute inset-0 h-full w-full opacity-[0.14]" viewBox="0 0 600 800" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g stroke="white" strokeWidth="1">
            <line x1="60" y1="90" x2="220" y2="180" />
            <line x1="220" y1="180" x2="120" y2="330" />
            <line x1="220" y1="180" x2="400" y2="140" />
            <line x1="400" y1="140" x2="520" y2="260" />
            <line x1="120" y1="330" x2="260" y2="440" />
            <line x1="260" y1="440" x2="460" y2="400" />
            <line x1="460" y1="400" x2="520" y2="260" />
            <line x1="260" y1="440" x2="180" y2="600" />
            <line x1="180" y1="600" x2="360" y2="680" />
            <line x1="360" y1="680" x2="460" y2="400" />
            <line x1="60" y1="90" x2="400" y2="140" />
          </g>
          <g fill="white">
            <circle cx="60" cy="90" r="5" />
            <circle cx="220" cy="180" r="7" />
            <circle cx="120" cy="330" r="5" />
            <circle cx="400" cy="140" r="6" />
            <circle cx="520" cy="260" r="5" />
            <circle cx="260" cy="440" r="8" />
            <circle cx="460" cy="400" r="5" />
            <circle cx="180" cy="600" r="6" />
            <circle cx="360" cy="680" r="5" />
          </g>
        </svg>

        <div className="relative z-10">
          <img src={mobifaceLogo} alt="Mobiface" className="h-11 w-auto object-contain brightness-0 invert" />
        </div>

        <div className="relative z-10 max-w-md">
          <p className="text-sm font-semibold tracking-widest uppercase text-white/60 mb-4">Built for how communities actually run</p>
          <div key={pillarIndex} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="h-11 w-11 rounded-2xl bg-white/10 flex items-center justify-center mb-5">
              <ActivePillar className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-semibold leading-snug mb-2">{PILLARS[pillarIndex].label}</h2>
            <p className="text-white/70 text-sm leading-relaxed">{PILLARS[pillarIndex].detail}</p>
          </div>
          <div className="flex gap-1.5 mt-8">
            {PILLARS.map((_, i) => (
              <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i === pillarIndex ? "w-8 bg-white" : "w-1.5 bg-white/30"}`} />
            ))}
          </div>
        </div>

        <p className="relative z-10 text-xs text-white/40">© {new Date().getFullYear()} Mobiface. Connect, share and earn.</p>
      </div>

      {/* ── Form panel ─────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 sm:px-10">
        <div className="w-full max-w-[400px]">
          {/* Mobile-only compact header */}
          <div className="lg:hidden text-center mb-8">
            <img src={mobifaceLogo} alt="Mobiface" className="mx-auto h-12 w-auto object-contain" />
            <p className="text-gray-400 text-sm font-medium mt-2">Connect, Share and Earn</p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="hidden lg:flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Continue browsing as guest
          </button>

          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            {screen === "reg-otp" ? "Verify your email" : screen === "register" ? "Create your account" : "Welcome back"}
          </h1>
          <p className="text-sm text-gray-400 mb-6">
            {screen === "reg-otp"
              ? "One more step and you're in."
              : screen === "register"
              ? "Join your community on Mobiface."
              : "Sign in to pick up where you left off."}
          </p>

          {referralCode && screen === "register" && (
            <div className="mb-6 rounded-lg bg-primary/10 border border-primary/20 px-3 py-2 text-sm text-primary">
              You're signing up via a friend's invite link.
            </div>
          )}

          {/* Tab switcher */}
          {screen !== "reg-otp" && (
            <div className="flex mb-6 bg-gray-100 rounded-xl p-1">
              <button onClick={() => { setScreen("login"); clearErrors(); }}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${screen === "login" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                Log In
              </button>
              <button onClick={() => { setScreen("register"); clearErrors(); }}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${screen === "register" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                Register
              </button>
            </div>
          )}

          {/* Alerts */}
          {error && <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-3 py-2.5 text-sm text-red-700 flex items-start gap-2"><AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />{error}</div>}
          {success && <div className="mb-4 rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-2.5 text-sm text-emerald-700 flex items-center gap-2"><CheckCircle2 className="h-4 w-4 shrink-0" />{success}</div>}

          {/* ════ LOGIN ════ */}
          {screen === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="font-semibold">Email, Username or Phone</Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {identType === "email" && <Mail className="h-4 w-4" />}
                    {identType === "phone" && <Phone className="h-4 w-4" />}
                    {identType === "username" && <AtSign className="h-4 w-4" />}
                  </div>
                  <Input
                    type={identType === "phone" ? "tel" : "text"}
                    placeholder={identifierPlaceholder(identType)}
                    value={identifier}
                    onChange={e => setIdentifier(e.target.value)}
                    disabled={loading}
                    className="pl-9"
                    autoComplete="username"
                  />
                </div>
                <p className="text-xs text-gray-400">
                  {identType === "phone"
                    ? "Include country code, e.g. +234-806-408-9171"
                    : "You can log in with your email, @username or phone number"}
                </p>
              </div>

              <div className="space-y-1.5">
                <Label className="font-semibold">Password</Label>
                <div className="relative">
                  <Input type={showPw ? "text" : "password"} placeholder="••••••••"
                    value={password} onChange={e => setPassword(e.target.value)}
                    disabled={loading} className="pr-10" autoComplete="current-password" />
                  <button type="button" onClick={() => setShowPw(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" tabIndex={-1}>
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button type="button" onClick={() => navigate("/forgot-password")}
                className="text-sm text-primary hover:underline block text-right w-full">
                Forgot password?
              </button>

              <Button type="submit" className="w-full" disabled={loading} size="lg">
                {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                {loading ? "Signing in..." : "Sign In"}
              </Button>

              <button
                type="button"
                onClick={() => navigate("/")}
                className="lg:hidden w-full text-center text-sm text-muted-foreground hover:text-foreground mt-2"
              >
                Continue browsing as guest
              </button>
            </form>
          )}

          {/* ════ REGISTER ════ */}
          {screen === "register" && (
            <form onSubmit={handleSendRegOtp} className="space-y-3">
              <div className="space-y-1.5">
                <Label className="font-semibold">Full Name *</Label>
                <Input placeholder="e.g. Anthony Okafor" value={regName}
                  onChange={e => setRegName(e.target.value)} disabled={otpSending} />
              </div>

              <div className="space-y-1.5">
                <Label className="font-semibold">
                  Username * <span className="text-xs text-gray-400 font-normal">(Unique — your PUI)</span>
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">@</span>
                  <Input
                    placeholder="johndoe"
                    value={regUser}
                    onChange={e => setRegUser(e.target.value.toLowerCase().replace(/[^a-z0-9_.]/g, ""))}
                    disabled={otpSending}
                    className={`pl-7 pr-9 ${usernameBorder}`}
                    maxLength={30}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <UsernameIcon />
                  </div>
                </div>

                {usernameState === "available" && (
                  <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                    <Check className="h-3 w-3" />@{regUser} is available!
                  </p>
                )}
                {usernameState === "taken" && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-2.5">
                    <p className="text-xs text-red-600 font-semibold mb-1.5 flex items-center gap-1">
                      <X className="h-3 w-3" />@{regUser} is already taken. Try one of these:
                    </p>
                    {usernameSuggestions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {usernameSuggestions.map(s => (
                          <button key={s} type="button"
                            onClick={() => { setRegUser(s); setUsernameState("idle"); setUsernameSuggestions([]); }}
                            className="text-xs bg-white border border-red-200 text-red-700 hover:bg-red-600 hover:text-white hover:border-red-600 rounded-lg px-2.5 py-1 font-semibold transition-all">
                            @{s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                {usernameState === "idle" && regUser.length > 0 && regUser.length < 3 && (
                  <p className="text-xs text-gray-400">At least 3 characters required</p>
                )}
                <p className="text-xs text-gray-400">Letters, numbers, underscores and dots only. No spaces.</p>
              </div>

              <div className="space-y-1.5">
                <Label className="font-semibold">Email Address *</Label>
                <div className="relative">
                  <Input type="email" placeholder="you@example.com" value={regEmail}
                    onChange={e => { setRegEmail(e.target.value); setEmailTaken(false); }}
                    disabled={otpSending}
                    className={emailTaken ? "border-red-400 focus-visible:ring-red-200" : ""} />
                  {emailTaken && <X className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-red-500" />}
                  {!emailTaken && regEmail.includes("@") && regEmail.length > 5 && <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />}
                </div>
                {emailTaken && (
                  <p className="text-xs text-red-600 font-semibold flex items-center gap-1">
                    <X className="h-3 w-3" />This email is already linked to a Mobiface account.
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label className="font-semibold">
                  Phone Number <span className="text-xs text-gray-400 font-normal">(optional — with country code)</span>
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="tel" placeholder="+234-806-408-9171"
                    value={regPhone} onChange={e => setRegPhone(e.target.value)}
                    disabled={otpSending} className="pl-9"
                  />
                </div>
                {phoneTaken && (
                  <p className="text-xs text-red-600 font-semibold flex items-center gap-1">
                    <X className="h-3 w-3" />This phone number is already linked to a Mobiface account.
                  </p>
                )}
                {!phoneTaken && regPhone.length > 7 && (
                  <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                    <Check className="h-3 w-3" />Phone number available
                  </p>
                )}
                <p className="text-xs text-gray-400">Include country code. Enables phone number login.</p>
              </div>

              <div className="space-y-1.5">
                <Label className="font-semibold">Password * <span className="text-xs text-gray-400 font-normal">(min 8 chars)</span></Label>
                <div className="relative">
                  <Input type={showRPw ? "text" : "password"} placeholder="••••••••"
                    value={regPass} onChange={e => setRegPass(e.target.value)}
                    disabled={otpSending} className="pr-10" />
                  <button type="button" onClick={() => setShowRPw(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" tabIndex={-1}>
                    {showRPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full mt-2" disabled={otpSending || usernameState === "taken" || usernameState === "checking" || emailTaken || phoneTaken} size="lg">
                {otpSending
                  ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Sending code...</>
                  : <><Mail className="h-4 w-4 mr-2" />Send Verification Code</>}
              </Button>

              <button
                type="button"
                onClick={() => navigate("/")}
                className="lg:hidden w-full text-center text-sm text-muted-foreground hover:text-foreground mt-1"
              >
                Continue browsing as guest
              </button>
            </form>
          )}

          {/* ════ OTP STEP ════ */}
          {screen === "reg-otp" && (
            <form onSubmit={handleRegister} className="space-y-4">
              <button type="button" onClick={() => { setScreen("register"); clearErrors(); setOtp(""); }}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-2">
                <ArrowLeft className="h-4 w-4" />Back
              </button>
              <div className="text-center space-y-1 mb-2">
                <Mail className="h-10 w-10 text-primary mx-auto" />
                <h3 className="font-semibold text-lg">Check your email</h3>
                <p className="text-sm text-muted-foreground">
                  We sent a 6-digit code to <span className="font-medium text-foreground">{regEmail}</span>
                </p>
              </div>
              {devOtp && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2 text-sm text-yellow-800">
                  <strong>Dev OTP:</strong> {devOtp}
                </div>
              )}
              <div className="space-y-1.5">
                <Label>6-Digit Verification Code</Label>
                <Input placeholder="000000" value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, "").substring(0, 6))}
                  className="text-center text-2xl tracking-widest font-mono h-14"
                  maxLength={6} inputMode="numeric" disabled={loading} />
              </div>
              <Button type="submit" className="w-full" disabled={loading || otp.length !== 6} size="lg">
                {loading ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Verifying...</> : <><KeyRound className="h-4 w-4 mr-2" />Verify & Create Account</>}
              </Button>
              <div className="text-center text-sm text-muted-foreground">
                Didn't receive it?{" "}
                <button type="button" onClick={handleResendOtp} disabled={otpSending}
                  className="text-primary hover:underline font-medium disabled:opacity-50">
                  {otpSending ? "Sending..." : "Resend code"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
