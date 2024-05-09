import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiCreateBanner } from "../../api/bannerApi";
import { apiGetPlace } from "../../api/placeApi";
import { Place } from "../../models/place";
import type { RootState } from "../../redux/store";

interface PlaceState {
  place: Place[],
  loading: boolean,
  error: string,
  placeInfo: Place | null
}

const initialState: PlaceState = {
  place: [],
  loading: false,
  error: "",
  placeInfo: null
};

export const requestCreatePlace = createAsyncThunk('place/requestCreatePlace', async (props: any) => {
  const res = await apiCreateBanner(props);
  return res.data
})

export const requestGetPlace = createAsyncThunk('place/requestGetPlace', async (props: any) => {
  const res = await apiGetPlace(props);
  return res.data
})

export const placeSlice = createSlice({
  name: "place",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    const actionList = [requestGetPlace];
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

    builder.addCase(requestGetPlace.fulfilled, (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.place = action.payload.data.places;
    })
  },
});

export const { } = placeSlice.actions;

export const placeState = (state: RootState) => state.place;

export default placeSlice.reducer;
