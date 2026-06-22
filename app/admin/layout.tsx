"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Layout({ children }: any) {
  const pathname = usePathname();

  const menu = [
    { name: "Dashboard", path: "/admin" },
    { name: "Trainers", path: "/admin/trainers" },
    { name: "Members", path: "/admin/members" }, 
    { name: "Shop", path: "/admin/shop" }, 
    { name: "Booking", path: "/admin/booking" }, 
    { name: "Plan", path: "/admin/plan" }, 
    { name: "Equipment", path: "/admin/equipment" }, 
    { name: "Profile", path: "/admin/profile" }, 
    { name: "Orders", path: "/admin/order" }, 
    { name: "Review", path: "/admin/review" }, 
  ];

  // Hàm xử lý khi nhấn Đăng xuất
  const handleLogout = () => {
    // 1. Xóa token / session ở đây (Ví dụ: localStorage.removeItem('token'))
    console.log("Đang đăng xuất...");
    
    // 2. Chuyển hướng người dùng về trang login
    // window.location.href = "/"; 
  };

  return (
    <div className="flex min-h-screen bg-gym text-white">
      
      {/* Sidebar */}
      <aside className="w-64 p-5 glass flex flex-col justify-between"> {/* Thêm justify-between để đẩy nút xuống dưới */}
        <div>
          <h1 className="text-xl font-bold text-yellow-400">
            GYM ADMIN
          </h1>

          <nav className="mt-6 flex flex-col gap-2">
            {menu.map((item) => {
              const isActive = pathname === item.path;

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`px-4 py-2 rounded-lg transition ${
                    isActive
                      ? "bg-yellow-400 text-black font-semibold"
                      : "hover:bg-white/10"
                    }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* 🌟 Nút Đăng xuất nằm ở đây (Tự động đẩy xuống đáy Sidebar) */}
        <button
          onClick={handleLogout}
          className="mt-auto w-full px-4 py-2 text-left rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition font-medium"
        >
          🚪 Đăng xuất
        </button>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}