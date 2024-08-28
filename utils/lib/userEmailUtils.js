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
    subject: "Welcome to Weather App!",
    html: `
    <div style="background-color: #ffffff; padding: 20px; color: #333333; border-radius: 10px; font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #1a73e8;">Welcome, ${firstName}!</h1>
        <p style="font-size: 16px;">We're excited to have you on board. Stay updated with the latest weather information tailored just for you.</p>
      </div>
      <div style="text-align: center;">
        <img src="https://via.placeholder.com/150" alt="Weather App Logo" style="width: 150px; height: auto; margin-bottom: 20px;">
      </div>
      <div style="text-align: left;">
        <p style="font-size: 16px; margin-bottom: 10px;">Thank you for joining us. Here are some tips to get started:</p>
        <ul style="font-size: 16px; margin-bottom: 20px;">
          <li>Check the latest weather updates in your area.</li>
          <li>Set up personalized alerts for severe weather conditions.</li>
          <li>Explore detailed weather forecasts and trends.</li>
        </ul>
        <p style="font-size: 16px; margin-bottom: 20px;">If you have any questions, feel free to reach out to our support team. We're here to help!</p>
        <p style="font-size: 16px; font-weight: bold;">Best Regards,</p>
        <p style="font-size: 16px; font-weight: bold;">The Weather App Team</p>
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
    <div style="background-color: #ffffff; padding: 20px; color: #333333; border-radius: 10px; font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #1a73e8;">Reset Your Password</h1>
        <p style="font-size: 16px;">Hi, ${firstName},</p>
        <p style="font-size: 16px;">We received a request to reset your password. Click the button below to set a new password:</p>
        <a href="${resetLink}" 
          style="
            display: inline-block; 
            background-color: #1a73e8; 
            color: #ffffff; 
            padding: 12px 24px; 
            text-decoration: none; 
            border-radius: 5px;
            margin-top: 20px;
            text-align: center;
            font-size: 16px;
          ">
          Reset Password
        </a>
        <p style="font-size: 16px; margin-top: 20px;">
          If you didn't request this, you can safely ignore this email. Your password won't be changed.
        </p>
      </div>
      <div style="text-align: left; margin-top: 30px;">
        <p style="font-size: 16px; font-weight: bold;">Best Regards,</p>
        <p style="font-size: 16px; font-weight: bold;">The Weather App Team</p>
      </div>
    </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};
