import React from "react";
import { useState } from "react";
import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import PhotoContext from "../contexts/photoContext";
import "./../styles/photo.css";
import EachPhoto from "../components/EachPhoto";
import LoadingSpinner from "./../utils/LoadingSpinner";
import { FaRegBookmark, FaBookmark, FaEllipsisH } from "react-icons/fa";
import {
    AiOutlineComment,
    AiOutlineCamera,
    AiFillCamera,
    AiOutlineShareAlt,
} from "react-icons/ai";
import useLikeSystem from "../hooks/useLikeSystem";
import useSavedUpload from "../hooks/useSavedUpload";
import EachComment from "../components/EachComment";
import AuthContext from "../contexts/authContext";
import { FaPaperPlane, FaPlus } from "react-icons/fa";

function SingleUploadPage() {
    const {
        authUser,
        follows,
        checkUserFollowInfo,
        sendFollowRequest,
        unfollowOrCancelFollow,
        getAllFollows,
        setFollows,
    } = useContext(AuthContext);
    const { getSinglePhoto, createComment } = useContext(PhotoContext);
    const { id } = useParams();
    const [upload, setUpload] = useState(null);
    const [loading, setLoading] = useState(true);
    const { addOrRemoveLike, checkIfUserAlreadyLiked } = useLikeSystem();
    const { saveOrUnsaveUpload, checkIfUserSavedUpload } = useSavedUpload();
    const { getUserSavedUploads, setSavedUploads, savedUploads } =
        useContext(PhotoContext);

    const [isLiked, setIsLiked] = useState(false);

    const [isSaved, setIsSaved] = useState(false);

    const [likes, setLikes] = useState([]);
    const [comments, setComments] = useState([]);
    const [userLiking, setUserLiking] = useState(false);

    const [commentData, setCommentData] = useState("");

    const [followStatus, setFollowStatus] = useState(false);
    const [followData, setFollowData] = useState(null);

    useEffect(() => {
        if (!isLiked && userLiking) {
            setLikes(likes - 1);
            setUserLiking(false);
        } else if (isLiked && userLiking) {
            setLikes(likes + 1);
            setUserLiking(false);
        }
    }, [isLiked]);

    useEffect(() => {
        getSinglePhoto(id).then((res) => {
            setUpload(res);
            console.log(res);
            setLoading(false);
        });
    }, [id]);

    useEffect(() => {
        if (upload) {
            setIsLiked(checkIfUserAlreadyLiked(upload.likes));
            setIsSaved(checkIfUserSavedUpload(upload._id));
            setLikes(
                upload.likes.filter((like, index) => {
                    return like.status === true;
                }).length
            );
            setComments(upload.comments);
            checkUserFollowInfo(upload.owner._id).then((res) => {
                setFollowStatus(res.status);
                setFollowData(
                    res.followData.length > 0 ? res.followData[0] : null
                );
            });
        }
    }, [upload, follows]);

    const handleFollowSubmit = (e) => {
        e.preventDefault();
        if (followStatus === "cancel" || followStatus === "unfollow") {
            unfollowOrCancelFollow(followData._id).then(() => {
                getAllFollows().then((res) => {
                    setFollows(res);
                });
            });
        } else if (followStatus === "follow") {
            sendFollowRequest(upload.owner._id).then(() => {
                getAllFollows().then((res) => {
                    setFollows(res);
                });
            });
        }
    };

    return (
        <div className="single-photo-container">
            {loading && <LoadingSpinner />}
            {upload && (
                <div className="single-photo-first-container">
                    <div className="single-photo-owner">
                        <div className="single-photo-owner-img-wrapper">
                            <img
                                src={upload.owner.profileImage}
                                alt={upload.owner.username}
                                className="single-photo-owner-img"
                            />
                        </div>

                        <div className="single-photo-owner-details">
                            <h3>{upload.owner.username}</h3>
                        </div>

                        {authUser.user._id !== upload.owner._id && (
                            <button
                                className="btn btn-tertiary add-comment-btn"
                                onClick={handleFollowSubmit}
                            >
                                {followStatus === "unfollow" && "Unfollow"}
                                {followStatus === "follow" && `Follow`}
                                {followStatus === "cancel" && "Cancel"}
                            </button>
                        )}
                    </div>

                    {upload.description.length > 0 && (
                        <div className="single-photo-overall-description">
                            <p>{upload.description}</p>
                        </div>
                    )}

                    <div className="single-photo-icons">
                        <div className="each-upload-footer-icons">
                            <div className="each-upload-footer-icons-left-wrapper">
                                <div className="each-upload-footer-icons-left">
                                    {isLiked ? (
                                        <AiFillCamera
                                            className="icon-medium"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                addOrRemoveLike(upload._id);
                                                setIsLiked((prev) => {
                                                    return !prev;
                                                });
                                                setUserLiking(true);
                                            }}
                                        />
                                    ) : (
                                        <AiOutlineCamera
                                            className="icon-medium"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                addOrRemoveLike(upload._id);
                                                setIsLiked((prev) => {
                                                    return !prev;
                                                });
                                                setUserLiking(true);
                                            }}
                                        />
                                    )}

                                    <AiOutlineComment className="icon-medium" />
                                    <AiOutlineShareAlt className="icon-medium" />
                                </div>
                                <p className="each-upload-footer-like single-photo-like">
                                    {likes}
                                </p>
                            </div>
                            {isSaved ? (
                                <FaBookmark
                                    className="icon-medium each-upload-footer-bookmark-icon"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        saveOrUnsaveUpload(upload._id);
                                        setIsSaved((prev) => {
                                            return !prev;
                                        });

                                        setSavedUploads(
                                            savedUploads.filter((saved) => {
                                                return (
                                                    saved.upload._id !==
                                                    upload._id
                                                );
                                            })
                                        );
                                    }}
                                />
                            ) : (
                                <FaRegBookmark
                                    className="icon-medium each-upload-footer-bookmark-icon"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        saveOrUnsaveUpload(upload._id);
                                        setIsSaved((prev) => {
                                            return !prev;
                                        });
                                    }}
                                />
                            )}
                        </div>
                    </div>
                    <div className="all-comments">
                        <div className="all-comments-add-comment-wrapper">
                            <div className="all-comments-add-comment">
                                <div className="all-comments-add-comment-img-wrapper">
                                    <img
                                        src={authUser.user.profileImage}
                                        alt={authUser.user.username}
                                        className="all-comments-add-comment-img"
                                    />
                                </div>
                                <textarea
                                    id="add-comment"
                                    rows="3"
                                    cols="30"
                                    onChange={(e) => {
                                        e.preventDefault();
                                        setCommentData(e.target.value);
                                    }}
                                    value={commentData.comment}
                                ></textarea>
                            </div>
                            <button
                                className="add-comment-btn btn btn-tertiary"
                                onClick={(e) => {
                                    e.preventDefault();
                                    createComment(upload._id, commentData).then(
                                        () => {
                                            getSinglePhoto(id).then((res) => {
                                                setUpload(res);
                                                console.log(res);
                                                setLoading(false);
                                            });
                                        }
                                    );
                                }}
                            >
                                <FaPaperPlane className="icon-small" />
                                Send
                            </button>
                        </div>
                        {comments.length > 0 ? (
                            comments.map((c, index) => {
                                return <EachComment comment={c} key={c._id} />;
                            })
                        ) : (
                            <h3>No comments</h3>
                        )}
                    </div>
                </div>
            )}

            {upload && (
                <div className="all-photos">
                    {upload.images.map((img) => {
                        return (
                            <EachPhoto
                                photo={img}
                                owner={upload.owner}
                                key={img._id}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default SingleUploadPage;
