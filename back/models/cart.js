const mongoose = require('mongoose')

const CartSchema = new mongoose.Schema(
    {
        UserId:{type:mongoose.Schema.Types.ObjectId,ref:"Userinfo",required:true},
        item:[
            {productId:{type:mongoose.Types.ObjectId,ref:"Productdetails",required:true},
            quantity:{type:Number,min:1,default:1,required:true}
        }
        ]
    },
    {timestamps:true}
);

const Cart = mongoose.model("Cartinfo",CartSchema);

module.exports=Cart;