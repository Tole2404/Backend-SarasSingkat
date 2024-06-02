const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendJsonResponse } = require("../utils/responseHelper");

exports.signup = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();
    sendJsonResponse(res, 201, "User created successfully", {
      userId: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    });
  } catch (error) {
    sendJsonResponse(res, 500, "Error creating user", { error: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return sendJsonResponse(res, 401, "Invalid credentials");
    }
    const token = jwt.sign({ userId: user._id, role: user.role }, "your_jwt_secret", { expiresIn: "1h" });
    sendJsonResponse(res, 200, "Login successful", {
      token,
      userId: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    sendJsonResponse(res, 500, "Error during login", { error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  const { userId } = req.params;
  const { name, email, role } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return sendJsonResponse(res, 404, "User not found");
    }
    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;
    await user.save();
    sendJsonResponse(res, 200, "User updated successfully", {
      userId: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    sendJsonResponse(res, 500, "Error updating user", { error: error.message });
  }
};

exports.getUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return sendJsonResponse(res, 404, "User not found");
    }
    sendJsonResponse(res, 200, "User retrieved successfully", {
      userId: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profilePic: user.profilePic,
    });
  } catch (error) {
    sendJsonResponse(res, 500, "Error retrieving user", { error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    sendJsonResponse(res, 200, "All users retrieved successfully", { users });
  } catch (error) {
    sendJsonResponse(res, 500, "Error retrieving users", { error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return sendJsonResponse(res, 404, "User not found");
    }
    sendJsonResponse(res, 200, "User deleted successfully");
  } catch (error) {
    sendJsonResponse(res, 500, "Error deleting user", { error: error.message });
  }
};

exports.updateProfilePic = async (req, res) => {
  const { userId } = req.params;
  const profilePicPath = req.file.path;

  try {
    const user = await User.findByIdAndUpdate(userId, { profilePic: profilePicPath }, { new: true });
    if (!user) {
      return sendJsonResponse(res, 404, "User not found");
    }
    sendJsonResponse(res, 200, "Profile picture updated successfully", {
      userId: user._id,
      profilePic: user.profilePic,
    });
  } catch (error) {
    sendJsonResponse(res, 500, "Error updating profile picture", { error: error.message });
  }
};
