"use client"

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginWithEmail, getUserProfile } from "../firebase";
import { useAuth } from "../contexts/AuthContext";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUserProfile, user } = useAuth();

  useEffect(() => {
    document.getElementById("email")?.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userCredential = await loginWithEmail(email, password);
      const uid = userCredential.user.uid;
      console.log("Logged in user UID:", uid);

      const profile = await getUserProfile(uid);
      console.log("Fetched profile:", profile);

      if (!profile) {
        setError("⛔ No user profile found. Please contact support to set up your admin account.");
        return;
      }

      if (profile && profile.role === "admin") {
        setUserProfile(profile);
        navigate("/admin/dashboard");
      } else {
        setError(`⛔ You do not have admin privileges. Role: ${profile?.role || "undefined"}`);
      }
    } catch (error) {
      console.error("Login error:", error.message, error.code);
      if (error.code === "auth/wrong-password") {
        setError("Incorrect password. Please try again.");
      } else if (error.code === "auth/user-not-found") {
        setError("No user found with this email.");
      } else if (error.code === "permission-denied") {
        setError("Permission denied. Ensure your Firestore profile is accessible.");
      } else {
        setError("Failed to log in. Please check your credentials or contact support.");
      }
    } finally {
      setLoading(false);
    }
  };

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
  );
}

export default AdminLogin;