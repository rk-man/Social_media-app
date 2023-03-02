const Comment = require("./../models/commentModel");

exports.addComment = async (req, res, next) => {
    try {
        const comment = await Comment.create({
            commentedBy: req.user._id,
            upload: req.params.id,
            comment: req.body.comment,
        });

        return res.status(200).json({
            status: "success",
            comment,
        });
    } catch (err) {
        return res.status(400).json({
            status: "fail",
            message: "Couldn't create comment",
            err,
        });
    }
};

exports.getComment = async (req, res, next) => {
    try {
        const comment = await Comment.findOne({ _id: req.params.id });

        return res.status(200).json({
            status: "success",
            comment,
        });
    } catch (err) {
        return res.status(400).json({
            staus: "fail",
            message: "Couldn't get the comment",
            err,
        });
    }
};
