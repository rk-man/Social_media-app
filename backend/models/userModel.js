const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: [true, "First Name is necessary"],
            maxLength: [100, "First Name can only be 100 characters long"],
            minLength: [2, "Must be at least 5 characters long"],
        },

        lastName: {
            type: String,
            required: [true, "First Name is necessary"],
            maxLength: [100, "First Name can only be 100 characters long"],
            minLength: [2, "Must be at least 5 characters long"],
        },

        fullName: {
            type: String,
        },

        username: {
            type: String,
            required: [true, "Username is necessary"],
            maxLength: [50, "username can only be 50 characters long"],
            minLength: [5, "Must be at least 5 characters long"],
            unique: true,
            match: /^\S*$/,
        },

        email: {
            type: String,
            required: [true, "An account must have a email"],
            unique: true,
            validate: [isEmail, "Invalid Email"],
        },

        password: {
            type: String,
            match: [
                /^(?!.*\s)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).{10,50}$/,
                "A password must have at least one small letter, one capital letter, one special symbol and must be more than 10 characters long",
            ],
            required: [true, "An account must have a password"],
            //when I query the data, password won't be displayed
            select: false,
        },

        role: {
            type: String,
            required: [true, "A User must have a role"],
            enum: {
                values: ["user", "admin"],
            },
            default: "user",
        },

        profileImage: {
            type: String,
            required: [true, "User must have a profile image"],
            default:
                "https://res.cloudinary.com/rk-man/image/upload/v1673001141/social-media-app/user-profiles/default-profile.png",
        },

        bio: {
            type: String,
            default: "",
            maxLength: [300, "bio can only be 300 characters long"],
        },

        website: {
            type: String,
            default: "",
        },

        instagram: {
            type: String,
            default: "",
        },

        twitter: {
            type: String,
            default: "",
        },

        otherLink: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: {
            createdAt: true,
            updatedAt: false,
        },
    }
);

userSchema.methods.comparePassword = async function (
    enteredPassword,
    storedPassword
) {
    return await bcrypt.compare(enteredPassword, storedPassword);
};

// pre-save hooks and post-save hooks

//1 hash the password
userSchema.pre("save", async function (next) {
    //if the password is not modified
    if (!this.isModified("password")) {
        return next();
    }

    //if the password is created or updated
    this.password = await bcrypt.hash(this.password, 12);
    this.fullName = this.firstName + " " + this.lastName;
    next();
});

userSchema.methods.comparePassword = async function (
    enteredPassword,
    storedPassword
) {
    return await bcrypt.compare(enteredPassword, storedPassword);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
