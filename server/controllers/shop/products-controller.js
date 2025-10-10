// products-controller.js
import ProductModel from "../../models/Product-schema.js";

// Get all products with filters and sorting
const getFilteredProducts = async (req, res) => {
  try {
    let { category, brand, sortBy = "price-lowtohigh" } = req.query;

    // Normalize input (so works with both string and array)
    const categoryArr = Array.isArray(category)
      ? category
      : category
      ? category.split(",").filter(Boolean)
      : [];

    const brandArr = Array.isArray(brand)
      ? brand
      : brand
      ? brand.split(",").filter(Boolean)
      : [];

    let filters = {};

    if (categoryArr.length > 0) {
      filters.category = { $in: categoryArr };
    }

    if (brandArr.length > 0) {
      filters.brand = { $in: brandArr };
    }

    let sort = {};
    switch (sortBy) {
      case "price-lowtohigh":
        sort.price = 1;
        break;
      case "price-hightolow":
        sort.price = -1;
        break;
      case "title-atoz":
        sort.title = 1;
        break;
      case "title-ztoa":
        sort.title = -1;
        break;
      default:
        sort.price = 1;
        break;
    }

    const products = await ProductModel.find(filters).sort(sort);
    return res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error("Error in getFilteredProducts:", error);
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};



const getProductDetails = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID format",
      });
    }

    const product = await ProductModel.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.log("Error in getProductDetails:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message || "Some error occurred",
    });
  }
};

// Search products by title or description
const searchProducts = async (req, res) => {
  try {
    const { searchTerm } = req.params;

    if (!searchTerm || searchTerm.trim() === '') {
      return res.status(400).json({
        success: false,
        message: "Search term is required",
      });
    }

    // Case-insensitive search in title and description
    const products = await ProductModel.find({
      $or: [
        { title: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } },
        { category: { $regex: searchTerm, $options: 'i' } },
        { brand: { $regex: searchTerm, $options: 'i' } },
      ]
    }).sort({ title: 1 });

    res.status(200).json({
      success: true,
      data: products,
      count: products.length
    });
  } catch (error) {
    console.log("Error in searchProducts:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message || "Some error occurred",
    });
  }
};

// Get products by specific category
const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const products = await ProductModel.find({ category }).sort({ price: 1 });

    res.status(200).json({
      success: true,
      data: products,
      count: products.length
    });
  } catch (error) {
    console.log("Error in getProductsByCategory:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message || "Some error occurred",
    });
  }
};

// Get products by specific brand
const getProductsByBrand = async (req, res) => {
  try {
    const { brand } = req.params;

    const products = await ProductModel.find({ brand }).sort({ price: 1 });

    res.status(200).json({
      success: true,
      data: products,
      count: products.length
    });
  } catch (error) {
    console.log("Error in getProductsByBrand:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message || "Some error occurred",
    });
  }
};

// Get featured products (for home page)
const getFeaturedProducts = async (req, res) => {
  try {
    const { limit = 8 } = req.query;

    // If you have a featured field in schema, use it
    // Otherwise, just get recent products or products on sale
    const products = await ProductModel.find({
      $or: [
        { featured: true },
        { salePrice: { $gt: 0 } }
      ]
    })
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

    // If no featured products, get latest products
    if (products.length === 0) {
      const latestProducts = await ProductModel.find()
        .limit(parseInt(limit))
        .sort({ createdAt: -1 });
      
      return res.status(200).json({
        success: true,
        data: latestProducts,
        count: latestProducts.length
      });
    }

    res.status(200).json({
      success: true,
      data: products,
      count: products.length
    });
  } catch (error) {
    console.log("Error in getFeaturedProducts:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message || "Some error occurred",
    });
  }
};

export { 
  getFilteredProducts, 
  getProductDetails,
  searchProducts,
  getProductsByCategory,
  getProductsByBrand,
  getFeaturedProducts
};