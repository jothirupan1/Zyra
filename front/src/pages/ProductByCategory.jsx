import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Productcard from "../components/Productcard";

function ProductByCategory() {
  const { category } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`http://localhost:3004/products/category/${category}`);
        setProducts(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, [category]);

  return (
    <div className="container d-flex flex-column min-vh-100 mt-5 pt-5">
      <h2 className="text-center mb-4 text-capitalize">{category} Collection</h2>
      <div className="row">
        {products.length > 0 ? (
          products.map((p) => (
            <div className="col-md-3 mb-4" key={p._id}>
              <Productcard product={p} />
            </div>
          ))
        ) : (
          <p className="text-center">No products found in this category.</p>
        )}
      </div>
    </div>
  );
}

export default ProductByCategory;
