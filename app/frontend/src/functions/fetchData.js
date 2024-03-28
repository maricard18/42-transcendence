export default async function fetchData(endpoint, method, headers, body) {
	const response = await fetch("http://localhost:8000" + endpoint, {
		method: method,
		headers: headers,
		...(body ? { body: JSON.stringify(body) } : {})
	});

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
			functionToBeRun();
		}
    };
}
