import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import MainPage from './components/MainPage';
import TestPage from './components/TestPage';
import EditTestPage from './components/EditTestPage';
import './styles.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Switch>
          <Route path="/" exact component={MainPage} />
          <Route path="/test" component={TestPage} />
          <Route path="/edit" component={EditTestPage} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
