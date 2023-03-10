import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import Select from "react-select";

import { getUserJobs } from "../services/JobServices";
import { dateFormat } from "../services/UtilsServices";
import ButtonComponent from "../components/ButtonComponent";
import LoadingComponent from "../components/LoadingComponent";
import { getUserData } from "../services/AccountServices";

const statusOptions = [
  { value: ["new", "pending"], label: "All" },
  { value: ["new"], label: "New" },
  { value: ["pending"], label: "Pending" },
];

const EmployerDashBoardPage: NextPage = () => {
  const [cookies] = useCookies(["token"]);
  const router = useRouter();

  const [userJobs, setUserJobs] = useState<Job[]>([]);
  const [state, setState] = useState({
    page: 1,
    totalDocs: 0,
    limit: 0,
    totalPages: 0,
  });
  const [status, setStatus] = useState(statusOptions[0].value);
  const [order, setOrder] = useState("desc");
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const { data } = await getUserJobs(status, state.page, cookies.token);
      setUserJobs(data.docs);
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

  useEffect(() => {
    try {
      getUserData(cookies.token);
    } catch (error) {
      router.push("/signin");
    }
    fetchData();
    console.log("status", status);
  }, [state.page, status]);

  const handleCreateJob = () => {
    router.push("job/details/fill");
  };

  const createPagination = () => {
    const paginationArray = [];
    for (let i = 1; i <= state.totalPages; i++) {
      paginationArray.push(i);
    }
    return paginationArray;
  };

  const handleFirstPage = (page: number) => {
    if (page <= 1) return;
    setState({ ...state, page: page - 1 });
  };

  const handleNextPage = (page: number) => {
    if (page >= state.totalPages) return;
    setState({ ...state, page: page + 1 });
  };

  const ButtonStyles = (statusNow: string) =>
    `${
      status[0] === statusNow
        ? "bg-sky-500 text-white"
        : "bg-white text-sky-700 hover:bg-sky-100"
    } duration-200 font-semibold p-2 rounded-md`;

  const handleChangeStatus = (status: string) => {
    if (status === "all") {
      setStatus(["new", "pending"]);
    } else {
      setStatus([status]);
    }
  };

  if (!userJobs) return null;

  const showingJobs =
    userJobs.length === 0 ? (
      <div className="w-full flex justify-center items-center">
        {" "}
        You don't have Job in "{status}" status
      </div>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {userJobs.map((jobDetailsObject, id) => (
          <div
            className="bg-white rounded-md px-3 py-2 cursor-pointer hover:shadow-lg"
            onClick={() => router.push(`job/details/${jobDetailsObject?._id}`)}
            key={id}
          >
            <div id="job-header" className="text-lg">
              <span>{jobDetailsObject.title}</span>
            </div>
            <hr />
            <div id="p-5" className="px-5 py-3">
              <div>
                <span className="text-gray-400">Category: </span>
                <span>{jobDetailsObject.category.name}</span>
              </div>
              <div>
                <span className="text-gray-400">min-Wage: </span>
                <span>{jobDetailsObject?.category.minWage}</span>
              </div>
            </div>
            <div
              id="job-footer"
              className="flex justify-between items-center pt-2"
            >
              <div className="text-sm">
                <span className="text-gray-400">Deadline: </span>
                <span>{dateFormat(new Date(jobDetailsObject.deadline))}</span>
              </div>
              <span
                className={`${
                  jobDetailsObject.status === "new"
                    ? "bg-green-500"
                    : "bg-yellow-500"
                } px-5 rounded-full text-white`}
              >
                <span className="uppercase">{jobDetailsObject.status}</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    );

  return (
    <>
      <div className="block h-10 mb-3 flex justify-between">
        <ButtonComponent
          className="bg-green-500 text-white p-2 rounded"
          onClick={handleCreateJob}
        >
          Create Job
        </ButtonComponent>
        <div className="space-x-2">
          <div className="flex items-center">
            <p>Filter: </p>
            <Select
              options={statusOptions}
              defaultValue={statusOptions[0]}
              onChange={(option) => setStatus(option?.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-center my-3 block">
        <div
          className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 cursor-pointer"
          onClick={() => handleFirstPage(state.page)}
        >
          <span className="sr-only">Previous</span>
          <ChevronLeftIcon className="h-5 w-5" />
        </div>

        {createPagination().map((number, id) => {
          return (
            <div
              aria-current="page"
              className={`relative inline-flex items-center border ${
                state.page === number
                  ? "border-indigo-500 bg-indigo-50 z-10"
                  : "border-gray-300 bg-white cursor-pointer"
              } px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20`}
              onClick={() => setState({ ...state, page: number })}
              key={id}
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
      </div>

      {isLoading ? (
        <div className="">
          <LoadingComponent className="h-20 w-20 block rounded-full border-4 border-sky-400 border-t-white animate-spin" />
        </div>
      ) : (
        <div className="h-2/3">{showingJobs}</div>
      )}
    </>
  );
};

export default EmployerDashBoardPage;
