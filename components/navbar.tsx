import { BellIcon } from "@heroicons/react/24/outline";
import type { NextPage } from "next";

const Navbar: NextPage = () => {
  return (
    <nav className="mx-auto f-screen px-2 sm:px-6 lg:px-8 bg-gradient-to-r from-cyan-500 to-blue-500">
      <div className="relative flex h-14 items-center justify-end">
        <span className="text-gray-100 border rounded-full p-1 cursor-pointer">
        <BellIcon className="w-5 h-5"/>
        </span>
        <span className="text-white font-semibold pl-3">Napasin Saengthong</span>
      </div>
    </nav>
  );
};

export default Navbar;
