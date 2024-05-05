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
