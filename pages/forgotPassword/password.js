const submit=document.getElementById("submit")
submit.addEventListener("submit",handleSubmit)

async function handleSubmit(e){
    try{
        e.preventDefault()
        const email=document.getElementById("email").value
        console.log(email);
        await axios.post("http://localhost:3001/forgotPassword",{
            email:email
        })
        console.log("done");
    }
    catch(err)
    {
        console.log(err);
    }
}