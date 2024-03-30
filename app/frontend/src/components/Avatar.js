import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.css";

export default function Avatar({ setFile }) {
    const [preview, setPreview] = useState();
    const [shake, setShake] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setShake(true);
        }, 3000);
        setTimeout(() => {
            setShake(false);
        }, 4000);
    }, []);

    function previewAvatar(event) {
        const file = event.target.files[0];
        if (file) {
			const url = URL.createObjectURL(file);
			setPreview(url);
			setFile(file);
		}
    }

    return (
        <figure className="avatar">
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
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="200"
                        height="200"
                        fill="white"
                        className={
                            shake
                                ? "bi bi-person-circle avatar-shake avatar-bright"
                                : "bi bi-person-circle"
                        }
                        viewBox="0 0 16 16"
                    >
                        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                        <path
                            fill="evenodd"
                            d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
                        />
                    </svg>
                )}
            </label>
        </figure>
    );
}
