import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { Mail, Lock, Check, AlertCircle, Eye, EyeOff } from "lucide-react";
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

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign In — CosMonPay" },
      {
        name: "description",
        content: "Sign in to your CosMonPay merchant account.",
      },
      { property: "og:title", content: "Sign In — CosMonPay" },
      { property: "og:description", content: "Sign in to your CosMonPay merchant account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    captcha: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [captchaText, setCaptchaText] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);

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
      case "email":
        if (!value.trim()) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Invalid email format";
        break;
      case "password":
        if (!value) return "Password is required";
        break;
      case "captcha":
        if (!value) return "Please enter the captcha";
        if (value.toLowerCase() !== captchaText.toLowerCase()) return "Invalid captcha";
        break;
    }
    return "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailError = validateField("email", formData.email);
    const passwordError = validateField("password", formData.password);
    const captchaError = validateField("captcha", formData.captcha);

    const newErrors: Record<string, string> = {};
    if (emailError) newErrors.email = emailError;
    if (passwordError) newErrors.password = passwordError;
    if (captchaError) newErrors.captcha = captchaError;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setBusy(true);
    // Simulate login
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setBusy(false);

    // Redirect to dashboard
    navigate({ to: "/dashboard" });
  };

  const handleGoogleSignin = async () => {
    setGoogleBusy(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setGoogleBusy(false);
    navigate({ to: "/dashboard" });
  };

  return (
    <main className="min-h-screen bg-background flex relative overflow-hidden">
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

          {/* Login Form */}
          <div className="bg-card/90 backdrop-blur-xl border border-border rounded-3xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold font-fraunces text-foreground">Welcome back</h1>
              <p className="text-muted-foreground mt-2">Sign in to your merchant account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
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
                    autoComplete="current-password"
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

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={busy}
                className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:scale-[1.02] transition-transform active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {busy ? "Signing in..." : "Sign in"}
                <Check className="w-4 h-4" />
              </button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-card text-muted-foreground">Or continue with</span>
                </div>
              </div>

              {/* Google Sign In */}
              <button
                type="button"
                onClick={handleGoogleSignin}
                disabled={googleBusy}
                className="w-full py-3 border border-border bg-background rounded-xl font-semibold hover:bg-muted transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                <GoogleIcon />
                <span>{googleBusy ? "Signing in..." : "Sign in with Google"}</span>
              </button>

              {/* Forgot Password */}
              <p className="text-center text-sm text-muted-foreground mt-4">
                <a href="/forgot-password" className="text-primary hover:underline font-medium">Forgot password?</a>
              </p>

              {/* Signup Link */}
              <p className="text-center text-sm text-muted-foreground mt-4">
                Don't have an account? <Link to="/signup" className="text-primary hover:underline font-medium">Create one</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}