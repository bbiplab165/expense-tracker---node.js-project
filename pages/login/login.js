const submit = document.getElementById('submitForm');
submit.addEventListener('submit', handleSubmit);

async function handleSubmit(e) {
    try {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        console.log(email, password);
        
        const response = await axios.post('http://localhost:3001/login', {
            email: email,
            password: password
        });

        console.log(response.data.token);
        localStorage.setItem('token', JSON.stringify(response.data.token));
        window.location.href = '../home/home.html';
    } catch (err) {
        console.log(err);
        if (err.response && err.response.status === 404) {
            console.log('Error Message:', err.response.data.message);
        }
    }
}
