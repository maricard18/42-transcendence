const usernamePattern = /^[a-zA-Z0-9@.+_-]+$/;
const emailPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]{2,})+$/;

export function validateSignUpForm(formData) {
    const errors = {};

    if (formData.email === "" || formData.password === "" || formData.confirmPassword === "") {
        errors.message = "Please fill in all required fields";
        if (formData.email === "") {
            errors.email = 1;
        }
        if (formData.password === "") {
            errors.password = 1;
        }
        if (formData.confirmPassword === "") {
            errors.confirmPassword = 1;
        }
    } else if (formData.email.length < 6 || formData.email.length > 64) {
        errors.message = "Email must have 6-64 characters";
        errors.email = 1;
    } else if (!emailPattern.test(formData.email)) {
        errors.message = "Email not valid";
        errors.email = 1;
    } else if (formData.password.length < 4 || formData.password.length > 32) {
        errors.message = "Password must have 4-32 characters";
        errors.password = 1;
    } else if (formData.password !== formData.confirmPassword) {
        errors.message = "Passwords don't match";
        errors.password = 1;
        errors.confirmPassword = 1;
    }

    return errors;
}

export function validateLoginForm(formData) {
    const errors = {};

    if (formData.username === "") {
        errors.message = "Please fill in all required fields";
        errors.username = 1;
    }
    if (formData.password === "") {
        errors.message = "Please fill in all required fields";
        errors.password = 1;
    }

    return errors;
}

export function validateProfileUserForm(formData) {
    const errors = {};

    if (formData.username === "" || formData.email === "") {
        errors.message = "Please fill in all required fields";
        if (formData.username === "") {
            errors.username = 1;
        }
        if (formData.email === "") {
            errors.email = 1;
        }
    } else if (formData.username.length < 3 || formData.username.length > 12) {
        errors.message = "Username must have 3-12 characters";
        errors.username = 1;
    } else if (!usernamePattern.test(formData.username)) {
        errors.message = "Username has invalid characters";
        errors.username = 1;
    } else if (formData.email.length < 6 || formData.email.length > 64) {
        errors.message = "Email must have 6-64 characters";
        errors.email = 1;
    } else if (!emailPattern.test(formData.email)) {
        errors.message = "Email not valid";
        errors.email = 1;
    }

    return errors;
}

export function validateProfilePasswordForm(formData) {
    const errors = {};

    if (formData.password === "" || formData.confirmPassword === "") {
        errors.message = "Please fill in all required fields";
        if (formData.password === "") {
            errors.password = 1;
        }
        if (formData.confirmPassword === "") {
            errors.confirmPassword = 1;
        }
    } else if (formData.password.length < 4 || formData.password.length > 32) {
        errors.message = "Password must have 4-32 characters";
        errors.password = 1;
        errors.confirmPassword = 1;
    } else if (formData.password !== formData.confirmPassword) {
        errors.message = "Passwords don't match";
        errors.password = 1;
        errors.confirmPassword = 1;
    }

    return errors;
}

export function validateTournamentForm(formData) {
    const errors = {};

    if (formData.username1 === "" || formData.username2 === "" || formData.username3 === "" || formData.username4 === "") {
        errors.message = "Please fill in all required fields";
		if (formData.username1 === "") {
			errors.username1 = 1;
		}
		if (formData.username2 === "") {
			errors.username2 = 1;
		}
		if (formData.username3 === "") {
			errors.username3 = 1;
		}
		if (formData.username4 === "") {
			errors.username4 = 1;
		}
    } else if (formData.username1.length < 3 || formData.username1.length > 12) {
        errors.message = "Username 1 must have 3-12 characters";
        errors.username1 = 1;
    } else if (!usernamePattern.test(formData.username1)) {
        errors.message = "Username 1 has invalid characters";
        errors.username1 = 1;
    } else if (formData.username2.length < 3 || formData.username2.length > 12) {
        errors.message = "Username 2 must have 3-12 characters";
        errors.username2 = 1;
    } else if (!usernamePattern.test(formData.username2)) {
        errors.message = "Username 2 has invalid characters";
        errors.username2 = 1;
    } else if (formData.username3.length < 3 || formData.username3.length > 12) {
        errors.message = "Username 3 must have 3-12 characters";
        errors.username3 = 1;
    } else if (!usernamePattern.test(formData.username3)) {
        errors.message = "Username 3 has invalid characters";
        errors.username3 = 1;
    } else if (formData.username4.length < 3 || formData.username4.length > 12) {
        errors.message = "Username 4 must have 3-12 characters";
        errors.username4 = 1;
    } else if (!usernamePattern.test(formData.username4)) {
        errors.message = "Username 4 has invalid characters";
        errors.username4 = 1;
    } else if (checkForEqualUsername("username4", formData)) {
		errors.message = "Username 4 already exists";
        errors.username4 = 1;
	} else if (checkForEqualUsername("username3", formData)) {
		errors.message = "Username 3 already exists";
        errors.username3 = 1;
	} else if (checkForEqualUsername("username2", formData)) {
		errors.message = "Username 2 already exists";
        errors.username2 = 1;
	} else if (checkForEqualUsername("username1", formData)) {
		errors.message = "Username 1 already exists";
        errors.username1 = 1;
	}

    return errors;
}

function checkForEqualUsername(user, formData) {
	const array = Object.entries(formData);
	for (let [index, entry] of array) {
		if (index !== user && entry === formData[user]) {
			return true
		}
	}

	return false;
}

export function validate2FAForm(code) {
    const errors = {};

    if (!code) {
        errors.message = "Please insert a 6 digit code";
        errors.code = 1;

    } else if (code.length !== 6) {
        errors.message = "2FA Code needs to have 6 digits";
        errors.code = 1;
    }

    return errors;
}
