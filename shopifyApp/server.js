require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Shopify = require('shopify-api-node');

const app = express();

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON body

// Shopify Setup
const shopify = new Shopify({
  shopName: process.env.SHOPIFY_SHOP_NAME,
  apiKey: process.env.SHOPIFY_API_KEY,
  password: process.env.SHOPIFY_ACCESS_TOKEN,
  apiVersion: '2025-01',
});

// Routes
app.get('/', (req, res) => {
  res.send('Hello from Vercel Backend!');
});

app.get('/products', async (req, res) => {
  try {
    const products = await shopify.product.list({ limit: 10 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/all-products', async (req, res) => {
  let allProducts = [];
  let params = { limit: 250 };
  try {
    do {
      const products = await shopify.product.list(params);
      allProducts = allProducts.concat(products);
      params = products.nextPageParameters;
    } while (params !== undefined);

    res.json(allProducts);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching all products' });
  }
});

app.post('/products', async (req, res) => {
  try {
    const productData = req.body;
    if (!productData.title || !productData.body_html || !productData.variants) {
      return res.status(400).json({ error: 'Missing required product fields' });
    }
    const createdProduct = await shopify.product.create(productData);
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/products/:id', async (req, res) => {
  const productId = req.params.id;
  try {
    const updatedProduct = await shopify.product.update(productId, req.body);
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/all-collections', async (req, res) => {
  let allCollections = [];
  let hasNextPage = true;
  let cursor = null;

  try {
    while (hasNextPage) {
      const query = `
        query getCollections($cursor: String) {
          collections(first: 100, after: $cursor) {
            pageInfo {
              hasNextPage
              endCursor
            }
            edges {
              node {
                id
                title
                handle
                updatedAt
                products(first: 250) {
                  edges {
                    node {
                      id
                      title
                      handle
                      createdAt
                      status
                      images(first: 1) {
                        edges {
                          node {
                            url
                          }
                        }
                      }
                      priceRange {
                        minVariantPrice { amount }
                        maxVariantPrice { amount }
                      }
                      variants(first: 1) {
                        edges {
                          node {
                            compareAtPrice
                          }
                        }
                      }
                      metafield(namespace: "custom", key: "rewardsNote") {
                        value
                      }
                    }
                  }
                }
              }
            }
          }
        }
      `;

      const variables = { cursor };
      const response = await shopify.graphql(query, variables);

      if (response.errors) {
        return res.status(500).json({ error: 'GraphQL query error', details: response.errors });
      }

      const collections = response.collections.edges.map(edge => {
        const node = edge.node;

        node.products = node.products.edges.map(p => {
          const product = p.node;
          product.image = product.images?.edges?.[0]?.node?.url || null;
          product.salePrice = product.priceRange?.minVariantPrice?.amount || null;
          product.comparePrice = product.variants?.edges?.[0]?.node?.compareAtPrice || null;
          product.rewardsNote = product.metafield?.value || null;
          return product;
        });

        return node.products.length > 0 ? node : null;
      }).filter(Boolean);

      allCollections = allCollections.concat(collections);
      hasNextPage = response.collections.pageInfo.hasNextPage;
      cursor = response.collections.pageInfo.endCursor;
    }

    res.json(allCollections);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching collections via GraphQL', details: error.message });
  }
});

module.exports = app;
