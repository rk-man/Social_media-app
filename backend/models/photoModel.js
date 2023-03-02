const mongoose = require("mongoose");
require("./commentModel");
require("./savedModel");

const photoSchema = new mongoose.Schema(
    {
        // images, genre, exif, gears, description, likes

        owner: {
            type: mongoose.Schema.ObjectId,
            required: [true, "A photo must be associated with a user"],
            ref: "User",
        },

        description: {
            type: String,
            maxLength: [500, "description can only be 500 characters long"],
            default: "",
        },

        //         likes: {
        //             type: [
        //                 {
        //                     _id: {
        //                         type: mongoose.Schema.ObjectId,
        //                         required: [true, "user must be associated with a like"],
        //                         ref: "User",
        //                     },
        //
        //                     profileImage: {
        //                         type: String,
        //                         required: [true, "A user must have a profile Image"],
        //                     },
        //
        //                     username: {
        //                         type: String,
        //                         required: [true, "A user must have a username"],
        //                     },
        //                 },
        //             ],
        //             default: [],
        //         },

        images: {
            type: [
                {
                    url: {
                        type: String,
                    },
                    genre: {
                        type: [String],

                        enum: {
                            values: [
                                "portrait",
                                "landscape",
                                "sports",
                                "food",
                                "abstract",
                                "others",
                            ],
                        },
                        default: ["others"],
                    },
                    exif: {
                        type: String,
                    },
                    gears: {
                        type: String,
                    },

                    soloDescription: {
                        type: String,
                        default: "",
                        maxlength: [200, "Can't be more than 200 characters"],
                    },
                },
            ],
            required: [true, "User must upload some images"],
        },
    },
    {
        timestamps: {
            createdAt: true,
            updatedAt: false,
        },
        toJSON: {
            virtuals: true,
        },

        toObject: { virtuals: true },
    }
);

photoSchema.virtual("likes", {
    ref: "Like",
    foreignField: "upload",
    localField: "_id",
});

photoSchema.virtual("comments", {
    ref: "Comment",
    foreignField: "upload",
    localField: "_id",
});

photoSchema.virtual("saved", {
    ref: "Saved",
    foreignField: "upload",
    localField: "_id",
});

photoSchema.pre(/^find/, function (next) {
    this.populate({
        path: "owner",
        select: "_id username profileImage",
    });
    next();
});

const Photo = mongoose.model("Photo", photoSchema);
module.exports = Photo;
