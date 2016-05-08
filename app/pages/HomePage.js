import React from 'react';
import DocumentTitle from 'react-document-title';
import Heading from 'grommet/components/Heading';
import Box from 'grommet/components/Box';
import Paragraph from 'grommet/components/Paragraph';
import { Link } from 'react-router';

class HomePage extends React.Component {

  render = () => (
    <Box justify='center' pad={{vertical: 'small', horizontal: 'medium'}}>
      <DocumentTitle title='Home - Healthbeacon' />
      <Heading>Healthbeacon</Heading>
      <Paragraph size="large">Welcome to Healthbeacon, an application for visualising and monitoring fitness information.</Paragraph>
        <Link to="/dashboard">Proceed to Dashboard</Link>
    </Box>
  );

}

export default HomePage;
