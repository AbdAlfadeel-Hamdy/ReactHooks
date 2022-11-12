import React, { useCallback, useState } from "react";

import IngredientForm from "./IngredientForm";
import Search from "./Search";
import IngredientList from "./IngredientList";
function Ingredients() {
  const [ingredients, setIngredients] = useState([]);

  // useEffect(() => {
  //   const loadIngredients = async () => {
  //     const response = await fetch(
  //       `https://ingredients-df31b-default-rtdb.firebaseio.com/ingredients.json`
  //     );
  //     const data = await response.json();
  //     console.log(data);
  //     const loadedIngredients = [];
  //     for (const key in data)
  //       loadedIngredients.push({
  //         id: key,
  //         title: data[key].title,
  //         amount: data[key].amount,
  //       });
  //     setIngredients(loadedIngredients);
  //   };
  //   loadIngredients();
  // }, []);

  const addIngredientHandler = async (ingredient) => {
    const response = await fetch(
      `https://ingredients-df31b-default-rtdb.firebaseio.com/ingredients.json`,
      {
        method: "POST",
        body: JSON.stringify(ingredient),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    setIngredients((prevIngredients) => [
      ...prevIngredients,
      {
        id: data.name,
        title: ingredient.title,
        amount: ingredient.amount,
      },
    ]);
  };

  const filterIngredientsHandler = useCallback(
    (ingredients) => setIngredients(ingredients),
    []
  );
  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} />
      <section>
        <Search onFilterIngredients={filterIngredientsHandler} />
        <IngredientList ingredients={ingredients} onRemoveItem={() => {}} />
      </section>
    </div>
  );
}

export default Ingredients;
