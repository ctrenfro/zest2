import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "./hooks/useAuth";
import useLogout from "./hooks/useLogout";

const Header = () => {
  const auth = useAuth();
  const [signedIn, setSignedIn] = useState(false);
  const logout = useLogout();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth?.auth?.accessToken != null) {
      setSignedIn(true);
    }
  }, [auth]);

  const signOut = async () => {
    await logout();
    setSignedIn(false);
    navigate("/");
  };

  return (
    <div className="relative top-0  h-18 border-b-green-900 border-b-[1px]">
      <div className=" max-w-[800px] md:max-w-[1240px] lg:max-w-[1920px] m-auto flex flex-row justify-between">
        <Link to="/">
          <h1 className="font-bold text-3xl text-green-900 pl-6 pt-6">Zest</h1>
        </Link>

        {!signedIn ? (
          <Link to="/login">
            <button className="pt-6 pr-6 text-green-900 font-bold text-lg">
              Log In/Sign Up
            </button>
          </Link>
        ) : (
          <div className=" text-green-900 font-bold text-lg flex flex-row gap-4 pr-4">
            <Link to="/favorites" className="pt-6">
              <button>Favorites</button>
            </Link>
            <Link to="/shoppingList" className="shoppingList--link pt-6">
              <button>Shopping List</button>
            </Link>
            <button onClick={signOut} className="pt-4 pr-6">
              Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
