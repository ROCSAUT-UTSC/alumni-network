"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type HeaderProps = {
  organization_name: string;
  features: string;
  student_directory: string;
  alumni_directory: string;
  login: string;
  registar: string;
};

export default function Header({
  organization_name,
  features,
  student_directory,
  alumni_directory,
  login,
  registar,
}: HeaderProps) {
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const featuresRef = useRef<HTMLDivElement | null>(null);

  // close dropdown on outside click + Esc
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (!featuresRef.current) return;
      if (!featuresRef.current.contains(e.target as Node)) setFeaturesOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setFeaturesOpen(false);
        setMobileOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur border-b border-black/10">
      <div
        className="mx-auto flex items-center justify-between"
        style={{
          height: "clamp(56px,6vw,80px)",
          paddingInline: "clamp(14px,3vw,32px)",
          maxWidth: "min(1280px, 96vw)",
        }}
      >
        {/* Left: logo + name */}
        <Link href="/" className="flex items-center" style={{ gap: "clamp(8px,1.3vw,14px)" }}>
          <Image
            src="/logo.webp"
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
            className="font-semibold text-sky-700 whitespace-nowrap"
            style={{ fontSize: "clamp(14px,1.8vw,18px)" }}
          >
            {organization_name}
          </span>
        </Link>

        {/* Desktop nav */}
        <nav
          className="hidden md:flex items-center font-semibold text-black"
          style={{
            gap: "clamp(14px,2.2vw,28px)",
            fontSize: "clamp(13px,1.2vw,16px)",
          }}
        >
          {/* Features dropdown */}
          <div className="relative" ref={featuresRef}>
            <button
              type="button"
              onClick={() => setFeaturesOpen((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={featuresOpen}
              className="flex items-center hover:opacity-70"
              style={{ gap: "clamp(6px,0.8vw,10px)" }}
            >
              {features}
              <ChevronDown rotated={featuresOpen} />
            </button>

            {featuresOpen && (
              <div
                role="menu"
                className="absolute right-0 mt-3 rounded-2xl border border-black/10 bg-white p-2 shadow-lg"
                style={{ width: "clamp(180px,20vw,240px)" }}
              >
                <MenuLink href="/features/profile" onPick={() => setFeaturesOpen(false)}>
                  Profile
                </MenuLink>
                <MenuLink href="/features/messaging" onPick={() => setFeaturesOpen(false)}>
                  Messaging
                </MenuLink>
                <MenuLink href="/features/events" onPick={() => setFeaturesOpen(false)}>
                  Events
                </MenuLink>
              </div>
            )}
          </div>

          <Link className="hover:opacity-70" href="/student_directory">
            {student_directory}
          </Link>
          <Link className="hover:opacity-70" href="/alumni_directory">
            {alumni_directory}
          </Link>
          <Link className="hover:opacity-70" href="/login">
            {login}
          </Link>
          <Link className="hover:opacity-70" href="/registar">
            {registar}
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="md:hidden rounded-xl border border-black/10 bg-white shadow-sm"
          onClick={() => {
            setMobileOpen((v) => !v);
            setFeaturesOpen(false);
          }}
          aria-label="Open menu"
          style={{
            width: "clamp(40px,10vw,48px)",
            height: "clamp(40px,10vw,48px)",
          }}
        >
          <HamburgerIcon open={mobileOpen} />
        </button>
      </div>

      {/* Mobile menu panel */}
      {mobileOpen && (
        <div className="md:hidden border-t border-black/10 bg-white">
          <div
            className="mx-auto flex flex-col"
            style={{
              maxWidth: "min(1280px, 96vw)",
              padding: "clamp(12px,3vw,18px)",
              gap: "clamp(8px,2vw,12px)",
              fontSize: "clamp(14px,3.6vw,16px)",
            }}
          >
            <button
              type="button"
              className="flex items-center justify-between rounded-xl border border-black/10 px-4 py-3"
              onClick={() => setFeaturesOpen((v) => !v)}
            >
              <span className="font-semibold">{features}</span>
              <ChevronDown rotated={featuresOpen} />
            </button>

            {featuresOpen && (
              <div className="rounded-xl border border-black/10 bg-white">
                <MobileLink href="/features/profile" onPick={() => setMobileOpen(false)}>
                  Profile
                </MobileLink>
                <MobileLink href="/features/messaging" onPick={() => setMobileOpen(false)}>
                  Messaging
                </MobileLink>
                <MobileLink href="/features/events" onPick={() => setMobileOpen(false)}>
                  Events
                </MobileLink>
              </div>
            )}

            <MobileLink href="/student_directory" onPick={() => setMobileOpen(false)}>
              {student_directory}
            </MobileLink>
            <MobileLink href="/alumni_directory" onPick={() => setMobileOpen(false)}>
              {alumni_directory}
            </MobileLink>
            <MobileLink href="/login" onPick={() => setMobileOpen(false)}>
              {login}
            </MobileLink>
            <MobileLink href="/registar" onPick={() => setMobileOpen(false)}>
              {registar}
            </MobileLink>
          </div>
        </div>
      )}
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
      role="menuitem"
      onClick={onPick}
      className="block rounded-xl px-3 py-2 hover:bg-black/5"
      style={{ fontSize: "clamp(13px,1.2vw,15px)" }}
    >
      {children}
    </Link>
  );
}

function MobileLink({
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
      className="rounded-xl border border-black/10 px-4 py-3 hover:bg-black/5"
    >
      <span className="font-semibold">{children}</span>
    </Link>
  );
}

function ChevronDown({ rotated }: { rotated: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-4 w-4 transition ${rotated ? "rotate-180" : ""}`}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M7 10l5 5 5-5H7Z" />
    </svg>
  );
}

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <div className="mx-auto flex h-5 w-6 flex-col justify-between">
      <span className={`h-[2px] w-full bg-black transition ${open ? "translate-y-[9px] rotate-45" : ""}`} />
      <span className={`h-[2px] w-full bg-black transition ${open ? "opacity-0" : ""}`} />
      <span className={`h-[2px] w-full bg-black transition ${open ? "-translate-y-[9px] -rotate-45" : ""}`} />
    </div>
  );
}