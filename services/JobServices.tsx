import axios from "axios";
import { headersParams } from "./UtilsServices";

export const getAllJobs = async (
  status: string | string[] | undefined,
  page: number = 0,
  token: string,
  query: object | undefined
) => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/work`,
    {
      params: {
        status: [status],
        page: page,
        ...query,
      },
      headers: headersParams(token),
    }
  );
  console.log("getAllJob", response);
  return response;
};

export const getAllAccomplishedJobs = async (
  page: number = 0,
  token: string
) => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/work`,
    {
      params: {
        status: ["cancel", "done"],
        page: page,
      },
      headers: headersParams(token),
    }
  );
  console.log("getAllCompletedJobs", response);
  return response;
};

export const getUserJobs = async (
  status:  string[] | undefined,
  page: number = 0,
  token: string
) => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/work`,
    {
      params: {
        status: status,
        page: page,
      },
      headers: headersParams(token),
    }
  );
  console.log("getUserJobs", response);
  return response;
};

export const getJob = async (id: any, token: string) => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/work/${id}`,
    {
      headers: headersParams(token),
    }
  );
  console.log("getJob", response);
  return response;
};

export const editJob = async (
  id: string | string[] | undefined,
  data: { status: string },
  token: string
) => {
  const response = await axios.patch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/work/${id}`,
    data,
    {
      headers: headersParams(token),
    }
  );
  console.log("editJob", response);
  return response;
};

export const deleteJob = async (
  id: string | string[] | undefined,
  token: string
) => {
  const response = await axios.delete(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/work/${id}`,
    {
      headers: headersParams(token),
    }
  );
  console.log("deleteJob", response);
  return response;
};

export const postJob = async (data: JobEditable, token: string) => {
  console.log("data in postJob", data);
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/work`,
    data,
    {
      headers: headersParams(token),
    }
  );
  console.log("postJob", response);
  return response;
};

export const manageJob = async (
  id: string | string[] | undefined,
  data: { employee: Employee[]; status: string },
  token: string
) => {
  const response = await axios.patch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/work/${id}`,
    data,
    {
      headers: headersParams(token),
    }
  );
  console.log("postJob", response);
  return response;
};
