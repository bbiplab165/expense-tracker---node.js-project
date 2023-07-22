const userModel = require('../model/userModel')
const expenseModel = require("../model/expense")
const path = require('path')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.getPage = (req, res) => {
    try {
        res.sendFile(path.join(__dirname, '../', 'pages', 'signup', 'signup.html'))
    }
    catch (err) {
        console.log(err);
    }
}
exports.getUser = async (req, res) => {
    try {
        const user = req.user
        // console.log("getUser "+user);
        res.status(200).json(user);
    }
    catch (err) {
        console.log(err);
    }
}

exports.saveUser = async (req, res) => {
    try {
        const data = req.body
        console.log(data);
        const { name, email, password } = data
        const userData = await userModel.findAll({
            where: { email: email }
        })
        console.log(userData.length);
        if (userData.length == 0) {
            bcrypt.hash(password, 10, async (err, hash) => {
                await userModel.create({
                    name, email, password: hash
                })
                console.log('Created sucessfully');
                return res.status(201).json({ message: 'Created successfullyl' });
            })
        }
        else {
            console.log("user already present");

        }
    }
    catch (err) {
        console.log(err);
    }
}
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const items = await userModel.findAll({
            where: { email }
        });
        if (items.length > 0) {
            bcrypt.compare(password, items[0].password, (err, result) => {
                if (result) {
                    console.log('login Successful');
                    const userId = items[0].id;
                    console.log(userId);
                    const token = jwt.sign({ userId: userId }, "hello")
                    return res.status(201).json({ message: 'login Successful', token: token });
                } else if (err) {
                    console.log('login fail');
                    return res.status(201).json({ message: 'login failed' });
                }
                else {
                    console.log('user not found');
                    return res.status(404).json({ message: 'User not found' });
                }
            });
        } else {
            console.log('user not found');
            return res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'An error occurred' });
    }
};

exports.leaderboad = async (req, res) => {
    try {
        const users = await userModel.findAll();
        const data = [];
        // console.log(users[1]);
        for (const user of users) {
            const userId = user.id;
            console.log(userId);
            console.log(user.id);
            const expenses = await expenseModel.findAll({where:{userId}});
            // console.log(expenses);
            let totalExpense=0
            for(const ex of expenses){
                const expenseValue =Number(ex.expense)
                totalExpense=totalExpense+expenseValue 
            }
            console.log(totalExpense);

            // user.dataValues.expenses = expenses;
            data.push({ name: user.name, totalExpense: totalExpense });
        }
        data.sort((a, b) => b.totalExpense - a.totalExpense);

        console.log("all users with expenses");
        return res.status(201).json({ success: true, message: "Success", data: data });
    }
    catch (err) {
        return res.status(500).json({ error: 'An error occurred' });
    }
}
