import React, { useState, useEffect } from "react";
import Layout from "@/components/commons/Layout";
import ProductItem from "@/components/product/ProductItem";
import WishListHeader from "@/components/wishlist/WishListHeader";
import EmptyWishList from "@/components/wishlist/EmptyWishList";
import PaginationComponent from "@/components/wishlist/Panigation";
import { useNavigate } from "react-router-dom";

const dummyLikeProducts = [
    {
        id: 1,
        code: "SP001",
        name: "Ghế có tay vịn BONHOLMEN",
        category: "Nội thất ngoài trời",
        image: [
            "https://bizweb.dktcdn.net/thumb/large/100/570/902/products/sp20-4.jpg?v=1746439987253",
            "https://bizweb.dktcdn.net/thumb/large/100/570/902/products/sp18.jpg?v=1746437935323",
        ],
        shortDesc: "Ghế ngoài trời chắc chắn",
        price: 3500000,
        discount: 40,
        stock: 11,
        sell: 8,
        total: 20,
    },
    {
        id: 2,
        code: "SP002",
        name: "Ghế có tay vịn TARNO",
        category: "Nội thất ngoài trời",
        image: [
            "https://bizweb.dktcdn.net/thumb/large/100/570/902/products/sp18.jpg?v=1746437935323",
        ],
        shortDesc: "Ghế gỗ gấp tiện lợi",
        price: 1000000,
        discount: 43,
        stock: 12,
        sell: 5,
        total: 15,
    },
    {
        id: 3,
        code: "SP003",
        name: "Ghế thư giãn có tay vịn",
        category: "Nội thất ngoài trời",
        image: [
            "https://bizweb.dktcdn.net/thumb/large/100/570/902/products/sp20-4.jpg?v=1746439987253",
        ],
        shortDesc: "Ghế thư giãn cao cấp",
        price: 2500000,
        discount: 40,
        stock: 8,
        sell: 12,
        total: 20,
    },
    {
        id: 4,
        code: "SP004",
        name: "Ghế NORRMANSO",
        category: "Nội thất ngoài trời",
        image: [
            "https://bizweb.dktcdn.net/thumb/large/100/570/902/products/sp18.jpg?v=1746437935323",
        ],
        shortDesc: "Ghế hiện đại tiện lợi",
        price: 2800000,
        discount: 43,
        stock: 10,
        sell: 6,
        total: 10,
    },
    {
        id: 5,
        code: "SP004",
        name: "Ghế NORRMANSO",
        category: "Nội thất ngoài trời",
        image: [
            "https://bizweb.dktcdn.net/thumb/large/100/570/902/products/sp18.jpg?v=1746437935323",
        ],
        shortDesc: "Ghế hiện đại tiện lợi",
        price: 2800000,
        discount: 43,
        stock: 10,
        sell: 6,
        total: 10,
    },
    {
        id: 6,
        code: "SP004",
        name: "Ghế NORRMANSO",
        category: "Nội thất ngoài trời",
        image: [
            "https://bizweb.dktcdn.net/thumb/large/100/570/902/products/sp18.jpg?v=1746437935323",
        ],
        shortDesc: "Ghế hiện đại tiện lợi",
        price: 2800000,
        discount: 43,
        stock: 10,
        sell: 6,
        total: 10,
    },
    {
        id: 7,
        code: "SP004",
        name: "Ghế NORRMANSO",
        category: "Nội thất ngoài trời",
        image: [
            "https://bizweb.dktcdn.net/thumb/large/100/570/902/products/sp18.jpg?v=1746437935323",
        ],
        shortDesc: "Ghế hiện đại tiện lợi",
        price: 2800000,
        discount: 43,
        stock: 10,
        sell: 6,
        total: 10,
    },
    {
        id: 8,
        code: "SP004",
        name: "Ghế NORRMANSO",
        category: "Nội thất ngoài trời",
        image: [
            "https://bizweb.dktcdn.net/thumb/large/100/570/902/products/sp18.jpg?v=1746437935323",
        ],
        shortDesc: "Ghế hiện đại tiện lợi",
        price: 2800000,
        discount: 43,
        stock: 10,
        sell: 6,
        total: 10,
    },
    {
        id: 9,
        code: "SP004",
        name: "Ghế NORRMANSO",
        category: "Nội thất ngoài trời",
        image: [
            "https://bizweb.dktcdn.net/thumb/large/100/570/902/products/sp18.jpg?v=1746437935323",
        ],
        shortDesc: "Ghế hiện đại tiện lợi",
        price: 2800000,
        discount: 43,
        stock: 10,
        sell: 6,
        total: 10,
    },
    {
        id: 10,
        code: "SP004",
        name: "Ghế NORRMANSO",
        category: "Nội thất ngoài trời",
        image: [
            "https://bizweb.dktcdn.net/thumb/large/100/570/902/products/sp18.jpg?v=1746437935323",
        ],
        shortDesc: "Ghế hiện đại tiện lợi",
        price: 2800000,
        discount: 43,
        stock: 10,
        sell: 6,
        total: 10,
    },
    {
        id: 11,
        code: "SP004",
        name: "Ghế NORRMANSO",
        category: "Nội thất ngoài trời",
        image: [
            "https://bizweb.dktcdn.net/thumb/large/100/570/902/products/sp18.jpg?v=1746437935323",
        ],
        shortDesc: "Ghế hiện đại tiện lợi",
        price: 2800000,
        discount: 43,
        stock: 10,
        sell: 6,
        total: 10,
    },
];

const WishList = () => {
    const navigate = useNavigate();
    const [likeProducts, setLikeProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1); 
    const [pageSize] = useState(8); 

    useEffect(() => {
        loadLikeProducts();
        setLoading(false);
    }, []);

    const loadLikeProducts = () => {
        // Luôn sử dụng dummyData để test (không dùng localStorage)
        setLikeProducts(dummyLikeProducts);
    };

    const handleClearAll = () => {
        if (window.confirm("Bạn có chắc chắn muốn xóa tất cả sản phẩm yêu thích?")) {
            setLikeProducts([]);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    useEffect(() => {
        const handleStorageChange = () => {
            loadLikeProducts();
        };

        window.addEventListener("likeProductsChanged", handleStorageChange);

        return () => {
            window.removeEventListener("likeProductsChanged", handleStorageChange);
        };
    }, []);

    useEffect(() => {
        const totalPages = Math.ceil(likeProducts.length / pageSize);
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        }
    }, [likeProducts, currentPage, pageSize]);

    // Tính toán sản phẩm hiển thị theo trang
    const indexOfLastProduct = currentPage * pageSize;
    const indexOfFirstProduct = indexOfLastProduct - pageSize;
    const currentProducts = likeProducts.slice(indexOfFirstProduct, indexOfLastProduct);

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
                <WishListHeader 
                    totalItems={likeProducts.length} 
                    onClearAll={handleClearAll}
                />
                
                {likeProducts.length === 0 ? (
                    <EmptyWishList onNavigate={(path) => navigate(path)} />
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
                            {currentProducts.map((product) => (
                                <ProductItem key={product.id} product={product} />
                            ))}
                        </div>
                        <PaginationComponent
                            currentPage={currentPage}
                            totalItems={likeProducts.length}
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