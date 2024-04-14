import User from "../model/User.js";

const deleteUser = async (req, res) => {
  if (!req?.body?.id)
    return res.status(400).json({ message: "User ID required!" });
  const user = await User.findOne({ _id: req.body.id }).exec();
  if (!user) {
    return res
      .status(400)
      .json({ message: `No user matches ID ${req.body.id}` });
  }
  const result = await user.deleteOne({ _id: req.body.id });
  res.json(result);
};

const getUser = async (req, res) => {
  if (!req?.params?.id)
    return res.status(400).json({ message: "User ID required!" });
  const user = await User.findOne({ _id: req.params.id }).exec();
  if (!user) {
    return res
      .status(400)
      .json({ message: `No user matches ID ${req.params.id}` });
  }
  res.json(user);
};

const newRecipe = async (req, res) => {
  const { recipeID } = req.body;

  if (!req?.params?.id) {
    return res.status(400).json({ message: "ID parameter is required!" });
  }

  const user = await User.findOne({ _id: req.params.id }).exec();

  if (!user) {
    return res
      .status(400)
      .json({ message: `No user matches ID ${req.params.id}` });
  }

  const newRecipe = {
    recipeID: recipeID,
  };

  const result = user.recipes.push(newRecipe);
  user.save();

  res.json(result);
};

const getFavorites = async (req, res) => {
  if (!req?.params?.id) {
    return res.status(400).json({ message: "ID parameter is required!" });
  }

  const user = await User.findOne({ _id: req.params.id }).exec();

  if (!user) {
    return res
      .status(400)
      .json({ message: `No user matches ID ${req.params.id}` });
  }

  const favorites = [user.recipes];

  if (!favorites) return res.status(204).json({ message: "No recipes found!" });
  res.json(favorites);
};

const removeFromFavorites = async (req, res) => {
  const { recipeID } = req.body;
  if (!req?.params?.id) {
    return res.status(400).json({ message: "ID parameter is required!" });
  }

  const recipeRemoved = await User.updateOne(
    { _id: req.params.id },
    { $pull: { recipes: { recipeID: recipeID } } }
  ).exec();

  if (!recipeRemoved) {
    return res
      .status(400)
      .json({ message: `No recipe matches ID ${req.params.id}` });
  }

  res.json("Recipe Removed");
};

export { deleteUser, getUser, newRecipe, getFavorites, removeFromFavorites };
