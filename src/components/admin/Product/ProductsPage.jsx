import React, { useState } from "react";
import { dummyProducts } from "./dummyProducts";
import Toolbar from "./Toolbar";
import ProductTable from "./ProductTable";
import ProductFormModal from "./ProductFormModal";
import ProductViewModal from "./ProductViewModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

export default function ProductsPage() {
    const [products, setProducts] = useState(dummyProducts);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState(null);
    const [viewItem, setViewItem] = useState(null);
    const [deleteItem, setDeleteItem] = useState(null);

    const filtered = products.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const currentItems = filtered.slice(
        (currentPage - 1) * itemsPerPage,
        (currentPage - 1) * itemsPerPage + itemsPerPage
    );

    const handleDelete = () => {
        setProducts(products.filter((p) => p.id !== deleteItem.id));
        setDeleteItem(null);
    };

    return (
        <div className="px-6 w-full">
            {/* Toolbar */}
            <Toolbar
                search={search}
                setSearch={setSearch}
                setShowForm={setShowForm}
                setCurrentPage={setCurrentPage}
            />

            {/* Table */}
            <ProductTable
                products={currentItems}
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
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
                />
            )}

            {/* Delete Modal */}
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
