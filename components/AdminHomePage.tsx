import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { dateFormat } from "../services/UtilsServices";
import { getAllJobs } from "../services/JobServices";
import LoadingComponent from "./LoadingComponent";
import Select from "react-select";

const sortListOptions = [
  { value: "deadline", label: "Deadline" },
  { value: "fullname", label: "Employer's name" },
  { value: "title", label: "Title" },
  { value: "category", label: "Category" },
];

const OrderListOptions = [
  { value: "desc", label: "Desc" },
  { value: "asc", label: "Asc" },
];

const AdminTable = () => {
  const [cookies] = useCookies(["token"]);
  const router = useRouter();
  const { status = "new" } = router.query;

  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [state, setState] = useState({
    page: 1,
    totalDocs: 0,
    limit: 0,
    totalPages: 0,
  });
  const [sortList, setSortList] = useState([
    "deadline",
    "employer's name",
    "title",
    "category",
  ]);
  const [query, setQuery] = useState({});
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const { data } = await getAllJobs(
        status,
        state.page,
        cookies.token,
        query
      );
      setAllJobs(data.docs);
      setState({
        ...state,
        totalDocs: data.totalDocs,
        limit: data.limit,
        totalPages: data.totalPages,
      });
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  const ButtonStyles = (statusNow: string) =>
    `${
      status === statusNow
        ? "bg-sky-500 text-white"
        : "bg-white text-sky-700 hover:bg-sky-100"
    } duration-200 font-semibold p-2 rounded-md`;

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

  const pushStatusNew = () => {
    router.push("?status=new");
  };

  const pushStatusPending = () => {
    router.push("?status=pending");
  };

  const pushToEachJob = (id: string) => {
    router.push(`/job/details/${id}`);
  };

  if (!allJobs) return null;

  useEffect(() => {
    if (!status) return;
    fetchData();
  }, [state.page, status, query]);

  const HeaderTableStyles = "text-start text-sky-700 py-3";

  const ShowingComponent = (
    // Header table area
    <div className="bg-white rounded-md overflow-hidden">
      <div className="overflow-auto h-[540px]">
        {isLoading ? (
          <LoadingComponent className="h-20 w-20 block rounded-full border-4 border-sky-400 border-t-white animate-spin" />
        ) : (
          <table className="table-auto w-full">
            <thead>
              <tr className="border-b-2 border-sky-300">
                <th className={`${HeaderTableStyles} pl-2 md:pl-4`}>
                  Employer's Name
                </th>
                <th className={HeaderTableStyles}>Title</th>
                <th className={HeaderTableStyles}>Category</th>
                <th className={HeaderTableStyles}>Dead line</th>
              </tr>
            </thead>
            {/* Showing jobs area */}
            <tbody className="">
              {isLoading
                ? null
                : allJobs.map((job, id) => {
                    return (
                      <tr
                        className={`${
                          id % 2 == 0 ? "bg-sky-100" : "bg-white"
                        } hover:bg-sky-200 duration-100 cursor-pointer border-b`}
                        key={job._id}
                        onClick={() => pushToEachJob(job._id)}
                      >
                        <td className="py-3 pl-2 md:pl-4">{job.fullname}</td>
                        <td className="py-3">{job.title}</td>
                        <td
                          className="py-3"
                          style={{ color: `${job.category.color}` }}
                        >
                          <div className="font-bold">{job.category.name}</div>
                        </td>
                        <td className="py-3">
                          {dateFormat(new Date(job.deadline))}
                        </td>
                      </tr>
                    );
                  })}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer area */}
      <div className="w-full border-sky-300 border-t-2">
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-2 py-3 sm:px-4">
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
      <div className="my-3">
        <div className="flex mb-3 justify-between">
          <div>
            <button className={ButtonStyles("new")} onClick={pushStatusNew}>
              New
            </button>
            <button
              className={ButtonStyles("pending")}
              onClick={pushStatusPending}
            >
              Pending
            </button>
          </div>
          <div className="flex space-x-2">
            <div className="flex items-center">
              <span>Search: </span>
              <input
                className="w-30"
                value={search}
                onChange={(e) => setSearch(e.target.value.trim())}
                onKeyDown={(e) => {
                  if (e.key === "Enter") setQuery({ ...query, search: search });
                }}
              />
            </div>
            <div className="flex items-center">
              <span>Sort: </span>
              <Select
                options={sortListOptions}
                defaultValue={sortListOptions[0]}
                onChange={(option) =>
                  setQuery({ ...query, sort: option.value })
                }
              />
            </div>
            <div className="flex items-center">
              <span>Order</span>
              <Select
                options={OrderListOptions}
                defaultValue={OrderListOptions[0]}
                onChange={(option) =>
                  setQuery({ ...query, order: option.value })
                }
              />
            </div>
          </div>
        </div>
        {ShowingComponent}
      </div>
    </>
  );
};

export default AdminTable;
