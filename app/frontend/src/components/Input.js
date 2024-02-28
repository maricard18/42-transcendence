import React from "react";
import "bootstrap/dist/css/bootstrap.css";

export default function Input({
    type,
    id,
    value,
    template,
    setValue,
    children,
}) {
    const handleChange = (event) => {
        setValue(event.target.value);
    };

    return (
        <div className="mb-3">
            <input
                type={type}
                className={`form-control primary-form ${template}`}
                id={id}
                placeholder={children}
                onChange={handleChange}
                value={value}
            ></input>
        </div>
    );
}
