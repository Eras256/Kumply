"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname, useRouter, Link } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import Image from "next/image";
import KumplyLogo from "@/app/images/KumplyLogo.png";

export function Navbar() {
  const t = useTranslations('Navbar');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const { address, isConnected } = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when navigating
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [mobileMenuOpen]);

  const closeMenu = useCallback(() => setMobileMenuOpen(false), []);
  const toggleMenu = useCallback(() => setMobileMenuOpen(prev => !prev), []);

  const navLinks = [
    { href: "/" as const, label: t('home') },
    { href: "/solutions/kyc" as const, label: t('solutions') },
    { href: "/tiers" as const, label: t('tiers') },
    { href: "/demo" as const, label: t('demo') },
    { href: "/dashboard" as const, label: t('dashboard') },
    { href: "/l1" as const, label: t('l1') },
    { href: "/developers" as const, label: t('developers') },
  ];

  return (
    <>
      <nav
        role="navigation"
        aria-label="Main navigation"
        className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}
      >
        <div className="navbar__inner container">
          {/* LOGO */}
          <Link href="/" className="navbar__logo">
            <Image src={KumplyLogo} alt="Kumply Logo" width={32} height={32} style={{ borderRadius: '8px' }} />
            <span className="navbar__brand">KUMPLY</span>
          </Link>

          {/* DESKTOP NAV */}
          <div className="navbar__desktop">
            <div className="navbar__links">
              {navLinks.map(link => (
                <Link key={link.href} href={link.href} className="navbar__link btn-ghost">
                  {link.label}
                </Link>
              ))}
              <Link href="/verify" className="navbar__link navbar__link--verify">
                {t('verify')}
              </Link>
            </div>

            <div className="navbar__divider" />

            {/* LANGUAGE SWITCHER */}
            <div className="navbar__lang">
              <button
                onClick={() => router.replace(pathname, { locale: 'en' })}
                className={`navbar__lang-btn ${locale === 'en' ? 'navbar__lang-btn--active' : ''}`}
              >EN</button>
              <button
                onClick={() => router.replace(pathname, { locale: 'es' })}
                className={`navbar__lang-btn ${locale === 'es' ? 'navbar__lang-btn--active' : ''}`}
              >ES</button>
            </div>

            {/* WALLET */}
            {mounted && isConnected ? (
              <div className="navbar__wallet">
                <span className="badge badge-success navbar__wallet-badge">
                  <span className="navbar__wallet-dot" />
                  {t('connected')}
                </span>
                <span className="navbar__wallet-address">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </span>
                <button className="btn btn-secondary navbar__wallet-btn" onClick={() => disconnect()}>
                  {t('disconnect')}
                </button>
              </div>
            ) : (
              <button
                className="btn btn-primary navbar__connect-btn"
                onClick={() => connect({ connector: connectors[0] })}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 7V4C19 3 18 2 17 2H3C2 2 1 3 1 4V20C1 21 2 22 3 22H17C18 22 19 21 19 20V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M23 12H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M20 9L23 12L20 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {t('connect')}
              </button>
            )}
          </div>

          {/* MOBILE HAMBURGER */}
          <button
            className="navbar__hamburger"
            onClick={toggleMenu}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            <span className={`navbar__hamburger-line ${mobileMenuOpen ? 'navbar__hamburger-line--top' : ''}`} />
            <span className={`navbar__hamburger-line ${mobileMenuOpen ? 'navbar__hamburger-line--mid' : ''}`} />
            <span className={`navbar__hamburger-line ${mobileMenuOpen ? 'navbar__hamburger-line--bot' : ''}`} />
          </button>
        </div>
      </nav>

      {/* MOBILE OVERLAY BACKDROP */}
      <div
        className={`navbar__backdrop ${mobileMenuOpen ? 'navbar__backdrop--visible' : ''}`}
        onClick={closeMenu}
        aria-hidden="true"
      />

      {/* MOBILE SLIDE-OUT MENU */}
      <div
        className={`navbar__mobile ${mobileMenuOpen ? 'navbar__mobile--open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <div className="navbar__mobile-inner">
          <div className="navbar__mobile-links">
            {navLinks.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="navbar__mobile-link"
                style={{ animationDelay: mobileMenuOpen ? `${i * 0.06}s` : '0s' }}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/verify"
              onClick={closeMenu}
              className="navbar__mobile-link navbar__mobile-link--verify"
              style={{ animationDelay: mobileMenuOpen ? `${navLinks.length * 0.06}s` : '0s' }}
            >
              {t('verify')}
            </Link>
          </div>

          <div className="navbar__mobile-divider" />

          {/* MOBILE LANGUAGE SWITCHER */}
          <div className="navbar__mobile-lang">
            <button
              onClick={() => { router.replace(pathname, { locale: 'en' }); closeMenu(); }}
              className={`navbar__lang-btn navbar__lang-btn--lg ${locale === 'en' ? 'navbar__lang-btn--active' : ''}`}
            >EN</button>
            <button
              onClick={() => { router.replace(pathname, { locale: 'es' }); closeMenu(); }}
              className={`navbar__lang-btn navbar__lang-btn--lg ${locale === 'es' ? 'navbar__lang-btn--active' : ''}`}
            >ES</button>
          </div>

          {/* MOBILE WALLET */}
          <div className="navbar__mobile-wallet">
            {mounted && isConnected ? (
              <>
                <span className="navbar__wallet-address navbar__wallet-address--lg">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </span>
                <button
                  className="btn btn-secondary navbar__mobile-wallet-btn"
                  onClick={() => { disconnect(); closeMenu(); }}
                >
                  {t('disconnect')}
                </button>
              </>
            ) : (
              <button
                className="btn btn-primary navbar__mobile-wallet-btn"
                onClick={() => { connect({ connector: connectors[0] }); closeMenu(); }}
              >
                {t('connect')}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
