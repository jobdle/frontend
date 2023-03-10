import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

import { useUser } from "../../../contexts/User";
import {
  deleteEmployee,
  getEmployee,
} from "../../../services/EmployeeServices";
import ComfirmModal from "../../../components/SuccessJobModal";
import Header from "../../../components/Header";
import { dateFormat } from "../../../services/UtilsServices";
import { PhotoIcon } from "@heroicons/react/24/outline";

const EmployeedetailsPage = () => {
  const [cookies] = useCookies(["token"]);
  const router = useRouter();
  const { id } = router.query;
  const { userData } = useUser();

  const [employeeDetailsObject, setEmployeeDetailsObject] =
    useState<Employee>();
  const [showDeleteEmployeeModal, setShowDeleteEmployeeModal] = useState(false);

  const fetchData = async () => {
    try {
      if (id) {
        const { data } = await getEmployee(id, cookies.token);
        setEmployeeDetailsObject(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [router]);

  const handleDeleteEmployee = async () => {
    await deleteEmployee(id, cookies.token);
    router.push("/employee");
  };

  const pushEditEmployee = () => {
    router.push(`/employee/edit/${id}`);
  };

  const calculateAge = () => {
    if (!employeeDetailsObject?.birthday) return;
    var today = new Date();
    var birthDate = new Date(employeeDetailsObject?.birthday);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  if (employeeDetailsObject === undefined) return null;

  if (userData === undefined) return null;

  return (
    <>
      <Header title="Employee details" />
      <div className="flex flex-col lg:flex lg:flex-row bg-white py-5 rounded-md">
        <div className="flex justify-center px-5 pb-5" id="picture">
          <div
            className={`h-60 w-60 bg-gray-100 rounded-full bg-no-repeat bg-cover bg-center flex justify-center items-center border-4 border-sky-500`}
            style={{
              backgroundImage: `url(${employeeDetailsObject.profileImageUrl})`,
            }}
          >
            {employeeDetailsObject.profileImageUrl ? null : (
              <div>
                <PhotoIcon className="w-auto" />
                <p>No Image</p>
              </div>
            )}
          </div>
        </div>
        <div className="px-5 lg:w-2/3 divide-y">
          <div className="sm:grid sm:grid-cols-4 py-1">
            <p className="font-bold col-span-1">ชื่อ - นามสกุล </p>
            <p className="w-full sm:col-span-3">
              {employeeDetailsObject.firstname} {employeeDetailsObject.lastname}
            </p>
          </div>
          <div className="sm:grid sm:grid-cols-4 py-1">
            <p className="font-bold col-span-1">Email </p>
            <p className="w-full sm:col-span-3">
              {employeeDetailsObject.email}
            </p>
          </div>
          <div className="sm:grid sm:grid-cols-4 py-1">
            <p className="font-bold col-span-1">Gender </p>
            <p className="w-full sm:col-span-3">
              {employeeDetailsObject.gender}
            </p>
          </div>
          <div className="sm:grid sm:grid-cols-4 py-1">
            <p className="font-bold col-span-1">Tel. </p>
            <p className="w-full sm:col-span-3">{employeeDetailsObject.tel}</p>
          </div>
          <div className="sm:grid sm:grid-cols-4 py-1">
            <p className="font-bold col-span-1">Age </p>
            <p className="w-full sm:col-span-3">
              {calculateAge()}{" "}
              <span className="text-gray-400">
                (Birthday:{" "}
                {dateFormat(new Date(employeeDetailsObject.birthday))})
              </span>
            </p>
          </div>
          <div className="sm:grid sm:grid-cols-4 py-1">
            <p className="font-bold col-span-1">Works </p>
            <div className="w-full sm:col-span-3">
              {employeeDetailsObject.works.map((work: any) => (
                <div className="border rounded-md w-full sm:col-span-3">{work.title}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {userData.role === "admin" ? (
        <div className="flex justify-end space-x-2 mt-3">
          <button
            className="p-2 bg-yellow-500 rounded-md text-white"
            onClick={pushEditEmployee}
          >
            Edit
          </button>
          <button
            className="p-2 bg-red-500 rounded-md text-white"
            onClick={() => setShowDeleteEmployeeModal(true)}
          >
            Delete
          </button>
        </div>
      ) : null}

      <ComfirmModal
        onClose={setShowDeleteEmployeeModal}
        show={showDeleteEmployeeModal}
        cancel={() => setShowDeleteEmployeeModal(false)}
        confirm={handleDeleteEmployee}
        title="Are you sure you delete this employee ?"
        cancelButtonValue="Cancel"
        confirmButtonValue="Confirm"
        confirmButtonColor="red"
      />
    </>
  );
};

export default EmployeedetailsPage;
