import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiGetCategory } from "../../api/categoryApi";
import { Category } from "../../models/category";
import type { RootState } from "../../redux/store";

interface CategoryState {
  category: Category[],
  loading: boolean,
  error: string,
  categoryInfo: Category | null
}

const initialState: CategoryState = {
  category: [],
  loading: false,
  error: "",
  categoryInfo: null
};

export const requestGetCategory = createAsyncThunk('place/requestGetCategory', async () => {
  const res = await apiGetCategory();
  return res.data
})

export const categorySlice = createSlice({
  name: "place",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    const actionList = [requestGetCategory];
    actionList.forEach(action => {
      builder.addCase(action.pending, (state) => {
        state.loading = true;
      })
    })
    actionList.forEach(action => {
      builder.addCase(action.rejected, (state) => {
        state.loading = false;
      })
    })

    builder.addCase(requestGetCategory.fulfilled, (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.category = action.payload.data.categories;
    })
  },
});

export const { } = categorySlice.actions;

export const categoryState = (state: RootState) => state.category;

export default categorySlice.reducer;
