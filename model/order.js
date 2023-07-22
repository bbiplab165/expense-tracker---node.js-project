const sequelize = require("../util/database");

const Sequelize=require("sequelize")

const order=sequelize.define('order',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true,
    },
    orderid:Sequelize.STRING,
    paymentid:Sequelize.STRING,
    status:Sequelize.STRING
});

module.exports=order