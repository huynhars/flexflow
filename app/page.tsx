"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login/admin", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      router.push("/admin");

    } catch (err: any) {
      setError(err.response?.data?.message || "Đã có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-6">
      <div className="relative w-full max-w-md p-10 rounded-2xl border border-white/20 backdrop-blur-xl bg-black/70">

        <h2 className="text-3xl font-bold text-center mb-2">
          Login to your account
        </h2>
        <p className="text-gray-500 text-center text-sm mb-8">Flex Flow Management</p>

        {error && (
          <p className="text-red-400 text-sm text-center mb-4 bg-red-400/10 py-2 rounded-lg">
            {error}
          </p>
        )}

        <div className="space-y-5">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-4 py-3 rounded-lg bg-black border border-white/30 focus:outline-none focus:border-yellow-500"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-3 rounded-lg bg-black border border-white/30 focus:outline-none focus:border-yellow-500"
          />
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full mt-6 py-3 rounded-full font-semibold text-black bg-gradient-to-r from-yellow-400 to-orange-500 hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? "Đang đăng nhập..." : "Login"}
        </button>

      </div>
    </div>
  );
}