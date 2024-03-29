import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const VerifyIndexPage = () => {
  const router = useRouter();
  const { verify_email_token } = router.query;

  const handleVerify = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/verify`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${verify_email_token}`,
          },
        }
      );
      router.push("/verify/success");
    } catch (error: any) {
      console.error(error);
      router.push("/verify/fail");
    }
  };

  useEffect(() => {
    handleVerify();
  }, [verify_email_token]);

  return <></>;
};

VerifyIndexPage.noLayout = true;
export default VerifyIndexPage;
