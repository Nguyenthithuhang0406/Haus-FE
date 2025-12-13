import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getFavoriteProducts,
  addFavoriteProduct,
  deleteFavoriteProduct,
} from "@/api/favorite";
import { isLoggedIn } from "@/utils/checkLogin";

// Thunk để load/refresh favorites (dùng chung cho cả load lần đầu và refresh)
// Nếu không truyền page và pageSize, sẽ lấy tất cả (dùng cho check favorite)
export const loadFavorites = createAsyncThunk(
  "favorite/loadFavorites",
  async ({ page = 1, pageSize = 1000 } = {}, { rejectWithValue }) => {
    try {
      if (isLoggedIn()) {
        // Nếu đã đăng nhập, call API với phân trang
        const response = await getFavoriteProducts(page, pageSize);
        const data = response.data?.data || response.data;
        return {
          items: data?.items || [],
          pageCustom: data?.pageCustom || {},
        };
      } else {
        // Nếu chưa đăng nhập, lấy từ localStorage
        const localFav = JSON.parse(localStorage.getItem("likeProducts")) || [];

        // Áp dụng phân trang cho localStorage
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedItems = localFav.slice(startIndex, endIndex);

        return {
          items: paginatedItems.map((product) => ({
            id: product.id,
            product: product,
            createdAt: new Date().toISOString(),
          })),
          pageCustom: {
            pageNum: page,
            pageSize: pageSize,
            totalElement: localFav.length,
            totalPages: Math.ceil(localFav.length / pageSize),
          },
        };
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Alias cho loadFavorites để code dễ đọc hơn
export const refreshFavorites = loadFavorites;

// Thunk để thêm favorite
export const addFavorite = createAsyncThunk(
  "favorite/addFavorite",
  async ({ productId, product }, { rejectWithValue, dispatch }) => {
    try {
      if (isLoggedIn()) {
        await addFavoriteProduct(productId);
        // Refresh sau khi thêm
        await dispatch(refreshFavorites());
        return { productId, product };
      } else {
        // Cập nhật localStorage
        const localFav = JSON.parse(localStorage.getItem("likeProducts")) || [];
        const updated = [...localFav, product];
        localStorage.setItem("likeProducts", JSON.stringify(updated));
        return {
          productId,
          product,
          favoriteItem: {
            id: Date.now(),
            product: product,
            createdAt: new Date().toISOString(),
          },
        };
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk để xóa favorite
export const removeFavorite = createAsyncThunk(
  "favorite/removeFavorite",
  async (productId, { rejectWithValue }) => {
    try {
      const loggedIn = isLoggedIn();
      if (loggedIn) {
        await deleteFavoriteProduct(productId);
        // Không refresh lại, để reducer tự xử lý việc xóa khỏi state
        return { productId, fromLocalStorage: false };
      } else {
        // Cập nhật localStorage
        const localFav = JSON.parse(localStorage.getItem("likeProducts")) || [];
        const updated = localFav.filter((p) => p.id !== productId);
        localStorage.setItem("likeProducts", JSON.stringify(updated));
        return { productId, fromLocalStorage: true };
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk để sync favorites từ localStorage lên server
export const syncFavoritesToServer = createAsyncThunk(
  "favorite/syncFavoritesToServer",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const localFav = JSON.parse(localStorage.getItem("likeProducts")) || [];
      if (localFav.length === 0) return { synced: 0 };

      let synced = 0;
      for (const product of localFav) {
        try {
          await addFavoriteProduct(product.id);
          synced++;
        } catch (error) {
          console.error(`Failed to sync product ${product.id}:`, error);
        }
      }

      // Xóa localStorage sau khi sync
      localStorage.removeItem("likeProducts");

      // Refresh favorites từ server
      await dispatch(refreshFavorites());

      return { synced };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  items: [], // Danh sách favorite items
  pageCustom: {
    pageNum: 1,
    pageSize: 0,
    totalElement: 0,
    totalPages: 0,
  },
  loading: false,
  error: null,
};

const favoriteSlice = createSlice({
  name: "favorite",
  initialState,
  reducers: {
    clearFavorites: (state) => {
      state.items = [];
      state.pageCustom = {
        pageNum: 1,
        pageSize: 0,
        totalElement: 0,
        totalPages: 0,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Load favorites
      .addCase(loadFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.pageCustom = action.payload.pageCustom;
      })
      .addCase(loadFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add favorite
      .addCase(addFavorite.pending, (state) => {
        state.loading = true;
      })
      .addCase(addFavorite.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.favoriteItem) {
          // Thêm từ localStorage
          state.items.push(action.payload.favoriteItem);
          state.pageCustom.totalElement = state.items.length;
        }
        // Nếu từ API, đã được refresh rồi
      })
      .addCase(addFavorite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Remove favorite
      .addCase(removeFavorite.pending, () => {
        // Không set loading để tránh hiển thị loading spinner khi xóa
      })
      .addCase(removeFavorite.fulfilled, (state, action) => {
        // Xóa item khỏi state ngay lập tức (cho cả API và localStorage)
        state.items = state.items.filter(
          (item) => item.product?.id !== action.payload.productId
        );
        // Cập nhật totalElement
        if (state.pageCustom.totalElement > 0) {
          state.pageCustom.totalElement = state.pageCustom.totalElement - 1;
        }
      })
      .addCase(removeFavorite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Sync favorites
      .addCase(syncFavoritesToServer.pending, (state) => {
        state.loading = true;
      })
      .addCase(syncFavoritesToServer.fulfilled, (state) => {
        state.loading = false;
        // Đã được refresh trong thunk
      })
      .addCase(syncFavoritesToServer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearFavorites } = favoriteSlice.actions;

// Selector để check xem sản phẩm có được yêu thích không
export const selectIsFavorite = (state, productId) => {
  return state.favorite.items.some((item) => item.product?.id === productId);
};

// Selector để lấy danh sách product IDs được yêu thích
export const selectFavoriteProductIds = (state) => {
  return state.favorite.items.map((item) => item.product?.id).filter(Boolean);
};

export default favoriteSlice.reducer;
