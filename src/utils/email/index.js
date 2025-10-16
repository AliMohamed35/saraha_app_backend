import nodemailer from "nodemailer";

export async function sendMail({ to, subject, html }) {
  const transporter = nodemailer.createTransport({
    // transporter will send emails under ur name
    host: "smtp.gmail.com",
    port: 587,

    auth: {
      user: "alimohameddev35@gmail.com",
      pass: "nxau emlg rgkc gjes",
    },
  });

  await transporter.sendMail({
    from: "'saraha app'<alimohameddev35@gmail.com>",
    to,
    subject,
    html,
  });
}
