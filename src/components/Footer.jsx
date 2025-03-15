import { Link } from "react-router-dom"

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-light mt-5 pt-4 pb-4">
      <div className="container">
        <div className="row">
          {/* Shop Information */}
          <div className="col-md-4 mb-4 mb-md-0">
            <h5 className="mb-3">ShopReact</h5>
            <p className="text-muted">Your one-stop destination for quality products at affordable prices.</p>
            <div className="d-flex gap-2">
              <a href="#" className="btn btn-outline-dark btn-sm">
                Facebook
              </a>
              <a href="#" className="btn btn-outline-dark btn-sm">
                Twitter
              </a>
              <a href="#" className="btn btn-outline-dark btn-sm">
                Instagram
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-md-4 mb-4 mb-md-0">
            <h5 className="mb-3">Quick Links</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/" className="text-decoration-none text-muted">
                  Home
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/cart" className="text-decoration-none text-muted">
                  Cart
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/profile" className="text-decoration-none text-muted">
                  My Account
                </Link>
              </li>
              <li className="mb-2">
                <a href="#" className="text-decoration-none text-muted">
                  About Us
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-decoration-none text-muted">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="col-md-4">
            <h5 className="mb-3">Contact Us</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <span className="text-muted">123 Shopping Street, E-Commerce City, 10001</span>
              </li>
              <li className="mb-2">
                <span className="text-muted">+1 (555) 123-4567</span>
              </li>
              <li className="mb-2">
                <span className="text-muted">support@gadgetscare.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-3" />

        {/* Copyright */}
        <div className="row">
          <div className="col-md-6 text-center text-md-start mb-2 mb-md-0">
            <p className="mb-0 text-muted">&copy; {currentYear} Shoisob. All rights reserved.</p>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <p className="mb-0 text-muted">Made with ❤️ by Shoisob2004037</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

