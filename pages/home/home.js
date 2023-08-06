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
        document.getElementById('expense').value = '';
        document.getElementById('description').value = '';
        document.getElementById('category').value = '';
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

            const table = document.getElementById("table")
            const expenseDetail = await axios.get("http://localhost:3001/expenseDetail", { headers: { "Authorization": token } })
            const details = expenseDetail.data.data
            let totalExpense = 0
            table.innerHTML = '';
            details.map(i => {
                const tr = document.createElement("tr")

                const createdAtDate = new Date(i.createdAt);
                const day = createdAtDate.getDate().toString().padStart(2, "0");
                const month = (createdAtDate.getMonth() + 1).toString().padStart(2, "0");
                const year = createdAtDate.getFullYear();
                const formattedDate = `${day}-${month}-${year}`;
                const dateTd = document.createElement("td");
                dateTd.textContent = formattedDate;
                dateTd.style.paddingRight = "20px";
                tr.appendChild(dateTd);

                const descriptionTd = document.createElement("td");
                descriptionTd.textContent = i.description;
                descriptionTd.style.paddingRight = "10px";
                tr.appendChild(descriptionTd);

                const categoryTd = document.createElement("td");
                categoryTd.textContent = i.category;
                categoryTd.style.paddingRight = "10px";
                tr.appendChild(categoryTd);

                const expenseTd = document.createElement("td");
                expenseTd.textContent = i.expense;
                tr.appendChild(expenseTd);

                table.appendChild(tr);

                let expense = Number(i.expense)
                totalExpense += expense
            })
            const tr = document.createElement("tr")
            const Expense = document.createElement("td")
            Expense.textContent = "Total Expense"
            tr.appendChild(Expense)
            const td = document.createElement("td")
            td.textContent = totalExpense
            tr.appendChild(td)
            table.appendChild(tr)

            ////   download button     /////////

            const download = document.getElementById("download")
            download.innerHTML = "download expense"
            download.addEventListener('click', handleDownload)
            async function handleDownload() {
                try {
                    // const textFile = await axios.get("http://localhost:3001/download", { headers: { "Authorization": token } })
                    axios.get("http://localhost:3001/download", { headers: { "Authorization": token } })
                        .then((res) => {
                            if (res.status === 200) {
                                console.log(res);
                                let a = document.createElement("a")
                                a.href = res.data.fileUrl
                                a.download = "myexpense.csv"
                                a.click()
                            }
                            else {
                                console.log("err");
                            }
                        })
                    // console.log(textFile);
                }
                catch (err) {
                    console.log(err);
                }
            }

            const allUser = await axios.get("http://localhost:3001/allUser");
            const users = allUser.data.data;

            let leaderboardContent = '';
            users.forEach((userData) => {
                leaderboardContent += `<li>${userData.name} ${userData.totalExpense}</li>`;
            });

            const leaderboard = document.getElementById("leaderboad");
            leaderboard.innerHTML = leaderboardContent;
        }
        else {
            document.getElementById('razorpay').innerHTML = "buy Premium"
            document.getElementById("download").style.display = "none"
            document.getElementById("table").style.display = "none"
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

            deleteButton.addEventListener("click", () => {
                deleteExpense(expense.id, token); // Call the deleteExpense function with the expense id
            });
        };

    }
    catch (err) {
        console.error(err);
    }
}

async function deleteExpense(expenseId, token) {
    try {
        const response = await axios.delete(`http://localhost:3001/deleteExpense/${expenseId}`, { headers: { "Authorization": token } });
        console.log("Expense deleted successfully:", response.data);

        //Assuming you want to remove the deleted expense from the list:
        // const liToDelete = document.querySelector(`li[data-id="${expenseId}"]`);
        // if (liToDelete) {
        //     liToDelete.remove();
        // }
        location.reload();
    } catch (error) {
        console.error("Error deleting expense:", error.message);
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

