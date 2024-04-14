import express from "express";
const router = express.Router();

import {
  deleteUser,
  getUser,
  newRecipe,
  getFavorites,
  removeFromFavorites,
} from "../../controllers/usersController.js";

router.route("/").delete(deleteUser);

router.route("/:id").get(getUser);

router.route("/addRecipe/:id").put(newRecipe);

router.route("/favorites/:id").get(getFavorites);

router.route("/removeRecipe/:id").put(removeFromFavorites);

export default router;
