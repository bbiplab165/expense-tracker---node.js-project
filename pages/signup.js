const submit = document.getElementById('userForm');

submit.addEventListener('submit', handleSubmit);

async function handleSubmit(e) {
    try {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        console.log(name, email, password);
        await axios.post("http://localhost:3001/create", {
            name,
            email,
            password
        });
        console.log("Item created successfully");
    } catch (error) {
        console.error("Error creating item:", error);
    }
} 
