import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { name, email, role, university, subject, message } = await req.json();

  const emailSubject = `[CADen Contact] ${subject} — ${name}`;
  const html = `
    <div style="font-family: monospace; background: #000; color: #e2e8f0; padding: 32px; border-radius: 12px; border: 1px solid rgba(37,99,235,0.3);">
      <h2 style="color: #38bdf8; margin: 0 0 24px;">New Contact Message</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="color: #94a3b8; padding: 8px 0; width: 140px;">Name</td><td style="color: #f1f5f9;">${name}</td></tr>
        <tr><td style="color: #94a3b8; padding: 8px 0;">Email</td><td style="color: #38bdf8;"><a href="mailto:${email}" style="color: #38bdf8;">${email}</a></td></tr>
        <tr><td style="color: #94a3b8; padding: 8px 0;">Role</td><td style="color: #f1f5f9;">${role}</td></tr>
        ${university ? `<tr><td style="color: #94a3b8; padding: 8px 0;">University</td><td style="color: #f1f5f9;">${university}</td></tr>` : ""}
        <tr><td style="color: #94a3b8; padding: 8px 0;">Subject</td><td style="color: #f1f5f9;">${subject}</td></tr>
        <tr><td style="color: #94a3b8; padding: 8px 0; vertical-align: top;">Message</td><td style="color: #f1f5f9; line-height: 1.6;">${message}</td></tr>
      </table>
    </div>
  `;

  try {
    await resend.emails.send({
      from: "Project CADen <developers@projcaden.dev>",
      to: "developers@projcaden.dev",
      subject: emailSubject,
      html,
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact email error:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
