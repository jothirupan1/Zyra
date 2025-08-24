
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function ProductDetail() {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState("M");
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`https://zyra-7ccl.onrender.com/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `https://zyra-7ccl.onrender.com/product/${id}/review`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setReviews(response.data.reviews);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };
    fetchReviews();
  }, [id, token]);

  const handleAddToCart = async () => {
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      await axios.post(
        "https://zyra-7ccl.onrender.com/cart",
        { productId: id, quantity, size },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Added to cart!");
      navigate("/cart");
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  };

  const handleBuyNow = () => {
    if (!token) {
      navigate("/login");
      return;
    }
    navigate(`/orders/${id}?quantity=${quantity}&size=${size}`);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const response = await axios.post(
        `https://zyra-7ccl.onrender.com/product/${id}/review`,
        { rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Review submitted!");
      setReviews([...reviews, response.data.review]);
      setComment("");
      setRating(5);
    } catch (err) {
      console.error("Error submitting review:", err);
    }
  };

  if (loading) {
    return (
      <div className="text-center min-vh-100 mt-5 pt-5">
        <div className="spinner-border text-primary"></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (!product) return <p className="text-center mt-5">Product not found</p>;

  return (
    <div className="container d-flex flex-column min-vh-100 mt-5 pt-5">
      <div className="row align-items-center">
        <div className="col-md-6 text-center">
          <img
            src={product.image}
            alt={product.title}
            className="img-fluid rounded"
            style={{ maxHeight: "400px", objectFit: "contain" }}
          />
        </div>

        <div className="col-md-6">
          <h2>{product.title}</h2>
          <p className="text-muted">{product.category}</p>
          <h4 className="text-success">₹{product.price}</h4>
          <p>{product.description}</p>
          <p><b>Stock:</b> {product.stock}</p>

          {/* Quantity selector */}
          <div className="mb-3 d-flex align-items-center gap-2">
            <label>Quantity:</label>
            <input
              type="number"
              className="form-control"
              style={{ width: "80px" }}
              min="1"
              max={product.stock}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
          </div>

          {/* Size selector */}
          <div className="mb-3 d-flex align-items-center gap-2">
            <label>Size:</label>
            <select
              className="form-select"
              style={{ width: "100px" }}
              value={size}
              onChange={(e) => setSize(e.target.value)}
            >
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
            </select>
          </div>

          <div className="d-flex gap-2 mt-3">
            <button className="btn btn-dark" onClick={handleAddToCart}>
              Add to Cart
            </button>
            <button className="btn btn-primary" onClick={handleBuyNow}>
              Buy Now
            </button>
          </div>
        </div>
      </div>

     {/* Reviews Section */}
<div className="mt-4">
  <h4>Reviews</h4>
  {reviews.length > 0 ? (
    reviews.map((rev, index) => (
      <div key={index} className="border p-2 rounded mb-2">
        <strong>
          {typeof rev?.userId === "object"
            ? rev?.userId?.name || rev?.userId?.username || "Anonymous"
            : rev?.userId || "Anonymous"}
        </strong>{" "}
        ⭐ {rev?.rating || 0}/5
        <p>{rev?.comment || ""}</p>
        <small>
          {rev?.createdAt ? new Date(rev.createdAt).toLocaleDateString() : ""}
        </small>
      </div>
    ))
  ) : (
    <p>No reviews yet.</p>
  )}
</div>


      {/* Review Form */}
      <div className="mt-4">
        <h5>Write a comment for the product</h5>
        <form onSubmit={handleSubmitReview}>
          <div className="mb-2">
            <label>Rating</label>
            <select
              className="form-select"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
            >
              <option value="5">⭐⭐⭐⭐⭐ </option>
              <option value="4">⭐⭐⭐⭐ </option>
              <option value="3">⭐⭐⭐ </option>
              <option value="2">⭐⭐ </option>
              <option value="1">⭐ </option>
            </select>
          </div>
          <div className="mb-2">
            <label>Comment</label>
            <textarea
              className="form-control"
              rows="3"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            ></textarea>
          </div>
          <button type="submit" className="btn btn-success">
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProductDetail;
