import React from "react";

const RecipeButton = (props) => {
  return (
    <div className="flex flex-col bg-green-900 m-10 p-0 rounded-2xl   text-green-900  hover:border-r-[3px]  hover:border-green-900 hover:border-b-[3px] hover:translate-x-[-4px] shadow-lg shadow-black">
      <div className="p-6  rounded-t-2xl bg-white">
        <img src={props.image} alt="" className="relative   rounded-2xl " />
      </div>
      <div className="pl-4 pb-2 bg-green-900 rounded-b-2xl">
        <h3 className="text-left ml-2 pt-2 text-white font-bold">
          {props.title}
        </h3>
      </div>
    </div>
  );
};

export default RecipeButton;
