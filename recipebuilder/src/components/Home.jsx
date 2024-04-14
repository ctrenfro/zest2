import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import RecipeButton from "./RecipeButton";
import { api } from "./api/axios";
import { ReactComponent as Logo } from "../components/icons/Edamam_Badge_Light.svg";

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState();
  const [query, setQuery] = useState("chicken");
  const [hasLoaded, setHasLoaded] = useState(false);
  const [pagination, setPagination] = useState([]);
  const [isMounted, setIsMounted] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const getRecipes = async () => {
      const response = await api.get(`/recipes/home/${query}`);
      setRecipes(response.data);
      if (isMounted === true) {
        const newURL = new URL(response.data._links.next.href).searchParams;
        let page = {
          next: newURL.get("_cont"),
          number: 2,
        };
        let newPage = [...pagination, page];
        setPagination(newPage);
      }
    };
    getRecipes();
    setHasLoaded(true);
    return () => {
      setIsMounted(false);
    };
  }, [query, isMounted, pagination]);

  const getSearch = (e) => {
    e.preventDefault();
    setQuery(search);
    setSearch("");
  };

  const loadMore = async () => {
    if (recipes._links) {
      const nextPage = pagination[pagination.length - 1].next;
      const response = await api.get(`/recipes/home/next/${query}/${nextPage}`);
      setRecipes(response.data);
      const newURL = new URL(response.data._links.next.href).searchParams;
      let page = {
        next: newURL.get("_cont"),
        number: pagination.length + 2,
      };
      let newPage = [...pagination, page];
      setPagination(newPage);
      setCurrentPage(pagination.length + 1);
    }
  };

  const toPage = async (page) => {
    if (recipes._links) {
      const response = await api.get(
        `/recipes/home/next/${query}/${page.next}`
      );
      setRecipes(response.data);
      setCurrentPage(page.number);
    }
  };

  const loadQuery = async () => {
    const response = await api.get(`/recipes/home/${query}`);
    setRecipes(response.data);
    setCurrentPage(1);
  };

  return (
    <div className="text-center h-full mx-0 p-0 relative -z-1 text-black w-full bg-white">
      <div className="lg:max-w-[1930px] max-w-[1240px] m-auto h-full">
        <div className="topSection">
          <h1 className="font-bold text-8xl text-green-900 md:p-[2rem]">
            Zest
          </h1>
          <div className="relative w-full h-[400px]">
            <form
              onSubmit={getSearch}
              className=" relative z-[1] bg-transparent top-[10rem] flex flex-row justify-center"
            >
              <input
                className="max-w-[700px] w-[30%] min-w-[300px] h-12 rounded-lg  text-black text-2xl text-center border-slate-500 border-2"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button
                type="submit"
                className="w-[100px] h-[50px] text-base text-green-900 font-bold bg-white rounded-lg border-slate-500 border-2"
              >
                Find Recipes
              </button>
            </form>

            <img
              src="./assets/pexels-roman-odintsov-4551832.jpg"
              alt="background"
              className="w-full h-[400px] absolute z-0 object-cover border-t-4 "
            />
          </div>
        </div>
        {!hasLoaded ? (
          <h1>Loading...</h1>
        ) : (
          <div className="relative z-1 mt-[5rem] ">
            <h1 className="font-bold text-3xl text-green-900 md:p-[2rem]">
              Displaying recipes for "{query}"
            </h1>
            <div className="relative flex flex-row justify-center flex-wrap text-[20px]">
              {recipes.hits &&
                recipes.hits.map((m, index) => (
                  <div key={index}>
                    <Link
                      to={`/recipes/${m.recipe.uri.slice(-32)}`}
                      className="decoration-0"
                    >
                      <RecipeButton
                        title={m.recipe.label}
                        image={m.recipe.image}
                      />
                    </Link>
                  </div>
                ))}
            </div>

            <div className="flex flex-row mx-auto justify-center gap-5 pb-20 h-full">
              <button
                className={
                  currentPage === 1
                    ? "bg-white  text-green-900 font-bold text-[45px] w-[20px] h-[80px] "
                    : "bg-white  text-green-900 font-bold text-[25px] w-[20px] h-[80px] "
                }
                onClick={() => loadQuery()}
              >
                1
              </button>
              {pagination.length > 0 &&
                pagination.slice(0, pagination.length - 1).map((page, i) => (
                  <button
                    className={
                      currentPage === page.number
                        ? "bg-white  text-green-900 font-bold text-[45px] w-[20px] h-[80px] "
                        : "bg-white  text-green-900 font-bold text-[25px] w-[20px] h-[80px] "
                    }
                    onClick={() => toPage(page)}
                    key={i}
                  >
                    {i + 2}
                  </button>
                ))}
              <button
                className="bg-white  text-green-900 font-bold text-[25px] w-[100px] h-[80px]"
                onClick={() => loadMore()}
              >
                Next...
              </button>
            </div>
          </div>
        )}
      </div>
      <a
        href="http://developer.edamam.com"
        target="_blank"
        rel="noreferrer noopener"
      >
        <Logo className="w-[300px] absolute cursor-pointer right-0 bottom-0" />
      </a>
    </div>
  );
};

export default Home;
