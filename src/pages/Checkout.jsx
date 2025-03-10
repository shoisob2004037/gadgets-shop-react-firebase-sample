"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { useCart } from "../contexts/CartContext"
import { updateUserAddress } from "../firebase"
import { createOrder } from "../orders";

function Checkout() {
  const { currentUser, userProfile, setUserProfile } = useAuth()
  const { cart, emptyCart } = useCart()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    fullName: userProfile?.deliveryAddress?.fullName || "",
    addressLine1: userProfile?.deliveryAddress?.addressLine1 || "",
    addressLine2: userProfile?.deliveryAddress?.addressLine2 || "",
    city: userProfile?.deliveryAddress?.city || "",
    state: userProfile?.deliveryAddress?.state || "",
    zipCode: userProfile?.deliveryAddress?.zipCode || "",
    country: userProfile?.deliveryAddress?.country || "",
    phoneNumber: userProfile?.deliveryAddress?.phoneNumber || "",
  })

  const [paymentData, setPaymentData] = useState({
    paymentMethod: "creditCard", // Default payment method
    cardHolder: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderId, setOrderId] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handlePaymentChange = (e) => {
    const { name, value } = e.target
    setPaymentData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (cart.items.length === 0) {
      setError("Your cart is empty")
      return
    }

    // Basic card validation
    if (paymentData.paymentMethod === "creditCard") {
      if (!paymentData.cardHolder || !paymentData.cardNumber || !paymentData.expiryDate || !paymentData.cvv) {
        setError("Please fill in all payment details")
        return
      }
      
      // Simple card number validation (should be more robust in production)
      if (paymentData.cardNumber.replace(/\s/g, '').length !== 16) {
        setError("Invalid card number")
        return
      }
      
      // Simple CVV validation
      if (paymentData.cvv.length < 3) {
        setError("Invalid CVV")
        return
      }
    }

    try {
      setLoading(true)
      setError("")

      // Update user address in profile
      await updateUserAddress(currentUser.uid, formData)
      
      setUserProfile((prev) => ({
        ...prev,
        deliveryAddress: formData,
      }))
      
      // Create new order with payment info
      // Note: In a real app, you'd use a payment processor and not store full card details
      const paymentDetails = {
        method: paymentData.paymentMethod,
        // Only store last 4 digits for reference
        cardLastFour: paymentData.paymentMethod === "creditCard" ? 
          paymentData.cardNumber.slice(-4) : null,
        cardHolder: paymentData.paymentMethod === "creditCard" ? 
          paymentData.cardHolder : null
      }
      
      const orderResult = await createOrder(currentUser.uid, {
        items: cart.items,
        totalPrice: cart.totalPrice,
        deliveryAddress: formData,
        paymentMethod: paymentData.paymentMethod,
        paymentDetails
      })
      
      // Empty the cart after successful order
      await emptyCart()
      
      setOrderId(orderResult.orderId)
      setOrderPlaced(true)
    } catch (error) {
      setError("Failed to place order: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  if (orderPlaced) {
    return (
      <div className="text-center my-5">
        <div className="mb-4">
          <i className="bi bi-check-circle text-success" style={{ fontSize: "4rem" }}></i>
        </div>
        <h2>Thank you for your order!</h2>
        <p className="mb-4">Your order has been placed successfully.</p>
        <p className="mb-4">Order ID: <strong>{orderId}</strong></p>
        <button className="btn btn-primary" onClick={() => navigate("/")}>
          Continue Shopping
        </button>
      </div>
    )
  }

  return (
    <div>
      <h1 className="mb-4">Checkout</h1>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row">
        <div className="col-md-8">
          <form onSubmit={handleSubmit}>
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title mb-4">Shipping Information</h5>

                <div className="mb-3">
                  <label htmlFor="fullName" className="form-label">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="addressLine1" className="form-label">
                    Address Line 1
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="addressLine1"
                    name="addressLine1"
                    value={formData.addressLine1}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="addressLine2" className="form-label">
                    Address Line 2 (Optional)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="addressLine2"
                    name="addressLine2"
                    value={formData.addressLine2}
                    onChange={handleChange}
                  />
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="city" className="form-label">
                      City
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="state" className="form-label">
                      State/Province
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="zipCode" className="form-label">
                      ZIP/Postal Code
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="country" className="form-label">
                      Country
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="phoneNumber" className="form-label">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    className="form-control"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title mb-4">Payment Information</h5>

                <div className="mb-3">
                  <label htmlFor="paymentMethod" className="form-label">
                    Payment Method
                  </label>
                  <select
                    className="form-select"
                    id="paymentMethod"
                    name="paymentMethod"
                    value={paymentData.paymentMethod}
                    onChange={handlePaymentChange}
                    required
                  >
                    <option value="creditCard">Credit Card</option>
                    <option value="paypal">PayPal</option>
                    <option value="bankTransfer">Bank Transfer</option>
                  </select>
                </div>

                {paymentData.paymentMethod === "creditCard" && (
                  <>
                    <div className="mb-3">
                      <label htmlFor="cardHolder" className="form-label">
                        Card Holder Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="cardHolder"
                        name="cardHolder"
                        value={paymentData.cardHolder}
                        onChange={handlePaymentChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="cardNumber" className="form-label">
                        Card Number
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="cardNumber"
                        name="cardNumber"
                        value={paymentData.cardNumber}
                        onChange={handlePaymentChange}
                        placeholder="XXXX XXXX XXXX XXXX"
                        maxLength="19"
                        required
                      />
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="expiryDate" className="form-label">
                          Expiry Date (MM/YY)
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="expiryDate"
                          name="expiryDate"
                          value={paymentData.expiryDate}
                          onChange={handlePaymentChange}
                          placeholder="MM/YY"
                          maxLength="5"
                          required
                        />
                      </div>

                      <div className="col-md-6 mb-3">
                        <label htmlFor="cvv" className="form-label">
                          CVV
                        </label>
                        <input
                          type="password"
                          className="form-control"
                          id="cvv"
                          name="cvv"
                          value={paymentData.cvv}
                          onChange={handlePaymentChange}
                          maxLength="4"
                          required
                        />
                      </div>
                    </div>
                  </>
                )}

                {paymentData.paymentMethod === "paypal" && (
                  <div className="alert alert-info">
                    You will be redirected to PayPal to complete your payment after submitting the order.
                  </div>
                )}

                {paymentData.paymentMethod === "bankTransfer" && (
                  <div className="alert alert-info">
                    Bank transfer details will be provided after your order is submitted.
                  </div>
                )}
              </div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading || cart.items.length === 0}>
              {loading ? "Processing..." : "Place Order"}
            </button>
          </form>
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title mb-4">Order Summary</h5>

              {cart.items.map((item, index) => (
                <div key={index} className="d-flex justify-content-between mb-2">
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}

              <hr />

              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal</span>
                <span>${cart.totalPrice.toFixed(2)}</span>
              </div>

              <div className="d-flex justify-content-between mb-2">
                <span>Shipping</span>
                <span>Free</span>
              </div>

              <hr />

              <div className="d-flex justify-content-between fw-bold">
                <span>Total</span>
                <span>${cart.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout