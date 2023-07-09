const submit=document.getElementById('submitForm')
submit.addEventListener('submit',handleSubmit)

async function handleSubmit(e){
    try{
        e.preventDefault()
        const email=document.getElementById('email').value
        const password=document.getElementById('password').value
        console.log(email,password);
        const data=await axios.post('http://localhost:3001/login', {
                email: email,
                password: password
        });      
    }
    catch(err){
        console.log(err)
    }
}