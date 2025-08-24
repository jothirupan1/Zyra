const mongoose = require('mongoose')

const dbconnection = async()=>{
    try{
        await mongoose.connect("mongodb+srv://zorohell123:JOTHIrupan007@api-deployment.fnv52ul.mongodb.net/?retryWrites=true&w=majority&appName=api-deployment")
        console.log('Database is connected')
    }catch(err){
        console.error("Database is not connected ",err)
    }
}

module.exports=dbconnection;