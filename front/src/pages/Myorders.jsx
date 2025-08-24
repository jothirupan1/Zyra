import React, { useEffect, useState } from "react";
import axios from "axios";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:3004/myorders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load orders");
    }
  };

  useEffect(() => {
    fetchOrders();


    const interval = setInterval(fetchOrders, 5000);

    return () => clearInterval(interval);
  }, [token]);

  if (!orders.length) {
    return (
      <div className="container text-center d-flex flex-column min-vh-100 mt-5 pt-5">
        <h3>No Orders Found</h3>
        <p>Place your first order to see it here!</p>
      </div>
    );
  }

  return (
    <div className="container d-flex flex-column min-vh-100 mt-5 pt-5">
      <h2 className="mb-4 text-center">My Orders</h2>
      <div className="row">
        {orders.map((order) => (
          <div className="col-md-6 mb-4" key={order._id}>
            <div className="card p-3 shadow-sm">
              <h6>Order ID: {order._id}</h6>
              <p className="text-muted">
                Placed on {new Date(order.createdAt).toLocaleDateString()}
              </p>

              {order.item[0] && (
                <div className="d-flex align-items-center">
                  <img
                    src={order.item[0].productId?.image}
                    alt={order.item[0].productId?.title}
                    style={{ width: "100px", height: "200px", objectFit: "cover" }}
                    className="me-3 rounded"
                  />
                  <div>
                    <h6>{order.item[0].productId?.title}</h6>
                    <p>Qty: {order.item[0].quantity}</p>
                    <p className="text-success">₹{order.item[0].productId?.price}</p>
                    <p>Total: ₹{order.Totalprice}</p>
                    <p className="fw-bold">
                      Status :{" "}
                      <span
                        className={
                          order.status === "placed"
                            ? "text-success"
                            : order.status === "pending"
                            ? "text-warning"
                            : order.status === "shipped"
                            ? "text-primary"
                            : order.status === "delivered"
                            ? "text-info"
                            : "text-danger"
                        }
                      >
                        {order.status}
                      </span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyOrders;
