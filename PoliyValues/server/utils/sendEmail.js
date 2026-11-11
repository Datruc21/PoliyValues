import nodemailer from "nodemailer";

export const sendVerificationEmail = async (email, code) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: Number(process.env.EMAIL_PORT) === 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"PoliyValues" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify Your PoliyValues Account",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;">
          <h2>Welcome to PoliyValues!</h2>

          <p>Thank you for creating an account with us.</p>

          <p>To verify your email address, please use the following verification code:</p>

          <h1 style="letter-spacing: 8px; color: #2563eb; text-align: center;">
            ${code}
          </h1>

          <p>This verification code will expire in 10 minutes.</p>

          <p>If you did not create an account, you can safely ignore this email.</p>

          <hr />

          <p style="font-size: 12px; color: #777;">
            © ${new Date().getFullYear()} PoliyValues. All rights reserved.
          </p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Verification email sent successfully!");
    console.log("Message ID:", info.messageId);

    return info;
  } catch (error) {
    console.error("Failed to send verification email:", error);
    throw error;
  }
};
