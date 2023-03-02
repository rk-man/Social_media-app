const router = require("express").Router({ mergeParams: true });
const savedController = require("./../controllers/savedController");
const userController = require("./../controllers/userController");

router.use(userController.protect);
router.post("/:id", savedController.saveOrUnsaveUpload);
router.get("/", savedController.getAllSavedOfUser);

module.exports = router;
