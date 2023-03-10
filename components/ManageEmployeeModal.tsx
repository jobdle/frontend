import React, { useEffect } from "react";
import { useCookies } from "react-cookie";
import { getAllEmployees } from "../services/EmployeeServices";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { manageJob } from "../services/JobServices";
import { useRouter } from "next/router";
import { PhotoIcon } from "@heroicons/react/24/outline";
import ButtonComponent from "./ButtonComponent";

interface Props {
  onClose: any;
  show: boolean;
  cancel: any;
  id: string | string[] | undefined;
  token: string;
}

export default function ManageEmployeeModal({
  onClose,
  show,
  cancel,
  id,
  token,
}: Props) {
  const [cookies] = useCookies(["token"]);
  const router = useRouter();

  const [allEmployees, setAllEmployees] = useState<Employee[]>([]);
  const [selectedEmployeeArray, setSelectedEmployeeArray] = useState<number[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!show) return;
    fetchData();
  }, [show]);

  const fetchData = async () => {
    const allEmployees = await getAllEmployees(cookies.token, undefined); // error must have query
    setAllEmployees(allEmployees.data);
  };

  const handleManageEmployees = async () => {
    setIsLoading(true);
    selectedEmployeeArray.sort();
    const selectedEmployees: Employee[] = selectedEmployeeArray.map(
      (index) => allEmployees[index]
    );
    console.log("SelectedEmployees", selectedEmployees);
    console.log("id", id);
    try {
      const response = await manageJob(
        id,
        { employee: selectedEmployees, status: "pending" },
        token
      );
      console.log(response);
      router.push("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Transition appear show={show} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => onClose(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-xl bg-white p-5 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Manage Employees
                  </Dialog.Title>
                  <div className="w-full bg-gray-100 rounded my-3 p-2 grid grid-cols-5 space-x-2">
                    {allEmployees.map((employee, index) => {
                      return (
                        <div
                          className={`${
                            selectedEmployeeArray.includes(index)
                              ? "outline outline-offset-2 outline-sky-500"
                              : ""
                          } bg-white flex flex-col items-center rounded-md hover:shadow-lg cursor-pointer p-2`}
                          key={employee._id}
                          onClick={() => {
                            if (selectedEmployeeArray.includes(index)) {
                              setSelectedEmployeeArray(
                                selectedEmployeeArray.filter(
                                  (element) => element !== index
                                )
                              );
                            } else {
                              setSelectedEmployeeArray([
                                ...selectedEmployeeArray,
                                index,
                              ]);
                            }
                          }}
                        >
                          <div
                            className={`h-32 w-32 bg-gray-100 rounded-full bg-no-repeat bg-cover bg-center flex justify-center items-center border-sky-500 border-2`}
                            style={{
                              backgroundImage: `url(${employee.profileImageUrl})`,
                            }}
                          >
                            {employee.profileImageUrl ? null : (
                              <div>
                                <PhotoIcon className="w-auto" />
                                <p>No Image</p>
                              </div>
                            )}
                          </div>
                          <div
                            id="details"
                            className="flex flex-col items-center"
                          >
                            <span>
                              {employee.firstname} {employee.lastname}
                            </span>
                            <span className="text-gray-400">
                              Front Developer
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-4 flex justify-end space-x-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={cancel}
                    >
                      Cancel
                    </button>
                    <ButtonComponent
                      type="button"
                      className="inline-flex justify-center rounded border border-transparent bg-sky-100 px-4 py-2 text-sm font-medium text-sky-900 hover:bg-sky-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={handleManageEmployees}
                      isLoading={isLoading}
                      disabled={isLoading}
                    >
                      Manage
                    </ButtonComponent>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
