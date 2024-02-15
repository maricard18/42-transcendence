import React, { Component } from "react";
import { NormalForm } from "../components/Form";
import { PasswordForm } from "../components/Form";
import Button from "../components/Button";

const SignUpPage = () => {
    return (
        <div className="center">
            <form action="/test" method="post">
                <NormalForm typeName="text">username</NormalForm>
                <NormalForm typeName="email">email</NormalForm>
                <PasswordForm>password</PasswordForm>
                <PasswordForm>confirm password</PasswordForm>
                <Button type="submit" template="secondary-button">Next</Button>
            </form>
        </div>
    );
};

export default SignUpPage;
