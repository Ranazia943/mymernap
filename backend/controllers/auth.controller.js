import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateToken.js";
import { nanoid } from "nanoid"; // For unique referral codes


export const registerUser = async (req, res) => {
  try {
    const { username, email, password, confirmPassword, referredBy } = req.body;

    // Input validation
    if (!username || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate unique referral code for new user
    const referralCode = nanoid(10);

    // Validate referredBy if provided
    let referredById = null;
    if (referredBy) {
      // Find the user by referral code
      const referrer = await User.findOne({ referralCode: referredBy });
      if (!referrer) {
        return res.status(400).json({ message: "Invalid referral code" });
      }
      referredById = referrer._id;

      // Create new user with the referral code and referrer info
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        referralCode,
        referredBy: referredById,
      });

      // Save the new user first to get the user ID
      const savedUser = await newUser.save();

      // Update the referrer's referrals array to include the new user ID
      referrer.referrals.push(savedUser._id);
      await referrer.save();

      // Generate token and set it in a cookie
      generateTokenAndSetCookie(savedUser._id, res);

      // Return response
      return res.status(201).json({ message: "User registered successfully", user: savedUser });
    }

    // If no referral code is provided, just create the new user without referral logic
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      referralCode,
    });

    // Save the new user
    const savedUser = await newUser.save();

    // Generate token and set it in a cookie
    generateTokenAndSetCookie(savedUser._id, res);

    // Return response
    return res.status(201).json({ message: "User registered successfully", user: savedUser });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


// Login User
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate token
    const token = generateTokenAndSetCookie(user._id, res); // token is set in a cookie here

    // Return the token in the response body
    res.status(200).json({ message: "Login successful", user, token }); // Include token in the response
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


// Logout User
export const logoutUser = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 }); // Clear the cookie
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
