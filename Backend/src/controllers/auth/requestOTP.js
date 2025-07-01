const User = require("../../models/auth/userSignupModel");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const requestOTP = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Invalid Email" });

    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpExpiry = Date.now() + 10 * 60 * 1000;

    user.resetOtp = otp;
    user.otpExpires = otpExpiry;
    await user.save();

    // sending otp
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.Email_User,
        pass: process.env.Email_Pass,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "FuelMate Password Reset Verification Code",
      html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 8px;">
        <h2 style="color: #2E86C1; text-align: center;">🔒 Password Reset Request</h2>
        <p>Hello,</p>
        <p>We received a request to reset the password for your FuelMate account. Use the verification code below to complete the process:</p>
        <div style="text-align: center; margin: 20px 0;">
        <span style="display: inline-block; padding: 10px 20px; font-size: 24px; font-weight: bold; color: #333; background-color: #f2f2f2; border-radius: 6px;">${otp}</span>
        </div>
        <p><strong>This code will expire in 10 minutes.</strong></p>
        <p>If you did not request this, please ignore this email. Your account will remain secure.</p>
        <p>Thank you for choosing FuelMate.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #888;">FuelMate Support Team</p>
        </div>`,
    });

    res.status(200).json({ success: true, message: "OTP sent successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  requestOTP,
};
