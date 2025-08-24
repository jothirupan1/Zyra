






import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

function Order() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const location = useLocation();

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState({
    fullName: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    phone: ""
  });
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!token) {
          navigate("/login");
          return;
        }

        if (id) {
          const res = await axios.get(`https://zyra-7ccl.onrender.com/products/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });

         
          const params = new URLSearchParams(location.search);
          const qty = parseInt(params.get("quantity")) || 1;
          const size = params.get("size") || "M";

          setCart([{ productId: res.data, quantity: qty, size }]);
        } else {
         
          const res = await axios.get("https://zyra-7ccl.onrender.com/cart", {
            headers: { Authorization: `Bearer ${token}` }
          });
          setCart(res.data.items || []); 
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate, token, location.search]);

  const total = cart.reduce(
    (sum, p) => sum + p.quantity * (p.productId?.price || 0),
    0
  );

const handleOrder = async (e) => {
  e.preventDefault();
  try {
    if (id) {
     
      const formattedItems = cart.map((p) => ({
        productId: p.productId._id || p.productId,
        quantity: p.quantity,
        size: p.size,
      }));

      console.log("Sending Buy Now payload:", {
        item: formattedItems,
        address,
        Totalprice: total,
      });

      await axios.post(
        "https://zyra-7ccl.onrender.com/order/direct",
        {
          item: formattedItems,
          address,
          Totalprice: total,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } else {
      
      console.log("Sending Cart Order payload:", {
        address,
        paymentMethod,
      });

      await axios.post(
        "https://zyra-7ccl.onrender.com/cart/order",
        {
          address,
          paymentMethod,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    }

    alert("Order placed successfully!");
    navigate("/myorders");
  } catch (err) {
    console.error("Order error:", err.response?.data || err.message);
    alert(err.response?.data?.message || "Something went wrong");
  }
};


  if (loading) return <p className="text-center mt-5">Loading...</p>;
  if (!cart || cart.length === 0)
    return <p className="text-center mt-5">No items to order</p>;

  return (
    <div className="container d-flex flex-column min-vh-100 mt-5 pt-5">
      <h2 className="mb-4">Checkout</h2>

      {cart.map((p, i) => (
        <div className="card mb-3 p-3" key={i}>
          <div className="d-flex align-items-center">
            <img
              src={p.productId?.image}
              alt={p.productId?.title}
              style={{ width: "100px", height: "100px", objectFit: "cover" }}
              className="me-3"
            />
            <div>
              <h6>{p.productId?.title}</h6>
              <p>Qty: {p.quantity}</p>
              <p>Size: {p.size}</p>
              <p>₹{p.productId?.price}</p>
            </div>
          </div>
        </div>
      ))}

      <h4 className="mt-3">Total: ₹{total}</h4>

      <form onSubmit={handleOrder}>
        <div className="mb-3">
          <label>Full Name</label>
          <input
            type="text"
            className="form-control"
            value={address.fullName}
            onChange={(e) =>
              setAddress({ ...address, fullName: e.target.value })
            }
            required
          />
        </div>
        <div className="mb-3">
          <label>Street</label>
          <input
            type="text"
            className="form-control"
            value={address.street}
            onChange={(e) => setAddress({ ...address, street: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <label>City</label>
          <input
            type="text"
            className="form-control"
            value={address.city}
            onChange={(e) => setAddress({ ...address, city: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <label>State</label>
          <input
            type="text"
            className="form-control"
            value={address.state}
            onChange={(e) => setAddress({ ...address, state: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <label>Postal Code</label>
          <input
            type="text"
            className="form-control"
            value={address.postalCode}
            onChange={(e) =>
              setAddress({ ...address, postalCode: e.target.value })
            }
            required
          />
        </div>
        <div className="mb-3">
          <label>Phone</label>
          <input
            type="text"
            className="form-control"
            value={address.phone}
            onChange={(e) => setAddress({ ...address, phone: e.target.value })}
            required
          />
        </div>

        <div className="mb-3">
          <label>Payment Method</label>
          <select
            className="form-select"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="COD">Cash on Delivery</option>
            <option value="Card">Credit/Debit Card</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Place Order
        </button>
      </form>
    </div>
  );
}

export default Order;
