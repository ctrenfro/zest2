import express from "express";
const router = express.Router();
import {
  getRecipes,
  getRecipe,
  getNextPage,
  getRecipeByUri,
} from "../controllers/recipeController.js";

try {
  router.get("/byUri/:query", getRecipeByUri);
} catch (error) {
  console.log(error);
}

router.get("/:query", getRecipe);

router.get("/home/:query", getRecipes);

router.get("/home/next/:query/:page", getNextPage);

export default router;
