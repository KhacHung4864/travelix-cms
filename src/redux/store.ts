import { configureStore } from "@reduxjs/toolkit";
import bannerReducer from "../pages/banner/bannerSlice";
import categoryReducer from "../pages/category/categorySlice";
import placeReducer from "../pages/place/placeSlice";
import userReducer from "../pages/user/usersSlide";
import authReducer from "../redux/authSlice";

export const store = configureStore({
    reducer: {
        authState: authReducer,
        user: userReducer,
        place: placeReducer,
        banner: bannerReducer,
        category: categoryReducer,
    },
    middleware: (getDefaultMiddle) => getDefaultMiddle({ serializableCheck: false }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;