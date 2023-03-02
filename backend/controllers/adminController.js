const User = require("./../models/userModel");
const Photo = require("./../models/photoModel");

exports.getAllUsersForAdmin = async (req, res, next) => {
    try {
        const users = await User.find();
        return res.status(200).json({
            status: "success",
            role: req.user.role,
            users,
        });
    } catch (err) {
        return res.status(400).json({
            status: "fail",
            err,
            role: req.user.role,
            message: "Couldn't get all users",
        });
    }
};

exports.updateManyUsers = async (req, res, next) => {
    try {
        let users = [];
        for (let id of req.body.users) {
            let data = await User.findById(id);
            users.push(data);
        }

        let updatedUsers = [];
        for (let user of users) {
            let updatedUser = await User.findByIdAndUpdate(
                user._id,
                req.body.data,
                {
                    new: true,
                    runValidators: true,
                }
            );
            updatedUsers.push(updatedUser);
        }

        return res.status(200).json({
            status: "success",
            users: updatedUsers,
        });
    } catch (err) {
        return res.status(400).json({
            status: "fail",
            err,
            role: req.user.role,
            message: "Couldn't update many users",
        });
    }
};

exports.getAllUploads = async (req, res, next) => {
    try {
        const uploads = await Photo.find().sort({ createdAt: -1 });
        return res.status(200).json({
            status: "success",
            totalUploads: uploads.length,
            uploads,
        });
    } catch (err) {
        return res.status(400).json({
            status: "fail",
            message: "Couldn't get the photos",
        });
    }
};
