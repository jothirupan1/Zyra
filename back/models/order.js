const mongoose = require('mongoose');

const Orderschema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "Userinfo",
      required: true
    },
    item: [
      {
        productId: {
          type: mongoose.Schema.ObjectId,
          ref: "Productdetails",
          required: true
        },
        quantity: { type: Number, required: true }
      }
    ],
    address: {
      fullName: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      phone: { type: String, required: true }
    },
    Totalprice: { type: Number, required: true },
    status: {
      type: String,
      enum: ["placed", "pending", "shipped", "delivered", "cancelled"],
      default: "pending"
    }
  },
  { timestamps: true }
);

const Orders = mongoose.model("Orderdetails", Orderschema);
module.exports = Orders;
