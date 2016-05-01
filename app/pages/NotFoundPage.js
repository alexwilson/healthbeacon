import React from 'react';
import DocumentTitle from 'react-document-title';
import { Link } from 'react-router';

class NotFoundPage extends React.Component {

  render = () => (
    <div>
      <DocumentTitle title='Page not found - Healthbeacon' />
      <span>Sorry, this page is not available.</span>
      <Link to="/">Click here to go home.</Link>
    </div>
  );

}

export default NotFoundPage;
