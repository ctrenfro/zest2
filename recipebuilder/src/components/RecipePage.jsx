import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "./api/axios";
import useAxiosPrivate from "./hooks/useAxiosPrivate";
import useAuth from "./hooks/useAuth";
import { AxiosError } from "axios";
import { useParams } from "react-router-dom";
import { ReactComponent as Logo } from "../components/icons/Edamam_Badge_Light.svg";

const RecipePage = ({ childToParent }) => {
  const axiosPrivate = useAxiosPrivate();
  const auth = useAuth();
  const [signedIn, setSignedIn] = useState(false);

  const [recipe, setRecipe] = useState([]);
  const { query } = useParams();
  const [items, setItems] = useState([]);
  const [recipeID, setRecipeID] = useState({});
  const [favorites, setFavorites] = useState(false);

  useEffect(() => {
    if (auth?.auth?.accessToken != null) {
      setSignedIn(true);
    }
  }, [auth]);

  useEffect(() => {
    const getRecipe = async () => {
      const response = await api.get(`/recipes/${query}`);

      setRecipeID({
        recipeID: response.data.recipe.uri,
      });
      setRecipe(response.data);

      if (auth?.auth?.accessToken != null) {
        try {
          const favoriteData = await axiosPrivate.get(
            `/users/favorites/${auth?.auth?.id}`
          );

          for (let i = 0; i < favoriteData.data[0].length; i++) {
            if (response.data.recipe.uri === favoriteData.data[0][i].recipeID) {
              setFavorites(true);
            }
          }
        } catch (err) {
          if (err instanceof AxiosError) {
            if (!err?.favoriteData) {
              console.log(err);
            }
          }
        }
      }
    };

    getRecipe();
  }, [query, axiosPrivate, auth]);

  const addRecipe = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosPrivate.put(
        `/users/addRecipe/${auth?.auth?.id}`,
        recipeID
      );
      response();
    } catch (err) {
      if (err instanceof AxiosError) {
        if (!err?.response) {
          console.log(err);
        }
      }
    }
    setFavorites(true);
  };
  const removeRecipe = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosPrivate.put(
        `/users/removeRecipe/${auth?.auth?.id}`,
        recipeID
      );
      response();
    } catch (err) {
      if (err instanceof AxiosError) {
        if (!err?.response) {
          console.log(err);
        }
      }
    }
    setFavorites(false);
  };

  useEffect(() => {
    let newItems = [];
    const ingredientList = () => {
      recipe.recipe &&
        recipe.recipe.ingredients.map((ingredient, i) => {
          const newItem = {
            itemName: ingredient.food,
            measurement: ingredient.measure,
            quantity: ingredient.quantity,
            isChecked: false,
            ingredientNumber: i,
          };

          newItems = [...newItems, newItem];
          setItems(newItems);
          return newItems;
        });
    };
    ingredientList();
  }, [recipe]);

  const handleOnChange = (i) => {
    if (items[i].isChecked === true) items[i].isChecked = false;
    else items[i].isChecked = true;
  };

  const checkBadString = (i) => {
    let validString = i;
    if (validString === null) {
      validString = "";
    }
    if (validString === 0) {
      validString = "";
    }
    if (validString === "<unit>") {
      validString = "";
    }
    if (typeof validString === "number") {
      return validString.toFixed(2);
    }

    return validString;
  };

  return (
    <div className="flex flex-col bg-white relative w-full h-full m-0 p-0 ">
      <div className="max-w-[1920px] h-auto mt-[80px] mx-auto mb-0">
        {recipe.recipe && (
          <div>
            <h1 className="text-center text-[4rem] mt-[6rem] mb-[2rem] text-green-900">
              {recipe.recipe.label}
            </h1>
            <div className="flex flex-row flex-wrap justify-center ">
              <div className="flex flex-col items-center w-auto">
                <img
                  src={recipe.recipe.image}
                  alt="recipe"
                  className=" rounded-lg  object-fill max-w-[500px] mx-auto my-4 border-2 border-green-900"
                />

                <a
                  href={recipe.recipe.url}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <button className=" border-4 border-green-900 mt-[1rem] text-[20px] sm:text-[40px] font-bold w-[140px] sm:w-[240px] h-[60px] sm:h-[100px] text-green-900 rounded-lg hover:bg-green-900 hover:text-white">
                    Instructions
                  </button>
                </a>

                {signedIn &&
                  (!favorites ? (
                    <button
                      className=" border-4 border-green-900 mt-[1rem] text-[20px] sm:text-[30px] font-bold w-[140px] sm:w-[240px] h-[70px] sm:h-[100px] rounded-lg hover:bg-green-900 hover:text-white"
                      onClick={addRecipe}
                    >
                      Add to Favorites
                    </button>
                  ) : (
                    <button
                      className=" border-4 border-green-900 text-green-900 mt-[1rem] text-[20px] sm:text-[30px] font-bold w-[140px] sm:w-[240px] h-[70px] sm:h-[100px] rounded-lg hover:bg-green-900 hover:text-white"
                      onClick={removeRecipe}
                    >
                      Remove from Favorites
                    </button>
                  ))}
              </div>
              <div className=" text-[24px] flex flex-col text-left ml-6 ">
                {recipe.recipe.ingredientLines.map((ingredient, i) => (
                  <div className="flex flex-row " key={i}>
                    <li className="mt-[1rem] text-green-900 font-bold">
                      {ingredient}
                    </li>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        <div className="m-0 lg:mt-[3rem] text-center  text-[18px] ">
          <h1 className="text-6xl m-3 text-green-900">Shopping List</h1>
          {items.map((item, i) => (
            <div
              className="flex flex-row text-center text-[24px] justify-center  "
              key={i}
            >
              <input
                className="mt-[1.2rem] h-[30px] w-[15px]"
                key={i}
                id="custom-checkbox"
                type="checkbox"
                name={i}
                value={i}
                onChange={() => handleOnChange(i)}
              />
              <div className="mt-[1rem] w-[50%] md:w-[20%] text-left  ml-5 ">
                <span className="text-green-900 font-bold">
                  {checkBadString(parseFloat(item.quantity)) + " "}
                </span>
                <span className="text-green-900 font-bold">
                  {checkBadString(item.measurement) + " "}
                </span>
                <span className="text-green-900 font-bold">
                  {item.itemName + " "}
                </span>
              </div>
            </div>
          ))}
          {items && (
            <Link
              to="/shoppingList"
              className="shoppingList--link text-green-900 font-bold"
            >
              <button
                onClick={() =>
                  childToParent(items.filter((item) => item.isChecked === true))
                }
                className="text-[24px] border-green-900 border-[3px] mt-[2rem]  mb-[4rem] p-[1rem] rounded-lg cursor-pointer hover:bg-green-900 hover:text-white"
              >
                Send to Shopping List
              </button>
            </Link>
          )}
        </div>
      </div>
      <a
        href="http://developer.edamam.com"
        target="_blank"
        rel="noreferrer noopener"
      >
        <Logo className="w-[300px] absolute cursor-pointer right-0 bottom-0 " />
      </a>
    </div>
  );
};

export default RecipePage;
