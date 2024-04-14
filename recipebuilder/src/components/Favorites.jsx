import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAxiosPrivate from "./hooks/useAxiosPrivate";
import useAuth from "./hooks/useAuth";
import { AxiosError } from "axios";
import { api } from "./api/axios";
import RecipeButton from "./RecipeButton";

const Favorites = () => {
  const axiosPrivate = useAxiosPrivate();
  const auth = useAuth();
  const [favorites, setFavorites] = useState();
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const getFavorites = async () => {
      try {
        const response = await axiosPrivate.get(
          `/users/favorites/${auth?.auth?.id}`
        );

        getResults(response.data[0]);
      } catch (err) {
        if (err instanceof AxiosError) {
          if (!err?.response) {
            console.log(err);
          }
        }
      }
    };
    const getResults = async (favResponse) => {
      let req = "";

      for (let i = 0; i < favResponse.length; i++) {
        req += `uri=${favResponse[i].recipeID}`;
        if (i < favResponse.length - 1) {
          req += "&";
        }
      }

      const ft = encodeURIComponent(req);

      try {
        const response = await api.get(`/recipes/byUri/${ft}`);

        setFavorites(response.data.hits);
      } catch (err) {
        if (err instanceof AxiosError) {
          if (!err?.response) {
            console.log(err);
          }
        }
      }
    };
    setHasLoaded(true);

    auth?.auth?.id && getFavorites();
  }, [auth?.auth?.id, axiosPrivate]);

  return (
    <div className=" flex flex-col  absolute w-full h-full">
      {!hasLoaded ? (
        <h1>Loading...</h1>
      ) : (
        <div className="relative flex flex-row justify-center flex-wrap text-[20px]">
          {favorites &&
            favorites.map((hit, index) => (
              <div key={index}>
                <Link
                  to={`/recipes/${hit.recipe.uri.slice(-32)}`}
                  className="decoration-0"
                >
                  <RecipeButton
                    title={hit.recipe.label}
                    image={hit.recipe.image}
                  />
                </Link>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
