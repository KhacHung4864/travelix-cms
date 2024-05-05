import { notification } from 'antd';
import Cookies from 'js-cookie';
import { useLayoutEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { authState } from '../redux/authSlice';
import { useAppDispatch, useAppSelector } from '../redux/hook';

const PrivateRoute = () => {
    const dispatch = useAppDispatch()
    const authStates = useAppSelector(authState)
    const [cookies, setCookies] = useState<any>()
    const cookie = Cookies.get("tokenAdmin");
    
    useLayoutEffect(() => {
        if(!authStates.userInfo?.id)
        checkLogin()
    }, [])

    const checkLogin = async () => {
        const cookie = Cookies.get("tokenAdmin");
        setCookies(cookie);
        try {
            // const result = await dispatch(
            //     requestGetUserFromToken({ token: cookie || "" })
            // );
            // unwrapResult(result);
        } catch (error) {
            if (cookie)
                notification.error({
                    message: "Server đang bị lỗi",
                });
        }
    }

    // If authorized, return an outlet that will render child elements
    // If not, return element that will navigate to login page
    // return authStates.loadingCheckLogin ? (
    //     <Loading />
    // ): (
    //     authStates.userInfo?.id ? <Outlet /> : <Navigate to="/dang-nhap" />
    // );
    return cookie ? <Outlet /> : <Navigate to="/dang-nhap" />
}

export default PrivateRoute