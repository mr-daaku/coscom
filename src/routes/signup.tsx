import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { Mail, Lock, User, Send, Check, AlertCircle, Eye, EyeOff } from "lucide-react";
import SpotlightBackground from "@/components/SpotlightBackground";

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M23.75,16A7.7446,7.7446,0,0,1,8.7177,18.6259L4.2849,22.1721A13.244,13.244,0,0,0,29.25,16" fill="#00ac47"/>
    <path d="M23.75,16a7.7387,7.7387,0,0,1-3.2516,6.2987l4.3824,3.5059A13.2042,13.2042,0,0,0,29.25,16" fill="#4285f4"/>
    <path d="M8.25,16a7.698,7.698,0,0,1,.4677-2.6259L4.2849,9.8279a13.177,13.177,0,0,0,0,12.3442l4.4328-3.5462A7.698,7.698,0,0,1,8.25,16Z" fill="#ffba00"/>
    <polygon fill="#2ab2db" points="8.718 13.374 8.718 13.374 8.718 13.374 8.718 13.374"/>
    <path d="M16,8.25a7.699,7.699,0,0,1,4.558,1.4958l4.06-3.7893A13.2152,13.2152,0,0,0,4.2849,9.8279l4.4328,3.5462A7.756,7.756,0,0,1,16,8.25Z" fill="#ea4435"/>
    <polygon fill="#2ab2db" points="8.718 18.626 8.718 18.626 8.718 18.626 8.718 18.626"/>
    <path d="M29.25,15v1L27,19.5H16.5V14H28.25A1,1,0,0,1,29.25,15Z" fill="#4285f4"/>
  </svg>
);

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create Account — CosMonPay" },
      {
        name: "description",
        content: "Create your CosMonPay merchant account and start accepting crypto payments.",
      },
      { property: "og:title", content: "Create Account — CosMonPay" },
      { property: "og:description", content: "Create your merchant account and start accepting crypto payments." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    captcha: "",
    legalAccepted: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [captchaText, setCaptchaText] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Generate captcha on mount
  useEffect(() => {
    generateCaptcha();
  }, []);

  const generateCaptcha = useCallback(() => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaText(result);
  }, []);

  const validateField = (name: string, value: string) => {
    switch (name) {
      case "name":
        if (!value.trim()) return "Name is required";
        if (value.trim().length < 2) return "Name must be at least 2 characters";
        break;
      case "email":
        if (!value.trim()) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Invalid email format";
        break;
      case "password":
        if (!value) return "Password is required";
        if (value.length < 8) return "Password must be at least 8 characters";
        if (!/[A-Z]/.test(value)) return "Password must contain at least one uppercase letter";
        if (!/[a-z]/.test(value)) return "Password must contain at least one lowercase letter";
        if (!/[0-9]/.test(value)) return "Password must contain at least one number";
        break;
      case "confirmPassword":
        if (!value) return "Please confirm your password";
        if (value !== formData.password) return "Passwords do not match";
        break;
      case "captcha":
        if (!value) return "Please enter the captcha";
        if (value.toLowerCase() !== captchaText.toLowerCase()) return "Invalid captcha";
        break;
      case "legalAccepted":
        if (!value) return "You must accept the terms and conditions";
        break;
    }
    return "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === "checkbox" ? e.target.checked : value;
    setFormData((prev) => ({ ...prev, [name]: newValue }));

    const error = validateField(name, newValue);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const fieldValue = type === "checkbox" ? e.target.checked : value;
    const error = validateField(name, fieldValue);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSendOtp = async () => {
    const nameError = validateField("name", formData.name);
    const emailError = validateField("email", formData.email);
    const captchaError = validateField("captcha", formData.captcha);
    const legalError = validateField("legalAccepted", formData.legalAccepted.toString());

    const newErrors: Record<string, string> = {};
    if (nameError) newErrors.name = nameError;
    if (emailError) newErrors.email = emailError;
    if (captchaError) newErrors.captcha = captchaError;
    if (legalError) newErrors.legalAccepted = legalError;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setBusy(true);
    // Simulate OTP sending
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setBusy(false);
    setOtpSent(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nameError = validateField("name", formData.name);
    const emailError = validateField("email", formData.email);
    const passwordError = validateField("password", formData.password);
    const confirmError = validateField("confirmPassword", formData.confirmPassword);
    const captchaError = validateField("captcha", formData.captcha);
    const legalError = validateField("legalAccepted", formData.legalAccepted.toString());
    const otpError = !otpCode ? "Please enter the OTP" : otpCode.length !== 6 ? "OTP must be 6 digits" : "";

    const newErrors: Record<string, string> = {};
    if (nameError) newErrors.name = nameError;
    if (emailError) newErrors.email = emailError;
    if (passwordError) newErrors.password = passwordError;
    if (confirmError) newErrors.confirmPassword = confirmError;
    if (captchaError) newErrors.captcha = captchaError;
    if (legalError) newErrors.legalAccepted = legalError;
    if (otpError) newErrors.otp = otpError;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setBusy(true);
    // Simulate signup
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setBusy(false);

    // Redirect to dashboard or success page
    navigate({ to: "/dashboard" });
  };

  const handleGoogleSignup = async () => {
    setGoogleBusy(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setGoogleBusy(false);
    navigate({ to: "/dashboard" });
  };

  return (
    <main className="min-h-screen bg-background flex relative overflow-hidden isolate">
      <SpotlightBackground />

      {/* Foreground Content */}
      <div className="relative z-10 w-full min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Link to="/" className="flex items-center gap-3" aria-label="CosMonPay Home">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                <svg className="w-7 h-7 text-primary-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" strokeWidth="2" />
                  <path d="M9 8h4.5a2.5 2.5 0 0 1 0 5H9m0 0v3m0-3v-3m0 3v3" stroke="currentColor" strokeWidth="2" fill="none" />
                </svg>
              </div>
              <span className="text-2xl font-bold font-fraunces text-foreground">CosMonPay</span>
            </Link>
          </div>

          {/* Signup Form */}
          <div className="bg-card/90 backdrop-blur-xl border border-border rounded-3xl p-8">
            <div className="text-center mb-8">
            <h1 className="text-3xl font-bold font-fraunces text-foreground">Create your account</h1>
            <p className="text-muted-foreground mt-2">Start accepting crypto payments in minutes</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                  placeholder="John Doe"
                  autoComplete="name"
                  disabled={otpSent}
                />
              </div>
              {errors.name && <p className="mt-1.5 text-sm text-destructive flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                  placeholder="john@example.com"
                  autoComplete="email"
                  disabled={otpSent}
                />
              </div>
              {errors.email && <p className="mt-1.5 text-sm text-destructive flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full pl-10 pr-12 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  disabled={otpSent}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && <p className="mt-1.5 text-sm text-destructive flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{errors.password}</p>}
              <p className="mt-1.5 text-xs text-muted-foreground">Min 8 chars, 1 uppercase, 1 lowercase, 1 number</p>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  disabled={otpSent}
                />
              </div>
              {errors.confirmPassword && <p className="mt-1.5 text-sm text-destructive flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{errors.confirmPassword}</p>}
            </div>

            {/* Captcha */}
            <div>
              <label htmlFor="captcha" className="block text-sm font-medium text-foreground mb-2">
                Verification Code <span className="text-destructive">*</span>
              </label>
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <input
                    id="captcha"
                    name="captcha"
                    type="text"
                    value={formData.captcha}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-full pl-4 pr-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all text-center font-mono tracking-widest uppercase"
                    placeholder="Enter code"
                    autoComplete="off"
                    maxLength={6}
                  />
                </div>
                <div className="flex items-center justify-center px-4 bg-muted border border-border rounded-xl font-mono text-lg font-bold tracking-widest user-select-none text-primary" style={{ minWidth: "140px" }}>
                  {captchaText}
                </div>
              </div>
              <div className="flex items-center justify-between mt-2">
                {errors.captcha && <p className="text-sm text-destructive flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{errors.captcha}</p>}
                <button
                  type="button"
                  onClick={generateCaptcha}
                  className="text-sm text-primary hover:underline flex items-center gap-1"
                  aria-label="Refresh captcha"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
                  Refresh
                </button>
              </div>
            </div>

            {/* Legal Acceptance */}
            <div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  name="legalAccepted"
                  type="checkbox"
                  checked={formData.legalAccepted}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="mt-1 w-4 h-4 rounded border-border bg-background text-primary focus:ring-primary focus:ring-2"
                  aria-describedby="legal-error"
                />
                <div className="text-sm text-muted-foreground leading-relaxed">
                  I agree to the <a href="/terms" className="text-primary hover:underline">Terms of Service</a> and <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>. I understand that CosMonPay is a non-custodial payment processor and I am responsible for securing my wallet credentials.
                </div>
              </label>
              {errors.legalAccepted && <p id="legal-error" className="mt-1.5 text-sm text-destructive flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{errors.legalAccepted}</p>}
            </div>

            {/* Send OTP Button */}
            {!otpSent ? (
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={busy}
                className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:scale-[1.02] transition-transform active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {busy ? "Sending..." : "Send OTP to email"}
                <Send className="w-4 h-4" />
              </button>
            ) : (
              <div className="space-y-4 p-4 bg-primary/10 border border-primary/20 rounded-xl">
                <div className="flex items-center gap-2 text-primary">
                  <Check className="w-5 h-5" />
                  <span className="font-medium">OTP sent to {formData.email}</span>
                </div>
                <div>
                  <label htmlFor="otp" className="block text-sm font-medium text-foreground mb-2">
                    Enter 6-digit OTP
                  </label>
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all text-center font-mono tracking-widest text-2xl"
                    placeholder="000000"
                    maxLength={6}
                    autoComplete="one-time-code"
                  />
                  {errors.otp && <p className="mt-1.5 text-sm text-destructive flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{errors.otp}</p>}
                </div>
              </div>
            )}

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-card text-muted-foreground">Or continue with</span>
              </div>
            </div>

            {/* Google Signup */}
            <button
              type="button"
              onClick={handleGoogleSignup}
              disabled={googleBusy}
              className="w-full py-3 border border-border bg-background rounded-xl font-semibold hover:bg-muted transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              <GoogleIcon />
              <span>{googleBusy ? "Signing up..." : "Sign up with Google"}</span>
            </button>

            {/* Submit Button */}
            {otpSent && (
              <button
                type="submit"
                disabled={busy}
                className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:scale-[1.02] transition-transform active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {busy ? "Creating account..." : "Create account"}
                <Check className="w-4 h-4" />
              </button>
            )}

            {/* Login Link */}
            <p className="text-center text-sm text-muted-foreground">
              Already have an account? <Link to="/login" className="text-primary hover:underline font-medium">Sign in</Link>
            </p>
          </form>
        </div>
      </div>
      </div>
    </main>
  );
}