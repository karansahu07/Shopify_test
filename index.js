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



//all-collections
// app.get('/all-collections', async (req, res) => {
//   let allCollections = [];
//   let params = { limit: 250 };

//   try {
//     do {
//       const collections = await shopify.customCollection.list(params);
//       params = collections.nextPageParameters;
//       allCollections = allCollections.concat(collections);
//     } while (params !== undefined);

//     // Attach products to each collection
//     for (const collection of allCollections) {
//       const collects = await shopify.collect.list({ collection_id: collection.id });
//       const productIds = collects.map(c => c.product_id);

//       // Fetch each product's details
//       const products = await Promise.all(
//         productIds.map(id => shopify.product.get(id).catch(err => null))
//       );

//       // Attach only successfully fetched products
//       collection.products = products.filter(p => p !== null);
//     }

//     res.json(allCollections);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Error fetching collections with products' });
//   }
// });

// app.get('/all-collections', async (req, res) => {
//   let allCollections = [];
//   let hasNextPage = true;
//   let cursor = null;

//   try {
//     while (hasNextPage) {
//       const query = `
//         query getCollections($cursor: String) {
//           collections(first: 100, after: $cursor) {
//             pageInfo {
//               hasNextPage
//               endCursor
//             }
//             edges {
//               node {
//                 id
//                 title
//                 handle
//                 updatedAt
//                 products(first: 250) {
//                   edges {
//                     node {
//                       id
//                       title
//                       handle
//                     }
//                   }
//                 }
//               }
//             }
//           }
//         }
//       `;

//       const variables = { cursor };
//       const response = await shopify.graphql(query, variables);

//       const collections = response.collections.edges.map(edge => {
//         const node = edge.node;
//         node.products = node.products.edges.map(p => p.node);
//         return node;
//       });

//       allCollections = allCollections.concat(collections);

//       hasNextPage = response.collections.pageInfo.hasNextPage;
//       cursor = response.collections.pageInfo.endCursor;
//     }

//     res.json(allCollections);
//   } catch (error) {
//     console.error('GraphQL error:', error);
//     res.status(500).json({ error: 'Error fetching collections with products via GraphQL' });
//   }
// });

// app.get('/all-collections', async (req, res) => {
//   let allCollections = [];
//   let hasNextPage = true;
//   let cursor = null;

//   try {
//     while (hasNextPage) {
//       const query = `
//         query getCollections($cursor: String) {
//           collections(first: 100, after: $cursor) {
//             pageInfo {
//               hasNextPage
//               endCursor
//             }
//             edges {
//               node {
//                 id
//                 title
//                 handle
//                 updatedAt
//                 products(first: 250) {
//                   edges {
//                     node {
//                       id
//                       title
//                       handle
//                       updatedAt
//                     }
//                   }
//                 }
//               }
//             }
//           }
//         }
//       `;

//       const variables = { cursor };
//       const response = await shopify.graphql(query, variables);

//       const collections = response.collections.edges.map(edge => {
//         const node = edge.node;
        
//         // Sort products by updatedAt in descending order
//         node.products.edges.sort((a, b) => {
//           return new Date(b.node.updatedAt) - new Date(a.node.updatedAt);
//         });

//         node.products = node.products.edges.map(p => p.node);
//         return node;
//       });

//       allCollections = allCollections.concat(collections);

//       hasNextPage = response.collections.pageInfo.hasNextPage;
//       cursor = response.collections.pageInfo.endCursor;
//     }

//     res.json(allCollections);
//   } catch (error) {
//     console.error('GraphQL error:', error);
//     res.status(500).json({ error: 'Error fetching collections with products via GraphQL' });
//   }
// });

//archieved
// app.get('/all-collections', async (req, res) => {
//   let allCollections = [];
//   let hasNextPage = true;
//   let cursor = null;

//   try {
//     while (hasNextPage) {
//       const query = `
//         query getCollections($cursor: String) {
//           collections(first: 100, after: $cursor) {
//             pageInfo {
//               hasNextPage
//               endCursor
//             }
//             edges {
//               node {
//                 id
//                 title
//                 handle
//                 updatedAt
//                 products(first: 250) {
//                   edges {
//                     node {
//                       id
//                       title
//                       handle
//                       createdAt
//                     }
//                   }
//                 }
//               }
//             }
//           }
//         }
//       `;

//       const variables = { cursor };
//       const response = await shopify.graphql(query, variables);

//       const collections = response.collections.edges.map(edge => {
//         const node = edge.node;
        
//         // Sort products by createdAt in descending order
//         node.products.edges.sort((a, b) => {
//           const createdAtA = new Date(a.node.createdAt);
//           const createdAtB = new Date(b.node.createdAt);
          
//           // Sorting by createdAt (descending)
//           if (createdAtA > createdAtB) return -1;
//           if (createdAtA < createdAtB) return 1;

//           return 0;
//         });

//         node.products = node.products.edges.map(p => p.node);
//         return node;
//       });

//       allCollections = allCollections.concat(collections);

//       hasNextPage = response.collections.pageInfo.hasNextPage;
//       cursor = response.collections.pageInfo.endCursor;
//     }

