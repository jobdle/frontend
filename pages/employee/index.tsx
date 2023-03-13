import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";

import { getAllEmployees } from "../../services/EmployeeServices";
import Header from "../../components/Header";
import ButtonComponent from "../../components/ButtonComponent";
import { PhotoIcon } from "@heroicons/react/24/outline";
import LoadingComponent from "../../components/LoadingComponent";
import ReactSelect from "react-select";

const sortOptions = [
  { value: "birthday", label: "age" },
  { value: "work", label: "work" },
  { value: "gender", label: "gender" },
];

const orderOptions = [
  { value: "desc", label: "Desc" },
  { value: "asc", label: "Asc" },
];

function EmployeePage() {
  const [cookies] = useCookies(["token"]);
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [allEmployees, setAllEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState({});
  const [sortList, setSortList] = useState(["age", "status", "work", "gender"]);

  const fetchData = async () => {
    console.log("query", query);
    setIsLoading(true);
    try {
      const { data } = await getAllEmployees(cookies.token, query);
      setAllEmployees(data);
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [query]);

  return (
    <>
      <Header title="Employee" />
      <div className="flex justify-between my-3 flex-wrap">
        <ButtonComponent
          className="p-2 rounded-md bg-green-500 text-white"
          onClick={() => router.push("employee/details/fill")}
        >
          Add Employee
        </ButtonComponent>
        <div className="flex space-x-2 items-center flex-wrap">
          <div className="flex flex items-center flex-wrap">
            <span>Search: </span>
            <input
              className="w-30 px-2"
              value={search}
              onChange={(e) => setSearch(e.target.value.trim())}
              onKeyDown={(e) => {
                if (e.key === "Enter") setQuery({ ...query, search: search });
              }}
            />
          </div>
          <div className="flex items-center flex-wrap">
            <span>Sort: </span>
            <ReactSelect
              options={sortOptions}
              onChange={(option: any) =>
                setQuery({ ...query, sort: option.value })
              }
            />
          </div>
          <div className="flex items-center flex-wrap">
            <span>Order: </span>
            <ReactSelect
              options={orderOptions}
              defaultValue={orderOptions[0]}
              onChange={(option: any) =>
                setQuery({ ...query, order: option.value })
              }
            />
          </div>
        </div>
      </div>
      {isLoading ? (
        <div className="max-h-screen">
          <LoadingComponent className="w-28 h-28 border-4 border-gray-200 border-t-sky-500" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {allEmployees.map((employee) => (
              <div
                className="bg-white flex flex-col items-center rounded-md hover:shadow-lg cursor-pointer p-2"
                onClick={() => router.push(`employee/details/${employee._id}`)}
                key={employee._id}
              >
                <div id="image" className="flex justify-center py-2">
                  <div
                    className={`h-32 w-32 bg-gray-100 rounded-full bg-no-repeat bg-cover bg-center flex justify-center items-center border-2 border-sky-500`}
                    style={{
                      backgroundImage: `url(${employee.profileImageUrl})`,
                    }}
                  >
                    {employee.profileImageUrl ? null : (
                      <div>
                        <PhotoIcon className="w-auto" />
                        <span>No Image</span>
                      </div>
                    )}
                  </div>
                </div>
                <div id="details" className="flex flex-col items-center">
                  <span>
                    {employee.firstname} {employee.lastname}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}

export default EmployeePage;
