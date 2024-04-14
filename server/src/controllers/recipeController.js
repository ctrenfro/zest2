import axios from "axios";

const getRecipeByUri = async (req, res) => {
  const ft = encodeURIComponent(req.params.query)
    .replace(/%3D/g, "=")
    .replace(/%26/g, "&");

  const response = await axios.get(
    `https://api.edamam.com/api/recipes/v2/by-uri?type=public&${ft}&app_id=${process.env.ID_KEY}&app_key=${process.env.API_KEY}`
  );

  res.json(response.data);
};

const getRecipe = async (req, res) => {
  const response = await axios.get(
    `https://api.edamam.com/api/recipes/v2/${req.params.query}?type=public&app_id=${process.env.ID_KEY}&app_key=${process.env.API_KEY}`
  );

  res.json(response.data);
};

const getRecipes = async (req, res) => {
  const response = await axios.get(
    `https://api.edamam.com/api/recipes/v2?type=public&q=${req.params.query}&app_id=${process.env.ID_KEY}&app_key=${process.env.API_KEY}&cuisineType=American`
  );

  res.json(response.data);
};

const getNextPage = async (req, res) => {
  const response = await axios.get(
    `https://api.edamam.com/api/recipes/v2?q=${req.params.query}&app_key=${process.env.API_KEY}&_cont=${req.params.page}&cuisineType=American&type=public&app_id=${process.env.ID_KEY}`
  );

  res.json(response.data);
};

export { getRecipeByUri, getRecipe, getRecipes, getNextPage };
