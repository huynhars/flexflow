"use client";

import { useState } from "react";

// ===================== TYPES =====================
type Tab = "overview" | "activity" | "security" | "permissions";

interface KPI {
  label: string;
  value: string;
  sub?: string;
}

interface Goal {
  label: string;
  current: string;
  target: string;
  percent: number;
  done?: boolean;
}

interface Permission {
  label: string;
  granted: boolean;
}

interface ActivityItem {
  text: string;
  highlight?: string;
  time: string;
  date: string;
}

// ===================== MOCK DATA =====================
const kpis: KPI[] = [
  { label: "Doanh thu", value: "$24.2K" },
  { label: "Hài lòng KH", value: "94%" },
  { label: "KH mới", value: "+18" },
  { label: "Tỷ lệ huỷ", value: "2.1%" },
];

const goals: Goal[] = [
  { label: "Doanh thu mục tiêu", current: "$24.2K", target: "$28K", percent: 86 },
  { label: "Khách hàng mới", current: "18", target: "25", percent: 72 },
  {
    label: "Tỷ lệ giữ chân KH",
    current: "97.9%",
    target: "96%",
    percent: 100,
    done: true,
  },
];

const permissions: Permission[] = [
  { label: "Quản lý khách hàng", granted: true },
  { label: "Quản lý HLV", granted: true },
  { label: "Xem báo cáo tài chính", granted: true },
  { label: "Tạo / sửa lịch", granted: true },
  { label: "Gửi thông báo", granted: true },
  { label: "Xoá dữ liệu hệ thống", granted: false },
  { label: "Cài đặt Super Admin", granted: false },
];

const activities: ActivityItem[] = [
  { text: "Thêm HLV mới", highlight: "Trần Văn B", time: "09:14", date: "Hôm nay" },
  { text: "Cập nhật gói", highlight: "Premium 3 tháng", time: "15:32", date: "Hôm qua" },
  { text: "Xuất báo cáo", highlight: "Tháng 3/2025", time: "11:00", date: "18/04" },
  { text: "Duyệt 5 lịch đặt mới", time: "08:45", date: "17/04" },
  { text: "Đổi mật khẩu tài khoản", time: "20:11", date: "15/04" },
];

const personalInfo = [
  { label: "Họ tên", value: "Nguyễn Văn Minh" },
  { label: "Ngày sinh", value: "12/07/1991" },
  { label: "Giới tính", value: "Nam" },
  { label: "CCCD", value: "079091****23" },
  { label: "Chức vụ", value: "Quản lý phòng gym" },
  { label: "Ngày vào làm", value: "15/03/2022" },
  { label: "Phòng ban", value: "Operations" },
];

const skills = [
  "Quản lý nhân sự",
  "Tài chính",
  "PT Coaching",
  "Marketing",
  "CRM",
  "Dinh dưỡng",
];

// ===================== SUB-COMPONENTS =====================

function StatMini({ num, label }: { num: string; label: string }) {
  return (
    <div className="bg-yellow-500/10 border border-yellow-500/15 rounded-xl p-3 text-center">
      <div className="text-xl font-bold text-yellow-400">{num}</div>
      <div className="text-[11px] text-gray-500 mt-0.5">{label}</div>
    </div>
  );
}

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex justify-between items-center py-2.5 border-b border-white/5 last:border-0">
      <span className="text-gray-500 text-[13px]">{label}</span>
      <span className="text-[13px] text-gray-200 font-medium">{children}</span>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-3.5">
      <span className="text-[11px] font-bold tracking-[1.5px] uppercase text-yellow-400 whitespace-nowrap">
        {children}
      </span>
      <div className="flex-1 h-px bg-yellow-500/15" />
    </div>
  );
}

function PermItem({ label, granted }: Permission) {
  return (
    <div className="flex items-center gap-2.5 px-3 py-2 bg-white/[0.03] rounded-lg mb-1.5 text-[13px]">
      {granted ? (
        <div className="w-[18px] h-[18px] rounded-full bg-green-400/20 flex items-center justify-center text-green-400 text-[10px] shrink-0">
          ✓
        </div>
      ) : (
        <div className="w-[18px] h-[18px] rounded-full bg-red-400/20 flex items-center justify-center text-red-400 text-[10px] shrink-0">
          ✕
        </div>
      )}
      <span className={granted ? "text-gray-300" : "text-gray-600"}>{label}</span>
    </div>
  );
}

