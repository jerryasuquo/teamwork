import React, { Component } from "react";
import HowItWorks from "./components/HowItWorks";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./components/Home";
import { Route } from "react-router-dom";
// import "./App.css";

class App extends Component {
  render() {
    return (
      <div>
        <Route exact path="/" component={Home} />
        <Route path="/how-it-works" component={HowItWorks} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
      </div>
    );
  }
}

export default App;
