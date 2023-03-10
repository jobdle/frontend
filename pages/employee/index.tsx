import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";

import { getAllEmployees } from "../../services/EmployeeServices";
import Header from "../../components/Header";
import ButtonComponent from "../../components/ButtonComponent";
import { PhotoIcon } from "@heroicons/react/24/outline";
import LoadingComponent from "../../components/LoadingComponent";

function EmployeePage() {
  const [cookies] = useCookies(["token"]);
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [allEmployees, setAllEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState({});
  const [sortList, setSortList] = useState(["age", "status", "work", "gender"]);

  const fetchData = async () => {
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
      {isLoading ? (
        <div className="max-h-screen">
          <LoadingComponent className="w-28 h-28 border-4 border-gray-200 border-t-sky-500" />
        </div>
      ) : (
        <>
          <div className="flex justify-between my-3">
            <ButtonComponent
              className="p-2 rounded-md bg-green-500 text-white"
              onClick={() => router.push("employee/details/fill")}
            >
              Add Employee
            </ButtonComponent>
            <div className="flex space-x-2">
              <div>
                <span>Search: </span>
                <input
                  className="w-30"
                  value={search}
                  onChange={(e) => setSearch(e.target.value.trim())}
                  onKeyDown={(e) => {
                    if (e.key === "Enter")
                      setQuery({ ...query, search: search });
                  }}
                />
              </div>
              <div>
                <span>Status: </span>
                <select name="filter" id="">
                  <option value="status">Status</option>
                </select>
              </div>
              <div>
                <span>Sort: </span>
                <select
                  name="filter"
                  onChange={(e) => setQuery({ ...query, sort: e.target.value })}
                >
                  {sortList.map((item, id) => (
                    <option value={item} key={id}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <span>Order: </span>
                <select
                  name="filter"
                  id=""
                  onChange={(e) =>
                    setQuery({ ...query, order: e.target.value })
                  }
                >
                  <option value="desc">desc</option>
                  <option value="asc">asc</option>
                </select>
              </div>
            </div>
          </div>
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
