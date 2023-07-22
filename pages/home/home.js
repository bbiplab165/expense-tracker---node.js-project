const submit = document.getElementById('submitForm')
submit.addEventListener('submit', handleSubmit)

window.addEventListener('load', fetchData);
const expenseList = document.getElementById('item')

async function handleSubmit(e) {
    e.preventDefault()

    const expense = document.getElementById('expense').value
    const description = document.getElementById('description').value
    const category = document.getElementById('category').value
    console.log(expense, description, category);

    const token = await JSON.parse(localStorage.getItem("token")) || [];
    // const userId=JSON.parse(token)

    try {
        const response = await axios.post('http://localhost:3001/createExpense', {
            expense,
            description,
            category,
            token
        }, { headers: { "Authorization": token } });
        console.log('Created successfully:', response.data);
        fetchData()
    } catch (error) {
        console.error('Error creating expense:', error);
        // Handle error case, show error message, etc.
    }
}

async function fetchData() {
    try {
        const token = await JSON.parse(localStorage.getItem("token")) || [];
        console.log(token);
        const userDetail = await axios.get("http://localhost:3001/getUser", { headers: { "Authorization": token } })
        if (userDetail.data.isprime == true) {
            document.getElementById('razorpay').style.display = 'none'; //.style.visibility = 'hidden';          
            document.getElementById('premium').innerHTML = "You are a prime user"

            const allUser = await axios.get("http://localhost:3001/allUser")
            const users=allUser.data.data 
            users.map(i=> {
                const userData = i
                const leaderboad = document.getElementById("leaderboad")
                const li = document.createElement("li")
                li.textContent = userData.name+" "+userData.totalExpense
                leaderboad.appendChild(li)
            })
        }
        else {
            document.getElementById('razorpay').innerHTML = "buy Premium"
            
            const leaderboad = document.getElementById("leaderboad")
            const li = document.createElement("li")
            li.textContent = "Buy premium to see leaderboad"
            leaderboad.appendChild(li)
        }
        const response = await axios.get("http://localhost:3001/getExpense", { headers: { "Authorization": token } })

        expenseList.innerHTML = ""; // Clear existing expense list  Authorization
        const data = response.data.data;

        for (const expense of data) {
            const li = document.createElement("li");
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";

            li.textContent = expense.expense + " " + expense.category + " " + expense.description + " ";
            li.appendChild(deleteButton);
            expenseList.appendChild(li);
            // 
        };

    }
    catch (err) {
        console.error(err);
    }
}

document.getElementById('razorpay').onclick = async function (e) {
    try {
        const token = await JSON.parse(localStorage.getItem("token")) || [];
        const response = await axios.get("http://localhost:3001/purchase", { headers: { "Authorization": token } });
        console.log(response.data.order.id);
        // const orderData = response.data;
        let option = {
            "key": response.data.key_id,
            "order_id": response.data.order.id,
            "handler": async function (response) {
                await axios.post("http://localhost:3001/update", {
                    order_id: option.order_id,
                    payment_id: response.razorpay_payment_id
                }, { headers: { "Authorization": token } })
                console.log("ordei_id is : " + option.order_id);
                alert("Congratulations! you are now a prime member")
                // document.getElementById('razorpay').style.visibility = 'hidden';
                fetchData()
            }
        }
        const rzp1 = new Razorpay(option)
        rzp1.open()
        e.preventDefault()

        rzp1.on('payment.failed', function (response) {
            alert('something went wrong')
        })

    } catch (error) {
        console.error('Error fetching Razorpay order details:', error);
        alert('Error occurred while fetching Razorpay order details. Please try again later.');
    }
};

