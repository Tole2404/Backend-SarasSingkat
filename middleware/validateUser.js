module.exports = (req, res, next) => {
  const { name, email, password, role } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }
  // Add more validation as needed
  next();
};
