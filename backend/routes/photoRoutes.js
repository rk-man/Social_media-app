const express = require("express");
const photoController = require("./../controllers/photoController");
const userController = require("./../controllers/userController");
const likeRouter = require("./likeRoutes");
const commentRouter = require("./commentRoutes");
const savedRouter = require("./savedRoutes");

const router = express.Router();
router.get("/search", userController.protect, photoController.searchUploads);
router.use("/:id/likes", likeRouter);
router.use("/:id/comments", commentRouter);
router.use("/saved", savedRouter);

router.use(userController.protect);
router.get("/all-uploads", photoController.getAllUserUploads);

router.get("/explore", photoController.getAllUploadsForExplore);

router
    .route("/")
    .post(photoController.uploadImageCloudinary, photoController.createPhoto)
    .get(photoController.getUserFeed);

router
    .route("/:id")
    .get(photoController.getPhoto)
    .delete(photoController.deletePhoto)
    .patch(photoController.updatePhoto);

module.exports = router;
