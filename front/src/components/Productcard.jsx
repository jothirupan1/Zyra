import React from "react";
import { Link, useNavigate } from "react-router-dom";

function ProductCard({ product }) {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleClick = (e) => {
    if (!token) {
      e.preventDefault();
      console.log("You have to login");
      navigate("/login");
    }
  };

  return (
    <div >
      <Link
        to={`/productdetails/${product._id}`} 
        style={{ textDecoration: "none" }}
        onClick={handleClick}
      >
        <div style={{ width: "250px", textAlign: "center", background: "#fff" }}>
          <img
            src={product.image}
            alt={product.title}
            style={{
              width: "100%",
              height: "320px",
              objectFit: "cover",
            }}
          />
          <h4
            style={{
              fontSize: "14px",
              fontWeight: "500",
              margin: "10px 0 5px",
              textTransform: "uppercase",
            }}
          >
            {product.title}
          </h4>
          <p style={{ fontSize: "14px", fontWeight: "500" }}>
            ₹{product.price}
          </p>
        </div>
      </Link>
    </div>
  );
}

export default ProductCard;
