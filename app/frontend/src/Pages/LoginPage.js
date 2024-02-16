import React, { Component } from "react";
import { NormalForm } from "../components/Form";
import { PasswordForm } from "../components/Form";
import { FormSubmitButton } from "../components/Buttons";
import Avatar from "../components/Avatar";

const LoginPage = () => {
    return (
        <div className="center mb-3">
            <form id="login-form" action="/api/users" method="post">
                <div className="avatar">
                    <input type="file" id="actual-btn" hidden />
                    <label htmlFor="actual-btn">
                        <Avatar color="white" />
                    </label>
                </div>
                <NormalForm id="user">username or email</NormalForm>
                <PasswordForm id="password">password</PasswordForm>
                <FormSubmitButton template="secondary-button" form="login">Next</FormSubmitButton>
            </form>
        </div>
    );
};

export default LoginPage;
