export default async function handleResponse(response, formData, setFormData) {
    const errors = {};
    const jsonData = await response.json();
    const responseMessage = jsonData["errors"]["message"];

    if (response.status == 400) {
        if (jsonData["errors"]["username"][0] === "A user with that username already exists.") {
            errors.message = "Username already exists";
            errors.username = 1;
            setFormData({
                ...formData,
                username: "",
                password: "",
                confirmPassword: "",
            });
        }
    } else if (responseMessage === "Unauthorized") {
        errors.message = "Incorrect password";
        errors.password = 1;
        setFormData({ ...formData, password: "" });
    } else if (responseMessage === "User Not Found") {
        errors.message = "Username doesn't exist";
        errors.username = 1;
        setFormData({ ...formData, username: "", password: "" });
    } else {
        errors.message = "Internal Server Error";
        errors.username = 1;
        errors.email = 1;
        errors.password = 1;
        errors.confirmPassword = 1;
        setFormData({
            ...formData,
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
        });
    }

    return errors;
}
