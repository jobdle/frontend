import axios from "axios";
import { useEffect, useState } from "react";
import { NextPage } from "next";
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";
import { getUserData, signInAccount } from "../services/AccountServices";
import ButtonComponent from "../components/ButtonComponent";
import { useForm } from "react-hook-form";
import Link from "next/link";

const scope =
  "openid%20email%20profile_pic%20student%20educations%20fullname%20account_type";
const clientId = "d1c641c30dd8d85add98cb275ab9cacc";
const redirectUri = "http://localhost:3000/auth/kraikub";
const signinWithKasetsart = {
  baseUrl: `https://dev.kraikub.com/signin?client_id=${clientId}&scope=${scope}&redirect_uri=${redirectUri}&response_type=implicit`,
};

type SignInPageWithNoLayout = NextPage & {
  noLayout: boolean;
};

interface IdefaultValue {
  email: string;
  password: string;
}

const defaultValue: IdefaultValue = {
  email: "",
  password: "",
};

const SignInPage: SignInPageWithNoLayout = () => {
  const [cookies, setCookie] = useCookies(["token"]);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({ defaultValues: defaultValue });

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = handleSubmit(async (data) => {
    if (!data) return;
    setIsLoading(true);
    try {
      const response = await signInAccount(data);

      if (!response.data.accessToken) {
        // กรณีไม่มี acessToken
        alert("No token!");
        setValue("password", "");
      } else {
        setCookie("token", response.data.accessToken, { path: "/" });
        router.push("/");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          alert("Your Email or password is wrong");
          setValue("password", "");
        } else {
          alert("Error between client and server!");
        }
        setIsLoading(false);
      }
    }
  });

  useEffect(() => {
    try {
      getUserData(cookies.token).then(() => router.push("/"));
    } catch (error) {
      router.push("/signin");
    }
  }, []);

  return (
    <>
      <div className="bg-sky-400 min-h-screen min-w-screen grid justify-items-center">
        <div
          id="logo"
          className="font-bold m-4 absolute inset-0 text-gray-100 h-5"
        >
          {process.env.NEXT_PUBLIC_APP_NAME}
        </div>
        <div className="bg-white sm:w-8/12 md:w-8/12 lg:w-4/12 my-20 p-10 rounded-xl border border-transparent">
          <p className="font-bold text-3xl text-center my-5">Sign in</p>
          <form onSubmit={onSubmit}>
            <div className="mb-3">
              <label className="block text-gray-700 my-1">Email</label>
              <input
                className="border-2 border-gray-200 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
                type="email"
                placeholder="Type your username"
                {...register("email", { required: "This is required." })}
              />
              <p className="text-red-500">{errors.email?.message}</p>
            </div>
            <div className="mb-3">
              <label className="block text-gray-700 my-1">Password</label>
              <input
                className="border-2 border-gray-200 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
                type="password"
                placeholder="Type your password"
                {...register("password", { required: "This is required." })}
              />
              <p className="text-red-500">{errors.password?.message}</p>
            </div>
            <div className="flex justify-end mb-3">
              <a
                className="text-blue-600 hover:underline hover:cursor-pointer visited:text-purple-600"
                onClick={() => router.push("/users/password/new")}
              >
                Forgot Password?
              </a>
            </div>
            <div className="flex gap-y-4 flex-col justify-center mb-3 items-center">
              <ButtonComponent
                className="border border-transparent rounded-full bg-blue-600 hover:bg-blue-500 w-full py-2 px-4 text-sm font-medium text-white"
                type="submit"
                disabled={isLoading}
                isLoading={isLoading}
              >
                Login
              </ButtonComponent>
              {/* <a href={signinWithKasetsart.baseUrl} className="w-full">
                <ButtonComponent
                  className="border border-transparent rounded-full bg-green-600 w-full py-2 px-4 text-sm font-medium text-white"
                  type="button"
                  disabled={true}
                >
                  Sign up with Kasetsart
                </ButtonComponent>
              </a> */}
            </div>
          </form>
          <div className="flex justify-center my-5">
            <p>
              Need An Account?{" "}
              <Link href="/signup">
                <a className="text-blue-600 visited:text-purple-600 hover:underline hover:cursor-pointer">
                  Create Now!
                </a>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

SignInPage.noLayout = true;

export default SignInPage;
