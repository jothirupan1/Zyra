


import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Productcard from "../components/Productcard";

function Product() {
  const { category } = useParams(); // get category from URL
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // loading state

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true); // start loading
      try {
        let url = "http://localhost:3004/products";
        if (category) {
          url = `http://localhost:3004/products/category/${category}`;
        }

        const res = await axios.get(url);
        setProducts(res.data.products || res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false); // stop loading
      }
    };
    fetchProducts();
  }, [category]);

  return (
    <center>
      <div className="d-flex flex-column min-vh-100 mt-5 pt-4">
        <div className="mt-5">
          <div className="container mt-4">
            <h2 className="mb-4">{category ? category.toUpperCase() : "All Products"}</h2>

            {loading ? (
              <div className="d-flex justify-content-center align-items-center" style={{ height: "200px" }}>
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <div className="row">
                {products.length > 0 ? (
                  products.map((p) => (
                    <div className="col-md-3 mb-4" key={p._id}>
                      <Productcard product={p} />
                    </div>
                  ))
                ) : (
                  <p>No products found</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </center>
  );
}

export default Product;
