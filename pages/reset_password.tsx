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
      router.push("/signin");
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
            <p className="text-xl font-bold mb-3">Send password reset email</p>
            <p>
              We have sent you an email to reset your password. Please reset
              your password from the URL provided in the email.
            </p>
          </div>
          <button
            className="text-blue-500 mt-5 bg-sky-100 p-1 rounded"
            onClick={() => router.push("/signin")}
          >
            Back to sign in
          </button>
        </div>
      </div>
    </>
  );
};

IdentifyPage.noLayout = true;

export default IdentifyPage;
