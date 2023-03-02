const mongoose = require("mongoose");
const Photo = require("./../models/photoModel");
const cloudinary = require("./../config/cloudinary");
const Follower = require("../models/followerModel");
const Saved = require("../models/savedModel");

let uploadToCloudinary = async (file) => {
    const cloudinaryRes = await cloudinary.uploader.upload(file, {
        upload_preset: "ml_default",
        folder: "social-media-app/user-images",
        overwrite: false,
        unique_filename: true,
        format: "jpeg",
    });

    return cloudinaryRes.url;
};

exports.uploadImageCloudinary = async (req, res, next) => {
    try {
        let uploadedImages = [];
        if (req.body.images.length === 0) {
            return res.status(400).json({
                status: "fail",
                message: "Should upload atleast one image",
            });
        }

        for (let img of req.body.images) {
            let result = await uploadToCloudinary(img.url);
            let data = {
                ...img,
                url: result,
            };
            uploadedImages.push(data);
        }
        console.log(uploadedImages);
        req.uploadedImages = uploadedImages;
    } catch (err) {
        console.log(err);
    }

    next();
};

exports.createPhoto = async (req, res, next) => {
    try {
        let data = {
            ...req.body,
            images: req.uploadedImages.map((img) => {
                return {
                    ...img,
                    genre: img.genre.length === 0 ? undefined : img.genre,
                };
            }),
            owner: req.user._id,
        };

        const photo = await Photo.create(data);

        return res.status(200).json({
            status: "success",
            photo,
        });
    } catch (ex) {
        console.log(ex);
    }
};

exports.getPhoto = async (req, res, next) => {
    try {
        const photo = await Photo.findOne({ _id: req.params.id })
            .populate("likes")
            .populate("comments");

        return res.status(200).json({
            status: "success",
            totalLikes: photo.likes.length,
            totalComments: photo.comments.length,
            photo,
        });
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            staus: "fail",
            message: "Couldn't get the photo",
            err,
        });
    }
};

exports.deletePhoto = async (req, res, next) => {
    try {
        await Photo.deleteOne({ _id: req.params.id });
        return res.status(204).json({
            status: "success",
            message: "deleted successfully",
        });
    } catch (err) {
        return res.status(400).json({
            err: err,
            message: "Couldn't delete photo",
        });
    }
};

exports.getUserFeed = async (req, res, next) => {
    try {
        let followings = await Follower.find({
            followedBy: req.user._id,
            status: true,
        });
        followings = followings.map((f) =>
            mongoose.Types.ObjectId(f.followee._id)
        );

        const photos = await Photo.find({
            owner: {
                $in: followings,
            },
        })
            .sort({ createdAt: -1 })
            .populate("likes");

        const savedUploads = await Saved.find({ savedBy: req.user._id });

        return res.status(200).json({
            status: "success",
            photos,
            savedUploads,
        });
    } catch (err) {
        return res.status(400).json({
            staus: "fail",
            message: "Couldn't get the photo",
            err,
        });
    }
};

exports.getAllUploadsForExplore = async (req, res, next) => {
    try {
        let followings = await Follower.find({
            followedBy: req.user._id,
            status: true,
        });

        followings = followings.map((f) =>
            mongoose.Types.ObjectId(f.followee._id)
        );

        const uploads = await Photo.find({
            owner: {
                $nin: [...followings, req.user._id],
            },
        }).populate("likes");

        return res.status(200).json({
            status: "success",
            uploads,
        });
    } catch (err) {
        return res.status(400).json({
            staus: "fail",
            message: "Couldn't get uploads for the explore section",
            err,
        });
    }
};

exports.getAllUserUploads = async (req, res, next) => {
    try {
        const uploads = await Photo.find({ owner: req.user._id }).populate(
            "likes"
        );
        return res.status(200).json({
            status: "success",
            uploads,
        });
    } catch (err) {
        return res.status(400).json({
            staus: "fail",
            message: "Couldn't get all user uploads",
            err,
        });
    }
};

exports.updatePhoto = async (req, res, next) => {
    try {
        const photo = await Photo.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        return res.status(203).json({
            status: "success",
            photo,
        });
    } catch (err) {
        return res.status(400).json({
            staus: "fail",
            message: "Couldn't update this photo",
            err,
        });
    }
};

exports.searchUploads = async (req, res, next) => {
    const genre = req.query.genre.split(" ");
    console.log(req.user);
    try {
        let followings = await Follower.find({
            followedBy: req.user._id,
            status: true,
        });

        followings = followings.map((f) =>
            mongoose.Types.ObjectId(f.followee._id)
        );

        const uploads = await Photo.find({
            "images.genre": {
                $in: genre,
            },
            owner: {
                $nin: [...followings, req.user._id],
            },
        }).populate("likes");

        return res.status(200).json({
            uploads,
        });
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            err,
        });
    }
};
