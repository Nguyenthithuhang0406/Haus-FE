import React, { useState } from "react";
import { dummyProducts } from "./dummyProducts";
import Toolbar from "./Toolbar";
import ProductTable from "./ProductTable";
import ProductFormModal from "./ProductFormModal";
import ProductViewModal from "./ProductViewModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import ConfirmDeleteVariantModal from "./ConfirmDeleteVariantModal";

export default function ProductsPage() {
  const [products, setProducts] = useState(dummyProducts);
  const [search, setSearch] = useState("");
  const [pageNumber, setPageNumber] = useState(0);
  const itemsPerPage = 4;

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [viewItem, setViewItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);

  const [editVariant, setEditVariant] = useState(null);
  const [deleteVariant, setDeleteVariant] = useState(null);

  // Lọc & phân trang
  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );
  const pageCount = Math.ceil(filtered.length / itemsPerPage);
  const pagesVisited = pageNumber * itemsPerPage;
  const currentItems = filtered.slice(
    pagesVisited,
    pagesVisited + itemsPerPage
  );

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  // Xoá sản phẩm
  const handleDelete = () => {
    setProducts(products.filter((p) => p.id !== deleteItem.id));
    setDeleteItem(null);
    setViewItem(null);
  };

  // Sửa biến thể
  const handleEditVariant = (updatedVariant) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === viewItem.id) {
          return {
            ...p,
            variants: p.variants.map((v) =>
              v.id === updatedVariant.id ? updatedVariant : v
            ),
          };
        }
        return p;
      })
    );
    setEditVariant(null);
  };

  // Xoá biến thể
  const handleDeleteVariant = () => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === viewItem.id) {
          return {
            ...p,
            variants: p.variants.filter((v) => v.id !== deleteVariant.id),
          };
        }
        return p;
      })
    );
    setDeleteVariant(null);
  };

  return (
    <div className="px-4 w-full">
      {/* Toolbar */}
      <Toolbar
        search={search}
        setSearch={setSearch}
        setShowForm={setShowForm}
        setCurrentPage={() => setPageNumber(0)} // reset về trang 1 khi search
      />

      {/* Table */}
      <ProductTable
        products={currentItems}
        pageCount={pageCount}
        changePage={changePage}
        setViewItem={setViewItem}
        setEditId={setEditId}
        setShowForm={setShowForm}
        setDeleteItem={setDeleteItem}
      />

      {/* Form Modal */}
      {showForm && (
        <ProductFormModal
          products={products}
          setProducts={setProducts}
          editId={editId}
          setEditId={setEditId}
          setShowForm={setShowForm}
        />
      )}

      {/* View Modal */}
      {viewItem && (
        <ProductViewModal
          item={viewItem}
          setViewItem={setViewItem}
          setEditId={setEditId}
          setShowForm={setShowForm}
          setDeleteItem={setDeleteItem}
          editVariant={editVariant}
          setEditVariant={setEditVariant}
          deleteVariant={deleteVariant}
          setDeleteVariant={setDeleteVariant}
          handleEditVariant={handleEditVariant}
          handleDeleteVariant={handleDeleteVariant}
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

      {/* Delete Modal biến thể */}
      {deleteVariant && (
        <ConfirmDeleteVariantModal
          item={deleteVariant}
          onCancel={() => setDeleteVariant(null)}
          onConfirm={handleDeleteVariant}
        />
      )}
    </div>
  );
}
