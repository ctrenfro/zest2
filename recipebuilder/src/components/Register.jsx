import { useRef, useState, useEffect } from "react";
import { ReactComponent as Check } from "./icons/Check.svg";
import { ReactComponent as Times } from "./icons/Times.svg";
import { ReactComponent as InfoCircle } from "./icons/InfoCircle.svg";
import { api } from "./api/axios";
import { AxiosError } from "axios";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAuth from "./hooks/useAuth";

const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = "/register";

const Register = () => {
  const userRef = useRef();
  const errRef = useRef();
  const authContext = useAuth();

  const [user, setUser] = useState("");
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    userRef.current?.focus();
  }, [userRef]);

  useEffect(() => {
    const result = USER_REGEX.test(user);

    setValidName(result);
  }, [user]);

  useEffect(() => {
    const result = PWD_REGEX.test(pwd);

    setValidPwd(result);
    const match = pwd === matchPwd;
    setValidMatch(match);
  }, [pwd, matchPwd]);

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd, matchPwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if button enabled with JS hack
    const v1 = USER_REGEX.test(user);
    const v2 = PWD_REGEX.test(pwd);
    if (!v1 || !v2) {
      setErrMsg("Invalid Entry");
      return;
    }
    try {
      const response = await api.post(
        REGISTER_URL,
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

      //clear state and controlled inputs
      //need value attrib on inputs for this
      setUser("");
      setPwd("");
      setMatchPwd("");
      navigate("/");

      toast.success("Your account has been created.");
    } catch (err) {
      if (err instanceof AxiosError) {
        if (!err?.response) {
          console.log(err);

          setErrMsg("No Server Response");
        } else if (err.response?.status === 409) {
          setErrMsg("Username Taken");
        } else {
          setErrMsg("Registration Failed");
        }
        errRef.current?.focus();
      }
    }
  };

  return (
    <>
      <section className="w-full h-screen  text-[22px] m-0 p-0 bg-slate-200">
        <div className="bg-slate-200 bg-opacity-[0.8] mx-auto relative top-[10rem] rounded max-w-[420px] min-h-[600px] flex flex-col justify-start p-4">
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
          <h1 className="text-green-900 text-opacity-70">Register</h1>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col justify-evenly flex-grow-1 pb-4"
          >
            <label
              htmlFor="username"
              className="text-green-900 text-opacity-70 flex flex-row"
            >
              Username:
              <Check
                className={
                  validName ? "ml-2 fill-limegreen mt-[6px]" : "hidden"
                }
              />
              <Times
                className={
                  validName || !user ? "hidden" : "ml-2 fill-red mt-[6px]"
                }
              />
            </label>
            <input
              type="text"
              id="username"
              className="text-[22px] p-1 rounded text-green-900 text-opacity-70 text-center font-bold"
              ref={userRef}
              autoComplete="off"
              onChange={(e) => setUser(e.target.value)}
              value={user}
              required
              aria-invalid={validName ? "false" : "true"}
              aria-describedby="uidnote"
              onFocus={() => setUserFocus(true)}
              onBlur={() => setUserFocus(false)}
            />
            <div
              id="uidnote"
              className={
                userFocus && user && !validName
                  ? "text-sm font-bold rounded bg-red text-green-900 text-opacity-70 p-2 mb-2 relative bottom-[-10px]"
                  : "absolute left-[-9999px]"
              }
            >
              <div className="text-white flex flex-row ">
                <InfoCircle className="fill-white mr-2 mt-2  text-white" />4 to
                24 characters. <br />
                Must begin with a letter.
                <br />
                Letters, numbers, underscores, hyphens allowed.
              </div>
            </div>
            <label
              htmlFor="password"
              className="text-green-900 text-opacity-70 flex flex-row"
            >
              Password:
              <Check
                className={validPwd ? "ml-2 fill-limegreen mt-[6px]" : "hidden"}
              />
              <Times
                className={
                  validPwd || !pwd ? "hidden" : "ml-2 fill-red mt-[6px]"
                }
              />
            </label>
            <input
              type="password"
              id="password"
              className="text-[22px] p-1 rounded text-green-900 text-opacity-70 text-center font-bold"
              onChange={(e) => setPwd(e.target.value)}
              value={pwd}
              required
              aria-invalid={validPwd ? "false" : "true"}
              aria-describedby="pwdnote"
              onFocus={() => setPwdFocus(true)}
              onBlur={() => setPwdFocus(false)}
            />
            <div
              id="pwdnote"
              className={
                pwdFocus && !validPwd
                  ? "text-sm rounded bg-red text-white font-bold mb-2 p-2 relative bottom-[-10px]"
                  : "absolute left-[-9999px]"
              }
            >
              <div className="text-white flex flex-row">
                <InfoCircle className="fill-white mr-2 mt-[2px]" />8 to 24
                characters.
              </div>
              Must include uppercase and lowercase letters, a number and a
              special character.
              <br />
              Allowed special characters:{" "}
              <span aria-label="exclamation mark" className="text-white">
                !
              </span>{" "}
              <span aria-label="at symbol" className="text-white">
                @
              </span>{" "}
              <span aria-label="hashtag" className="text-white">
                #
              </span>{" "}
              <span aria-label="dollar sign" className="text-white">
                $
              </span>{" "}
              <span aria-label="percent" className="text-white">
                %
              </span>
            </div>
            <label
              htmlFor="confirm_pwd"
              className="text-green-900 text-opacity-70 flex flex-row"
            >
              Confirm Password:
              <Check
                className={
                  validMatch && matchPwd
                    ? "ml-2 fill-limegreen mt-[6px]"
                    : "hidden"
                }
              />
              <Times
                className={
                  validMatch || !matchPwd ? "hidden" : "ml-2 fill-red mt-[6px]"
                }
              />
            </label>
            <input
              type="password"
              id="confirm_pwd"
              className="text-[22px] p-1 rounded text-green-900 text-opacity-70 text-center font-bold"
              onChange={(e) => setMatchPwd(e.target.value)}
              value={matchPwd}
              required
              aria-invalid={validMatch ? "false" : "true"}
              aria-describedby="confirmnote"
              onFocus={() => setMatchFocus(true)}
              onBlur={() => setMatchFocus(false)}
            />
            <div
              id="confirmnote"
              className={
                matchFocus && !validMatch
                  ? "text-base rounded bg-red text-green-900 text-opacity-70 p-1 relative bottom-[-10px]"
                  : "absolute left-[-9999px]"
              }
            >
              <div className="text-white flex flex-row">
                <InfoCircle className="fill-white mr-2 mt-[2px]" />
                Must match the first password input field.
              </div>
            </div>

            <button
              className=" w-full bg-white font-bold mt-4 disabled:opacity-50 text-green-900 text-opacity-70"
              disabled={!validName || !validPwd || !validMatch ? true : false}
            >
              Sign Up
            </button>
          </form>
          <p className="text-green-900 text-opacity-70">
            Already registered?
            <br />
            <span className="line text-green-900 text-opacity-70">
              <Link to="/login">Sign In</Link>
            </span>
          </p>
        </div>
      </section>
    </>
  );
};

export default Register;
