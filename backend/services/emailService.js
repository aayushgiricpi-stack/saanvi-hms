const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendEmail = async (
  to,
  subject,
  html,
  attachments = []
) => {
  try {
    await transporter.sendMail({
      from: `"Saanvi HMS" <${process.env.EMAIL}>`,
      to,
      subject,
      html,
      attachments,
    });

    console.log("Email sent successfully");
  } catch (error) {
    console.log("EMAIL ERROR:", error);
  }
};

module.exports = sendEmail;