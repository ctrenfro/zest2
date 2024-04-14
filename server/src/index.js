import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { corsOptions } from "./config/corsOptions.js";
import credentials from "./middleware/credentials.js";
import { connectDB } from "./config/dbConn.js";
import mongoose from "mongoose";
import verifyJWT from "./middleware/verifyJWT.js";
import path from "path";
import register from "./routes/register.js";
import auth from "./routes/auth.js";
import refresh from "./routes/refresh.js";
import logout from "./routes/logout.js";
import users from "./routes/api/users.js";
const PORT = process.env.PORT || 3500;
const app = express();
import recipes from "./routes/recipes.js";
import * as url from "url";

//const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

dotenv.config();

connectDB();
app.get("/*", function (req, res) {
  res.sendFile("../../recipebuilder/build/index.html", function (err) {
    if (err) {
      res.status(500).send(err);
    }
  });
});

//app.use(express.static(path.join(__dirname + "/recipebuilder/public")));

app.use(credentials);

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: false }));

app.use(express.json());

app.use(cookieParser());
app.use("/register", register);
app.use("/auth", auth);
app.use("/refresh", refresh);
app.use("/logout", logout);
app.use("/recipes", recipes);

app.use(verifyJWT);
app.use("/users", users);

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

mongoose.connection.once("open", () => {
  console.log("Connected to Mongodb");
  app.listen(PORT, () => console.log("server running on port " + PORT));
});
