const jwt = require('jsonwebtoken')
const AWS = require("aws-sdk")

require('dotenv').config()

const sequilize = require("../util/database")
const expenseModel = require('../model/expense')

exports.createExpense = async (req, res) => {
    const t = await sequilize.transaction()
    try {
        const { expense, description, category, token } = req.body
        const decode = jwt.verify(token, "hello")
        const userId = decode.userId
        console.log(userId)
        expenseModel.create({
            expense, description, category, userId,
            transaction: t
        })
        console.log("Created successfully");
        await t.commit()
        return res.status(201).json({ message: 'Created successfullyl' });
    }
    catch (err) {
        await t.rollback()
        console.log(err);
        return res.status(500).json({ message: err });
    }
}

exports.getExpense = async (req, res) => {
    try {
        const userId = req.user.id
        const data = await expenseModel.findAll({ where: { userId } })
        console.log("getExpense   hello");
        console.log(req.user.id);
        return res.status(200).json({ data })
    }
    catch (err) {
        console.log(err);
    }
}
function uploadFile(expenseText, fileName) {
    let s3bucket = new AWS.S3({
        accessKeyId: process.env.AWS_ACCESSKEYID,
        secretAccessKey: process.env.AWS_SECRETACCESSKEY
    })
    let param = {
        Bucket: process.env.AWS_BUCKETNAME,
        Key: fileName,
        Body: expenseText,
        ACL: 'public-read'
    }
    return new Promise((resolve, reject) => {
        s3bucket.upload(param, (err, response) => {
            if (err) {
                console.log(err);
                reject(err)
            }
            else {
                console.log("Success ", response.Location);
                resolve(response.Location)
            }
        })
    })
}

exports.download = async (req, res) => {
    try {
        const userId = req.user.id
        const expense = await expenseModel.findAll({ where: { userId } })
        const expenseText = JSON.stringify(expense)
        const fileName = `Expense${userId}/${new Date()}.txt`
        const fileUrl = await uploadFile(expenseText, fileName)
        console.log(fileUrl);
        return res.status(200).json({ fileUrl, success: true })
    }
    catch (err) {
        console.log(err);
    }
}

exports.deleteExpense = async (req, res) => {
    try {
        const expenseId = req.params.id
        const expense = await expenseModel.findOne({ expenseId })
        await expense.destroy()
        res.json({ message: 'Expense deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting expense:', error.message);
        res.status(500).json({ error: 'Failed to delete expense' });
    }
}