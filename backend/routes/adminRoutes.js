const router = require("express").Router();
const adminController = require("./../controllers/adminController");
const userController = require("./../controllers/userController");

router.use(userController.protect, userController.restrictTo("admin"));
router.get("/all-users", adminController.getAllUsersForAdmin);
router.patch("/update-many-users", adminController.updateManyUsers);
router.get("/all-uploads", adminController.getAllUploads);

module.exports = router;
