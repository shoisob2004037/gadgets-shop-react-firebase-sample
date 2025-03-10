import { db } from './firebase';
import { collection, addDoc, updateDoc, doc, getDoc, getDocs, query, where, orderBy, Timestamp } from 'firebase/firestore';

export const createOrder = async (userId, orderData) => {
  try {
    const orderRef = await addDoc(collection(db, "orders"), {
      userId,
      items: orderData.items,
      subtotal: orderData.totalPrice,
      shipping: 0,
      total: orderData.totalPrice,
      paymentStatus: "pending",
      orderStatus: "processing",
      deliveryAddress: orderData.deliveryAddress,
      paymentMethod: orderData.paymentMethod,
      paymentDetails: orderData.paymentDetails,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    
    return { success: true, orderId: orderRef.id };
  } catch (error) {
    console.error("Error creating order:", error);
    throw new Error("Failed to create order");
  }
};

// Update order status
export const updateOrderStatus = async (orderId, status) => {
  try {
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, {
      orderStatus: status,
      updatedAt: Timestamp.now()
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating order status:", error);
    throw new Error("Failed to update order status");
  }
};

// Update payment status
export const updatePaymentStatus = async (orderId, status) => {
  try {
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, {
      paymentStatus: status,
      updatedAt: Timestamp.now()
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating payment status:", error);
    throw new Error("Failed to update payment status");
  }
};

// Get order by ID
export const getOrderById = async (orderId) => {
  try {
    const orderRef = doc(db, "orders", orderId);
    const orderSnap = await getDoc(orderRef);
    
    if (orderSnap.exists()) {
      return { success: true, order: { id: orderSnap.id, ...orderSnap.data() } };
    } else {
      throw new Error("Order not found");
    }
  } catch (error) {
    console.error("Error getting order:", error);
    throw new Error("Failed to get order");
  }
};

// Get all orders for admin
export const getAllOrders = async () => {
  try {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    
    const orders = [];
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() });
    });
    
    return orders;
  } catch (error) {
    console.error("Error getting all orders:", error);
    throw new Error("Failed to get orders");
  }
};

// Get orders by user ID
export const getOrdersByUserId = async (userId) => {
  try {
    const q = query(
      collection(db, "orders"), 
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    
    const orders = [];
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() });
    });
    
    return orders;
  } catch (error) {
    console.error("Error getting user orders:", error);
    throw new Error("Failed to get user orders");
  }
};