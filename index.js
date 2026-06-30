const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

/* ==========================================================
   AUTH
========================================================== */

const AUTH_TOKEN = "ndakdknsdkndkas";

app.use("/api", (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "Authorization header missing"
    });
  }

  const token = authHeader.replace("Bearer ", "");

  if (token !== AUTH_TOKEN) {
    return res.status(401).json({
      success: false,
      message: "Invalid authentication token"
    });
  }

  next();
});

/* ==========================================================
   DATA
========================================================== */

const user = {
  id: "test-user",
  name: "Test User",
  spinsLeft: 3,
  coupons: []
};

const megaDeals = [
  {
    id: 1,
    brand: "Amazon",
    title: "₹1000 Amazon Gift Card"
  },
  {
    id: 2,
    brand: "Starbucks",
    title: "Free Grande Coffee"
  },
  {
    id: 3,
    brand: "Domino's",
    title: "Buy 1 Get 1 Pizza"
  },
  {
    id: 4,
    brand: "Myntra",
    title: "Flat ₹500 OFF"
  },
  {
    id: 5,
    brand: "Flipkart",
    title: "₹750 Shopping Voucher"
  }
];

const coupons = [
  {
    id: 101,
    brand: "Zomato",
    title: "20% OFF on Food Orders",
    category: "Food",
    usesToday: 245
  },
  {
    id: 102,
    brand: "Swiggy",
    title: "Free Delivery",
    category: "Food",
    usesToday: 184
  },
  {
    id: 103,
    brand: "Uber",
    title: "₹200 OFF Ride",
    category: "Travel",
    usesToday: 96
  },
  {
    id: 104,
    brand: "Rapido",
    title: "₹100 OFF Ride",
    category: "Travel",
    usesToday: 141
  },
  {
    id: 105,
    brand: "Myntra",
    title: "30% OFF Fashion",
    category: "Shopping",
    usesToday: 112
  },
  {
    id: 106,
    brand: "Flipkart",
    title: "Flat ₹500 OFF",
    category: "Shopping",
    usesToday: 158
  },
  {
    id: 107,
    brand: "Nykaa",
    title: "40% OFF Cosmetics",
    category: "Beauty",
    usesToday: 78
  },
  {
    id: 108,
    brand: "BookMyShow",
    title: "Flat ₹250 OFF Movie Tickets",
    category: "Entertainment",
    usesToday: 67
  }
];

/* ==========================================================
   GET USER
========================================================== */

app.get("/api/user", (req, res) => {
  res.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      spinsLeft: user.spinsLeft,
      coupons: user.coupons
    },
    globalStatistics: {
      totalSpins: Math.floor(Math.random() * 50000) + 5000
    }
  });
});

/* ==========================================================
   GET MEGA DEALS
========================================================== */

app.get("/api/mega-deals", (req, res) => {
  res.json({
    success: true,
    megaDeals
  });
});

/* ==========================================================
   SPIN
========================================================== */

app.post("/api/mega-deals/spin", (req, res) => {

  if (user.spinsLeft <= 0) {
    return res.status(400).json({
      success: false,
      message: "No spins left."
    });
  }

  user.spinsLeft--;

  const wonDeal = megaDeals[Math.floor(Math.random() * megaDeals.length)];

  user.coupons.push({
    ...wonDeal,
    wonAt: new Date().toISOString()
  });

  res.json({
    success: true,
    message: "Congratulations! You won a Mega Deal.",
    spinsLeft: user.spinsLeft,
    wonDeal
  });
});

/* ==========================================================
   GET NORMAL COUPONS
========================================================== */

app.get("/api/coupons", (req, res) => {

  const response = coupons.map(coupon => ({
    ...coupon,
    usesToday: coupon.usesToday + Math.floor(Math.random() * 20)
  }));

  res.json({
    success: true,
    coupons: response
  });
});

/* ==========================================================
   SERVER
========================================================== */

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
