const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema(
    {
        commentedBy: {
            type: mongoose.Schema.ObjectId,
            required: [true, "Person who liked this photo should be specified"],
            ref: "User",
        },

        upload: {
            type: mongoose.Schema.ObjectId,
            required: [true, "Photo being liked should be specified"],
            ref: "Photo",
        },

        comment: {
            type: String,
            maxLength: [500, "Comment can't be more than 500 characters"],
            required: [true, "Must type something in the comment"],
        },
    },
    {
        timestamps: {
            createdAt: true,
            updatedAt: false,
        },
    }
);

commentSchema.pre(/^find/, function (next) {
    this.populate({
        path: "commentedBy",
        select: "_id username profileImage",
    }).populate({
        path: "upload",
        select: "_id owner",
    });
    next();
});

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
