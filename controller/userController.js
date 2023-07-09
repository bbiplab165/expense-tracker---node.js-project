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
exports.saveUser = async(req, res) => {
    try {
        const data=req.body
        const {name,email,password}=data
        const userData=await userModel.findAll({
            where:{email:email}
        })
        if(!userData)    {
            console.log('Created sucessfully');
            userModel.create({
                name,email,password
            })
            location.reload();
        }
        console.log("user already present");
    }
    catch (err) {
        console.log(err);
    }
}
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const items = await userModel.findAll({
            where: { email: email,password: password }
        });
        console.log(items.length)
        if(items.length>0){
            console.log('login Sucessfull')
        }
        else{
            console.log('user not found')
        }  
        res.json(items);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'An error occurred' });
    }
};
