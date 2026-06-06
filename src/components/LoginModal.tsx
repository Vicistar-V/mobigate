import { useState, useEffect, useRef } from "react";
import { useAuth }   from "@/contexts/AuthContext";
import { Button }    from "@/components/ui/button";
import mobifaceLogo  from "@/assets/mobiface-logo.png";
import { Input }     from "@/components/ui/input";
import { Label }     from "@/components/ui/label";
import {
  Loader2, Eye, EyeOff, Mail, KeyRound, ArrowLeft,
  CheckCircle2, Phone, AtSign, AlertCircle, X, Check,
} from "lucide-react";

const API_BASE = (import.meta.env.VITE_API_URL as string) || "/api";

type Screen = "login" | "register" | "reg-otp";

// ── Username availability states
type UsernameState = "idle" | "checking" | "available" | "taken";

// ── Detect what the user typed as identifier
function detectIdentifierType(val: string): "email" | "phone" | "username" {
  if (val.includes("@")) return "email";
  // Phone: starts with + or all digits (possibly with dashes/spaces)
  if (/^\+[\d\s\-()]{5,}$/.test(val) || /^[\d\s\-()]{7,}$/.test(val)) return "phone";
  return "username";
}

function identifierPlaceholder(type: "email" | "phone" | "username") {
  if (type === "email")    return "you@example.com";
  if (type === "phone")    return "+234-806-408-9171";
  return "johndoe";
}

