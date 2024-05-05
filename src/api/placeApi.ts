import ENDPONTAPI from "../common/endpoint";
import { ApiConfig } from "./config";

export const apiCreatePlace = async (payload: any) => {
  return ApiConfig(ENDPONTAPI.PLACE, {
    payload,
  }, 'POST');
};

export const apiUpdatePlace = async (payload: any) => {
  return ApiConfig(ENDPONTAPI.PLACE + `${payload.id}`, {
    payload,
  }, 'PATCH');
};

export const apiDeletePlace = async (id: any) => {
  return ApiConfig(ENDPONTAPI.PLACE + `${id}`, {}, 'DELETE');
};

export const apiGetPlace = async () => {
  return ApiConfig(ENDPONTAPI.PLACE, {}, 'GET');
};