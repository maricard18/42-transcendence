import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.css";

export default function Avatar({ setFile }) {
    const [preview, setPreview] = useState();

    function previewAvatar(event) {
        const file = event.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPreview(url);
            setFile(file);
        }
    }

    return (
        <figure>
            <input
                type="file"
                id="avatar"
                name="avatar"
                accept="image/png, image/jpeg, image/jpg"
                onChange={previewAvatar}
                hidden
            />
            <label htmlFor="avatar">
                {preview ? (
                    <img
                        src={preview}
                        alt="Avatar preview"
                        width="200"
                        height="200"
                        style={{ borderRadius: "50%" }}
                    />
                ) : (
                    <DefaultAvatar width="200" height="200" />
                )}
            </label>
        </figure>
    );
}

export function BaseAvatar({ width, height, template = "avatar" }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={width}
            height={height}
            fill="white"
            className={`bi bi-person-circle ${template}`}
            viewBox="0 0 16 16"
        >
            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
            <path
                fill="evenodd"
                d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
            />
        </svg>
    );
}

export function DefaultAvatar({ width, height }) {
    return (
        <div style={{ position: "relative", display: "inline-block" }}>
            <BaseAvatar width={width} height={height} />
            {/*<svg
                xmlns="http://www.w3.org/2000/svg"
                width="50"
                height="50"
                fill="#140330"
                className="bi bi-plus-circle"
                viewBox="0 0 16 16"
                style={{ position: "absolute", bottom: "20px", right: "20px" }}
            >
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
            </svg>*/}
            {/*<svg
                xmlns="http://www.w3.org/2000/svg"
                width="50"
                height="50"
                fill="#140330"
                className="bi bi-plus"
                viewBox="0 0 16 16"
				style={{ position: "absolute", bottom: "20px", right: "20px" }}
            >
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
            </svg>*/}
        </div>
    );
}
