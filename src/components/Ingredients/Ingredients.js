import React, { useCallback, useReducer } from "react";

import IngredientForm from "./IngredientForm";
import Search from "./Search";
import IngredientList from "./IngredientList";
import ErrorModal from "../UI/ErrorModal";
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
const httpReducer = (curHttpState, action) => {
  switch (action.type) {
    case "SEND":
      return { isLoading: true, error: null };
    case "RESPONSE":
      return { ...curHttpState, isLoading: false };
    case "ERROR":
      return { isLoading: false, error: action.errorMessage };
    case "CLEAR":
      return { ...curHttpState, error: null };
    default:
      throw new Error(`Should not reach here!`);
  }
};
function Ingredients() {
  // const [ingredients, setIngredients] = useState([]);
  const [ingredients, dispatch] = useReducer(ingredinetsReducer, []);
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState();
  const [httpState, dispatchHttp] = useReducer(httpReducer, {
    isLoading: false,
    error: null,
  });

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

  const addIngredientHandler = useCallback(async (ingredient) => {
    try {
      dispatchHttp({ type: "SEND" });
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
      dispatchHttp({ type: "RESPONSE" });
      const data = await response.json();
      dispatch({
        type: "ADD",
        ingredient: {
          id: data.name,
          ...ingredient,
        },
      });
    } catch (error) {
      // setError(`Something went wrong!`);
      // setIsLoading(false);
      dispatchHttp({ type: "ERROR", errorMessage: `Something went wrong!` });
    }
  }, []);

  const filterIngredientsHandler = useCallback(
    (filteredIngredients) =>
      dispatch({ type: "SET", ingredients: filteredIngredients }),
    []
  );

  const removeItemHandler = useCallback(async (itemId) => {
    try {
      dispatchHttp({ type: "SEND" });
      await fetch(
        `https://ingredients-df31b-default-rtdb.firebaseio.com/ingredients/${itemId}.jsn`,
        {
          method: "DELETE",
        }
      );
      dispatchHttp({ type: "RESPONSE" });
      dispatch({ type: "DELETE", id: itemId });
    } catch (error) {
      // setError(`Something went wrong!`);
      // setIsLoading(false);
      dispatchHttp({ type: "ERROR", errorMessage: `Something went wrong!` });
    }
  }, []);

  const clearError = () => {
    dispatchHttp({ type: "CLEAR" });
  };

  return (
    <div className="App">
      {httpState.error && (
        <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>
      )}
      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={httpState.isLoading}
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
