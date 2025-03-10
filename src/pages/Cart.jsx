"use client"
import { Link } from "react-router-dom"
import { useCart } from "../contexts/CartContext"
import { useAuth } from "../contexts/AuthContext"
import { updateCartItemQuantity, getCart } from "../firebase"

function Cart() {
  const { cart, removeItem, loading, setCart } = useCart()
  const { currentUser } = useAuth()

  if (loading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  if (cart.items.length === 0) {
    return (
      <div className="text-center my-5">
        <h2>Your cart is empty</h2>
        <p className="mb-4">Looks like you haven't added any items to your cart yet.</p>
        <Link to="/" className="btn btn-primary">
          Continue Shopping
        </Link>
      </div>
    )
  }

  const handleQuantityChange = async (item, newQuantity) => {
    if (!currentUser) return

    try {
      if (newQuantity <= 0) {
        // If quantity is 0 or less, remove the item
        await removeItem(item)
      } else {
        // Create a new item object with updated quantity
        const updatedItem = {
          ...item,
          quantity: newQuantity,
        }

        // Update the item quantity in Firestore
        await updateCartItemQuantity(currentUser.uid, updatedItem, newQuantity)

        // Get the updated cart
        const updatedCart = await getCart(currentUser.uid)

        // Update the cart state
        setCart(updatedCart)
      }
    } catch (error) {
      console.error("Error updating quantity:", error)
    }
  }

  return (
    <div>
      <h1 className="mb-4">Your Cart</h1>

      <div className="card mb-4">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {cart.items.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <div className="d-flex align-items-center">
                        <img
                          src={item.imageUrl || "/placeholder.svg"}
                          alt={item.name}
                          className="me-3"
                          style={{ width: "50px", height: "50px", objectFit: "cover" }}
                        />
                        <div>
                          <h6 className="mb-0">{item.name}</h6>
                        </div>
                      </div>
                    </td>
                    <td>${item.price.toFixed(2)}</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => handleQuantityChange(item, item.quantity - 1)}
                        >
                          -
                        </button>
                        <span className="mx-2">{item.quantity}</span>
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => handleQuantityChange(item, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td>${(item.price * item.quantity).toFixed(2)}</td>
                    <td>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => removeItem(item)}>
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 offset-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Order Summary</h5>
              <div className="d-flex justify-content-between mb-3">
                <span>Subtotal:</span>
                <span>${cart.totalPrice.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-3 fw-bold">
                <span>Total:</span>
                <span>${cart.totalPrice.toFixed(2)}</span>
              </div>
              <Link to="/checkout" className="btn btn-primary w-100">
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart

