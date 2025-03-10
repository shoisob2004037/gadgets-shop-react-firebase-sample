"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { loginWithEmail, loginWithGoogle } from "../firebase"
import { useAuth } from "../contexts/AuthContext"

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { currentUser } = useAuth()

  // Redirect if already logged in
  if (currentUser) {
    navigate("/")
    return null
  }

  const handleEmailLogin = async (e) => {
    e.preventDefault()

    try {
      setError("")
      setLoading(true)
      await loginWithEmail(email, password)
      navigate("/")
    } catch (error) {
      setError("Failed to log in: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      setError("")
      setLoading(true)
      await loginWithGoogle()
      navigate("/")
    } catch (error) {
      setError("Failed to log in with Google: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <div className="card">
          <div className="card-body">
            <h2 className="card-title text-center mb-4">Login</h2>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleEmailLogin}>
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
                />
              </div>

              <button type="submit" className="btn btn-primary w-100 mb-3" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <div className="text-center mb-3">
              <span>OR</span>
            </div>

            <button className="btn btn-outline-danger w-100 mb-3" onClick={handleGoogleLogin} disabled={loading}>
              <i className="bi bi-google me-2"></i>
              Login with Google
            </button>

            <div className="text-center mt-3">
              <p>
                Don't have an account? <Link to="/signup">Sign up</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login

