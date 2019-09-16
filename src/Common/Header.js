import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';

class Header extends PureComponent {
  render() {
    return (
      <div>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/blackjack">Blackjack</Link>
      </div>
    )
  }
}

export default Header;