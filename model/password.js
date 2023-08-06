const Sequilize=require("sequelize")
const sequelize=require("../util/database")

const password=sequelize.define("password",{
    id:{
        type:Sequilize.STRING,
        primaryKey:true
    },
    isactive:Sequilize.BOOLEAN
});

module.exports=password