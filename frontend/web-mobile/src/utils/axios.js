import axios from "axios";

export const get_api_client = () => {
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  return axios.create({
    baseURL: "http://127.0.0.1:8000/api/v1/",
    headers: headers,
  });
};
