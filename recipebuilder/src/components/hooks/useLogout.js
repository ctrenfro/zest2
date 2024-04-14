import { api as axios } from "../api/axios";
import useAuth from "./useAuth";
import toast from "react-hot-toast";

const useLogout = () => {
  const auth = useAuth();

  const logout = async () => {
    auth?.setAuth({ user: "", pwd: "", accessToken: "" });
    try {
      await axios("/logout", {
        withCredentials: true,
      });
      localStorage.removeItem("persist");
      toast.success("You have been logged out.");
    } catch (err) {
      console.error(err);
    }
  };

  return logout;
};

export default useLogout;
