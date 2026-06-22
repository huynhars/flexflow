"use client";
import { useState, useEffect } from "react";
import axios from "axios";

type Booking = {
  _id: string;
  userName: string;
  trainer: string;
  date: string;
  time: string;
  plan: string;
  duration: number;
  price: number;
  exercises: string[];
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
};

const API = "http://localhost:5000/api/bookings";

export default function AdminBookingPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Booking | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = async () => {
    setLoading(true);
    const res = await axios.get(API);
    setBookings(res.data);
    setLoading(false);
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    await axios.put(`${API}/${id}`, { status });
    fetchBookings();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Xoá booking này?")) return;
    await axios.delete(`${API}/${id}`);
    fetchBookings();
  };

  const filtered = bookings.filter(b => filter === "all" || b.status === filter);

  // Stats
  const total = bookings.length;
  const pending = bookings.filter(b => b.status === "pending").length;
  const confirmed = bookings.filter(b => b.status === "confirmed").length;
  const totalRevenue = bookings
    .filter(b => b.status === "confirmed")
    .reduce((sum, b) => sum + (b.price || 0), 0);

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Booking Management</h1>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-4 gap-4">
        <div className="glass p-4 rounded-xl">
          <p className="text-gray-400 text-sm">Total Bookings</p>
          <p className="text-2xl font-bold text-white mt-1">{total}</p>
        </div>
        <div className="glass p-4 rounded-xl">
          <p className="text-gray-400 text-sm">Pending</p>
          <p className="text-2xl font-bold text-yellow-400 mt-1">{pending}</p>
        </div>
        <div className="glass p-4 rounded-xl">
          <p className="text-gray-400 text-sm">Confirmed</p>
          <p className="text-2xl font-bold text-green-400 mt-1">{confirmed}</p>
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
        {["all", "pending", "confirmed", "cancelled"].map((f) => (
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
                <th className="p-3 text-left">Plan</th>
                <th className="p-3 text-left">Trainer</th>
                <th className="p-3 text-left">Date / Time</th>
                <th className="p-3 text-left">Duration</th>
                <th className="p-3 text-left">Exercises</th>
                <th className="p-3 text-left">Price</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr key={b._id} className="border-t border-white/10 hover:bg-white/5">
                  <td className="p-3 text-white font-medium">{b.userName}</td>
                  <td className="p-3 text-yellow-400 capitalize">{b.plan}</td>
                  <td className="p-3 text-gray-300">{b.trainer}</td>
                  <td className="p-3 text-gray-400 text-sm">
                    <p>{b.date}</p>
                    <p>{b.time}</p>
                  </td>
                  <td className="p-3 text-gray-400">{b.duration} months</td>
                  <td className="p-3 text-gray-400 text-sm max-w-[150px]">
                    {b.exercises?.join(", ") || "—"}
                  </td>
                  <td className="p-3 text-green-400 font-semibold">
                    {b.price?.toLocaleString("vi-VN")}đ
                  </td>
                  <td className="p-3">
                    <select
                      value={b.status}
                      onChange={(e) => handleUpdateStatus(b._id, e.target.value)}
                      className={`text-xs px-2 py-1 rounded-full border-0 cursor-pointer ${
                        b.status === "confirmed" ? "bg-green-500/20 text-green-400" :
                        b.status === "pending" ? "bg-yellow-500/20 text-yellow-400" :
                        "bg-red-500/20 text-red-400"
                      }`}>
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="p-3">
                    <button onClick={() => handleDelete(b._id)}
                      className="text-red-400 text-sm hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && filtered.length === 0 && (
          <p className="text-center text-gray-500 py-10">Không có booking nào</p>
        )}
      </div>
    </div>
  );
}