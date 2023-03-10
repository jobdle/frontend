import "../styles/globals.css";
import type { AppProps } from "next/app";
import Sidebar from "../components/Sidebar";
import { NextPage } from "next";
import { CookiesProvider } from "react-cookie";
import { UserProvider } from "../contexts/User";

type NextPageWithNoLayout = NextPage & {
  noLayout?: boolean;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithNoLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  if (Component.noLayout) {
    return (
      <CookiesProvider>
        <Component {...pageProps} />
      </CookiesProvider>
    );
  }
  return (
    <CookiesProvider>
      <UserProvider>
        <div className="flex flex-col md:flex md:flex-row bg-gray-100 min-h-screen min-w-screen">
          <Sidebar />
          <div className="flex-1 p-5 min-h-screen min-w-screen">
            <Component {...pageProps} />
          </div>
        </div>
      </UserProvider>
    </CookiesProvider>
  );
}

export default MyApp;
