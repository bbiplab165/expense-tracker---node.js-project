const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const compression=require('compression')
require('dotenv').config()

const route=require('./routes/route')
const sequelize = require('./util/database')
const userModel=require('./model/userModel')
const expenseModel=require('./model/expense')
const orderModel=require('./model/order')
const passwordModel=require("./model/password")




const app = express()
app.use(express.static('public'));

app.use(compression()) //  compress the file reduce size

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/',route)

userModel.hasMany(expenseModel)
expenseModel.belongsTo(userModel)

userModel.hasMany(orderModel)
orderModel.belongsTo(userModel)

userModel.hasMany(passwordModel)
passwordModel.belongsTo(userModel)

sequelize.sync()
.then(app.listen(process.env.PORT||3001,function(){
    console.log('App running on port 3001');
}))
    .catch((err) => console.log(err))