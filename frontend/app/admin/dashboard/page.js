"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import api from "../../../utils/api";
import { setOrders } from "../../../redux/orderSlice";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { orders } = useSelector((state) => state.orders);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  const [editingOrderId, setEditingOrderId] = useState(null);
  const [newQuantity, setNewQuantity] = useState(1);


  useEffect(() => {
    if (!token) {
      router.push("/admin/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        const { data } = await api.get("/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        dispatch(setOrders(data));
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [token, dispatch, router]);


  const handleUpdate = async (orderId) => {
    try {
      const { data } = await api.put(
        `/orders/${orderId}`,
        { quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch(
        setOrders(
          orders.map((o) => (o._id === orderId ? { ...o, quantity: data.quantity } : o))
        )
      );
      setEditingOrderId(null);
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };


  const handleDelete = async (orderId) => {
    if (!confirm("Are you sure you want to delete this order?")) return;

    try {
      await api.delete(`/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(setOrders(orders.filter((o) => o._id !== orderId)));
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📦 Orders Dashboard</h1>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Customer</th>
              <th className="border p-2">Product</th>
              <th className="border p-2">Quantity</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td className="border p-2">{order.customerName}</td>
                <td className="border p-2">{order.productName}</td>
                <td className="border p-2">
                  {editingOrderId === order._id ? (
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={newQuantity}
                      onChange={(e) => setNewQuantity(e.target.value)}
                      className="border p-1 w-16"
                    />
                  ) : (
                    order.quantity
                  )}
                </td>
                <td className="border p-2">
                  {new Date(order.createdAt).toLocaleString()}
                </td>
                <td className="border p-2 space-x-2">
                  {editingOrderId === order._id ? (
                    <button
                      onClick={() => handleUpdate(order._id)}
                      className="bg-green-500 text-white px-2 py-1 rounded"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingOrderId(order._id);
                        setNewQuantity(order.quantity);
                      }}
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(order._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
