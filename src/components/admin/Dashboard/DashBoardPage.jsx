import React, { useState, useEffect } from "react";
import { dummyProducts } from "../Product/dummyProducts";
import { getOrderStatistics } from "@/api/order";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const DashboardPage = () => {
  const today = new Date();
  const todayString = today.toISOString().split("T")[0];

  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    .toISOString()
    .split("T")[0];

  const [startDate, setStartDate] = useState(firstDayOfMonth);
  const [endDate, setEndDate] = useState(todayString);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleStartDateChange = (e) => {
    const value = e.target.value;
    setStartDate(value);
    if (endDate && value > endDate) setEndDate(value);
  };

  const handleEndDateChange = (e) => {
    const value = e.target.value;
    if (startDate && value < startDate) return;
    setEndDate(value);
  };

  // Fetch statistics data
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getOrderStatistics();
        setStatistics(response.data);
      } catch (err) {
        console.error("Error fetching statistics:", err);
        setError("Không thể tải dữ liệu thống kê");
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  // Format functions
  const formatVND = (value) => value.toLocaleString("vi-VN") + " ₫";

  const formatYAxis = (value) => {
    if (value >= 1000000) return (value / 1000000).toFixed(1) + "M";
    if (value >= 1000) return (value / 1000).toFixed(0) + "K";
    return value;
  };

  const formatPercentChange = (value) => {
    if (value === 0) return "0%";
    return `${value >= 0 ? "+" : ""}${value}%`;
  };

  // Transform saleGraph data to chart format
  const chartData = statistics?.saleGraph
    ? Object.keys(statistics.saleGraph).map((month) => {
        const monthNames = [
          "Tháng 1",
          "Tháng 2",
          "Tháng 3",
          "Tháng 4",
          "Tháng 5",
          "Tháng 6",
          "Tháng 7",
          "Tháng 8",
          "Tháng 9",
          "Tháng 10",
          "Tháng 11",
          "Tháng 12",
        ];
        return {
          month: monthNames[parseInt(month) - 1],
          sales: statistics.saleGraph[month],
        };
      })
    : [];

  const categoryRevenue = [
    { name: "Phòng ngủ", value: 13000000 },
    { name: "Ngoài trời", value: 10000000 },
    { name: "Phòng khách", value: 8000000 },
    { name: "Nhà bếp & thiết bị", value: 7000000 },
    { name: "Văn phòng tại nhà", value: 6000000 },
    { name: "Phòng ăn", value: 4000000 },
    { name: "Phòng trẻ em", value: 3500000 },
    { name: "Phòng tắm", value: 3000000 },
  ];

  const COLORS = [
    "#4F46E5",
    "#2563EB",
    "#16A34A",
    "#F59E0B",
    "#EF4444",
    "#0D9488",
    "#A855F7",
    "#14B8A6",
  ];

  // Transform statistics to stats format
  const stats = statistics
    ? [
        {
          title: "Tổng doanh thu",
          amount: statistics.totalOrders?.totalOrder || 0,
          change: formatPercentChange(
            statistics.totalOrders?.percentIncrease || 0
          ),
        },
        {
          title: "Doanh thu đơn mới đặt",
          amount: statistics.pendingOrders?.totalOrder || 0,
          change: formatPercentChange(
            statistics.pendingOrders?.percentIncrease || 0
          ),
        },
        {
          title: "Doanh thu đơn đã giao",
          amount: statistics.completedOrders?.totalOrder || 0,
          change: formatPercentChange(
            statistics.completedOrders?.percentIncrease || 0
          ),
        },
        {
          title: "Doanh thu đơn hoàn trả",
          amount: statistics.returnOrders?.totalOrder || 0,
          change: formatPercentChange(
            statistics.returnOrders?.percentIncrease || 0
          ),
        },
      ]
    : [
        { title: "Tổng doanh thu", amount: 0, change: "0%" },
        { title: "Doanh thu đơn mới đặt", amount: 0, change: "0%" },
        { title: "Doanh thu đơn đã giao", amount: 0, change: "0%" },
        { title: "Doanh thu đơn hoàn trả", amount: 0, change: "0%" },
      ];

  const bestSellers = dummyProducts.slice(0, 10);

  const [activeIndex, setActiveIndex] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isSmallScreen = windowWidth < 1024;
  const totalRevenue = stats[0]?.amount || 0;

  if (loading) {
    return (
      <div className="p-4 md:p-6 flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-6 flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-8">
      {/* Filter Date */}
      <div className="w-full flex flex-col md:flex-row md:justify-end gap-3 md:gap-6">
        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-600">Từ:</label>
          <input
            type="date"
            className="border px-3 py-1 rounded-md w-full md:w-auto"
            value={startDate}
            onChange={handleStartDateChange}
            max={todayString}
          />
        </div>
        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-600">Đến:</label>
          <input
            type="date"
            className="border px-3 py-1 rounded-md w-full md:w-auto"
            value={endDate}
            onChange={handleEndDateChange}
            max={todayString}
            min={startDate || undefined}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((item, idx) => (
          <div
            key={idx}
            className="bg-white shadow-md rounded-2xl p-4 flex flex-col justify-between"
          >
            <h3 className="text-gray-500 text-sm font-bold">{item.title}</h3>
            <p className="text-xl font-semibold">{formatVND(item.amount)}</p>
            <p
              className={`text-xs ${
                item.change.includes("-") ? "text-red-500" : "text-green-500"
              }`}
            >
              {item.change} so với kỳ trước
            </p>
          </div>
        ))}
      </div>

      {/* LineChart + Best Sellers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white shadow-md rounded-2xl p-4 lg:col-span-2">
          <h3 className="font-semibold mb-4">Biểu đồ doanh thu theo tháng</h3>
          <div className="w-full h-[250px] sm:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={formatYAxis} />
                <Tooltip formatter={(value) => formatVND(value)} />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#2563eb"
                  strokeWidth={3}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-2xl p-4">
          <h3 className="font-semibold mb-4">Sản phẩm bán chạy</h3>
          <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
            {bestSellers.map((p) => (
              <div key={p.id} className="flex items-center gap-3">
                <img
                  src={p.image[0]}
                  alt={p.name}
                  className="w-12 h-12 rounded-md object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium text-sm">{p.name}</p>
                  <p className="text-xs text-gray-500">{p.category}</p>
                </div>
                <p className="font-semibold text-sm">{formatVND(p.price)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-2xl p-4">
        <h3 className="font-semibold mb-4">Tỷ lệ doanh thu theo danh mục</h3>
        <div className="text-center md:pl-30 xl:pr-40">
          <h4 className="text-gray-600 text-sm font-semibold">
            Tổng doanh thu
          </h4>
          <p className="text-[18px] font-semibold">{formatVND(totalRevenue)}</p>
        </div>
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6">
          <div
            className={`w-full ${isSmallScreen ? "h-[350px]" : "h-[400px]"}`}
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryRevenue}
                  cx="50%"
                  cy="50%"
                  innerRadius={isSmallScreen ? 60 : "35%"}
                  outerRadius={isSmallScreen ? 100 : "65%"}
                  paddingAngle={3}
                  label={({ index }) =>
                    activeIndex === index
                      ? formatVND(categoryRevenue[index].value)
                      : `${(
                          (categoryRevenue[index].value / totalRevenue) *
                          100
                        ).toFixed(0)}%`
                  }
                  dataKey="value"
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  {categoryRevenue.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                      stroke="#fff"
                      strokeWidth={2}
                      outerRadius={
                        activeIndex === index
                          ? isSmallScreen
                            ? 110
                            : "70%"
                          : isSmallScreen
                          ? 100
                          : "65%"
                      }
                    />
                  ))}
                </Pie>

                <Legend
                  layout={isSmallScreen ? "horizontal" : "vertical"}
                  verticalAlign={isSmallScreen ? "bottom" : "middle"}
                  align={isSmallScreen ? "center" : "right"}
                />

                <Tooltip formatter={(value) => formatVND(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
