import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ErrorMessage from "../../../components/ErrorMessage";
import { resetPassword } from "../../../services/AccountServices";


const defaultValue = {
  newPassword: "",
  comfirmNewPassword: "",
};

const RecoverPasswordPage = () => {
  const router = useRouter();
  const { reset_password_token } = router.query;
  const {
    register,
    unregister,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const [isLoading, setIsLoading] = useState(false);


  const onSubmit = handleSubmit(async (data) => {
    setIsLoading(true);

    if (data.newPassword === data.comfirmNewPassword) {
      try {
        const response = await resetPassword(
          data.comfirmNewPassword,
          reset_password_token
        );
        alert(response.data.message);
        router.push("/signin");
      } catch (error) {
        console.error(error);
      }
    } else {
      alert("Password doesn't match!");
      reset();
    }
    setIsLoading(false);
  });

  return (
    <>
      <div className="bg-sky-400 flex justify-center min-h-screen min-w-screen">
        <div className="bg-white w-8/12 md:w-4/12 my-20 p-10 rounded-xl border border-transparent">
          <div>
            <p className="text-3xl">Reset Password</p>
          </div>
          <div className="my-5">
            <form onSubmit={onSubmit}>
              <label>
                New Password
                <span className="text-gray-400"> (At least 8 characters)</span>
                <input
                  type="password"
                  className="border-2 border-gray-200 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
                  placeholder="New Password"
                  {...register("newPassword", {
                    required: "This is required.",
                    minLength: {
                      value: 8,
                      message: "Password must have at least 8 characters.",
                    },
                  })}
                />
                <ErrorMessage>{errors.newPassword?.message}</ErrorMessage>
              </label>
              <label>
                Comfirm new password
                <input
                  type="password"
                  className="border-2 border-gray-200 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
                  placeholder="Comfirm new password"
                  {...register("comfirmNewPassword", {
                    required: "This is required.",
                    minLength: {
                      value: 8,
                      message: "Password must have at least 8 characters.",
                    },
                  })}
                />
              </label>
              <div className="flex justify-end my-3">
                <button
                  type="submit"
                  className="bg-blue-100 hover:bg-blue-200 p-2 rounded text-blue-900 w-40"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex justify-center">
                      <span className="h-5 w-5 block rounded-full border-4 border-blue-400 border-t-white animate-spin"></span>
                    </div>
                  ) : (
                    <span>Reset password</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

RecoverPasswordPage.noLayout = true;

export default RecoverPasswordPage;
