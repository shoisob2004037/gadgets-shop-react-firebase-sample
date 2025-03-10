"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "./AuthContext"
import { getCart, addToCart, removeFromCart, clearCart } from "../firebase"

const CartContext = createContext()

export function useCart() {
  return useContext(CartContext)
}

export function CartProvider({ children }) {
  const { currentUser } = useAuth()
  const [cart, setCart] = useState({ items: [], totalPrice: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCart() {
      if (currentUser) {
        try {
          const cartData = await getCart(currentUser.uid)

          if (cartData.items && cartData.items.length > 0) {
            cartData.totalPrice = cartData.items.reduce((total, item) => total + item.price * item.quantity, 0)
          }

          setCart(cartData)
        } catch (error) {
          console.error("Error fetching cart:", error)
          setCart({ items: [], totalPrice: 0 })
        }
      } else {
        // Reset cart when logged out
        setCart({ items: [], totalPrice: 0 })
      }
      setLoading(false)
    }

    fetchCart()
  }, [currentUser])

  const addItem = async (product) => {
    if (currentUser) {
      try {
        await addToCart(currentUser.uid, product)
        const updatedCart = await getCart(currentUser.uid)
        setCart(updatedCart)
      } catch (error) {
        console.error("Error adding item to cart:", error)
      }
    }
  }

  const removeItem = async (product) => {
    if (currentUser) {
      try {
        await removeFromCart(currentUser.uid, product)
        const updatedCart = await getCart(currentUser.uid)
        setCart(updatedCart)
      } catch (error) {
        console.error("Error removing item from cart:", error)
      }
    }
  }

  const emptyCart = async () => {
    if (currentUser) {
      try {
        await clearCart(currentUser.uid)
        setCart({ items: [], totalPrice: 0 })
      } catch (error) {
        console.error("Error emptying cart:", error)
      }
    }
  }

  const value = {
    cart,
    setCart,
    addItem,
    removeItem,
    emptyCart,
    loading,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

