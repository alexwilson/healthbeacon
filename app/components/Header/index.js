import React from 'react';
import {Link} from 'react-router';
import styles from './style';

class Header extends React.Component {
  render = () => (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <ul className={styles.nav__list}>
          <li className={styles.nav__list__item}><Link to="/">Home</Link></li>
          <li className={styles.nav__list__item}><Link to="/dashboard">Dashboard</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
