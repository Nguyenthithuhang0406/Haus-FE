import React, { useState, useEffect } from "react";
import ProductItem from "@/components/product/ProductItem";
import WishListHeader from "@/components/wishlist/WishListHeader";
import EmptyWishList from "@/components/wishlist/EmptyWishList";
import PaginationComponent from "@/components/wishlist/Panigation";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { refreshFavorites, removeFavorite } from "@/store/favoriteSlice";

const WishList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, pageCustom, loading } = useSelector((state) => state.favorite);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(8);
  const [removingItems, setRemovingItems] = useState(new Set());
  const [itemsToShow, setItemsToShow] = useState([]);

  // Load favorites khi vào trang hoặc khi đổi trang
  useEffect(() => {
    dispatch(refreshFavorites({ page: currentPage, pageSize }));
  }, [dispatch, currentPage, pageSize]);

  // Cập nhật itemsToShow khi items thay đổi, nhưng giữ lại items đang removing
  useEffect(() => {
    setItemsToShow((prevItems) => {
      // Lấy danh sách item IDs đang removing
      const removingIds = Array.from(removingItems);

      // Filter items mới, loại bỏ những item đã bị xóa khỏi Redux và không còn trong removing
      const newItems = items.filter(
        (item) => !removingIds.includes(item.product?.id || item.id),
      );

      // Giữ lại items đang removing từ prevItems
      const keepingRemoving = prevItems.filter((item) => {
        const itemId = item.product?.id || item.id;
        return removingIds.includes(itemId);
      });

      return [...newItems, ...keepingRemoving];
    });
  }, [items, removingItems]);

  // Sử dụng items trực tiếp từ API (đã được phân trang)
  const totalItems = pageCustom?.totalElement || items.length;
  const totalPages = pageCustom?.totalPages || Math.ceil(totalItems / pageSize);

  const handleRemoveFavorite = async (productId) => {
    // Thêm vào danh sách đang xóa để trigger animation
    setRemovingItems((prev) => new Set(prev).add(productId));

    // Đợi fade out xong (300ms) rồi mới xóa thực sự
    setTimeout(async () => {
      try {
        await dispatch(removeFavorite(productId)).unwrap();
        // Xóa khỏi danh sách removing sau khi xóa thành công
        setRemovingItems((prev) => {
          const newSet = new Set(prev);
          newSet.delete(productId);
          return newSet;
        });
        // Không cần refresh vì đã xóa khỏi state trong reducer rồi
        // Chỉ refresh nếu trang hiện tại trống và có trang trước đó
        if (items.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } catch (err) {
        console.error("Remove favorite failed:", err);
        // Nếu lỗi thì xóa khỏi removing để hiển thị lại
        setRemovingItems((prev) => {
          const newSet = new Set(prev);
          newSet.delete(productId);
          return newSet;
        });
      }
    }, 300);
  };

  const handleClearAll = () => {
    if (
      window.confirm("Bạn có chắc chắn muốn xóa tất cả sản phẩm yêu thích?")
    ) {
      // Xóa từng item
      items.forEach((item) => {
        if (item.product?.id) {
          dispatch(removeFavorite(item.product.id));
        }
      });
    }
  };

  if (loading) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ad7555]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-[150px] min-h-screen">
      <WishListHeader totalItems={totalItems} onClearAll={handleClearAll} />
      {itemsToShow.length === 0 && !loading ? (
        <EmptyWishList onNavigate={(path) => navigate(path)} />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
            {itemsToShow.map((item) => {
              const itemId = item.product?.id || item.id;
              const isRemoving = removingItems.has(itemId);

              return (
                <div
                  key={itemId}
                  className={`wishlist-card ${
                    isRemoving ? "wishlist-card--removing" : ""
                  }`}
                >
                  <ProductItem
                    product={item.product || item}
                    onRemoveFavorite={() => handleRemoveFavorite(itemId)}
                  />
                </div>
              );
            })}
          </div>
          {totalPages > 1 && (
            <PaginationComponent
              currentPage={currentPage}
              totalItems={totalItems}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}
    </div>
  );
};

export default WishList;
