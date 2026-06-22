"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Star } from "lucide-react";

const API = "http://localhost:5000/api/reviews";

export default function ReviewPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchReviews(); }, []);

  const fetchReviews = async () => {
    setLoading(true);
    const res = await axios.get(API);
    setReviews(res.data);
    setLoading(false);
  };

  const handleStatus = async (id: string, status: string) => {
    await axios.put(`${API}/${id}`, { status });
    fetchReviews();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Xoá đánh giá này?")) return;
    await axios.delete(`${API}/${id}`);
    fetchReviews();
  };

  const filtered = reviews.filter(r => filter === "all" || r.status === filter);
  const total = reviews.length;
  const pending = reviews.filter(r => r.status === "pending").length;
  const approved = reviews.filter(r => r.status === "approved").length;
  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : "—";

  const renderStars = (count: number) =>
    Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} size={14}
        className={i < count ? "text-yellow-400 fill-yellow-400" : "text-gray-600"} />
    ));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Quản lý đánh giá</h1>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="glass p-4 rounded-xl">
          <p className="text-gray-400 text-sm">Tổng đánh giá</p>
          <p className="text-2xl font-bold text-white mt-1">{total}</p>
        </div>
        <div className="glass p-4 rounded-xl">
          <p className="text-gray-400 text-sm">Chờ duyệt</p>
          <p className="text-2xl font-bold text-yellow-400 mt-1">{pending}</p>
        </div>
        <div className="glass p-4 rounded-xl">
          <p className="text-gray-400 text-sm">Đã duyệt</p>
          <p className="text-2xl font-bold text-green-400 mt-1">{approved}</p>
        </div>
        <div className="glass p-4 rounded-xl">
          <p className="text-gray-400 text-sm">Điểm TB</p>
          <p className="text-2xl font-bold text-yellow-400 mt-1">⭐ {avgRating}</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-3">
        {[
          { key: "all", label: "Tất cả" },
          { key: "pending", label: "Chờ duyệt" },
          { key: "approved", label: "Đã duyệt" },
          { key: "rejected", label: "Từ chối" },
        ].map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`px-4 py-1 rounded-full text-sm transition ${
              filter === f.key ? "bg-yellow-400 text-black font-semibold" : "bg-black/40 text-gray-300"
            }`}>
            {f.label}
            {f.key === "pending" && pending > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">{pending}</span>
            )}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="glass rounded-2xl overflow-hidden">
        {loading ? (
          <p className="text-center text-gray-400 py-10 animate-pulse">Đang tải...</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-500 py-10">Không có đánh giá nào</p>
        ) : (
          <table className="w-full">
            <thead className="bg-black/50 text-gray-300 text-sm">
              <tr>
                <th className="p-3 text-left">Hội viên</th>
                <th className="p-3 text-left">Sao</th>
                <th className="p-3 text-left">Nội dung</th>
                <th className="p-3 text-left">Ngày</th>
                <th className="p-3 text-left">Trạng thái</th>
                <th className="p-3 text-left">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r._id} className="border-t border-white/10 hover:bg-white/5">
                  <td className="p-3 text-white font-medium">{r.userName}</td>
                  <td className="p-3">
                    <div className="flex gap-0.5">{renderStars(r.rating)}</div>
                  </td>
                  <td className="p-3 text-gray-400 text-sm max-w-[280px]">
                    <p className="line-clamp-2">"{r.text}"</p>
                  </td>
                  <td className="p-3 text-gray-400 text-xs">
                    {new Date(r.createdAt).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="p-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      r.status === "approved" ? "bg-green-500/20 text-green-400" :
                      r.status === "pending"  ? "bg-yellow-500/20 text-yellow-400" :
                      "bg-red-500/20 text-red-400"
                    }`}>
                      {r.status === "approved" ? "Đã duyệt" :
                       r.status === "pending"  ? "Chờ duyệt" : "Từ chối"}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      {r.status !== "approved" && (
                        <button onClick={() => handleStatus(r._id, "approved")}
                          className="px-3 py-1 bg-green-500/15 text-green-400 border border-green-500/30 rounded-lg text-xs hover:bg-green-500/25 transition">
                          ✅ Duyệt
                        </button>
                      )}
                      {r.status !== "rejected" && (
                        <button onClick={() => handleStatus(r._id, "rejected")}
                          className="px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg text-xs hover:bg-red-500/20 transition">
                          ❌ Từ chối
                        </button>
                      )}
                      <button onClick={() => handleDelete(r._id)}
                        className="px-3 py-1 bg-gray-500/10 text-gray-400 border border-gray-500/20 rounded-lg text-xs hover:bg-gray-500/20 transition">
                        Xoá
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}