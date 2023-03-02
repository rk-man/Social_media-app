const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const followerSchema = new mongoose.Schema(
    {
        followedBy: {
            type: mongoose.Schema.ObjectId,
            required: [true, "A user who follows the followee"],
            ref: "User",
        },

        followee: {
            type: mongoose.Schema.ObjectId,
            required: [true, "A user who is being followed"],
            ref: "User",
        },

        status: {
            type: Boolean,
            required: [true, "Status must be specified"],
            default: false,
        },
    },
    {
        timestamps: {
            createdAt: true,
            updatedAt: false,
        },
    }
);

followerSchema.index({ followedBy: 1, followee: 1 }, { unique: true });

followerSchema.plugin(uniqueValidator);

followerSchema.pre("save", function (next) {
    if (this.followedBy.valueOf() === this.followee.valueOf()) {
        throw new Error("You can't follow you");
    }
    next();
});

followerSchema.pre(/^find/, function (next) {
    this.populate({
        path: "followedBy",
        select: "_id username profileImage fullName",
    }).populate({
        path: "followee",
        select: "_id username profileImage fullName",
    });
    next();
});

const Follower = mongoose.model("Follower", followerSchema);
module.exports = Follower;
