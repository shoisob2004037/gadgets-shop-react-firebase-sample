// src/components/AdminDashboard.js
import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

function AdminDashboard() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "notifications"), (snapshot) => {
      const notificationsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotifications(notificationsData);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <ul>
        {notifications.map((notification) => (
          <li key={notification.id}>
            {notification.type}: {notification.customerName} - ${notification.totalAmount}{" "}
            {notification.read ? "(Read)" : "(Unread)"}
            <button
              onClick={() =>
                db.collection("notifications").doc(notification.id).update({ read: true })
              }
            >
              Mark as Read
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminDashboard;