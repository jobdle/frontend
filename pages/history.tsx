import React, { useEffect, useState } from "react";
import type { NextPage } from "next";
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";

import { useUser } from "../contexts/User";
import { getAllAccomplishedJobs } from "../services/JobServices";
import Header from "../components/Header";

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { dateFormat } from "../services/UtilsServices";
import LoadingComponent from "../components/LoadingComponent";

const HistoryPage: NextPage = () => {
  const [cookies] = useCookies(["token"]);
  const { userData } = useUser();
  const router = useRouter();

  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [state, setState] = useState({
    page: 1,
    totalDocs: 0,
    limit: 0,
    totalPages: 0,
  });

  const handleFirstPage = (page: number) => {
    if (page <= 1) return;
    setState({ ...state, page: page - 1 });
  };

  const handleNextPage = (page: number) => {
    if (page >= state.totalPages) return;
    setState({ ...state, page: page + 1 });
  };

  const showLastDocOfPage = () => {
    if (state.totalDocs < state.limit * state.page) return state.totalDocs;
    return state.limit * state.page;
  };

  const showTotalDocs = state.totalDocs;

  const showFirstDocOfPage =
    state.totalDocs === 0 ? 0 : state.limit * (state.page - 1) + 1;

  const createPagination = () => {
    const paginationArray = [];
    for (let i = 1; i <= state.totalPages; i++) {
      paginationArray.push(i);
    }
    return paginationArray;
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const { data } = await getAllAccomplishedJobs(state.page, cookies.token);
      setAllJobs(data.docs);
      setState({
        ...state,
        totalDocs: data.totalDocs,
        limit: data.limit,
        totalPages: data.totalPages,
      });
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [state.page]);

  if (!allJobs) return null;
  if (!userData) return null;

  const isAdminHeaderStyles = `${
    userData.role === "admin" ? "" : "pl-2 md:pl-4"
  } text-start text-sky-700 py-3 min-w-[100px]`;

  const isAdminDetailsStyles = userData.role === "admin" ? "" : "pl-2 md:pl-4";

  const HeaderTableStyles = "text-start text-sky-700 py-3 min-w-[100px]";

  const ShowingComponent =
    allJobs.length === 0 ? (
      <div className="flex justify-center items-center w-full bg-white rounded-md">
        <p>You not have accomplished jobs</p>
      </div>
    ) : (
      // Header table area
      <div className="bg-white shadow rounded-md overflow-hidden">
        <div className="overflow-auto h-[540px]">
          {isLoading ? (
            <LoadingComponent className="h-20 w-20 block rounded-full border-4 border-sky-400 border-t-white animate-spin" />
          ) : (
            <table className="min-w-max w-full table-auto">
              <thead>
                <tr className="border-b-2 border-sky-300">
                  {userData.role === "admin" ? (
                    <th className="text-start text-sky-700 py-3 pl-2 md:pl-4">
                      Employer's Name
                    </th>
                  ) : (
                    ""
                  )}
                  <th className={isAdminHeaderStyles}>Title</th>
                  <th className={HeaderTableStyles}>Category</th>
                  <th className={HeaderTableStyles}>Date</th>
                  <th className={HeaderTableStyles}>Status</th>
                </tr>
              </thead>
              <tbody>
                {allJobs.map((job, id) => (
                  <tr
                    className={`${
                      id % 2 == 0 ? "bg-sky-100" : "bg-white border-b"
                    } hover:bg-sky-200 duration-100 cursor-pointer`}
                    onClick={() => router.push(`/job/details/${job._id}`)}
                    key={job._id}
                  >
                    {userData.role === "admin" ? (
                      <td className="py-3 pl-2 md:pl-4">{job.fullname}</td>
                    ) : (
                      ""
                    )}
                    <td className={`${isAdminDetailsStyles} py-3`}>
                      {job.title}
                    </td>
                    <td className="py-3">{job.category.name}</td>
                    <td className="py-3">
                      {dateFormat(new Date(job.updatedAt))}
                    </td>
                    <td className="py-3">
                      {job.status !== "cancel" ? (
                        <p className="font-bold text-green-500">Completed</p>
                      ) : (
                        <p className="font-bold text-red-500">Fail</p>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="w-full border-sky-300 border-t-2">
          <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
            <div className="flex flex-1 justify-between sm:hidden">
              <div className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                Previous
              </div>
              <div className="ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                Next
              </div>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-medium">{showFirstDocOfPage}</span> to{" "}
                  <span className="font-medium">{showLastDocOfPage()}</span> of{" "}
                  <span className="font-medium">{showTotalDocs}</span> results
                </p>
              </div>
              <div>
                <nav
                  className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                  aria-label="Pagination"
                >
                  <div
                    className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 cursor-pointer"
                    onClick={() => handleFirstPage(state.page)}
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronLeftIcon className="h-5 w-5" />
                  </div>

                  {createPagination().map((number) => {
                    return (
                      <div
                        aria-current="page"
                        className={`relative inline-flex items-center border ${
                          state.page === number
                            ? "border-indigo-500 bg-indigo-50 z-10"
                            : "border-gray-300 bg-white cursor-pointer"
                        } px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20`}
                        onClick={() => setState({ ...state, page: number })}
                        key={number}
                      >
                        {number}
                      </div>
                    );
                  })}
                  <div
                    className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 cursor-pointer"
                    onClick={() => handleNextPage(state.page)}
                  >
                    <p className="sr-only">Next</p>
                    <ChevronRightIcon className="h-5 w-5" />
                  </div>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

  return (
    <>
      <Header title="History" />
      <div className="my-3">{ShowingComponent}</div>
    </>
  );
};

export default HistoryPage;
