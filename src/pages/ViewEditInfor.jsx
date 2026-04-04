import React, { useEffect, useState } from "react";
import { getUserProfile, updateUserProfile, uploadAvatar } from "@/api/user";
import { toast } from "react-toastify";
import axios from "axios";
import SidebarProfile from "@/components/auth/SidebarProfile";
import avt from "@/assets/images/avt.jpg";
import { Select } from "antd";
import { formatDate, formatDateForApi } from "@/utils/function";
import { setCookie } from "@/utils/cookies";
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";

const ViewEditInfor = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "lan lam",
    email: "yirpng@gmail.com",
    phone: "+84325852874",
  });
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    dateOfBirth: "",
    gender: "OTHER",
  });
  const [errors, setErrors] = useState({});

  const fetchUser = async () => {
    try {
      const response = await getUserProfile();
      if (response.status === 200) {
        setUserInfo(response.data);
        setUserInfo((prev) => ({
          ...prev,
          avatar: response.data.avatarLink,
        }));
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        switch (error.response.status) {
          case 500:
            toast.error("Lỗi hệ thống");
            break;
          case 429:
            toast.error(
              "Bạn gửi yêu cầu quá nhiều lần. Vui lòng đợi một chút rồi thử lại.",
            );
            break;

          default:
            toast.error("Đã xảy ra lỗi, vui lòng kiểm tra lại kết nối!");
        }
      }
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
    setEditForm({
      firstName: userInfo.firstName || "",
      lastName: userInfo.lastName || "",
      email: userInfo.email || "",
      phone: userInfo.phone || "",
      dateOfBirth: userInfo.dateOfBirth ? formatDate(userInfo.dateOfBirth) : "",
      gender: userInfo.gender || "OTHER",
      password: "",
    });
    setErrors({});
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      dateOfBirth: "",
      gender: "OTHER",
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

    if (!editForm.firstName?.trim()) {
      newErrors.firstName = "Vui lòng nhập họ";
    }

    if (!editForm.lastName?.trim()) {
      newErrors.lastName = "Vui lòng nhập tên";
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
    }

    if (editForm.gender === null) {
      newErrors.gender = "Vui lòng chọn giới tính";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        const data = {
          passwordConfirm: editForm.password,
          firstName: editForm.firstName,
          lastName: editForm.lastName,
          email: editForm.email,
          phone: editForm.phone,
          dateOfBirth: editForm.dateOfBirth,
          gender: editForm.gender,
        };
        const response = await updateUserProfile(data);
        if (response.status === 200) {
          toast.success("Cập nhật thông tin thành công!");
          setUserInfo(response.data);
          setIsEditing(false);
          setCookie("email", response.data.email);

          setEditForm({
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            password: "",
            dateOfBirth: "",
            gender: "OTHER",
          });
          setErrors({});
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          switch (error.response.status) {
            case 500:
              toast.error("Lỗi hệ thống");
              break;
            case 400:
              toast.error("Dữ liệu không hợp lệ");
              break;
            case 401:
              toast.error("Bạn không có quyền truy cập");
              break;
            case 429:
              toast.error(
                "Bạn gửi yêu cầu quá nhiều lần. Vui lòng đợi một chút rồi thử lại.",
              );
              break;

            default:
              toast.error("Đã xảy ra lỗi, vui lòng kiểm tra lại kết nối!");
          }
        }
        console.log(error);
      }
    }
  };

  const handleInputChange = (field, value) => {
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
    setEditForm({ ...editForm, [field]: value });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserInfo({ ...userInfo, avatar: reader.result });
      };
      reader.readAsDataURL(file);

      try {
        const data = {
          avatar: file,
        };
        const response = await uploadAvatar(data);
        if (response.status === 200) {
          setUserInfo({ ...userInfo, avatar: response.data.avatarLink });
          toast.success("Cập nhật ảnh đại diện thành công!");
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          switch (error.response.status) {
            case 500:
              toast.error("Lỗi hệ thống");
              break;
            case 400:
              toast.error("Dữ liệu không hợp lệ");
              break;
            case 401:
              toast.error("Bạn không có quyền truy cập");
              break;
            case 429:
              toast.error(
                "Bạn gửi yêu cầu quá nhiều lần. Vui lòng đợi một chút rồi thử lại.",
              );
              break;

            default:
              toast.error("Đã xảy ra lỗi, vui lòng kiểm tra lại kết nối!");
          }
        }
        console.log(error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-[100px]">
      <div className="container mx-auto px-20 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <SidebarProfile />

          <div className="lg:w-4/5 pt-[2%] ">
            <div className=" border-2 rounded-lg shadow-md bg-white">
              <div className="bg-[#ad7555] text-white px-6 py-4 rounded-t-lg">
                <h2 className="text-xl font-semibold">THÔNG TIN TÀI KHOẢN</h2>
              </div>
              <div className="flex flex-col lg:flex-row gap-10 p-[2%]">
                <div className=" mx-auto lg:w-1/4">
                  <div className=" relative rounded-2xl overflow-hidden shadow-md">
                    <img
                      src={userInfo.avatar || avt}
                      alt="Uploaded"
                      className="w-full aspect-square object-cover rounded-lg"
                    />
                  </div>

                  <button className="mt-3 w-full px-6 bg-[#ad7555] text-white font-medium py-2.5 rounded-md border border-[#ad7555] hover:bg-white hover:text-[#ad7555] transition duration-200 text-sm">
                    <label htmlFor="fileInput" className="cursor-pointer">
                      Thay đổi ảnh
                      <input
                        type="file"
                        id="fileInput"
                        className="hidden"
                        onChange={(e) => handleFileChange(e)}
                      />
                    </label>
                  </button>
                </div>

                <div className="lg:w-3/4">
                  {!isEditing ? (
                    <div className="space-y-1">
                      <div className="grid grid-cols gap-6">
                        <div className="bg-gray-50 p-1 rounded-lg">
                          <span className="font-medium text-gray-700 block mb-1">
                            Họ:
                          </span>
                          <span className="text-gray-800 text-lg">
                            {userInfo.firstName}
                          </span>
                        </div>

                        <div className="bg-gray-50 p-1 rounded-lg">
                          <span className="font-medium text-gray-700 block mb-1">
                            Tên:
                          </span>
                          <span className="text-gray-800 text-lg">
                            {userInfo.lastName}
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
                        <div className="bg-gray-50 p-1 rounded-lg">
                          <span className="font-medium text-gray-700 block mb-1">
                            Ngày sinh:
                          </span>
                          <span className="text-gray-800">
                            {formatDate(userInfo.dateOfBirth)}
                          </span>
                        </div>
                        <div className="bg-gray-50 p-1 rounded-lg">
                          <span className="font-medium text-gray-700 block mb-1">
                            Giới tính:
                          </span>
                          <span className="text-gray-800">
                            {userInfo.gender === "MALE"
                              ? "Nam"
                              : userInfo.gender === "FEMALE"
                                ? "Nữ"
                                : "Khác"}
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
                            Họ <span className="text-red-600">*</span>
                          </label>
                          <input
                            type="text"
                            value={editForm.firstName}
                            onChange={(e) =>
                              handleInputChange("firstName", e.target.value)
                            }
                            className={`w-full px-4 py-3 bg-gray-50 border rounded-md focus:outline-none focus:ring-2 ${
                              errors.firstName
                                ? "border-red-300 focus:ring-red-500"
                                : "border-gray-200 focus:ring-[#ad7555]"
                            }`}
                          />
                          {errors.firstName && (
                            <p className="text-red-600 text-sm mt-1">
                              {errors.firstName}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-gray-700 font-medium mb-2">
                            Tên <span className="text-red-600">*</span>
                          </label>
                          <input
                            type="text"
                            value={editForm.lastName}
                            onChange={(e) =>
                              handleInputChange("lastName", e.target.value)
                            }
                            className={`w-full px-4 py-3 bg-gray-50 border rounded-md focus:outline-none focus:ring-2 ${
                              errors.lastName
                                ? "border-red-300 focus:ring-red-500"
                                : "border-gray-200 focus:ring-[#ad7555]"
                            }`}
                          />
                          {errors.lastName && (
                            <p className="text-red-600 text-sm mt-1">
                              {errors.lastName}
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
                            Ngày sinh
                          </label>
                          <input
                            type="date"
                            value={
                              editForm.dateOfBirth
                                ? editForm.dateOfBirth
                                    .split("/")
                                    .reverse()
                                    .join("-") // convert "dd/MM/yyyy" -> "yyyy-MM-dd" để hiển thị
                                : ""
                            }
                            onChange={(e) =>
                              handleInputChange(
                                "dateOfBirth",
                                formatDateForApi(e.target.value),
                              )
                            }
                            className={`w-full px-4 py-3 bg-gray-50 border rounded-md focus:outline-none focus:ring-2 ${
                              errors.dateOfBirth
                                ? "border-red-300 focus:ring-red-500"
                                : "border-gray-200 focus:ring-[#ad7555]"
                            }`}
                          />
                          {errors.dateOfBirth && (
                            <p className="text-red-600 text-sm mt-1">
                              {errors.dateOfBirth}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-gray-700 font-medium mb-2">
                            Giới tính <span className="text-red-600">*</span>
                          </label>
                          <Select
                            name="gender"
                            value={editForm.gender}
                            allowClear
                            placeholder="Chọn giới tính"
                            onChange={(value) =>
                              handleInputChange("gender", value)
                            }
                            className={`w-full h-[49px] bg-gray-50 border rounded-md focus:outline-none focus:ring-2 ${
                              errors.gender
                                ? "border-red-300 focus:ring-red-500"
                                : "border-gray-200 focus:ring-[#ad7555]"
                            }`}
                          >
                            <Select.Option value="OTHER">Khác</Select.Option>
                            <Select.Option value="MALE">Nam</Select.Option>
                            <Select.Option value="FEMALE">Nữ</Select.Option>
                          </Select>
                          {errors.gender && (
                            <p className="text-red-600 text-sm mt-1">
                              {errors.gender}
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
                              type={showPassword ? "text" : "password"}
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
                            {showPassword ? (
                              <IoEye
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 text-xl cursor-pointer"
                                onClick={() => setShowPassword(false)}
                              />
                            ) : (
                              <IoEyeOff
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 text-xl cursor-pointer"
                                onClick={() => setShowPassword(true)}
                              />
                            )}
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
  );
};

export default ViewEditInfor;
