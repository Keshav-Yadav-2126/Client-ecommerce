import Cart from "../../models/Cart-schema.js";
import Product from "../../models/Product-schema.js";
import mongoose from "mongoose";

const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    console.log(
      "userId:",
      userId,
      "productId:",
      productId,
      "quantity:",
      quantity
    );

    if (!userId || !productId || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const findCurrentProductIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (findCurrentProductIndex === -1) {
      cart.items.push({ productId, quantity });
    } else {
      cart.items[findCurrentProductIndex].quantity += quantity;
    }
    await cart.save();
    res.status(200).json({
      success: true,
      data: cart,
      message: "Product added to cart successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: "Some error occured",
    });
  }
};

const fetchCartItems = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Invalid userId",
      });
    }

    let cart = await Cart.findOne({
      userId: new mongoose.Types.ObjectId(userId),
    }).populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    if (!cart) {
      return res.status(200).json({
        success: true,
        data: { items: [] },
        message: "Cart empty for this user",
      });
    }

    const validItems = cart.items.filter((item) => item.productId); // filter out items with productId
    if (validItems.length < cart.items.length) {
      cart.items = validItems;
      await cart.save();
    }

    const populateCartItems = validItems.map((item) => ({
      product: item.productId._id,
      image: item.productId.image,
      title: item.productId.title,
      price: item.productId.price,
      salePrice: item.productId.salePrice,
      quantity: item.quantity,
    }));

    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populateCartItems,
      },
      message: "Fetched cart items successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: "Some error occured",
    });
  }
};
const updateCartItemQty = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    console.log(
      "userId:",
      userId,
      "productId:",
      productId,
      "quantity:",
      quantity
    );

    if (!userId || !productId || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided",
      });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found!",
      });
    }

    const findCurrentProductIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (findCurrentProductIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Cart item not present !",
      });
    }

    cart.items[findCurrentProductIndex].quantity = quantity;
    await cart.save();

    await cart.populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    const populateCartItems = cart.items.map((item) => ({
      product: item.productId ? item.productId._id : null,
      image: item.productId ? item.productId.image : null,
      title: item.productId ? item.productId.title : "Product not found",
      price: item.productId ? item.productId.price : null,
      salePrice: item.productId ? item.productId.salePrice : null,
      quantity: item.quantity ? item.quantity : null,
    }));

    console.log("populateCartItems:", populateCartItems);

    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populateCartItems,
      },
      message: "Updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: "Some error occured",
    });
  }
};
const deleteCartItem = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    console.log("userId:", userId, "productId:", productId);
    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }

    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found!",
      });
    }

    cart.items = cart.items.filter(
      (item) => item.productId._id.toString() !== productId
    );

    await cart.save();

    await cart.populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    const populateCartItems = cart.items.map((item) => ({
      productId: item.productId ? item.productId._id : null,
      image: item.productId ? item.productId.image : null,
      title: item.productId ? item.productId.title : "Product not found",
      price: item.productId ? item.productId.price : null,
      salePrice: item.productId ? item.productId.salePrice : null,
      quantity: item.quantity,
    }));

    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populateCartItems,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: "Some error occured",
    });
  }
};

export { addToCart, fetchCartItems, updateCartItemQty, deleteCartItem };
