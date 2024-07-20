const loginForm = document.querySelector(".button-autorize");
const email = document.getElementById('login_email')
const password = document.getElementById('login_password')

loginForm.addEventListener('click', (e) => {
	e.preventDefault();

	fetch( 'https://shfe-diplom.neto-server.ru/login', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			login: email.value,
			password: password.value
		})
	})
    .then( (response) => response.json())
    .then( (data) => {
    	console.log( data );
    	if (data.success) {
    		window.location.href="./admin_index.html";
    	} else {
        alert('Неверный логин или пароль, попробуйте снова.')
      }
    });
})