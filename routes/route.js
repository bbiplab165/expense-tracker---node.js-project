const express=require('express')

const userController=require('../controller/userController')
const expenseController=require("../controller/expenseController")
const purchaseController=require("../controller/purchaseControlller")
const changePassword=require('../controller/changePassword')

const middle=require("../middleWare/middle")

const route=express.Router()

route.post('/create',userController.saveUser)
route.post('/login',userController.login)
route.get('/getUser',middle.Authenticate,userController.getUser)
route.get('/allUser',userController.leaderboad)
route.get('/expenseDetail',middle.Authenticate,userController.expenseDetail)

route.post('/forgotPassword',changePassword.forgotPassword)
route.post('/updatePassword/:uuid',changePassword.updatePassword)
route.get('/changePassword/:uuid',changePassword.changePassword)

route.post('/createExpense',middle.Authenticate,expenseController.createExpense)
route.get('/getExpense',middle.Authenticate,expenseController.getExpense)
route.delete('/deleteExpense/:id',middle.Authenticate,expenseController.deleteExpense)
route.get('/download',middle.Authenticate,expenseController.download)

route.get('/purchase',middle.Authenticate,purchaseController.purchase)
route.post('/update',middle.Authenticate,purchaseController.update)

module.exports=route      
