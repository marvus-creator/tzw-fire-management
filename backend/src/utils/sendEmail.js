const nodemailer = require('nodemailer');

/**
 * Send an email via SMTP.
 *
 * If SMTP credentials are not configured (SMTP_HOST / SMTP_USER are empty),
 * the email is logged to the server console instead of being sent. This keeps
 * local development working without requiring a real mail server.
 *
 * @param {Object} options
 * @param {string} options.to       Recipient email address
 * @param {string} options.subject  Email subject line
 * @param {string} options.text     Plain-text body
 * @param {string} [options.html]   Optional HTML body
 */
const sendEmail = async ({ to, subject, text, html }) => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_FROM } = process.env;

  // No SMTP configured -> log to console so dev flows still work.
  if (!SMTP_HOST || !SMTP_USER) {
    console.log('\n📧 [EMAIL - console fallback, SMTP not configured]');
    console.log(`   To:      ${to}`);
    console.log(`   Subject: ${subject}`);
    console.log(`   Body:    ${text}\n`);
    return { delivered: false, fallback: true };
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: Number(SMTP_PORT) === 465, // true for 465, false for 587/others
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  await transporter.sendMail({
    from: EMAIL_FROM || SMTP_USER,
    to,
    subject,
    text,
    html: html || text,
  });

  return { delivered: true, fallback: false };
};

module.exports = sendEmail;
