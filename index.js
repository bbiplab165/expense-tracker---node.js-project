const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');

const route=require('./routes/route')
const sequelize = require('./util/database')
const userModel=require('./model/userModel')
const expenseModel=require('./model/expense')
const orderModel=require('./model/order')

const app = express()

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/',route)

userModel.hasMany(expenseModel)
expenseModel.belongsTo(userModel)

userModel.hasMany(orderModel)
orderModel.belongsTo(userModel)

sequelize.sync()
.then(app.listen(3001,function(){
    console.log('App running on port 3001');
}))
    .catch((err) => console.log(err))