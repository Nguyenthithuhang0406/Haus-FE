import React, { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/commons/Layout";
const ViewEditInfor = () => {
  const CURRENT_USER_PASSWORD = "123456"; // Thay đổi mật khẩu

  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "lan lam",
    email: "yirpng@gmail.com",
    phone: "+84325852874",
  });
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const handleEditClick = () => {
    setIsEditing(true);
    setEditForm({
      name: userInfo.name,
      email: userInfo.email,
      phone: userInfo.phone,
      password: "",
    });
    setErrors({});
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({
      name: "",
      email: "",
      phone: "",
      password: "",
    });
    setErrors({});
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[+]?[0-9]{10,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ""));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!editForm.name.trim()) {
      newErrors.name = "Vui lòng nhập họ tên";
    }

    if (!editForm.email.trim()) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!validateEmail(editForm.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!editForm.phone.trim()) {
      newErrors.phone = "Vui lòng nhập số điện thoại";
    } else if (!validatePhone(editForm.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }

    if (!editForm.password.trim()) {
      newErrors.password = "Vui lòng nhập mật khẩu để xác nhận";
    } else if (editForm.password !== CURRENT_USER_PASSWORD) {
      newErrors.password = "Mật khẩu không đúng";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      setUserInfo({
        name: editForm.name,
        email: editForm.email,
        phone: editForm.phone,
      });
      setIsEditing(false);
      alert("Cập nhật thông tin thành công!");
      setEditForm({
        name: "",
        email: "",
        phone: "",
        password: "",
      });
      setErrors({});
    }
  };

  const handleInputChange = (field, value) => {
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
    setEditForm({ ...editForm, [field]: value });
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 pt-[100px]">
        <div className="container mx-auto px-20 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="pl-[2%] pt-[2%] lg:w-1/5 ">
              <div className="p-1 border-b-2 lg:border-b-0 lg:border-r-2">
                <nav className="space-y-2">
                  <Link
                    to="/view-infor"
                    className="block w-full text-left py-3 px-4 rounded bg-[#ad7555]/10 text-[#ad7555] font-medium border-l-4 border-[#ad7555]"
                  >
                    Thông tin tài khoản
                  </Link>
                  <Link
                    to="#"
                    className="block w-full text-left py-2 px-3 rounded transition-colors text-gray-700 hover:bg-gray-100"
                  >
                    Đơn hàng của bạn
                  </Link>
                  <Link
                    to="/change-password"
                    className="block w-full text-left py-2 px-3 rounded transition-colors text-gray-700 hover:bg-gray-100"
                  >
                    Đổi mật khẩu
                  </Link>
                  <Link
                    to="#"
                    className="block w-full text-left py-2 px-3 rounded transition-colors text-gray-700 hover:bg-gray-100"
                  >
                    Sổ địa chỉ (0)
                  </Link>
                </nav>
              </div>
            </div>

            <div className="lg:w-4/5 pt-[2%] ">
              <div className=" border-2 rounded-lg shadow-md bg-white">
                <div className="bg-[#ad7555] text-white px-6 py-4 rounded-t-lg">
                  <h2 className="text-xl font-semibold">THÔNG TIN TÀI KHOẢN</h2>
                </div>
                <div className="flex flex-col lg:flex-row gap-10 p-[2%]">
                  <div className=" mx-auto lg:w-1/4">
                    <div className=" relative rounded-2xl overflow-hidden shadow-md">
                      <img
                        src="avt_img\avt.jpg"
                        alt="Uploaded"
                        className="w-full aspect-square object-cover rounded-lg"
                      />
                    </div>

                    <button className="mt-3 w-full px-6 bg-[#ad7555] text-white font-medium py-2.5 rounded-md border border-[#ad7555] hover:bg-white hover:text-[#ad7555] transition duration-200 text-sm">
                      Cập nhật ảnh
                    </button>
                  </div>

                  <div className="lg:w-3/4">
                    {!isEditing ? (
                      <div className="space-y-1">
                        <div className="grid grid-cols gap-6">
                          <div className="bg-gray-50 p-1 rounded-lg">
                            <span className="font-medium text-gray-700 block mb-1">
                              Họ tên:
                            </span>
                            <span className="text-gray-800 text-lg">
                              {userInfo.name}
                            </span>
                          </div>
                          <div className="bg-gray-50 p-1 rounded-lg">
                            <span className="font-medium text-gray-700 block mb-1">
                              Email:
                            </span>
                            <span className="text-gray-800">
                              {userInfo.email}
                            </span>
                          </div>
                          <div className="bg-gray-50 p-1 rounded-lg">
                            <span className="font-medium text-gray-700 block mb-1">
                              Điện thoại:
                            </span>
                            <span className="text-gray-800">
                              {userInfo.phone}
                            </span>
                          </div>
                        </div>

                        <div className="pt-4">
                          <button
                            onClick={handleEditClick}
                            className="w-full px-8 py-2.5 bg-[#ad7555] text-white font-medium rounded-md border border-[#ad7555] lg:w-auto hover:bg-white hover:text-[#ad7555] transition duration-200"
                          >
                            Sửa thông tin
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6 rounded">
                          <p className="text-amber-800 text-sm">
                            Vui lòng nhập mật khẩu hiện tại để xác nhận thay đổi
                            thông tin
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-gray-700 font-medium mb-2">
                              Họ tên <span className="text-red-600">*</span>
                            </label>
                            <input
                              type="text"
                              value={editForm.name}
                              onChange={(e) =>
                                handleInputChange("name", e.target.value)
                              }
                              className={`w-full px-4 py-3 bg-gray-50 border rounded-md focus:outline-none focus:ring-2 ${
                                errors.name
                                  ? "border-red-300 focus:ring-red-500"
                                  : "border-gray-200 focus:ring-[#ad7555]"
                              }`}
                            />
                            {errors.name && (
                              <p className="text-red-600 text-sm mt-1">
                                {errors.name}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-gray-700 font-medium mb-2">
                              Email <span className="text-red-600">*</span>
                            </label>
                            <input
                              type="email"
                              value={editForm.email}
                              onChange={(e) =>
                                handleInputChange("email", e.target.value)
                              }
                              className={`w-full px-4 py-3 bg-gray-50 border rounded-md focus:outline-none focus:ring-2 ${
                                errors.email
                                  ? "border-red-300 focus:ring-red-500"
                                  : "border-gray-200 focus:ring-[#ad7555]"
                              }`}
                            />
                            {errors.email && (
                              <p className="text-red-600 text-sm mt-1">
                                {errors.email}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-gray-700 font-medium mb-2">
                              Điện thoại <span className="text-red-600">*</span>
                            </label>
                            <input
                              type="text"
                              value={editForm.phone}
                              onChange={(e) =>
                                handleInputChange("phone", e.target.value)
                              }
                              className={`w-full px-4 py-3 bg-gray-50 border rounded-md focus:outline-none focus:ring-2 ${
                                errors.phone
                                  ? "border-red-300 focus:ring-red-500"
                                  : "border-gray-200 focus:ring-[#ad7555]"
                              }`}
                            />
                            {errors.phone && (
                              <p className="text-red-600 text-sm mt-1">
                                {errors.phone}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-gray-700 font-medium mb-2">
                              Mật khẩu hiện tại{" "}
                              <span className="text-red-600">*</span>
                            </label>
                            <div className="relative">
                              <input
                                type="password"
                                value={editForm.password}
                                onChange={(e) =>
                                  handleInputChange("password", e.target.value)
                                }
                                className={`w-full px-4 py-3 pr-12 bg-gray-50 border rounded-md focus:outline-none focus:ring-2 ${
                                  errors.password
                                    ? "border-red-300 focus:ring-red-500"
                                    : "border-gray-200 focus:ring-[#ad7555]"
                                }`}
                                placeholder="Nhập mật khẩu để xác nhận"
                              />
                              <button
                                type="button"
                                onClick={(e) => {
                                  const input = e.target
                                    .closest("div")
                                    .querySelector("input");
                                  const icon = e.target
                                    .closest("button")
                                    .querySelector("i");
                                  if (input.type === "password") {
                                    input.type = "text";
                                    icon.className = "fas fa-eye-slash text-lg";
                                  } else {
                                    input.type = "password";
                                    icon.className = "fas fa-eye text-lg";
                                  }
                                }}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                              >
                                <i className="fas fa-eye text-lg"></i>
                              </button>
                            </div>
                            {errors.password && (
                              <p className="text-red-600 text-sm mt-1">
                                {errors.password}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-4 mt-6">
                          <button
                            onClick={handleSubmit}
                            className="px-6 bg-[#ad7555] text-white font-medium py-2.5 rounded-md border border-[#ad7555] hover:bg-white hover:text-[#ad7555] transition duration-200 text-sm"
                          >
                            Cập nhật thông tin
                          </button>
                          <button
                            onClick={handleCancel}
                            className="px-6 bg-gray-500 text-white font-medium py-2.5 rounded-md border border-gray-500 hover:bg-white hover:text-gray-500 transition duration-200 text-sm"
                          >
                            Hủy
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ViewEditInfor;
