import { useState, useEffect, useContext } from "react";
import PhotoContext from "../contexts/photoContext";
import LoadingSpinner from "./../utils/LoadingSpinner";
import "./../styles/photo.css";
import EachUpload from "./../components/EachUpload";
import { getCookie, getRandomImage } from "./../helpers";
import { Multiselect } from "multiselect-react-dropdown";
import { BACKEND_URL } from "../config";
import axios from "axios";

function ExploreFeedPage() {
    const { getAllUploadsForExplore } = useContext(PhotoContext);
    const [exploreUploads, setExploreUploads] = useState([]);
    const [searchedUploads, setSearchedUploads] = useState([]);
    const [loading, setLoading] = useState(true);

    const [options, setOptions] = useState([
        {
            id: 1,
            name: "portrait",
        },
        {
            id: 2,
            name: "landscape",
        },
        {
            id: 3,
            name: "sports",
        },
    ]);

    const [selectedOptions, setSelectedOptions] = useState([]);

    useEffect(() => {
        getAllUploadsForExplore().then((res) => {
            setExploreUploads(res);
            setLoading(false);
        });
        changeScrollingDirection();
    }, []);

    useEffect(() => {
        document.querySelector(
            "body"
        ).style.backgroundImage = `url(${getRandomImage()})`;
        return () => {
            document.querySelector("body").style.backgroundImage = "None";
        };
    }, []);

    useEffect(() => {
        if (selectedOptions.length > 0) {
            handleSearchUploads();
        } else {
            setSearchedUploads(exploreUploads);
        }
    }, [selectedOptions]);

    function changeScrollingDirection() {
        const scrollContainer = document.querySelector(".all-uploads");

        scrollContainer.addEventListener("wheel", (evt) => {
            evt.preventDefault();
            scrollContainer.scrollLeft += evt.deltaY;
        });
    }

    function handleSelectOption(value) {
        setSelectedOptions(value);
    }

    function removeDeleteOption(value) {
        setSelectedOptions(value);
    }

    const handleSearchUploads = async () => {
        let genre = "";
        selectedOptions.forEach((upload) => {
            genre = genre + upload.name + " ";
        });
        genre = genre.trim();
        try {
            const token = getCookie("chocolate_token");
            const res = await axios.get(
                `${BACKEND_URL}/api/v1/photos/search?genre=${genre}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setSearchedUploads(res.data.uploads);
        } catch (err) {
            console.log(err);
            setSearchedUploads([]);
        }
    };

    return (
        <div>
            <Multiselect
                options={options}
                selectedValues={selectedOptions}
                onSelect={handleSelectOption}
                onRemove={removeDeleteOption}
                displayValue="name"
            />
            {loading && <LoadingSpinner />}
            <div className="all-uploads">
                {searchedUploads.length > 0 &&
                    searchedUploads.map((upload) => {
                        return <EachUpload upload={upload} key={upload._id} />;
                    })}

                {exploreUploads.length > 0 &&
                    searchedUploads.length <= 0 &&
                    exploreUploads.map((upload) => {
                        return <EachUpload upload={upload} key={upload._id} />;
                    })}
            </div>
        </div>
    );
}

export default ExploreFeedPage;
