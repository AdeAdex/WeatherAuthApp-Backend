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
