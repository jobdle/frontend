import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";
import { resetPassword } from "../../../services/AccountServices";


const defaultValue = {
  newPassword: "",
  comfirmNewPassword: "",
};

const RecoverPasswordPage = () => {
  const router = useRouter();
  const { token } = router.query;

  const [isLoading, setIsLoading] = useState(false);
  const [inputFields, setInputFleids] = useState(defaultValue);

  const handleChange = (e: any) => {
    setInputFleids((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log(inputFields.newPassword, inputFields.comfirmNewPassword);

    if (
      inputFields.newPassword === "" ||
      inputFields.comfirmNewPassword === ""
    ) {
      alert("Please type completely!");
      setInputFleids(defaultValue);
    } else if (inputFields.newPassword === inputFields.comfirmNewPassword) {
      try {
        const response = await resetPassword(
          inputFields.comfirmNewPassword,
          token
        );
        console.log(response);
        alert(response.data.message);
        router.push("/signin");
      } catch (error) {
        console.error(error);
      }
    } else {
      alert("Password doesn't match!");
      setInputFleids(defaultValue);
    }
    setIsLoading(false);
  };

  useEffect(() => {}, [token]);

  return (
    <>
      <div className="bg-sky-400 flex justify-center min-h-screen min-w-screen">
        <div className="bg-white w-8/12 md:w-4/12 my-20 p-10 rounded-xl border border-transparent">
          <div>
            <p className="text-3xl">Recover</p>
          </div>
          <div className="my-5">
            <form onSubmit={handleSubmit}>
              <label>
                New Password
                <input
                  type="password"
                  className="border-2 border-gray-200 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
                  onChange={handleChange}
                  name="newPassword"
                  value={inputFields.newPassword}
                />
              </label>
              <label>
                Comfirm new password
                <input
                  type="password"
                  className="border-2 border-gray-200 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
                  onChange={handleChange}
                  name="comfirmNewPassword"
                  value={inputFields.comfirmNewPassword}
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
