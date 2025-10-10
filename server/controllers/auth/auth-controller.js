// auth-controller.js - Fixed version
import User from '../../models/User-schema.js';
import { passwordHashing, passwordComparison } from '../../utils/encryption.js';
import { generateToken } from '../../utils/token.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';

// Email transporter configuration (FIXED: createTransport not createTransporter)
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail', // or your email service
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Validate input
    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await passwordHashing(password);
    if (hashedPassword instanceof Error) {
        return res.status(500).json({ message: "Error hashing password" });
    }
    const newUser = await User.create({name, email, password: hashedPassword});

    res.status(201).json({ message: "Registered successfully", user: newUser });
    
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const login = async(req,res) => {
    const {email, password} = req.body;
    try {
        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Find user by email
        const user = await User.findOne({email});
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Compare password with hashed password
        const isPasswordValid = await passwordComparison(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        // Generate token
        const token = generateToken(user._id, user.role, user.email, user.name);

        res.status(200).json({ message: "Login successful", user: { id: user._id, name: user.name, email: user.email, role: user.role }, token: token });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }      
}

export const checkAuth = (req, res) => {
    const user = req.user;
    res.status(200).json({
        message: "User authenticated",
        user: user
    });
}

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  
  try {
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User with this email does not exist" });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour

    // Save reset token to user (you'll need to add these fields to your User schema)
    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    // Create reset URL
    const resetUrl = `${process.env.CLIENT_BASE_URL}/auth/reset-password?token=${resetToken}`;

    // Send email
    const transporter = createTransporter();
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset - Pachory Organic Nutrition',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #16a34a;">Password Reset Request</h2>
          <p>Hello ${user.name},</p>
          <p>You requested a password reset for your Pachory Organic Nutrition account.</p>
          <p>Click the button below to reset your password:</p>
          <a href="${resetUrl}" style="background-color: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 16px 0;">Reset Password</a>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <p>Best regards,<br>Pachory Organic Nutrition Team</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ 
      message: "Password reset email sent successfully",
      success: true 
    });

  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    if (!token || !newPassword) {
      return res.status(400).json({ message: "Token and new password are required" });
    }

    // Find user with valid reset token
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    // Hash new password
    const hashedPassword = await passwordHashing(newPassword);
    if (hashedPassword instanceof Error) {
      return res.status(500).json({ message: "Error hashing password" });
    }

    // Update user password and clear reset token
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.status(200).json({ 
      message: "Password reset successful",
      success: true 
    });

  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};