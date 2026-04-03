"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function Header() {
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const featuresRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 12);
    }

    function onClickOutside(e: MouseEvent) {
      if (!featuresRef.current) return;
      if (!featuresRef.current.contains(e.target as Node)) {
        setFeaturesOpen(false);
      }
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setFeaturesOpen(false);
        setMobileOpen(false);
      }
    }

    onScroll();
    window.addEventListener("scroll", onScroll);
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full backdrop-blur-xl transition-all duration-300 ${
        scrolled ? "bg-[#F2E9E3]/70 shadow-sm" : "bg-[#F2E9E3]/95"
      }`}
    >
      {mobileOpen && (
        <div className="md:hidden border-t border-black/10 bg-[#F2E9E3] px-6 py-4 space-y-3">
          <Link
            href="/student-directory"
            onClick={() => setMobileOpen(false)}
            className="block font-semibold text-[#5C3A2E] hover:opacity-70"
          >
            Student Directory
          </Link>

          <Link
            href="/alumni-directory"
            onClick={() => setMobileOpen(false)}
            className="block font-semibold text-[#5C3A2E] hover:opacity-70"
          >
            Alumni Directory
          </Link>

          <Link
            href="/about"
            onClick={() => setMobileOpen(false)}
            className="block font-semibold text-[#5C3A2E] hover:opacity-70"
          >
            About Us
          </Link>

          <Link
            href="/contact"
            onClick={() => setMobileOpen(false)}
            className="block font-semibold text-[#5C3A2E] hover:opacity-70"
          >
            Contact Us
          </Link>

          <div className="pt-3 flex gap-3">
            <Link
              href="/login"
              className="flex-1 text-center px-4 py-2 rounded-xl border border-black/10"
            >
              Login
            </Link>

            <Link
              href="/register"
              className="flex-1 text-center px-4 py-2 rounded-xl bg-[#007A97] text-white"
            >
              Register
            </Link>
          </div>
        </div>
      )}
      <div
        className="flex items-center justify-between"
        style={{
          height: "clamp(56px,6vw,80px)",
          paddingInline: "clamp(14px,3vw,32px)",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center"
          style={{ gap: "clamp(8px,1.3vw,14px)" }}
        >
          <Image
            src="/logo.svg"
            alt="UTSC Alumni"
            width={44}
            height={44}
            className="rounded-sm shadow-sm"
            style={{
              width: "clamp(30px,3.6vw,44px)",
              height: "clamp(30px,3.6vw,44px)",
            }}
            priority
          />
          <span
            className="font-semibold text-[#007A97] whitespace-nowrap"
            style={{ fontSize: "clamp(14px,1.8vw,18px)" }}
          >
            Taiwanese Alumni Network
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav
          className="hidden md:flex items-center font-semibold text-[#5C3A2E]"
          style={{
            gap: "clamp(14px,2.2vw,28px)",
            fontSize: "clamp(13px,1.2vw,16px)",
          }}
        >
          {/* Features */}
          <div className="relative" ref={featuresRef}>
            <button
              type="button"
              onClick={() => setFeaturesOpen((v) => !v)}
              className="flex items-center hover:opacity-70"
            >
              Features
              <ChevronDown rotated={featuresOpen} />
            </button>

            {featuresOpen && (
              <div className="absolute right-0 mt-3 rounded-2xl border border-black/10 bg-white p-2 shadow-lg">
                <MenuLink
                  href="/features/profile"
                  onPick={() => setFeaturesOpen(false)}
                >
                  Profile
                </MenuLink>
                <MenuLink
                  href="/features/messaging"
                  onPick={() => setFeaturesOpen(false)}
                >
                  Messaging
                </MenuLink>
                <MenuLink
                  href="/features/events"
                  onPick={() => setFeaturesOpen(false)}
                >
                  Events
                </MenuLink>
              </div>
            )}
          </div>

          <Link className="hover:opacity-70" href="/student-directory">
            Student Directory
          </Link>
          <Link className="hover:opacity-70" href="/alumni-directory">
            Alumni Directory
          </Link>

          {/* ✅ Professional Buttons */}
          <div className="flex items-center gap-3 ml-2">
            <Link
              href="/login"
              className="px-4 py-2 rounded-xl border border-black/10 hover:bg-black/5 transition"
            >
              Login
            </Link>

            <Link
              href="/register"
              className="px-5 py-2 rounded-xl bg-[#007A97] text-white shadow-sm hover:bg-[#005f7a] transition"
            >
              Register
            </Link>
          </div>
        </nav>

        {/* Mobile */}
        <button
          type="button"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          className="md:hidden flex items-center justify-center rounded-xl border border-black/10 shadow-sm transition hover:bg-black/[0.03]"
          style={{
            width: "44px",
            height: "44px",
          }}
          onClick={() => {
            setMobileOpen((v) => !v);
            setFeaturesOpen(false);
          }}
        >
          <HamburgerIcon open={mobileOpen} />
        </button>
      </div>
    </header>
  );
}

function MenuLink({
  href,
  children,
  onPick,
}: {
  href: string;
  children: React.ReactNode;
  onPick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onPick}
      className="block rounded-xl px-3 py-2 hover:bg-black/5"
    >
      {children}
    </Link>
  );
}

function ChevronDown({ rotated }: { rotated: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-4 w-4 transition ${rotated ? "rotate-180" : ""}`}
      fill="currentColor"
    >
      <path d="M7 10l5 5 5-5H7Z" />
    </svg>
  );
}

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <div className="mx-auto flex h-5 w-6 flex-col justify-between">
      <span
        className={`h-[2px] w-full bg-[#5C3A2E] transition ${open ? "translate-y-[9px] rotate-45" : ""}`}
      />
      <span
        className={`h-[2px] w-full bg-[#5C3A2E] transition ${open ? "opacity-0" : ""}`}
      />
      <span
        className={`h-[2px] w-full bg-[#5C3A2E] transition ${open ? "-translate-y-[9px] -rotate-45" : ""}`}
      />
    </div>
  );
}
