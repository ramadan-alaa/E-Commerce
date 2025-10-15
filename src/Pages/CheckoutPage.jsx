import "./CheckoutPage.css";
import "./checkout-header.css";
import { formatPrice } from "../utils/prices";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import {useNavigate} from "react-router-dom";

export function CheckoutPage({ cartItems, fetchCartItems }) {
  const navigate = useNavigate();
  const [deliveryOptions, setDeliveryOptions] = useState([]);
  const [paymentSummary, setPaymentSummary] = useState(null);

  useEffect(() => {
    async function fetchDeliveryOptions() {
      const response = await axios.get(
        "/api/delivery-options?expand=estimatedDeliveryTime"
      );
      setDeliveryOptions(response.data);
    }

    async function fetchPaymentSummary() {
      const response = await axios.get("/api/payment-summary");
      setPaymentSummary(response.data);
    }

    fetchDeliveryOptions();
    fetchPaymentSummary();
  }, [cartItems]);

  const updateQuantity = async (productId, newQuantity) => {
    await axios.put(`/api/cart-items/${productId}`, {
      quantity: Number(newQuantity),
    });
    await fetchCartItems();
  };

  const deleteCartItem = async (productId) => {
    await axios.delete(`/api/cart-items/${productId}`);
    await fetchCartItems();
  };

  const updateDeliveryOption = async (productId, deliveryOptionId) => {
    await axios.put(`/api/cart-items/${productId}`, {
      deliveryOptionId,
    });
    await fetchCartItems();
  };
 
  const placeOrder = async () => {
    await axios.post("/api/orders");
    await fetchCartItems();
    navigate("/orders");
  };

  return (
    <>
      <title>Checkout</title>

      <div className="checkout-header">
        <div className="header-content">
          <div className="checkout-header-left-section">
            <a href="/">
              <img className="logo" src="images/logo.png" />
              <img className="mobile-logo" src="images/mobile-logo.png" />
            </a>
          </div>

          <div className="checkout-header-middle-section">
            Checkout (
            <a className="return-to-home-link" href="/">
              {cartItems.length} items
            </a>
            )
          </div>

          <div className="checkout-header-right-section">
            <img src="images/icons/checkout-lock-icon.png" />
          </div>
        </div>
      </div>

      <div className="checkout-page">
        <div className="page-title">Review your order</div>

        <div className="checkout-grid">
          <div className="order-summary">
            {cartItems.length > 0 &&
              cartItems.map((cartItem) => {
                const selectedDeliveryOption = deliveryOptions.find(
                  (option) => option.id === cartItem.deliveryOptionId
                );

                return (
                  <div key={cartItem.productId} className="cart-item-container">
                    <div className="delivery-date">
                      Delivery date:{" "}
                      {selectedDeliveryOption
                        ? dayjs(
                            selectedDeliveryOption.estimatedDeliveryTimeMs
                          ).format("dddd, MMMM D")
                        : "Loading..."}
                    </div>

                    <div className="cart-item-details-grid">
                      <img
                        className="product-image"
                        src={cartItem.product.image}
                      />

                      <div className="cart-item-details">
                        <div className="product-name">
                          {cartItem.product.name}
                        </div>
                        <div className="product-price">
                          {formatPrice(cartItem.product.priceCents)}
                        </div>
                        <div className="product-quantity">
                          <span>
                            Quantity:{" "}
                            <select
                              value={cartItem.quantity}
                              onChange={(e) =>
                                updateQuantity(
                                  cartItem.productId,
                                  e.target.value
                                )
                              }
                            >
                              {Array.from({ length: 10 }, (_, i) => i + 1).map(
                                (num) => (
                                  <option key={num} value={num}>
                                    {num}
                                  </option>
                                )
                              )}
                            </select>
                          </span>
                          <span
                            className="delete-quantity-link link-primary"
                            onClick={() => deleteCartItem(cartItem.productId)}
                          >
                            Delete
                          </span>
                        </div>
                      </div>

                      <div className="delivery-options">
                        <div className="delivery-options-title">
                          Choose a delivery option:
                        </div>

                        {deliveryOptions.map((option) => {
                          const priceStatus =
                            option.priceCents > 0
                              ? `${formatPrice(option.priceCents)} - Shipping`
                              : "FREE Shipping";

                          return (
                            <div
                              key={option.id}
                              className="delivery-option"
                              onClick={() =>
                                updateDeliveryOption(
                                  cartItem.productId,
                                  option.id
                                )
                              }
                            >
                              <input
                                type="radio"
                                checked={
                                  option.id === cartItem.deliveryOptionId
                                }
                                className="delivery-option-input"
                                name={`delivery-option-${cartItem.productId}`}
                                onChange={() => {}}
                              />
                              <div>
                                <div className="delivery-option-date">
                                  {dayjs(option.estimatedDeliveryTimeMs).format(
                                    "dddd, MMMM D"
                                  )}
                                </div>
                                <div className="delivery-option-price">
                                  {priceStatus}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

          <div className="payment-summary">
            <div className="payment-summary-title">Payment Summary</div>

            {paymentSummary && (
              <>
                <div className="payment-summary-row">
                  <div>Items ({paymentSummary.totalItems}):</div>
                  <div className="payment-summary-money">
                    {formatPrice(paymentSummary.productCostCents)}
                  </div>
                </div>

                <div className="payment-summary-row">
                  <div>Shipping &amp; handling:</div>
                  <div className="payment-summary-money">
                    {formatPrice(paymentSummary.shippingCostCents)}
                  </div>
                </div>

                <div className="payment-summary-row subtotal-row">
                  <div>Total before tax:</div>
                  <div className="payment-summary-money">
                    {formatPrice(paymentSummary.totalCostBeforeTaxCents)}
                  </div>
                </div>

                <div className="payment-summary-row">
                  <div>Estimated tax (10%):</div>
                  <div className="payment-summary-money">
                    {formatPrice(paymentSummary.taxCents)}
                  </div>
                </div>

                <div className="payment-summary-row total-row">
                  <div>Order total:</div>
                  <div className="payment-summary-money">
                    {formatPrice(paymentSummary.totalCostCents)}
                  </div>
                </div>

                <button className="place-order-button button-primary"
                onClick={placeOrder}>
                  Place your order
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
