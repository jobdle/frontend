import { ChangeEvent, FormEvent, useState } from "react";
import { NextPage } from "next";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import ErrorMessage from "../components/ErrorMessage";
import Link from "next/link";

type SignUpPageWithNoLayout = NextPage & {
  noLayout: boolean;
};

interface IdefaultValue {
  firstname: string;
  lastname: string;
  email: string;
  tel: string;
  password: string;
  confirmPassword: string | undefined;
}

const defaultValue: IdefaultValue = {
  firstname: "",
  lastname: "",
  email: "",
  tel: "",
  password: "",
  confirmPassword: "",
};

const SignUpPage: SignUpPageWithNoLayout = () => {
  const router = useRouter();
  const {
    register,
    unregister,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ...defaultValue,
      firstname: router.query.firstname,
      lastname: router.query.lastname,
      email: router.query.email,
    },
  });

  // const [userData, setUserData] = useState(defaultValue);
  const [isLoading, setIsLoading] = useState(false);
  const [comfirmPassword, setComfirmPassword] = useState("");

  // const handleChange = (e: any) => {
  //   setUserData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  // };

  const onSubmit = handleSubmit(async (data) => {
    setIsLoading(true);
    delete data.confirmPassword;
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/signup`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      alert("Please go to your email for verify.");
      router.push("/signin");
    } catch (error: any) {
      console.error(error);
      alert(error?.response.data.message);
    }
    setIsLoading(false);
  });

  return (
    <>
      <div className="bg-sky-400 flex justify-center items-center min-h-screen min-w-screen">
        <div
          id="logo"
          className="font-bold m-4 absolute inset-0 text-gray-100 h-5"
        >
          Jobdle
        </div>
        <div className="bg-white w-9/12 h-5/6 p-10 rounded-xl border border-transparent">
          <p className="font-bold text-3xl text-center my-5">Sign Up</p>
          <form onSubmit={onSubmit}>
            <div className="mb-3 lg:flex">
              <div className="lg:flex-1 lg:mr-3">
                <label className="block text-gray-700 my-1">First Name</label>
                <input
                  className="border-2 border-gray-200 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
                  type="text"
                  placeholder="First Name"
                  {...register("firstname", { required: "This is required." })}
                />
                <ErrorMessage>{errors.firstname?.message}</ErrorMessage>
              </div>
              <div className="lg:flex-1">
                <label className="block text-gray-700 my-1">Surname</label>
                <input
                  className="border-2 border-gray-200 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
                  type="text"
                  placeholder="Surname"
                  {...register("lastname", { required: "This is required." })}
                />
                <ErrorMessage>{errors.lastname?.message}</ErrorMessage>
              </div>
            </div>
            <div className="mb-3">
              <label className="block text-gray-700 my-1">Email address</label>
              <input
                className="border-2 border-gray-200 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
                type="email"
                placeholder="Your email"
                {...register("email", { required: "This is required." })}
              />
              <ErrorMessage>{errors.email?.message}</ErrorMessage>
            </div>
            <div className="mb-3">
              <label className="block text-gray-700 my-1">Phone number</label>
              <input
                className="border-2 border-gray-200 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
                type="text"
                placeholder="Your Phone number"
                {...register("tel", {
                  required: "This is required.",
                  pattern: {
                    value:
                      /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
                    message: "Please type phone number correctly.",
                  },
                })}
              />
              <ErrorMessage>{errors.tel?.message}</ErrorMessage>
            </div>
            <div className="mb-3">
              <label className="block text-gray-700 my-1">
                Password{" "}
                <span className="text-gray-400">(At least 8 characters)</span>
              </label>
              <input
                className="border-2 border-gray-200 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
                type="password"
                placeholder="Password"
                {...register("password", {
                  required: "This is required.",
                  minLength: {
                    value: 8,
                    message: "Password must have at least 8 characters.",
                  },
                })}
              />
              <ErrorMessage>{errors.password?.message}</ErrorMessage>
            </div>
            <div className="mb-3">
              <label className="block text-gray-700 my-1">
                Confirm Password
              </label>
              <input
                className="border-2 border-gray-200 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
                type="password"
                placeholder="Confirm Password"
                {...register("confirmPassword", {
                  required: "This is required.",
                  validate: (value) => {
                    if (watch("password") != value) {
                      return "Your passwords do no match";
                    }
                  },
                })}
              />
              <ErrorMessage>{errors.confirmPassword?.message}</ErrorMessage>
            </div>
            <div className="grid mt-5">
              <button
                type="submit"
                className="border border-transparent rounded-full bg-blue-600 w-full py-2 px-4 text-sm font-medium text-white hover:bg-blue-400"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex justify-center">
                    <svg className="h-5 w-5 block rounded-full border-4 border-blue-400 border-t-white animate-spin"></svg>
                  </div>
                ) : (
                  <span>Sign up</span>
                )}
              </button>
            </div>
          </form>

          <div className="flex justify-center my-5">
            <p className="mr-2">You have an account ? </p>
            <Link href="/signin">
              <a className="text-blue-600 visited:text-purple-600">Sign In</a>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

SignUpPage.noLayout = true;

export default SignUpPage;
