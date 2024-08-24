// utils/lib/userEmailUtils.js
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.USER,
    pass: process.env.PASS,
  },
});

/**
 * Sends a welcome email to a new user.
 * @param {string} recipientEmail The recipient's email address.
 * @param {string} recipientName The recipient's name.
 * @returns {Promise} A promise that resolves when the email is successfully sent.
 */

export const sendWelcomeEmail = async (email, firstName) => {
  const mailOptions = {
    from: process.env.USER,
    to: email,
    subject: "Welcome",
    html: `
    <div style="background-color: #f2f2f2; padding: 20px; color: #333; border-radius: 10px; font-family: Arial, sans-serif; display: flex; flex-direction: column;">
        
        <div style="text-align: center; width: 100%">
            <p style="font-size: 18px; margin-bottom: 10px; text-align: left;">Hi, ${firstName}!</p>
           
            <br>
            <p style="font-size: 16px; font-weight: bold;">Kind regards,</p>
            <p style="font-size: 16px; font-weight: bold;">Admin from Weather App.</p>
        </div>
</div>
`,
  };

  return transporter.sendMail(mailOptions);
};

/**
 * Sends a reset password email to a user.
 * @param {string} email The user's email address.
 * @param {string} resetLink The password reset link.
 * @param {string} firstName The user's first name.
 * @returns {Promise} A promise that resolves when the email is successfully sent.
 */
export const sendResetPasswordEmail = async (email, resetLink, firstName) => {
  const mailOptions = {
    from: process.env.USER,
    to: email,
    subject: "Password Reset Request",
    html: `
      <div style="background-color: #f2f2f2; padding: 20px; color: #333; border-radius: 10px; font-family: Arial, sans-serif; display: flex; flex-direction: column;">
        <div style="text-align: center; width: 100%;">
          <p style="font-size: 18px; margin-bottom: 10px; text-align: left;">Hi, ${firstName},</p>
          <p style="font-size: 16px; margin-bottom: 10px; text-align: left;">We received a request to reset your password.</p>
          <p style="font-size: 16px; margin-bottom: 20px; text-align: left;">
              Click the button below to reset your password:
            </p>
            <a href="${resetLink}" 
              style="
                display: inline-block; 
                background-color: #1a73e8; 
                color: #ffffff; 
                padding: 10px 20px; 
                text-decoration: none; 
                border-radius: 5px;
                margin-top: 10px;
                text-align: center;
              ">
              Reset Password
            </a>
            <br>

          <p style="font-size: 16px; margin-bottom: 10px; text-align: left;">
            If you didn't request this, you can safely ignore this email.
          </p>
          <br>
          <p style="font-size: 16px; font-weight: bold;">Kind regards,</p>
          <p style="font-size: 16px; font-weight: bold;">Admin from Weather App.</p>
        </div>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};
