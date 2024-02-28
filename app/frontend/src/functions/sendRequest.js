const sendRequest = async (
    endpoint,
    input,
    setErrors,
    formData,
    setFormData
) => {
    const response = await fetch("http://localhost:8000" + endpoint, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        mode: "cors",
        body: JSON.stringify(input),
    });

    if (response.ok) {
        return true;
    }

    const data = await response.json();
    const newErrors = handleResponse(data, formData, setFormData);
    setErrors(newErrors);
    return false;
};

const handleResponse = (data, formData, setFormData) => {
    const errors = {};
    const responseMessage = data["errors"]["message"];

    if (responseMessage === "Unauthorized") {
        errors.message = "Incorrect password";
        errors.password = 1;
        setFormData({ ...formData, password: "" });
    } else if (responseMessage === "Conflict") {
        errors.message = "Username already exists";
        errors.username = 1;
        setFormData({ ...formData, username: "" });
        setFormData({ ...formData, password: "" });
    } else if (responseMessage === "User Not Found") {
        errors.message = "Username doesn't exist";
        errors.username = 1;
        setFormData({ ...formData, username: "" });
        setFormData({ ...formData, password: "" });
    } else {
        errors.message = "Username already exists";
        errors.username = 1;
        setFormData({ ...formData, username: "" });
        setFormData({ ...formData, password: "" });
    }

    return errors;
};

export default sendRequest;
