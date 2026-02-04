const nodemailer = require("nodemailer");

console.log("\n📧 [MAILER] Initializing email configuration...");
console.log("📧 [MAILER] EMAIL_SERVICE:", process.env.EMAIL_SERVICE);
console.log("📧 [MAILER] EMAIL_USER:", process.env.EMAIL_USER);
console.log("📧 [MAILER] EMAIL_FROM:", process.env.EMAIL_FROM);
console.log("📧 [MAILER] EMAIL_PASS exists:", !!process.env.EMAIL_PASS);

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify connection at startup
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ [MAILER] Email configuration error:", error.message);
    console.error(
      "❌ [MAILER] Please check your .env file for EMAIL_USER and EMAIL_PASS",
    );
  } else {
    console.log("✅ [MAILER] Email service ready and verified");
  }
});

module.exports = transporter;
