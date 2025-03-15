import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, updateDoc, collection, query, getDocs, where } from "firebase/firestore";

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Authentication functions
export const signupWithEmail = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("User signed up:", userCredential.user.uid);
    return userCredential;
  } catch (error) {
    console.error("Signup error:", error.message, error.code);
    throw error;
  }
};

export const loginWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("User logged in:", userCredential.user.uid);
    return userCredential;
  } catch (error) {
    console.error("Login error:", error.message, error.code);
    throw error;
  }
};

export const loginWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    console.log("User logged in with Google:", userCredential.user.uid);
    return userCredential;
  } catch (error) {
    console.error("Google login error:", error.message, error.code);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    console.log("User logged out");
  } catch (error) {
    console.error("Logout error:", error.message, error.code);
    throw error;
  }
};


export const createUserProfile = async (userId, data) => {
  try {
    const userRef = doc(db, "users", userId);
    await setDoc(userRef, data, { merge: true });
    console.log(`User profile created/updated for UID: ${userId}`, data);
    const updatedProfile = await getUserProfile(userId);
    return updatedProfile;
  } catch (error) {
    console.error("Error creating user profile:", error.message, error.code);
    throw error;
  }
};

// Function to set up an admin profile (use this manually or via a secure admin setup process)
export const setupAdminProfile = async (userId, email) => {
  try {
    const userRef = doc(db, "users", userId);
    const adminData = {
      email: email,
      role: "admin",
      name: "Admin User",
      createdAt: new Date().toISOString(),
    };
    await setDoc(userRef, adminData, { merge: true });
    console.log(`Admin profile created for UID: ${userId}`, adminData);
    return adminData;
  } catch (error) {
    console.error("Error setting up admin profile:", error.message, error.code);
    throw error;
  }
};
export const getUserOrders = async (userId) => {
  try {
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, where('userId', '==', userId)); // Assumes 'userId' is a field in orders
    const querySnapshot = await getDocs(q);
    const orders = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(), // Convert Firestore Timestamp to JS Date
    }));
    return orders;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

export const getUserProfile = async (userId) => {
  try {
    console.log(`Attempting to fetch profile for UID: ${userId}`);
    const userRef = doc(db, "users", userId);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      const profileData = docSnap.data();
      console.log(`Profile fetched successfully for UID: ${userId}`, profileData);
      return profileData;
    } else {
      console.warn(`No profile found for UID: ${userId}`);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching profile for UID: ${userId}`, error.message, error.code);
    throw error; 
  }
};

export const updateUserAddress = async (userId, address) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, { deliveryAddress: address });
    console.log(`User address updated for UID: ${userId}`, address);
  } catch (error) {
    console.error("Error updating user address:", error.message, error.code);
    throw error;
  }
};

export const getCart = async (userId) => {
  try {
    const cartRef = doc(db, "cart", userId);
    const cartSnap = await getDoc(cartRef);
    if (cartSnap.exists()) {
      const cartData = cartSnap.data();
      console.log(`Cart fetched for UID: ${userId}`, cartData);
      return cartData;
    } else {
      console.log(`No cart found for UID: ${userId}, returning empty cart`);
      return { items: [], totalPrice: 0 };
    }
  } catch (error) {
    console.error("Error fetching cart:", error.message, error.code);
    throw error;
  }
};

export const addToCart = async (userId, product) => {
  try {
    const cartRef = doc(db, "cart", userId);
    const cartSnap = await getDoc(cartRef);

    if (!cartSnap.exists()) {
      await setDoc(cartRef, {
        items: [product],
        totalPrice: product.price * product.quantity,
      });
      console.log(`New cart created for UID: ${userId}`, product);
    } else {
      const cartData = cartSnap.data();
      const existingItemIndex = cartData.items.findIndex(
        (item) => item.productId === product.productId
      );

      if (existingItemIndex >= 0) {
        cartData.items[existingItemIndex].quantity += product.quantity;
        await updateDoc(cartRef, {
          items: cartData.items,
          totalPrice: cartData.items.reduce(
            (total, item) => total + item.price * item.quantity,
            0
          ),
        });
        console.log(`Updated item quantity in cart for UID: ${userId}`, cartData.items[existingItemIndex]);
      } else {
        const updatedItems = [...cartData.items, product];
        await updateDoc(cartRef, {
          items: updatedItems,
          totalPrice: updatedItems.reduce(
            (total, item) => total + item.price * item.quantity,
            0
          ),
        });
        console.log(`Added new item to cart for UID: ${userId}`, product);
      }
    }
  } catch (error) {
    console.error("Error adding to cart:", error.message, error.code);
    throw error;
  }
};

export const removeFromCart = async (userId, product) => {
  try {
    const cartRef = doc(db, "cart", userId);
    const cartSnap = await getDoc(cartRef);

    if (cartSnap.exists()) {
      const cartData = cartSnap.data();
      const updatedItems = cartData.items.filter(
        (item) => item.productId !== product.productId
      );

      await updateDoc(cartRef, {
        items: updatedItems,
        totalPrice: updatedItems.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        ),
      });
      console.log(`Removed item from cart for UID: ${userId}`, product);
    }
  } catch (error) {
    console.error("Error removing from cart:", error.message, error.code);
    throw error;
  }
};

export const clearCart = async (userId) => {
  try {
    const cartRef = doc(db, "cart", userId);
    await setDoc(cartRef, { items: [], totalPrice: 0 });
    console.log(`Cart cleared for UID: ${userId}`);
  } catch (error) {
    console.error("Error clearing cart:", error.message, error.code);
    throw error;
  }
};

export const updateCartItemQuantity = async (userId, item, newQuantity) => {
  try {
    const cartRef = doc(db, "cart", userId);
    const cartSnap = await getDoc(cartRef);

    if (cartSnap.exists()) {
      const cartData = cartSnap.data();
      const updatedItems = cartData.items.map((cartItem) => {
        if (cartItem.productId === item.productId) {
          return { ...cartItem, quantity: newQuantity };
        }
        return cartItem;
      });

      const newTotalPrice = updatedItems.reduce(
        (total, cartItem) => total + cartItem.price * cartItem.quantity,
        0
      );

      await updateDoc(cartRef, {
        items: updatedItems,
        totalPrice: newTotalPrice,
      });

      console.log(`Updated cart item quantity for UID: ${userId}`, { item, newQuantity });
      return { items: updatedItems, totalPrice: newTotalPrice };
    }

    console.warn(`Cart not found for UID: ${userId}`);
    return null;
  } catch (error) {
    console.error("Error updating cart item quantity:", error.message, error.code);
    throw error;
  }
};

// Export db and auth
export { db, auth };