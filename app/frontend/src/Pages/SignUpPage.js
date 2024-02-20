import React from "react";
import Avatar from "../components/Avatar";
import { NormalInput } from "../components/Inputs";
import { PasswordInput } from "../components/Inputs";
import FormButton from "../components/FormButton";
import "../../static/css/index.css";

export default function SignUpPage() {
    return (
		<section className="center">
        <div className="center">
            <form id="sign-up-form" action="/api/users" method="post">
				<div className="row justify-content-center mb-2">
					<Avatar />
				</div>
				<div className="row justify-content-center mb-1">
					<NormalInput type="text" id="username">username</NormalInput>
				</div>
				<div className="row justify-content-center mb-1">
					<NormalInput type="email" id="email">email</NormalInput>
				</div>
				<div className="row justify-content-center mb-1">
					<PasswordInput id="password">password</PasswordInput>
				</div>
				<div className="row justify-content-center mb-1">
					<PasswordInput id="confirm-password">confirm password</PasswordInput>
				</div>
				<div className="row justify-content-center mb-1">
					<FormButton template="secondary-button" form="signUp">Next</FormButton>
				</div>
			</form>
        </div>
		</section>
    );
};
