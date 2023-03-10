import { ArrowUpTrayIcon, PhotoIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import React, { FormEvent, useState } from "react";
import { useCookies } from "react-cookie";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import ButtonComponent from "../../../components/ButtonComponent";
import ErrorMessage from "../../../components/ErrorMessage";

import Header from "../../../components/Header";
import { postEmployee } from "../../../services/EmployeeServices";
import { handleUpload } from "../../../services/UtilsServices";

interface IdefaultValue {
  profileImageUrl: string;
  firstname: string;
  lastname: string;
  email: string;
  tel: string;
  birthday: string;
  gender: string;
  detail: string;
}

const defaultValue: IdefaultValue = {
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

function FillEmployeeDetailPage() {
  const [cookies] = useCookies(["token"]);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({ defaultValues: defaultValue });

  // const [employeeDetailsObject, setEmployeeDetailsObject] =
  //   useState<EmployeeEditable>(defaultValue);
  const [file, setFile] = useState<File>();
  const [isLoading, setLoading] = useState(false);

  function handleChangeFile(event: any) {
    setFile(event.target.files[0]);
  }

  const onSubmit = handleSubmit(async (data) => {
    console.log(data);
    setLoading(true);
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
      const response = await postEmployee(submitedData, cookies.token);
      console.log(response);
      router.push("/employee");
    } catch (error) {
      console.log(error);
    }
  });

  return (
    <>
      <Header title="Fill Employee Details" />
      <form onSubmit={onSubmit}>
        <div className="flex flex-col lg:flex lg:flex-row bg-white py-5 rounded-md shadow">
          <div className="flex flex-col items-center lg:w-1/3">
            <div
              className={`h-60 w-60 bg-gray-100 rounded-full bg-no-repeat bg-cover bg-center flex justify-center items-center`}
              style={{
                backgroundImage: `url(${
                  file ? URL.createObjectURL(file) : null
                })`,
              }}
            >
              {file ? null : (
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
          <div className="mx-5 lg:w-2/3">
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
                    type="text"
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
                      className="border-2 border-gray-200 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
                      type="date"
                      placeholder=""
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
                        <Select
                          onChange={(option: any) => onChange(option.value)}
                          options={genderListOptions}
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
            className="p-2 bg-sky-500 rounded-md text-white"
            isLoading={isLoading}
            disabled={isLoading}
          >
            Create
          </ButtonComponent>
        </div>
      </form>
    </>
  );
}

export default FillEmployeeDetailPage;
