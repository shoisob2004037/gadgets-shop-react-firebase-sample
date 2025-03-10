"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { loginWithEmail, getUserProfile } from "../firebase"
import { useAuth } from "../contexts/AuthContext"

function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { setUserProfile } = useAuth()

  useEffect(() => {
    document.getElementById("email")?.focus()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const userCredential = await loginWithEmail(email, password)
      const profile = await getUserProfile(userCredential.user.uid)

      if (profile && profile.role === "admin") {
        setUserProfile(profile)
        navigate("/admin/dashboard")
      } else {
        setError("⛔ You do not have admin privileges.")
      }
    } catch (error) {
      console.error("Login error:", error.message)
      if (error.code === "auth/wrong-password") {
        setError("Incorrect password. Please try again.")
      } else if (error.code === "auth/user-not-found") {
        setError("No user found with this email.")
      } else {
        setError("Failed to log in. Please check your credentials.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="text-center mb-4">🔒 Admin Login</h2>
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                  {loading ? "Logging in..." : "Login"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
