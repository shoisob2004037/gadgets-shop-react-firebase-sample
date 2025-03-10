"use client"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { useCart } from "../contexts/CartContext"
import { logoutUser } from "../firebase"

function Navbar() {
  const { currentUser } = useAuth()
  const { cart } = useCart()
  const navigate = useNavigate()
  const { userProfile } = useAuth();
  const isAdmin = userProfile?.role === 'admin';

  const handleLogout = async () => {
    try {
      await logoutUser()
      navigate("/login")
    } catch (error) {
      console.error("Failed to log out", error)
    }
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow">
      <div className="container">
        <Link className="navbar-brand fw-bold text-primary" to="/">
          <i className="bi bi-bag-check-fill"></i> Gadgets Care
        </Link>

        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link text-light fw-semibold" to="/">
                Home
              </Link>
            </li>
          </ul>
          {isAdmin && (
        <Link to="/admin/orders" className="nav-link">
          Order Management
        </Link>
      )}
          

          <ul className="navbar-nav">
            {/* Cart Link */}
            <li className="nav-item">
              <Link className="nav-link text-light position-relative" to="/cart">
                <i className="bi bi-cart3"></i> Cart
                {cart.items.length > 0 && (
                  <span className="badge bg-primary position-absolute top-0 start-100 translate-middle">
                    {cart.items.length}
                  </span>
                )}
              </Link>
            </li>
            

            {/* Authentication Links */}
            {currentUser ? (
              <li className="nav-item dropdown">
                <button 
                  className="nav-link dropdown-toggle text-light btn btn-link"
                  data-bs-toggle="dropdown"
                >
                  <i className="bi bi-person-circle"></i> Profile
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <Link className="dropdown-item" to="/profile">
                      My Profile
                    </Link>
                  </li>
                  <li>
                    <button className="dropdown-item text-danger" onClick={handleLogout}>
                      Logout
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link text-light" to="/login">
                    <i className="bi bi-box-arrow-in-right"></i> Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-light btn btn-primary rounded-pill px-3" to="/signup">
                    <i className="bi bi-person-plus-fill"></i> Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
