export default async function fetchData(endpoint, method, data) {
	const response = await fetch("http://localhost:8000" + endpoint, {
		method: method,
		headers: { "Content-type": "application/json" },
		body: JSON.stringify(data),
	});

	return response;
};
