import React, { Component } from "react";
import { NormalForm } from "../components/Form";
import { PasswordForm } from "../components/Form";
import Button from "../components/Button";

const LoginPage = () => {
    return (
        <div className="center mb-3">
            <form action="/test" method="get">
                <NormalForm>enter username or email</NormalForm>
                <PasswordForm>enter password</PasswordForm>
                <Button type="submit" template="secondary-button">Next</Button>
            </form>
        </div>
    );
};

export default LoginPage;
