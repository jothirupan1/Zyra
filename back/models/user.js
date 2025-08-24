const mongoose =require('mongoose');

const Userschema = new mongoose.Schema(
    {
        name:{type:String,required:true},
        email:{type:String,required:true,unique:true},
        contact:{type:Number,required:true,unique:true},
        password:{type:String,required:true},
        role:{type:String,enum:["admin","user","seller"],required:true}
    }
)

const Users = mongoose.model("Userinfo",Userschema);

module.exports=Users
 










