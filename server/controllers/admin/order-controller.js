import Order from "../../models/Order.js";

export const getAllOrdersForAdmin = async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ orderDate: -1 });

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found!",
      });
    }

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (e) {
    console.log("Get all orders error:", e);
    res.status(500).json({
      success: false,
      message: "Error fetching orders",
    });
  }
};

export const getOrderDetailsForAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (e) {
    console.log("Get order details error:", e);
    res.status(500).json({
      success: false,
      message: "Error fetching order details",
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    order.orderStatus = orderStatus;
    order.orderUpdateDate = new Date();

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order status updated successfully!",
      data: order,
    });
  } catch (e) {
    console.log("Update order status error:", e);
    res.status(500).json({
      success: false,
      message: "Error updating order status",
    });
  }
};