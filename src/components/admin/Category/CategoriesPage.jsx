import React, { useEffect, useState } from "react";
import { Search, Plus } from "lucide-react";

import CategoryTable from "./CategoryTable";
import CategoryForm from "./CategoryForm";
import DeleteModal from "./DeleteModal";
import ViewModal from "./ViewModal";
import Pagination from "./Pagination";
import { deleteCategory, getAllCategory } from "@/api/category";
import axios from "axios";
import { toast } from "react-toastify";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [search, setSearch] = useState({
    pageNum: 1,
    pageSize: 7,
    keyword: "",
    sortByName: "",
  });
  const [pagi, setPagi] = useState({
    totalPage: 1,
    totalElement: 1,
  });

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [viewItem, setViewItem] = useState(null);

  const fetchCategories = async (data) => {
    try {
      const response = await getAllCategory(data);
      if (response.status === 200) {
        const flattenedCategories = response.data.items.flatMap((catParent) => {
          const childrens = catParent.subCategories.map((sub) => ({
            ...sub,
            parentName: catParent.categoryName,
            parentId: catParent.id,
          }));
          return [...childrens];
        });
        setCategories(flattenedCategories);
        setPagi({
          totalPage: response.data.pageCustom.totalPages,
          totalElement: response.data.pageCustom.totalElement,
        });
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
        const response = await getAllCategory({
          pageNum: 1,
          pageSize: 100,
          keyword: "",
          sortByName: "",
        });
        setRooms(response.data.items || []);
      } catch (error) {
        console.log(error);
      }
    };

    fetchRooms();
  }, []);

  useEffect(() => {
    fetchCategories({
      pageNum: search.pageNum,
      pageSize: search.pageSize,
      keyword: search.keyword,
      sortByName: search.sortByName,
    });
  }, [showForm, editId, deleteItem, viewItem, search.pageNum, search.pageSize]);

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
        fetchCategories({
          pageNum: search.pageNum,
          pageSize: search.pageSize,
          keyword: search.keyword,
          sortByName: search.sortByName,
        });
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

  useEffect(() => {
    if (search.keyword.trim() === "") {
      fetchCategories({ pageNum: 1, pageSize: 7, keyword: "", sortByName: "" });
      return;
    }

    const delayDebounce = setTimeout(() => {
      fetchCategories(search);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [search.keyword]);

  return (
    <div className="px-6 w-full">
      {/* Thanh công cụ */}
      <div className="flex justify-between items-center mb-6 p-4 border border-gray-200 rounded-2xl shadow-sm bg-white">
        <div className="relative w-1/3">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Tìm kiếm danh mục..."
            value={search.keyword}
            onChange={(e) => {
              setSearch({ ...search, keyword: e.target.value, pageNum: 1 });
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
        currentPage={search.pageNum}
        totalPages={pagi.totalPage}
        setCurrentPage={(pageNum) => setSearch({ ...search, pageNum })}
        totalItems={pagi.totalElement}
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
