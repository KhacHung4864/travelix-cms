import ENDPONTAPI from "../common/endpoint";
import { ApiConfig } from "./config";

export const apiCreateBanner = async (payload: any) => {
  return ApiConfig(ENDPONTAPI.BANNER, {
    payload,
  }, 'POST');
};

export const apiUpdateBanner = async (payload: any) => {
  return ApiConfig(ENDPONTAPI.BANNER + `${payload.id}`, {
    payload,
  }, 'PATCH');
};

export const apiDeleteBanner = async (id: any) => {
  return ApiConfig(ENDPONTAPI.BANNER + `${id}`, {}, 'DELETE');
};

export const apiGetBanner = async () => {
  return ApiConfig(ENDPONTAPI.BANNER, {}, 'GET');
};