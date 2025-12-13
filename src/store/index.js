import storage from "redux-persist/lib/storage";
import { configureStore } from "@reduxjs/toolkit";
import searchReducer from "./searchSlice";
import orderReducer from "./orderSlice";
import favoriteReducer from "./favoriteSlice";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

const persistConfig = {
  key: "haus",
  storage,
};

const persistedReducer = persistReducer(persistConfig, searchReducer);
const orderPersistedReducer = persistReducer(persistConfig, orderReducer);
const favoritePersistedReducer = persistReducer(persistConfig, favoriteReducer);

let store = configureStore({
  reducer: {
    search: persistedReducer,
    order: orderPersistedReducer,
    favorite: favoritePersistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

let persistor = persistStore(store);
export { store, persistor };
