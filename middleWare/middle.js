const jwt = require('jsonwebtoken')
const userModel = require('../model/userModel')

exports.Authenticate = async (req, res, next) => {
    try {
        const token = req.header('Authorization');
        console.log("token is ---", token);
        const data = jwt.verify(token, 'hello')
        if (!data)
            return res.status(401).send({ status: false, msg: "Token is invalid" })
        const userId = data.userId
        console.log("User id is" + userId)
        // req.user=userModel.findByID(userId)
        req.user = await userModel.findOne({where:{id:userId}});
        next()
    }
    catch (err) {
        console.log(err); 
    }
}