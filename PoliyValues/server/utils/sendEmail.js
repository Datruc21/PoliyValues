import nodemailer from "nodemailer";

export const sendVerificationEmail = async (email, code) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,

    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: '"PoliyValues" <no-reply@poliyvalues.com>',
    to: email,
    subject: "Code de vérification de votre compte",
    html: `<h3>Bienvenue sur PoliyValues !</h3>
           <p>Voici votre code de vérification : <b>${code}</b></p>
           <p>Ce code expire dans 10 minutes.</p>`,
  };

  await transporter.sendMail(mailOptions);
};
