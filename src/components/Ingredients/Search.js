import React, { useEffect, useState } from "react";

import Card from "../UI/Card";
import "./Search.css";
import useHttp from "../../hooks/http";
import ErrorModal from "../UI/ErrorModal";
const Search = React.memo(({ onFilterIngredients }) => {
  const [searchInput, setSearchInput] = useState("");
  const { isLoading, data, error, sendRequest, clear } = useHttp();
  useEffect(() => {
    const timer = setTimeout(() => {
      sendRequest(
        `https://ingredients-df31b-default-rtdb.firebaseio.com/ingredients.json`,
        "GET"
      );
    }, 500);
    return () => clearTimeout(timer);
  }, [sendRequest, searchInput]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isLoading && !error && data) {
        const loadedIngredients = [];
        for (const key in data) {
          loadedIngredients.push({
            id: key,
            title: data[key].title,
            amount: data[key].amount,
          });
        }
        const filteredIngredients = loadedIngredients.filter((ing) =>
          ing.title.startsWith(searchInput)
        );

        if (!searchInput) return onFilterIngredients(loadedIngredients);
        onFilterIngredients(filteredIngredients);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [isLoading, error, data, onFilterIngredients, searchInput]);
  return (
    <section className="search">
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          {isLoading && <span>Loading...</span>}
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
