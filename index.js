// // const express = require("express");
// // const app = express();

// // app.get("/", (req, res) => {
// //   res.send("Hello from Vercel Backend!");
// // });

// // const PORT = process.env.PORT || 3000;
// // app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// require('dotenv').config()
// const express = require('express');
// const Shopify = require('shopify-api-node');
// const app = express();
// const PORT = process.env.PORT || 3000;


// const shopify = new Shopify({
//   shopName: process.env.SHOPIFY_SHOP_NAME,
//   apiKey: process.env.SHOPIFY_API_KEY,
//   password: process.env.SHOPIFY_ACCESS_TOKEN,
//   apiVersion: '2023-01',
// });


// app.get("/", (req, res) => {
//   res.send("Hello from Vercel Backend!");
// });

// app.get('/products', async (req, res) => {
//   try {
//     const products = await shopify.product.list({ limit: 10 });
//     res.json(products);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Backend server running on http://localhost:${PORT}`);
// });

require('dotenv').config();
const express = require('express');
const cors = require('cors');  // Import the cors middleware
const Shopify = require('shopify-api-node');
const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all origins (or you can specify a specific one like 'http://localhost:8100')
app.use(cors());  // This will allow all origins by default

const shopify = new Shopify({
  shopName: process.env.SHOPIFY_SHOP_NAME,
  apiKey: process.env.SHOPIFY_API_KEY,
  password: process.env.SHOPIFY_ACCESS_TOKEN,
  apiVersion: '2023-01',
});

app.get("/", (req, res) => {
  res.send("Hello from Vercel Backend!");
});

app.get('/products', async (req, res) => {
  try {
    const products = await shopify.product.list({ limit: 10 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
