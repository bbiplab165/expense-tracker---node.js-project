const Sequelize=require('sequelize')

const sequelize=new Sequelize('expense','root','MICROMAx1#',{
    host:'localhost',
    dialect:'mysql'
})

module.exports=sequelize 