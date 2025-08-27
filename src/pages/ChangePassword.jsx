import React, { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/commons/Layout";
const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});

    const validatePassword = (password) => {
        if (password.length < 6 || password.length > 50) {
            return "Mật khẩu mới dài từ 6 đến 50 ký tự";
        }
        return null;
    };

    const validateForm = () => {
        const newErrors = {};

        if (!currentPassword.trim()) {
            newErrors.currentPassword = "Vui lòng nhập mật khẩu cũ";
        } else if (currentPassword !== "123456") { // Simulate wrong password
            newErrors.currentPassword = "Mật khẩu cũ không đúng";
        }


        if (!newPassword.trim()) {
            newErrors.newPassword = "Vui lòng nhập mật khẩu mới";
        } else {
            const passwordError = validatePassword(newPassword);
            if (passwordError) {
                newErrors.newPassword = passwordError;
            }
        }


        if (!confirmPassword.trim()) {
            newErrors.confirmPassword = "Vui lòng nhập xác nhận mật khẩu";
        } else if (newPassword !== confirmPassword) {
            newErrors.confirmPassword = "Xác nhận mật khẩu không khớp";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            alert("Đặt lại mật khẩu thành công!");

            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setErrors({});
        }
    };

    const handleInputChange = (field, value) => {
        if (errors[field]) {
            setErrors({ ...errors, [field]: null });
        }

        switch (field) {
            case 'currentPassword':
                setCurrentPassword(value);
                break;
            case 'newPassword':
                setNewPassword(value);
                break;
            case 'confirmPassword':
                setConfirmPassword(value);
                break;
        }
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
                                        className="block w-full text-left py-2 px-3 rounded transition-colors text-gray-700 hover:bg-gray-100"
                                    >
                                        ĐỔI MẬT KHẨU
                                    </Link>
                                    <Link to="#"
                                        className="block w-full text-left py-2 px-3 rounded transition-colors text-gray-700 hover:bg-gray-100"
                                    >
                                        Đơn hàng của bạn
                                    </Link>
                                    <Link to="/change-password" className="block w-full text-left py-3 px-4 rounded bg-[#ad7555]/10 text-[#ad7555] font-medium border-l-4 border-[#ad7555]">
                                        Đổi mật khẩu
                                    </Link>
                                    <Link to="#"
                                        className="block w-full text-left py-2 px-3 rounded transition-colors text-gray-700 hover:bg-gray-100"
                                    >
                                        Sổ địa chỉ (0)
                                    </Link>
                                </nav>
                            </div>
                        </div>

                        <div className="lg:w-4/5 pt-[2%] ">
                            <div className="p-1">
                                <div>
                                    <div className="flex flex-col lg:flex-row">
                                        <div className="mb-auto lg:w-1/2 ">
                                            <div className=" border-2 rounded-lg shadow-md bg-white">
                                                <div className="bg-[#ad7555] text-white px-6 py-4 rounded-t-lg">
                                                    <h2 className="text-xl font-semibold">ĐỔI MẬT KHẨU</h2>
                                                </div>
                                                <div className="p-[2%]">
                                                    <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6 rounded">
                                                        <p className="text-amber-800 text-sm">
                                                            Để đảm bảo tính bảo mật vui lòng đặt lại mật khẩu với ít nhất 8 kí tự

                                                        </p>
                                                    </div>

                                                    {(errors.newPassword === "Mật khẩu mới dài từ 6 đến 50 ký tự" || errors.confirmPassword === "Xác nhận mật khẩu không khớp") && (
                                                        <div className="text-red-600 text-sm space-y-1">
                                                            {errors.newPassword === "Mật khẩu mới dài từ 6 đến 50 ký tự" && (
                                                                <div>Mật khẩu mới dài từ 6 đến 50 ký tự</div>
                                                            )}
                                                            {errors.confirmPassword === "Xác nhận mật khẩu không khớp" && (
                                                                <div>Xác nhận mật khẩu không khớp</div>
                                                            )}
                                                        </div>
                                                    )}


                                                    <div className="space-y-4">
                                                        <div>
                                                            <label className="block text-gray-700 font-medium mb-2">
                                                                Mật khẩu cũ <span className="text-red-600">*</span>
                                                            </label>
                                                            <div className="relative max-w-[250px]">
                                                                <input
                                                                    type="password"
                                                                    value={currentPassword}
                                                                    onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                                                                    className={`w-full px-4 py-3 pr-12 bg-gray-100 border rounded-md focus:outline-none focus:ring-2 ${errors.currentPassword
                                                                        ? 'border-red-300 focus:ring-red-500'
                                                                        : 'border-gray-200 focus:ring-[#ad7555]'
                                                                        }`}
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={(e) => {
                                                                        const input = e.target.closest('div').querySelector('input');
                                                                        const icon = e.target.closest('button').querySelector('i');
                                                                        if (input.type === 'password') {
                                                                            input.type = 'text';
                                                                            icon.className = 'fas fa-eye-slash text-sm';
                                                                        } else {
                                                                            input.type = 'password';
                                                                            icon.className = 'fas fa-eye text-sm';
                                                                        }
                                                                    }}
                                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                                                                >
                                                                    <i className="fas fa-eye text-sm"></i>
                                                                </button>
                                                            </div>
                                                            {errors.currentPassword && (
                                                                <p className="text-red-600 text-sm mt-1">{errors.currentPassword}</p>
                                                            )}
                                                        </div>

                                                        <div>
                                                            <label className="block text-gray-700 font-medium mb-2">
                                                                Mật khẩu mới <span className="text-red-600">*</span>
                                                            </label>
                                                            <div className="relative max-w-[250px]">
                                                                <input
                                                                    type="password"
                                                                    value={newPassword}
                                                                    onChange={(e) => handleInputChange('newPassword', e.target.value)}
                                                                    className={`w-full px-4 py-3 pr-12 bg-gray-100 border rounded-md focus:outline-none focus:ring-2 ${errors.newPassword
                                                                        ? 'border-red-300 focus:ring-red-500'
                                                                        : 'border-gray-200 focus:ring-[#ad7555]'
                                                                        }`}
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={(e) => {
                                                                        const input = e.target.closest('div').querySelector('input');
                                                                        const icon = e.target.closest('button').querySelector('i');
                                                                        if (input.type === 'password') {
                                                                            input.type = 'text';
                                                                            icon.className = 'fas fa-eye-slash text-sm';
                                                                        } else {
                                                                            input.type = 'password';
                                                                            icon.className = 'fas fa-eye text-sm';
                                                                        }
                                                                    }}
                                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                                                                >
                                                                    <i className="fas fa-eye text-sm"></i>
                                                                </button>
                                                            </div>
                                                            {errors.newPassword && errors.newPassword !== "Mật khẩu mới dài từ 6 đến 50 ký tự" && (
                                                                <p className="text-red-600 text-sm mt-1">{errors.newPassword}</p>
                                                            )}
                                                        </div>

                                                        <div>
                                                            <label className="block text-gray-700 font-medium mb-2">
                                                                Xác nhận lại mật khẩu <span className="text-red-600">*</span>
                                                            </label>
                                                            <div className="relative max-w-[250px]">
                                                                <input
                                                                    type="password"
                                                                    value={confirmPassword}
                                                                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                                                    className={`w-full px-4 py-3 pr-12 bg-gray-100 border rounded-md focus:outline-none focus:ring-2 ${errors.confirmPassword
                                                                        ? 'border-red-300 focus:ring-red-500'
                                                                        : 'border-gray-200 focus:ring-[#ad7555]'
                                                                        }`}
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={(e) => {
                                                                        const input = e.target.closest('div').querySelector('input');
                                                                        const icon = e.target.closest('button').querySelector('i');
                                                                        if (input.type === 'password') {
                                                                            input.type = 'text';
                                                                            icon.className = 'fas fa-eye-slash text-sm';
                                                                        } else {
                                                                            input.type = 'password';
                                                                            icon.className = 'fas fa-eye text-sm';
                                                                        }
                                                                    }}
                                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                                                                >
                                                                    <i className="fas fa-eye text-sm"></i>
                                                                </button>
                                                            </div>
                                                            {errors.confirmPassword && errors.confirmPassword !== "Xác nhận mật khẩu không khớp" && (
                                                                <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>
                                                            )}
                                                        </div>

                                                        <button
                                                            onClick={handleSubmit}
                                                            className=" w-full px-6 bg-[#ad7555] text-white font-medium py-2.5 rounded-md border border-[#ad7555] lg:w-auto hover:bg-white hover:text-[#ad7555] transition duration-200 text-sm"
                                                        >
                                                            Đặt lại mật khẩu
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
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

export default ChangePassword;