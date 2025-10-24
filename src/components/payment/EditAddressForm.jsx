import React from "react";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
    name: Yup.string().required('Vui lòng nhập tên người nhận'),
    phoneNumber: Yup.string()
        .matches(/^[0-9]{10}$/, 'Số điện thoại phải có 10 chữ số')
        .required('Vui lòng nhập số điện thoại'),
    address: Yup.string().required('Vui lòng nhập địa chỉ')
});

const EditAddressForm = ({ addressData, onUpdate, onClose }) => {
    const handleSubmit = (values) => {
        onUpdate({
            name: values.name,
            phoneNumber: values.phoneNumber,
            address: values.address
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50 px-4">
            <div className="bg-white p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-2xl w-full max-w-md md:max-w-lg animate-[fadeIn_0.25s_ease]">
                <h2 className="text-xl md:text-2xl font-semibold mb-6 text-gray-800 text-center">
                    Chỉnh sửa địa chỉ
                </h2>

                <Formik
                    initialValues={{
                        name: addressData.name,
                        phoneNumber: addressData.phoneNumber,
                        address: addressData.address
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ errors, touched }) => (
                        <Form className="space-y-5">
                            {/* Tên người nhận */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">
                                    Tên người nhận
                                </label>
                                <Field
                                    type="text"
                                    name="name"
                                    placeholder="Nhập tên người nhận..."
                                    className={`border ${errors.name && touched.name ? 'border-red-500' : 'border-[#ad7555]'} p-3 w-full rounded-xl focus:ring-1 focus:ring-gray-300 focus:border-gray-400 outline-none shadow-sm text-sm md:text-base transition`}
                                />
                                <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            {/* Số điện thoại */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">
                                    Số điện thoại
                                </label>
                                <Field
                                    type="text"
                                    name="phoneNumber"
                                    placeholder="Nhập số điện thoại..."
                                    className={`border ${errors.phoneNumber && touched.phoneNumber ? 'border-red-500' : 'border-[#ad7555]'} p-3 w-full rounded-xl focus:ring-1 focus:ring-gray-300 focus:border-gray-400 outline-none shadow-sm text-sm md:text-base transition`}
                                />
                                <ErrorMessage name="phoneNumber" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            {/* Địa chỉ */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">
                                    Địa chỉ
                                </label>
                                <Field
                                    type="text"
                                    name="address"
                                    placeholder="Nhập địa chỉ..."
                                    className={`border ${errors.address && touched.address ? 'border-red-500' : 'border-[#ad7555]'} p-3 w-full rounded-xl focus:ring-1 focus:ring-gray-300 focus:border-gray-400 outline-none shadow-sm text-sm md:text-base transition`}
                                />
                                <ErrorMessage name="address" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            {/* Buttons */}
                            <div className="flex flex-col md:flex-row justify-between gap-3 mt-3">
                                
                                <div className="flex flex-col md:flex-row gap-3">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="px-4 py-2.5 border border-gray-400 rounded-xl hover:bg-gray-100 transition shadow-sm text-sm md:text-base"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2.5 bg-[#ad7555] text-white rounded-xl shadow-md hover:bg-[#945f46] hover:shadow-lg hover:scale-[1.02] transition text-sm md:text-base"
                                    >
                                        Lưu
                                    </button>
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default EditAddressForm;