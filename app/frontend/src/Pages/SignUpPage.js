import React, { Component } from "react";
import Avatar from "../components/Avatar";
import { NormalForm } from "../components/Form";
import { PasswordForm } from "../components/Form";
import Button from "../components/Button";
import "../../static/css/Avatar.css";

const SignUpPage = () => {
    return (
        <div className="center">
            <form action="/api/users" method="post">
                <div className="avatar">
                    <input type="file" id="actual-btn" hidden />
                    <label for="actual-btn">
                        <Avatar color="white"></Avatar>
                    </label>
                </div>
                <NormalForm typeName="text">username</NormalForm>
                <NormalForm typeName="email">email</NormalForm>
                <PasswordForm>password</PasswordForm>
                <PasswordForm>confirm password</PasswordForm>
                <Button type="submit" template="secondary-button">
                    Next
                </Button>
            </form>
        </div>
    );
};

export default SignUpPage;
