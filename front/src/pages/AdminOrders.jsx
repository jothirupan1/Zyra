import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3004/admin/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:3004/admin/order/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update the order locally
      const updatedOrders = orders.map((order) => {
        if (order._id === orderId) {
          return { ...order, status: newStatus };
        }
        return order;
      });
      setOrders(updatedOrders);
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  if (loading) return <p className="text-center mt-5">Loading orders...</p>;

  return (
    <div className="container d-flex flex-column min-vh-100 mt-5 pt-4">
      <h2 className="mb-4">Admin Orders Dashboard</h2>
      {orders.length === 0 ? (
        <p className="text-center">No orders to manage</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="card mb-3 p-3">
            <h5>User Info</h5>
            <p><b>Name:</b> {order.userId.name}</p>
            <p><b>Email:</b> {order.userId.email}</p>

            <h5>Shipping Address</h5>
            <p>{order.address.fullName}</p>
            <p>{order.address.street}, {order.address.city}, {order.address.state} - {order.address.postalCode}</p>
            <p>Phone: {order.address.phone}</p>

            <h5>Products</h5>
            <ul>
              {order.item.map((prod) => (
                <li key={prod.productId._id}>
                  {prod.productId.title} - ₹{prod.productId.price} x {prod.quantity}
                </li>
              ))}
            </ul>

            <p><b>Total Price:</b> ₹{order.Totalprice}</p>

            <div className="mb-2">
              <label className="form-label"><b>Status:</b></label>
              <select
                className="form-select"
                value={order.status}
                onChange={(e) => handleStatusChange(order._id, e.target.value)}
              >
                <option value="placed">Placed</option>
                <option value="pending">Pending</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminOrders;
