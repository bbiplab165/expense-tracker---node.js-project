const userModel = require('../model/userModel')
const path=require('path')

exports.getPage=(req,res)=>{
    try{
        res.sendFile(path.join(__dirname,'../','pages','signup.html'))
    }   
    catch(err){
        console.log(err);
    }
}
exports.saveUser = (req, res) => {
    try {
        const data=req.body
        // console.log(data);
        const {name,email,password}=data
        userModel.create({
            name,email,password
        })
        console.log('user Created sucessfully');
    }
    catch (err) {
        console.log(err);
    }
}