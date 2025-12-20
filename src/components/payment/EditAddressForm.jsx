/* eslint-disable */
import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import {
  getAddressById,
  getDistricts,
  getProvinces,
  getWards,
  updateAddressById,
} from "@/api/address";
import { addressSchema } from "@/utils/validation/addressValidation";
import { toast } from "react-toastify";

const EditAddressForm = ({ addressId, onClose }) => {
  const [provinces, setProvinces] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [wards, setWards] = useState([]);
  const [selectedWard, setSelectedWard] = useState("");
  const [initialValues, setInitialValues] = useState({
    name: "",
    phoneNumber: "",
    province: "",
    district: "",
    ward: "",
    detailedAddress: "",
  });

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

  useEffect(() => {
    const fetchAddressDetails = async () => {
      if (provinces && provinces.length > 0) {
        try {
          const response = await getAddressById(addressId);
          if (response.status === 200) {
            setSelectedProvince(
              provinces?.find((p) => p.name === response.data.city)?.code
            );
            if (districts && districts.length > 0) {
              setSelectedDistrict(
                districts?.find((d) => d.name === response.data.district)?.code
              );
            }
            const data = {
              name: response.data.recipientName,
              phoneNumber: response.data.phoneNumber,
              country: response.data.country,
              province: provinces?.find((p) => p.name === response.data.city)
                ?.code,
              district: districts?.find(
                (d) => d.name === response.data.district
              )?.code,
              ward: wards?.find((w) => w.name === response.data.commune)?.code,
              detailedAddress: response.data.detailAddress,
            };
            setInitialValues(data);
          }
        } catch (error) {
          console.log("Error in get detail address:", error);
        }
      }
    };
    fetchAddressDetails();
  }, [addressId, wards, districts, provinces]);

  const handleSubmit = async (values) => {
    try {
      const data = {
        id: addressId,
        recipientName: values.name,
        phoneNumber: values.phoneNumber,
        country: "Việt Nam",
        city:
          provinces.find((p) => p.code.toString() === values.province.toString())?.name ||
          "",
        district:
          districts.find((d) => d.code.toString() === values.district.toString())?.name ||
          "",
        commune:
          wards.find((w) => w.code.toString() === values.ward.toString())?.name || "",
        detailAddress: values.detailedAddress,
      };

      const response = await updateAddressById(data);
      if (response.status === 200) {
        toast.success("Cập nhật địa chỉ thành công!");
        onClose();
      }
    } catch (error) {
      toast.error("Cập nhật địa chỉ thất bại!", error);
    }
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50 px-4">
      <div className="bg-white p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-2xl w-full max-w-xl animate-[fadeIn_0.25s_ease]">
        <h2 className="text-xl md:text-2xl font-semibold mb-6 text-gray-800 text-center">
          Chỉnh sửa địa chỉ
        </h2>

        <Formik
          initialValues={initialValues}
          validationSchema={addressSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ errors, touched, setFieldValue }) => (
            <Form className="max-h-[70vh] overflow-y-auto pr-2">
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Tên người nhận
                    </label>
                    <Field
                      type="text"
                      name="name"
                      placeholder="Nhập tên người nhận..."
                      className={`border ${
                        errors.name && touched.name
                          ? "border-red-500"
                          : "border-[#ad7555]"
                      } p-3 w-full rounded-xl focus:ring-2 focus:ring-[#ad7555]/30 focus:border-[#ad7555] outline-none shadow-sm text-sm md:text-base transition`}
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-red-500 text-sm mt-1.5"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Số điện thoại
                    </label>
                    <Field
                      type="text"
                      name="phoneNumber"
                      placeholder="Nhập số điện thoại..."
                      className={`border ${
                        errors.phoneNumber && touched.phoneNumber
                          ? "border-red-500"
                          : "border-[#ad7555]"
                      } p-3 w-full rounded-xl focus:ring-2 focus:ring-[#ad7555]/30 focus:border-[#ad7555] outline-none shadow-sm text-sm md:text-base transition`}
                    />
                    <ErrorMessage
                      name="phoneNumber"
                      component="div"
                      className="text-red-500 text-sm mt-1.5"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Tỉnh/Thành phố
                    </label>
                    <Field
                      as="select"
                      name="province"
                      onChange={(e) => {
                        const value = e.target.value;
                        setFieldValue("province", value);
                        setFieldValue("district", "");
                        setFieldValue("ward", "");
                        setSelectedProvince(value);
                        setSelectedDistrict("");
                        setSelectedWard("");
                      }}
                      className={`border ${
                        errors.province && touched.province
                          ? "border-red-500"
                          : "border-[#ad7555]"
                      } p-3 w-full rounded-xl focus:ring-2 focus:ring-[#ad7555]/30 focus:border-[#ad7555] outline-none shadow-sm text-sm md:text-base transition`}
                    >
                      <option value="">Chọn tỉnh/thành phố</option>
                      {provinces.map((province) => (
                        <option key={province.code} value={province.code}>
                          {province.name}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="province"
                      component="div"
                      className="text-red-500 text-sm mt-1.5"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Quận/Huyện
                    </label>
                    <Field
                      as="select"
                      name="district"
                      onChange={(e) => {
                        const value = e.target.value;
                        setFieldValue("district", value);
                        setFieldValue("ward", "");
                        setSelectedDistrict(value);
                        setSelectedWard("");
                      }}
                      disabled={!selectedProvince}
                      className={`border ${
                        errors.district && touched.district
                          ? "border-red-500"
                          : "border-[#ad7555]"
                      } p-3 w-full rounded-xl focus:ring-2 focus:ring-[#ad7555]/30 focus:border-[#ad7555] outline-none shadow-sm text-sm md:text-base transition disabled:bg-gray-100 disabled:cursor-not-allowed`}
                    >
                      <option value="">Chọn quận/huyện</option>
                      {districts.map((district) => (
                        <option key={district.code} value={district.code}>
                          {district.name}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="district"
                      component="div"
                      className="text-red-500 text-sm mt-1.5"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Phường/Xã
                    </label>
                    <Field
                      as="select"
                      name="ward"
                      onChange={(e) => {
                        const value = e.target.value;
                        setFieldValue("ward", value);
                        setSelectedWard(value);
                      }}
                      disabled={!selectedDistrict}
                      className={`border ${
                        errors.ward && touched.ward
                          ? "border-red-500"
                          : "border-[#ad7555]"
                      } p-3 w-full rounded-xl focus:ring-2 focus:ring-[#ad7555]/30 focus:border-[#ad7555] outline-none shadow-sm text-sm md:text-base transition disabled:bg-gray-100 disabled:cursor-not-allowed`}
                    >
                      <option value="">Chọn phường/xã</option>
                      {wards.map((ward) => (
                        <option key={ward.code} value={ward.code}>
                          {ward.name}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="ward"
                      component="div"
                      className="text-red-500 text-sm mt-1.5"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Địa chỉ chi tiết
                  </label>
                  <Field
                    as="textarea"
                    name="detailedAddress"
                    placeholder="Nhập số nhà, tên đường..."
                    rows="3"
                    className={`border ${
                      errors.detailedAddress && touched.detailedAddress
                        ? "border-red-500"
                        : "border-[#ad7555]"
                    } p-3 w-full rounded-xl focus:ring-2 focus:ring-[#ad7555]/30 focus:border-[#ad7555] outline-none shadow-sm text-sm md:text-base transition resize-none`}
                  />
                  <ErrorMessage
                    name="detailedAddress"
                    component="div"
                    className="text-red-500 text-sm mt-1.5"
                  />
                </div>
              </div>
              <div className="flex flex-col md:flex-row justify-end gap-3 mt-3 sticky bottom-0 bg-white pt-3">
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

export default EditAddressForm;
