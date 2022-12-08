import React, { useCallback, useEffect, useReducer } from "react";
import IngredientForm from "./IngredientForm";
import Search from "./Search";
import IngredientList from "./IngredientList";
import ErrorModal from "../UI/ErrorModal";
import useHttp from "../../hooks/http";

// Reducers
const ingredinetsReducer = (currentIngredients, action) => {
  switch (action.type) {
    case "SET":
      return action.ingredients;
    case "ADD":
      return [...currentIngredients, action.ingredient];
    case "DELETE":
      return currentIngredients.filter((ing) => ing.id !== action.id);
    default:
      throw new Error(`Case not found!`);
  }
};

// Main Functional Component
function Ingredients() {
  const [ingredients, dispatch] = useReducer(ingredinetsReducer, []);
  const {
    isLoading,
    error,
    data,
    sendRequest,
    reqExtra,
    reqIdentifier,
    clear,
  } = useHttp();
  // Handling Response
  useEffect(() => {
    if (!isLoading && !error && reqIdentifier === "REMOVE_INGREDIENT")
      dispatch({ type: "DELETE", id: reqExtra });
    else if (!isLoading && !error && reqIdentifier === "ADD_INGREDIENT")
      dispatch({ type: "ADD", ingredient: reqExtra });
  }, [data, reqExtra, reqIdentifier, error, isLoading]);

  // ADD Ingredient
  const addIngredientHandler = useCallback(
    (ingredient) => {
      sendRequest(
        `https://ingredients-df31b-default-rtdb.firebaseio.com/ingredients.json`,
        "POST",
        JSON.stringify(ingredient),
        ingredient,
        "ADD_INGREDIENT"
      );
    },
    [sendRequest]
  );
  // Filter Ingredients
  const filterIngredientsHandler = useCallback(
    (filteredIngredients) =>
      dispatch({ type: "SET", ingredients: filteredIngredients }),
    []
  );
  // Remove Ingredient
  const removeItemHandler = useCallback(
    (itemId) => {
      sendRequest(
        `https://ingredients-df31b-default-rtdb.firebaseio.com/ingredients/${itemId}.json`,
        "DELETE",
        null,
        itemId,
        "REMOVE_INGREDIENT"
      );
    },
    [sendRequest]
  );

  return (
    <div className="App">
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
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
