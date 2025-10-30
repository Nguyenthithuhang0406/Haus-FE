import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

// Mock data tạm thời
const mockProvinces = [
    { code: "01", name: "Hà Nội" },
    { code: "79", name: "TP. Hồ Chí Minh" },
    { code: "48", name: "Đà Nẵng" },
    { code: "92", name: "Cần Thơ" }
];

const mockDistricts = {
    "01": [
        { code: "001", name: "Quận Ba Đình" },
        { code: "002", name: "Quận Hoàn Kiếm" },
        { code: "003", name: "Quận Tây Hồ" },
        { code: "004", name: "Quận Long Biên" }
    ],
    "79": [
        { code: "760", name: "Quận 1" },
        { code: "761", name: "Quận 2" },
        { code: "762", name: "Quận 3" },
        { code: "763", name: "Quận 4" }
    ]
};

const mockWards = {
    "001": [
        { code: "00001", name: "Phường Phúc Xá" },
        { code: "00002", name: "Phường Trúc Bạch" },
        { code: "00003", name: "Phường Vĩnh Phúc" },
        { code: "00004", name: "Phường Cống Vị" }
    ],
    "002": [
        { code: "00010", name: "Phường Hàng Trống" },
        { code: "00011", name: "Phường Hàng Bạc" },
        { code: "00012", name: "Phường Hàng Bài" },
        { code: "00013", name: "Phường Hàng Bồ" }
    ],
    "760": [
        { code: "26734", name: "Phường Bến Nghé" },
        { code: "26735", name: "Phường Bến Thành" },
        { code: "26736", name: "Phường Nguyễn Thái Bình" }
    ]
};

const getProvinces = async () => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(mockProvinces), 300);
    });
};

const getDistricts = async (provinceCode) => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(mockDistricts[provinceCode] || []), 300);
    });
};

const getWards = async (districtCode) => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(mockWards[districtCode] || []), 300);
    });
};

const validationSchema = Yup.object({
    name: Yup.string().required('Vui lòng nhập tên người nhận'),
    phoneNumber: Yup.string()
        .matches(/^[0-9]{10}$/, 'Số điện thoại phải có 10 chữ số')
        .required('Vui lòng nhập số điện thoại'),
    province: Yup.string().required('Vui lòng chọn tỉnh/thành phố'),
    district: Yup.string().required('Vui lòng chọn quận/huyện'),
    ward: Yup.string().required('Vui lòng chọn phường/xã'),
    detailedAddress: Yup.string().required('Vui lòng nhập địa chỉ chi tiết')
});

