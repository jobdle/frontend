import { useRouter } from "next/router";
import axios from "axios";
import { useEffect, useState } from "react";

const VerifyPage = () => {
  const router = useRouter();
  const { status } = router.query;

  const [email, setEmail] = useState("");

  const handleResendClick = async (event: any) => {
    event.preventDefault();
    if (email.trim() === "") {
      alert("please type your email.");
      return;
    }
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/verify`,
        {
          params: {
            email,
          },
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
      alert(response.data.message);
    } catch (error: any) {
      alert(error.response.data.message);
    }
  };

  useEffect(() => {
    if (status === undefined) {
      return;
    }
    console.log(status);
  }, [status]);

  if (status === "success") {
    return (
      <>
        <div className="bg-sky-400 flex justify-center min-h-screen min-w-screen">
          <div className="bg-white w-8/12 lg:w-4/12 my-20 p-10 rounded-xl border border-transparent">
            <div>
              <p className="font-bold text-3xl text-center my-5">
                Verify Success
              </p>
              <label className="block font-medium text-gray-700 my-1">
                Welcome to Jobdle App!
              </label>
              <label className="block font-medium text-gray-700 my-1">
                you can login and hire work now.
              </label>
              <button
                className="transition rounded-md border border-transparent bg-blue-600 w-full py-2 px-4 text-sm font-medium text-white hover:bg-blue-500 my-5"
                // onClick={handleResendClick}
              >
                <span
                  className="justify-center"
                  onClick={() => {
                    router.push("/signin");
                  }}
                >
                  go to login page
                </span>
              </button>
            </div>
          </div>
        </div>
      </>
    );
  } else if (status === "fail") {
    return (
      <>
        <div className="bg-sky-400 flex justify-center min-h-screen min-w-screen">
          <div className="bg-white w-8/12 lg:w-4/12 my-20 p-10 rounded-xl border border-transparent">
            <div className="">
              <p className="font-bold text-3xl text-center my-5">
                Token was expired!
              </p>

              <label className="block font-medium text-gray-700 my-1">
                Please type your email and click the button to resend verify
                email
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
                onClick={handleResendClick}
              >
                <span className="justify-center">Resend</span>
              </button>
            </div>
            <p onClick={()=>router.push("/signin")} className="cursor-pointer">Back to sign in</p>
          </div>
        </div>
      </>
    );
  }
};

VerifyPage.noLayout = true;

export default VerifyPage;
