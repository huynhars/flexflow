"use client";
import { useState, useEffect } from "react";
import axios from "axios";

type Plan = {
  _id?: string;
  name: string;
  price: number;
  duration: number;
  features: string;
  popular: boolean;
};

const API = "http://localhost:5000/api/plans";

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Plan | null>(null);
  const [form, setForm] = useState<Plan>({ name: "", price: 0, duration: 30, features: "", popular: false });

  useEffect(() => { fetchPlans(); }, []);

  const fetchPlans = async () => {
    const res = await axios.get(API);
    setPlans(res.data);
  };

  const handleSubmit = async () => {
    if (editing?._id) {
      await axios.put(`${API}/${editing._id}`, form);
    } else {
      await axios.post(API, form);
    }
    fetchPlans();
    setOpen(false);
    setEditing(null);
    setForm({ name: "", price: 0, duration: 30, features: "", popular: false });
  };

  const handleDelete = async (id: string) => {
    await axios.delete(`${API}/${id}`);
    fetchPlans();
  };

  const totalPlans = plans.length;
  const avgPrice = plans.reduce((s, p) => s + p.price, 0) / (plans.length || 1);
  const popularPlan = plans.find(p => p.popular);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Membership Plans</h1>
        <button onClick={() => { setOpen(true); setEditing(null); }}
          className="bg-yellow-400 text-black px-4 py-2 rounded-lg">+ Add Plan</button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="glass p-4 rounded-xl">
          <p className="text-gray-400 text-sm">Total Plans</p>
          <h2 className="text-xl font-bold text-yellow-400">{totalPlans}</h2>
        </div>
        <div className="glass p-4 rounded-xl">
          <p className="text-gray-400 text-sm">Average Price</p>
          <h2 className="text-xl font-bold text-yellow-400">{Math.round(avgPrice).toLocaleString()}đ</h2>
        </div>
        <div className="glass p-4 rounded-xl">
          <p className="text-gray-400 text-sm">Popular Plan</p>
          <h2 className="text-xl font-bold text-yellow-400">{popularPlan?.name || "None"}</h2>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {plans.map((p) => (
          <div key={p._id} className={`glass rounded-2xl p-6 space-y-4 relative ${p.popular ? "border border-yellow-400" : ""}`}>
            {p.popular && (
              <span className="absolute top-3 right-3 bg-yellow-400 text-black text-xs px-2 py-1 rounded">
                MOST POPULAR
              </span>
            )}
            <h2 className="text-xl font-bold text-white">{p.name}</h2>
            <p className="text-3xl font-bold text-yellow-400">{p.price.toLocaleString()}đ</p>
            <p className="text-gray-400 text-sm">{p.duration} days</p>
            <p className="text-gray-300 text-sm">{p.features}</p>
            <div className="flex justify-between mt-4">
              <button onClick={() => { setEditing(p); setForm(p); setOpen(true); }}
                className="text-yellow-400 text-sm">Edit</button>
              <button onClick={() => handleDelete(p._id!)}
                className="text-red-400 text-sm">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#111] p-6 rounded-2xl w-[400px] space-y-4">
            <h2 className="text-lg font-bold text-yellow-400">{editing ? "Edit Plan" : "Add Plan"}</h2>
            <input placeholder="Plan Name" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full p-2 rounded bg-black/40 text-white" />
            <input type="number" placeholder="Price" value={form.price}
              onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
              className="w-full p-2 rounded bg-black/40 text-white" />
            <input type="number" placeholder="Duration (days)" value={form.duration}
              onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })}
              className="w-full p-2 rounded bg-black/40 text-white" />
            <input placeholder="Features" value={form.features}
              onChange={(e) => setForm({ ...form, features: e.target.value })}
              className="w-full p-2 rounded bg-black/40 text-white" />
            <label className="flex items-center gap-2 text-gray-300 text-sm">
              <input type="checkbox" checked={form.popular}
                onChange={(e) => setForm({ ...form, popular: e.target.checked })} />
              Mark as popular
            </label>
            <div className="flex justify-end gap-3">
              <button onClick={() => setOpen(false)}
                className="px-4 py-2 bg-gray-600 rounded text-white">Cancel</button>
              <button onClick={handleSubmit}
                className="px-4 py-2 bg-yellow-400 text-black rounded">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}