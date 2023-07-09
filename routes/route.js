const express=require('express')

const userController=require('../controller/userController')

const route=express.Router()

route.post('/create',userController.saveUser)


module.exports=route