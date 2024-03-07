export default async function fetchData(endpoint, method, headers, body) {
	const response = await fetch("http://localhost:8000" + endpoint, {
		method: method,
		headers: headers,
		body: JSON.stringify(body),
	});

	return response;
};