//     res.json(allCollections);
//   } catch (error) {
//     console.error('GraphQL error:', error);
//     res.status(500).json({ error: 'Error fetching collections with products via GraphQL' });
//   }
// });



// app.get('/all-collections', async (req, res) => {
//   let allCollections = [];
//   let hasNextPage = true;
//   let cursor = null;

//   try {
//     while (hasNextPage) {
//       const query = `
//         query getCollections($cursor: String) {
//           collections(first: 100, after: $cursor) {
//             pageInfo {
//               hasNextPage
//               endCursor
//             }
//             edges {
//               node {
//                 id
//                 title
//                 handle
//                 updatedAt
//                 products(first: 250) {
//                   edges {
//                     node {
//                       id
//                       title
//                       handle
//                       createdAt
//                       status
//                     }
//                   }
//                 }
//               }
//             }
//           }
//         }
//       `;

//       const variables = { cursor };
//       const response = await shopify.graphql(query, variables);

//       console.log('Response from Shopify:', JSON.stringify(response, null, 2)); // Log the entire response for inspection

//       if (response.errors) {
//         console.error('GraphQL errors:', response.errors);
//         return res.status(500).json({ error: 'GraphQL query error', details: response.errors });
//       }

//       const collections = response.collections.edges.map(edge => {
//         const node = edge.node;

//         // Log products before filtering and sorting
//         console.log('Products in collection before filtering:', JSON.stringify(node.products.edges, null, 2));

//         // Just return products without filtering
//         node.products = node.products.edges.map(p => p.node);

//         // Only return the collection if it has products
//         if (node.products.length > 0) {
//           return node;
//         }
//       }).filter(Boolean);  // Remove collections with no products

//       allCollections = allCollections.concat(collections);

//       hasNextPage = response.collections.pageInfo.hasNextPage;
//       cursor = response.collections.pageInfo.endCursor;
//     }

//     res.json(allCollections);
//   } catch (error) {
//     console.error('Error fetching collections:', error);
//     res.status(500).json({ error: 'Error fetching collections via GraphQL', details: error.message });
//   }
// });

require('dotenv').config();
const express = require('express');
const cors = require('cors');  // Import the cors middleware
const Shopify = require('shopify-api-node');
const app = express();
const PORT = process.env.PORT || 3000;



//---------------shopify-------------------
app.use(cors());  // This will allow all origins by default

app.use(cors({
  origin: 'http://localhost:8100', // replace with your actual frontend URL
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const shopify = new Shopify({
  shopName: process.env.SHOPIFY_SHOP_NAME,
  apiKey: process.env.SHOPIFY_API_KEY,
  password: process.env.SHOPIFY_ACCESS_TOKEN,
  apiVersion: '2025-01',
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

app.get('/all-products', async (req, res) => {
  let allProducts = [];
  let params = { limit: 250 }; // max limit
  try {
    do {
      const products = await shopify.product.list(params);
      allProducts = allProducts.concat(products);

      // Shopify uses "link" headers for pagination
      params = products.nextPageParameters; // null if no more pages
    } while (params !== undefined);

    res.json(allProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching all products' });
  }
});



app.post('/products', async (req, res) => {
  try {
    const productData = req.body;
 
    // Basic validation (optional but recommended)
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
  const updatedData = req.body;
 
  try {
    const updatedProduct = await shopify.product.update(productId, updatedData);
    res.json(updatedProduct);
  } catch (error) {
    console.error(`PUT /products/${productId} error:`, error);
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
                        minVariantPrice {
                          amount
                        }
                        maxVariantPrice {
                          amount
                        }
                      }
                      variants(first: 1) {
                        edges {
                          node {
                            compareAtPrice
                          }
                        }
                      }
                      metafield(namespace: "custom", key: "money_price") {
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
        console.error('GraphQL errors:', response.errors);
        return res.status(500).json({ error: 'GraphQL query error', details: response.errors });
      }

      const collections = response.collections.edges.map(edge => {
        const node = edge.node;

        node.products = node.products.edges.map(p => {
          const product = p.node;

          // Extract first image URL if available
          const imageEdge = product.images?.edges?.[0];
          product.image = imageEdge ? imageEdge.node.url : null;

          // Extract min and max price
          product.salePrice = product.priceRange?.minVariantPrice?.amount || null;

          // Extract compareAtPrice from first variant
          product.comparePrice = product.variants?.edges?.[0]?.node?.compareAtPrice || null;

          // Extract rewardsNote from metafield
          product.rewardsNote = product.metafield?.value || null;

          // product.moneyPrice = product.metafields?.money_price?.value || null;
          product.moneyPrice = product.metafield?.value || null;


          return product;
        });

        if (node.products.length > 0) {
          return node;
        }
      }).filter(Boolean);

      allCollections = allCollections.concat(collections);
      hasNextPage = response.collections.pageInfo.hasNextPage;
      cursor = response.collections.pageInfo.endCursor;
    }

    res.json(allCollections);
  } catch (error) {
    console.error('Error fetching collections:', error);
    res.status(500).json({ error: 'Error fetching collections via GraphQL', details: error.message });
  }
});







//---------------shopify------------------------

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});



// const serverless = require('serverless-http');
// const app = require('../shopifyApp/server');

// module.exports.handler = serverless(app);
