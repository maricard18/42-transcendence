export default async function fetchData(endpoint, method, headers = {}, body = null) {
	const fetchOptions = {
		method: method,
        headers: {
            ...headers,
        },
    };
	
    if (body) {
		fetchOptions.body = body;
    }

    const protocol = window.location.protocol;
    const host = window.location.host;
    const response = await fetch(protocol + "//" + host + endpoint, fetchOptions);

    return response;
}

export function checkEnterButton(functionToBeRun) {
    document.onkeydown = function (event) {
        var keyCode = event
            ? event.which
                ? event.which
                : event.keyCode
            : event.keyCode;
        if (keyCode == 13) {
			event.preventDefault();
			functionToBeRun();
		}
    };
}
