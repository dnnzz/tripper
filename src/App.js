import React, { Component } from 'react';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import "./App.css";
import { Switch , Route} from "react-router-dom";
import CreateProfile from './components/CreateProfile';
import MainScreen from './components/MainScreen';
import Matches from './components/Matches';
import Messages from './components/Messages';
import Message from './components/Message';

class Application extends Component {
  render() {

    return (
      <main className="container">
        <Switch>
          <Route exact path="/" component={SignIn} />
          <Route exact path="/signUp" component={SignUp} />
          <Route exact path="/createProfile" component={CreateProfile} />
          <Route exact path="/mainPage" component={MainScreen} />
          <Route exact path="/matches" component={Matches} />
          <Route exact path="/messages" component={Messages} />
          <Route exact path="/messages/:id" component={Message} />
        </Switch>
      </main>
    );
  }
}

export default Application;