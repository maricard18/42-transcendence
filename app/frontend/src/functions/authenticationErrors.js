export default async function handleResponse(response, formData) {
    const errors = {};
    const jsonData = await response.json();
    const responseMessage = jsonData["errors"]["message"];

    if (response.status === 400) {
        if (jsonData["errors"]["username"][0] === "A user with that username already exists.") {
            errors.message = "This username already exists";
            errors.username = 1;
            formData.username = "";
        }
    } else if (responseMessage === "Unauthorized") {
        errors.message = "Incorrect password";
        errors.password = 1;
        formData.password = "";
    } else if (response.status === 404) {
        errors.message = "Username doesn't exist";
        errors.username = 1;
        formData.username = "";
		formData.password = "";
    } else {
        errors.message = "Internal Server Error";
        errors.username = 1;
        errors.email = 1;
        errors.password = 1;
        errors.confirmPassword = 1;
        formData.username = "";
		formData.email = "";
		formData.password = "";
		formData.confirmPassword = "";
    }

    return errors;
}
