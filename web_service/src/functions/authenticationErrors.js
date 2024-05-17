export default async function handleResponse(response) {
    const errors = {};

    if (response.status === 409) {
        errors.message = "This username already exists";
        errors.username = 1;
    } else if (response.status === 401) {
        errors.message = "Incorrect password";
        errors.password = 1;
    } else if (response.status === 404) {
        errors.message = "Username doesn't exist";
        errors.username = 1;
    } else {
        errors.message = "Internal Server Error";
        errors.username = 1;
        errors.email = 1;
        errors.password = 1;
        errors.confirmPassword = 1;
    }

    return errors;
}
