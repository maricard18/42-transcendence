import React, { Component } from "react";
import Avatar from "../components/Avatar";
import { NormalForm } from "../components/Form";
import { PasswordForm } from "../components/Form";
import { FormSubmitButton } from "../components/Buttons";
import "../../static/css/index.css";

const SignUpPage = () => {
    return (
        <div className="center">
            <form id="sign-up-form" action="/api/users" method="post">
                <Avatar />
                <NormalForm type="text" id="user">username</NormalForm>
                <NormalForm type="email" id="email">email</NormalForm>
                <PasswordForm id="password">password</PasswordForm>
                <PasswordForm id="confirm-password">confirm password</PasswordForm>
                <FormSubmitButton template="secondary-button" form="signUp">Next</FormSubmitButton>
            </form>
        </div>
    );
};

export default SignUpPage;
