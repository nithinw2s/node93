const jwt = require("jsonwebtoken");
const sequelize = require("../config/db");
const { User } = require("../models");
const nodemailer = require("nodemailer");
const CryptoJS = require("crypto-js");
const e = require("express");

// Simulated email transport (replace with real SMTP for production)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "nithin190902@gmail.com", // your Gmail
    pass: "ccdd myhr tuqo nhrr", // the 16-char app password
  },
});

// Generate OTP (store as string to avoid type mismatches)
const otp = String(Math.floor(1000 + Math.random() * 9000));
const expires_at = new Date(Date.now() + 10 * 60 * 1000);

const sendOtpEmail = async (email, otp = 1234) => {
  // Send OTP email after DB commit
  try {
    await transporter.sendMail({
      from: "nithin190902@gmail.com",
      to: email,
      subject: "Your OTP for Registration",
      text: `Your OTP is ${otp}. It expires in 10 minutes.`,
    });
  } catch (mailError) {
    console.error("Email send failed:", mailError);
  }
};

// 🔑 Secret key for encryption/decryption
const SECRET_KEY = "sorna"; // You should store this securely (e.g., environment variable)

// 🔐 Encrypt a password
function encryptPassword(password) {
  const ciphertext = CryptoJS.AES.encrypt(password, SECRET_KEY).toString();
  return ciphertext;
}

// 🔓 Decrypt a password
function decryptPassword(ciphertext) {
  const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
  const originalPassword = bytes.toString(CryptoJS.enc.Utf8);
  return originalPassword;
}

exports.register = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      await t.rollback();
      return res
        .status(400)
        .json({ error: "Name, email, and password are required" });
    }

    // Check if user exists
    let user = await User.findOne({ where: { email } });

    console.log(`Generated OTP: ${otp}, Expires at: ${expires_at}`);

    const encript = encryptPassword(password);

    if (user) {
      user.otp = otp;
      user.expires_at = expires_at;
      user.password = encript;
      await user.save({ transaction: t });
    } else {
      // Create new user
      user = await User.create(
        { name, email, password: encript, otp, expires_at },
        { transaction: t }
      );
    }

    await t.commit();

    sendOtpEmail(email, otp);

    return res.status(201).json({
      user: { id: user.id, name: user.name, email: user.email },
      message: "OTP sent successfully",
    });
  } catch (error) {
    await t.rollback();
    return res.status(500).json({ error: error.message });
  }
};

/**
 * while otp is valid
 * if the user is registered then it change the is_password_reset flag else it change the is_registered flag
 */
exports.verifyOtp = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      await t.rollback();
      return res.status(400).json({ error: "Email and OTP are required" });
    }

    const user = await User.findOne({ where: { email } });

    // If OTP is valid, mark user as registered
    const otpValid = Number(user.otp) === Number(otp);
    const now = new Date();
    const expiresAt = new Date(user.expires_at);
    const within10Mins = expiresAt > now && expiresAt - now <= 10 * 60 * 1000;

    console.log(`OTP Valid: ${otpValid}, Number: ${otp}, userotp: ${user.otp}`);

    if (otpValid && within10Mins) {
      if (user.is_registered) {
        user.is_password_reset = true;
      } else {
        user.is_registered = true;
      }
      await user.save({ transaction: t });
      await t.commit();
      res.status(200).json({ message: "OTP verified successfully" });
    } else {
      await t.rollback();
      res.status(400).json({ error: "Invalid or expired OTP" });
    }
  } catch (error) {
    await t.rollback();
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      await t.rollback();
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      await t.rollback();
      return res
        .status(401)
        .json({ error: "Invalid credentials user not found" });
    }

    const decryptedPassword = decryptPassword(user.password);
    if (user.is_registered && decryptedPassword === password.trim()) {
      const token = jwt.sign({ id: user.id }, "node93", { expiresIn: "1h" });
      await t.commit();
      return res.status(200).json({
        user: { id: user.id, name: user.name, email: user.email },
        token,
      });
    } else {
      await t.rollback();
      return res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    await t.rollback();
    return res.status(500).json({ error: error.message });
  }
};

exports.changePassword = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { email, oldPassword, newPassword } = req.body;
    if (!email || !oldPassword || !newPassword) {
      await t.rollback();
      return res
        .status(400)
        .json({ error: "Email, old password, and new password are required" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      await t.rollback();
      return res.status(404).json({ error: "User not found" });
    }

    console.log("User details:", user.password);
    const decryptedPassword = decryptPassword(user.password);

    if (decryptedPassword !== oldPassword.trim()) {
      await t.rollback();
      return res.status(401).json({ error: "Invalid old password" });
    }

    user.password = encryptPassword(newPassword.trim());
    await user.save({ transaction: t });
    await t.commit();
    return res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    await t.rollback();
    return res.status(500).json({ error: error.message });
  }
};

exports.forgetPassword = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { email } = req.body;
    if (!email) {
      await t.rollback();
      return res.status(400).json({ error: "Email is required" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      await t.rollback();
      return res.status(404).json({ error: "User not found" });
    }

    user.otp = 1234;
    user.expires_at = expires_at;
    await user.save({ transaction: t });

    sendOtpEmail(email);
    await t.commit();
    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    await t.rollback();
    return res.status(500).json({ error: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { email, newPassword, confirmPassword } = req.body;
    if (!email || !otp || !newPassword || !confirmPassword) {
      await t.rollback();
      return res
        .status(400)
        .json({ error: "Email, new password  and confirm password are required" });
    }

    if (newPassword !== confirmPassword) {
      await t.rollback();
      return res.status(400).json({ error: "Passwords do not match" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      await t.rollback();
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.is_password_reset) {
      await t.rollback();
      return res.status(400).json({ error: "unable to update the password" });
    }

    user.password = encryptPassword(newPassword);
    await user.save({ transaction: t });
    await t.commit();
    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    await t.rollback();
    return res.status(500).json({ error: error.message });
  }
};
