import axios from "axios";
import { useState } from "react";

const ResendPage = () => {
  const [email, setEmail] = useState<string>("");

  const handleClick = async (event: any) => {
    event.preventDefault();
    await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/verify`, {
      params: {
        email,
      },
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  return (
    <>
      <div className="bg-sky-400 flex justify-center min-h-screen min-w-screen">
        <div className="bg-white w-4/12 my-20 p-10 rounded-xl border border-transparent">
          <div className="">
            <p className="font-bold text-3xl text-center my-5">
              Token was expired!
            </p>

            <label className="block font-medium text-gray-700 my-1">
              Please type your email and click the button to resend verify email
            </label>
            <input
              className="border-2 border-gray-200 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
              type="email"
              value={email}
              placeholder="Type your email"
              name="password"
              onChange={(event) => setEmail(event?.target.value)}
            />
            <button
              className="transition rounded-md border border-transparent bg-blue-600 w-full py-2 px-4 text-sm font-medium text-white hover:bg-blue-500 my-5"
              onClick={handleClick}
            >
              <span className="justify-center">Resend</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

ResendPage.noLayout = true;

export default ResendPage;
