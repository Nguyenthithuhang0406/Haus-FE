import React, { useState, useEffect } from "react";
import Layout from "@/components/commons/Layout";
import ProductItem from "@/components/product/ProductItem";
import WishListHeader from "@/components/wishlist/WishListHeader";
import EmptyWishList from "@/components/wishlist/EmptyWishList";
import PaginationComponent from "@/components/wishlist/Panigation";
import { useNavigate } from "react-router-dom";
import { isLoggedIn } from "@/utils/checkLogin";
import { getFavoriteProducts, syncFavoritesAfterLogin, deleteFavoriteProduct } from "@/api/favorite";

const WishList = () => {
    const navigate = useNavigate();
    const [likeProducts, setLikeProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(8);
    const [totalItems, setTotalItems] = useState(0);

    // Load wishlist
    const loadLikeProducts = async (page = 1) => {
        setLoading(true);

        if (!isLoggedIn()) {
            const localFav = JSON.parse(localStorage.getItem("likeProducts")) || [];
            setLikeProducts(localFav);
            setTotalItems(localFav.length);
            setLoading(false);
        } else {
            // Sync localStorage lên server
            await syncFavoritesAfterLogin();

            try {
                const res = await getFavoriteProducts(page, pageSize);
                const products = Array.isArray(res.data) ? res.data : Array.isArray(res.data?.data) ? res.data.data : [];
                setLikeProducts(products);
                setTotalItems(res.data?.total || products.length);
            } catch (err) {
                console.error("Load favorite products failed:", err);
                setLikeProducts([]);
                setTotalItems(0);
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        loadLikeProducts(currentPage);
    }, [currentPage]);

    const handleRemoveFavorite = (productId) => {
        if (!isLoggedIn()) {
            const localFav = JSON.parse(localStorage.getItem("likeProducts")) || [];
            const updated = localFav.filter((p) => p.id !== productId);
            localStorage.setItem("likeProducts", JSON.stringify(updated));
            setLikeProducts(updated);
            setTotalItems(updated.length);
        } else {
            deleteFavoriteProduct(productId)
                .then(() => {
                    setLikeProducts((prev) => prev.filter((p) => p.id !== productId));
                    setTotalItems((prev) => prev - 1);
                })
                .catch((err) => console.error("Remove favorite failed:", err));
        }
    };

    const handleClearAll = () => {
        if (window.confirm("Bạn có chắc chắn muốn xóa tất cả sản phẩm yêu thích?")) {
            if (!isLoggedIn()) localStorage.removeItem("likeProducts");
            else {
                // TODO: call API xóa tất cả
            }
            setLikeProducts([]);
            setTotalItems(0);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    if (loading) {
        return (
            <Layout>
                <div className="max-w-[1400px] mx-auto px-4 py-8">
                    <div className="flex items-center justify-center min-h-[60vh]">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ad7555]"></div>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-[1400px] mx-auto px-4 py-[150px] min-h-screen">
                <WishListHeader totalItems={totalItems} onClearAll={handleClearAll} />
                {likeProducts.length === 0 ? (
                    <EmptyWishList onNavigate={(path) => navigate(path)} />
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
                            {likeProducts.map((product) => (
                                <ProductItem
                                    key={product.id}
                                    product={product}
                                    onRemoveFavorite={() => handleRemoveFavorite(product.id)}
                                />
                            ))}
                        </div>
                        <PaginationComponent
                            currentPage={currentPage}
                            totalItems={totalItems}
                            pageSize={pageSize}
                            onPageChange={handlePageChange}
                        />
                    </>
                )}
            </div>
        </Layout>
    );
};

export default WishList;
