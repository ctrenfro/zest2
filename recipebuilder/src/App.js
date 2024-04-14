import Home from "./components/Home";
import RecipePage from "./components/RecipePage";
import ShoppingList from "./components/ShoppingList";
import Login from "./components/Login";
import Register from "./components/Register";
import Favorites from "./components/Favorites.jsx";
import { Routes, Route } from "react-router-dom";
import { useState } from "react";

import PersistLogin from "./components/PersistLogin";

function App() {
  const [data, setData] = useState("");

  return (
    <Routes>
      <Route element={<PersistLogin />}>
        <Route exact path="/" element={<Home />} />

        <Route
          path="recipes/:query"
          element={<RecipePage childToParent={setData} />}
        />

        <Route
          path="shoppingList"
          element={<ShoppingList ingredients={data} />}
        />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="favorites" element={<Favorites />} />
      </Route>
    </Routes>
  );
}

export default App;
