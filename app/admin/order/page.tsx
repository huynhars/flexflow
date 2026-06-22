"use client";
import { useState, useEffect } from "react";
import axios from "axios";

type OrderItem = {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

type Order = {
  _id: string;
  userName: string;
  items: OrderItem[];
  totalPrice: number;
  address: string;
  phone: string;
  note: string;
  status: string;
  createdAt: string;
};

const API = "http://localhost:5000/api/orders";

export default function OrderPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Order | null>(null);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const res = await axios.get(API);
    setOrders(res.data);
    setLoading(false);
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    await axios.put(`${API}/${id}`, { status });
    fetchOrders();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Xoá đơn hàng này?")) return;
    await axios.delete(`${API}/${id}`);
    fetchOrders();
  };

  const filtered = orders.filter(o => filter === "all" || o.status === filter);

  const total = orders.length;
  const pending = orders.filter(o => o.status === "pending").length;
  const paid = orders.filter(o => o.status === "paid").length;
  const totalRevenue = orders
    .filter(o => o.status === "paid")
    .reduce((sum, o) => sum + o.totalPrice, 0);

  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-bold text-white">Order Management</h1>

      {/* STATS */}
      <div className="grid grid-cols-4 gap-4">
        <div className="glass p-4 rounded-xl">
          <p className="text-gray-400 text-sm">Total Orders</p>
          <p className="text-2xl font-bold text-white mt-1">{total}</p>
        </div>
        <div className="glass p-4 rounded-xl">
          <p className="text-gray-400 text-sm">Pending</p>
          <p className="text-2xl font-bold text-yellow-400 mt-1">{pending}</p>
        </div>
        <div className="glass p-4 rounded-xl">
          <p className="text-gray-400 text-sm">Paid</p>
          <p className="text-2xl font-bold text-green-400 mt-1">{paid}</p>
        </div>
        <div className="glass p-4 rounded-xl">
          <p className="text-gray-400 text-sm">Revenue</p>
          <p className="text-2xl font-bold text-yellow-400 mt-1">
            {totalRevenue.toLocaleString("vi-VN")}đ
          </p>
        </div>
      </div>

      {/* FILTER */}
      <div className="flex gap-3">
        {["all", "pending", "paid", "delivered", "cancelled"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1 rounded-full text-sm capitalize ${filter === f ? "bg-yellow-400 text-black" : "bg-black/40 text-gray-300"}`}>
            {f}
          </button>
        ))}
      </div>

      {/* TABLE */}
      <div className="glass rounded-2xl overflow-x-auto">
        {loading ? (
          <p className="text-center text-gray-400 py-10 animate-pulse">Loading...</p>
        ) : (
          <table className="w-full">
            <thead className="bg-black/50 text-gray-300 text-sm">
              <tr>
                <th className="p-3 text-left">Customer</th>
                <th className="p-3 text-left">Items</th>
                <th className="p-3 text-left">Total</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-left">Address</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(o => (
                <tr key={o._id} className="border-t border-white/10 hover:bg-white/5">
                  <td className="p-3 text-white font-medium">{o.userName}</td>

                  {/* Items preview */}
                  <td className="p-3">
                    <button
                      onClick={() => setSelected(selected?._id === o._id ? null : o)}
                      className="text-yellow-400 text-xs hover:underline"
                    >
                      {o.items.length} sản phẩm ▼
                    </button>
                    {selected?._id === o._id && (
                      <div className="mt-2 space-y-1">
                        {o.items.map((item, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <img src={item.image} className="w-8 h-8 object-cover rounded" />
                            <span className="text-gray-300 text-xs">{item.name} x{item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </td>

                  <td className="p-3 text-green-400 font-semibold">
                    {o.totalPrice.toLocaleString("vi-VN")}đ
                  </td>
                  <td className="p-3 text-gray-400 text-sm">{o.phone}</td>
                  <td className="p-3 text-gray-400 text-sm max-w-[150px] truncate">{o.address}</td>
                  <td className="p-3 text-gray-400 text-xs">
                    {new Date(o.createdAt).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="p-3">
                    <select
                      value={o.status}
                      onChange={e => handleUpdateStatus(o._id, e.target.value)}
                      className={`text-xs px-2 py-1 rounded-full border-0 cursor-pointer ${
                        o.status === "paid" ? "bg-green-500/20 text-green-400" :
                        o.status === "delivered" ? "bg-blue-500/20 text-blue-400" :
                        o.status === "cancelled" ? "bg-red-500/20 text-red-400" :
                        "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="p-3">
                    <button onClick={() => handleDelete(o._id)}
                      className="text-red-400 text-sm hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && filtered.length === 0 && (
          <p className="text-center text-gray-500 py-10">Không có đơn hàng nào</p>
        )}
      </div>
    </div>
  );
}