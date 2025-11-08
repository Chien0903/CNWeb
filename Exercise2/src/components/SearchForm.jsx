import React from "react";

function SearchForm({ onChangeValue }) {
  return (
    <div>
      <input
        type="text"
        placeholder="Tìm theo tên, username"
        onChange={(e) => onChangeValue(e.target.value)}
      />
    </div>
  );
}

export default SearchForm;