export const LoginModal = ({ onClose }: { onClose?: () => void }) => {
  const { login } = useAuth();
  const [screen, setScreen] = useState<Screen>("login");

  // ── Login
  const [identifier, setIdentifier] = useState("");
  const [identType,  setIdentType]  = useState<"email"|"phone"|"username">("email");
  const [password,   setPassword]   = useState("");
  const [showPw,     setShowPw]     = useState(false);

  // ── Register
  const [regName,    setRegName]    = useState("");
  const [regUser,    setRegUser]    = useState("");
  const [regPhone,   setRegPhone]   = useState("");
  const [regEmail,   setRegEmail]   = useState("");
  const [regPass,    setRegPass]    = useState("");
  const [showRPw,    setShowRPw]    = useState(false);

  // ── Username availability check
  const [usernameState,    setUsernameState]    = useState<UsernameState>("idle");
  const [usernameSuggestions, setUsernameSuggestions] = useState<string[]>([]);
  const usernameTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // ── Email / phone availability check
  const [emailTaken,  setEmailTaken]  = useState(false);
  const [phoneTaken,  setPhoneTaken]  = useState(false);
  const emailTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const phoneTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── OTP
  const [otp,        setOtp]        = useState("");
  const [otpSending, setOtpSending] = useState(false);
  const [devOtp,     setDevOtp]     = useState("");

  // ── Status
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [success,  setSuccess]  = useState("");

  const clearErrors = () => { setError(""); setSuccess(""); };

  // Detect identifier type as user types
  useEffect(() => {
    if (identifier) setIdentType(detectIdentifierType(identifier));
  }, [identifier]);

  // ── Username availability check (debounced 600ms)
  useEffect(() => {
    if (screen !== "register") return;
    const u = regUser.trim();
    if (u.length < 3) { setUsernameState("idle"); setUsernameSuggestions([]); return; }

    setUsernameState("checking");
    if (usernameTimer.current) clearTimeout(usernameTimer.current);
    usernameTimer.current = setTimeout(async () => {
      try {
        const res  = await fetch(`${API_BASE}/auth/check_username.php?username=${encodeURIComponent(u)}`, { credentials: "include" });
        const data = await res.json();
        if (data.available) {
          setUsernameState("available");
          setUsernameSuggestions([]);
        } else {
          setUsernameState("taken");
          setUsernameSuggestions(data.suggestions || []);
        }
      } catch {
        setUsernameState("idle");
      }
    }, 600);
  }, [regUser, screen]);

  // ── Email availability check ───────────────────────────────────────────────
  useEffect(() => {
    if (screen !== "register" || !regEmail.includes("@")) { setEmailTaken(false); return; }
    if (emailTimer.current) clearTimeout(emailTimer.current);
    emailTimer.current = setTimeout(async () => {
      try {
        const res  = await fetch(`${API_BASE}/auth/check_username.php?email=${encodeURIComponent(regEmail)}`, { credentials: "include" });
        const data = await res.json();
        setEmailTaken(!data.available);
      } catch { setEmailTaken(false); }
    }, 700);
  }, [regEmail, screen]);

  // ── Phone availability check ────────────────────────────────────────────────
  useEffect(() => {
    if (screen !== "register" || !regPhone || regPhone.length < 7) { setPhoneTaken(false); return; }
    if (phoneTimer.current) clearTimeout(phoneTimer.current);
    phoneTimer.current = setTimeout(async () => {
      try {
        const res  = await fetch(`${API_BASE}/auth/check_username.php?phone=${encodeURIComponent(regPhone)}`, { credentials: "include" });
        const data = await res.json();
        setPhoneTaken(!data.available);
      } catch { setPhoneTaken(false); }
    }, 700);
  }, [regPhone, screen]);

  // ── Login ──────────────────────────────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    if (!identifier.trim()) { setError("Please enter your email, username or phone number."); return; }
    if (!password)           { setError("Please enter your password."); return; }

    // Validate phone format if phone login
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

  // ── Step 1: Validate + send OTP ────────────────────────────────────────────
  const handleSendRegOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();

    if (!regName.trim())  { setError("Please enter your full name."); return; }
    if (!regUser.trim())  { setError("Please enter a username."); return; }
    if (regUser.length < 3) { setError("Username must be at least 3 characters."); return; }
    if (!/^[a-z0-9_.]+$/.test(regUser)) {
      setError("Username may only contain letters, numbers, underscores and dots."); return;
    }
    if (usernameState === "taken") {
      setError("That username is already taken. Please choose another."); return;
    }
    if (usernameState === "checking") {
      setError("Please wait — checking username availability..."); return;
    }
    if (!regEmail.includes("@")) { setError("Please enter a valid email address."); return; }
    if (regPhone && !/^\+\d[\d\s\-()]{6,}$/.test(regPhone.trim())) {
      setError("Phone must include country code, e.g. +234-806-408-9171"); return;
    }
    if (regPass.length < 8) { setError("Password must be at least 8 characters."); return; }

    setOtpSending(true);
    try {
      const res  = await fetch(`${API_BASE}/auth/send_otp.php`, {
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

  // ── Step 2: Verify OTP + create account ────────────────────────────────────
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    if (!otp || otp.length !== 6) { setError("Enter the 6-digit code from your email."); return; }
    setLoading(true);
    try {
      const res  = await fetch(`${API_BASE}/auth/register.php`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: regName.trim(), username: regUser.trim(),
          email: regEmail.trim(),   phone: regPhone.trim(),
          password: regPass,        otp_code: otp,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        await login(regEmail.trim(), regPass);
      } else {
        setError(data.error || "Registration failed.");
        // If server says username taken, surface it
        if (data.suggestions) {
          setUsernameSuggestions(data.suggestions);
          setUsernameState("taken");
          setScreen("register");
        }
      }
    } catch { setError("Cannot reach server."); }
    setLoading(false);
  };

  // ── Resend OTP ─────────────────────────────────────────────────────────────
  const handleResendOtp = async () => {
    clearErrors(); setOtpSending(true);
    try {
      const res  = await fetch(`${API_BASE}/auth/send_otp.php`, {
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

  // ── Username field UI helper ───────────────────────────────────────────────
  const UsernameIcon = () => {
    if (usernameState === "checking")  return <Loader2  className="h-4 w-4 animate-spin text-gray-400" />;
    if (usernameState === "available") return <Check    className="h-4 w-4 text-emerald-500" />;
    if (usernameState === "taken")     return <X        className="h-4 w-4 text-red-500" />;
    return null;
  };

  const usernameBorder = usernameState === "available"
    ? "border-emerald-400 focus-visible:ring-emerald-200"
    : usernameState === "taken"
    ? "border-red-400 focus-visible:ring-red-200"
    : "";

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-gray-100 max-h-[95vh] overflow-y-auto">

        {/* ── HEADER ── */}
        <div className="px-8 pt-10 pb-6 text-center bg-white">
          <AppLogo
            height={64} maxWidth={240}
            textClassName="font-black text-4xl tracking-tight text-gray-900"
            showTagline={true} taglineClassName="text-gray-400 text-sm font-medium mt-2"
            className="flex flex-col items-center"
          />
        </div>

        {/* Tab switcher */}
        {screen !== "reg-otp" && (
          <div className="flex mx-6 mb-2 bg-gray-100 rounded-xl p-1">
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

        <div className="px-6 pb-8">
          {/* Alerts */}
          {error   && <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-3 py-2.5 text-sm text-red-700 flex items-start gap-2"><AlertCircle className="h-4 w-4 shrink-0 mt-0.5"/>{error}</div>}
          {success && <div className="mb-4 rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-2.5 text-sm text-emerald-700 flex items-center gap-2"><CheckCircle2 className="h-4 w-4 shrink-0"/>{success}</div>}

          {/* ════ LOGIN ════ */}
          {screen === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="font-semibold">Email, Username or Phone</Label>
                <div className="relative">
                  {/* Icon showing type */}
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {identType === "email"  && <Mail    className="h-4 w-4"/>}
                    {identType === "phone"  && <Phone   className="h-4 w-4"/>}
                    {identType === "username" && <AtSign className="h-4 w-4"/>}
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
                {/* Hint */}
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
                    disabled={loading} className="pr-10" autoComplete="current-password"/>
                  <button type="button" onClick={() => setShowPw(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" tabIndex={-1}>
                    {showPw ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
                  </button>
                </div>
              </div>

              <button type="button" onClick={() => { window.location.href = "/forgot-password"; }}
                className="text-sm text-primary hover:underline block text-right w-full">
                Forgot password?
              </button>

              <Button type="submit" className="w-full" disabled={loading} size="lg">
                {loading && <Loader2 className="h-4 w-4 animate-spin mr-2"/>}
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          )}

          {/* ════ REGISTER ════ */}
          {screen === "register" && (
            <form onSubmit={handleSendRegOtp} className="space-y-3">
              <div className="space-y-1.5">
                <Label className="font-semibold">Full Name *</Label>
                <Input placeholder="e.g. Anthony Okafor" value={regName}
                  onChange={e => setRegName(e.target.value)} disabled={otpSending}/>
              </div>

              {/* Username with live availability check */}
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
                    <UsernameIcon/>
                  </div>
                </div>

                {/* Availability feedback */}
                {usernameState === "available" && (
                  <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                    <Check className="h-3 w-3"/>@{regUser} is available!
                  </p>
                )}
                {usernameState === "taken" && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-2.5">
                    <p className="text-xs text-red-600 font-semibold mb-1.5 flex items-center gap-1">
                      <X className="h-3 w-3"/>@{regUser} is already taken. Try one of these:
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
                    className={emailTaken ? "border-red-400 focus-visible:ring-red-200" : ""}/>
                  {emailTaken && <X className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-red-500"/>}
                  {!emailTaken && regEmail.includes("@") && regEmail.length > 5 && <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500"/>}
                </div>
                {emailTaken && (
                  <p className="text-xs text-red-600 font-semibold flex items-center gap-1">
                    <X className="h-3 w-3"/>This email is already linked to a Mobiface account.
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label className="font-semibold">
                  Phone Number <span className="text-xs text-gray-400 font-normal">(optional — with country code)</span>
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"/>
                  <Input
                    type="tel" placeholder="+234-806-408-9171"
                    value={regPhone} onChange={e => setRegPhone(e.target.value)}
                    disabled={otpSending} className="pl-9"
                  />
                </div>
                {phoneTaken && (
                  <p className="text-xs text-red-600 font-semibold flex items-center gap-1">
                    <X className="h-3 w-3"/>This phone number is already linked to a Mobiface account.
                  </p>
                )}
                {!phoneTaken && regPhone.length > 7 && (
                  <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                    <Check className="h-3 w-3"/>Phone number available
                  </p>
                )}
                <p className="text-xs text-gray-400">Include country code. Enables phone number login.</p>
              </div>

              <div className="space-y-1.5">
                <Label className="font-semibold">Password * <span className="text-xs text-gray-400 font-normal">(min 8 chars)</span></Label>
                <div className="relative">
                  <Input type={showRPw ? "text" : "password"} placeholder="••••••••"
                    value={regPass} onChange={e => setRegPass(e.target.value)}
                    disabled={otpSending} className="pr-10"/>
                  <button type="button" onClick={() => setShowRPw(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" tabIndex={-1}>
                    {showRPw ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full mt-2" disabled={otpSending || usernameState === "taken" || usernameState === "checking" || emailTaken || phoneTaken} size="lg">
                {otpSending
                  ? <><Loader2 className="h-4 w-4 animate-spin mr-2"/>Sending code...</>
                  : <><Mail className="h-4 w-4 mr-2"/>Send Verification Code</>}
              </Button>
            </form>
          )}

          {/* ════ OTP STEP ════ */}
          {screen === "reg-otp" && (
            <form onSubmit={handleRegister} className="space-y-4">
              <button type="button" onClick={() => { setScreen("register"); clearErrors(); setOtp(""); }}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-2">
                <ArrowLeft className="h-4 w-4"/>Back
              </button>
              <div className="text-center space-y-1 mb-2">
                <Mail className="h-10 w-10 text-primary mx-auto"/>
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
                  onChange={e => setOtp(e.target.value.replace(/\D/g,"").substring(0,6))}
                  className="text-center text-2xl tracking-widest font-mono h-14"
                  maxLength={6} inputMode="numeric" disabled={loading}/>
              </div>
              <Button type="submit" className="w-full" disabled={loading || otp.length !== 6} size="lg">
                {loading ? <><Loader2 className="h-4 w-4 animate-spin mr-2"/>Verifying...</> : <><KeyRound className="h-4 w-4 mr-2"/>Verify & Create Account</>}
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
};
