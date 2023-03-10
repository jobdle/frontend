import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

import Header from "../components/Header";
import {
  deleteCategory,
  getAllCategories,
  postCategory,
} from "../services/CategoryServices";

const defaultValue = {
  name: "",
  minWage: "",
  color: "#000000",
};

const SettingPage = () => {
  const [cookies] = useCookies(["token"]);

  const [categoryObjectInput, setCategoryObjectInput] = useState(defaultValue);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleOnChange = (event: any) => {
    setCategoryObjectInput({
      ...categoryObjectInput,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmitAddCategory = async (e: any) => {
    e.preventDefault();
    console.log("CategoryObjectInput", categoryObjectInput);
    const trimedNameInput = categoryObjectInput.name.trim(); // Use Regex
    if (trimedNameInput) {
      postCategory(
        {
          ...categoryObjectInput,
          minWage: Number(categoryObjectInput.minWage),
          name: trimedNameInput,
        },
        cookies.token
      )
        .then(async () => {
          await fetchData();
          setCategoryObjectInput(defaultValue);
        })
        .catch((error) => {
          console.error(error);
        });
    } else return;
  };

  const DeleteCategory = async (id: string) => {
    await deleteCategory(id, cookies.token);
    setCategories(
      categories.filter((category: { _id: string }) => category._id !== id)
    );
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await getAllCategories(cookies.token);
      setCategories(response.data);
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (categories.length === 0) {
      fetchData();
    }
  }, [categories]);

  return (
    <div>
      <Header title="Settings" />
      <div className="flex flex-col bg-white p-5 rounded-md shadow space-y-2">
        <span className="self-center font-bold">Your categories </span>
        <div>
          <div className="flex-1 bg-gray-100 p-2 rounded space-y-1">
            <div className="flex grid grid-cols-2">
              <div className="col-span-1 font-bold">Name</div>
              <div className="col-span-1 font-bold">Min Wage</div>
            </div>
            {isLoading
              ? "loading..."
              : categories.map(
                  (
                    category: {
                      name: string;
                      minWage: number;
                      _id: string;
                      color: string;
                    },
                    id
                  ) => (
                    <div
                      className={`flex rounded-full px-2`}
                      style={{ backgroundColor: `${category.color}` }}
                      key={id}
                    >
                      <div className="w-1/2">{category.name}</div>
                      <div className="flex-1">{category.minWage}</div>
                      <button onClick={() => DeleteCategory(category._id)}>
                        X
                      </button>
                    </div>
                  )
                )}
          </div>
        </div>

        <div>
          <span className="font-bold">Add Category</span>
        </div>
        <form
          onSubmit={handleSubmitAddCategory}
          className="border p-2 rounded-md"
        >
          <div className="grid md:grid-cols-3 grid-cols-1">
            <div className="col-span-1">
              <span>Type categories: </span>
              <input
                type="text"
                onChange={handleOnChange}
                value={categoryObjectInput.name}
                className="border-2 px-2 w-full rounded-md focus:outline-none"
                name="name"
                required
              />
            </div>
            <div className="col-span-1">
              <span>Type min wage: </span>
              <input
                type="number"
                pattern="[0-9]*"
                onChange={handleOnChange}
                value={categoryObjectInput.minWage}
                className="border-2 px-2 w-full rounded-md focus:outline-none"
                name="minWage"
                required
              />
            </div>
            <div className="col-span-1">
              <span>Select color: </span>
              <input
                type="color"
                pattern="[0-9]*"
                onChange={handleOnChange}
                value={categoryObjectInput.color}
                className="border-2 px-2 w-full rounded-md focus:outline-none"
                name="color"
                required
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              className="px-2 bg-green-500 rounded-md text-white h-full mt-3"
              type="submit"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingPage;
