const express = require("express");
const router = express.Router();
const multer = require("multer");
const userController = require("../controllers/userController");
const validateUser = require("../middleware/validateUser");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Routes
router.post("/signup", validateUser, userController.signup);
router.post("/login", validateUser, userController.login);
router.put("/update/:userId", validateUser, userController.updateUser);
router.get("/user/:userId", userController.getUser);
router.get("/users", userController.getAllUsers);
router.delete("/user/:userId", userController.deleteUser);

// Route for uploading profile pictures
router.post("/upload-profile-pic/:userId", upload.single("profilePic"), userController.updateProfilePic);

module.exports = router;
