"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Card, Select, Statistic, Progress, Row, Col, Typography, Spin } from "antd";
import {
  UserOutlined, TeamOutlined, CalendarOutlined,
  RiseOutlined, ShoppingOutlined, TrophyOutlined
} from "@ant-design/icons";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Legend,
} from "recharts";

const { Title, Text } = Typography;
const { Option } = Select;

const cardStyle = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 16,
};

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:5000/api/dashboard")
      .then(res => { setData(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 300 }}>
      <Spin size="large" />
    </div>
  );

  if (!data) return <Text type="danger">Không tải được dữ liệu</Text>;

  const chartData = selectedMonth === "All"
    ? data.monthlyData
    : data.monthlyData.filter((d: any) => d.month === selectedMonth);

  const months = ["All", ...data.monthlyData.map((d: any) => d.month)];
  const activeRate = data.totalMembers > 0
    ? Math.round((data.activeMembers / data.totalMembers) * 100) : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Title level={3} style={{ color: "#fff", margin: 0 }}>Dashboard</Title>
        <Select value={selectedMonth} onChange={setSelectedMonth}
          style={{ width: 160 }}
          styles={{ popup: { root: { background: "#1a1a1a" } } }}>
          {months.map((m: string) => <Option key={m} value={m}>{m}</Option>)}
        </Select>
      </div>

      {/* STATS ROW 1 */}
      <Row gutter={[16, 16]}>
        {[
          { title: "Hội viên", value: data.totalMembers, icon: <UserOutlined />, color: "#facc15" },
          { title: "Active", value: data.activeMembers, icon: <TrophyOutlined />, color: "#4ade80" },
          { title: "Trainers", value: data.totalTrainers, icon: <TeamOutlined />, color: "#60a5fa" },
          { title: "Bookings", value: data.totalBookings, icon: <CalendarOutlined />, color: "#f97316" },
          
        ].map(item => (
          <Col key={item.title} xs={12} sm={8} md={8} lg={4} xl={4}>
            <Card style={cardStyle} styles={{ body: { padding: 16 } }}>
              <Statistic
                title={<Text style={{ color: "#9ca3af", fontSize: 12 }}>{item.title}</Text>}
                value={item.value}
                prefix={<span style={{ color: item.color, marginRight: 6 }}>{item.icon}</span>}
                valueStyle={{ color: "#fff", fontSize: 24, fontWeight: 700 }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* REVENUE ROW */}
      <Row gutter={[16, 16]}>
        {[
          { label: "Tổng Doanh Thu", value: data.totalRevenue, color: "#facc15" },
          { label: "Doanh Thu Booking", value: data.totalBookingRevenue, color: "#4ade80" },
          { label: "Doanh Thu Shop", value: data.totalOrderRevenue, color: "#60a5fa" },
         
        ].map(item => (
          <Col key={item.label} xs={24} sm={12} md={6}>
            <Card style={cardStyle} styles={{ body: { padding: 20 } }}>
              <Text style={{ color: "#9ca3af", fontSize: 12, display: "block", marginBottom: 8 }}>
                {item.label}
              </Text>
              <span style={{ color: item.color, fontSize: 26, fontWeight: 700 }}>
                {item.isCount
                  ? item.value
                  : `${item.value.toLocaleString("vi-VN")}đ`}
              </span>
            </Card>
          </Col>
        ))}
      </Row>

      {/* CHART + MEMBER STATS */}
      <Row gutter={[16, 16]}>

        {/* CHART */}
        <Col xs={24} lg={16}>
          <Card
            style={cardStyle}
            styles={{ body: { padding: 20 } }}
            title={
              <Text style={{ color: "#9ca3af" }}>
                Doanh Thu {selectedMonth !== "All" && `(${selectedMonth})`}
              </Text>
            }
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <defs>
                  <linearGradient id="colorBooking" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#facc15" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#facc15" stopOpacity={0.2} />
                  </linearGradient>
                  <linearGradient id="colorOrder" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.2} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="month" stroke="#999" />
                <YAxis stroke="#999" tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  formatter={(value: number) => [`${value.toLocaleString("vi-VN")}đ`]}
                  contentStyle={{ backgroundColor: "#111", border: "1px solid #facc15" }}
                />
                <Legend />
                <Bar dataKey="bookingRevenue" name="Booking" fill="url(#colorBooking)" radius={[8, 8, 0, 0]} />
                <Bar dataKey="orderRevenue" name="Shop" fill="url(#colorOrder)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* MEMBER STATS */}
        <Col xs={24} lg={8}>
          <Card
            style={{ ...cardStyle, height: "100%" }}
            styles={{ body: { padding: 20 } }}
            title={<Text style={{ color: "#9ca3af" }}>Member Overview</Text>}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

              {/* Active Rate */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <Text style={{ color: "#9ca3af", fontSize: 12 }}>Active Rate</Text>
                  <Text style={{ color: "#facc15", fontSize: 12 }}>{activeRate}%</Text>
                </div>
                <Progress
                  percent={activeRate}
                  strokeColor="#facc15"
                  trailColor="#374151"
                  showInfo={false}
                  strokeWidth={8}
                />
              </div>

              {/* Grid stats */}
              <Row gutter={[12, 12]}>
                {[
                  { value: data.activeMembers, label: "Active", color: "#4ade80" },
                  { value: data.totalMembers - data.activeMembers, label: "Inactive", color: "#f87171" },
                  { value: data.newThisMonth, label: "New/Month", color: "#facc15" },
                  { value: data.totalBookings, label: "Bookings", color: "#60a5fa" },
                ].map(item => (
                  <Col key={item.label} span={12}>
                    <div style={{
                      background: "rgba(0,0,0,0.4)", borderRadius: 12,
                      padding: "12px 8px", textAlign: "center"
                    }}>
                      <div style={{ color: item.color, fontSize: 22, fontWeight: 700 }}>
                        {item.value}
                      </div>
                      <div style={{ color: "#6b7280", fontSize: 11, marginTop: 4 }}>
                        {item.label}
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}