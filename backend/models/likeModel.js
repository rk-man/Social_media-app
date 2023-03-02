const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Photo = require("./photoModel");

const likeSchema = new mongoose.Schema(
    {
        likedBy: {
            type: mongoose.Schema.ObjectId,
            required: [true, "Person who liked this photo should be specified"],
            ref: "User",
        },

        upload: {
            type: mongoose.Schema.ObjectId,
            required: [true, "Photo being liked should be specified"],
            ref: "Photo",
        },

        status: {
            type: Boolean,
            required: [true, "Status must be specified"],
            default: true,
        },
    },
    {
        timestamps: {
            createdAt: true,
            updatedAt: false,
        },
    }
);

likeSchema.index({ likedBy: 1, upload: 1 }, { unique: true });

likeSchema.plugin(uniqueValidator);

// likeSchema.pre("save", async function (next) {
//     this.l = await this.constructor.findOne();
//     next();
// });
//
// likeSchema.post("save", async function () {
//     let data = await this.l.constructor.find({
//         upload: this.upload,
//         status: true,
//     });
//     console.log(data);
//     let updatedData = await Photo.findByIdAndUpdate(
//         this.upload,
//         {
//             likes: data.map((d) => {
//                 return {
//                     _id: d.likedBy._id,
//                     profileImage: d.likedBy.profileImage,
//                     username: d.likedBy.username,
//                 };
//             }),
//         },
//         {
//             new: true,
//             runValidators: true,
//         }
//     );
//     console.log(updatedData);
// });

likeSchema.pre(/^find/, function (next) {
    this.populate({
        path: "likedBy",
        select: "_id username profileImage",
    }).populate({
        path: "upload",
        select: "_id owner",
    });
    next();
});

const Like = mongoose.model("Like", likeSchema);
module.exports = Like;