const AddAddressModal = ({ user, onAdd, onClose }) => {
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [selectedWard, setSelectedWard] = useState("");

    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await getProvinces();
                setProvinces(response);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách tỉnh thành:", error);
            }
        };
        fetchProvinces();
    }, []);

    useEffect(() => {
        const fetchDistricts = async () => {
            if (selectedProvince) {
                try {
                    const response = await getDistricts(selectedProvince);
                    setDistricts(response);
                } catch (error) {
                    console.error("Lỗi khi lấy danh sách quận huyện:", error);
                }
            }
        };
        fetchDistricts();
    }, [selectedProvince]);

    useEffect(() => {
        const fetchWards = async () => {
            if (selectedDistrict) {
                try {
                    const response = await getWards(selectedDistrict);
                    setWards(response);
                } catch (error) {
                    console.error("Lỗi khi lấy danh sách phường xã:", error);
                }
            }
        };
        fetchWards();
    }, [selectedDistrict]);

    const handleSubmit = (values) => {
        const fullAddress = `${values.detailedAddress}, ${wards.find(w => w.code.toString() === values.ward)?.name}, ${districts.find(d => d.code.toString() === values.district)?.name}, ${provinces.find(p => p.code.toString() === values.province)?.name}`;

        onAdd({
            name: values.name,
            phoneNumber: values.phoneNumber,
            address: fullAddress,
            city: provinces.find(p => p.code.toString() === values.province)?.name || "",
            state: districts.find(d => d.code.toString() === values.district)?.name || "",
            street: wards.find(w => w.code.toString() === values.ward)?.name || "",
            detailedAddress: values.detailedAddress
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50 px-4">
            <div className="bg-white p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-2xl w-full max-w-xl animate-[fadeIn_0.25s_ease]">
                <h2 className="text-xl md:text-2xl font-semibold mb-6 text-gray-800 text-center">
                    Thêm địa chỉ mới
                </h2>

                <Formik
                    initialValues={{
                        name: '',
                        phoneNumber: '',
                        province: "",
                        district: "",
                        ward: "",
                        detailedAddress: ""
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ errors, touched, setFieldValue }) => (
                        <Form className="max-h-[70vh] overflow-y-auto pr-2">
                            <div className="space-y-5">
                                {/* Hàng 1: Tên và Số điện thoại */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">
                                            Tên người nhận
                                        </label>
                                        <Field
                                            type="text"
                                            name="name"
                                            placeholder="Nhập tên người nhận..."
                                            className={`border ${errors.name && touched.name ? 'border-red-500' : 'border-[#ad7555]'} p-3 w-full rounded-xl focus:ring-2 focus:ring-[#ad7555]/30 focus:border-[#ad7555] outline-none shadow-sm text-sm md:text-base transition`}
                                        />
                                        <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1.5" />
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">
                                            Số điện thoại
                                        </label>
                                        <Field
                                            type="text"
                                            name="phoneNumber"
                                            placeholder="Nhập số điện thoại..."
                                            className={`border ${errors.phoneNumber && touched.phoneNumber ? 'border-red-500' : 'border-[#ad7555]'} p-3 w-full rounded-xl focus:ring-2 focus:ring-[#ad7555]/30 focus:border-[#ad7555] outline-none shadow-sm text-sm md:text-base transition`}
                                        />
                                        <ErrorMessage name="phoneNumber" component="div" className="text-red-500 text-sm mt-1.5" />
                                    </div>
                                </div>

                                {/* Hàng 2: Tỉnh/TP, Quận/Huyện, Phường/Xã */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">
                                            Tỉnh/Thành phố
                                        </label>
                                        <Field as="select"
                                            name="province"
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                setFieldValue('province', value);
                                                setFieldValue('district', '');
                                                setFieldValue('ward', '');
                                                setSelectedProvince(value);
                                                setSelectedDistrict("");
                                                setSelectedWard("");
                                            }}
                                            className={`border ${errors.province && touched.province ? 'border-red-500' : 'border-[#ad7555]'} p-3 w-full rounded-xl focus:ring-2 focus:ring-[#ad7555]/30 focus:border-[#ad7555] outline-none shadow-sm text-sm md:text-base transition`}
                                        >
                                            <option value="">Chọn tỉnh/thành phố</option>
                                            {provinces.map((province) => (
                                                <option key={province.code} value={province.code}>
                                                    {province.name}
                                                </option>
                                            ))}
                                        </Field>
                                        <ErrorMessage name="province" component="div" className="text-red-500 text-sm mt-1.5" />
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">
                                            Quận/Huyện
                                        </label>
                                        <Field as="select"
                                            name="district"
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                setFieldValue('district', value);
                                                setFieldValue('ward', '');
                                                setSelectedDistrict(value);
                                                setSelectedWard("");
                                            }}
                                            disabled={!selectedProvince}
                                            className={`border ${errors.district && touched.district ? 'border-red-500' : 'border-[#ad7555]'} p-3 w-full rounded-xl focus:ring-2 focus:ring-[#ad7555]/30 focus:border-[#ad7555] outline-none shadow-sm text-sm md:text-base transition disabled:bg-gray-100 disabled:cursor-not-allowed`}
                                        >
                                            <option value="">Chọn quận/huyện</option>
                                            {districts.map((district) => (
                                                <option key={district.code} value={district.code}>
                                                    {district.name}
                                                </option>
                                            ))}
                                        </Field>
                                        <ErrorMessage name="district" component="div" className="text-red-500 text-sm mt-1.5" />
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">
                                            Phường/Xã
                                        </label>
                                        <Field as="select"
                                            name="ward"
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                setFieldValue('ward', value);
                                                setSelectedWard(value);
                                            }}
                                            disabled={!selectedDistrict}
                                            className={`border ${errors.ward && touched.ward ? 'border-red-500' : 'border-[#ad7555]'} p-3 w-full rounded-xl focus:ring-2 focus:ring-[#ad7555]/30 focus:border-[#ad7555] outline-none shadow-sm text-sm md:text-base transition disabled:bg-gray-100 disabled:cursor-not-allowed`}
                                        >
                                            <option value="">Chọn phường/xã</option>
                                            {wards.map((ward) => (
                                                <option key={ward.code} value={ward.code}>
                                                    {ward.name}
                                                </option>
                                            ))}
                                        </Field>
                                        <ErrorMessage name="ward" component="div" className="text-red-500 text-sm mt-1.5" />
                                    </div>
                                </div>

                                {/* Hàng 3: Địa chỉ chi tiết */}
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">
                                        Địa chỉ chi tiết
                                    </label>
                                    <Field as="textarea"
                                        name="detailedAddress"
                                        placeholder="Nhập số nhà, tên đường..."
                                        rows="3"
                                        className={`border ${errors.detailedAddress && touched.detailedAddress ? 'border-red-500' : 'border-[#ad7555]'} p-3 w-full rounded-xl focus:ring-2 focus:ring-[#ad7555]/30 focus:border-[#ad7555] outline-none shadow-sm text-sm md:text-base transition resize-none`}
                                    />
                                    <ErrorMessage name="detailedAddress" component="div" className="text-red-500 text-sm mt-1.5" />
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex flex-col md:flex-row justify-end gap-3 mt-6 sticky bottom-0 bg-white pt-3">
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
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default AddAddressModal;