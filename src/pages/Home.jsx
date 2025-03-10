"use client";

import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
const mockProducts = [
  {
    id: "1",
    name: "iPhone 15 Pro",
    price: 999.99,
    rating: 4.8,
    reviewCount: 1245,
    description:
      "Experience the ultimate iPhone with the powerful A17 Pro chip, a titanium design, and a groundbreaking camera system.",
    features: [
      "A17 Pro chip for unprecedented performance",
      "48MP main camera with 5x optical zoom",
      "Titanium design - lighter and more durable",
      "Action button for quick access to favorite features",
      "All-day battery life with up to 29 hours of video playback",
    ],
    specifications: {
      display: "6.1-inch Super Retina XDR display with ProMotion",
      processor: "A17 Pro chip with 6-core CPU",
      camera: "48MP main, 12MP ultra wide, 12MP telephoto with 5x optical zoom",
      storage: "256GB, 512GB, 1TB options",
      battery: "Up to 29 hours video playback",
      os: "iOS 17",
      dimensions: "146.6 x 70.6 x 8.25 mm",
      weight: "187 grams",
    },
    imageUrl:
      "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-1inch-naturaltitanium?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1692845702708",
    additionalImages: [
      "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-model-unselect-gallery-1-202309?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1693010535559",
      "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-model-unselect-gallery-2-202309?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1693010535577",
      "https://th.bing.com/th/id/OIP.AFDkN6cmxatww4GelHhJmQHaE7?rs=1&pid=ImgDetMain",
    ],
  },
  {
    id: "2",
    name: "MacBook Pro 16-inch",
    price: 2499.99,
    rating: 4.9,
    reviewCount: 876,
    description:
      "The most powerful MacBook Pro ever is here. With the blazing-fast M3 Pro or M3 Max chip — the first chips built on 3-nanometer technology — you get unprecedented performance and amazing battery life.",
    features: [
      "Apple M3 Pro or M3 Max chip for extraordinary performance",
      "Up to 36-core GPU for graphics-intensive tasks",
      "Stunning 16-inch Liquid Retina XDR display",
      "Up to 64GB unified memory for seamless multitasking",
      "Up to 22 hours of battery life - the longest in a Mac ever",
    ],
    specifications: {
      display: "16.2-inch Liquid Retina XDR display (3456 x 2234)",
      processor: "Apple M3 Pro or M3 Max chip",
      memory: "Up to 64GB unified memory",
      storage: "Up to 8TB SSD storage",
      battery: "Up to 22 hours of battery life",
      ports: "3 Thunderbolt 4 ports, HDMI port, SDXC card slot, MagSafe 3 port",
      dimensions: "14.01 x 9.77 x 0.66 inches",
      weight: "4.8 pounds (2.2 kg)",
    },
    imageUrl:
      "https://www.startech.com.bd/image/cache/catalog/laptop/apple/macbook-pro-16-inch-m3-pro-black/macbook-pro-16-inch-m3-pro-black-01-500x500.webp",
    additionalImages: [
      "https://www.startech.com.bd/image/cache/catalog/laptop/apple/macbook-pro-16-inch-m3-pro-black/macbook-pro-16-inch-m3-pro-black-01-500x500.webp",
      "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp-spacegray-ports-202310?wid=4000&hei=3000&fmt=jpeg&qlt=90&.v=1697311053615",
      "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp-spacegray-profile-202310?wid=4000&hei=3000&fmt=jpeg&qlt=90&.v=1697311053615",
    ],
  },
  {
    id: "3",
    name: "Sony WH-1000XM5 Headphones",
    price: 399.99,
    rating: 4.7,
    reviewCount: 1532,
    description:
      "Industry-leading noise cancellation and superior sound quality in a refined, comfortable design. The WH-1000XM5 headphones redefine premium listening.",
    features: [
      "Industry-leading noise cancellation with eight microphones and Auto NC Optimizer",
      "Exceptional sound quality with newly developed 30mm driver unit",
      "Crystal clear hands-free calling with four beamforming microphones",
      "Up to 30 hours of battery life with quick charging (3 hours on 3 min charge)",
      "Multipoint connection allows pairing with two Bluetooth devices simultaneously",
    ],
    specifications: {
      driver: "30mm, dome type (CCAW Voice coil)",
      frequency: "4Hz-40,000Hz",
      battery: "Up to 30 hours with NC on",
      charging: "USB-C, 3.5 hours full charge time",
      weight: "250g",
      bluetooth: "Bluetooth 5.2",
      noiseCancellation: "Advanced Active Noise Cancellation",
      colors: "Black, Silver, Midnight Blue",
    },
    imageUrl:
      "https://th.bing.com/th/id/OIP.t7WKKGkECU8MqTghTItjBAHaHa?rs=1&pid=ImgDetMain",
    additionalImages: [
      "https://th.bing.com/th/id/OIP.t7WKKGkECU8MqTghTItjBAHaHa?rs=1&pid=ImgDetMain",
      "https://electronics.sony.com/image/7fa0c53e6a33bd37b7e22da1f170d9e5?fmt=png-alpha&wid=720&hei=720",
      "https://electronics.sony.com/image/5c23b6aab3f7e3a5d64d88e6ce8b6544?fmt=png-alpha&wid=720&hei=720",
    ],
  },
  {
    id: "4",
    name: "Apple Watch Series 9",
    price: 399.99,
    rating: 4.6,
    reviewCount: 932,
    description:
      "The most powerful Apple Watch yet with the new S9 chip, a brighter display, and a carbon neutral option with the new Sport Loop band.",
    features: [
      "S9 chip delivers a more magical experience with a new double tap gesture",
      "The brightest Apple Watch display ever (2000 nits)",
      "Fast charging - 80% in about 30 minutes",
      "Advanced health sensors for ECG, blood oxygen, and temperature sensing",
      "Crash Detection and Fall Detection for added safety",
    ],
    specifications: {
      display: "Always-On Retina LTPO OLED display, up to 2000 nits",
      chip: "S9 SiP with 64-bit dual-core processor",
      storage: "64GB",
      battery: "Up to 18 hours of normal use, up to 36 hours in Low Power Mode",
      water: "Water resistant 50 meters",
      connectivity: "LTE and UMTS, Wi-Fi, Bluetooth 5.3",
      sensors: "Temperature, blood oxygen, electrical heart, optical heart",
      sizes: "41mm or 45mm case size",
    },
    imageUrl:
      "https://th.bing.com/th/id/OIP.RAPjGUf-0-EXnQUJ1nU3TAHaIs?rs=1&pid=ImgDetMain",
    additionalImages: [
      "https://th.bing.com/th/id/OIP.RAPjGUf-0-EXnQUJ1nU3TAHaIs?rs=1&pid=ImgDetMain",
      "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/watch-s9-unselect-gallery-2-202309?wid=2560&hei=1640&fmt=p-jpg&qlt=80&.v=1693346851387",
      "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/watch-s9-unselect-gallery-3-202309?wid=2560&hei=1640&fmt=p-jpg&qlt=80&.v=1693346851387",
    ],
  },
  {
    id: "5",
    name: "JBL Flip 6 Bluetooth Speaker",
    price: 129.99,
    rating: 4.5,
    reviewCount: 2156,
    description:
      "Bold sound for every adventure. The JBL Flip 6 delivers powerful JBL Original Pro Sound with exceptional clarity thanks to its 2-way speaker system.",
    features: [
      "Bold JBL Original Pro Sound with exceptional clarity",
      "12 hours of playtime on a single charge",
      "IP67 waterproof and dustproof design for outdoor adventures",
      "PartyBoost feature to connect multiple compatible JBL speakers",
      "Eco-friendly packaging made from recycled materials",
    ],
    specifications: {
      output: "30W RMS",
      frequency: "65Hz–20kHz",
      battery: "4800mAh, 12 hours playtime",
      charging: "USB-C, 2.5 hours charging time",
      bluetooth: "Bluetooth 5.1",
      dimensions: "178 x 68 x 72mm",
      weight: "550g",
      colors: "Black, Blue, Red, Grey, Teal, Pink",
    },
    imageUrl:
      "https://www.bhphotovideo.com/images/images1500x1500/jbl_jblflip6blkam_flip_6_waterproof_bluetooth_1693528.jpg",
    additionalImages: [
      "https://www.jbl.com/dw/image/v2/BFND_PRD/on/demandware.static/-/Sites-masterCatalog_Harman/dhttps://www.bhphotovideo.com/images/images1500x1500/jbl_jblflip6blkam_flip_6_waterproof_bluetooth_1693528.jpg",
      "https://www.jbl.com/dw/image/v2/BFND_PRD/on/demandware.static/-/Sites-masterCatalog_Harman/default/dw5d200d83/JBL_Flip6_Side_Blue_29401_x3.png?sw=535&sh=535",
      "https://www.jbl.com/dw/image/v2/BFND_PRD/on/demandware.static/-/Sites-masterCatalog_Harman/default/dw5c2a5e6a/JBL_Flip6_Lifestyle_Blue_29402_x4.png?sw=535&sh=535",
    ],
  },
  {
    id: "6",
    name: "Sony Alpha a7 IV Camera",
    price: 2499.99,
    rating: 4.8,
    reviewCount: 745,
    description:
      "A professional hybrid full-frame mirrorless camera that delivers outstanding still image quality and cinematic video in one powerful package.",
    features: [
      "33MP full-frame Exmor R CMOS sensor for exceptional detail",
      "BIONZ XR processing engine for high-speed performance",
      "4K 60p video recording with 10-bit 4:2:2 color depth",
      "759-point phase-detection autofocus system with real-time tracking",
      "5-axis in-body image stabilization for steady shots",
    ],
    specifications: {
      sensor: "33MP full-frame Exmor R CMOS sensor",
      processor: "BIONZ XR image processing engine",
      iso: "ISO 100-51,200 (expandable to 50-204,800)",
      autofocus: "759-point phase-detection AF system",
      video: "4K 60p, 10-bit 4:2:2 internal recording",
      stabilization: "5-axis in-body image stabilization",
      storage: "Dual card slots (CFexpress Type A and SD)",
      battery: "Up to 580 shots per charge (viewfinder)",
    },
    imageUrl:
      "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6486/6486182_sd.jpg",
    additionalImages: [
      "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6486/6486182_sd.jpg",
      "https://electronics.sony.com/image/5c23b6aab3f7e3a5d64d88e6ce8b6544?fmt=png-alpha&wid=720&hei=720",
      "https://electronics.sony.com/image/a1e88d91060ba9a20cca639d14e5a272?fmt=png-alpha&wid=720&hei=720",
    ],
  },
  {
    id: "7",
    name: "Samsung Galaxy S24 Ultra",
    price: 1299.99,
    rating: 4.7,
    reviewCount: 1023,
    description:
      "The ultimate Galaxy experience with Galaxy AI, a built-in S Pen, and the most powerful camera system in a Galaxy smartphone.",
    features: [
      "Snapdragon 8 Gen 3 processor for Galaxy - the fastest chip in a Galaxy",
      "200MP main camera with advanced nightography capabilities",
      "Built-in S Pen for note-taking, drawing, and remote control",
      "Galaxy AI features including Live Translate, Note Assist, and Photo Assist",
      "7 years of OS upgrades and security updates",
    ],
    specifications: {
      display: "6.8-inch Dynamic AMOLED 2X, 120Hz, 3120 x 1440 pixels",
      processor: "Snapdragon 8 Gen 3 for Galaxy",
      camera:
        "200MP main, 12MP ultrawide, 50MP telephoto (5x), 10MP telephoto (3x)",
      memory: "12GB RAM",
      storage: "256GB, 512GB, 1TB options",
      battery: "5,000mAh with 45W fast charging",
      os: "Android 14 with One UI 6.1",
      dimensions: "162.3 x 79.0 x 8.6mm, 232g",
    },
    imageUrl:
      "https://www.celletronic.com/wp-content/uploads/2024/01/Samsung-Galaxy-S24-ULTRA-BLACK.jpg",
    additionalImages: [
      "https://www.celletronic.com/wp-content/uploads/2024/01/Samsung-Galaxy-S24-ULTRA-BLACK.jpg",
      "https://image-us.samsung.com/us/smartphones/galaxy-s24-ultra/v1/images/galaxy-s24-ultra-highlights-camera-mo.jpg",
      "https://image-us.samsung.com/us/smartphones/galaxy-s24-ultra/v1/images/galaxy-s24-ultra-highlights-design-mo.jpg",
    ],
  },
  {
    id: "8",
    name: "iPad Pro M2",
    price: 1099.99,
    rating: 4.8,
    reviewCount: 876,
    description:
      "The ultimate iPad experience with the blazing-fast M2 chip, an immersive 12.9-inch Liquid Retina XDR display, and pro-level cameras.",
    features: [
      "M2 chip with 8-core CPU and 10-core GPU for desktop-class performance",
      "12.9-inch Liquid Retina XDR display with ProMotion and P3 wide color",
      "Pro camera system with 12MP Wide and 10MP Ultra Wide cameras",
      "LiDAR Scanner for immersive AR experiences",
      "Thunderbolt / USB 4 port for high-speed connectivity",
    ],
    specifications: {
      display: "12.9-inch Liquid Retina XDR display",
      chip: "Apple M2 chip with 8-core CPU, 10-core GPU",
      storage: "128GB, 256GB, 512GB, 1TB, 2TB",
      camera: "12MP Wide camera, 10MP Ultra Wide camera, LiDAR Scanner",
      frontCamera: "12MP Ultra Wide front camera with Center Stage",
      audio: "Four speaker audio, five studio-quality microphones",
      connectivity: "Wi-Fi 6E, Bluetooth 5.3, optional 5G cellular",
      dimensions: "280.6 x 214.9 x 6.4mm, 682g (Wi-Fi)",
    },
    imageUrl:
      "https://media.cnn.com/api/v1/images/stellar/prod/221028130910-ipad-pro-m2-review-cnnu-2.jpg?c=16x9",
    additionalImages: [
      "https://media.cnn.com/api/v1/images/stellar/prod/221028130910-ipad-pro-m2-review-cnnu-2.jpg?c=16x9",
      "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-pro-model-select-gallery-3-202210?wid=5120&hei=2880&fmt=p-jpg&qlt=95&.v=1664411207191",
      "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-pro-model-select-gallery-4-202210?wid=5120&hei=2880&fmt=p-jpg&qlt=95&.v=1664411207193",
    ],
  },
  {
    id: "9",
    name: "Bose QuietComfort Ultra Earbuds",
    price: 299.99,
    rating: 4.6,
    reviewCount: 1245,
    description:
      "Immersive sound, world-class noise cancellation, and all-day comfort in a compact, wireless earbud design.",
    features: [
      "CustomTune technology automatically personalizes audio to your ears",
      "Immersive Audio with head tracking for a spatial audio experience",
      "World-class noise cancellation with Aware Mode for situational awareness",
      "Up to 6 hours of battery life, 24 hours total with charging case",
      "IPX4 water resistance for protection against sweat and light rain",
    ],
    specifications: {
      audio: "CustomTune sound calibration, Immersive Audio",
      noiseCancellation: "Adjustable noise cancellation with Aware Mode",
      battery: "6 hours (earbuds), 18 hours additional (case)",
      charging: "USB-C and wireless Qi charging",
      connectivity: "Bluetooth 5.3 with multipoint connection",
      waterResistance: "IPX4 rated",
      dimensions: "Earbuds: 17 x 30.5 x 22.4 mm, Case: 59.4 x 66.3 x 26.4 mm",
      weight: "Earbuds: 6.24g each, Case: 59.8g",
    },
    imageUrl:
      "https://www.bhphotovideo.com/images/images1500x1500/bose_882826_0010_quietcomfort_ultra_earbuds_black_1785027.jpg",
    additionalImages: [
      "https://www.bhphotovideo.com/images/images1500x1500/bose_882826_0010_quietcomfort_ultra_earbuds_black_1785027.jpg",
      "https://assets.bose.com/content/dam/cloudassets/Bose_DAM/Web/consumer_electronics/global/products/headphones/qc_ultra_earbuds/product_silo_images/QC_Ultra_Earbuds_BLK_Case_Closed.png/jcr:content/renditions/cq5dam.web.1280.1280.png",
      "https://assets.bose.com/content/dam/cloudassets/Bose_DAM/Web/consumer_electronics/global/products/headphones/qc_ultra_earbuds/product_silo_images/QC_Ultra_Earbuds_BLK_Case_Open.png/jcr:content/renditions/cq5dam.web.1280.1280.png",
    ],
  },
  {
    id: "10",
    name: "DJI Air 3 Drone",
    price: 1099.99,
    rating: 4.7,
    reviewCount: 532,
    description:
      "Capture stunning aerial photos and videos with this powerful, portable drone featuring dual cameras and intelligent flight modes.",
    features: [
      "Dual camera system with 1/1.3-inch CMOS sensors",
      "Up to 4K/60fps video and 48MP photos",
      "46 minutes of maximum flight time",
      "O4 video transmission with 20km range",
      "Advanced obstacle sensing in all directions",
    ],
    specifications: {
      camera: "Wide-angle: 24mm f/1.7, Medium tele: 70mm f/2.8",
      sensor: "1/1.3-inch CMOS",
      video: "4K/60fps, 1080p/120fps",
      photo: "48MP JPEG/DNG (RAW)",
      flightTime: "Up to 46 minutes",
      transmission: "O4 video transmission, 20km range",
      weight: "720g",
      dimensions: "Folded: 207 × 100 × 91 mm, Unfolded: 258 × 326 × 105 mm",
    },
    imageUrl:
      "https://www.gizmochina.com/wp-content/uploads/2023/07/DJI-Air-3-1-1920x1080.jpeg",
    additionalImages: [
      "https://www.gizmochina.com/wp-content/uploads/2023/07/DJI-Air-3-1-1920x1080.jpeg",
      "https://dji-official-fe.djicdn.com/dps/2a6f8c9a9b8a5a9a1a3a0a1a5a8a2a6.jpg",
      "https://dji-official-fe.djicdn.com/dps/1a2a3a4a5a6a7a8a9a0a1a2a3a4a5a6.jpg",
    ],
  },
];

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("default");

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProducts(mockProducts);
      setLoading(false);
    }, 500);
  }, []);

  const categories = [
    "all",
    "laptop",
    "mobile",
    "camera",
    "headphones",
    "speaker",
    "watch",
    "tablet",
    "drone",
  ];

  const filteredProducts = products.filter((product) => {
    if (categoryFilter === "all") return true;
    const productCategory = getProductCategory(product);
    return productCategory === categoryFilter;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOrder === "price-low-high") return a.price - b.price;
    if (sortOrder === "price-high-low") return b.price - a.price;
    return 0;
  });

  function getProductCategory(product) {
    const name = product.name.toLowerCase();
    if (name.includes("macbook") || name.includes("laptop")) return "laptop";
    if (name.includes("iphone") || name.includes("galaxy")) return "mobile";
    if (name.includes("camera")) return "camera";
    if (name.includes("headphones") || name.includes("earbuds"))
      return "headphones";
    if (name.includes("speaker")) return "speaker";
    if (name.includes("watch")) return "watch";
    if (name.includes("ipad")) return "tablet";
    if (name.includes("drone")) return "drone";
    return "other";
  }

  if (loading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5">
        <div className="p-5 mb-4 bg-light rounded-3">
          <div className="container-fluid py-5">
            <h1 className="display-5 fw-bold">Shop the Latest Tech</h1>
            <p className="col-md-8 fs-4">
              Discover premium products with free shipping and easy returns.
            </p>
            <button className="btn btn-primary btn-lg" type="button">
              Shop Now
            </button>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="row">
          <div className="col-md-6">
            <select
              className="form-select"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <select
              className="form-select"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="default">Default Sorting</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      <h2 className="mb-4">Featured Products</h2>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {sortedProducts.map((product) => (
          <div className="col" key={product.id}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
