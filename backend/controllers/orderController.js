import Order from "../models/Order.js";


export const createOrder = async (req, res) => {
  try {
    const { customerName, email, contactNumber, shippingAddress, productName, quantity } = req.body;

    const order = new Order({
      customerName,
      email,
      contactNumber,
      shippingAddress,
      productName,
      quantity,
      productImage: req.file?.path || null,
    });

    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


export const getOrders = async (req, res) => {
  const orders = await Order.find({});
  res.json(orders);
};


export const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) res.json(order);
  else res.status(404).json({ message: "Order not found" });
};

export const updateOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  order.quantity = req.body.quantity || order.quantity;
  const updatedOrder = await order.save();
  res.json(updatedOrder);
};


export const deleteOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  await order.deleteOne();
  res.json({ message: "Order removed" });
};
