import type { PayloadAction } from "@reduxjs/toolkit";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiCreateBanner, apiDeleteBanner, apiGetBanner, apiUpdateBanner } from "../../api/bannerApi";
import { Banner } from "../../models/banner";
import type { RootState } from "../../redux/store";

interface BannerState {
  banner: Banner[],
  loading: boolean,
  error: string,
  bannerInfo: Banner | null
}

const initialState: BannerState = {
  banner: [],
  loading: false,
  error: "",
  bannerInfo: null
};

// export const requestLoadFilms = createAsyncThunk('film/loadFilms', async (props: {
//   skip?: number;
//   limit?: number;
//   status?: number;
// }) => {
//   const res = await apiGetAllFilm(props);
//   return res.data  
// })

export const requestCreateBanner = createAsyncThunk('banner/requestCreateBanner', async (props: any) => {
  const res = await apiCreateBanner(props);
  return res.data
})

export const requestUpdateBanner = createAsyncThunk('banner/requestUpdateBanner', async (props: any) => {
  const res = await apiUpdateBanner(props);
  return res.data
})

export const requestDeleteBanner = createAsyncThunk('banner/requestDeleteBanner', async (id: any) => {
  const res = await apiDeleteBanner(id);
  return res.data
})

export const requestGetBanner = createAsyncThunk('banner/requestGetBanner', async () => {
  const res = await apiGetBanner();
  return res.data
})

export const bannerSlice = createSlice({
  name: "banner",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    const actionList = [requestCreateBanner, requestGetBanner, requestDeleteBanner, requestUpdateBanner];
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

    builder.addCase(requestCreateBanner.fulfilled, (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.bannerInfo = new Banner(action.payload.data.banner);
    })

    builder.addCase(requestGetBanner.fulfilled, (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.banner = action.payload.data.banners;
    })
  },
});

export const { } = bannerSlice.actions;

export const bannerState = (state: RootState) => state.banner;

export default bannerSlice.reducer;
