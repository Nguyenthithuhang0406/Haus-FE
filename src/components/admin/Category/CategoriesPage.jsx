import React, { useEffect, useState } from "react";
import { Search, Plus } from "lucide-react";

import CategoryTable from "./CategoryTable";
import CategoryForm from "./CategoryForm";
import DeleteModal from "./DeleteModal";
import ViewModal from "./ViewModal";
import Pagination from "./Pagination";
import {
  deleteCategory,
  getAllCategory,
  searchCategoryByName,
} from "@/api/category";
import axios from "axios";
import { toast } from "react-toastify";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [viewItem, setViewItem] = useState(null);

  const fetchCategories = async () => {
    try {
      const response = await getAllCategory();
      if (response.status === 200) {
        const flattenedCategories = response.data.flatMap((catParent) => {
          const childrens = catParent.subCategories.map((sub) => ({
            ...sub,
            parentName: catParent.categoryName,
            parentId: catParent.id,
          }));
          return [...childrens];
        });
        setCategories(flattenedCategories);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        switch (error.response.status) {
          case 500:
            toast.error("Lỗi hệ thống");
            break;
          default:
            toast.error("Đã xảy ra lỗi, vui lòng kiểm tra lại kết nối!");
        }
      }
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await getAllCategory();
        setRooms(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchRooms();
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [showForm]);

  // const filtered = categories.filter((c) =>
  //   c.name.toLowerCase().includes(search.toLowerCase())
  // );

  // const totalPages = Math.ceil(filtered.length / itemsPerPage);
  // const startIndex = (currentPage - 1) * itemsPerPage;
  // const currentItems = filtered.slice(startIndex, startIndex + itemsPerPage);

  const handleAddClick = () => {
    setEditId(null);
    setShowForm(true);
  };

  const handleEditClick = (cat) => {
    setEditId(cat.id);
    setShowForm(true);
  };

  const handleDelete = async () => {
    try {
      const response = await deleteCategory(deleteItem.id);
      if (response.status === 204) {
        toast.success("Xóa danh mục thành công");
        fetchCategories();
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        switch (error.response.status) {
          case 500:
            toast.error("Lỗi hệ thống");
            break;
          case 404:
            toast.error("Không tìm thấy danh mục");
            break;
          default:
            toast.error("Đã xảy ra lỗi, vui lòng kiểm tra lại kết nối!");
        }
      }
      console.log(error);
    }
    setDeleteItem(null);
  };

  const handleSearch = async () => {
    try {
      const response = await searchCategoryByName(search);
      if (response.status === 200) {
        // console.log(response.data);
        // const flattenedCategories = response.data.flatMap((catParent) => {
        //   const childrens = catParent.subCategories.map((sub) => ({
        //     ...sub,
        //     parentName: catParent.categoryName,
        //     parentId: catParent.id,
        //   }));
        //   return [...childrens];
        // });
        // setCategories(flattenedCategories);
        setCategories([response.data]);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        switch (error.response.status) {
          case 500:
            toast.error("Lỗi hệ thống");
            break;
          case 404:
            toast.error("Không tìm thấy danh mục");
            break;
          default:
            toast.error("Đã xảy ra lỗi, vui lòng kiểm tra lại kết nối!");
        }
      }
      console.log(error);
    }
  };

  useEffect(() => {
    if (search.trim() === "") {
      fetchCategories();
      return;
    }

    const delayDebounce = setTimeout(() => {
      setCurrentPage(1);
      handleSearch(search);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  return (
    <div className="px-6 w-full">
      {/* Thanh công cụ */}
      <div className="flex justify-between items-center mb-6 p-4 border border-gray-200 rounded-2xl shadow-sm bg-white">
        <div className="relative w-1/3">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Tìm kiếm danh mục..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            className="pl-9 pr-3 py-2 border border-gray-300 rounded-xl w-full focus:ring-2 focus:ring-gray-500 focus:border-gray-500 shadow-sm"
          />
        </div>

        <button
          onClick={handleAddClick}
          className="bg-[#ad7555] hover:bg-[#945f46] text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-md transition"
        >
          <Plus size={18} /> Thêm danh mục
        </button>
      </div>

      {/* Table */}
      <CategoryTable
        data={categories}
        onEdit={handleEditClick}
        onDelete={setDeleteItem}
        onView={setViewItem}
      />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={
          categories.length === 0
            ? 1
            : Math.ceil(categories.length / itemsPerPage)
        }
        setCurrentPage={setCurrentPage}
        totalItems={categories.length}
        currentItems={categories.length}
      />

      {/* Form Popup */}
      {showForm && (
        <CategoryForm
          editId={editId}
          rooms={rooms}
          onClose={() => setShowForm(false)}
        />
      )}

      {/* Delete Confirm Modal */}
      {deleteItem && (
        <DeleteModal
          item={deleteItem}
          onCancel={() => setDeleteItem(null)}
          onConfirm={handleDelete}
        />
      )}

      {/* View Detail Modal */}
      {viewItem && (
        <ViewModal
          item={viewItem}
          onClose={() => setViewItem(null)}
          categories={categories}
          setCategories={setCategories}
          rooms={rooms}
        />
      )}
    </div>
  );
}
