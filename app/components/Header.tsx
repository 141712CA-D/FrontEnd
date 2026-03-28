"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-8 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "header-glass border-b border-white/10"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/logo copy.png"
            alt="Project CADen"
            width={36}
            height={36}
            className="drop-shadow-[0_0_8px_rgba(37,99,235,0.6)]"
            style={{ width: 36, height: "auto" }}
          />
          <span className="text-white font-semibold text-lg tracking-tight">
            Project <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-400">CADen</span>
          </span>
        </Link>

        {/* Single CTA */}
        <Link
          href="/signup"
          className="text-sm font-medium px-5 py-2 rounded-full bg-gradient-to-r from-blue-600 to-sky-400 text-white hover:opacity-90 transition-opacity duration-200 shadow-lg shadow-blue-600/25"
        >
          Join the waitlist
        </Link>

      </div>
    </header>
  );
}
