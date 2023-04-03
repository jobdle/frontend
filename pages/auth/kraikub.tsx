import { useRouter } from "next/router";
import { useEffect } from "react";

const SupportKraikubAuth = () => {
  const router = useRouter();

  function getOpenIDConnect(id_token: string) {
    const openidBase64 = (id_token as string).split(".")[1];
    if (!openidBase64) return "";
    const buff = Buffer.from(openidBase64, "base64");
    return JSON.parse(buff.toString("utf-8"));
  }
  useEffect(() => {
    if (router.query && router.query.id_token) {
      const idtoken = getOpenIDConnect(router.query.id_token as string);
      const { fullName, personalEmail } = idtoken;
      const firstName = fullName.split(" ")[0]
      const lastName = fullName.split(" ")[1]
      if (firstName && lastName && personalEmail) {
        router.push(`/signup?firstname=${firstName}&lastname=${lastName}&email=${personalEmail}`);
      } else {
        router.push("/signin")
      }
    }
   
    
  }, [router]);

  

  return (
    <>
      <div>Authenticating...</div>
    </>
  );
};

SupportKraikubAuth.noLayout = true;

export default SupportKraikubAuth;
