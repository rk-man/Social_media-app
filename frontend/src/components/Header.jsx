import { useContext } from "react";
import { Link } from "react-router-dom";
import "./../styles/header.css";
import AuthContext from "./../contexts/authContext";
import { useLocation } from "react-router-dom";

function Header() {
    const { authUser, logout } = useContext(AuthContext);

    const loc = useLocation();

    return (
        <header className="header">
            <Link className="link" to="/">
                <h3>Social Media App</h3>
            </Link>

            <nav className="header-nav">
                {authUser.user && (
                    <>
                        <Link
                            to="/users"
                            className={`link header-nav-link ${
                                loc.pathname === "/users" &&
                                "header-nav-link-selected"
                            }`}
                        >
                            <p>Users</p>
                        </Link>
                        <Link
                            to="/notifications"
                            className={`link header-nav-link ${
                                loc.pathname === "/notifications" &&
                                "header-nav-link-selected"
                            }`}
                        >
                            <p>Notifications</p>
                        </Link>
                        <Link
                            to="/explore"
                            className={`link header-nav-link ${
                                loc.pathname === "/explore" &&
                                "header-nav-link-selected"
                            }`}
                        >
                            <p>Explore</p>
                        </Link>
                        <Link
                            to="/saved"
                            className={`link header-nav-link ${
                                loc.pathname === "/saved" &&
                                "header-nav-link-selected"
                            }`}
                        >
                            <p>Saved</p>
                        </Link>
                    </>
                )}

                {!authUser.user && (
                    <Link to="auth/login" className="link">
                        <button className="btn btn-primary">
                            Sign in / register
                        </button>
                    </Link>
                )}

                {authUser.user && (
                    <>
                        <button
                            className="btn btn-primary"
                            onClick={(e) => {
                                e.preventDefault();
                                logout();
                            }}
                        >
                            Logout
                        </button>
                        <Link to="/account" className="link">
                            <div className="header-nav-profile-image-wrapper">
                                <img
                                    src={authUser.user.profileImage}
                                    alt={authUser.user.username}
                                    className="header-nav-profile-image"
                                />
                            </div>
                        </Link>
                    </>
                )}
            </nav>
        </header>
    );
}

export default Header;
