export function validateSignUpForm(formData, setFormData) {
    const errors = {};
    const emailPattern =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (formData.email === "") {
        errors.message = "Please fill in all required fields";
        errors.email = 1;
        setFormData({ ...formData, email: "" });
    }
    if (formData.password === "") {
        errors.message = "Please fill in all required fields";
        errors.password = 1;
        setFormData({ ...formData, password: "" });
    }
    if (formData.confirmPassword === "") {
        errors.message = "Please fill in all required fields";
        errors.confirmPassword = 1;
        setFormData({ ...formData, confirmPassword: "" });
    } else if (!emailPattern.test(formData.email)) {
        errors.message = "Email not valid";
        errors.email = 1;
        setFormData({ ...formData, email: "" });
    } else if (formData.password !== formData.confirmPassword) {
        errors.message = "Passwords don't match";
        errors.confirmPassword = 1;
        setFormData({ ...formData, confirmPassword: "" });
    } else if (formData.password.length < 4 || formData.password.length > 128) {
        errors.message = "Password must have 4-128 characters";;
		errors.password = 1;
        errors.confirmPassword = 1;
        setFormData({ ...formData, password: "", confirmPassword: "" });
    }

    return errors;
}

export function validateLoginForm(formData, setFormData) {
    const errors = {};

    if (formData.username === "") {
        errors.message = "Please fill in all required fields";
        errors.username = 1;
        setFormData({ ...formData, username: "" });
    }
    if (formData.password === "") {
        errors.message = "Please fill in all required fields";
        errors.password = 1;
        setFormData({ ...formData, password: "" });
    }

    return errors;
}

export function validateProfileUserForm(formData, setFormData) {
    const errors = {};
    const emailPattern =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (formData.username === "") {
        errors.message = "Please fill in all required fields";
        errors.username = 1;
        setFormData({ ...formData, username: "" });
    }
    if (formData.email === "") {
        errors.message = "Please fill in all required fields";
        errors.email = 1;
        setFormData({ ...formData, email: "" });
    } else if (!emailPattern.test(formData.email)) {
        errors.message = "Email not valid";
        errors.email = 1;
        setFormData({ ...formData, email: "" });
    }

    return errors;
}

export function validateProfilePasswordForm(formData, setFormData) {
    const errors = {};

    if (formData.password === "") {
        errors.message = "Please fill in all required fields";
        errors.password = 1;
        setFormData({ ...formData, password: "" });
    }
    if (formData.confirmPassword === "") {
        errors.message = "Please fill in all required fields";
        errors.confirmPassword = 1;
        setFormData({ ...formData, confirmPassword: "" });
    } else if (formData.password !== formData.confirmPassword) {
        errors.message = "Passwords don't match";
        errors.confirmPassword = 1;
        setFormData({ ...formData, confirmPassword: "" });
    } else if (formData.password.length < 4 || formData.password.length > 128) {
        errors.message = "Password must have 4-128 characters";
		errors.password = 1;
        errors.confirmPassword = 1;
        setFormData({ ...formData, password: "", confirmPassword: "" });
    }

    return errors;
}
