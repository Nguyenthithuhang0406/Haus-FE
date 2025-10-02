import React, { useEffect, useState } from "react";
import Toolbar from "./Toolbar";
import ProductTable from "./ProductTable";
import ProductFormModal from "./ProductFormModal";
import ProductViewModal from "./ProductViewModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import { deleteProduct, getAllProducts } from "@/api/product";
import axios from "axios";
import { toast } from "react-toastify";
import { Pagination } from "antd";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState({
    pageNum: 1,
    pageSize: 5,
    keyword: "",
  });
  const [total, setTotal] = useState({
    totalItems: 0,
    totalPages: 0,
  });

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [viewItem, setViewItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);

  const fetchProducts = async (data) => {
    try {
      const response = await getAllProducts(data);
      if (response.status === 200) {
        setProducts(response.data.items);
        setTotal({
          totalItems: response.data.pageCustom.totalElement,
          totalPages: response.data.pageCustom.totalPages,
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
    fetchProducts(search);
  }, [search.pageNum, search.pageSize, editId, showForm, deleteItem]);

  useEffect(() => {
    if (search.keyword.trim() === "") {
      fetchProducts({
        pageNum: 1,
        pageSize: 5,
        keyword: "",
        sortByPrice: "asc",
      });
      return;
    }

    const delayDebounce = setTimeout(() => {
      fetchProducts(search);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [search.keyword]);

  // Xoá sản phẩm
  const handleDelete = async () => {
    try {
      const response = await deleteProduct(deleteItem.id);
      if (response.status === 200) {
        toast.success("Xoá sản phẩm thành công");
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
    setProducts(products.filter((p) => p.id !== deleteItem.id));
    setDeleteItem(null);
    setViewItem(null);
  };

  return (
    <div className="px-4 w-full">
      {/* Toolbar */}
      <Toolbar
        search={search}
        setSearch={setSearch}
        setShowForm={setShowForm}
      />

      {/* Table */}
      <ProductTable
        products={products}
        currentPage={search.pageNum}
        totalPages={total.totalPages}
        setCurrentPage={(num) =>
          setSearch((prev) => ({ ...prev, pageNum: num }))
        }
        setViewItem={setViewItem}
        setEditId={setEditId}
        setShowForm={setShowForm}
        setDeleteItem={setDeleteItem}
      />

      {total.totalItems > 0 && (
        <div className="flex justify-end my-8">
          <Pagination
            current={search.pageNum}
            pageSize={search.pageSize}
            total={total.totalItems}
            showSizeChanger={false}
            showQuickJumper={false}
            onChange={(page) =>
              setSearch((prev) => ({
                ...prev,
                pageNum: Number(page),
              }))
            }
            onPageSizeChange={(current, size) =>
              setSearch((prev) => ({
                ...prev,
                pageSize: Number(size),
                pageNum: 1,
              }))
            }
          />
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <ProductFormModal
          setProducts={setProducts}
          editId={editId}
          setEditId={setEditId}
          setShowForm={setShowForm}
        />
      )}

      {/* View Modal */}
      {viewItem && (
        <ProductViewModal
          itemId={viewItem.id}
          setViewItem={setViewItem}
          setEditId={setEditId}
          setShowForm={setShowForm}
          setDeleteItem={setDeleteItem}
        />
      )}

      {/* Delete Modal sản phẩm */}
      {deleteItem && (
        <ConfirmDeleteModal
          item={deleteItem}
          onCancel={() => setDeleteItem(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
