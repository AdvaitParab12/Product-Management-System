"use client";

import { useState } from "react";
import api from "../utils/api";

export default function OrderForm() {
  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    contactNumber: "",
    shippingAddress: "",
    productName: "",
    quantity: 1,
  });
  const [productImage, setProductImage] = useState(null);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setProductImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => data.append(key, formData[key]));
      if (productImage) data.append("productImage", productImage);

      await api.post("/orders", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage(" Order placed successfully!");
      setFormData({
        customerName: "",
        email: "",
        contactNumber: "",
        shippingAddress: "",
        productName: "",
        quantity: 1,
      });
      setProductImage(null);
    } catch (error) {
      console.error(error);
      setMessage("Failed to place order.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="w-full max-w-lg bg-white p-8 shadow-2xl rounded-2xl border border-gray-200">
        <h1 className="text-3xl font-extrabold text-center mb-6 text-gray-800">
          Place Your Order
        </h1>

        {message && (
          <p
            className={`mb-6 text-center font-medium ${
              message.includes("") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="customerName"
            placeholder="Customer Name"
            value={formData.customerName}
            onChange={handleChange}
            required
            className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
          />
          <input
            type="text"
            name="contactNumber"
            placeholder="Contact Number"
            value={formData.contactNumber}
            onChange={handleChange}
            pattern="[0-9]{10}"
            required
            className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
          />
          <textarea
            name="shippingAddress"
            placeholder="Shipping Address"
            value={formData.shippingAddress}
            onChange={handleChange}
            maxLength="100"
            required
            className="border border-gray-300 p-3 rounded-lg w-full h-24 resize-none focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
          />
          <input
            type="text"
            name="productName"
            placeholder="Product Name"
            value={formData.productName}
            onChange={handleChange}
            required
            className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
          />
          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            value={formData.quantity}
            onChange={handleChange}
            min="1"
            max="100"
            required
            className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
          />
          <input
            type="file"
            accept="image/png, image/jpeg"
            onChange={handleFileChange}
            className="border border-gray-300 p-2 rounded-lg w-full file:border-0 file:bg-blue-100 file:text-blue-700 file:p-2 file:rounded-lg cursor-pointer transition hover:file:bg-blue-200"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-lg font-semibold hover:bg-blue-600 transition"
          >
            Submit Order
          </button>
        </form>
      </div>
    </div>
  );
}
