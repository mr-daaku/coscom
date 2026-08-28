import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { ShieldCheck, Menu, X, ArrowRight, Sparkles, Terminal } from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? "bg-[#060813]/85 backdrop-blur-xl border-b border-primary/20 py-3.5 shadow-2xl shadow-black/50"
          : "bg-transparent py-5"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo & Live Status */}
          <div className="flex items-center gap-4">
            <Link to="/" className="group flex items-center gap-3">
              <div className="relative flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-primary/80 to-accent border border-primary/40 shadow-lg shadow-primary/30 transition-transform duration-300 group-hover:scale-105">
                <svg className="size-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10" strokeWidth="2" />
                  <ellipse cx="12" cy="12" rx="4" ry="10" strokeWidth="1.8" />
                  <line x1="2" y1="12" x2="22" y2="12" strokeWidth="2" />
                </svg>
                <div className="absolute -inset-1 rounded-xl bg-primary/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                  CosMos <span className="text-primary font-bold">Pay</span>
                  <span className="rounded bg-primary/20 px-1.5 py-0.5 text-[10px] font-semibold text-primary uppercase tracking-wider">v2.4</span>
                </span>
                <span className="text-[10px] text-muted-foreground hidden sm:block">Non-Custodial Multi-Chain Gateway</span>
              </div>
            </Link>

            {/* Live Operational Pulse Badge */}
            <div className="hidden lg:inline-flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-3 py-1 text-[11px] font-medium text-success backdrop-blur-md">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-success" />
              </span>
              <span>7 Chains Online</span>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2 rounded-full border border-border/50 bg-[#121020]/60 p-1.5 backdrop-blur-xl shadow-inner shadow-white/5">
            <a
              href="#features"
              className="px-3.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-white hover:bg-white/5 rounded-full transition-colors"
            >
              Features
            </a>
            <a
              href="#networks"
              className="px-3.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-white hover:bg-white/5 rounded-full transition-colors"
            >
              Ecosystem
            </a>
            <a
              href="#demo"
              className="px-3.5 py-1.5 text-xs font-medium text-primary hover:text-primary-foreground hover:bg-primary/20 rounded-full transition-colors flex items-center gap-1"
            >
              <Sparkles className="size-3" />
              Live Demo
            </a>
            <a
              href="#process"
              className="px-3.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-white hover:bg-white/5 rounded-full transition-colors"
            >
              Workflow
            </a>
            <a
              href="#compare"
              className="px-3.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-white hover:bg-white/5 rounded-full transition-colors"
            >
              Compare
            </a>
            <a
              href="#developers"
              className="px-3.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-white hover:bg-white/5 rounded-full transition-colors flex items-center gap-1"
            >
              <Terminal className="size-3 text-info" />
              Developers
            </a>
            <a
              href="#faq"
              className="px-3.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-white hover:bg-white/5 rounded-full transition-colors"
            >
              FAQ
            </a>
          </nav>

          {/* Right Action CTA Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              to="/pay"
              className="inline-flex items-center gap-2 rounded-xl border border-primary/40 bg-primary/10 px-4 py-2 text-xs font-semibold text-primary hover:bg-primary hover:text-white transition-all duration-200 shadow-sm"
            >
              <ShieldCheck className="size-3.5" />
              Checkout Flow
            </Link>

            <Link
              to="/admin"
              className="group relative inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary via-primary/90 to-accent px-4 py-2 text-xs font-bold text-white shadow-lg shadow-primary/25 transition-all duration-300 hover:scale-105 hover:shadow-primary/40"
            >
              <span>Admin Portal</span>
              <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              to="/pay"
              className="rounded-lg border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary"
            >
              Pay
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex size-9 items-center justify-center rounded-xl border border-border bg-card/60 text-foreground"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border/80 bg-[#060813]/95 px-6 py-6 backdrop-blur-2xl transition-all">
          <nav className="flex flex-col gap-4">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-muted-foreground hover:text-white"
            >
              Features & Architecture
            </a>
            <a
              href="#networks"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-muted-foreground hover:text-white"
            >
              Supported Ecosystem (7 Chains)
            </a>
            <a
              href="#demo"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-primary flex items-center gap-1.5"
            >
              <Sparkles className="size-4" />
              Interactive Payment Demo
            </a>
            <a
              href="#process"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-muted-foreground hover:text-white"
            >
              Transaction Pipeline
            </a>
            <a
              href="#compare"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-muted-foreground hover:text-white"
            >
              Gateway Comparison
            </a>
            <a
              href="#developers"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-muted-foreground hover:text-white flex items-center gap-1.5"
            >
              <Terminal className="size-4 text-info" />
              Developer API
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-muted-foreground hover:text-white"
            >
              FAQ
            </a>
            <div className="mt-4 flex flex-col gap-2.5 pt-4 border-t border-border/40">
              <Link
                to="/pay"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl border border-primary/40 bg-primary/10 py-2.5 text-sm font-semibold text-primary"
              >
                Checkout Demo
              </Link>
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/25"
              >
                Admin Dashboard
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
