"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { signupWithEmail, loginWithGoogle, createUserProfile } from "../firebase"
import { useAuth } from "../contexts/AuthContext"

function Signup() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { currentUser } = useAuth()

  // Redirect if already logged in
  if (currentUser) {
    navigate("/")
    return null
  }

  const handleEmailSignup = async (e) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      return setError("Passwords do not match")
    }

    try {
      setError("")
      setLoading(true)

      // Create user with email and password
      const userCredential = await signupWithEmail(email, password)

      // Create user profile in Firestore
      await createUserProfile(userCredential.user.uid, {
        name,
        email,
        deliveryAddress: {},
      })

      navigate("/")
    } catch (error) {
      setError("Failed to create an account: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignup = async () => {
    try {
      setError("")
      setLoading(true)

      // Sign in with Google
      const userCredential = await loginWithGoogle()

      // Check if this is a new user
      if (userCredential._tokenResponse?.isNewUser) {
        // Create user profile in Firestore
        await createUserProfile(userCredential.user.uid, {
          name: userCredential.user.displayName,
          email: userCredential.user.email,
          deliveryAddress: {},
        })
      }

      navigate("/")
    } catch (error) {
      setError("Failed to sign up with Google: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <div className="card">
          <div className="card-body">
            <h2 className="card-title text-center mb-4">Sign Up</h2>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleEmailSignup}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

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

              <div className="mb-3">
                <label htmlFor="confirmPassword" className="form-label">
                  Confirm Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary w-100 mb-3" disabled={loading}>
                {loading ? "Signing up..." : "Sign Up"}
              </button>
            </form>

            <div className="text-center mb-3">
              <span>OR</span>
            </div>

            <button className="btn btn-outline-danger w-100 mb-3" onClick={handleGoogleSignup} disabled={loading}>
              <i className="bi bi-google me-2"></i>
              Sign up with Google
            </button>

            <div className="text-center mt-3">
              <p>
                Already have an account? <Link to="/login">Login</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup

