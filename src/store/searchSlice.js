import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  keySearch: "",
  listSearch: [],
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setKeySearch: (state, action) => {
      state.keySearch = action.payload;
    },
    setListSearch: (state, action) => {
      state.listSearch = action.payload;
    },
    clearSearch: (state) => {
      state.keySearch = "";
      state.listSearch = [];
    },
  },
});

export const { setKeySearch, setListSearch, clearSearch } = searchSlice.actions;
export default searchSlice.reducer;
