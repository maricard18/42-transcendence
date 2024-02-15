import React, { Component } from "react";
import Avatar from "../components/Avatar";
import { NormalForm } from "../components/Form";
import { PasswordForm } from "../components/Form";
import { FormButton } from "../components/Buttons";
import "../../static/css/Avatar.css";

const SignUpPage = () => {
    return (
        <div className="center">
            <form action="/api/users" method="post">
                <div className="avatar">
                    <input type="file" id="actual-btn" hidden />
                    <label htmlFor="actual-btn">
                        <Avatar color="white"></Avatar>
                    </label>
                </div>
                <NormalForm type="text" id="user">
                    username
                </NormalForm>
                <NormalForm type="email" id="email">
                    email
                </NormalForm>
                <PasswordForm id="password">password</PasswordForm>
                <PasswordForm>confirm password</PasswordForm>
                <FormButton template="secondary-button" form="signUp">
                    Next
                </FormButton>
            </form>
        </div>
    );
};

export default SignUpPage;
