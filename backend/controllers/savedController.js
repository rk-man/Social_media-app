const Saved = require("./../models/savedModel");
const Photo = require("./../models/photoModel");

exports.saveOrUnsaveUpload = async (req, res, next) => {
    try {
        let savedData = await Saved.findOne({
            savedBy: req.user._id,
            upload: req.params.id,
        });

        if (!savedData) {
            let newSavedData = await Saved.create({
                savedBy: req.user._id,
                upload: req.params.id,
            });

            console.log("Saving");

            return res.status(200).json({
                status: "success",
                newSavedData,
            });
        }

        console.log("Unsaving");

        await savedData.delete();

        return res.status(200).json({
            status: "success",
        });
    } catch (err) {
        return res.status(400).json({
            status: "fail",
            message: "Couldn't save or unsave a photo",
            err,
        });
    }
};

exports.getAllSavedOfUser = async (req, res, next) => {
    try {
        const saved = await Saved.find({
            savedBy: req.user._id,
        });

        return res.status(200).json({
            status: "success",
            saved,
        });
    } catch (err) {
        return res.status(400).json({
            status: "fail",
            message: "Couldn't get all saved of a user",
            err,
        });
    }
};
