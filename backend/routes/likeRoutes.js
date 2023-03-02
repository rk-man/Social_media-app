const userController = require("./../controllers/userController");
const likeController = require("./../controllers/likeController");
const router = require("express").Router({ mergeParams: true });
router.use(userController.protect);
router.post("/like", likeController.addOrRemoveLike);
router.get("/", likeController.getAllLikesOfUpload);

module.exports = router;
