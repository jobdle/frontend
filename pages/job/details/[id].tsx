import { useEffect, useState } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";

import { deleteJob, editJob, getJob } from "../../../services/JobServices";
import { useUser } from "../../../contexts/User";
import Header from "../../../components/Header";
import { dateFormat } from "../../../services/UtilsServices";
import ManageEmployeeModal from "../../../components/ManageEmployeeModal";
import DeleteJobModal from "../../../components/DeleteJobModal";
import ComfirmModal from "../../../components/SuccessJobModal";
import { PhotoIcon } from "@heroicons/react/24/outline";

const JobDetailsPage: NextPage = () => {
  const [cookies] = useCookies(["token"]);
  const router = useRouter();
  const { id } = router.query;
  const { userData } = useUser();

  const [showManageModal, setShowManageModal] = useState(false);
  const [showDeleteJobModal, setShowDeleteJobModal] = useState(false);
  const [showSuccessJobModal, setShowSuccessJobModal] = useState(false);
  const [jobDetailsObject, setJobDetailsObject] = useState<Job>();

  const pushEditJobDetails = () => {
    router.push(`/job/edit/${id}`);
  };

  const fetchData = async () => {
    try {
      if (id) {
        const { data } = await getJob(id, cookies.token);
        // const prasedData = JSON.parse(data);
        setJobDetailsObject(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [router]);

  const handleDelete = async () => {
    try {
      await deleteJob(id, cookies.token);
      router.push("/");
    } catch (err) {
      console.error(err);
    }
  };

  const handleManageJob = () => {
    try {
      setShowManageModal(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSuccussJob = async () => {
    try {
      const response = await editJob(id, { status: "done" }, cookies.token);
      console.log(response);
      router.push("/");
    } catch (err) {
      console.error(err);
    }
  };

  if (!jobDetailsObject) return null;

  if (!userData) return null;

  const BlockFieldStyles = "items-center sm:grid sm:grid-cols-5 py-1";
  const LabelStyles = "font-bold col-span-1 text-sky-700";
  const DetailStyles = "w-full sm:col-span-4";

  return (
    <>
      <Header title="Job details" />
      <hr className="my-3" />
      <div className="bg-white px-5 py-2 rounded-md divide-y">
        <div className={BlockFieldStyles}>
          <p className={LabelStyles}>Employer </p>
          <p className={DetailStyles}>{jobDetailsObject.fullname}</p>
        </div>
        <div className={BlockFieldStyles}>
          <p className={LabelStyles}>Title </p>
          <p className={DetailStyles}>{jobDetailsObject.title}</p>
        </div>
        <div className={BlockFieldStyles}>
          <p className={LabelStyles}>Detail </p>
          <p className={DetailStyles}>{jobDetailsObject.detail}</p>
        </div>
        <div className={BlockFieldStyles}>
          <p className={LabelStyles}>Category </p>
          <p
            className={DetailStyles}
            style={{
              color: `${jobDetailsObject.category.color}`,
              fontWeight: "bold",
            }}
          >
            {jobDetailsObject.category.name}
          </p>
        </div>
        <div className={BlockFieldStyles}>
          <p className={LabelStyles}>Min wage </p>
          <p className={DetailStyles}>{jobDetailsObject.category.minWage} </p>
        </div>
        <div className={BlockFieldStyles}>
          <p className={LabelStyles}>Location </p>
          <p className={DetailStyles}>{jobDetailsObject.location}</p>
        </div>
        <div className={BlockFieldStyles}>
          <p className={LabelStyles}>Deadline </p>
          <p className={DetailStyles}>
            {dateFormat(new Date(jobDetailsObject.deadline))}
          </p>
        </div>
        <div className={BlockFieldStyles}>
          <p className={LabelStyles}>Status </p>
          <p className={DetailStyles}>{jobDetailsObject.status}</p>
        </div>
        {jobDetailsObject.status === "pending" ? (
          <div className={`${BlockFieldStyles}`}>
            <p className={LabelStyles}>Employee </p>
            <div className={DetailStyles}>
              <div className="grid grid-cols-3 lg:grid-cols-4 gap-2">
                {jobDetailsObject.employee.map((employee) => (
                  <div
                    className="border bg-white flex flex-col items-center rounded-md hover:shadow-lg cursor-pointer p-2"
                    key={employee._id}
                  >
                    <div
                      className={`h-32 w-32 bg-gray-100 rounded-full bg-no-repeat bg-cover bg-center flex justify-center items-center`}
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
                    <div id="details" className="flex flex-col items-center">
                      <span>
                        {employee.firstname} {employee.lastname}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
        <div className="w-full">
          <p className={LabelStyles}>Pictures </p>
          <div className="flex flex-wrap">
            {jobDetailsObject.pictureUrl.map((url) => (
              <div
                className={`h-40 w-40 m-2 rounded-md bg-no-repeat bg-cover bg-center flex justify-center items-center relative`}
                style={{
                  backgroundImage: `url(${url})`,
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>

      <div
        className={`${
          jobDetailsObject.status === "done" || // job status => done
          jobDetailsObject.status === "cancel" || // job status => cancel
          (jobDetailsObject.status === "pending" && userData.role === "user") // job status => pending & role => user
            ? "hidden"
            : ""
        } flex justify-between`}
      >
        <div className="space-x-2">
          <button
            className="bg-yellow-500 hover:bg-yellow-400 rounded-md p-2 text-white w-20 mt-2"
            onClick={pushEditJobDetails}
          >
            Edit
          </button>
          <button
            className="bg-red-500 hover:bg-red-400 rounded-md p-2 text-white w-20 mt-2"
            onClick={() => setShowDeleteJobModal(true)}
          >
            Delete
          </button>
        </div>
        {userData.role === "admin" && jobDetailsObject.status === "new" ? (
          <div>
            <button
              className="bg-sky-500 hover:bg-sky-400 rounded-md p-2 text-white w-20 mt-2"
              onClick={handleManageJob}
            >
              Manage
            </button>
          </div>
        ) : null}
        {userData.role === "admin" && jobDetailsObject.status === "pending" ? (
          <div>
            <button
              className="bg-green-500 hover:bg-green-400 rounded-md p-2 text-white w-20 mt-2"
              onClick={() => setShowSuccessJobModal(true)}
            >
              Succuss
            </button>
          </div>
        ) : null}
      </div>

      <ManageEmployeeModal
        onClose={setShowManageModal}
        show={showManageModal}
        cancel={() => setShowManageModal(false)}
        id={id}
        token={cookies.token}
      />

      <DeleteJobModal
        onClose={setShowDeleteJobModal}
        show={showDeleteJobModal}
        cancel={() => setShowDeleteJobModal(false)}
        confirm={handleDelete}
      />

      <ComfirmModal
        onClose={setShowSuccessJobModal}
        show={showSuccessJobModal}
        cancel={() => setShowSuccessJobModal(false)}
        confirm={handleSuccussJob}
        title="Are you sure you success this job ?"
        cancelButtonValue="Cancel"
        confirmButtonValue="Confirm"
        confirmButtonColor="green"
      />
    </>
  );
};

export default JobDetailsPage;
