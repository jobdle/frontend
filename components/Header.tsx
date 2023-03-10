import { FC } from "react";
import { dateFormat } from "../services/UtilsServices";

interface Props {
  title: string;
}

const Header = ({ title }: Props) => {
  return (
    <>
      <div className="text-sky-700 font-bold text-2xl pb-3">{title}</div>
      <span className="bg-white rounded-md px-2 py-1 bg-green-200">
        {dateFormat(new Date())}
      </span>
      <hr className="my-3" />
    </>
  );
};

export default Header;
