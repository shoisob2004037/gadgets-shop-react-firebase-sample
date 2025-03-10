"use client"

import { useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { updateUserAddress } from "../firebase"

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
      </div>
    </div>
  )
}

export default Profile

