const Follower = require("./../models/followerModel");
const mongoose = require("mongoose");

exports.createFollower = async (req, res, next) => {
    try {
        const follower = await Follower.create({
            followedBy: req.user._id,
            followee: req.body.followeeID,
        });
        return res.status(201).json({
            status: "success",
            follower,
        });
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            status: "fail",
            err: err,
            message: "couldn't follow",
        });
    }
};

exports.getAllFollowers = async (req, res, next) => {
    try {
        const followers = await Follower.find({ followee: req.user._id });
        return res.status(200).json({
            status: "success",
            total_followers: followers.length,
            followers,
        });
    } catch (err) {
        return res.status(400).json({
            status: "fail",
            err: err,
            message: "couldn't get user's followers",
        });
    }
};

exports.getAllFollowingUsers = async (req, res, next) => {
    try {
        const followingUsers = await Follower.find({
            followedBy: req.user._id,
        });
        return res.status(200).json({
            status: "success",
            total_following_users: followingUsers.length,
            followingUsers,
        });
    } catch (err) {
        return res.status(400).json({
            status: "fail",
            err: err,
            message: "couldn't get all following",
        });
    }
};

exports.acceptOrDeclineFollow = async (req, res, next) => {
    try {
        let followData = await Follower.findById(req.params.id);

        if (!followData) {
            return res.status(400).json({
                status: "fail",
                message: "The follower data is not present",
            });
        }

        if (req.body.status === "declined") {
            await Follower.findByIdAndDelete(followData._id);
            return res.status(204).json({
                status: "success",
                message: "data deleted successfully",
            });
        }
        let updatedData = null;
        if (req.body.status === "accepted") {
            updatedData = await Follower.findByIdAndUpdate(
                followData._id,
                {
                    status: true,
                },
                {
                    new: true,
                    runValidators: true,
                }
            );
        }

        return res.status(200).json({
            status: "success",
            followData: updatedData,
        });
    } catch (err) {
        return res.status(400).json({
            status: "fail",
            err: err,
            message: "Couldn't accepts or decline request",
        });
    }
};

exports.cancelFollowRequest = async (req, res, next) => {
    try {
        let followData = await Follower.findById(req.params.id);
        if (!followData) {
            return res.status(404).json({
                status: "fail",
                message: "Follow Data not found",
            });
        }
        await followData.delete();

        return res.status(204).json({
            status: "success",
            message: "Cancelled Follow Request Successfully",
        });
    } catch (err) {
        return res.status(400).json({
            status: "fail",
            err: err,
            message: "Couldn't cancel follow request",
        });
    }
};

exports.getSentRequestsAndPendingRequests = async (req, res, next) => {
    try {
        const data = await Follower.find({
            status: false,
            $or: [{ followedBy: req.user._id }, { followee: req.user._id }],
        });

        let requestsSent = data.filter((d) => {
            return mongoose.Types.ObjectId(d.followedBy._id).equals(
                req.user._id
            );
        });

        let pendingRequests = data.filter((d) => {
            return mongoose.Types.ObjectId(d.followee._id).equals(req.user._id);
        });

        return res.status(200).json({
            status: "success",
            requestsSent,
            pendingRequests,
        });
    } catch (err) {
        return res.status(400).json({
            status: "fail",
            err: err,
            message: "Couldn't get all sent requests and pending requests",
        });
    }
};

exports.getAllFollows = async (req, res, next) => {
    try {
        const follows = await Follower.find({
            followedBy: req.user._id,
        });

        return res.status(200).json({
            status: "success",
            follows,
        });
    } catch (err) {
        return res.status(400).json({
            status: "fail",
            err: err,
            message: "Couldn't get all follow Data",
        });
    }
};

exports.getAllUserFollowData = async (req, res, next) => {
    try {
        const followData = await Follower.find({
            $or: [
                {
                    followedBy: req.user._id,
                },
                {
                    followee: req.user._id,
                },
            ],
            status: true,
        });

        let followingUsers = followData.filter((f) => {
            return mongoose.Types.ObjectId(f.followedBy._id).equals(
                req.user._id
            );
        });

        let followers = followData.filter((f) => {
            return mongoose.Types.ObjectId(f.followee._id).equals(req.user._id);
        });
        return res.status(200).json({
            status: "success",
            followingUsers,
            followers,
        });
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            status: "fail",
            err: err,
            message: "Couldn't get all follow Data",
        });
    }
};
