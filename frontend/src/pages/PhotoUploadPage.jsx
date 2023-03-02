import "./../styles/form.css";
import { GENRES } from "../config";
import { useState } from "react";
import { useContext } from "react";
import PhotoContext from "../contexts/photoContext";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "./../utils/LoadingSpinner";
import { getRandomImage } from "../helpers";

function PhotoUploadPage() {
    const { uploadPhoto, authPhoto, resetPhotoData } = useContext(PhotoContext);

    const { photo, success, error, message } = authPhoto;

    const [description, setDescription] = useState("");

    const [images, setImages] = useState([]);

    const [showOverallDescription, setShowOverallDescription] = useState(false);

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        document.getElementById("solo").checked = true;
    }, []);

    useEffect(() => {
        if (photo && success) {
            setLoading(false);
            toast.success("Successfully uploaded");
            resetPhotoData();
            navigate("/");
        } else if (error && message) {
            setLoading(false);
            toast.error(message);
            resetPhotoData();
        }
    }, [photo, success, error, message, navigate, resetPhotoData]);
    useEffect(() => {
        document.querySelector(
            "body"
        ).style.backgroundImage = `url(${getRandomImage()})`;
        return () => {
            document.querySelector("body").style.backgroundImage = "None";
        };
    }, []);

    const convertToBase64String = (files) => {
        for (let file of files) {
            console.log(file);
            if (file === undefined) return;
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                setImages((prev) => {
                    console.log(images);
                    return [
                        ...prev,
                        {
                            url: reader.result,
                            soloDescription: "",
                            exif: "",
                            gears: "",
                            genre: [],
                        },
                    ];
                });
                console.log(reader.result);
            };
        }
    };

    const handleChangePhotoData = (e) => {
        e.preventDefault();
        const id = e.target.closest(".form-img-preview-wrapper").id;
        console.log(id);

        setImages(
            images.length > 0
                ? images.map((img, index) => {
                      if (Number(id) === index) {
                          return {
                              ...img,
                              [`${e.target.id}`]: e.target.value,
                          };
                      } else {
                          return img;
                      }
                  })
                : images
        );
    };

    const handleChangePhotoGenre = (e) => {
        const id = e.target.closest(".form-img-preview-wrapper").id;
        console.log(id);
        setImages(
            images.length > 0 &&
                images.map((img, index) => {
                    if (Number(id) === index) {
                        if (img.genre.includes(e.target.id)) {
                            return {
                                ...img,
                                genre: img.genre.filter(
                                    (g) => g !== e.target.id
                                ),
                            };
                        } else {
                            return {
                                ...img,
                                genre: [...img.genre, e.target.id],
                            };
                        }
                    } else {
                        return img;
                    }
                })
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // console.log(photoData);
        let data = {
            description,
            images,
        };

        setLoading(true);
        uploadPhoto(data);
    };

    return (
        <div className="form-wrapper">
            {loading && <LoadingSpinner />}
            <form className="form" onSubmit={handleSubmit}>
                <div className="form-field">
                    <label htmlFor="images" className="form-field-label">
                        Images
                    </label>
                    <div className="form-field-img-wrapper">
                        <input
                            type="file"
                            className="form-field-img
                        "
                            multiple={true}
                            accept="image/*"
                            onChange={(e) => {
                                e.preventDefault();
                                convertToBase64String(e.target.files);
                                console.log(e.target.files);
                            }}
                            required={true}
                        />
                    </div>
                </div>

                <div className="form-field">
                    <label className="form-field-label">
                        Do you want a description for each photo or an overall
                        description ?
                    </label>
                    <div className="form-field-radio-btns">
                        <div className="form-field-radio-btn">
                            <input
                                type="radio"
                                id="solo"
                                onClick={(e) => {
                                    setShowOverallDescription(false);
                                    document.getElementById(
                                        "overall"
                                    ).checked = false;
                                    setDescription("");
                                }}
                            />
                            <p>Solo Description</p>
                        </div>
                        <div className="form-field-radio-btn">
                            <input
                                type="radio"
                                id="overall"
                                onClick={(e) => {
                                    setShowOverallDescription(true);
                                    document.getElementById(
                                        "solo"
                                    ).checked = false;
                                    setImages(
                                        images.length > 0
                                            ? images.map((img, index) => {
                                                  return {
                                                      ...img,
                                                      soloDescription: "",
                                                  };
                                              })
                                            : []
                                    );
                                }}
                            />
                            <p>Overall Description</p>
                        </div>
                    </div>
                </div>
                {/* <div className="form-field">
                    <label className="form-field-label" htmlFor="gears">
                        Gears
                    </label>
                    <textarea
                        className="form-field-input"
                        rows={6}
                        id="gears"
                        value={photoData.gears}
                        onChange={handleChangePhotoData}
                    ></textarea>
                </div> */}
                {/* <div className="form-field">
                    <label className="form-field-label" htmlFor="exif">
                        Exif
                    </label>
                    <textarea
                        className="form-field-input"
                        rows={3}
                        id="exif"
                        value={photoData.exif}
                        onChange={handleChangePhotoData}
                    ></textarea>
                </div> */}

                {showOverallDescription && (
                    <div className="form-field">
                        <label
                            className="form-field-label"
                            htmlFor="description"
                        >
                            Description
                        </label>
                        <textarea
                            className="form-field-input"
                            rows={14}
                            id="description"
                            value={description}
                            onChange={(e) => {
                                e.preventDefault();
                                setDescription(e.target.value);
                            }}
                        ></textarea>
                    </div>
                )}

                {/* <div className="form-field">
                    <label className="form-field-label" htmlFor="genre">
                        Genres
                    </label>
                    <div className="form-field-checkboxes">
                        {GENRES.map((g, index) => {
                            return (
                                <div
                                    key={index}
                                    className="form-field-checkbox"
                                >
                                    <input
                                        type="checkbox"
                                        className="form-field-checkbox-input"
                                        id={g}
                                        onClick={(e) => {
                                            if (
                                                photoData.genre.includes(
                                                    e.target.id
                                                )
                                            ) {
                                                setPhotoData((prev) => {
                                                    return {
                                                        ...prev,
                                                        genre: photoData.genre.filter(
                                                            (g) =>
                                                                g !==
                                                                e.target.id
                                                        ),
                                                    };
                                                });
                                            } else {
                                                setPhotoData((prev) => {
                                                    return {
                                                        ...prev,
                                                        genre: [
                                                            ...photoData.genre,
                                                            e.target.id,
                                                        ],
                                                    };
                                                });
                                            }
                                        }}
                                    />
                                    <p style={{ fontSize: "2rem" }}>{g}</p>
                                </div>
                            );
                        })}
                    </div>
                </div> */}

                <div className="form-img-previews">
                    {images.length > 0 &&
                        images.map((img, index) => {
                            return (
                                <div
                                    key={index}
                                    className="form-img-preview-wrapper"
                                    id={index}
                                >
                                    <img
                                        src={img.url}
                                        className="form-preview-img"
                                        alt={index}
                                    />
                                    {!showOverallDescription && (
                                        <div className="form-field">
                                            <label
                                                className="form-field-label"
                                                htmlFor="soloDescription"
                                            >
                                                Solo Description
                                            </label>
                                            <textarea
                                                className="form-field-input"
                                                rows={3}
                                                id="soloDescription"
                                                name={index}
                                                onChange={handleChangePhotoData}
                                            ></textarea>
                                        </div>
                                    )}

                                    <div className="form-field">
                                        <label
                                            className="form-field-label"
                                            htmlFor="gears"
                                        >
                                            Gears
                                        </label>
                                        <textarea
                                            className="form-field-input"
                                            rows={3}
                                            id="gears"
                                            name={index}
                                            onChange={handleChangePhotoData}
                                        ></textarea>
                                    </div>

                                    <div className="form-field">
                                        <label
                                            className="form-field-label"
                                            htmlFor="exif"
                                        >
                                            Exif
                                        </label>
                                        <textarea
                                            className="form-field-input"
                                            rows={3}
                                            id="exif"
                                            name={index}
                                            onChange={handleChangePhotoData}
                                        ></textarea>
                                    </div>

                                    <div className="form-field">
                                        <label
                                            className="form-field-label"
                                            htmlFor="genre"
                                        >
                                            Genres
                                        </label>
                                        <div className="form-field-checkboxes">
                                            {GENRES.map((g, index) => {
                                                return (
                                                    <div
                                                        key={index}
                                                        className="form-field-checkbox"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            className="form-field-checkbox-input"
                                                            id={g}
                                                            onChange={
                                                                handleChangePhotoGenre
                                                            }
                                                        />
                                                        <p
                                                            style={{
                                                                fontSize:
                                                                    "2rem",
                                                            }}
                                                        >
                                                            {g}
                                                        </p>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    <hr className="form-field-line" />
                                </div>
                            );
                        })}
                </div>

                <button className="btn btn-primary" type="submit">
                    Upload
                </button>
            </form>
        </div>
    );
}
export default PhotoUploadPage;
