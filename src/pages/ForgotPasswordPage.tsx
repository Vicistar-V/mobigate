/**
 * ForgotPasswordPage.tsx
 * Route: /forgot-password
 *
 * Step 1: Enter email → sends OTP
 * Step 2: Enter OTP → verifies, gets reset_token
 * Step 3: Enter new password → resets password
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLogo } from "@/components/AppLogo";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input }  from "@/components/ui/input";
import { Label }  from "@/components/ui/label";
import {
  Mail, KeyRound, Lock, Loader2, Eye, EyeOff,
  ArrowLeft, CheckCircle2, ShieldCheck,
} from "lucide-react";

const API_BASE = (import.meta.env.VITE_API_URL as string) || "/api";

type Step = "email" | "otp" | "newpass" | "done";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();

  const [step,       setStep]       = useState<Step>("email");
  const [email,      setEmail]      = useState("");
  const [otp,        setOtp]        = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPass,    setNewPass]    = useState("");
  const [confirmPass,setConfirmPass]= useState("");
  const [showPw,     setShowPw]     = useState(false);
  const [showCPw,    setShowCPw]    = useState(false);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState("");
  const [success,    setSuccess]    = useState("");
  const [devOtp,     setDevOtp]     = useState("");

  const clearAlerts = () => { setError(""); setSuccess(""); };

  // ── Step 1: Send OTP ───────────────────────────────────────────────────────
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAlerts();
    if (!email || !email.includes("@")) { setError("Please enter a valid email address."); return; }
    setLoading(true);
    try {
      const res  = await fetch(`${API_BASE}/auth/send_otp.php`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, type: "reset" }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(`OTP sent to ${email}. Check your inbox and spam folder.`);
        setStep("otp");
        if (data.dev_otp) setDevOtp(data.dev_otp);
      } else {
        setError(data.error || "Could not send OTP.");
      }
    } catch { setError("Cannot reach server. Please try again."); }
    setLoading(false);
  };

  // ── Step 2: Verify OTP ─────────────────────────────────────────────────────
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAlerts();
    if (!otp || otp.length !== 6) { setError("Please enter the 6-digit OTP."); return; }
    setLoading(true);
    try {
      const res  = await fetch(`${API_BASE}/auth/verify_otp.php`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: otp, type: "reset" }),
      });
      const data = await res.json();
      if (data.success) {
        setResetToken(data.reset_token);
        setStep("newpass");
        setSuccess("OTP verified! Now set your new password.");
      } else {
        setError(data.error || "Invalid OTP.");
      }
    } catch { setError("Cannot reach server."); }
    setLoading(false);
  };

  // ── Step 3: Set new password ───────────────────────────────────────────────
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAlerts();
    if (newPass.length < 8)         { setError("Password must be at least 8 characters."); return; }
    if (newPass !== confirmPass)    { setError("Passwords do not match."); return; }
    setLoading(true);
    try {
      const res  = await fetch(`${API_BASE}/auth/reset_password.php`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, reset_token: resetToken, new_password: newPass }),
      });
      const data = await res.json();
      if (data.success) {
        setStep("done");
      } else {
        setError(data.error || "Could not reset password.");
      }
    } catch { setError("Cannot reach server."); }
    setLoading(false);
  };

  // ── Resend OTP ─────────────────────────────────────────────────────────────
  const handleResend = async () => {
    clearAlerts();
    setLoading(true);
    try {
      const res  = await fetch(`${API_BASE}/auth/send_otp.php`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, type: "reset" }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess("New OTP sent!");
        if (data.dev_otp) setDevOtp(data.dev_otp);
      } else {
        setError(data.error || "Could not resend OTP.");
      }
    } catch { setError("Cannot reach server."); }
    setLoading(false);
  };

  const stepLabels = ["Email", "Verify OTP", "New Password"];
  const stepIndex  = step === "email" ? 0 : step === "otp" ? 1 : 2;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-6">
          <button onClick={async () => {
              try { await fetch(`${API_BASE}/auth/logout.php`, { method: "POST", credentials: "include" }); } catch {}
              window.location.href = "/";
            }}
            className="inline-block bg-transparent border-none cursor-pointer hover:opacity-80 transition-opacity">
            <AppLogo
              height={56}
              maxWidth={200}
              textClassName="font-black text-4xl tracking-tight text-gray-900"
              showTagline={true}
              taglineClassName="text-gray-400 text-sm mt-1"
              className="flex flex-col items-center"
            />
          </button>
          <p className="text-muted-foreground text-xs mt-3 font-semibold uppercase tracking-widest">Password Recovery</p>
        </div>

        <Card className="overflow-hidden shadow-xl">
          {/* Progress steps */}
          {step !== "done" && (
            <div className="flex border-b">
              {stepLabels.map((label, i) => (
                <div key={i} className={`flex-1 py-2.5 text-center text-xs font-medium transition-colors ${
                  i === stepIndex ? "bg-primary/10 text-primary border-b-2 border-primary" :
                  i < stepIndex  ? "text-emerald-600" : "text-muted-foreground"
                }`}>
                  {i < stepIndex ? "✓ " : `${i+1}. `}{label}
                </div>
              ))}
            </div>
          )}

          <div className="p-6">
            {/* Alerts */}
            {error   && <div className="mb-4 rounded-lg bg-destructive/10 border border-destructive/20 px-3 py-2 text-sm text-destructive">{error}</div>}
            {success && <div className="mb-4 rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2 text-sm text-emerald-700 flex items-center gap-2"><CheckCircle2 className="h-4 w-4 shrink-0" />{success}</div>}

            {/* ── Step 1: Email ── */}
            {step === "email" && (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="text-center mb-4">
                  <Mail className="h-12 w-12 text-primary mx-auto mb-2" />
                  <h2 className="text-xl font-bold">Forgot Password?</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Enter your email and we'll send you a verification code.
                  </p>
                </div>
                <div className="space-y-1.5">
                  <Label>Email Address</Label>
                  <Input type="email" placeholder="you@example.com" value={email}
                    onChange={e => setEmail(e.target.value)} disabled={loading} />
                </div>
                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                  {loading ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Sending...</> : <><Mail className="h-4 w-4 mr-2" />Send OTP</>}
                </Button>
                <button type="button" onClick={async () => {
                    // Log out if authenticated, then show login modal
                    try {
                      await fetch(`${API_BASE}/auth/logout.php`, { method: "POST", credentials: "include" });
                    } catch {}
                    window.location.href = "/";
                  }}
                  className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground mt-2">
                  <ArrowLeft className="h-4 w-4" />Back to Login
                </button>
              </form>
            )}

            {/* ── Step 2: OTP ── */}
            {step === "otp" && (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="text-center mb-4">
                  <KeyRound className="h-12 w-12 text-primary mx-auto mb-2" />
                  <h2 className="text-xl font-bold">Enter OTP</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    We sent a 6-digit code to <span className="font-medium text-foreground">{email}</span>
                  </p>
                </div>

                {devOtp && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2 text-sm text-yellow-800">
                    <strong>Dev mode OTP:</strong> {devOtp}
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label>6-Digit OTP Code</Label>
                  <Input
                    placeholder="000000"
                    value={otp}
                    onChange={e => setOtp(e.target.value.replace(/\D/g,"").substring(0,6))}
                    className="text-center text-2xl tracking-widest font-mono h-14"
                    maxLength={6}
                    inputMode="numeric"
                    disabled={loading}
                    autoFocus
                  />
                </div>
                <Button type="submit" className="w-full" size="lg" disabled={loading || otp.length !== 6}>
                  {loading ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Verifying...</> : <><ShieldCheck className="h-4 w-4 mr-2" />Verify OTP</>}
                </Button>
                <div className="text-center text-sm text-muted-foreground">
                  Didn't receive it?{" "}
                  <button type="button" onClick={handleResend} disabled={loading} className="text-primary hover:underline font-medium">
                    Resend
                  </button>
                  {" "}or{" "}
                  <button type="button" onClick={() => { setStep("email"); setOtp(""); clearAlerts(); }} className="text-primary hover:underline font-medium">
                    Change email
                  </button>
                </div>
              </form>
            )}

            {/* ── Step 3: New Password ── */}
            {step === "newpass" && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="text-center mb-4">
                  <Lock className="h-12 w-12 text-primary mx-auto mb-2" />
                  <h2 className="text-xl font-bold">Set New Password</h2>
                  <p className="text-sm text-muted-foreground mt-1">Choose a strong password.</p>
                </div>
                <div className="space-y-1.5">
                  <Label>New Password</Label>
                  <div className="relative">
                    <Input type={showPw ? "text" : "password"} placeholder="••••••••" value={newPass}
                      onChange={e => setNewPass(e.target.value)} disabled={loading} className="pr-10" />
                    <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" tabIndex={-1}>
                      {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Confirm Password</Label>
                  <div className="relative">
                    <Input type={showCPw ? "text" : "password"} placeholder="••••••••" value={confirmPass}
                      onChange={e => setConfirmPass(e.target.value)} disabled={loading} className="pr-10" />
                    <button type="button" onClick={() => setShowCPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" tabIndex={-1}>
                      {showCPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {confirmPass && newPass !== confirmPass && (
                    <p className="text-xs text-destructive">Passwords do not match</p>
                  )}
                </div>
                <Button type="submit" className="w-full" size="lg"
                  disabled={loading || newPass.length < 8 || newPass !== confirmPass}>
                  {loading ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Resetting...</> : <><Lock className="h-4 w-4 mr-2" />Reset Password</>}
                </Button>
              </form>
            )}

            {/* ── Done ── */}
            {step === "done" && (
              <div className="text-center space-y-4 py-4">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-9 w-9 text-emerald-600" />
                </div>
                <h2 className="text-xl font-bold">Password Reset!</h2>
                <p className="text-sm text-muted-foreground">
                  Your password has been changed successfully. You can now log in with your new password.
                </p>
                <Button onClick={() => navigate("/")} className="w-full" size="lg">
                  Go to Login
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
