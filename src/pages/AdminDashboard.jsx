import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

function AdminDashboard() {
  const { userProfile } = useAuth()

  if (!userProfile || userProfile.role !== "admin") {
    return <div>Access Denied</div>
  }

  return (
    <div className="container mt-5">
      <h1>Admin Dashboard</h1>
      <div className="row mt-4">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Manage Orders</h5>
              <p className="card-text">View and manage all customer orders.</p>
              <Link to="/admin/orders" className="btn btn-primary">
                Go to Orders
              </Link>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Manage Products</h5>
              <p className="card-text">Add, edit, or remove products from the store.</p>
              <Link to="/admin/products" className="btn btn-primary">
                Manage Products
              </Link>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">User Management</h5>
              <p className="card-text">Manage user accounts and permissions.</p>
              <Link to="/admin/users" className="btn btn-primary">
                Manage Users
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard

