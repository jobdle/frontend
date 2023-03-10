import { useRouter } from "next/router";
import React, { FormEvent, useEffect, useState } from "react";
import { useCookies } from "react-cookie";

import { editEmployee, getEmployee } from "../../../services/EmployeeServices";
import Header from "../../../components/Header";
import { handleUpload, splitTFromISO } from "../../../services/UtilsServices";
import { PhotoIcon } from "@heroicons/react/24/outline";
import ButtonComponent from "../../../components/ButtonComponent";
import { Controller, useForm } from "react-hook-form";
import ReactSelect from "react-select";
import ErrorMessage from "../../../components/ErrorMessage";

const defaultValue = {
  profileImageUrl: "",
  firstname: "",
  lastname: "",
  email: "",
  tel: "",
  birthday: "",
  gender: "",
  detail: "",
};

const genderListOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];

const EmployeedetailsPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [cookies] = useCookies(["token"]);

  const [employeeDetailsObject, setEmployeeDetailsObject] =
    useState<EmployeeEditable>();
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({ defaultValues: employeeDetailsObject });

  const [file, setFile] = useState<File>();
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    try {
      if (id) {
        const response = await getEmployee(id, cookies.token);
        setEmployeeDetailsObject(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [router]);

  useEffect(() => {
    if (employeeDetailsObject) {
      reset({
        ...employeeDetailsObject,
        birthday: splitTFromISO(employeeDetailsObject.birthday),
      });
    }
  }, [employeeDetailsObject]);

  // const handleDateChage = (date: any) => {
  //   setEmployeeDetailsObject({ ...employeeDetailsObject, birthday: date });
  // };

  // const handleChange = (e: any) => {
  //   setEmployeeDetailsObject((prev) => ({
  //     ...prev,
  //     [e.target.name]: e.target.value,
  //   }));
  // };

  function handleChangeFile(event: any) {
    setFile(event.target.files[0]);
  }

  // const handleSubmit = async (e: FormEvent) => {
  //   setIsLoading(true);
  //   e.preventDefault();
  //   let submitedData = employeeDetailsObject;
  //   if (!submitedData) return;
  //   if (file) {
  //     try {
  //       const profileImageUrl = await handleUpload(file);
  //       submitedData.profileImageUrl = profileImageUrl;
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   }
  //   console.log("submitedData", submitedData);
  //   await editEmployee(id, submitedData, cookies.token);
  //   router.push(`/employee/details/${id}`);
  // };

  const onSubmit = handleSubmit(async (data) => {
    console.log(data);
    setIsLoading(true);
    let submitedData = data;
    if (!submitedData) return;
    if (file) {
      try {
        const profileImageUrl = await handleUpload(file);
        submitedData.profileImageUrl = profileImageUrl;
      } catch (error) {
        console.error(error);
      }
    }
    console.log("submitedData", submitedData);
    try {
      const response = await editEmployee(id, submitedData, cookies.token);
      console.log(response);
      router.push(`/employee/details/${id}`);
    } catch (error) {
      console.error(error);
    }
  });

  const defaultValueGender = (gender: string) => {
    if (gender === "male") {
      return 0;
    } else {
      return 1;
    }
  };

  if (employeeDetailsObject === undefined) return null;

  return (
    <>
      <Header title="Edit Employee" />
      <form onSubmit={onSubmit}>
        <div className="flex flex-col lg:flex lg:flex-row bg-white py-5 rounded-md shadow">
          <div className="flex flex-col items-center lg:w-1/2">
            <div
              className={`h-60 w-60 bg-gray-100 rounded-full bg-no-repeat bg-cover bg-center flex justify-center items-center`}
              style={{
                backgroundImage: `url(${
                  file
                    ? URL.createObjectURL(file)
                    : employeeDetailsObject.profileImageUrl
                })`,
              }}
            >
              {file || employeeDetailsObject.profileImageUrl ? null : (
                <div>
                  <PhotoIcon className="w-auto" />
                  <p>No Image</p>
                </div>
              )}
            </div>
            <div className="px-5 my-3">
              <input
                type="file"
                id="edit-avatar"
                onChange={handleChangeFile}
                accept="image/*"
                className="w-full m-auto bg-gray-100"
              />
            </div>
          </div>
          <div className="px-5 lg:w-2/3">
            <div>
              <div>
                <div className="mb-3 lg:flex">
                  <div className="lg:flex-1 lg:mr-3">
                    <label className="block font-medium text-gray-700 my-1">
                      First name
                    </label>
                    <input
                      className="border-2 border-gray-200 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
                      type="text"
                      placeholder=""
                      {...register("firstname", {
                        required: "This is required.",
                      })}
                    />
                    <ErrorMessage>{errors.firstname?.message}</ErrorMessage>
                  </div>
                  <div className="lg:flex-1">
                    <label className="block font-medium text-gray-700 my-1">
                      Surname
                    </label>
                    <input
                      className="border-2 border-gray-200 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
                      type="text"
                      placeholder=""
                      {...register("lastname", {
                        required: "This is required.",
                      })}
                    />
                    <ErrorMessage>{errors.lastname?.message}</ErrorMessage>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="block font-medium text-gray-700 my-1">
                    Email address
                  </label>
                  <input
                    className="border-2 border-gray-200 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
                    type="email"
                    placeholder="Your email"
                    {...register("email", { required: "This is required." })}
                  />
                  <ErrorMessage>{errors.email?.message}</ErrorMessage>
                </div>
                <div className="mb-3">
                  <label className="block font-medium text-gray-700 my-1">
                    Tel.
                  </label>
                  <input
                    className="border-2 border-gray-200 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
                    type="tel"
                    placeholder=""
                    {...register("tel", {
                      required: "This is required.",
                      pattern: {
                        value:
                          /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
                        message: "Please type phone number correctly.",
                      },
                    })}
                  />
                  <ErrorMessage>{errors.tel?.message}</ErrorMessage>
                </div>
                <div className="mb-3 lg:flex">
                  <div className="lg:flex-1 lg:mr-3">
                    <label className="block font-medium text-gray-700 my-1">
                      Birthday
                    </label>
                    <input
                      type="date"
                      className="border-2 border-gray-200 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
                      {...register("birthday", {
                        required: "This is required.",
                      })}
                    />
                    <ErrorMessage>{errors.birthday?.message}</ErrorMessage>
                  </div>
                  <div className="lg:flex-1">
                    <label className="block font-medium text-gray-700 my-1">
                      Gender
                    </label>
                    <Controller
                      name="gender"
                      control={control}
                      rules={{ required: "This is required." }}
                      render={({ field: { onChange } }) => (
                        <ReactSelect
                          onChange={(option: any) => {
                            console.log(option);
                            onChange(option.value);
                          }}
                          options={genderListOptions}
                          defaultValue={
                            genderListOptions[
                              defaultValueGender(employeeDetailsObject.gender)
                            ]
                          }
                        />
                      )}
                    />
                    <ErrorMessage>{errors.gender?.message}</ErrorMessage>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end pt-2">
          <ButtonComponent
            type="submit"
            className="p-2 bg-yellow-500 rounded-md text-white"
            disabled={isLoading}
            isLoading={isLoading}
          >
            Edit
          </ButtonComponent>
        </div>
      </form>
    </>
  );
};

export default EmployeedetailsPage;
