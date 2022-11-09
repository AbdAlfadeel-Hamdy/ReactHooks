import React, { useState } from "react";

import IngredientForm from "./IngredientForm";
import Search from "./Search";
import IngredientList from "./IngredientList";
function Ingredients() {
  const [ingredients, setIngredients] = useState([]);
  const addIngredientHandler = (ingredient) =>
    setIngredients((prevIngredients) => [
      ...prevIngredients,
      {
        id: Math.random().toString(),
        title: ingredient.title,
        amount: ingredient.amount,
      },
    ]);
  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} />

      <section>
        <Search />
        <IngredientList ingredients={ingredients} onRemoveItem={() => {}} />
      </section>
    </div>
  );
}

export default Ingredients;
