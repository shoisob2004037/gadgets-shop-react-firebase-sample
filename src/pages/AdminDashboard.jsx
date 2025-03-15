"use client"

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase"; // Adjust the import based on your setup
import { collection, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";

function AdminDashboard() {
  const { userProfile } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all"); // Filter by status
  const [newStatus, setNewStatus] = useState("pending"); // For updating order status

  useEffect(() => {
    if (!userProfile || userProfile.role !== "admin") {
      navigate("/admin/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        const ordersCollection = collection(db, "orders");
        const ordersSnapshot = await getDocs(ordersCollection);
        const ordersList = ordersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(ordersList);
      } catch (err) {
        setError("Failed to fetch orders. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userProfile, navigate]);

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status || "pending");
  };

  const handleUpdateStatus = async (orderId) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { status: newStatus });
      setOrders(orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      setSelectedOrder(null); // Close the view after update
      setError("");
    } catch (err) {
      setError("Failed to update order status. Please try again.");
      console.error(err);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        await deleteDoc(doc(db, "orders", orderId));
        setOrders(orders.filter((order) => order.id !== orderId));
        setSelectedOrder(null);
        setError("");
      } catch (err) {
        setError("Failed to delete order. Please try again.");
        console.error(err);
      }
    }
  };

  // Filter orders based on status
  const filteredOrders = statusFilter === "all"
    ? orders
    : orders.filter((order) => order.status === statusFilter);

  if (loading) {
    return (
      <div className="text-center my-5">
        <p>Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center my-5">
        <div className="alert alert-danger">{error}</div>
        <button className="btn btn-primary" onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-4">📦 Manage Orders</h1>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row">
        <div className="col-md-8">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title mb-4">Order List</h5>

              {/* Filter Section */}
              <div className="mb-3">
                <label htmlFor="statusFilter" className="form-label">
                  Filter by Status
                </label>
                <select
                  className="form-select"
                  id="statusFilter"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="pending">Pending</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {filteredOrders.length === 0 ? (
                <p>No orders found.</p>
              ) : (
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>User Email</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>{order.userEmail || "N/A"}</td>
                        <td>${order.totalPrice?.toFixed(2) || "N/A"}</td>
                        <td>{order.status || "Pending"}</td>
                        <td>
                          <button
                            className="btn btn-info btn-sm me-2"
                            onClick={() => handleViewOrder(order)}
                          >
                            View
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeleteOrder(order.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Order Details Modal-like Section */}
          {selectedOrder && (
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title mb-4">Order Details - {selectedOrder.id}</h5>
                <div className="mb-3">
                  <label className="form-label">User Email:</label>
                  <p>{selectedOrder.userEmail || "N/A"}</p>
                </div>
                <div className="mb-3">
                  <label className="form-label">Total:</label>
                  <p>${selectedOrder.totalPrice?.toFixed(2) || "N/A"}</p>
                </div>
                <div className="mb-3">
                  <label className="form-label">Delivery Address:</label>
                  <p>
                    {selectedOrder.deliveryAddress?.fullName || "N/A"},<br />
                    {selectedOrder.deliveryAddress?.addressLine1 || "N/A"},<br />
                    {selectedOrder.deliveryAddress?.city || "N/A"}, {selectedOrder.deliveryAddress?.state || "N/A"} {selectedOrder.deliveryAddress?.zipCode || "N/A"},<br />
                    {selectedOrder.deliveryAddress?.country || "N/A"}
                  </p>
                </div>
                <div className="mb-3">
                  <label className="form-label">Items:</label>
                  <ul>
                    {selectedOrder.items?.map((item, index) => (
                      <li key={index}>
                        {item.name} x {item.quantity} - ${(item.price * item.quantity).toFixed(2)}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mb-3">
                  <label htmlFor="newStatus" className="form-label">
                    Update Status
                  </label>
                  <select
                    className="form-select"
                    id="newStatus"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <button
                  className="btn btn-primary me-2"
                  onClick={() => handleUpdateStatus(selectedOrder.id)}
                >
                  Update Status
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setSelectedOrder(null)}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title mb-4">Order Summary</h5>
              <div className="mb-2">
                <span>Total Orders:</span>
                <span>{orders.length}</span>
              </div>
              <div className="mb-2">
                <span>Pending Orders:</span>
                <span>{orders.filter((o) => o.status === "pending").length}</span>
              </div>
              <div className="mb-2">
                <span>Shipped Orders:</span>
                <span>{orders.filter((o) => o.status === "shipped").length}</span>
              </div>
              <div className="mb-2">
                <span>Delivered Orders:</span>
                <span>{orders.filter((o) => o.status === "delivered").length}</span>
              </div>
              <div className="mb-2">
                <span>Cancelled Orders:</span>
                <span>{orders.filter((o) => o.status === "cancelled").length}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between fw-bold">
                <span>Total Value:</span>
                <span>
                  ${orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;