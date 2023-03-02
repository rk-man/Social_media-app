import { getRandomImage } from "./../helpers";
import React, { useContext, useEffect, useState } from "react";
import { BACKEND_URL } from "../config";
import AuthContext from "../contexts/authContext";
import "./../styles/form.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../utils/LoadingSpinner";

function AccountEditPage() {
    const { updateUser, resetAuth, authUser } = useContext(AuthContext);

    const [loading, setLoading] = useState(false);

    const [userData, setUserData] = useState({
        username: "",
        firstName: "",
        email: "",
        lastName: "",
        username: "",
        bio: "",
        website: "",
        instagram: "",
        twitter: "",
        otherLink: "",
        id: "",
    });

    const [originalUserData, setOriginalUserData] = useState({
        username: "",
        firstName: "",
        email: "",
        lastName: "",
        username: "",
        bio: "",
        website: "",
        instagram: "",
        twitter: "",
        otherLink: "",
        id: "",
    });

    const [profileImage, setProfileImage] = useState({
        image: "",
        updated: false,
    });

    const [originalProfileImage, setOriginalProfileImage] = useState({
        image: "",
        updated: false,
    });

    const navigate = useNavigate();

    useEffect(() => {
        if (authUser.user && authUser.success) {
            toast.success("Updated Successfully");
            resetAuth();
            navigate("/account");
            setLoading(false);
        } else if (authUser.error && authUser.message) {
            toast.error(authUser.message);
            resetAuth();
            navigate("/account");
            setLoading(false);
        }
    }, [
        authUser.user,
        authUser.success,
        authUser.error,
        authUser.message,
        navigate,
    ]);
    useEffect(() => {
        document.querySelector(
            "body"
        ).style.backgroundImage = `url(../${getRandomImage()})`;
        return () => {
            document.querySelector("body").style.backgroundImage = "None";
        };
    }, []);

    useEffect(() => {
        if (authUser.user) {
            setUserData({
                username: authUser.user.username,
                firstName: authUser.user.firstName
                    ? authUser.user.firstName
                    : "",
                fullName: authUser.user.fullName ? authUser.user.fullName : "",

                email: authUser.user.email,
                lastName: authUser.user.lastName ? authUser.user.lastName : "",
                bio: authUser.user.bio ? authUser.user.bio : "",
                website: authUser.user.website ? authUser.user.website : "",
                instagram: authUser.user.instagram
                    ? authUser.user.instagram
                    : "",
                twitter: authUser.user.twitter ? authUser.user.twitter : "",
                otherLink: authUser.user.otherLink
                    ? authUser.user.otherLink
                    : "",
                id: authUser.user._id,
            });
            setOriginalUserData({
                username: authUser.user.username,
                firstName: authUser.user.firstName
                    ? authUser.user.firstName
                    : "",
                fullName: authUser.user.fullName ? authUser.user.fullName : "",
                email: authUser.user.email,
                lastName: authUser.user.lastName ? authUser.user.lastName : "",
                bio: authUser.user.bio ? authUser.user.bio : "",
                website: authUser.user.website ? authUser.user.website : "",
                instagram: authUser.user.instagram
                    ? authUser.user.instagram
                    : "",
                twitter: authUser.user.twitter ? authUser.user.twitter : "",
                otherLink: authUser.user.otherLink
                    ? authUser.user.otherLink
                    : "",
                id: authUser.user._id,
            });

            imageUrlToBase64(authUser.user.profileImage).then((res) => {
                setProfileImage({
                    image: res,
                    updated: false,
                });
                setOriginalProfileImage({
                    image: res,
                    updated: false,
                });
            });
        }
    }, [authUser]);

    const convertToBase64String = (file) => {
        if (file === undefined) return;
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onloadend = () => {
            setProfileImage({
                image: reader.result,
                updated: true,
            });
        };
    };

    const imageUrlToBase64 = (url) =>
        fetch(url)
            .then((response) => response.blob())
            .then(
                (blob) =>
                    new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onloadend = () => resolve(reader.result);
                        reader.onerror = reject;
                        reader.readAsDataURL(blob);
                    })
            );

    const handleFileUpload = (e) => {
        e.preventDefault();
        convertToBase64String(e.target.files[0]);
    };

    const handleChangeUserData = (e) => {
        e.preventDefault();
        setUserData((prev) => {
            return {
                ...prev,
                [`${e.target.id}`]: e.target.value,
            };
        });
    };

    const handleUpdateUser = (e) => {
        e.preventDefault();
        setLoading(true);
        let data = userData;

        if (profileImage.updated) {
            data = {
                ...data,
                profileImage: profileImage.image,
            };
        }
        updateUser(data);
    };

    const resetChanges = (e) => {
        e.preventDefault();
        setProfileImage(originalProfileImage);
        setUserData(originalUserData);
    };

    return (
        <div className="form-wrapper">
            {loading && <LoadingSpinner />}
            <form className="form" onSubmit={handleUpdateUser}>
                <div className="profile-img-wrapper">
                    <img
                        src={profileImage.image ? profileImage.image : ""}
                        alt={userData ? userData.username : ""}
                        className="profile-img"
                    />
                </div>
                <input type="file" onChange={handleFileUpload} />
                <div className="form-field">
                    <label htmlFor="username" className="form-field-label">
                        Username
                    </label>
                    <input
                        type="text"
                        className="form-field-input"
                        id="username"
                        value={userData.username ? userData.username : ""}
                        onChange={handleChangeUserData}
                    />
                </div>

                <div className="form-field">
                    <label htmlFor="firstName" className="form-field-label">
                        firstName
                    </label>
                    <input
                        type="text"
                        className="form-field-input"
                        value={userData.firstName ? userData.firstName : ""}
                        onChange={handleChangeUserData}
                        id="firstName"
                    />
                </div>

                <div className="form-field">
                    <label htmlFor="lastName" className="form-field-label">
                        lastName
                    </label>
                    <input
                        type="text"
                        className="form-field-input"
                        id="lastName"
                        value={userData.lastName ? userData.lastName : ""}
                        onChange={handleChangeUserData}
                    />
                </div>

                <div className="form-field">
                    <label htmlFor="fullName" className="form-field-label">
                        fullName
                    </label>
                    <input
                        type="text"
                        className="form-field-input"
                        value={userData.fullName ? userData.fullName : ""}
                        onChange={handleChangeUserData}
                        id="fullName"
                    />
                </div>

                <div className="form-field">
                    <label htmlFor="email" className="form-field-label">
                        email
                    </label>
                    <input
                        type="text"
                        className="form-field-input"
                        id="email"
                        value={userData.email ? userData.email : ""}
                        onChange={handleChangeUserData}
                    />
                </div>

                <div className="form-field">
                    <label htmlFor="bio" className="form-field-label">
                        bio
                    </label>
                    <textarea
                        type="text"
                        className="form-field-input"
                        id="bio"
                        value={userData.bio ? userData.bio : ""}
                        onChange={handleChangeUserData}
                        rows={16}
                    ></textarea>
                </div>

                <div className="form-field">
                    <label htmlFor="website" className="form-field-label">
                        website
                    </label>
                    <input
                        type="text"
                        className="form-field-input"
                        id="website"
                        value={userData.website ? userData.website : ""}
                        onChange={handleChangeUserData}
                    />
                </div>

                <div className="form-field">
                    <label htmlFor="instagram" className="form-field-label">
                        instagram
                    </label>
                    <input
                        type="text"
                        className="form-field-input"
                        id="instagram"
                        value={userData.instagram ? userData.instagram : ""}
                        onChange={handleChangeUserData}
                    />
                </div>

                <div className="form-field">
                    <label htmlFor="twitter" className="form-field-label">
                        twitter
                    </label>
                    <input
                        type="text"
                        className="form-field-input"
                        id="twitter"
                        value={userData.twitter ? userData.twitter : ""}
                        onChange={handleChangeUserData}
                    />
                </div>

                <div className="form-field">
                    <label htmlFor="otherLink" className="form-field-label">
                        otherLink
                    </label>
                    <input
                        type="text"
                        className="form-field-input"
                        id="otherLink"
                        value={userData.otherLink ? userData.otherLink : ""}
                        onChange={handleChangeUserData}
                    />
                </div>
                <div className="btns-container">
                    <button className="btn btn-primary" type="submit">
                        Save Changes
                    </button>
                    <button
                        className="btn btn-secondary"
                        onClick={resetChanges}
                    >
                        Reset Changes
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AccountEditPage;
