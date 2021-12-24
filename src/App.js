import logo from "./logo.svg";
import React, {
  useState,
  useEffect,
  Fragment,
} from "react";
import "./App.scss";
import Card from "./Card";

const App = () => {
  // console.log = function() {}
  return (
    <div className="App">
      <Card/>
    </div>
  );
};

export default App;
