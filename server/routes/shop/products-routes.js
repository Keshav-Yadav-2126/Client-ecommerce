import express, { Router } from 'express';
import { 
  getFilteredProducts, 
  getProductDetails,
  searchProducts,
  getProductsByCategory,
  getProductsByBrand,
  getFeaturedProducts
} from '../../controllers/shop/products-controller.js';

const shopRouter = Router();

// Get all products with filters and sorting
shopRouter.get('/get', getFilteredProducts);

// Get featured products (for home page)
shopRouter.get('/featured', getFeaturedProducts);

// Search products by term
shopRouter.get('/search/:searchTerm', searchProducts);

// Get products by category
shopRouter.get('/category/:category', getProductsByCategory);

// Get products by brand
shopRouter.get('/brand/:brand', getProductsByBrand);

// Get single product details (must be last to avoid route conflicts)
shopRouter.get('/get/:id', getProductDetails);

// // Add this to your products route file
// shopRouter.get('/categories', async (req, res) => {
//   try {
//     const categories = await ProductModel.distinct('category');
//     console.log("Available categories in database:", categories);
//     res.status(200).json({
//       success: true,
//       data: categories
//     });
//   } catch (error) {
//     console.log("Error fetching categories:", error);
//     res.status(500).json({
//       success: false,
//       message: "Error fetching categories",
//       error: error.message
//     });
//   }
// });

export default shopRouter;