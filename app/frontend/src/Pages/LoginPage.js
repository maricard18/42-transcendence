import React, { Component } from "react";
import { NormalForm } from "../components/Form";
import { PasswordForm } from "../components/Form";
import { FormButton } from "../components/Buttons";
import Avatar from "../components/Avatar";

const LoginPage = () => {
    return (
        <div className="center mb-3">
            <form action="/api/users" method="post">
                <div className="avatar">
                    <input type="file" id="actual-btn" hidden />
                    <label htmlFor="actual-btn">
                        <Avatar color="white"></Avatar>
                    </label>
                </div>
                <NormalForm id="user">username or email</NormalForm>
                <PasswordForm id="password">password</PasswordForm>
                <FormButton template="secondary-button" form="login">
                    Next
                </FormButton>
            </form>
        </div>
    );
};

export default LoginPage;