function TimelineItem({ item, isLast }: { item: ActivityItem; isLast: boolean }) {
  return (
    <div className="flex gap-3 pb-4 relative">
      {!isLast && (
        <div className="absolute left-[9px] top-5 w-px h-[calc(100%-4px)] bg-yellow-500/15" />
      )}
      <div className="w-[18px] h-[18px] rounded-full bg-yellow-400/20 border-2 border-yellow-400 shrink-0 mt-0.5" />
      <div>
        <div className="text-[13px] text-gray-300">
          {item.text}{" "}
          {item.highlight && (
            <span className="text-yellow-400">{item.highlight}</span>
          )}
        </div>
        <div className="text-[12px] text-gray-600 mt-0.5">
          {item.date} · {item.time}
        </div>
      </div>
    </div>
  );
}

function ProgressGoal({ goal }: { goal: Goal }) {
  return (
    <div>
      <div className="flex justify-between mb-1.5">
        <span className="text-[13px] text-gray-300">{goal.label}</span>
        <span
          className={`text-[13px] font-semibold ${
            goal.done ? "text-green-400" : "text-yellow-400"
          }`}
        >
          {goal.current} / {goal.target} {goal.done && "✓"}
        </span>
      </div>
      <div className="w-full h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            goal.done
              ? "bg-gradient-to-r from-green-400 to-green-500"
              : "bg-gradient-to-r from-yellow-400 to-amber-500"
          }`}
          style={{ width: `${goal.percent}%` }}
        />
      </div>
      <div
        className={`text-[11px] mt-1 ${goal.done ? "text-green-400" : "text-gray-600"}`}
      >
        {goal.done ? "Đã đạt mục tiêu" : `${goal.percent}% hoàn thành`}
      </div>
    </div>
  );
}

// ===================== MAIN COMPONENT =====================
export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  const tabs: { key: Tab; label: string }[] = [
    { key: "overview", label: "Tổng quan" },
    { key: "activity", label: "Hoạt động" },
    { key: "security", label: "Bảo mật" },
    { key: "permissions", label: "Phân quyền" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Profile Manager</h1>
        <div className="flex gap-2">
          <button className="bg-yellow-400/15 border border-yellow-500/30 text-yellow-400 text-[12px] px-3.5 py-1.5 rounded-lg hover:bg-yellow-400/25 transition">
            ✏ Edit Profile
          </button>
          <button className="bg-red-500/10 border border-red-500/30 text-red-400 text-[12px] px-3.5 py-1.5 rounded-lg hover:bg-red-500/20 transition">
            ⚙ Settings
          </button>
        </div>
      </div>

      {/* Layout: Left + Right */}
      <div className="grid grid-cols-[300px_1fr] gap-5">

        {/* ===== LEFT ===== */}
        <div className="flex flex-col gap-4">

          {/* Avatar Card */}
          <div className="glass rounded-2xl p-6 text-center border border-yellow-500/20">
            <div className="flex justify-center mb-3.5">
              <div className="relative w-[90px] h-[90px]">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center text-3xl font-bold text-black">
                  NM
                </div>
                <div className="absolute bottom-[4px] right-[4px] w-3.5 h-3.5 rounded-full bg-green-400 border-2 border-black" />
              </div>
            </div>

            <div className="text-xl font-bold mb-1">Nguyễn Minh</div>
            <div className="text-[13px] text-gray-500 mb-2.5">Gym Manager</div>

            <div className="flex justify-center flex-wrap gap-1.5 mb-4">
              <span className="bg-yellow-400/15 border border-yellow-500/30 text-yellow-400 text-[11px] px-2.5 py-0.5 rounded-full font-semibold tracking-wide">
                ADMIN
              </span>
              <span className="bg-green-400/15 border border-green-500/30 text-green-400 text-[11px] px-2.5 py-0.5 rounded-full">
                Online
              </span>
              <span className="bg-yellow-400/15 border border-yellow-500/30 text-yellow-400 text-[11px] px-2.5 py-0.5 rounded-full">
                Pro Plan
              </span>
            </div>

            <div className="text-[12px] text-gray-600 mb-4">
              Thành viên từ 15/03/2022 · 2 năm 11 tháng
            </div>

            <div className="grid grid-cols-3 gap-2">
              <StatMini num="142" label="Khách hàng" />
              <StatMini num="8" label="HLV" />
              <StatMini num="5.6K" label="Phiên" />
            </div>
          </div>

          {/* Contact */}
          <div className="glass rounded-2xl p-4 border border-yellow-500/12">
            <SectionTitle>Liên hệ</SectionTitle>
            <InfoRow label="📧 Email">minh@fitpro.vn</InfoRow>
            <InfoRow label="📱 Điện thoại">0912 345 678</InfoRow>
            <InfoRow label="📍 Chi nhánh">Hà Nội — Q. Đống Đa</InfoRow>
            <InfoRow label="🌐 Website">
              <span className="text-yellow-400">fitpro.vn</span>
            </InfoRow>
          </div>

          {/* Skills */}
          <div className="glass rounded-2xl p-4 border border-yellow-500/12">
            <SectionTitle>Chuyên môn</SectionTitle>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((s) => (
                <span
                  key={s}
                  className="bg-yellow-400/10 border border-yellow-500/20 text-yellow-400 text-[11px] px-2.5 py-1 rounded-full"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ===== RIGHT ===== */}
        <div className="flex flex-col gap-4">

          {/* Tabs */}
          <div className="glass rounded-2xl p-1.5 flex gap-1 border border-yellow-500/12">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`text-[13px] px-4 py-2 rounded-xl transition-all ${
                  activeTab === t.key
                    ? "bg-yellow-400/15 text-yellow-400 font-semibold"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* KPIs */}
          <div className="glass rounded-2xl p-4 border border-yellow-500/12">
            <SectionTitle>Chỉ số hiệu suất (KPI tháng này)</SectionTitle>
            <div className="grid grid-cols-4 gap-3">
              {kpis.map((k) => (
                <div
                  key={k.label}
                  className="bg-yellow-400/8 border border-yellow-500/15 rounded-xl p-3 text-center"
                >
                  <div className="text-[22px] font-bold text-yellow-400">{k.value}</div>
                  <div className="text-[11px] text-gray-500 mt-0.5">{k.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Goals */}
          <div className="glass rounded-2xl p-4 border border-yellow-500/12">
            <SectionTitle>Mục tiêu tháng 4</SectionTitle>
            <div className="flex flex-col gap-3.5">
              {goals.map((g) => (
                <ProgressGoal key={g.label} goal={g} />
              ))}
            </div>
          </div>

          {/* Permissions + Activity */}
          <div className="grid grid-cols-2 gap-4">
            <div className="glass rounded-2xl p-4 border border-yellow-500/12">
              <SectionTitle>Phân quyền hệ thống</SectionTitle>
              {permissions.map((p) => (
                <PermItem key={p.label} {...p} />
              ))}
            </div>

            <div className="glass rounded-2xl p-4 border border-yellow-500/12">
              <SectionTitle>Hoạt động gần đây</SectionTitle>
              {activities.map((a, i) => (
                <TimelineItem key={i} item={a} isLast={i === activities.length - 1} />
              ))}
            </div>
          </div>

          {/* Personal Info */}
          <div className="glass rounded-2xl p-4 border border-yellow-500/12">
            <SectionTitle>Thông tin cá nhân</SectionTitle>
            <div className="grid grid-cols-2 gap-x-6">
              {personalInfo.map((info) =>
                info.label === "Phòng ban" ? (
                  <InfoRow key={info.label} label={info.label}>
                    {info.value}
                  </InfoRow>
                ) : info.label === "Chức vụ" ? (
                  <InfoRow key={info.label} label={info.label}>
                    {info.value}
                  </InfoRow>
                ) : (
                  <InfoRow key={info.label} label={info.label}>
                    {info.value}
                  </InfoRow>
                )
              )}
              <InfoRow label="Trạng thái hợp đồng">
                <span className="bg-green-400/15 border border-green-500/30 text-green-400 text-[11px] px-2.5 py-0.5 rounded-full">
                  Còn hiệu lực
                </span>
              </InfoRow>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}