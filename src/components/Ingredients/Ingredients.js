import React, { useCallback, useState } from "react";

import IngredientForm from "./IngredientForm";
import Search from "./Search";
import IngredientList from "./IngredientList";
import ErrorModal from "../UI/ErrorModal";
function Ingredients() {
  const [ingredients, setIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

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
    try {
      setIsLoading(true);
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
      setIsLoading(false);
      const data = await response.json();
      setIngredients((prevIngredients) => [
        ...prevIngredients,
        {
          id: data.name,
          title: ingredient.title,
          amount: ingredient.amount,
        },
      ]);
    } catch (error) {
      setError(`Something went wrong!`);
      setIsLoading(false);
    }
  };

  const filterIngredientsHandler = useCallback(
    (ingredients) => setIngredients(ingredients),
    []
  );
  const removeItemHandler = async (itemId) => {
    try {
      setIsLoading(true);
      await fetch(
        `https://ingredients-df31b-default-rtdb.firebaseio.com/ingredients/${itemId}.json`,
        {
          method: "DELETE",
        }
      );
      setIsLoading(false);
      setIngredients((prevIngredients) =>
        prevIngredients.filter((ing) => ing.id !== itemId)
      );
    } catch (error) {
      setError(`Something went wrong!`);
      setIsLoading(false);
    }
  };
  const clearError = () => {
    setError(null);
  };
  return (
    <div className="App">
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={isLoading}
      />
      <section>
        <Search onFilterIngredients={filterIngredientsHandler} />
        <IngredientList
          ingredients={ingredients}
          onRemoveItem={removeItemHandler}
        />
      </section>
    </div>
  );
}

export default Ingredients;
