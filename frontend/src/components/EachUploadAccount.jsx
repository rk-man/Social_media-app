import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { FaPencilAlt } from "react-icons/fa";
import AuthContext from "../contexts/authContext";

function EachUploadAccount({ upload }) {
    const { authUser } = useContext(AuthContext);
    return (
        <div style={{ width: "100%", height: "40rem", position: "relative" }}>
            {authUser.user._id === upload.owner._id && (
                <Link
                    style={{
                        backgroundColor: "var(--primary-color)",
                        borderRadius: "50%",
                        width: "3rem",
                        height: "3rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "absolute",
                        left: "0",
                        top: "0",
                        transform: "translate(20%, 20%)",
                    }}
                    to={`/uploads/${upload._id}/edit`}
                >
                    <FaPencilAlt
                        className="icon-small"
                        style={{ color: "white" }}
                    />
                </Link>
            )}

            <Link
                to={`/uploads/${upload._id}`}
                className="each-upload-account-wrapper"
                style={{ width: "100%", height: "100%" }}
            >
                <img
                    src={upload.images[0].url}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                    }}
                />
            </Link>
        </div>
    );
}

export default EachUploadAccount;
