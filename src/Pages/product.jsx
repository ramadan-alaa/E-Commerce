import { useState } from "react";
import axios from "axios";
import { formatPrice } from "../utils/prices";

export function ProductPage({ product, fetchCartItems }) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  return (
    <>
      <div className="product-container">
        <div className="product-image-container">
          <img className="product-image" src={product.image} data-testid="product-image" />
        </div>

        <div className="product-name limit-text-to-2-lines">{product.name}</div>

        <div className="product-rating-container">
          <img
            className="product-rating-stars"
            src={`images/ratings/rating-${product.rating.stars * 10}.png`}
          />
          <div className="product-rating-count link-primary">
            {product.rating.count}
          </div>
        </div>

        <div className="product-price">{formatPrice(product.priceCents)}</div>

        <div className="product-quantity-container">
          <select
            value={quantity}
            onChange={(e) => {
              const quantityValue = Number(e.target.value);
              setQuantity(quantityValue);
            }}
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
          </select>
        </div>

        <div className="product-spacer"></div>

        <div
          className="added-to-cart"
          style={{
            opacity: added ? 1 : 0,
            transition: "opacity 0.3s ease",
          }}
        >
          <img src="images/icons/checkmark.png" />
          Added
        </div>

        <button
          className="add-to-cart-button button-primary"
          data-testid="add-to-cart-button"
          onClick={async () => {
            await axios.post("/api/cart-items", {
              productId: product.id,
              quantity: quantity,
            });
            await fetchCartItems();
            setAdded(true);
            setTimeout(() => setAdded(false), 1000);
          }}
        >
          Add to Cart
        </button>
      </div>
    </>
  );
}
