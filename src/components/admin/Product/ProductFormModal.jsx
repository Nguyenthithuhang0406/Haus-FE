import React, { useState, useRef, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { X } from "lucide-react";

// Thêm CKEditor
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { ProductSchema } from "@/utils/validation/productValidation";
import { getAllCategoryChildren } from "@/api/category";
import axios from "axios";
import { toast } from "react-toastify";
import { createProduct, getProductById } from "@/api/product";

export default function ProductFormModal({
  products,
  editId,
  setEditId,
  setShowForm,
}) {
  const [previews, setPreviews] = useState([]);
  const fileInputRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [initialValues, setInitialValues] = useState({
    productName: "",
    categories: "",
    images: [],
    description: "",
    detailDescription: "",
    price: "",
  });

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (editId) {
        try {
          const response = await getProductById(editId);
          if (response.status === 200) {
            const imgs = response.data.medias?.map((m) => m.url) || [];
            setInitialValues({
              productName: response.data.productName || "",
              categories: response.data.categoriesName[0] || "",
              images: imgs,
              description: response.data.description || "",
              detailDescription: response.data.detailDescription || "",
              price: response.data.price || "",
            });
            setPreviews(imgs);
          }
        } catch (error) {
          if (axios.isAxiosError(error) && error.response) {
            switch (error.response.status) {
              case 500:
                toast.error("Lỗi hệ thống");
                break;
              case 404:
                toast.error("Không tìm thấy sản phẩm");
                break;
              default:
                toast.error("Đã xảy ra lỗi, vui lòng kiểm tra lại kết nối!");
            }
          }
          console.log(error);
        }
      }
    };
    fetchProductDetails();
  }, [editId]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategoryChildren();
        if (response.status === 200) {
          setCategories(response.data);
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          switch (error.response.status) {
            case 500:
              toast.error("Lỗi hệ thống");
              break;
            case 400:
              toast.error("Lấy danh mục thất bại, vui lòng thử lại!");
              break;
            case 404:
              toast.error("Lấy danh mục thất bại, vui lòng thử lại!");
              break;
            default:
              toast.error("Đã xảy ra lỗi, vui lòng kiểm tra lại kết nối!");
          }
        }
        console.log(error);
      }
    };
    fetchCategories();
  }, []);

  // Load ảnh sẵn khi sửa
  useEffect(() => {
    if (editId) {
      const product = products.find((p) => p.id === editId);
      if (product?.images) {
        setPreviews(product.images);
      }
    } else {
      setPreviews([]);
    }
  }, [editId, products]);

  const handleFileChange = (e, setFieldValue) => {
    const files = Array.from(e.target.files);
    const tempPreviews = [];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        tempPreviews.push(reader.result);
        if (tempPreviews.length === files.length) {
          const merged = [...previews, ...tempPreviews];
          setPreviews(merged);
          setFieldValue("images", files);
        }
      };
      reader.readAsDataURL(file);
    });
  };


  // Hàm xóa ảnh
  const removeImage = (idx, setFieldValue) => {
    const newPreviews = previews.filter((_, i) => i !== idx);
    setPreviews(newPreviews);
    setFieldValue("images", newPreviews);
  };

  const handleCreate = async (values) => {
    try {
      const data = {
        productName: values.productName,
        price: values.price,
        description: values.description,
        detailDescription: values.detailDescription,
        categories: [values.categories],
        images: values.images,
      };
      const response = await createProduct(data);
      if (response.status === 201) {
        toast.success("Thêm sản phẩm thành công!");
        setShowForm(false);
        setEditId(null);
        setPreviews([]);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        switch (error.response.status) {
          case 500:
            toast.error("Lỗi hệ thống");
            break;
          case 400:
            toast.error("Dữ liệu không hợp lệ!");
            break;
          case 404:
            toast.error("Thêm sản phẩm thất bại, vui lòng thử lại!");
            break;
          default:
            toast.error("Đã xảy ra lỗi, vui lòng kiểm tra lại kết nối!");
        }
      }
      console.log(error);
    }
  };

  const handleSubmit = async (values) => {
    console.log(values);
    if (editId) {
      console.log("edit");
    } else {
      await handleCreate(values);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50 p-4">
      <div className="bg-white pl-4 py-4 rounded-3xl shadow-2xl w-full max-w-[650px] max-h-[95vh] overflow-hidden animate-[fadeIn_0.25s_ease]">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 text-center">
          {editId ? "Sửa sản phẩm" : "Thêm sản phẩm"}
        </h2>

        {/* Nội dung form */}
        <div className="h-[calc(95vh-80px)] overflow-y-auto pr-3 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
          <Formik
            initialValues={initialValues}
            validationSchema={ProductSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ setFieldValue, values }) => (
              <Form className="grid gap-4 pb-3">
                {/* Tên sản phẩm */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên sản phẩm
                  </label>
                  <Field
                    name="productName"
                    className="border border-gray-200 focus:ring-1 focus:ring-gray-300 focus:border-gray-400 outline-none p-3 rounded-xl w-full"
                  />
                  <ErrorMessage
                    name="productName"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                {/* Danh mục */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Danh mục
                  </label>
                  <Field
                    as="select"
                    name="categories"
                    className="border border-gray-200 focus:ring-1 focus:ring-gray-300 focus:border-gray-400 outline-none p-3 rounded-xl w-full bg-white"
                  >
                    <option value="">-- Chọn danh mục --</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.categoryName}>
                        {c.categoryName}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="categories"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                {/* Mô tả ngắn */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mô tả ngắn
                  </label>
                  <Field
                    as="textarea"
                    rows={2}
                    name="description"
                    className="border border-gray-200 focus:ring-1 focus:ring-gray-300 focus:border-gray-400 outline-none p-3 rounded-xl w-full"
                  />
                  <div className="flex items-center justify-between mt-1">
                    <ErrorMessage
                      name="description"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                    <span
                      className={`text-sm ml-auto ${values.description.length > 900
                        ? "text-red-500"
                        : values.description.length > 700
                          ? "text-yellow-600"
                          : "text-gray-500"
                        }`}
                    >
                      {values.description?.length || 0} / 100
                    </span>
                  </div>
                </div>

                {/* Mô tả chi tiết với CKEditor */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mô tả chi tiết
                  </label>
                  <CKEditor
                    editor={ClassicEditor}
                    data={values.detailDescription}
                    config={{
                      toolbar: [
                        "bold",
                        "italic",
                        "underline",
                        "strikethrough",
                        "|",
                        "numberedList",
                        "bulletedList",
                        "|",
                        "alignment",
                        "link",
                        "undo",
                        "redo",
                      ],
                    }}
                    onChange={(event, editor) => {
                      const data = editor.getData();
                      setFieldValue("detailDescription", data);
                    }}
                  />
                  <div className="flex items-center justify-between mt-1">
                    <ErrorMessage
                      name="detailDescription"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                    <span
                      className={`text-sm ml-auto ${values.detailDescription.length > 1800
                        ? "text-red-500"
                        : values.detailDescription.length > 1500
                          ? "text-yellow-600"
                          : "text-gray-500"
                        }`}
                    >
                      {values.detailDescription?.length || 0} / 2000
                    </span>
                  </div>
                </div>

                {/* Giá + số lượng */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Giá
                    </label>
                    <Field
                      name="price"
                      type="number"
                      className="border border-gray-200 focus:ring-1 focus:ring-gray-300 focus:border-gray-400 outline-none p-3 rounded-xl w-full"
                    />
                    <ErrorMessage
                      name="price"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                </div>

                {/* Upload ảnh */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hình ảnh minh họa sản phẩm{" "}
                    {!editId && (
                      <span className="text-red-500">(Tối thiểu 2)</span>
                    )}
                  </label>

                  <div
                    className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-[#ad7555] transition"
                    onClick={() => fileInputRef.current.click()}
                  >
                    <input
                      ref={fileInputRef}
                      id="fileUpload"
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => handleFileChange(e, setFieldValue)}
                    />
                    <p className="text-gray-600 mb-2">
                      Kéo thả hoặc nhấn chọn để tải hình ảnh
                    </p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current.click();
                      }}
                      className="bg-[#ad7555] hover:bg-[#945f46] text-white px-6 py-2 rounded-lg font-medium "
                    >
                      Tải hình ảnh lên
                    </button>
                    <p className="text-xs text-gray-500 mt-2">
                      Hỗ trợ các định dạng: JPG, PNG, WEBP
                    </p>
                  </div>

                  <ErrorMessage
                    name="images"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />

                  <div className="flex gap-2 mt-3 flex-wrap">
                    {previews.map((src, idx) => (
                      <div key={idx} className="relative group">
                        <img
                          src={src}
                          alt={`preview-${idx}`}
                          className="w-28 h-28 object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(idx, setFieldValue)}
                          className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Nút hủy / lưu */}
                <div className="flex flex-col sm:flex-row justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditId(null);
                      setPreviews([]);
                    }}
                    className="px-5 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-100"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#ad7555] hover:bg-[#945f46] text-white rounded-xl shadow-md "
                  >
                    {editId ? "Cập nhật" : "Thêm mới"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
