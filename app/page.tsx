"use client";

import { useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import IntroAnimation from "./components/IntroAnimation";
import DevBanner from "./components/DevBanner";

export default function Home() {
  const [introComplete, setIntroComplete] = useState(false);

  return (
    <>
      <DevBanner />
      <IntroAnimation onDone={() => setIntroComplete(true)} />

      <main
        className="flex flex-col min-h-screen bg-black"
        style={{
          opacity: introComplete ? 1 : 0,
          transform: introComplete ? "translateY(0)" : "translateY(12px)",
          transition: "opacity 0.8s ease, transform 0.8s ease",
        }}
      >
        <Header />
        <Hero />
        <footer className="bg-black border-t border-white/5 py-6 px-6">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-white/20">© {new Date().getFullYear()} Project CADen. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="/contact" className="text-xs text-white/25 hover:text-white/60 transition-colors">Contact us</a>
              <a href="/signup" className="text-xs text-white/25 hover:text-white/60 transition-colors">Join waitlist</a>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
