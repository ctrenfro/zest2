import { useRef, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useAuth from "./hooks/useAuth";
import { AxiosError } from "axios";
import useInput from "./hooks/useInput";
import toast from "react-hot-toast";

import { api } from "./api/axios";
const LOGIN_URL = "/auth";

const Login = () => {
  const authContext = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const userRef = useRef(null);
  const errRef = useRef();

  const [user, resetUser, userAttribs] = useInput("user", "");
  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const [check, toggleCheck] = useState(false);

  const handleToggle = () => {
    toggleCheck(!check);
  };

  const persistUser = () => {
    if (check === true) {
      const now = new Date();
      const expiry = now.getTime() + 1000 * 60 * 60 * 24;

      localStorage.setItem("persist", JSON.stringify(expiry));
    }
  };

  useEffect(() => {
    userRef.current?.focus();
  }, [userRef]);

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post(
        LOGIN_URL,
        JSON.stringify({ user, pwd }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      const accessToken = response?.data?.accessToken;
      const id = response?.data?.id;

      if (authContext) {
        authContext.setAuth({
          user,
          accessToken,
          id,
        });
      }
      resetUser("");
      setPwd("");
      navigate(from, { replace: true });
      toast.success("You have been logged in.");
    } catch (err) {
      if (err instanceof AxiosError) {
        if (!err?.response) {
          setErrMsg("No Server Response");
        } else if (err.response?.status === 400) {
          setErrMsg("Missing Username or Password");
        } else if (err.response?.status === 401) {
          setErrMsg("Unauthorized");
        } else {
          setErrMsg("Login Failed");
        }
        errRef.current?.focus();
      }
    }
    persistUser();
  };

  return (
    <section className="w-full h-screen  bg-slate-100 text-[22px] m-0 p-0">
      <div className="bg-slate-100 bg-opacity-[0.8] mx-auto relative  top-[10rem] rounded max-w-[420px] min-h-[400px] flex flex-col justify-start p-4">
        <p
          ref={errRef}
          className={
            errMsg
              ? "bg-lightpink text-firebrick font-bold p-2 mb-2"
              : "absolute left-[-9999px]"
          }
          aria-live="assertive"
        >
          {errMsg}
        </p>
        <h1 className="text-green-900 text-opacity-70 font-bold">Sign In</h1>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col justify-evenly flex-grow-1 pb-4"
        >
          <label
            htmlFor="username"
            className="text-green-900 text-opacity-70 font-bold"
          >
            Username:
          </label>
          <input
            className="text-[22px] p-1 rounded text-green-900 text-opacity-70 text-center font-bold border-2 border-slate-400"
            type="text"
            id="username"
            ref={userRef}
            autoComplete="off"
            {...userAttribs}
            required
          />

          <label
            htmlFor="password"
            className="text-green-900 text-opacity-70 font-bold"
          >
            Password:
          </label>
          <input
            className="text-[22px] p-1 rounded text-green-900 text-opacity-70 text-center font-bold border-2 border-slate-400"
            type="password"
            id="password"
            onChange={(e) => setPwd(e.target.value)}
            value={pwd}
            required
          />
          <button className="text-[22px] rounded text-green-900 text-opacity-70 mt-4 p-2 bg-white font-bold border-2 border-slate-400">
            Sign In
          </button>
          <div className="text-base mt-3 flex justify-start items-end">
            <input
              className="h-5 w-5 mr-[5px] mb-[2px] ml-[2px] mt-0 accent-green-900 "
              type="checkbox"
              id="persist"
              onChange={handleToggle}
              checked={check}
            />
            <label
              htmlFor="persist"
              className="m-0 text-green-900 text-opacity-70 font-bold"
            >
              Trust This Device
            </label>
          </div>
        </form>
        <p className="text-green-900 text-opacity-70">
          Need an Account?
          <br />
          <span className="inline-block text-green-900 text-opacity-70">
            <Link to="/register">Sign Up</Link>
          </span>
        </p>
      </div>
    </section>
  );
};

export default Login;
