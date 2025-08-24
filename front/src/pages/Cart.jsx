import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("https://zyra-7ccl.onrender.com/cart", {
        headers: { Authorization: `Bearer ${token}` },  // ✅ fixed brackets
      });
      setCart(res.data.items || []); // ✅ must match backend `{ items: [...] }`
    } catch (err) {
      console.error("Failed to fetch cart:", err);
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://zyra-7ccl.onrender.com/cart/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart((prev) => prev.filter((i) => i.productId._id !== productId));
    } catch (err) {
      console.error("Failed to remove item:", err);
    }
  };

  const handleGoToOrder = () => {
    navigate("/orders");
  };

  const totalPrice = cart.reduce(
    (sum, i) => sum + (i.productId?.price || 0) * i.quantity,
    0
  );

  if (loading) return <p className="text-center d-flex flex-column min-vh-100 mt-5 pt-4">Loading your cart...</p>;
  if (!cart || cart.length === 0)
    return <p className="text-center d-flex flex-column min-vh-100 mt-5 pt-5">Your cart is empty</p>;

  return (
    <div className="container d-flex flex-column min-vh-100 mt-5 pt-4">
      {cart.map((item, index) => (
        <div
          key={index}
          className="card mb-3 p-2 d-flex flex-row align-items-center justify-content-between"
        >
          <div className="d-flex align-items-center">
            <img
              src={item.productId?.image || "https://via.placeholder.com/150"}
              alt={item.productId?.title || "Product"}
              width="100"
              className="me-3"
            />
            <div>
              <h6>{item.productId?.title || "Unknown Product"}</h6>
              <p>Quantity: {item.quantity}</p>
              <p>Price: ₹{item.productId?.price || 0}</p>
            </div>
          </div>

          <button
            className="btn btn-danger btn-sm"
            onClick={() => handleRemove(item.productId._id)}
          >
            Remove
          </button>
        </div>
      ))}

      <h4 className="mt-3">Total: ₹{totalPrice}</h4>

      <button className="btn btn-primary mt-3" onClick={handleGoToOrder}>
        Go to Checkout
      </button>
    </div>
  );
};

export default Cart;
