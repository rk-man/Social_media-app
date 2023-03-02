import { useState, useContext, useEffect } from "react";
import EachUser from "../components/EachUser";
import AuthContext from "../contexts/authContext";
import { getRandomImage } from "../helpers";

function UserFollowsPage() {
    const { authUser, getAllUserFollowData } = useContext(AuthContext);

    const [followingUsers, setFollowingUsers] = useState([]);
    const [followers, setFollowers] = useState([]);

    const [showing, setShowing] = useState("following");

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
        <div className="notifications-container">
            <div className="notifications-header">
                <div className="notifications-header-title">
                    <p
                        className="notifications-header-title-link notifications-header-title-link-selected"
                        id="following"
                        onClick={(e) => {
                            e.preventDefault();
                            document
                                .getElementById("following")
                                .classList.toggle(
                                    "notifications-header-title-link-selected"
                                );
                            document
                                .getElementById("followers")
                                .classList.toggle(
                                    "notifications-header-title-link-selected"
                                );
                            setShowing("following");
                        }}
                    >
                        following
                    </p>
                    <p
                        className="notifications-header-title-link"
                        id="followers"
                        onClick={(e) => {
                            e.preventDefault();
                            document
                                .getElementById("following")
                                .classList.toggle(
                                    "notifications-header-title-link-selected"
                                );
                            document
                                .getElementById("followers")
                                .classList.toggle(
                                    "notifications-header-title-link-selected"
                                );
                            setShowing("followers");
                        }}
                    >
                        followers
                    </p>
                </div>
                <hr className="notifications-header-line" />
            </div>
            <div className="notifications-people">
                {showing === "followers" && followers.length > 0
                    ? followers.map((f) => {
                          return (
                              <EachUser
                                  key={f._id}
                                  user={{
                                      username: f.followedBy.username,
                                      profileImage: f.followedBy.profileImage,
                                      fullName: f.followedBy.fullName,
                                  }}
                              />
                          );
                      })
                    : showing === "followers" && <p>No followers</p>}

                {showing === "following" && followingUsers.length > 0
                    ? followingUsers.map((f) => {
                          return (
                              <EachUser
                                  key={f._id}
                                  user={{
                                      username: f.followee.username,
                                      profileImage: f.followee.profileImage,
                                      fullName: f.followee.fullName,
                                  }}
                              />
                          );
                      })
                    : showing === "followingUsers" && <p>No following users</p>}
            </div>
        </div>
    );
}

export default UserFollowsPage;
