import React, { Component } from "react";
import { NormalForm } from "../components/Form";
import { PasswordForm } from "../components/Form";
import { FormSubmitButton } from "../components/Buttons";
import Avatar from "../components/Avatar";

const LoginPage = () => {
	return (
		<div className="center">
			<h1 className="header" style={{marginBottom: "36px"}}>Welcome back</h1>
			<form id="login-form" action="/api/users" method="post">
				<NormalForm id="user">username or email</NormalForm>
				<PasswordForm id="password">password</PasswordForm>
				<FormSubmitButton template="secondary-button" form="login">Next</FormSubmitButton>
			</form>
		</div>
	);
};

export default LoginPage;
