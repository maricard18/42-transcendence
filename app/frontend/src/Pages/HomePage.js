import React from "react";
import { Outlet } from "react-router-dom";
import "../../static/css/Images.css";
import "../../static/css/Buttons.css";
import "bootstrap/dist/css/bootstrap.css";

export default function HomePage() {
 return (
        <div className="center">
            <div className="d-flex justify-content-evenly">
				<Outlet />
            </div>
        </div>
    );
}
