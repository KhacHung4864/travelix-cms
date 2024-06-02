import ENDPONTAPI from "../common/endpoint";
import { ApiConfig } from "./config";

export const apiGetAllUser = async (params) => {
  return ApiConfig(
    ENDPONTAPI.USER, {
      params
    },
    "GET"
  );
};

export const apiUpdateUser = async (payload: any) => {
  return ApiConfig(ENDPONTAPI.UPDATE_STATUS_USER, {
    payload,
  });
};
