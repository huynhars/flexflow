"use client";

import { useState, useEffect } from "react";
import axios from "axios";

type Member = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  duration: number;
  status: "active" | "inactive";
  createdAt: string;
};

const API = "http://localhost:5000/api/members";

export default function MembershipPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [filter, setFilter] = useState("All");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Member | null>(null);
  const [form, setForm] = useState({ phone: "", duration: 1, status: "active" });

  useEffect(() => { fetchMembers(); }, []);

  const fetchMembers = async () => {
    const res = await axios.get(API);
    setMembers(res.data);
  };

  const filteredData = filter === "All"
    ? members
    : members.filter((m) => m.duration.toString() === filter);

  const handleEdit = (m: Member) => {
    setEditing(m);
    setForm({ phone: m.phone, duration: m.duration, status: m.status });
    setOpen(true);
  };

  const handleSubmit = async () => {
    if (!editing) return;
    await axios.put(`${API}/${editing._id}`, form);
    fetchMembers();
    setOpen(false);
    setEditing(null);
  };

  const handleDelete = async (id: string) => {
    await axios.delete(`${API}/${id}`);
    fetchMembers();
  };

  // Stats
  const totalMembers = members.length;
  const activeMembers = members.filter(m => m.status === "active").length;
  const newThisMonth = members.filter(m => {
    const d = new Date(m.createdAt);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  return (
    <div className="space-y-6">

      {/* STATS */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass rounded-2xl p-5">
          <p className="text-gray-400 text-sm">Total Members</p>
          <p className="text-3xl font-bold text-white mt-1">{totalMembers}</p>
        </div>
        <div className="glass rounded-2xl p-5">
          <p className="text-gray-400 text-sm">Active Members</p>
          <p className="text-3xl font-bold text-green-400 mt-1">{activeMembers}</p>
        </div>
        <div className="glass rounded-2xl p-5">
          <p className="text-gray-400 text-sm">New This Month</p>
          <p className="text-3xl font-bold text-yellow-400 mt-1">{newThisMonth}</p>
        </div>
      </div>

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Membership Management</h1>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-black/40 border border-yellow-500/20 text-white px-3 py-2 rounded-lg"
        >
          <option value="All">All</option>
          <option value="1">1 Month</option>
          <option value="3">3 Months</option>
          <option value="6">6 Months</option>
          <option value="12">12 Months</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="glass rounded-2xl p-5 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-gray-400 border-b border-gray-700">
              <th className="py-3">Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Package</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((m) => (
              <tr key={m._id} className="border-b border-gray-800">
                <td className="py-3 text-white">{m.name}</td>
                <td className="text-gray-400">{m.email}</td>
                <td className="text-gray-400">{m.phone || "—"}</td>
                <td className="text-gray-400">{m.duration ? `${m.duration} months` : "—"}</td>
                <td>
                  <span className={`px-3 py-1 rounded-full text-xs ${
                    m.status === "active"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-red-500/20 text-red-400"
                  }`}>
                    {m.status}
                  </span>
                </td>
                <td className="text-gray-400">
                  {new Date(m.createdAt).toLocaleDateString("vi-VN")}
                </td>
                <td className="flex gap-2 py-3">
                  <button onClick={() => handleEdit(m)} className="text-yellow-400 hover:underline">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(m._id)} className="text-red-400 hover:underline">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredData.length === 0 && (
          <p className="text-center text-gray-500 py-10">Chưa có member nào</p>
        )}
      </div>

      {/* MODAL — Admin cập nhật gói tập */}
      {open && editing && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#111] p-6 rounded-2xl w-[400px] space-y-4">
            <h2 className="text-lg font-bold text-yellow-400">
              Edit Member: {editing.name}
            </h2>

            <input
              placeholder="Phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full p-2 rounded bg-black/40 text-white"
            />

            <select
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })}
              className="w-full p-2 rounded bg-black/40 text-white"
            >
              <option value={0}>Chưa có gói</option>
              <option value={1}>1 Month</option>
              <option value={3}>3 Months</option>
              <option value={6}>6 Months</option>
              <option value={12}>12 Months</option>
            </select>

            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full p-2 rounded bg-black/40 text-white"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 bg-gray-600 rounded text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-yellow-400 text-black rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}