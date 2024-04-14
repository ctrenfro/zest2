import React, { useEffect, useRef, useState } from "react";
import { ReactComponent as Logo } from "../components/icons/Edamam_Badge_Light.svg";

const ShoppingList = ({ ingredients }) => {
  let effect = useRef(true);
  const [list, setList] = useState();
  const [quantity, setQuantity] = useState();
  const [measurement, setMeasurement] = useState();
  const [name, setName] = useState();

  useEffect(() => {
    if (ingredients) {
      localStorage.setItem("list", JSON.stringify(ingredients));
    }

    if (effect.current === false) {
      const localValue = JSON.parse(localStorage.getItem("list")) || [];
      setList(localValue);
    }

    return () => {
      effect.current = false;
    };
  }, [ingredients]);

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

  const newIngredient = (e) => {
    e.preventDefault();
    const newItem = {
      quantity: quantity,
      measurement: measurement,
      itemName: name,
    };
    const newList = [...list, newItem];
    setList(newList);
    localStorage.setItem("list", JSON.stringify(newList));
    setMeasurement("");
    setQuantity("");
    setName("");
  };

  const deleteShoppingList = (e) => {
    e.preventDefault();
    setList([]);
    localStorage.setItem("list", JSON.stringify([]));
  };

  return (
    <div className="  text-black">
      <h1 className=" text-center mt-[6rem] text-3xl font-bold text-green-900">
        Shopping List
      </h1>
      <hr className="bg-white m-[2rem] h-[2px] border-t-2" />
      <div className="text-[24px] m-auto text-center cursor-pointer ">
        {list
          ? list.map((ingredient, i) => (
              <div className="shoppingList--container " key={i}>
                <span className="text-green-900">
                  {checkBadString(ingredient.quantity) + " "}
                </span>
                <span className="text-green-900">
                  {checkBadString(ingredient.measurement) + " "}
                </span>
                <span className="text-green-900">
                  {ingredient.itemName + " "}
                </span>
              </div>
            ))
          : ingredients &&
            ingredients.map((ingredient, i) => (
              <div className="shoppingList--container" key={i}>
                <span className="text-green-900">
                  {checkBadString(ingredient.quantity) + " "}
                </span>
                <span className="text-green-900">
                  {checkBadString(ingredient.measurement) + " "}
                </span>
                <span className="text-green-900">
                  {ingredient.itemName + " "}
                </span>
              </div>
            ))}

        <form className="mt-8" onSubmit={newIngredient}>
          <h1 className="font-bold text-green-900">Add New Ingredient</h1>
          <div className="flex flex-col gap-2 lg:flex-row max-w-[1080px] mx-auto">
            <div className="flex flex-col mx-auto ">
              <label For="ingredientQuantity" className="text-green-900">
                Quantity
              </label>
              <input
                className="border-[1px] text-green-900 text-center border-green-900 bg-white rounded max-w-[300px]"
                id="ingredientQuantity"
                name="ingredientQuantity"
                type="text"
                value={quantity || ""}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
            <div className="flex flex-col mx-auto justify-items-center">
              <label For="ingredientMeasurement" className="text-green-900">
                Measurement
              </label>
              <input
                className="border-[1px] text-green-900 text-center border-green-900 rounded max-w-[300px]"
                id="ingredientMeasurement"
                name="ingredientMeasurement"
                type="text"
                value={measurement || ""}
                onChange={(e) => setMeasurement(e.target.value)}
              />
            </div>
            <div className="flex flex-col mx-auto ">
              <label
                For="ingredientItemName"
                className="text-green-900 max-w-[300px]"
              >
                Name
              </label>
              <input
                className="border-[1px] text-green-900 text-center border-green-900  rounded"
                id="ingredientItemName"
                name="ingredientItemName"
                type="text"
                value={name || ""}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <button
              className="mt-9 pl-2 pr-2 max-w-[60px] mx-auto text-green-900 border-2 rounded border-green-900 hover:text-white hover:bg-green-900"
              type="submit"
            >
              Add
            </button>
          </div>
        </form>
        <div className="mt-8 mx-auto">
          <button
            onClick={deleteShoppingList}
            className="border-4 border-green-900 rounded-lg p-2 text-green-900 text-md font-bold cursor-pointer hover:text-white hover:bg-green-900
          "
          >
            Delete Shopping List
          </button>
        </div>
      </div>
      <a
        href="http://developer.edamam.com"
        target="_blank"
        rel="noreferrer noopener"
      >
        <Logo className="w-[300px] absolute cursor-pointer right-0 bottom-0 mr-3" />
      </a>
    </div>
  );
};

export default ShoppingList;
