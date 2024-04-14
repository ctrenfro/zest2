import Layout from "./Layout";
import { useState, useEffect } from "react";
import useRefreshToken from "./hooks/useRefreshToken";
import useAuth from "./hooks/useAuth";

import toast from "react-hot-toast";
import Toast from "./Toast";

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const authContext = useAuth();
  const persist = JSON.parse(localStorage.getItem("persist"));

  useEffect(() => {
    let isMounted = true;
    let isNotExpired = false;

    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (err) {
        console.error(err);
      } finally {
        isMounted && setIsLoading(false);
      }
    };

    // persist added here AFTER tutorial video
    // Avoids unwanted call to verifyRefreshToken
    const now = new Date().getTime();
    if (persist) {
      if (now < persist) {
        isNotExpired = true;
      } else {
        localStorage.removeItem("persist");
        toast.custom(<Toast />);
      }
    }

    !authContext?.auth?.accessToken && isNotExpired
      ? verifyRefreshToken()
      : setIsLoading(false) && localStorage.removeItem("persist");

    return () => {
      isMounted = false;
    };
  }, [authContext?.auth?.accessToken, persist, refresh]);

  return (
    <>{!persist ? <Layout /> : isLoading ? <p>Loading...</p> : <Layout />}</>
  );
};

export default PersistLogin;
