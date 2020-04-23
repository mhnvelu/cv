//jshint esversion:6
import React from "react";
import ReactDOM from "react-dom";
import Heading from "./Header";
import Note from "./Note";
import Footer from "./Footer";

function App() {
  return (
    <div>
      <Heading />
      <Note />
      <Footer />
    </div>
  );
}

export default App;
