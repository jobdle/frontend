import axios from "axios";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useCookies } from "react-cookie";

const IdentifyPage = () => {
  const router = useRouter();
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);

  const [userEmail, setUserEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/password`,
        { params: { email: userEmail } }
      );
      alert(response.data.message);
      router.push("/reset_password");
    } catch (error: any) {
      alert(error.response.data.message);
    }
    console.log(userEmail);
    setIsLoading(false);
  };

  return (
    <>
      <div className="bg-sky-400 flex justify-center min-h-screen min-w-screen">
        <div className="bg-white w-8/12 lg:w-4/12 my-20 p-10 rounded-xl border border-transparent">
          <div className="text-warp">
            <p>
              Please enter your username or email address. You will recieve an
              email message with link to reset your password.
            </p>
          </div>
          <div className="my-5">
            <form onSubmit={handleSubmit}>
              <label>Email Address</label>
              <input
                type="text"
                className="border-2 border-gray-200 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
                onChange={(e) => setUserEmail(e.target.value)}
              />
              <div className="flex justify-end my-3">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-400 p-2 rounded-full text-white w-40"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex justify-center">
                      <span className="h-5 w-5 block rounded-full border-4 border-blue-400 border-t-white animate-spin"></span>
                    </div>
                  ) : (
                    <span>Continue</span>
                  )}
                </button>
              </div>
            </form>
          </div>
          <p
            className="text-blue-500 cursor-pointer"
            onClick={() => router.push("/signin")}
          >
            Back to sign in
          </p>
        </div>
      </div>
    </>
  );
};

IdentifyPage.noLayout = true;

export default IdentifyPage;
