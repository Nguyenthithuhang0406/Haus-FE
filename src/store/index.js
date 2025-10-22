import storage from "redux-persist/lib/storage";
import { configureStore } from "@reduxjs/toolkit";
import searchReducer from "./searchSlice";
import orderReducer from "./orderSlice";
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
  key: "search",
  storage,
};

const persistedReducer = persistReducer(persistConfig, searchReducer);
const orderPersistedReducer = persistReducer(persistConfig, orderReducer);

let store = configureStore({
  reducer: {
    search: persistedReducer,
    order: orderPersistedReducer,
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
