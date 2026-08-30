import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, Terminal, Code2, Server, Star, GitBranch } from "lucide-react";

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
          ? "bg-[#060813]/90 backdrop-blur-xl border-b border-white/[0.08] py-3.5 shadow-2xl shadow-black/50"
          : "bg-transparent py-5"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo & Open Source Tag */}
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
                <span className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">
                  Open-Source
                </span>
              </span>
              <span className="text-[10px] text-muted-foreground hidden sm:block">Self-Hosted Crypto Payment Engine</span>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2 rounded-full border border-white/[0.08] bg-[#121020]/70 p-1.5 backdrop-blur-xl shadow-inner shadow-white/5">
            <a
              href="#architecture"
              className="px-3.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-white hover:bg-white/5 rounded-full transition-colors"
            >
              Architecture
            </a>
            <a
              href="#deploy"
              className="px-3.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-white hover:bg-white/5 rounded-full transition-colors flex items-center gap-1"
            >
              <Server className="size-3 text-primary" />
              Self-Host Guide
            </a>
            <a
              href="#sdk"
              className="px-3.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-white hover:bg-white/5 rounded-full transition-colors flex items-center gap-1"
            >
              <Code2 className="size-3 text-cyan-400" />
              SDK & API
            </a>
            <a
              href="#features"
              className="px-3.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-white hover:bg-white/5 rounded-full transition-colors"
            >
              Features
            </a>
            <a
              href="#compare"
              className="px-3.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-white hover:bg-white/5 rounded-full transition-colors"
            >
              Comparison
            </a>
            <a
              href="#faq"
              className="px-3.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-white hover:bg-white/5 rounded-full transition-colors"
            >
              FAQ
            </a>
          </nav>

          {/* Right Action: GitHub Star & Deploy Button */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href="https://github.com/mr-daaku/coscom"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-white/[0.12] bg-white/[0.04] px-3.5 py-2 text-xs font-medium text-foreground hover:bg-white/[0.08] hover:border-primary/40 transition-all duration-200"
            >
              <GitBranch className="size-3.5 text-primary" />
              <span>GitHub</span>
              <span className="inline-flex items-center gap-1 rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-mono text-amber-300">
                <Star className="size-2.5 fill-amber-300" /> 1.4k
              </span>
            </a>

            <a
              href="#deploy"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary via-primary/90 to-accent px-4 py-2 text-xs font-bold text-white shadow-lg shadow-primary/25 transition-all duration-300 hover:scale-105 hover:shadow-primary/40"
            >
              <Server className="size-3.5" />
              <span>Deploy Instance</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <a
              href="#deploy"
              className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-white"
            >
              Deploy
            </a>
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
        <div className="md:hidden border-b border-border/80 bg-[#060813]/98 px-6 py-6 backdrop-blur-2xl transition-all">
          <nav className="flex flex-col gap-4">
            <a
              href="#architecture"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-muted-foreground hover:text-white"
            >
              Architecture & Data Sovereignty
            </a>
            <a
              href="#deploy"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-primary flex items-center gap-2"
            >
              <Server className="size-4" />
              Self-Host Deployment Guide (Docker / VPS)
            </a>
            <a
              href="#sdk"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-muted-foreground hover:text-white flex items-center gap-2"
            >
              <Code2 className="size-4 text-cyan-400" />
              SDK & API Integration (React / Node / Python)
            </a>
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-muted-foreground hover:text-white"
            >
              Features & Non-Custodial Security
            </a>
            <a
              href="#compare"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-muted-foreground hover:text-white"
            >
              Self-Hosted vs Hosted Processors
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-muted-foreground hover:text-white"
            >
              FAQ
            </a>
            <div className="mt-4 pt-4 border-t border-border/40">
              <a
                href="#deploy"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/25"
              >
                <Server className="size-4" />
                <span>Deploy Self-Hosted Node</span>
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
