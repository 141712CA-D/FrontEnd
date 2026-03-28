import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { google } from "googleapis";

const resend = new Resend(process.env.RESEND_API_KEY);

async function appendToSheet(row: (string | undefined)[]) {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: "Sheet1!A:H",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [row],
    },
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { type } = body;

  let subject: string;
  let html: string;
  let sheetRow: (string | undefined)[];
  const timestamp = new Date().toLocaleString("en-US", { timeZone: "America/New_York" });

  if (type === "individual") {
    const { name, email, role, university, reason } = body;
    subject = `[CADen Waitlist] Individual — ${name}`;
    sheetRow = [timestamp, "Individual", name, email, role, university ?? "", reason, ""];
    html = `
      <div style="font-family: monospace; background: #000; color: #e2e8f0; padding: 32px; border-radius: 12px; border: 1px solid rgba(37,99,235,0.3);">
        <h2 style="color: #38bdf8; margin: 0 0 24px;">New Individual Waitlist Signup</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="color: #94a3b8; padding: 8px 0; width: 140px;">Name</td><td style="color: #f1f5f9;">${name}</td></tr>
          <tr><td style="color: #94a3b8; padding: 8px 0;">Email</td><td style="color: #38bdf8;"><a href="mailto:${email}" style="color: #38bdf8;">${email}</a></td></tr>
          <tr><td style="color: #94a3b8; padding: 8px 0;">Role</td><td style="color: #f1f5f9;">${role}</td></tr>
          ${university ? `<tr><td style="color: #94a3b8; padding: 8px 0;">University</td><td style="color: #f1f5f9;">${university}</td></tr>` : ""}
          <tr><td style="color: #94a3b8; padding: 8px 0; vertical-align: top;">Why CADen</td><td style="color: #f1f5f9; line-height: 1.6;">${reason}</td></tr>
        </table>
      </div>
    `;
  } else {
    const { repName, email, org, role, usage } = body;
    subject = `[CADen Waitlist] Team — ${org}`;
    sheetRow = [timestamp, "Team", repName, email, role, "", usage, org];
    html = `
      <div style="font-family: monospace; background: #000; color: #e2e8f0; padding: 32px; border-radius: 12px; border: 1px solid rgba(37,99,235,0.3);">
        <h2 style="color: #38bdf8; margin: 0 0 24px;">New Team / Organization Waitlist Signup</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="color: #94a3b8; padding: 8px 0; width: 140px;">Rep Name</td><td style="color: #f1f5f9;">${repName}</td></tr>
          <tr><td style="color: #94a3b8; padding: 8px 0;">Email</td><td style="color: #38bdf8;"><a href="mailto:${email}" style="color: #38bdf8;">${email}</a></td></tr>
          <tr><td style="color: #94a3b8; padding: 8px 0;">Organization</td><td style="color: #f1f5f9;">${org}</td></tr>
          <tr><td style="color: #94a3b8; padding: 8px 0;">Role</td><td style="color: #f1f5f9;">${role}</td></tr>
          <tr><td style="color: #94a3b8; padding: 8px 0; vertical-align: top;">Intended Usage</td><td style="color: #f1f5f9; line-height: 1.6;">${usage}</td></tr>
        </table>
      </div>
    `;
  }

  try {
    await Promise.all([
      resend.emails.send({
        from: "Project CADen <developers@projcaden.dev>",
        to: "developers@projcaden.dev",
        subject,
        html,
      }),
      appendToSheet(sheetRow),
    ]);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Waitlist error:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
