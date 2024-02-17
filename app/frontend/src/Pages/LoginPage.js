import React, { Component } from "react";
import { NormalInput } from "../components/Inputs";
import { PasswordInput } from "../components/Inputs";
import FormButton from "../components/FormButton";

export default function LoginPage() {
	return (
		<div className="center">
			<h1 className="header" style={{marginBottom: "36px"}}>Welcome back</h1>
			<form id="login-form" action="/api/users" method="post">
				<NormalInput id="user">username or email</NormalInput>
				<PasswordInput id="password">password</PasswordInput>
				<FormButton template="secondary-button" form="login">Next</FormButton>
			</form>
		</div>
	);
};
