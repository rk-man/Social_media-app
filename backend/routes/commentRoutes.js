const userController = require("./../controllers/userController");
const commentController = require("./../controllers/commentController");

const router = require("express").Router({ mergeParams: true });

router.use(userController.protect);
router
    .route("/")
    .post(commentController.addComment)
    .get(commentController.getComment);

module.exports = router;
