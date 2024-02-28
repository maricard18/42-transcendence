import React from "react";
import { Outlet } from "react-router-dom";

export default function Layout() {
    return (
        <>
            <nav className="navbar navbar-wrapper fixed-top py-3">
                <div className="container container-fluid">
                    <a className="navbar-brand navbar-text-wrapper" href="#">
                        Transcendence
                    </a>
                </div>
            </nav>
            <section><Outlet /></section>
        </>
    );
}
