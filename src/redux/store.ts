import { configureStore } from "@reduxjs/toolkit";
import filmReducer from "../pages/films/filmsSlide";
import authReducer from "../redux/authSlice";
import userReducer from "../pages/user/usersSlide";

export const store = configureStore({
    reducer: {
        film: filmReducer,
        authState: authReducer,
        user: userReducer,
    },
    middleware: (getDefaultMiddle) => getDefaultMiddle({ serializableCheck: false }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;