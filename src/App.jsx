import { Routes, Route } from "react-router-dom";
import { HomePage } from "./Pages/HomePage";
import { CheckoutPage } from "./Pages/CheckoutPage";
import { OrdersPage } from "./Pages/OrdersPage";
import { TrackingPage } from "./Pages/TrackingPage";
import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [cartItems, setCartItems] = useState([]);

  async function fetchCartItems() {
    const response = await axios.get("/api/cart-items?expand=product");
    setCartItems(response.data);
  }

  useEffect(() => {
    fetchCartItems();
  }, []);

  return (
    <>
      <Routes>
        <Route
          index
          element={
            <HomePage cartItems={cartItems} fetchCartItems={fetchCartItems} />
          }
        />
        <Route
          path="checkout"
          element={<CheckoutPage cartItems={cartItems} />}
        />
        <Route path="orders" element={<OrdersPage cartItems={cartItems} />} />
        <Route path="tracking" element={<TrackingPage />} />
      </Routes>
    </>
  );
}

export default App;
