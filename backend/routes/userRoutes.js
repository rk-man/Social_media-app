const express = require("express");
const userController = require("./../controllers/userController");
const followerRouter = require("./followerRoutes");
const adminRouter = require("./adminRoutes");
const photoRouter = require("./photoRoutes");

const router = express.Router();

// REROUTING
router.use("/follows", followerRouter);
router.use("/admin", adminRouter);
router.use("/uploads", photoRouter);

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);

router.get("/me", userController.protect, userController.getMe);
router.patch(
    "/update",
    userController.protect,
    userController.uploadImageCloudinary,
    userController.updateUser
);

router.get("/search", userController.protect, userController.searchUsers);

module.exports = router;
