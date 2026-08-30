import { Link } from "@tanstack/react-router";
import { Github, Twitter, MessageSquare, Linkedin } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "Demo", href: "#checkout" },
      { label: "Integrations", href: "#features" },
      { label: "API Docs", href: "#features" },
      { label: "Status", href: "#features" },
    ],
    developers: [
      { label: "Documentation", href: "#features" },
      { label: "API Reference", href: "#features" },
      { label: "SDKs", href: "#features" },
      { label: "Webhooks", href: "#features" },
      { label: "Sandbox", href: "#features" },
      { label: "OpenAPI Spec", href: "#features" },
    ],
    company: [
      { label: "About", href: "#features" },
      { label: "Blog", href: "#features" },
      { label: "Careers", href: "#features" },
      { label: "Press", href: "#features" },
      { label: "Contact", href: "#features" },
      { label: "Partners", href: "#features" },
    ],
    legal: [
      { label: "Privacy Policy", href: "#features" },
      { label: "Terms of Service", href: "#features" },
      { label: "Cookie Policy", href: "#features" },
      { label: "Security", href: "#features" },
      { label: "Compliance", href: "#features" },
    ],
  };

  const socialLinks = [
    { icon: Github, href: "https://github.com", label: "GitHub" },
    { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
    { icon: MessageSquare, href: "https://discord.com", label: "Discord" },
    { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  ];

  return (
    <footer className="border-t border-border bg-card/50">
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-16">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-2 space-y-6">
            <Link to="/" className="flex items-center gap-3" aria-label="CosMonPay Home">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <svg className="w-6 h-6 text-primary-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" strokeWidth="2" />
                  <path d="M9 8h4.5a2.5 2.5 0 0 1 0 5H9m0 0v3m0-3v-3m0 3v3" stroke="currentColor" strokeWidth="2" fill="none" />
                </svg>
              </div>
              <span className="text-xl font-bold font-fraunces text-foreground">CosMonPay</span>
            </Link>
            <p className="text-muted-foreground max-w-xs leading-relaxed">
              The gateway to crypto commerce. Accept Bitcoin, Ethereum, stablecoins and 50+ tokens with one integration.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl border border-border bg-background flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-primary/10 transition-all"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Product */}
          <nav aria-label="Product links">
            <h3 className="font-semibold text-foreground mb-4">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Developers */}
          <nav aria-label="Developer links">
            <h3 className="font-semibold text-foreground mb-4">Developers</h3>
            <ul className="space-y-3">
              {footerLinks.developers.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Company */}
          <nav aria-label="Company links">
            <h3 className="font-semibold text-foreground mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Legal */}
          <nav aria-label="Legal links">
            <h3 className="font-semibold text-foreground mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} CosMonPay. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <span>Built for the next century of money.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}