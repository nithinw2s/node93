const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/db');
const { User } = require('../models');
const nodemailer = require('nodemailer');

// Simulated email transport (replace with real SMTP for production)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'nithin190902@gmail.com',   // your Gmail
    pass: 'ccdd myhr tuqo nhrr'     // the 16-char app password
  }
})

exports.register = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      await t.rollback();
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    // Check if user exists
    let user = await User.findOne({ where: { email } });

    // Generate OTP (store as string to avoid type mismatches)
    const otp = String(Math.floor(1000 + Math.random() * 9000));
    const expires_at = new Date(Date.now() + 10 * 60 * 1000);
    console.log(`Generated OTP: ${otp}, Expires at: ${expires_at}`);

    const hashedPassword = await bcrypt.hash(String(password), 10);

    if (user) {
      // Only update OTP and expiry
      user.otp = otp;
      user.expires_at = expires_at;
      await user.save({ transaction: t });
    } else {
      // Create new user
      user = await User.create(
        { name, email, password: hashedPassword, otp, expires_at },
        { transaction: t }
      );
    }

    await t.commit();

    // Send OTP email after DB commit
    try {
      await transporter.sendMail({
        from: "nithin190902@gmail.com",
        to: email,
        subject: 'Your OTP for Registration',
        text: `Your OTP is ${otp}. It expires in 10 minutes.`,
      });
      console.log(user.createdAt ? `Sent OTP to ${email}` : `Resent OTP to ${email}`);
    } catch (mailError) {
      console.error("Email send failed:", mailError);
    }

    return res.status(201).json({
      user: { id: user.id, name: user.name, email: user.email },
      message: "OTP sent successfully"
    });

  } catch (error) {
    await t.rollback();
    return res.status(500).json({ error: error.message });
  }
};


exports.verifyOtp = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { email, otp } = req.body;
    console.log("Verifying OTP for email:", email, "OTP:", otp);
    if (!email || !otp) {
      await t.rollback();
      return res.status(400).json({ error: 'Email and OTP are required' });
    }

    const user = await User.findOne({ where: { email } });

    // If OTP is valid, mark user as registered
    const otpValid = Number(user.otp) === Number(otp);
    const now = new Date();
    const expiresAt = new Date(user.expires_at);
    const within10Mins = expiresAt > now && (expiresAt - now) <= 10 * 60 * 1000;

    if (otpValid && within10Mins) {
      user.is_registered = true;
      await user.save({ transaction: t });
      await t.commit();
      res.status(200).json({ message: 'OTP verified successfully' });
    } else {
      await t.rollback();
      res.status(400).json({ error: 'Invalid or expired OTP' });
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
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      await t.rollback();
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(String(password), user.password);
    console.log("No user found", passwordMatch);
    if (user.is_registered === true && passwordMatch) {
      const token = jwt.sign({ id: user.id }, 'your_jwt_secret', { expiresIn: '1h' });
      await t.commit();
      return res.status(200).json({
        user: { id: user.id, name: user.name, email: user.email },
        token
      });
    } else {
      await t.rollback();
      return res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    await t.rollback();
    return res.status(500).json({ error: error.message });
  }
};
