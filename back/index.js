const express = require('express');
const app = express();
app.use(express.json());

const cors = require('cors');
app.use(cors());

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const dbconnection = require('./config/dbconnection');
const Users = require('./models/user');
const Products = require('./models/product');
const Cart = require('./models/cart')
const Orders = require('./models/order');
const authorization = require('./middleware/authentication');

const jwt_key = 'zayra';


// product routes

app.post('/products', authorization(["admin", "seller"]), async (req, res) => {
  const { userId } = req.User
  try {
    const create = await Products.create({ ...req.body, createdBy: userId });
    res.status(200).json({ message: "The Product has been created", products: create });
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});


app.get('/products', async (req, res) => {
  try {
    const products = await Products.find();
    res.status(200).json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});



app.get('/products/:id', async (req, res) => {
  try {
    const product = await Products.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});



app.put('/products/:id', authorization(["admin", "seller"]), async (req, res) => {
  try {
    const update = await Products.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ message: "The product has been updated", products: update });
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});


app.delete('/products/:id', authorization(["admin", "seller"]), async (req, res) => {
  try {
    const remove = await Products.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "The product has been deleted", deletedProduct: remove });
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});


app.get('/products/search', authorization(["admin", "user", "seller"]), async (req, res) => {
  try {
    const search = req.query.search || "";
    const products = await Products.find({
      title: { $regex: search, $options: "i" }
    });
    res.status(200).json({ message: "Search results", products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});


app.get("/products/category/:category", async (req, res) => {
  try {
    const products = await Products.find({ category: req.params.category });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Error fetching products" });
  }
});

app.get("/products/seller/mine", authorization(["seller", "admin"]), async (req, res) => {
  const { userId } = req.User;
  try {
    const sellerProducts = await Products.find({ createdBy: userId });
    res.status(200).json(sellerProducts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});



// cart routes
// 
// Add to Cart

app.post("/cart/order", authorization(["user"]), async (req, res) => {
  const userId = req.User.userId; // fixed
  const { address, paymentMethod } = req.body;

  try {
    // 1. Get user's cart
    const cart = await Cart.findOne({ UserId: userId }).populate("item.productId");
    if (!cart || cart.item.length === 0)
      return res.status(400).json({ message: "Cart is empty" });

    // 2. Create new order
    const order = new Orders({
      userId,
      item: cart.item,
      address,
      paymentMethod,
      Totalprice: cart.item.reduce(
        (sum, i) => sum + i.quantity * (i.productId.price || 0),
        0
      ),
      status: "placed",
    });

    await order.save();

    // 3. Clear cart
    cart.item = [];
    await cart.save();

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});



app.post("/cart", authorization(["user"]), async (req, res) => {
  try {
    const { userId } = req.User;
    const { productId, quantity } = req.body;

    const product = await Products.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let cart = await Cart.findOne({ UserId: userId });
    if (!cart) {
      cart = new Cart({ UserId: userId, item: [] });
    }
    const existingItem = cart.item.find(i => i.productId.toString() === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.item.push({ productId, quantity });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add to cart" });
  }
});



app.get("/cart", authorization(["user"]), async (req, res) => {
  const { userId } = req.User;

  try {
    const cart = await Cart.findOne({ UserId: userId }).populate("item.productId");
    if (!cart || cart.item.length === 0) {
      return res.status(200).json({ items: [] }); // ✅ send items key
    }
    res.status(200).json({ items: cart.item }); // ✅ always send items array
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch cart" });
  }
});



app.delete('/cart/:productId', authorization(['user']), async (req, res) => {
  const { userId } = req.User;
  const { productId } = req.params;

  try {
    let cart = await Cart.findOne({ UserId: userId });
    if (!cart) {
      return res.status(400).json({ message: "There is no cart" });
    }

    // Use cart.item (singular) consistently
    cart.item = cart.item.filter(
      (i) => i.productId.toString() !== productId
    );

    await cart.save();
    res.status(200).json({ message: "Cart item deleted", items: cart.item }); // return updated items
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});






// order routes

app.post('/order', authorization(["user"]), async (req, res) => {
  const { userId } = req.User;
  const {address} = req.body
  try {
    const cart = await Cart.findOne({ UserId: userId }).populate("item.productId");
    if (!cart || cart.item.length === 0) {
      return res.status(400).json({ message: "there is no cart item is here" })
    }

    const total = cart.item.reduce((sum, item) => {
      return sum + item.productId.price * item.quantity
    }, 0)

    const newOrder = await Orders.create({
      userId: userId,
      item: cart.item.map(item => ({
        productId: item.productId._id,
        quantity: item.quantity
      })),
      address:address,
      Totalprice: total,
      status: "pending"
    })

    await Cart.findOneAndUpdate({ UserId: userId }, { $set: { item: [] } })

    res.status(200).json({ message: "your order is placed", order: newOrder })

  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "something went wrong" })
  }
})
app.post("/order/direct", authorization(["user"]), async (req, res) => {
  const { userId } = req.User;
  const { item, address, Totalprice } = req.body;

  try {
    if (!item || item.length === 0) {
      return res.status(400).json({ message: "No items found" });
    }

    const createorder = await Orders.create({
      userId,
      item,
      address,
      Totalprice,
      status: "pending"
    });

    res.status(200).json({ message: "The order is placed", order: createorder });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "something went wrong bro" });
  }
});



app.get("/myorders",authorization(["user"]),async(req,res)=>{
try{
    const {userId}= req.User;
    const  orders = await Orders.find({userId}).populate("item.productId")

    if(!orders || orders.length === 0){
      return res.status(400).json({message:"there is no order is found"})
    }
    res.json(orders);
}catch(err){
  console.error(err)
}
})


//admin routes

app.get("/users", authorization(["admin"]), async (req, res) => {
  try {
    const user = await Users.find().select("-password")
    res.status(200).json({ message: "you can view the user", user })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Error fetching users" });
  }
})

app.patch("/admin/order/:id/status", authorization(["admin"]), async (req, res) => {
  const { status } = req.body;

  try {
    const allowedstatus = ["placed", "pending", "shipped", "delivered", "cancelled"];
    if (!allowedstatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const orders = await Orders.findByIdAndUpdate(
      req.params.id, 
      { status },
      { new: true }
    ).populate("userId", "name email");

    if (!orders) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({
      message: `Order status updated to ${status}`,
      orders
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating order status" });
  }
});



app.get("/admin/product", authorization(["admin"]), async (req, res) => {
  try {
    const product = await Products.find().populate("createdBy", "name email");
    res.status(200).json({ message: "now you can view the product details", product });
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Error fetching users" });
  }
})

app.get("/admin/orders", authorization(["admin"]), async (req, res) => {
  try {
    const orders = await Orders.find()
      .populate("userId", "name email")
      .populate("item.productId", "title price");

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found" });
    }

    res.status(200).json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching orders" });
  }
});




app.post("/product/:id/review", authorization(["user"]), async (req, res) => {
  const { userId } = req.User;
  const { id } = req.params;
  const { rating, comment } = req.body;

  try {
    const product = await Products.findById(id);
    if (!product) {
      return res.status(400).json({ message: "there is no product here" });
    }

    // push review
    product.reviews.push({ userId, rating, comment });
    await product.save();

    // get the last review (just added)
    const newReview = product.reviews[product.reviews.length - 1];

    // populate the user field before sending back
    const populated = await product.populate({
      path: "reviews.userId",
      select: "name email"
    });

    const populatedReview =
      populated.reviews[populated.reviews.length - 1];

    res.status(200).json({
      message: "reviewed",
      review: populatedReview
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});



app.get("/product/:id/review", authorization(["user"]), async (req, res) => {
  try {
    const product = await Products.findById(req.params.id).populate("reviews.userId", "name email")
    if (!product) {
      return res.status(400).json({ message: "product is not found" })
    }
    res.status(200).json({
      message: "Product reviews fetched successfully",
      reviews: product.reviews
    });

  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Unable to fetch reviews" });
  }
})



app.post("/register", async (req, res) => {
  const { name, email, contact, password, role } = req.body
  try {
    const emailcheck = await Users.findOne({ $or: [{ email }, { contact }] })
    if (emailcheck) {
      return res.status(400).json({ message: "this email is aldready registerd" })
    }

    if(name.length < 3){
      return res.status(400).json({message:"name must have atleast 3 digit"})
    }

    if(contact.length !== 10){
      return res.status(400).json({message:"contact must have 10 digit"})
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const hashpassword = await bcrypt.hash(password, 10);
    const newuser = new Users({ name, email, contact, password: hashpassword, role })
    await newuser.save();
    res.status(200).json({ message: "You have registered successfully " })
  } catch (err) {
    console.error(err)
    res.status(400).json({ message: "registration failed" })
  }
})


app.post("/login", async (req, res) => {
  const {  email,contact,  password } = req.body
  try {
    const userlogin = await Users.findOne({ $or: [{ email }, { contact }] });
    if (!userlogin) {
      return res.status(400).json({ message: "cannot find an email" })
    }

    const findpassword = await bcrypt.compare(password, userlogin.password)
    if (!findpassword) {
      return res.status(400).json({ message: "Invalid password bro" })
    }

    const token = jwt.sign({ userId: userlogin._id, role: userlogin.role }, jwt_key, { expiresIn: "7d" })

    res.status(200).json({ message: "you have logged in", token, role: userlogin.role })
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "there is no user in database first register first" })
  }
})




app.listen(3004, () => {
  dbconnection();
  console.log(" Server is on air");
});
