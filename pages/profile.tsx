import { ArrowUpTrayIcon, PhotoIcon } from "@heroicons/react/24/outline";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useCookies } from "react-cookie";

import Header from "../components/Header";
import { useUser } from "../contexts/User";
import { patchAccountUser } from "../services/AccountServices";
import { handleUpload } from "../services/UtilsServices";
import ButtonComponent from "../components/ButtonComponent";

const defaultUser = {
  profileImageUrl: "",
  firstname: "",
  lastname: "",
  tel: "",
  email: "",
};

const ProfilePage = () => {
  const { userData } = useUser();
  const [cookies] = useCookies(["token"]);

  const [profileDataObject, setProfileDataObject] =
    useState<UserEditable>(defaultUser);
  const [isHover, setIsHover] = useState(false);
  const [file, setFile] = useState<File>();
  const [isLoading, setIsLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    setProfileDataObject(userData || defaultUser);
    console.log(userData);
  }, [userData]);

  const handleMouseEnter = () => {
    setIsHover(true);
  };
  const handleMouseLeave = () => {
    setIsHover(false);
  };

  const handleChangeFile = (event: any) => {
    setFile(event.target.files[0]);
    setDisabled(false);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setProfileDataObject((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setDisabled(false);
  };

  const handleSubmitEditProfile = async () => {
    setIsLoading(true);
    let submitedData = profileDataObject;
    if (!submitedData) return; 
    if (file) {
      try {
        const profileImageUrl = await handleUpload(file);
        submitedData.profileImageUrl = profileImageUrl;
      } catch (error) {
        console.error(error);
      }
    }
    try {
      await patchAccountUser(submitedData, cookies.token);
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
    setDisabled(true);
  };

  if (!profileDataObject) return null;

  return (
    <>
      <Header title="Profile" />
      <div className="flex flex-col lg:flex lg:flex-row bg-white py-5 rounded-md shadow">
        <div className="flex flex-col items-center lg:w-1/3">
          <div
            className={`h-60 w-60 bg-gray-100 rounded-full bg-no-repeat bg-cover bg-center flex justify-center items-center border-4 border-sky-500`}
            style={{
              backgroundImage: `url(${
                file
                  ? URL.createObjectURL(file)
                  : profileDataObject.profileImageUrl
              })`,
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {file || profileDataObject.profileImageUrl ? null : (
              <div className="text-6xl absolute cursor-pointer">
                {profileDataObject.firstname[0]}
                {profileDataObject.lastname[0]}
              </div>
            )}
            {isHover ? (
              <label
                className="h-60 w-60 bg-[rgb(66,135,245,0.1)] rounded-full cursor-pointer flex justify-center items-center"
                htmlFor="edit-avatar"
              >
                <div className="flex flex-col items-center z-10">
                  <ArrowUpTrayIcon className="w-20 h-20 text-gray-700" />
                  <span className="text-gray-700">Click to edit</span>
                </div>
                <input
                  type="file"
                  id="edit-avatar"
                  className="hidden"
                  onChange={handleChangeFile}
                  accept="image/*"
                />
              </label>
            ) : null}
          </div>
          <div className="px-5 my-3">
            <input
              type="file"
              id="edit-avatar"
              onChange={handleChangeFile}
              accept="image/*"
              className="w-full bg-gray-100"
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
                    name="firstname"
                    defaultValue={profileDataObject.firstname}
                    onChange={handleChange}
                  />
                </div>
                <div className="lg:flex-1">
                  <label className="block font-medium text-gray-700 my-1">
                    Surname
                  </label>
                  <input
                    className="border-2 border-gray-200 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
                    type="text"
                    placeholder=""
                    name="lastname"
                    defaultValue={profileDataObject.lastname}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="block font-medium text-gray-700 my-1">
                  Email address
                </label>
                <input
                  className="border-2 border-gray-200 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
                  type="text"
                  placeholder="Your email"
                  name="email"
                  defaultValue={profileDataObject.email}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label className="block font-medium text-gray-700 my-1">
                  Tel
                </label>
                <input
                  className="border-2 border-gray-200 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
                  type="text"
                  placeholder="Your username"
                  name="username"
                  defaultValue={profileDataObject.tel}
                  onChange={handleChange}
                />
              </div>
              <div>
                <ButtonComponent
                  type="submit"
                  className={`${
                    !disabled
                      ? "bg-sky-500 hover:bg-sky-400 text-white border border-transparent"
                      : "bg-white text-sky-500 border border-sky-500"
                  } transition rounded-md py-2 px-4 text-sm font-medium w-32`}
                  onClick={handleSubmitEditProfile}
                  disabled={disabled}
                  isLoading={isLoading}
                >
                  Save Change
                </ButtonComponent>
              </div>
            </div>
            <hr className="my-3 border" />
            <div>
              <div className="mb-3">
                <label className="block font-medium text-gray-700 my-1">
                  Old password
                </label>
                <input
                  className="border-2 border-gray-200 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
                  type="password"
                  placeholder="Old Password"
                />
              </div>
              <div className="mb-3">
                <label className="block font-medium text-gray-700 my-1">
                  New password
                  <span className="text-gray-400"> (At least 8 characters)</span>
                </label>
                <input
                  className="border-2 border-gray-200 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
                  type="password"
                  placeholder="New password"
                  name="password"
                />
              </div>
              <div className="mb-3">
                <label className="block font-medium text-gray-700 my-1">
                  Confirm new password
                </label>
                <input
                  className="border-2 border-gray-200 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
                  type="password"
                  placeholder="Confirm new password"
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="rounded-md border border-transparent bg-red-500 py-2 px-4 text-sm font-medium text-white shadow-md hover:bg-red-400"
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
