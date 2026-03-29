"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Turnstile } from "@marsidev/react-turnstile";
import type { TurnstileInstance } from "@marsidev/react-turnstile";

type Status = "idle" | "loading" | "success" | "error";

const ROLES = ["Student", "Instructor", "Project Manager", "Hobbyist", "Other"];

const inputClass =
  "w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.05] transition-all duration-200";

const labelClass = "block text-xs text-white/40 font-medium tracking-wide mb-2 uppercase";

export default function ContactPage() {
  const [status, setStatus] = useState<Status>("idle");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileInstance>(null);

  const [name, setName]             = useState("");
  const [email, setEmail]           = useState("");
  const [role, setRole]             = useState("");
  const [university, setUniversity] = useState("");
  const [subject, setSubject]       = useState("");
  const [message, setMessage]       = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    if (!captchaToken) {
      setStatus("error");
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, role, university, subject, message, captchaToken }),
      });
      if (!res.ok) {
        turnstileRef.current?.reset();
        setCaptchaToken(null);
      }
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
      turnstileRef.current?.reset();
      setCaptchaToken(null);
    }
  }

  return (
    <div className="relative min-h-screen bg-black flex flex-col items-center justify-center px-6 py-20 overflow-hidden">

      {/* Background grid */}
      <div className="grid-bg absolute inset-0 pointer-events-none" />

      {/* Ambient orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="orb-1 absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(37,99,235,0.18) 0%, transparent 70%)", filter: "blur(40px)" }}
        />
        <div
          className="orb-2 absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(14,165,233,0.12) 0%, transparent 70%)", filter: "blur(40px)" }}
        />
      </div>

      {/* Card */}
      <div
        className="relative z-10 w-full max-w-lg rounded-2xl border border-white/10 p-8 sm:p-10"
        style={{ background: "linear-gradient(145deg, rgba(37,99,235,0.06) 0%, rgba(0,0,0,0.8) 100%)", backdropFilter: "blur(20px)" }}
      >
        {/* Logo + back link */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="/logo copy.png"
              alt="Project CADen"
              width={28}
              height={28}
              style={{ width: 28, height: "auto" }}
            />
            <span className="text-white/60 text-sm font-medium">
              Project <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-400">CADen</span>
            </span>
          </Link>
          <Link href="/" className="text-xs text-white/25 hover:text-white/50 transition-colors">
            ← Back
          </Link>
        </div>

        {status === "success" ? (
          <div className="flex flex-col items-center text-center py-8 gap-4">
            <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white">Message received.</h2>
            <p className="text-sm text-white/40 max-w-xs leading-relaxed">
              We&apos;ll get back to you as soon as we can.
            </p>
            <button
              onClick={() => { sessionStorage.removeItem("introPlayed"); window.location.href = "/"; }}
              className="mt-4 text-xs text-blue-400/70 hover:text-blue-400 transition-colors"
            >
              ← Back to home
            </button>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-white mb-1">Get in touch</h1>
            <p className="text-sm text-white/30 mb-8">Have a question or want to learn more? We&apos;d love to hear from you.</p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className={labelClass}>Name</label>
                <input className={inputClass} placeholder="Your full name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div>
                <label className={labelClass}>Email</label>
                <input type="email" className={inputClass} placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div>
                <label className={labelClass}>Role</label>
                <select className={inputClass + " cursor-pointer"} value={role} onChange={(e) => { setRole(e.target.value); setUniversity(""); }} required>
                  <option value="" disabled style={{ background: "#000" }}>Select your role</option>
                  {ROLES.map((r) => (
                    <option key={r} value={r} style={{ background: "#000" }}>{r}</option>
                  ))}
                </select>
              </div>
              {role === "Student" && (
                <div>
                  <label className={labelClass}>University</label>
                  <input className={inputClass} placeholder="Your university or institution" value={university} onChange={(e) => setUniversity(e.target.value)} required />
                </div>
              )}
              <div>
                <label className={labelClass}>Subject</label>
                <input className={inputClass} placeholder="What's this about?" value={subject} onChange={(e) => setSubject(e.target.value)} required />
              </div>
              <div>
                <label className={labelClass}>Message</label>
                <textarea className={inputClass + " resize-none"} rows={5} placeholder="What's on your mind?" value={message} onChange={(e) => setMessage(e.target.value)} required />
              </div>

              <Turnstile
                ref={turnstileRef}
                siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
                onSuccess={(token) => setCaptchaToken(token)}
                onExpire={() => setCaptchaToken(null)}
                options={{ theme: "dark" }}
              />

              {status === "error" && (
                <p className="text-xs text-red-400/80">Something went wrong. Please try again.</p>
              )}

              <button
                type="submit"
                disabled={status === "loading" || !captchaToken}
                className="mt-2 w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-sky-400 text-white text-sm font-semibold hover:opacity-90 transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed glow-button"
              >
                {status === "loading" ? "Sending..." : "Send message"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
