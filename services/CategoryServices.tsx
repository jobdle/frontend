import axios from "axios";
import { headersParams } from "./UtilsServices";

export const getAllCategories = async (token: string) => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/category`,
    {
      headers: headersParams(token),
    }
  );
  return response;
};

export const postCategory = async (data: {}, token: string) => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/category`,
    data,
    {
      headers: headersParams(token),
    }
  );
  return response;
};

export const deleteCategory = async (
  id: string | string[] | undefined,
  token: string
) => {
  const response = await axios.delete(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/category/${id}`,
    {
      headers: headersParams(token),
    }
  );
  return response;
};
