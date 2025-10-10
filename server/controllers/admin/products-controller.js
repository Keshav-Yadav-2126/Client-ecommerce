//products-controller.js - Updated for new schema fields
import { handleUploadImage } from "../../helpers/cloudinary.js";
import ProductModel from "../../models/Product-schema.js";

// upload image
export const handleImageUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const url = `data:${req.file.mimetype};base64,${b64}`;
    const result = await handleUploadImage(url);

    if (!result) {
      return res.status(500).json({ success: false, message: "Upload failed" });
    }

    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      imageUrl: result.secure_url,
    });
  } catch (error) {
    console.log("Error uploading image:", error);
    res.status(500).json({ success: false, message: "Image upload failed" });
  }
};

// add new product
export const addProduct = async (req, res) => {
  try {
    const { 
      image, 
      title, 
      description, 
      category, 
      price, 
      salePrice, 
      stock, 
      size,
      ingredients,
      keyBenefits
    } = req.body;

    const newlyCreatedProduct = await ProductModel.create({
      image,
      title,
      description,
      category,
      price,
      salePrice,
      stock,
      size,
      ingredients: ingredients || [],
      keyBenefits: keyBenefits || [],
    });

    res.status(200).json({
      success: true,
      message: "Product Added Successfully",
      data: newlyCreatedProduct,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error occurred" });
  }
};

// fetch all products
export const fetchAllProducts = async (req, res) => {
  try {
    const listOfProducts = await ProductModel.find({});
    res.status(200).json({ success: true, data: listOfProducts });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error occurred" });
  }
};

// fetch single product by ID
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await ProductModel.findById(id);
    
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error occurred" });
  }
};

// edit a product
export const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      image, 
      title, 
      description, 
      category, 
      price, 
      salePrice, 
      stock, 
      size,
      ingredients,
      keyBenefits
    } = req.body;

    let findProduct = await ProductModel.findById(id);

    if (!findProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Update fields properly
    findProduct.title = title || findProduct.title;
    findProduct.description = description || findProduct.description;
    findProduct.category = category || findProduct.category;
    findProduct.price = price === "" ? 0 : price || findProduct.price;
    findProduct.salePrice = salePrice === "" ? 0 : salePrice || findProduct.salePrice;
    findProduct.stock = stock || findProduct.stock;
    findProduct.size = size || findProduct.size;
    findProduct.image = image || findProduct.image;
    findProduct.ingredients = ingredients || findProduct.ingredients;
    findProduct.keyBenefits = keyBenefits || findProduct.keyBenefits;

    await findProduct.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: findProduct,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error occurred" });
  }
};

// delete a product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await ProductModel.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error occurred" });
  }
};