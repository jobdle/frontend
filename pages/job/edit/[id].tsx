import { PhotoIcon } from "@heroicons/react/24/outline";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { useForm } from "react-hook-form";
import ButtonComponent from "../../../components/ButtonComponent";

import Header from "../../../components/Header";
import ManageEmployeeEditModal from "../../../components/ManageEmployeeEditModal";
import ManageEmployeeModal from "../../../components/ManageEmployeeModal";
import { getAllCategories } from "../../../services/CategoryServices";
import { editJob, getJob } from "../../../services/JobServices";
import { splitTFromISO } from "../../../services/UtilsServices";

const defaultValue = {
  pictureUrl: [""],
  title: "",
  detail: "",
  category: {
    name: "",
    minWage: 0,
  },
  note: "",
  location: "",
  deadline: "",
  status: "",
  employee: [],
};

const EditDescriptionJobPage: NextPage = () => {
  const [cookies] = useCookies(["token"]);
  const router = useRouter();
  const { id } = router.query;

  const [jobDetailsObject, setJobDetailsObject] = useState<JobEditable>();
  const [employees, setEmployees] = useState([]);
  const [showManageModal, setShowManageModal] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<JobEditable>({ defaultValues: jobDetailsObject });

  const [files, setFiles] = useState<File[]>([]);
  const filesCountRef = useRef<number>(0);

  const handleChangeFile = (event: any) => {
    const filesArray: File[] = Array.from(event.target.files);
    filesCountRef.current += filesArray.length;
    if (filesCountRef.current > 5) {
      filesCountRef.current -= filesArray.length;
      alert("Maximum is 5 pictures.");
      event.target.value = [];
      return;
    }
    setFiles([...files, ...filesArray]);
  };

  // const handleSelectChange = (myStringifyObject: string) => {
  //   const prasedObject = JSON.parse(myStringifyObject);
  //   setJobDetailsObject({ ...jobDetailsObject, category: prasedObject });
  // };

  // const handleDateChage = (date: any) => {
  //   setJobDetailsObject({ ...jobDetailsObject, deadline: date });
  // };

  const onEditjob = handleSubmit(async (data: JobEditable) => {
    if (!id) return;
    await editJob(id, { ...data, employee: employees }, cookies.token);
    router.push(`/job/details/${id}`);
  });

  const fetchData = async () => {
    try {
      if (id) {
        const response = await getJob(id, cookies.token);
        setJobDetailsObject(response.data);
        setEmployees(response.data.employee);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deletePicture = (name: string) => {
    setFiles(files.filter((file) => file.name !== name));
    filesCountRef.current -= 1;
  };

  useEffect(() => {
    fetchData();
  }, [router]);

  useEffect(() => {
    if (jobDetailsObject) {
      reset({
        ...jobDetailsObject,
        deadline: splitTFromISO(jobDetailsObject.deadline),
      });
    }
    setEmployees(jobDetailsObject?.employee);
  }, [jobDetailsObject]);

  if (!jobDetailsObject) return null;

  const BlockFieldStyles = "sm:grid sm:grid-cols-5 items-center";
  const LabelStyles = "font-bold col-span-1 self-center";
  const InputFieldStyles =
    "border-2 border-gray-200 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500 col-span-4";

  return (
    <>
      <Header title="Edit job details" />

      <form id="hook-form" onSubmit={onEditjob}>
        <div className="bg-white p-4 rounded-md space-y-2">
          <div className={BlockFieldStyles}>
            <p className={LabelStyles}>Title </p>
            <input
              type="text"
              className={InputFieldStyles}
              required
              {...register("title", {
                required: "This is required.",
              })}
            />
            <p></p>
            <p className="text-red-500">{errors.title?.message}</p>
          </div>
          <div className={BlockFieldStyles}>
            <p className={LabelStyles}>Detail </p>
            <textarea
              className={InputFieldStyles}
              rows={10}
              {...register("detail", {
                required: "This is required.",
              })}
            />
          </div>
          <div className={BlockFieldStyles}>
            <p className={LabelStyles}>Category </p>
            <div className="col-span-4">
              <p>
                {jobDetailsObject.category.name}{" "}
                <span className="text-red-500 text-xs">* Can't Change</span>
              </p>
            </div>
          </div>
          <div className={BlockFieldStyles}>
            <p className={LabelStyles}>Wage </p>
            <input
              type="text"
              className={InputFieldStyles}
              {...register("category.minWage", {
                required: "This is required.",
              })}
              // name="location"
              // onChange={handleChange}
              required
            />
          </div>
          <div className={BlockFieldStyles}>
            <p className={LabelStyles}>Location </p>
            <input
              type="text"
              className={InputFieldStyles}
              {...register("location", {
                required: "This is required.",
              })}
              // name="location"
              // onChange={handleChange}
              required
            />
          </div>
          <div className={BlockFieldStyles}>
            <p className={LabelStyles}>Deadline </p>
            <input
              type="date"
              className={InputFieldStyles}
              {...register("deadline", {
                required: "This is required.",
              })}
            />
          </div>
          <div className={BlockFieldStyles}>
            <div className="">
              <p className={LabelStyles}>Employee </p>
              <ButtonComponent
                className="border bg-yellow-400 px-2 text-white"
                onClick={() => setShowManageModal(true)}
                type="button"
              >
                Edit
              </ButtonComponent>
            </div>
            <div className="col-span-4">
              <div className="grid lg:grid-cols-4 sm:grid-cols-3 grid-cols-1 gap-1">
                {employees.map((employee) => {
                  return (
                    <div
                      className="border bg-white flex flex-col items-center rounded-md hover:shadow-lg cursor-pointer p-2 col-span-1"
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
                  );
                })}
              </div>
            </div>
          </div>
          <div className="py-2">
            <div className="flex flex-col">
              <div className="">
                <p className="font-bold">
                  Pictures (at most 5 photos ){filesCountRef.current}
                </p>
              </div>
              <div className="w-full flex bg-gray-100 rounded-md flex-wrap">
                {/* EDIT!! */}
                {jobDetailsObject.pictureUrl.map((file, id) => (
                  <div
                    className={`h-40 w-40 m-2 rounded-md bg-no-repeat bg-cover bg-center flex justify-center items-center relative`}
                    style={{
                      backgroundImage: `url(${file})`,
                    }}
                    key={id}
                  >
                    <div
                      className="absolute -right-2 -top-2 rounded-full w-5 h-5 bg-red-500 cursor-pointer font-bold flex justify-center items-center text-white text-xs"
                      onClick={() => deletePicture(file)}
                    >
                      X
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-5 my-3">
                <input
                  type="file"
                  id="edit-avatar"
                  onChange={handleChangeFile}
                  accept="image/*"
                  className="w-full m-auto bg-gray-100"
                  multiple
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-2">
          <button
            className="bg-red-500 rounded-md p-2 text-white"
            onClick={() => router.push(`/job/details/${id}`)}
          >
            Cancel
          </button>
          <button
            className="bg-yellow-500 rounded-md py-2 px-3 text-white"
            type="submit"
            form="hook-form"
          >
            Edit
          </button>
        </div>
      </form>

      <ManageEmployeeEditModal
        onClose={setShowManageModal}
        show={showManageModal}
        cancel={() => setShowManageModal(false)}
        id={id}
        token={cookies.token}
        setEmployees={setEmployees}
      />
    </>
  );
};

export default EditDescriptionJobPage;
