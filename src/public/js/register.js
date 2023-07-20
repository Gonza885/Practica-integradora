const registerForm = document.querySelector("#registerForm");

registerForm.addEventListener("submit", async (event) => {
	event.preventDefault();
	const data = new FormData(registerForm);
	const obj = {};
	data.forEach((value, key) => (obj[key] = value))

	await fetch("/api/sessions/register", {
		method: "POST",
		body: JSON.stringify(obj),
		headers: {
			"Content-Type": "application/json",
		},
	}).then(res => {
		if (res.status === 401) {
			alert(`Email already exist`);
		} else {
			alert(`User created`);
			window.location.replace("/");
		};
	}).catch(err => {return `Catch error: ${err}`});
});