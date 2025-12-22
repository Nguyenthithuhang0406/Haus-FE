import React, { useState, useEffect } from "react";
import {
  getOrderStatistics,
  getBestSellerProducts,
  getSaleByParentCategory,
} from "@/api/order";
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
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Best sellers state
  const [bestSellers, setBestSellers] = useState([]);
  const [bestSellersLoading, setBestSellersLoading] = useState(false);
  const [bestSellersPageNum, setBestSellersPageNum] = useState(1);
  const [bestSellersPageSize] = useState(10);
  const [bestSellersPagination, setBestSellersPagination] = useState({
    pageNum: 1,
    pageSize: 10,
    totalElement: 0,
    totalPages: 0,
  });

  const handleStartDateChange = (e) => {
    const value = e.target.value;
    setStartDate(value);
    if (endDate && value && value > endDate) setEndDate(value);
  };

  const handleEndDateChange = (e) => {
    const value = e.target.value;
    if (startDate && value && value < startDate) return;
    setEndDate(value);
  };

  // State cho saleGraph riêng
  const [saleGraph, setSaleGraph] = useState(null);
  // State cho categoryRevenue từ API
  const [categoryRevenue, setCategoryRevenue] = useState([]);

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

  // Fetch saleGraph riêng từ API order-by-month
  useEffect(() => {
    const fetchSaleGraph = async () => {
      try {
        const response = await getOrderStatistics();
        // response từ getOrderStatistics() đã là response.data từ axios
        // Nếu API trả về { status: 200, message: "...", data: { saleGraph: {...} } }
        // thì response sẽ là { status: 200, message: "...", data: { saleGraph: {...} } }
        // và response.data.saleGraph là saleGraph
        if (response?.data?.saleGraph) {
          setSaleGraph(response.data.saleGraph);
        } else if (response?.saleGraph) {
          // Fallback nếu format cũ (saleGraph ở root level)
          setSaleGraph(response.saleGraph);
        }
      } catch (err) {
        console.error("Error fetching sale graph:", err);
      }
    };

    fetchSaleGraph();
  }, []);

  // Fetch best sellers
  useEffect(() => {
    let isMounted = true;

    const fetchBestSellers = async () => {
      try {
        setBestSellersLoading(true);

        const response = await getBestSellerProducts(
          bestSellersPageNum,
          bestSellersPageSize
        );

        if (!isMounted) return;

        // Update dữ liệu mới
        setBestSellers(response.data.items || []);
        setBestSellersPagination((prev) => ({
          ...prev,
          ...(response.data.pageCustom || {}),
        }));
      } catch (err) {
        console.error("Error fetching best sellers:", err);
      } finally {
        if (isMounted) {
          setBestSellersLoading(false);
        }
      }
    };

    fetchBestSellers();

    return () => {
      isMounted = false;
    };
  }, [bestSellersPageNum, bestSellersPageSize]);

  // Fetch categoryRevenue từ API - luôn call API, kể cả khi chưa chọn ngày
  useEffect(() => {
    const fetchCategoryRevenue = async () => {
      try {
        // Truyền startDate và endDate (có thể là empty string hoặc undefined)
        const response = await getSaleByParentCategory(
          startDate || undefined,
          endDate || undefined
        );
        // response từ getSaleByParentCategory() đã là response.data từ axios
        // Nếu API trả về { status: 200, message: "...", data: {...} }
        // thì response sẽ là { status: 200, message: "...", data: {...} }
        // và response.data là object với key là "3.Phòng khách"
        // Kiểm tra cả response.data.data (nếu có) và response.data
        const categoryData =
          response?.data?.data || response?.data || response || {};

        console.log("Full response from API:", response);
        console.log("Category data:", categoryData);
        console.log("Number of categories:", Object.keys(categoryData).length);
        console.log("Category keys:", Object.keys(categoryData));

        // Transform dữ liệu từ API format sang format cho PieChart
        // Sử dụng Map để tránh trùng lặp tên (nếu có)
        const categoryMap = new Map();

        Object.keys(categoryData).forEach((key) => {
          // Loại bỏ số thứ tự và dấu chấm ở đầu (ví dụ: "3.Phòng khách" -> "Phòng khách")
          const name = key.replace(/^\d+\./, "").trim();
          const value = categoryData[key] || 0;

          // Nếu tên đã tồn tại, cộng dồn giá trị
          if (categoryMap.has(name)) {
            categoryMap.set(name, categoryMap.get(name) + value);
          } else {
            categoryMap.set(name, value);
          }
        });

        const transformedData = Array.from(categoryMap.entries())
          .map(([name, value]) => ({
            name: name,
            value: value,
          }))
          .filter((item) => item.value > 0) // Chỉ hiển thị danh mục có doanh thu > 0
          .sort((a, b) => b.value - a.value); // Sắp xếp theo doanh thu giảm dần

        console.log("Transformed data:", transformedData);
        console.log(
          "Number of categories after transform:",
          transformedData.length
        );

        setCategoryRevenue(transformedData);
      } catch (err) {
        console.error("Error fetching category revenue:", err);
        setCategoryRevenue([]);
      }
    };

    fetchCategoryRevenue();
  }, [startDate, endDate]);

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

  // Transform saleGraph data to chart format từ API riêng
  const chartData = saleGraph
    ? Object.keys(saleGraph)
        .sort((a, b) => parseInt(a) - parseInt(b))
        .map((month) => {
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
            sales: saleGraph[month] || 0,
          };
        })
    : [];

  // categoryRevenue đã được fetch từ API và lưu trong state

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

  const [activeIndex, setActiveIndex] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isSmallScreen = windowWidth < 1024;
  // Tính tổng doanh thu từ categoryRevenue (từ API)
  const totalRevenue =
    categoryRevenue.reduce((sum, item) => sum + (item.value || 0), 0) ||
    stats[0]?.amount ||
    0;

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
    <>
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
          opacity: 0;
        }
      `}</style>
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
            />
            {startDate && (
              <button
                onClick={() => setStartDate("")}
                className="text-gray-400 hover:text-red-600 text-sm"
                title="Xóa"
              >
                ✕
              </button>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">Đến:</label>
            <input
              type="date"
              className="border px-3 py-1 rounded-md w-full md:w-auto"
              value={endDate}
              onChange={handleEndDateChange}
              min={startDate || undefined}
            />
            {endDate && (
              <button
                onClick={() => setEndDate("")}
                className="text-gray-400 hover:text-red-600 text-sm"
                title="Xóa"
              >
                ✕
              </button>
            )}
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
            {bestSellers.length === 0 && !bestSellersLoading ? (
              <div className="text-center py-8 text-gray-500 min-h-[200px] flex items-center justify-center">
                Không có dữ liệu
              </div>
            ) : (
              <>
                <div className="relative h-[288px] overflow-hidden">
                  <div
                    className={`space-y-4 h-full overflow-y-auto pr-1 transition-opacity duration-300 ${
                      bestSellersLoading
                        ? "opacity-40 pointer-events-none"
                        : "opacity-100"
                    }`}
                  >
                    {bestSellers.map((p, index) => (
                      <div
                        key={`${p.id}-${bestSellersPageNum}`}
                        className="flex items-center gap-3 animate-fade-in"
                        style={{
                          animationDelay: bestSellersLoading
                            ? "0ms"
                            : `${index * 30}ms`,
                        }}
                      >
                        {p.image ? (
                          <img
                            src={p.image}
                            alt={p.productName}
                            className="w-12 h-12 rounded-md object-cover transition-transform duration-200 hover:scale-105 flex-shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-md bg-gray-200 flex items-center justify-center flex-shrink-0">
                            <span className="text-gray-400 text-xs">
                              No img
                            </span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {p.productName}
                          </p>
                          <p className="text-xs text-gray-500">
                            Đã bán:{" "}
                            {p.soldQuantity?.toLocaleString("vi-VN") || 0}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="font-semibold text-sm">
                            {formatVND(p.price)}
                          </p>
                          {p.discountPercent && (
                            <p className="text-xs text-red-500">
                              -{p.discountPercent}%
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  {bestSellersLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 backdrop-blur-sm z-10">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  )}
                </div>
                {/* Pagination */}
                {bestSellersPagination.totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <div className="text-sm text-gray-600">
                      Trang {bestSellersPageNum} /{" "}
                      {bestSellersPagination.totalPages}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          setBestSellersPageNum((prev) => Math.max(1, prev - 1))
                        }
                        disabled={
                          bestSellersPageNum === 1 || bestSellersLoading
                        }
                        className="px-3 py-1 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 active:scale-95 transition-all duration-200 ease-in-out"
                      >
                        Trước
                      </button>
                      <button
                        onClick={() =>
                          setBestSellersPageNum((prev) =>
                            Math.min(bestSellersPagination.totalPages, prev + 1)
                          )
                        }
                        disabled={
                          bestSellersPageNum >=
                            bestSellersPagination.totalPages ||
                          bestSellersLoading
                        }
                        className="px-3 py-1 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 active:scale-95 transition-all duration-200 ease-in-out"
                      >
                        Sau
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div className="bg-white shadow-md rounded-2xl p-4">
          <h3 className="font-semibold mb-4">Tỷ lệ doanh thu theo danh mục</h3>
          <div className="text-center md:pl-30 xl:pr-40">
            <h4 className="text-gray-600 text-sm font-semibold">
              Tổng doanh thu
            </h4>
            <p className="text-[18px] font-semibold">
              {formatVND(totalRevenue)}
            </p>
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
    </>
  );
};

export default DashboardPage;
