const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const savedSchema = new mongoose.Schema(
    {
        savedBy: {
            type: mongoose.Schema.ObjectId,
            required: [true, "Person who saved this photo should be specified"],
            ref: "User",
        },

        upload: {
            type: mongoose.Schema.ObjectId,
            required: [true, "Photo being saved should be specified"],
            ref: "Photo",
        },
    },
    {
        timestamps: {
            createdAt: true,
            updatedAt: false,
        },
    }
);

savedSchema.index({ savedBy: 1, upload: 1 }, { unique: true });

savedSchema.plugin(uniqueValidator);

savedSchema.pre(/^find/, function (next) {
    this.populate({
        path: "savedBy",
        select: "_id username profileImage",
    }).populate({
        path: "upload",
        select: "_id owner likes images description createdAt",
        populate: [
            {
                path: "likes",
                select: "_id likedBy status",
            },
        ],
    });

    next();
});

const Saved = mongoose.model("Saved", savedSchema);
module.exports = Saved;
