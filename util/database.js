const Sequelize=require('sequelize')

const sequelize=new Sequelize(process.env.DB_NAME,process.env.DB_ADMINENAME,process.env.PASSWORD,{
    host:'localhost',
    dialect:'mysql'
})

module.exports=sequelize  