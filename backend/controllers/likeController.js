const Like = require("./../models/likeModel");

exports.addOrRemoveLike = async (req, res, next) => {
    try {
        let like = await Like.findOne({
            likedBy: req.user._id,
            upload: req.params.id,
        });

        if (!like) {
            let newLike = await Like.create({
                likedBy: req.user._id,
                upload: req.params.id,
            });

            return res.status(201).json({
                status: "success",
                like: newLike,
            });
        }

        // like = await Like.findByIdAndUpdate(
        //     like._id,
        //     { status: !like.status },
        //     { new: true, runValidators: true }
        // );
        await Like.findByIdAndDelete(like._id);

        console.log(like);

        return res.status(200).json({
            status: "success",
            // like,
        });
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            status: "fail",
            err: err,
            message: "couldn't like this photo",
        });
    }
};

exports.getAllLikesOfUpload = async (req, res, next) => {
    try {
        let likes = await Like.find({
            upload: req.params.id,
        });

        return res.status(200).json({
            status: "success",
            totalLikes: likes.length,
            likes,
        });
    } catch (err) {
        return res.status(400).json({
            status: "fail",
            err: err,
            message: "couldn't get all likes of a photo",
        });
    }
};
