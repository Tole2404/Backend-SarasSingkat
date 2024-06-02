const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["pembaca", "penulis"], default: "pembaca" },
    profilePic: { type: String, default: "/public/assets/komeng.jpg" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
