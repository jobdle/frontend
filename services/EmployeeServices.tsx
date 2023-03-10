import axios from "axios";
import { headersParams } from "./UtilsServices";

export const getAllEmployees = async (
  token: string,
  query: object | undefined
) => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/employee`,
    {
      params: query,
      headers: headersParams(token),
    }
  );
  console.log("getAllEmployees", response);
  return response;
};

export const getEmployee = async (
  id: string | string[] | undefined,
  token: string
) => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/employee/${id}`,
    {
      headers: headersParams(token),
    }
  );
  console.log("getEmployee", response);
  return response;
};

export const deleteEmployee = async (
  id: string | string[] | undefined,
  token: string
) => {
  const response = await axios.delete(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/employee/${id}`,
    {
      headers: headersParams(token),
    }
  );
  console.log("deleteEmployee", response);
  return response;
};

export const postEmployee = async (data: {}, token: string) => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/employee`,
    data,
    {
      headers: headersParams(token),
    }
  );
  console.log("postEmployee", response);
  return response;
};

export const editEmployee = async (
  id: string | string[] | undefined,
  data: object,
  token: string
) => {
  const response = await axios.patch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/employee/${id}`,
    data,
    {
      headers: headersParams(token),
    }
  );
  console.log("postEmployee", response);
  return response;
};
