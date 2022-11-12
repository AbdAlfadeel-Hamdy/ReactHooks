import React, { useEffect, useState } from "react";

import Card from "../UI/Card";
import "./Search.css";

const Search = React.memo(({ onFilterIngredients }) => {
  const [searchInput, setSearchInput] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => {
      const loadIngredients = async () => {
        const response =
          await fetch(`https://ingredients-df31b-default-rtdb.firebaseio.com/ingredients.json
        `);
        const data = await response.json();
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
      };
      loadIngredients();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput, onFilterIngredients]);
  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
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
