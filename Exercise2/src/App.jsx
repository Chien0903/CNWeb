import React from "react";
import "./App.css";
import SearchForm from "./components/searchForm";
import ResultTable from "./components/resultTable";
import AddUser from "./components/AddUser";

function App() {
  const [kw, setKeyword] = React.useState("");
  const [newUser, setNewUser] = React.useState(null);
  return (
    <div>
      <SearchForm onChangeValue={setKeyword} />
      <AddUser onAdd={setNewUser} />
      <ResultTable
        keyword={kw}
        user={newUser}
        onAdded={() => setNewUser(null)}
      />
    </div>
  );
}

export default App;
