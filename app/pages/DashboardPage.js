import React from 'react';
import DocumentTitle from 'react-document-title';
import { Link } from 'react-router';

class DashboardPage extends React.Component {

  render = () => (
    <div>
      <DocumentTitle title='Dashboard - Healthbeacon' />
      <span>Dashboard</span>
    </div>
  );

}

export default DashboardPage;
