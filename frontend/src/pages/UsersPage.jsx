import { FaSearch } from "react-icons/fa";
import "./../styles/user.css";
import { useState, useEffect, useContext } from "react";
import AuthContext from "../contexts/authContext";
import EachUser from "../components/EachUser";
import { getRandomImage } from "../helpers";

function UsersPage() {
    const { searchUsers } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        if (search.length > 0) {
            searchUsers(search).then((res) => {
                setUsers(res);
            });
        } else {
            setUsers([]);
        }
    }, [search]);

    useEffect(() => {
        document.querySelector(
            "body"
        ).style.backgroundImage = `url(${getRandomImage()})`;
        return () => {
            document.querySelector("body").style.backgroundImage = "None";
        };
    }, []);

    return (
        <div className="users-container">
            <div className="users-search-container">
                <input
                    type="text"
                    className="user-search-input"
                    placeholder="type something..."
                    onChange={(e) => {
                        e.preventDefault();
                        setSearch(e.target.value);
                    }}
                />
                <div
                    className="search-icon-wrapper"
                    onClick={(e) => {
                        e.preventDefault();
                        searchUsers(search).then((res) => {
                            setUsers(res);
                        });
                    }}
                >
                    <FaSearch className="icon-medium" />
                </div>
            </div>

            <div className="all-users">
                {users.length > 0 &&
                    users.map((user) => {
                        return <EachUser user={user} key={user._id} />;
                    })}
            </div>
        </div>
    );
}

export default UsersPage;
