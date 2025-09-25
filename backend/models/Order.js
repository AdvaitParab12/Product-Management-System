import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  customerName: { type: String, required: true, minlength: 3, maxlength: 30 },
  email: { type: String, required: true },
  contactNumber: { type: String, required: true, match: /^[0-9]{10}$/ },
  shippingAddress: { type: String, required: true, maxlength: 100 },
  productName: { type: String, required: true, minlength: 3, maxlength: 50 },
  quantity: { type: Number, required: true, min: 1, max: 100 },
  productImage: { type: String }, // store image path
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Order", orderSchema);
