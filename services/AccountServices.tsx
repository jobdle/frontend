import axios from "axios";
import { headersParams } from "./UtilsServices";

export const getUserData = async (token: string) => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/profile`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  console.log("getUserData", response);
  return response;
};

export const signInAccount = async (data: {
  email: string;
  password: string;
}) => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/signin`,
    data,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response;
};

export const resetPassword = async (
  password: string,
  token: string | string[] | undefined
) => {
  const response = await axios.patch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/password`,
    { password },
    {
      headers: headersParams(token),
    }
  );
  return response;
};

export const patchAccountUser = async (data: UserEditable, token: string) => {
  const response = await axios.patch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/profile`,
    data,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
};
