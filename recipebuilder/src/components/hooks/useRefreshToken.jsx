import { api } from "../api/axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
  const auth = useAuth();

  const refresh = async () => {
    const response = await api.get("/refresh", {
      withCredentials: true,
    });

    auth?.setAuth((prev) => {
      return {
        ...prev,
        accessToken: response.data.accessToken,
        id: response.data.id,
      };
    });

    return response.data.accessToken;
  };
  return refresh;
};

export default useRefreshToken;
