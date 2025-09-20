import React, { useState } from "react";
import { Search, Plus } from "lucide-react";
import { rooms, dummyData } from "../Category/dataCategory";

import CategoryTable from "./CategoryTable";
import CategoryForm from "./CategoryForm";
import DeleteModal from "./DeleteModal";
import ViewModal from "./ViewModal";
import Pagination from "./Pagination";

export default function CategoriesPage() {
    const [categories, setCategories] = useState(dummyData);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 7;

    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState(null);
    const [deleteItem, setDeleteItem] = useState(null);
    const [viewItem, setViewItem] = useState(null);

    const filtered = categories.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = filtered.slice(startIndex, startIndex + itemsPerPage);

    const handleAddClick = () => {
        setEditId(null);
        setShowForm(true);
    };

    const handleEditClick = (cat) => {
        setEditId(cat.id);
        setShowForm(true);
    };

    const handleDelete = () => {
        setCategories(categories.filter((c) => c.id !== deleteItem.id));
        setDeleteItem(null);
    };

    return (
        <div className="px-4 w-full">
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
                            setCurrentPage(1);
                        }}
                        className="pl-9 pr-3 py-2 border border-gray-100 rounded-xl w-full focus:ring-1 focus:ring-gray-300 focus:border-gray-400 outline-none shadow-sm"
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
                data={currentItems}
                onEdit={handleEditClick}
                onDelete={setDeleteItem}
                onView={setViewItem}
            />

            {/* Pagination */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
                totalItems={filtered.length}
                currentItems={currentItems.length}
            />

            {/* Form Popup */}
            {showForm && (
                <CategoryForm
                    editId={editId}
                    categories={categories}
                    setCategories={setCategories}
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
