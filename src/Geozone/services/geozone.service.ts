import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const BASE_URL_POSTAL_PIN_CODE = import.meta.env.VITE_POSTAL_PIN_CODE_API;
const USER_SERVICE_URL = import.meta.env.VITE_USER_SERVICE_URL;

export const getAddressDetailsByPincode = async (pincode: string) => {
  try {
    const response = await axios.get(`${BASE_URL_POSTAL_PIN_CODE}/${pincode}`);
    return response?.data[0]?.PostOffice;
  } catch (error: any) {
    throw error.message;
  }
};

export const createGeozone = async (data: any) => {
  try {
    const response = await axios.post(`${BASE_URL}/geofences`, data.input);
    return response.data;
  } catch (error: any) {
    throw error.message;
  }
};

export const fetchGeozoneHandler = async (params: any) => {
  try {
    const { page = 1, limit = 10 } = params.input;
    const response = await axios.get(
      `${BASE_URL}/geofences?page=${page}&limit=${limit}`
    );
    return response.data;
  } catch (error: any) {
    throw error.message;
  }
};

export const searchGeozones = async (params: any) => {
  try {
    const { page = 1, limit = 10, searchText = "" } = params.input;
    const response = await axios.get(
      `${BASE_URL}/geofences/search?page=${page}&limit=${limit}&searchText=${searchText}`
    );
    return {
      searchGeozone: {
        data: response.data,
        paginatorInfo: {
          count: response.data.length,
          currentPage: page,
          perPage: limit,
        },
      },
    };
  } catch (error: any) {
    throw error.message;
  }
};

export const getGeozoneById = async (id: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/geofences/${id}`);
    return {
      getGeozone: {
        data: response.data,
      },
    };
  } catch (error: any) {
    throw error.message;
  }
};

export const updateGeozone = async (data: any) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/geofences/${data.input._id}`,
      data.input
    );
    return response.data;
  } catch (error: any) {
    throw error.message;
  }
};

export const deleteGeozone = async (id: string) => {
  try {
    const response = await axios.delete(`${BASE_URL}/geofences/${id}`);
    return response.data;
  } catch (error: any) {
    throw error.message;
  }
};

export const searchUsers = async (page = 1, limit = 10, search = {}) => {
  try {
    const response = await axios.post(
      USER_SERVICE_URL,
      {
        page,
        limit,
        search,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": localStorage.getItem("token") || "",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw error.message;
  }
};
