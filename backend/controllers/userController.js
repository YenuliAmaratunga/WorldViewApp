// controllers/userController.js
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register a new user
// POST /api/users/register
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: "All fields are required" });

  // Email regex validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  // Password regex validation
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message: "Password must be at least 8 characters with letters and numbers",
    });
  }
  
  const existing = await User.findOne({ email });
  if (existing)
    return res.status(400).json({ message: "Email already exists" });

  try {
    const user = await User.create({ name, email, password });

    res.status(201).json({
      message: "User registered successfully. Please log in.",
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to register user", error: err.message });
  }
};

// Authenticate user & return JWT
// POST /api/users/login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // Create JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        favorites: user.favorites,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Login error", error: err.message });
  }
};

// Toggle a country as favorite
// POST /api/users/favorites
export const toggleFavorite = async (req, res) => {
  const { countryCode } = req.body;

  if (!countryCode) {
    return res.status(400).json({ message: "Country code is required" });
  }

  try {
    const user = await User.findById(req.user._id);
    const alreadyLiked = user.favorites.includes(countryCode);

    if (alreadyLiked) {
      user.favorites = user.favorites.filter((c) => c !== countryCode);
    } else {
      user.favorites.push(countryCode);
    }

    await user.save();
    res.json({ favorites: user.favorites });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update favorites", error: err.message });
  }
};

//Get favorites of logged-in user
// GET /api/users/favorites
export const getUserFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ favorites: user.favorites });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch favorites", error: err.message });
  }
};
