import { convertDateToString } from "../helpers";
// FaBookmark - covered // FaRegBookmark - uncovered
import { FaRegBookmark, FaBookmark, FaEllipsisH } from "react-icons/fa";
import { Link } from "react-router-dom";
import {
    AiOutlineComment,
    AiOutlineCamera,
    AiFillCamera,
    AiOutlineShareAlt,
} from "react-icons/ai";
import useLikeSystem from "../hooks/useLikeSystem";
import { useState, useEffect, useContext } from "react";
import useSavedUpload from "../hooks/useSavedUpload";
import PhotoContext from "../contexts/photoContext";

function EachUpload({ upload }) {
    const { addOrRemoveLike, checkIfUserAlreadyLiked } = useLikeSystem();
    const { saveOrUnsaveUpload, checkIfUserSavedUpload } = useSavedUpload();
    const { getUserSavedUploads, setSavedUploads, savedUploads } =
        useContext(PhotoContext);

    const [isLiked, setIsLiked] = useState(
        checkIfUserAlreadyLiked(upload.likes)
    );

    const [isSaved, setIsSaved] = useState(checkIfUserSavedUpload(upload._id));

    const [likes, setLikes] = useState(
        upload.likes.filter((like, index) => {
            return like.status === true;
        }).length
    );
    const [userLiking, setUserLiking] = useState(false);

    useEffect(() => {
        if (!isLiked && userLiking) {
            setLikes(likes - 1);
            setUserLiking(false);
        } else if (isLiked && userLiking) {
            setLikes(likes + 1);
            setUserLiking(false);
        }
    }, [isLiked]);

    return (
        <div className="each-upload">
            <div className="each-upload-header">
                <div className="each-upload-user-details">
                    <div className="each-upload-user-details-profile-img-wrapper">
                        <img
                            src={upload.owner.profileImage}
                            alt={upload.owner.username}
                            className="each-upload-user-details-profile-img"
                        />
                    </div>

                    <div className="each-upload-user-details-info">
                        <p>{upload.owner.username}</p>
                        <p className="each-upload-user-details-info-createdAt">
                            {convertDateToString(upload.createdAt)}
                        </p>
                    </div>
                </div>

                <FaEllipsisH className="icon-small" />
            </div>

            <Link
                to={`/uploads/${upload._id}`}
                style={{ width: "96%", height: "96%" }}
            >
                <img src={upload.images[0].url} className="each-upload-img" />
            </Link>

            <div className="each-upload-footer">
                <div className="each-upload-footer-icons">
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
                                        return saved.upload._id !== upload._id;
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
                <p className="each-upload-footer-like">{likes}</p>
            </div>
        </div>
    );
}

export default EachUpload;
