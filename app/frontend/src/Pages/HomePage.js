import React from "react";
import { Outlet } from "react-router-dom";
import "../../static/css/Images.css";
import "../../static/css/Buttons.css";
import "bootstrap/dist/css/bootstrap.css";

export default function HomePage() {
    return (
        <div className="container">
            <div
                className="
				d-flex 
				flex-column 
				flex-md-row 
				align-items-center 
				justify-content-center 
				justify-content-md-evenly 
				vh-100
				row"
            >
                <Outlet />
            </div>
        </div>
    );
}
