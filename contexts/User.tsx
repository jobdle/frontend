import axios from "axios";
import { useRouter } from "next/router";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useCookies } from "react-cookie";

type UserProviderProps = {
  children: ReactNode;
};

type UserContextType = {
  userData: User | undefined;
};

const UserContext = createContext<UserContextType>({ userData: undefined });

function UserProvider({ children }: UserProviderProps) {
  const router = useRouter();
  const [cookies, setCookie] = useCookies(["token"]);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<User>();

  const getUserData = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/profile`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies.token}`,
          },
        }
      );
      setUserData(res.data);
    } catch (err) {
      router.push("/signin");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    try {
      if (!cookies.token) {
        router.push("/signin");
      } else {
        getUserData();
        setIsLoading(false);
      }
    } catch (err) {
      console.error("err", err);
      router.push("/signin");
    }
  }, []);

  if (isLoading) return null;

  return (
    <UserContext.Provider value={{ userData }}>{children}</UserContext.Provider>
  );
}

const useUser = () => useContext(UserContext);

export { UserProvider, useUser };
