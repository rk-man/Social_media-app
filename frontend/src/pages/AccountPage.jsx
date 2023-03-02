import { useContext, useEffect, useState } from "react";
import AuthContext from "../contexts/authContext";
import "./../styles/user.css";
import { getRandomImage } from "../helpers";
import { FaGlobe, FaInstagram, FaTwitter } from "react-icons/fa";
import EachUploadAccount from "../components/EachUploadAccount";
import PhotoContext from "../contexts/photoContext";
import { Link } from "react-router-dom";

function AccountPage() {
    const { authUser, getAllUserFollowData } = useContext(AuthContext);
    const { userUploads } = useContext(PhotoContext);

    const [followingUsers, setFollowingUsers] = useState([]);
    const [followers, setFollowers] = useState([]);

    useEffect(() => {
        document.querySelector(
            "body"
        ).style.backgroundImage = `url(${getRandomImage()})`;
        return () => {
            document.querySelector("body").style.backgroundImage = "None";
        };
    }, []);

    useEffect(() => {
        getAllUserFollowData().then((res) => {
            setFollowers(res.followers);
            setFollowingUsers(res.followingUsers);
        });
    }, []);

    return (
        <div className="account-page-container">
            {authUser.user && (
                <>
                    <div className="account-page-header">
                        <div className="account-page-user-img-names-container">
                            <div className="account-page-user-img-wrapper">
                                <img
                                    src={authUser.user.profileImage}
                                    alt={authUser.user.username}
                                    className="account-page-user-img"
                                />
                            </div>

                            <div className="account-page-user-names">
                                <p className="account-page-user-names-fullname">
                                    {authUser.user.fullName}
                                </p>
                                <p>@{authUser.user.username}</p>
                                <div className="user-follows">
                                    <Link to="/follows" className="link">
                                        <div className="user-sub-follows">
                                            <p>followers</p>
                                            <p>{followers.length}</p>
                                        </div>
                                    </Link>
                                    <Link to="/follows" className="link">
                                        <div className="user-sub-follows">
                                            <p>following</p>
                                            <p>{followingUsers.length}</p>
                                        </div>
                                    </Link>
                                    <div className="user-sub-follows">
                                        <p>uploads</p>
                                        <p>{userUploads.length}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Link to="/account/edit">
                            <button className="btn btn-tertiary">Edit</button>
                        </Link>
                    </div>

                    <div className="account-page-user-info">
                        <p
                            className="account-page-user-info-bio"
                            style={{ wordBreak: "break-word" }}
                        >
                            {authUser.user.bio}
                        </p>

                        <div className="account-page-links">
                            {authUser.user.website.length > 0 && (
                                <div className="link-container">
                                    <p>Website</p>
                                    <div className="social-media-link">
                                        <FaGlobe className="icon-small" />
                                        <p
                                            style={{
                                                wordBreak: "break-word",
                                            }}
                                        >
                                            <a
                                                href={authUser.user.website}
                                                className="link"
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                {authUser.user.website}
                                            </a>
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="link-container">
                                <p>Social Media</p>
                                <div className="social-media-links">
                                    {authUser.user.instagram.length > 0 && (
                                        <div className="social-media-link">
                                            <FaInstagram className="icon-small" />
                                            <p
                                                style={{
                                                    wordBreak: "break-word",
                                                }}
                                            >
                                                <a
                                                    className="link"
                                                    href={
                                                        authUser.user.instagram
                                                    }
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    {authUser.user.instagram}
                                                </a>
                                            </p>
                                        </div>
                                    )}

                                    {authUser.user.twitter.length > 0 && (
                                        <div className="social-media-link">
                                            <FaTwitter className="icon-small" />
                                            <p
                                                style={{
                                                    wordBreak: "break-word",
                                                }}
                                            >
                                                <a
                                                    className="link"
                                                    href={authUser.user.twitter}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    {authUser.user.twitter}
                                                </a>
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="account-page-all-uploads">
                        {userUploads.length > 0 ? (
                            userUploads.map((upload) => {
                                return (
                                    <EachUploadAccount
                                        upload={upload}
                                        key={upload._id}
                                    />
                                );
                            })
                        ) : (
                            <h3>No feeds to show</h3>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

export default AccountPage;
