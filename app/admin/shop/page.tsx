"use client";

import { useState, useEffect } from "react";
import axios from "axios";

type Product = {
  _id?: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

const API = "http://localhost:5000/api/products";

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [form, setForm] = useState<Product>({ name: "", price: 0, image: "", quantity: 0 });

  // Load sản phẩm từ DB
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await axios.get(API);
    setProducts(res.data);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    const finalImage = imagePreview || form.image;
    const payload = { ...form, image: finalImage };

    if (editing?._id) {
      await axios.put(`${API}/${editing._id}`, payload);
    } else {
      await axios.post(API, payload);
    }

    fetchProducts();
    setOpen(false);
    resetForm();
  };

  const handleDelete = async (id: string) => {
    await axios.delete(`${API}/${id}`);
    fetchProducts();
  };

  const handleEdit = (p: Product) => {
    setEditing(p);
    setForm(p);
    setImagePreview(p.image);
    setOpen(true);
  };

  const resetForm = () => {
    setForm({ name: "", price: 0, image: "", quantity: 0 });
    setImageFile(null);
    setImagePreview("");
    setEditing(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Shop Management</h1>
        <button
          onClick={() => { setOpen(true); resetForm(); }}
          className="bg-yellow-400 text-black px-4 py-2 rounded-lg hover:bg-yellow-300"
        >
          + Add Product
        </button>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {products.map((p) => (
          <div key={p._id} className="glass rounded-2xl p-4 space-y-3">
            <img src={p.image} className="w-full h-40 object-cover rounded-xl" alt={p.name} />
            <h3 className="text-white font-semibold">{p.name}</h3>
            <p className="text-yellow-400 font-bold">{p.price} VNĐ</p>
            <p className="text-gray-400 text-sm">Stock: {p.quantity}</p>
            <div className="flex justify-between mt-2">
              <button onClick={() => handleEdit(p)} className="text-yellow-400 text-sm">Edit</button>
              <button onClick={() => handleDelete(p._id!)} className="text-red-400 text-sm">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#111] p-6 rounded-2xl w-[400px] space-y-4">
            <h2 className="text-lg font-bold text-yellow-400">
              {editing ? "Edit Product" : "Add Product"}
            </h2>

            <input placeholder="Name" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full p-2 rounded bg-black/40 text-white" />

            <div className="space-y-1">
              <label className="text-sm text-gray-400">Giá (VNĐ)</label>
              <input placeholder="Nhập giá..." type="number" value={form.price}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                className="w-full p-2 rounded bg-black/40 text-white" />
              {form.price > 0 && (
                <p className="text-yellow-400 text-sm">💰 {form.price.toLocaleString("vi-VN")}đ</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-sm text-gray-400">Số lượng</label>
              <input placeholder="Nhập số lượng..." type="number" value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
                className="w-full p-2 rounded bg-black/40 text-white" />
            </div>

            {/* ✅ Chỉ dùng URL */}
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Image URL</label>
              <input
                placeholder="https://..."
                value={form.image}
                onChange={(e) => {
                  setForm({ ...form, image: e.target.value });
                  setImagePreview(e.target.value);
                }}
                className="w-full p-2 rounded bg-black/40 text-white"
              />
              {/* Preview */}
              {imagePreview && (
                <div className="w-full h-32 bg-black/40 rounded-xl overflow-hidden">
                  <img
                    src={imagePreview}
                    className="w-full h-full object-contain"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                </div>
              )}
              <p className="text-gray-500 text-xs">
                💡 Dùng link ảnh từ Google: chuột phải ảnh → "Copy image address"
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <button onClick={() => { setOpen(false); resetForm(); }}
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