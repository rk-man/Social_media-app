import React from "react";

function EachUser({ user }) {
    return (
        <>
            <div className="each-user-container">
                <div className="each-user-img-wrapper">
                    <img
                        src={user.profileImage}
                        alt={user.username}
                        className="each-user-img"
                    />
                </div>
                <p className="each-user-name" style={{ fontSize: "1.6rem" }}>
                    @{user.username}
                </p>
                <p className="each-user-name">{user.fullName}</p>
            </div>
        </>
    );
}

export default EachUser;
