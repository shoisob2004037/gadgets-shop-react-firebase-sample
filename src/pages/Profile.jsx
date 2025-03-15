"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { updateUserAddress, getUserOrders } from "../firebase"

function Profile() {
  const { currentUser, userProfile, setUserProfile } = useAuth()

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

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [orders, setOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(true)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)
      setError("")
      setSuccess("")

      // Update delivery address in Firestore
      await updateUserAddress(currentUser.uid, formData)

      // Update local user profile
      setUserProfile((prev) => ({
        ...prev,
        deliveryAddress: formData,
      }))

      setSuccess("Your profile has been updated successfully.")
    } catch (error) {
      setError("Failed to update profile: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    async function fetchOrders() {
      try {
        const userOrders = await getUserOrders(currentUser.uid)
        setOrders(userOrders)
      } catch (error) {
        console.error("Error fetching orders:", error)
      } finally {
        setOrdersLoading(false)
      }
    }

    fetchOrders()
  }, [currentUser.uid])

  return (
    <div>
      <h1 className="mb-4">Your Profile</h1>

      <div className="row">
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Account Information</h5>
              <p>
                <strong>Email:</strong> {currentUser.email}
              </p>
              {currentUser.displayName && (
                <p>
                  <strong>Name:</strong> {currentUser.displayName}
                </p>
              )}
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <h5 className="card-title mb-4">Delivery Address</h5>

              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}

              <form onSubmit={handleSubmit}>
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
                  />
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title mb-4">Order History</h5>

              {ordersLoading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2">Loading your orders...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="alert alert-info">You haven't placed any orders yet.</div>
              ) : (
                <div>
                  {orders.map((order) => (
                    <div key={order.id} className="card mb-3">
                      <div className="card-header d-flex justify-content-between align-items-center">
                        <div>
                          <strong>Order #{order.id.slice(-6)}</strong>
                          <div className="text-muted small">
                            {order.createdAt?.toDate
                              ? new Date(order.createdAt.toDate()).toLocaleString()
                              : "Date unavailable"}
                          </div>
                        </div>
                        <span className="badge bg-primary">${order.totalPrice?.toFixed(2)}</span>
                      </div>
                      <div className="card-body">
                        <div className="row mb-3">
                          <div className="col-md-6">
                            <h6>Shipping Address</h6>
                            <address className="mb-0">
                              {order.deliveryAddress?.fullName}
                              <br />
                              {order.deliveryAddress?.addressLine1}
                              <br />
                              {order.deliveryAddress?.addressLine2 && (
                                <>
                                  {order.deliveryAddress.addressLine2}
                                  <br />
                                </>
                              )}
                              {order.deliveryAddress?.city}, {order.deliveryAddress?.state}{" "}
                              {order.deliveryAddress?.zipCode}
                              <br />
                              {order.deliveryAddress?.country}
                              <br />
                              {order.deliveryAddress?.phoneNumber}
                            </address>
                          </div>
                          <div className="col-md-6">
                            <h6>Payment Method</h6>
                            <p className="mb-0 text-capitalize">
                              {order.paymentMethod}
                              {order.paymentDetails?.cardLastFour && (
                                <span className="d-block small">
                                  Card ending in {order.paymentDetails.cardLastFour}
                                </span>
                              )}
                            </p>
                          </div>
                        </div>

                        <h6>Order Items</h6>
                        <div className="table-responsive">
                          <table className="table table-sm">
                            <thead>
                              <tr>
                                <th>Item</th>
                                <th>Quantity</th>
                                <th className="text-end">Price</th>
                              </tr>
                            </thead>
                            <tbody>
                              {order.items?.map((item, idx) => (
                                <tr key={idx}>
                                  <td>{item.name}</td>
                                  <td>{item.quantity}</td>
                                  <td className="text-end">${(item.price * item.quantity).toFixed(2)}</td>
                                </tr>
                              ))}
                              <tr>
                                <td colSpan="2" className="text-end">
                                  <strong>Total:</strong>
                                </td>
                                <td className="text-end">
                                  <strong>${order.totalPrice?.toFixed(2)}</strong>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile

