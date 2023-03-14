import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";

import { useUser } from "../contexts/User";
import SignOutModal from "./SignOutModal";
import {
  AdjustmentsVerticalIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  ChatBubbleBottomCenterTextIcon,
  ClockIcon,
  ComputerDesktopIcon,
  UserIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";
import Navbar from "./navbar";
import Link from "next/link";

type State = {
  firstname: string;
  lastname: string;
};

const Sidebar: NextPage = () => {
  const router = useRouter();
  const { userData } = useUser();
  // const [sidebar, setSidebar] = useSidebar();

  const [state, setState] = useState<State>({
    firstname: "",
    lastname: "",
  });
  const [open, setOpen] = useState({
    Sidebar: true,
    Navbar: false,
  });
  const [showSignOutMoDal, setShowSignOutMoDal] = useState(false);

  if (!userData) return null;

  const menuLists = [
    {
      title: "Dashboard",
      link: "/",
      icon: <ComputerDesktopIcon className="w-5 d-5" />,
    },
    {
      title: "History",
      link: "/history",
      icon: <ClockIcon className="w-5 d-5" />,
    },
    {
      title: "Chat",
      link: "/chat",
      icon: <ChatBubbleBottomCenterTextIcon className="w-5 d-5" />,
    },
    {
      title: "Employee",
      link: "/employee",
      icon: <UserIcon className="w-5 d-5" />,
    },
    {
      title: "Schedule",
      link: "/schedule",
      icon: <CalendarDaysIcon className="w-5 d-5" />,
    },
    {
      title: "Settings",
      link: "/settings",
      icon: <AdjustmentsVerticalIcon className="w-5 d-5" />,
    },
  ];

  const handleSelectedMenu = (menu: { title: string; link: string }) => {
    localStorage.setItem("sidebarState", menu.link);
    router.push(menu.link);
  };

  const isSidebarExtend = open.Sidebar
    ? "min-w-60 max-w-60 w-60"
    : "min-w-16 max-w-16 w-16";

  const clickOnLogo = () => {
    router.push("/");
  };

  const clickOnHeader = () => {
    router.push("/profile");
  };

  const handleNavBar = (menu: any) => {
    handleSelectedMenu(menu);
    setOpen({ ...open, Navbar: !Navbar });
  };

  return (
    <>
      {/* <!-- mobile menu bar --> */}
      <div className="relative inset-x-0 bg-gradient-to-r from-cyan-500 to-blue-500 flex justify-between md:hidden text-white z-30">
        {/* <!-- logo --> */}
        <Link href="/" className="p-4 font-bold" />
        {userData.firstname} {userData.lastname}
        {/* <!-- mobile menu button --> */}
        <button
          className="p-4 focus:outline-none"
          onClick={() => setOpen({ ...open, Navbar: !open.Navbar })}
        >
          <Bars3Icon className="w-5 h-5" />
        </button>
      </div>
      {/* mobile list menu */}
      <div
        className={`absolute bg-white shadow-lg min-w-screen ${
          !open.Navbar && "-translate-y-full"
        } duration-200 md:hidden inset-x-0 top-14 z-20`}
      >
        {menuLists.map((menu, id) => {
          if (userData.role !== "admin" && menu.title === "Employee")
            return null;
          if (userData.role !== "admin" && menu.title === "Settings")
            return null;
          if (userData.role !== "admin" && menu.title === "Schedule")
            return null;
          return (
            <div key={id}>
              <div
                onClick={() => handleNavBar(menu)}
                className="flex justify-center p-2 hover:bg-gray-200"
              >
                {menu.icon}
                <span className="pl-3">{menu.title}</span>
              </div>
            </div>
          );
        })}
        {/* Log out button */}
        <div
          onClick={() => setShowSignOutMoDal(true)}
          className={`${
            open.Sidebar ? "flex items-center space-x-3" : "flex justify-center"
          } p-1 mx-2 mb-2 rounded-md font-medium bg-red-500 hover:bg-red-100 hover:text-red-500 cursor-pointer duration-100 text-white bottom-0`}
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5" />
          <span className={`${open.Sidebar ? "" : "hidden"}`}>
            <p>Log out</p>
          </span>
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={`${isSidebarExtend} relative duration-200 min-h-screen md:flex md:flex-col hidden bg-gradient-to-t from-cyan-500 to-blue-500 z-10`}
      >
        <div className="flex justify-center items-center py-5">
          <div
            className={`${
              open.Sidebar ? "text-2xl" : "text-sm"
            } font-bold text-white`}
          >
            <span className="cursor-pointer" onClick={clickOnLogo}>
              {process.env.NEXT_PUBLIC_APP_NAME}
            </span>
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          {/* Sidebar-header */}
          <div
            className={`${
              open.Sidebar
                ? "flex p-2 items-center"
                : "flex flex-col-reverse space-y-2 pb-2"
            } bg-gray-100 rounded m-2`}
          >
            <div
              className="flex justify-center hover:cursor-pointer"
              onClick={clickOnHeader}
            >
              <div
                className="h-10 w-10 bg-gray-200 rounded-full flex justify-center items-center bg-no-repeat bg-cover bg-center"
                style={{
                  backgroundImage: `url(${userData.profileImageUrl})`,
                }}
              ></div>
            </div>
            <div className="w-full px-2">
              <span
                className={`${
                  !open.Sidebar && "hidden"
                } font-semibold text-sm text-ellipsis hover:underline hover:cursor-pointer`}
                onClick={clickOnHeader}
              >
                {userData.firstname} {userData.lastname}
              </span>
            </div>
            <div className="flex justify-center">
              <Bars3Icon
                onClick={() => setOpen({ ...open, Sidebar: !open.Sidebar })}
                className="w-5 h-5 cursor-pointer"
              />
            </div>
          </div>
          {/* menu list */}
          <div className="flex-1">
            <ul className="space-y-1 text-sm text-white py-2">
              {menuLists.map((menu, id) => {
                if (userData.role !== "admin" && menu.title === "Employee")
                  return null;
                if (userData.role !== "admin" && menu.title === "Settings")
                  return null;
                if (userData.role !== "admin" && menu.title === "Schedule")
                  return null;
                return (
                  <li title={menu.title} key={menu.title}>
                    <div
                      onClick={() => handleSelectedMenu(menu)}
                      key={menu.title}
                      className={`${
                        open.Sidebar
                          ? "flex items-center space-x-3"
                          : "flex justify-center"
                      } ${
                        localStorage.getItem("sidebarState") === menu.link
                          ? "bg-gray-100 text-sky-600"
                          : ""
                      } p-2 ml-2 rounded-md rounded-r-none font-medium hover:bg-gray-100 hover:text-sky-600 focus:shadow-outline cursor-pointer duration-100`}
                    >
                      {menu.icon}
                      <span className={`${open.Sidebar ? "" : "hidden"}`}>
                        {menu.title}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
          {/* Log out button */}
          <div
            onClick={() => setShowSignOutMoDal(true)}
            className={`${
              open.Sidebar
                ? "flex items-center space-x-3"
                : "flex justify-center"
            } p-1 mx-2 mb-2 rounded-md font-medium bg-red-500 hover:bg-red-100 hover:text-red-500 cursor-pointer duration-100 text-white bottom-0`}
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            <span className={`${open.Sidebar ? "" : "hidden"}`}>
              <p>Log out</p>
            </span>
          </div>
        </div>
      </div>

      <SignOutModal
        onClose={setShowSignOutMoDal}
        show={showSignOutMoDal}
        cancel={() => setShowSignOutMoDal(false)}
        confirm={() => router.push("/signout")}
      />
    </>
  );
};

export default Sidebar;
