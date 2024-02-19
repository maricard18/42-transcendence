import React, { Component } from "react";
import { NormalInput } from "../components/Inputs";
import { PasswordInput } from "../components/Inputs";
import FormButton from "../components/FormButton";

export default function LoginPage() {
    return (
        <section className="center">
            <div className="container">
                <h1 className="header mb-5">
                    Welcome back
                </h1>
                <form id="login-form" action="/api/users" method="post">
                    <div className="row justify-content-center mb-1">
                        <NormalInput id="user">username or email</NormalInput>
                    </div>
                    <div className="row justify-content-center mb-1">
                        <PasswordInput id="password">password</PasswordInput>
                    </div>
                    <div className="row justify-content-center mb-1">
                        <FormButton template="secondary-button" form="login">Next</FormButton>
                    </div>
                </form>
            </div>
        </section>
    );
}
