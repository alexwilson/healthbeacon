import React from 'react';
import DocumentTitle from 'react-document-title';
import { Link } from 'react-router';

class HomePage extends React.Component {

  render = () => (
    <div>
      <DocumentTitle title='Home - Healthbeacon' />
      <span>Home!</span>
      <Link to="/dashboard">To Dashboard!</Link>
    </div>
  );

}

export default HomePage;
