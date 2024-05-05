import ENDPONTAPI from "../common/endpoint";
import { ApiConfig } from "./config";

export const apiCreateCategory = async (payload: any) => {
  return ApiConfig(ENDPONTAPI.CATEGORY, {
    payload,
  }, 'POST');
};

export const apiUpdateCategory = async (payload: any) => {
  return ApiConfig(ENDPONTAPI.CATEGORY + `${payload.id}`, {
    payload,
  }, 'PATCH');
};

export const apiDeleteCategory = async (id: any) => {
  return ApiConfig(ENDPONTAPI.CATEGORY + `${id}`, {}, 'DELETE');
};

export const apiGetCategory = async () => {
  return ApiConfig(ENDPONTAPI.CATEGORY, {}, 'GET');
};