import React from "react";
import Avatar from "../components/Avatar";
import { NormalInput } from "../components/Inputs";
import { PasswordInput } from "../components/Inputs";
import FormButton from "../components/FormButton";
import "../../static/css/index.css";

export default function SignUpPage() {
    return (
        <div className="center">
            <form id="sign-up-form" action="/api/users" method="post">
                <Avatar />
                <NormalInput type="text" id="user">username</NormalInput>
                <NormalInput type="email" id="email">email</NormalInput>
                <PasswordInput id="password">password</PasswordInput>
                <PasswordInput id="confirm-password">confirm password</PasswordInput>
                <FormButton template="secondary-button" form="signUp">Next</FormButton>
            </form>
        </div>
    );
};
