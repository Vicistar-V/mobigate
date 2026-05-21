import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input }  from "@/components/ui/input";
import { Label }  from "@/components/ui/label";
import { Loader2, Eye, EyeOff, Mail, KeyRound, ArrowLeft, CheckCircle2 } from "lucide-react";

const API_BASE = (import.meta.env.VITE_API_URL as string) || "/api";

type Screen = "login" | "register" | "reg-otp";

export const LoginModal = () => {
  const { login }    = useAuth();
  const [screen, setScreen] = useState<Screen>("login");

  // Login fields
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPw,   setShowPw]   = useState(false);

  // Register fields
  const [regName,  setRegName]  = useState("");
  const [regUser,  setRegUser]  = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPass,  setRegPass]  = useState("");
  const [showRPw,  setShowRPw]  = useState(false);

  // OTP fields
  const [otp,         setOtp]         = useState("");
  const [otpSending,  setOtpSending]  = useState(false);
  const [otpSent,     setOtpSent]     = useState(false);
  const [devOtp,      setDevOtp]      = useState(""); // remove in production

  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [success,  setSuccess]  = useState("");

  const clearErrors = () => { setError(""); setSuccess(""); };

  // ── Login ──────────────────────────────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setLoading(true);
    const r = await login(email, password);
    setLoading(false);
    if (!r.success) setError(r.error || "Login failed.");
  };

  // ── Step 1: Send OTP for registration ─────────────────────────────────────
  const handleSendRegOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    if (!regName || !regUser || !regEmail || !regPass) { setError("Please fill in all fields."); return; }
    if (regPass.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (!regEmail.includes("@")) { setError("Please enter a valid email address."); return; }

    setOtpSending(true);
    try {
      const res  = await fetch(`${API_BASE}/auth/send_otp.php`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: regEmail, type: "verify" }),
      });
      const data = await res.json();
      if (data.success) {
        setOtpSent(true);
        setScreen("reg-otp");
        setSuccess(`Verification code sent to ${regEmail}`);
        if (data.dev_otp) setDevOtp(data.dev_otp); // dev only
      } else {
        setError(data.error || "Could not send OTP.");
      }
    } catch { setError("Cannot reach server."); }
    setOtpSending(false);
  };

  // ── Step 2: Verify OTP and complete registration ───────────────────────────
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    if (!otp || otp.length !== 6) { setError("Please enter the 6-digit OTP from your email."); return; }
    setLoading(true);
    try {
      const res  = await fetch(`${API_BASE}/auth/register.php`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: regName, username: regUser,
          email: regEmail,    password: regPass,
          otp_code: otp,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        // Registration successful — log in
        await login(regEmail, regPass);
      } else {
        setError(data.error || "Registration failed.");
      }
    } catch { setError("Cannot reach server."); }
    setLoading(false);
  };

  // ── Resend OTP ─────────────────────────────────────────────────────────────
  const handleResendOtp = async () => {
    clearErrors();
    setOtpSending(true);
    try {
      const res  = await fetch(`${API_BASE}/auth/send_otp.php`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: regEmail, type: "verify" }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess("New OTP sent!");
        if (data.dev_otp) setDevOtp(data.dev_otp);
      } else {
        setError(data.error || "Could not resend OTP.");
      }
    } catch { setError("Cannot reach server."); }
    setOtpSending(false);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4">
      <div className="bg-card w-full max-w-md rounded-2xl shadow-2xl border overflow-hidden">

        {/* Header */}
        <div className="bg-primary px-6 py-6 text-center">
          <h1 className="text-2xl font-bold text-primary-foreground">Mobigate</h1>
          <p className="text-primary-foreground/80 text-sm mt-1">Connect, share and earn</p>
        </div>

        {/* Tab bar — only for login/register screens */}
        {screen !== "reg-otp" && (
          <div className="flex border-b">
            <button onClick={() => { setScreen("login"); clearErrors(); }}
              className={`flex-1 py-3 text-sm font-semibold transition-colors ${screen==="login" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"}`}>
              Log In
            </button>
            <button onClick={() => { setScreen("register"); clearErrors(); }}
              className={`flex-1 py-3 text-sm font-semibold transition-colors ${screen==="register" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"}`}>
              Register
            </button>
          </div>
        )}

        <div className="p-6">
          {/* Alerts */}
          {error   && <div className="mb-4 rounded-md bg-destructive/10 border border-destructive/20 px-3 py-2 text-sm text-destructive">{error}</div>}
          {success && <div className="mb-4 rounded-md bg-emerald-50 border border-emerald-200 px-3 py-2 text-sm text-emerald-700 flex items-center gap-2"><CheckCircle2 className="h-4 w-4 shrink-0" />{success}</div>}

          {/* ── LOGIN ── */}
          {screen === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} disabled={loading} />
              </div>
              <div className="space-y-1.5">
                <Label>Password</Label>
                <div className="relative">
                  <Input type={showPw ? "text" : "password"} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} disabled={loading} className="pr-10" />
                  <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" tabIndex={-1}>
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <button type="button" onClick={() => { window.location.href = "/forgot-password"; }}
                className="text-sm text-primary hover:underline block text-right w-full">
                Forgot password?
              </button>
              <Button type="submit" className="w-full" disabled={loading} size="lg">
                {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          )}

          {/* ── REGISTER — Step 1: Fill details ── */}
          {screen === "register" && (
            <form onSubmit={handleSendRegOtp} className="space-y-3">
              <div className="space-y-1.5"><Label>Full name *</Label>
                <Input placeholder="John Doe" value={regName} onChange={e => setRegName(e.target.value)} disabled={otpSending} />
              </div>
              <div className="space-y-1.5"><Label>Username *</Label>
                <Input placeholder="johndoe" value={regUser} onChange={e => setRegUser(e.target.value.toLowerCase().replace(/\s/g,""))} disabled={otpSending} />
              </div>
              <div className="space-y-1.5"><Label>Email *</Label>
                <Input type="email" placeholder="you@example.com" value={regEmail} onChange={e => setRegEmail(e.target.value)} disabled={otpSending} />
              </div>
              <div className="space-y-1.5">
                <Label>Password * (min 8 chars)</Label>
                <div className="relative">
                  <Input type={showRPw ? "text" : "password"} placeholder="••••••••" value={regPass} onChange={e => setRegPass(e.target.value)} disabled={otpSending} className="pr-10" />
                  <button type="button" onClick={() => setShowRPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" tabIndex={-1}>
                    {showRPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full mt-2" disabled={otpSending} size="lg">
                {otpSending ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Sending OTP...</> : <><Mail className="h-4 w-4 mr-2" />Send Verification Code</>}
              </Button>
            </form>
          )}

          {/* ── REGISTER — Step 2: Enter OTP ── */}
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

              {/* Dev OTP helper — remove in production */}
              {devOtp && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2 text-sm text-yellow-800">
                  <strong>Dev mode OTP:</strong> {devOtp}
                </div>
              )}

              <div className="space-y-1.5">
                <Label>6-Digit Verification Code</Label>
                <Input
                  placeholder="000000"
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g,"").substring(0,6))}
                  className="text-center text-2xl tracking-widest font-mono h-14"
                  maxLength={6}
                  inputMode="numeric"
                  disabled={loading}
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading || otp.length !== 6} size="lg">
                {loading ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Verifying...</> : <><KeyRound className="h-4 w-4 mr-2" />Verify & Create Account</>}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                Didn't receive it?{" "}
                <button type="button" onClick={handleResendOtp} disabled={otpSending}
                  className="text-primary hover:underline font-medium">
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