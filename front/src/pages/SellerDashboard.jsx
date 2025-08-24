







import React, { useState, useEffect } from "react";
import axios from "axios";

const SellerDashboard = () => {
  const [formData, setFormData] = useState({
    title: "",
    image: "",
    price: "",
    category: "T-shirt",
    stock: "",
    sizes: [{ size: "M", quantity: "" }],
  });

  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("https://zyra-7ccl.onrender.com/products/seller/mine", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSizeChange = (index, e) => {
    const { name, value } = e.target;
    const newSizes = [...formData.sizes];
    newSizes[index][name] = value; // ✅ no restriction, just store the value
    setFormData((prev) => ({ ...prev, sizes: newSizes }));
  };

  // ✅ Restrict to maximum 5 size fields
  const addSizeField = () => {
    if (formData.sizes.length >= 5) {
      alert("You can only add up to 5 sizes!");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      sizes: [...prev.sizes, { size: "M", quantity: "" }],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      await axios.post("https://zyra-7ccl.onrender.com/products", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Product created successfully");

      setFormData({
        title: "",
        image: "",
        price: "",
        category: "T-shirt",
        stock: "",
        sizes: [{ size: "M", quantity: "" }],
      });

      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Error creating product");
    }
  };

  return (
    <div className="container d-flex flex-column min-vh-100 mt-5 pt-5">
      <h2 className="mb-4 text-center">Seller Dashboard - Add Product</h2>

      <form className="card p-2 shadow mb-5" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Product Title</label>
          <input
            type="text"
            className="form-control"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Image URL</label>
          <input
            type="text"
            className="form-control"
            name="image"
            value={formData.image}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Price</label>
          <input
            type="number"
            className="form-control"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Category</label>
          <select
            className="form-select"
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="T-shirt">T-shirt</option>
            <option value="Shirt">Shirt</option>
            <option value="Jacket">Jacket</option>
            <option value="Coat">Coat</option>
             <option value="Knitwear">Knitwear</option>
              <option value="Check-shirt">Check-shirt</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Stock</label>
          <input
            type="number"
            className="form-control"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Sizes - Quantity</label>
          {formData.sizes.map((s, index) => (
            <div key={index} className="d-flex mb-2 gap-2">
              <select
                className="form-select"
                name="size"
                value={s.size}
                onChange={(e) => handleSizeChange(index, e)}
              >
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
              </select>
              <input
                type="number"
                className="form-control"
                name="quantity"
                placeholder="Enter Quantity"
                value={s.quantity}
                onChange={(e) => handleSizeChange(index, e)}
                required
              />
            </div>
          ))}
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={addSizeField}
          >
            + Add Size
          </button>
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Create Product
        </button>
      </form>

      <h3 className="mb-3">My Products</h3>
      {products.length === 0 ? (
        <p>No products created yet.</p>
      ) : (
        <div className="row">
          {products.map((p) => (
            <div className="col-md-3 mb-4" key={p._id}>
              <div className="card h-100 shadow-sm">
                {p.image && (
                  <img
                    src={p.image}
                    alt={p.title}
                    className="card-img-top"
                    style={{ height: "300px", width: "305px", objectFit: "cover" }}
                  />
                )}
                <div className="card-body">
                  <h5 className="card-title">{p.title}</h5>
                  <p className="card-text mb-1">
                    <strong>Price:</strong> ₹{p.price}
                  </p>
                  <p className="card-text mb-1">
                    <strong>Category:</strong> {p.category}
                  </p>
                  <p className="card-text mb-1">
                    <strong>Stock:</strong> {p.stock}
                  </p>
                  <div>
                    <strong>Sizes:</strong>{" "}
                    {p.sizes?.map((s, idx) => (
                      <span key={idx} className="badge bg-secondary me-1">
                        {s.size}: {s.quantity}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;
