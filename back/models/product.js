const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    category: { 
      type: String, 
      required: true, 
      enum: ["T-shirt", "Shirt", "Jacket" ,"Coat", "Knitwear","Check-shirt"] 
    },
    stock: { type: Number, required: true },

    sizes: [
      { 
        size: { type: String, enum: ["S", "M", "L", "XL", "XXL"], required: true },
        quantity: { type: Number, required: true }
      }
    ],

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Userinfo", required: true },

    reviews: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "Userinfo", required: true },
        rating: { type: Number, required: true },
        comment: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

const Products = mongoose.model("Productdetails", ProductSchema);
module.exports = Products;
