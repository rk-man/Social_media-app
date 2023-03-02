const followerController = require("./../controllers/followerController");
const userController = require("./../controllers/userController");

const router = require("express").Router();

router.use(userController.protect);
router.get("/user-follows", followerController.getAllUserFollowData);
router.get("/followers", followerController.getAllFollowers);
router.post("/send-request", followerController.createFollower);
router.get("/following", followerController.getAllFollowingUsers);
router.patch("/:id/send-response", followerController.acceptOrDeclineFollow);
router.delete("/:id/cancel-request", followerController.cancelFollowRequest);
router.get(
    "/notifications",
    followerController.getSentRequestsAndPendingRequests
);
router.get("/all-follows", followerController.getAllFollows);
// /followers/following

module.exports = router;
