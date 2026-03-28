"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

type FormType = "individual" | "team";
type Status = "idle" | "loading" | "success" | "error";

const INDIVIDUAL_ROLES = ["Student", "Instructor", "Project Manager", "Hobbyist"];

const inputClass =
  "w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.05] transition-all duration-200";

const labelClass = "block text-xs text-white/40 font-medium tracking-wide mb-2 uppercase";

export default function SignupPage() {
  const [type, setType] = useState<FormType>("individual");
  const [status, setStatus] = useState<Status>("idle");

  // Individual fields
  const [indName, setIndName]         = useState("");
  const [indEmail, setIndEmail]       = useState("");
  const [indRole, setIndRole]         = useState("");
  const [indUniversity, setIndUniversity] = useState("");
  const [indReason, setIndReason]     = useState("");

  // Team fields
  const [teamRep, setTeamRep]     = useState("");
  const [teamEmail, setTeamEmail] = useState("");
  const [teamOrg, setTeamOrg]     = useState("");
  const [teamRole, setTeamRole]   = useState("");
  const [teamUsage, setTeamUsage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    const payload =
      type === "individual"
        ? { type, name: indName, email: indEmail, role: indRole, university: indUniversity, reason: indReason }
        : { type, repName: teamRep, email: teamEmail, org: teamOrg, role: teamRole, usage: teamUsage };

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
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
            <h2 className="text-xl font-bold text-white">You&apos;re on the list.</h2>
            <p className="text-sm text-white/40 max-w-xs leading-relaxed">
              We&apos;ll reach out when access opens up. Big things are coming.
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
            <h1 className="text-2xl font-bold text-white mb-1">Join the waitlist</h1>
            <p className="text-sm text-white/30 mb-8">Tell us who you are and we&apos;ll be in touch.</p>

            {/* Type toggle */}
            <div className="flex gap-2 mb-8 p-1 rounded-xl bg-white/[0.03] border border-white/8">
              {(["individual", "team"] as FormType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium tracking-wide transition-all duration-200 ${
                    type === t
                      ? "bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-lg shadow-blue-600/20"
                      : "text-white/35 hover:text-white/60"
                  }`}
                >
                  {t === "individual" ? "Individual" : "Team / Organization"}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {type === "individual" ? (
                <>
                  <div>
                    <label className={labelClass}>Name</label>
                    <input className={inputClass} placeholder="Your full name" value={indName} onChange={(e) => setIndName(e.target.value)} required />
                  </div>
                  <div>
                    <label className={labelClass}>Email</label>
                    <input type="email" className={inputClass} placeholder="you@example.com" value={indEmail} onChange={(e) => setIndEmail(e.target.value)} required />
                  </div>
                  <div>
                    <label className={labelClass}>Role</label>
                    <select className={inputClass + " cursor-pointer"} value={indRole} onChange={(e) => { setIndRole(e.target.value); setIndUniversity(""); }} required>
                      <option value="" disabled style={{ background: "#000" }}>Select your role</option>
                      {INDIVIDUAL_ROLES.map((r) => (
                        <option key={r} value={r} style={{ background: "#000" }}>{r}</option>
                      ))}
                    </select>
                  </div>
                  {indRole === "Student" && (
                    <div>
                      <label className={labelClass}>University</label>
                      <input className={inputClass} placeholder="Your university or institution" value={indUniversity} onChange={(e) => setIndUniversity(e.target.value)} required />
                    </div>
                  )}
                  <div>
                    <label className={labelClass}>Why do you want to use CADen?</label>
                    <textarea className={inputClass + " resize-none"} rows={4} placeholder="Tell us about your use case..." value={indReason} onChange={(e) => setIndReason(e.target.value)} required />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className={labelClass}>Rep Name</label>
                    <input className={inputClass} placeholder="Your full name" value={teamRep} onChange={(e) => setTeamRep(e.target.value)} required />
                  </div>
                  <div>
                    <label className={labelClass}>Email</label>
                    <input type="email" className={inputClass} placeholder="you@company.com" value={teamEmail} onChange={(e) => setTeamEmail(e.target.value)} required />
                  </div>
                  <div>
                    <label className={labelClass}>Organization</label>
                    <input className={inputClass} placeholder="Company or institution name" value={teamOrg} onChange={(e) => setTeamOrg(e.target.value)} required />
                  </div>
                  <div>
                    <label className={labelClass}>Your Role</label>
                    <input className={inputClass} placeholder="e.g. Engineering Lead, CTO, Department Head" value={teamRole} onChange={(e) => setTeamRole(e.target.value)} required />
                  </div>
                  <div>
                    <label className={labelClass}>Intended Usage</label>
                    <textarea className={inputClass + " resize-none"} rows={4} placeholder="How would your team use CADen? What problems are you solving?" value={teamUsage} onChange={(e) => setTeamUsage(e.target.value)} required />
                  </div>
                </>
              )}

              {status === "error" && (
                <p className="text-xs text-red-400/80">Something went wrong. Please try again.</p>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="mt-2 w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-sky-400 text-white text-sm font-semibold hover:opacity-90 transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed glow-button"
              >
                {status === "loading" ? "Sending..." : "Request access"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
