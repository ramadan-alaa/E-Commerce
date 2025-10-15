import "./HomePage.css";
import { Header } from "../components/Header";
import { useEffect, useState } from "react";
import axios from "axios";
import { ProductPage } from "./product";

export function HomePage({ cartItems, fetchCartItems }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      const response = await axios.get("/api/products");
      setProducts(response.data);
    }

    fetchProducts();
  }, []);

  return (
    <>
      <title>E-Commerce App</title>

      <Header cartItems={cartItems} />

      <div className="home-page">
        <div className="products-grid">
          {products.map((product) => {
            return (
              <ProductPage
                key={product.id}
                product={product}
                fetchCartItems={fetchCartItems}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}
