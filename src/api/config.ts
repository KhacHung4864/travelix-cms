import axios, { AxiosRequestConfig } from "axios";
import Cookies from "js-cookie";

export const PREFIX_API = process.env.REACT_APP_PREFIX_API;
export const ENDPOINT_LOCAL = process.env.REACT_APP_ENDPOINT;

const axiosInstance = axios.create();
axiosInstance.defaults.baseURL = `${ENDPOINT_LOCAL}/${PREFIX_API}`;
axiosInstance.defaults.timeout = 20000;
axiosInstance.defaults.headers["Content-Type"] = "application/json";

axiosInstance.interceptors.request.use((config: any) => {
  const accessToken = Cookies.get("tokenAdmin");
  config.headers = config.headers || {}
  if (accessToken) {
    config.headers["Authorization"] = `Bearer ${accessToken}`;
  }
  return config;
})

export const ApiConfig = async (
  url: string,
  data?: {
    payload?: any;
    params?: any;
  },
  _method = "POST",
  apiPrefix = PREFIX_API
) => {
  const method = _method.toLowerCase() as AxiosRequestConfig["method"];
  const config: AxiosRequestConfig = {
    url,
    method,
    data: data?.payload,
    params: data?.params
  };
  if (apiPrefix !== PREFIX_API)
    config.baseURL = `${ENDPOINT_LOCAL}/${apiPrefix}`;
    // config.baseURL = `https://go-server-ikbn.onrender.com/api/`;

  //  if (method === 'post') {
  //     return axiosInstance.post(`${url}`, payload, config)
  //         .then(response => {
  //             return response
  //         })
  //         .catch(error => error);
  // }

  return axiosInstance.request(config);
};

export const ApiUploadFile = async (
  url: string,
  file: string | Blob | any,
  setProgress?: React.Dispatch<React.SetStateAction<number>>,
  onProgress?: ((event: any) => void) | undefined,
  fieldName = "file"
) => {
  const formData = new FormData();
  if (typeof file === "object" && file?.length) {
    console.log("array");
    for (let i = 0; i < file?.length; i++) {
      formData.append(fieldName, file[i]);
    }
  } else {
    console.log("not array");
    formData.append(fieldName, file);
  }
  return axiosInstance.post(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    // onUploadProgress: (event: any) => {
    //     const percent = Math.floor((event.loaded / event.total) * 100);
    //     if (setProgress && onProgress) {
    //         setProgress(percent);
    //         // if (percent === 100) {
    //         //     setTimeout(() => setProgress(0), 1000);
    //         // }
    //         onProgress({ percent: (event.loaded / event.total) * 100 });
    //     }
    // },
  });
};
