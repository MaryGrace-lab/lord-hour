import "server-only";
import { Resend } from "resend";

// env.ts already validates these. No silent fallbacks — a missing value
// would mean sending from a Resend test address, which most providers
// reject or spam-file.
const resend = new Resend(process.env.RESEND_API_KEY!);
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL!;
const ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL!;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL!;

type SendResult = { success: boolean; error?: string };

// ────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────

/** Prevent header injection via CR/LF in subjects. */
function sanitizeSubject(str: string): string {
  return str.replace(/[\r\n]+/g, " ").trim().slice(0, 200);
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function sendEmail(
  to: string,
  subject: string,
  html: string,
  replyTo?: string
): Promise<SendResult> {
  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: sanitizeSubject(subject),
      html,
      ...(replyTo ? { replyTo } : {}),
    });

    if (result.error) {
      console.error("Resend error:", result.error);
      return { success: false, error: result.error.message };
    }

    return { success: true };
  } catch (err) {
    console.error("Email send exception:", err);
    return { success: false, error: "Failed to send email" };
  }
}

function wrap(innerHtml: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</head>
<body style="margin:0;padding:0;background:#f9f8f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#1e1a14;">
  <div style="max-width:600px;margin:0 auto;padding:32px 16px;">
    <div style="background:#0f1a3a;padding:24px;border-radius:12px 12px 0 0;text-align:center;">
      <h1 style="margin:0;font-size:18px;color:#ffffff;font-weight:700;">
        The Lord&apos;s Hour Ministries
      </h1>
      <p style="margin:6px 0 0;font-size:12px;color:#c9a84c;letter-spacing:0.06em;text-transform:uppercase;">
        School of the Spirit Bible College
      </p>
    </div>

    <div style="background:#ffffff;padding:32px 24px;border-radius:0 0 12px 12px;">
      ${innerHtml}
    </div>

    <p style="text-align:center;font-size:11px;color:#8b7f6c;margin:20px 0 0;line-height:1.6;">
      You are receiving this email because of your application or account with<br/>
      The Lord&apos;s Hour Ministries Theology School.
    </p>
  </div>
</body>
</html>`.trim();
}

// ────────────────────────────────────────────────
// 1. New application — notify admin
// ────────────────────────────────────────────────

export async function sendNewApplicationNotificationToAdmin(params: {
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  courseTitle?: string | null;
  applicationId: string;
}): Promise<SendResult> {
  const {
    applicantName,
    applicantEmail,
    applicantPhone,
    courseTitle,
    applicationId,
  } = params;

  const reviewUrl = `${APP_URL}/admin/applications/${applicationId}`;

  const html = wrap(`
    <h2 style="margin:0 0 16px;font-size:20px;color:#0f1a3a;">New Application Received</h2>
    <p style="margin:0 0 16px;line-height:1.6;color:#50493c;">
      A new application has been submitted to the School of the Spirit Bible College.
    </p>

    <table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:14px;">
      <tr>
        <td style="padding:8px 0;color:#8b7f6c;width:140px;">Applicant</td>
        <td style="padding:8px 0;color:#1e1a14;font-weight:600;">${escapeHtml(applicantName)}</td>
      </tr>
      <tr>
        <td style="padding:8px 0;color:#8b7f6c;">Email</td>
        <td style="padding:8px 0;color:#1e1a14;">${escapeHtml(applicantEmail)}</td>
      </tr>
      <tr>
        <td style="padding:8px 0;color:#8b7f6c;">Phone</td>
        <td style="padding:8px 0;color:#1e1a14;">${escapeHtml(applicantPhone)}</td>
      </tr>
      ${
        courseTitle
          ? `<tr>
              <td style="padding:8px 0;color:#8b7f6c;">Course</td>
              <td style="padding:8px 0;color:#1e1a14;">${escapeHtml(courseTitle)}</td>
            </tr>`
          : ""
      }
    </table>

    <a href="${reviewUrl}"
       style="display:inline-block;background:#0f1a3a;color:#ffffff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600;font-size:14px;margin-top:8px;">
      Review Application
    </a>
  `);

  return sendEmail(
    ADMIN_EMAIL,
    `New Application — ${applicantName}`,
    html,
    applicantEmail
  );
}

// ────────────────────────────────────────────────
// 2. Application approved — notify applicant
// ────────────────────────────────────────────────

export async function sendApplicationApprovedEmail(params: {
  applicantName: string;
  applicantEmail: string;
}): Promise<SendResult> {
  const { applicantName, applicantEmail } = params;

  const html = wrap(`
    <h2 style="margin:0 0 16px;font-size:20px;color:#0f1a3a;">Your Application Has Been Approved</h2>
    <p style="margin:0 0 16px;line-height:1.6;color:#50493c;">
      Dear ${escapeHtml(applicantName)},
    </p>
    <p style="margin:0 0 16px;line-height:1.6;color:#50493c;">
      We are pleased to inform you that your application to the School of the Spirit Bible College has been approved.
    </p>
    <p style="margin:0 0 16px;line-height:1.6;color:#50493c;">
      A student account will be created for you shortly. You will receive a separate email with your login details once the account is ready.
    </p>
    <p style="margin:0 0 16px;line-height:1.6;color:#50493c;">
      If you have any questions in the meantime, please contact us.
    </p>
    <p style="margin:24px 0 0;line-height:1.6;color:#50493c;">
      In His service,<br/>
      <strong>The Lord&apos;s Hour Ministries</strong><br/>
      School of the Spirit Bible College
    </p>
  `);

  return sendEmail(
    applicantEmail,
    "Your Application Has Been Approved",
    html
  );
}

// ────────────────────────────────────────────────
// 3. Application rejected — notify applicant
// ────────────────────────────────────────────────

export async function sendApplicationRejectedEmail(params: {
  applicantName: string;
  applicantEmail: string;
  reason?: string | null;
}): Promise<SendResult> {
  const { applicantName, applicantEmail, reason } = params;

  const html = wrap(`
    <h2 style="margin:0 0 16px;font-size:20px;color:#0f1a3a;">Update on Your Application</h2>
    <p style="margin:0 0 16px;line-height:1.6;color:#50493c;">
      Dear ${escapeHtml(applicantName)},
    </p>
    <p style="margin:0 0 16px;line-height:1.6;color:#50493c;">
      Thank you for your interest in the School of the Spirit Bible College. After careful review, we are unable to proceed with your application at this time.
    </p>
    ${
      reason
        ? `<p style="margin:0 0 16px;line-height:1.6;color:#50493c;">
             <strong>Reason:</strong> ${escapeHtml(reason)}
           </p>`
        : ""
    }
    <p style="margin:0 0 16px;line-height:1.6;color:#50493c;">
      We encourage you to apply again in the future. If you believe this decision was made in error or would like more information, please contact us.
    </p>
    <p style="margin:24px 0 0;line-height:1.6;color:#50493c;">
      In His service,<br/>
      <strong>The Lord's Hour Ministries</strong><br/>
      School of the Spirit Bible College
    </p>
  `);

  return sendEmail(applicantEmail, "Update on Your Application", html);
}

// ────────────────────────────────────────────────
// 4. Student account activation — send link
// ────────────────────────────────────────────────

export async function sendStudentActivationEmail(params: {
  studentName: string;
  studentEmail: string;
  studentUsername: string;
  activationToken: string;
  expiresInDays: number;
}): Promise<SendResult> {
  const {
    studentName,
    studentEmail,
    studentUsername,
    activationToken,
    expiresInDays,
  } = params;

  const activationUrl = `${APP_URL}/activate/${activationToken}`;
  const loginUrl = `${APP_URL}/bible-college/portal/login`;

  const html = wrap(`
    <h2 style="margin:0 0 16px;font-size:20px;color:#0f1a3a;">Welcome to the School of the Spirit Bible College</h2>
    <p style="margin:0 0 16px;line-height:1.6;color:#50493c;">
      Dear ${escapeHtml(studentName)},
    </p>
    <p style="margin:0 0 16px;line-height:1.6;color:#50493c;">
      Your student account at The Lord&apos;s Hour Ministries has been created. To begin, please set your password by clicking the button below.
    </p>

    <div style="background:#f9f8f6;border-left:3px solid #c9a84c;padding:14px 16px;margin:20px 0;border-radius:4px;">
      <p style="margin:0;font-size:13px;color:#8b7f6c;text-transform:uppercase;letter-spacing:0.05em;font-weight:600;">Your Login Details</p>
      <p style="margin:8px 0 0;font-size:14px;color:#1e1a14;"><strong>Username:</strong> ${escapeHtml(studentUsername)}</p>
      <p style="margin:4px 0 0;font-size:14px;color:#1e1a14;"><strong>Password:</strong> You will set this via the button below.</p>
    </div>

    <div style="text-align:center;margin:32px 0;">
      <a href="${activationUrl}"
         style="display:inline-block;background:#0f1a3a;color:#ffffff;padding:14px 32px;border-radius:6px;text-decoration:none;font-weight:600;font-size:15px;">
        Set Your Password
      </a>
    </div>

    <p style="margin:0 0 16px;line-height:1.6;color:#50493c;">
      This link will expire in <strong>${expiresInDays} day${expiresInDays === 1 ? "" : "s"}</strong>. If it expires, please contact the school office for a new one.
    </p>

    <p style="margin:0 0 16px;line-height:1.6;color:#50493c;">
      After setting your password, log in here:<br/>
      <a href="${loginUrl}" style="color:#c9a84c;text-decoration:none;font-weight:600;">${loginUrl}</a>
    </p>

    <p style="margin:0 0 16px;line-height:1.6;color:#50493c;">
      If the button above doesn't work, copy and paste this link into your browser:
    </p>
    <p style="margin:0 0 16px;line-height:1.6;word-break:break-all;font-size:12px;color:#8b7f6c;">
      ${activationUrl}
    </p>

    <p style="margin:24px 0 0;line-height:1.6;color:#50493c;">
      In His service,<br/>
      <strong>The Lord&apos;s Hour Ministries</strong><br/>
      School of the Spirit Bible College
    </p>
  `);

  return sendEmail(
    studentEmail,
    "Set Your Password — Theology School Account",
    html
  );
}

// ────────────────────────────────────────────────
// 5. Application received — confirmation to applicant
// ────────────────────────────────────────────────

export async function sendApplicationReceivedEmail(params: {
  applicantName: string;
  applicantEmail: string;
  courseTitle?: string | null;
}): Promise<SendResult> {
  const { applicantName, applicantEmail, courseTitle } = params;

  const html = wrap(`
    <h2 style="margin:0 0 16px;font-size:20px;color:#0f1a3a;">We Received Your Application</h2>
    <p style="margin:0 0 16px;line-height:1.6;color:#50493c;">
      Dear ${escapeHtml(applicantName)},
    </p>
    <p style="margin:0 0 16px;line-height:1.6;color:#50493c;">
      Thank you for applying to the School of the Spirit Bible College at The Lord&apos;s Hour Ministries.
    </p>
    <p style="margin:0 0 16px;line-height:1.6;color:#50493c;">
      Your application has been <strong>received successfully</strong> and is now under review. Our team will get back to you shortly.
    </p>

    ${
      courseTitle
        ? `<div style="background:#f9f8f6;border-left:3px solid #c9a84c;padding:12px 16px;margin:20px 0;border-radius:4px;">
            <p style="margin:0;font-size:13px;color:#8b7f6c;text-transform:uppercase;letter-spacing:0.05em;font-weight:600;">Your Selection</p>
            <p style="margin:6px 0 0;font-size:14px;color:#1e1a14;"><strong>Course:</strong> ${escapeHtml(courseTitle)}</p>
          </div>`
        : ""
    }

    <div style="background:#fffbeb;border:1px solid #fde68a;padding:14px 16px;border-radius:6px;margin:20px 0;">
      <p style="margin:0;font-size:14px;color:#78350f;line-height:1.6;">
        📬 <strong>Please check your email regularly</strong> for updates on your admission status. All further communication will be sent to this email address.
      </p>
    </div>

    <p style="margin:0 0 16px;line-height:1.6;color:#50493c;">
      If you have any questions in the meantime, feel free to contact us.
    </p>

    <p style="margin:24px 0 0;line-height:1.6;color:#50493c;">
      In His service,<br/>
      <strong>The Lord&apos;s Hour Ministries</strong><br/>
      School of the Spirit Bible College
    </p>
  `);

  return sendEmail(
    applicantEmail,
    "Application Received — School of the Spirit Bible College",
    html
  );
}

// ────────────────────────────────────────────────
// 6. New contact message → notify admin
// ────────────────────────────────────────────────

export async function sendNewContactMessageNotificationToAdmin(params: {
  name: string;
  email?: string;
  phone: string;
  inquiryType: string;
  subject?: string;
  message: string;
}): Promise<SendResult> {
  const { name, email, phone, inquiryType, subject, message } = params;

  const inquiryLabel =
    inquiryType === "prayer"
      ? "Prayer Request"
      : inquiryType === "counseling"
      ? "Pastoral Counseling"
      : inquiryType === "testimony"
      ? "Testimony"
      : "General Inquiry";

  const html = wrap(`
    <h2 style="margin:0 0 16px;font-size:20px;color:#0f1a3a;">New Contact Message</h2>
    <p style="margin:0 0 16px;line-height:1.6;color:#50493c;">
      Someone has submitted the contact form on your website.
    </p>

    <table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:14px;">
      <tr>
        <td style="padding:8px 0;color:#8b7f6c;width:140px;">From</td>
        <td style="padding:8px 0;color:#1e1a14;font-weight:600;">${escapeHtml(name)}</td>
      </tr>
      <tr>
        <td style="padding:8px 0;color:#8b7f6c;">Type</td>
        <td style="padding:8px 0;color:#1e1a14;">${escapeHtml(inquiryLabel)}</td>
      </tr>
      <tr>
        <td style="padding:8px 0;color:#8b7f6c;">Phone</td>
        <td style="padding:8px 0;color:#1e1a14;">${escapeHtml(phone)}</td>
      </tr>
      ${
        email
          ? `<tr>
              <td style="padding:8px 0;color:#8b7f6c;">Email</td>
              <td style="padding:8px 0;color:#1e1a14;">${escapeHtml(email)}</td>
            </tr>`
          : ""
      }
      ${
        subject
          ? `<tr>
              <td style="padding:8px 0;color:#8b7f6c;">Subject</td>
              <td style="padding:8px 0;color:#1e1a14;">${escapeHtml(subject)}</td>
            </tr>`
          : ""
      }
    </table>

    <div style="background:#f9f8f6;border-left:3px solid #c9a84c;padding:14px 16px;border-radius:4px;margin:20px 0;">
      <p style="margin:0 0 6px;font-size:13px;color:#8b7f6c;text-transform:uppercase;letter-spacing:0.05em;font-weight:600;">Message</p>
      <p style="margin:0;font-size:14px;color:#1e1a14;line-height:1.6;white-space:pre-wrap;">${escapeHtml(message)}</p>
    </div>
  `);

  return sendEmail(
    ADMIN_EMAIL,
    `New Contact Message — ${inquiryLabel}`,
    html,
    email
  );
}

// ────────────────────────────────────────────────
// 7. New testimony → notify admin
// ────────────────────────────────────────────────

export async function sendNewTestimonyNotificationToAdmin(params: {
  submitterName: string;
  category: string;
  preview: string;
}): Promise<SendResult> {
  const { submitterName, category, preview } = params;
  const reviewUrl = `${APP_URL}/admin/testimonies`;

  const html = wrap(`
    <h2 style="margin:0 0 16px;font-size:20px;color:#0f1a3a;">New Testimony Submitted</h2>
    <p style="margin:0 0 16px;line-height:1.6;color:#50493c;">
      A new testimony has been submitted and is awaiting your review.
    </p>

    <table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:14px;">
      <tr>
        <td style="padding:8px 0;color:#8b7f6c;width:120px;">From</td>
        <td style="padding:8px 0;color:#1e1a14;font-weight:600;">${escapeHtml(submitterName)}</td>
      </tr>
      <tr>
        <td style="padding:8px 0;color:#8b7f6c;">Category</td>
        <td style="padding:8px 0;color:#1e1a14;">${escapeHtml(category)}</td>
      </tr>
    </table>

    <div style="background:#f9f8f6;border-left:3px solid #c9a84c;padding:14px 16px;border-radius:4px;margin:20px 0;">
      <p style="margin:0;font-size:14px;color:#50493c;line-height:1.6;font-style:italic;">
        "${escapeHtml(preview)}${preview.length >= 200 ? "…" : ""}"
      </p>
    </div>

    <a href="${reviewUrl}"
       style="display:inline-block;background:#0f1a3a;color:#ffffff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600;font-size:14px;margin-top:8px;">
      Review Testimony
    </a>
  `);

  return sendEmail(ADMIN_EMAIL, "New Testimony Awaiting Review", html);
}

// ────────────────────────────────────────────────
// 8. Course completion — notify student
// ────────────────────────────────────────────────

export async function sendCourseCompletionEmail(params: {
  studentName: string;
  studentEmail: string;
  courseTitle: string;
  teacherName: string;
}): Promise<SendResult> {
  const { studentName, studentEmail, courseTitle, teacherName } = params;

  // WhatsApp link uses the international format without + or spaces.
  const waNumber = (process.env.WHATSAPP_CONTACT_NUMBER ?? "").replace(
    /[^\d]/g,
    ""
  );
  const waLink = waNumber ? `https://wa.me/${waNumber}` : null;

  const html = wrap(`
    <h2 style="margin:0 0 16px;font-size:20px;color:#0f1a3a;">Course Completed 🎉</h2>
    <p style="margin:0 0 16px;line-height:1.6;color:#50493c;">
      Dear ${escapeHtml(studentName)},
    </p>
    <p style="margin:0 0 16px;line-height:1.6;color:#50493c;">
      Congratulations! Your instructor
      <strong>${escapeHtml(teacherName)}</strong> has marked you as having
      completed the course:
    </p>

    <div style="background:#f9f8f6;border-left:3px solid #c9a84c;padding:14px 16px;margin:20px 0;border-radius:4px;">
      <p style="margin:0;font-size:15px;color:#1e1a14;font-weight:600;">
        ${escapeHtml(courseTitle)}
      </p>
    </div>

    <p style="margin:0 0 16px;line-height:1.6;color:#50493c;">
      To receive your certificate, please contact the school office on
      WhatsApp using the button below.
    </p>

    ${
      waLink
        ? `<div style="text-align:center;margin:28px 0;">
             <a href="${waLink}"
                style="display:inline-block;background:#25D366;color:#ffffff;padding:14px 32px;border-radius:6px;text-decoration:none;font-weight:600;font-size:15px;">
               Message us on WhatsApp
             </a>
           </div>
           <p style="margin:0 0 16px;line-height:1.6;color:#50493c;font-size:13px;text-align:center;">
             Or copy this link: <br/>
             <span style="word-break:break-all;">${waLink}</span>
           </p>`
        : `<p style="margin:0 0 16px;line-height:1.6;color:#50493c;">
             Please contact the school office for details on obtaining your
             certificate.
           </p>`
    }

    <p style="margin:24px 0 0;line-height:1.6;color:#50493c;">
      Well done, and may God continue to bless you.<br/><br/>
      In His service,<br/>
      <strong>The Lord&apos;s Hour Ministries</strong><br/>
      School of the Spirit Bible College
    </p>
  `);

  return sendEmail(
    studentEmail,
    `Course Completed — ${courseTitle}`,
    html
  );
}
