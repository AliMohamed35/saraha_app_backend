import nodemailer from "nodemailer";

export async function sendMail({ to, subject, html }) {
  const transporter = nodemailer.createTransport({
    // transporter will send emails under ur name
    host: "smtp.gmail.com",
    port: 587,

    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.USER_PASS,
    },
  });

  await transporter.sendMail({
    from: "'saraha app'<alimohameddev35@gmail.com>",
    to,
    subject,
    html,
  });
}
