import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

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
const db = getFirestore(app); // Firestore instance

// Authentication functions
export const signupWithEmail = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const loginWithEmail = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};

export const logoutUser = () => {
  return signOut(auth);
};

// Firestore functions
export const createUserProfile = async (userId, data) => {
  const userRef = doc(db, "users", userId);
  return setDoc(userRef, data);
};

export const getUserProfile = async (userId) => {
  const userRef = doc(db, "users", userId);
  const docSnap = await getDoc(userRef);
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    return null;
  }
};

export const updateUserAddress = async (userId, address) => {
  const userRef = doc(db, "users", userId);
  return updateDoc(userRef, { deliveryAddress: address });
};

export const getCart = async (userId) => {
  const cartRef = doc(db, "cart", userId);
  const cartSnap = await getDoc(cartRef);

  if (cartSnap.exists()) {
    return cartSnap.data();
  } else {
    return { items: [], totalPrice: 0 };
  }
};

export const addToCart = async (userId, product) => {
  const cartRef = doc(db, "cart", userId);
  const cartSnap = await getDoc(cartRef);

  if (!cartSnap.exists()) {
    await setDoc(cartRef, {
      items: [product],
      totalPrice: product.price * product.quantity,
    });
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
    } else {
      const updatedItems = [...cartData.items, product];
      await updateDoc(cartRef, {
        items: updatedItems,
        totalPrice: updatedItems.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        ),
      });
    }
  }
};

export const removeFromCart = async (userId, product) => {
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
  }
};

export const clearCart = async (userId) => {
  const cartRef = doc(db, "cart", userId);
  await setDoc(cartRef, { items: [], totalPrice: 0 });
};

export const updateCartItemQuantity = async (userId, item, newQuantity) => {
  const cartRef = doc(db, "cart", userId);
  const cartSnap = await getDoc(cartRef);

  if (cartSnap.exists()) {
    const cartData = cartSnap.data();

    // Find the item in the cart and update its quantity
    const updatedItems = cartData.items.map((cartItem) => {
      if (cartItem.productId === item.productId) {
        return { ...cartItem, quantity: newQuantity };
      }
      return cartItem;
    });

    // Recalculate the total price
    const newTotalPrice = updatedItems.reduce(
      (total, cartItem) => total + cartItem.price * cartItem.quantity,
      0
    );

    // Update the cart in Firestore
    await updateDoc(cartRef, {
      items: updatedItems,
      totalPrice: newTotalPrice,
    });

    return { items: updatedItems, totalPrice: newTotalPrice };
  }

  return null;
};

// Export db
export { db, auth };