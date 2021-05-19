import React from 'react';
import { Link } from 'react-router-dom';

import './Header.scss'

const Header: React.FC = () => {
  return (
    <header>
      <div className="container">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/auth">Auth</Link>
          </li>
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
        </ul>
      </div>
    </header>
  );
}

export default Header;
