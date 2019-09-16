import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
// Common Files
import Header from './Common/Header';

// Routed Components
import Home from './Containers/Home/index';
import About from './Containers/About/index';
import Blackjack from './Containers/Blackjack/index';

// TODO
// - pulling cards to create hands
// - monitoring recips
// - hit/stand for both
// - double
// - split
// - create computer based dealer

function App() {
  return (
    <Router>
      {/* <Header /> */}
      <Route exact path="/" component={Home} />
      <Route exact path="/about" component={About} />
      <Route exact path="/blackjack" component={Blackjack} />
    </Router>
  )
}

export default App;