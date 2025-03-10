"use client"
import { Link, useNavigate } from "react-router-dom"
import { useCart } from "../contexts/CartContext"
import { useAuth } from "../contexts/AuthContext"

function ProductCard({ product }) {
  const { addItem } = useCart()
  const { currentUser } = useAuth()
  const navigate = useNavigate()

  const handleAddToCart = (e) => {
    e.preventDefault()
    
    if (!currentUser) {
      alert("Please sign in to add items to your cart")
      navigate("/signup")
      return
    }
    
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      quantity: 1,
    })
  }

  // Function to render stars based on rating
  const renderRatingStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`full-${i}`} className="bi bi-star-fill text-warning"></i>)
    }

    // Add half star if needed
    if (hasHalfStar) {
      stars.push(<i key="half" className="bi bi-star-half text-warning"></i>)
    }

    // Add empty stars
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="bi bi-star text-warning"></i>)
    }

    return stars
  }

  return (
    <div className="card h-100">
      <img
        src={product.imageUrl || "/placeholder.svg"}
        className="card-img-top"
        alt={product.name}
        style={{ height: "200px", objectFit: "contain" }}
      />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{product.name}</h5>

        {product.rating && (
          <div className="mb-2 d-flex align-items-center">
            <div className="me-2">{renderRatingStars(product.rating)}</div>
            <small className="text-muted">
              ({product.rating.toFixed(1)}) {product.reviewCount && `${product.reviewCount} reviews`}
            </small>
          </div>
        )}

        <p className="card-text text-primary fw-bold">${product.price.toFixed(2)}</p>
        <p className="card-text small text-muted mb-3">
          {product.description && product.description.length > 100
            ? `${product.description.substring(0, 100)}...`
            : product.description}
        </p>
        <div className="mt-auto">
          <Link to={`/product/${product.id}`} className="btn btn-outline-primary me-2">
            View Details
          </Link>
          <button className="btn btn-primary" onClick={handleAddToCart}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard