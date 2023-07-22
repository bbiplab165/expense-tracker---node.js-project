const jwt=require('jsonwebtoken')

const expenseModel = require('../model/expense')

exports.createExpense=async (req,res)=>{
    try{
        const {expense,description,category,token}=req.body
        const decode=jwt.verify(token,"hello")
        const userId=decode.userId
        console.log(userId)
        expenseModel.create({
            expense,description,category,userId
        })
        console.log("Created successfully");
        return res.status(201).json({ message: 'Created successfullyl' });
    }
    catch(err){
        console.log(err);
    }
}

exports.getExpense=async (req,res)=>{
    try{
        const userId=req.user.id
        const data=await expenseModel.findAll({where:{userId}})
        console.log("getExpense   hello");
        console.log(req.user.id);
        return res.status(200).json({data})
    }
    catch(err){
        console.log(err);
    }
}