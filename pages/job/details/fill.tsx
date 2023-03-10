import { NextPage } from "next";
import { useRouter } from "next/router";
import {useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { useForm } from "react-hook-form";

import { getAllCategories } from "../../../services/CategoryServices";
import { postJob } from "../../../services/JobServices";
import { handleUpload, splitTFromISO } from "../../../services/UtilsServices";
import Header from "../../../components/Header";
import ButtonComponent from "../../../components/ButtonComponent";

interface IdefaultValue {
  pictureUrl: string[];
  title: string;
  detail: string;
  category: {
    name: string;
    minWage: number;
    color: string;
  };
  location: string;
  deadline: string;
}

const defaultValue: IdefaultValue = {
  pictureUrl: [""],
  title: "",
  detail: "",
  category: {
    name: "",
    minWage: 0,
    color: "",
  },
  location: "",
  deadline: "",
};

const FillDescriptionJobPage: NextPage = () => {
  const [cookies] = useCookies(["token"]);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: defaultValue });
  const [isLoading, setIsLoading] = useState(false);

  const [categoryObjects, setCategoryObjects] = useState([]);
  const [files, setFiles] = useState<File[]>([]);
  const filesCountRef = useRef<number>(0);

  const fetchAllCategories = async () => {
    const { data } = await getAllCategories(cookies.token);
    setCategoryObjects(data);
  };

  useEffect(() => {
    fetchAllCategories();
    console.log(files);
  }, []);

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
    console.log(filesArray);
  };

  const onPostJob = handleSubmit(async (data) => {
    setIsLoading(true);
    if (!data) return;
    let submitedData = data;
    console.log(
      "submitedData.category",
      typeof submitedData.category,
      submitedData.category
    );
    submitedData.category = JSON.parse(submitedData.category);

    if (files) {
      const allPromises = files.map((file) => handleUpload(file));

      await Promise.all(allPromises).then(async (result) => {
        try {
          submitedData.pictureUrl = result;
          const response = await postJob(submitedData, cookies.token);
          console.log(response);
          router.push(`${response.data._id}`);
        } catch (error) {
          console.error(error);
        }
      });
    }
    console.log("submitedData", submitedData);
  });

  const deletePicture = (name: string) => {
    console.log("h", name);
    setFiles(files.filter((file) => file.name !== name));
    filesCountRef.current -= 1;
  };

  const BlockFieldStyles = "sm:grid sm:grid-cols-5 items-center";
  const LabelStyles = "font-bold col-span-1";
  const InputFieldStyles =
    "border-2 border-gray-200 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500 col-span-4";

  if (!categoryObjects) return null;

  return (
    <div>
      <Header title="Fill job details" />

      <form onSubmit={onPostJob}>
        <div className="bg-white p-4 rounded-md space-y-2">
          <div className={BlockFieldStyles}>
            <p className={LabelStyles}>Title </p>
            <input
              type="text"
              className={InputFieldStyles}
              {...register("title", { required: "This is required." })}
            />
            <p></p>
            <p className="text-red-500">{errors.title?.message}</p>
          </div>

          <div className={BlockFieldStyles}>
            <p className={LabelStyles}>Detail </p>
            <textarea
              className={InputFieldStyles}
              rows={10}
              {...register("detail", { required: "This is required." })}
            />
            <p></p>
            <p className="text-red-500">{errors.detail?.message}</p>
          </div>
          <div className={BlockFieldStyles}>
            <p className={LabelStyles}>Category </p>
            <select
              className={`${InputFieldStyles} cursor-pointer`}
              {...register("category", { required: "This is required." })}
            >
              <option value="">โปรดเลือก</option>
              {categoryObjects.map((category: any, id) => {
                return (
                  <option value={JSON.stringify(category)} key={id}>
                    {category.name} | minWage: {category.minWage}
                  </option>
                );
              })}
            </select>
            <p></p>
            <p className="text-red-500">{errors.category?.message}</p>
          </div>
          <div className={BlockFieldStyles}>
            <p className={LabelStyles}>Location </p>
            <input
              type="text"
              className={InputFieldStyles}
              {...register("location", { required: "This is required." })}
            />
            <p></p>
            <p className="text-red-500">{errors.location?.message}</p>
          </div>
          <div className={BlockFieldStyles}>
            <p className={LabelStyles}>Deadline </p>
            <input
              type="date"
              className={InputFieldStyles}
              min={splitTFromISO(new Date().toISOString())}
              {...register("deadline", { required: "This is required." })}
            />
            <p></p>
            <p className="text-red-500">{errors.deadline?.message}</p>
          </div>
          <div className="py-2">
            <div className="flex flex-col">
              <div className="">
                <p className="font-bold">Pictures (at most 5 photos )</p>
              </div>
              <div className="w-full flex bg-gray-100 rounded-md flex-wrap">
                {files.map((file, id) => (
                  <div
                    className={`h-40 w-40 m-2 rounded-md bg-no-repeat bg-cover bg-center flex justify-center items-center relative`}
                    style={{
                      backgroundImage: `url(${
                        file ? URL.createObjectURL(file) : null
                      })`,
                    }}
                    key={id}
                  >
                    <div
                      className="absolute -right-1 -top-2 rounded-full p-0 m-0 cursor-pointer font-bold flex justify-center items-center text-red-500"
                      onClick={() => deletePicture(file.name)}
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
        <div className="flex justify-end mt-2">
          <ButtonComponent
            className="bg-sky-600 hover:bg-sky-400 rounded-md p-2 text-white"
            type="submit"
            isLoading={isLoading}
            disable={isLoading}
          >
            Create
          </ButtonComponent>
        </div>
      </form>
    </div>
  );
};

export default FillDescriptionJobPage;
