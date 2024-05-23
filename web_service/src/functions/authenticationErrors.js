export default async function handleResponse(response) {
    const errors = {};

    if (response.status === 409) {
        errors.message = "This username already exists";
        errors.username = 1;
    } else if (response.status === 401) {
        errors.message = "Incorrect password";
        errors.password = 1;
    } else if (response.status === 404) {
		const content_type = response.headers.get("content-type");
        errors.message = content_type === "application/json" 
			? "User does not exist"
			: "Server error please try again later";
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
