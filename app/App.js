import React from 'react';
import DocumentTitle from 'react-document-title';
import GrommetHeader from './components/Header/GrommetHeader';

class App extends React.Component {
  render = () => (
    <div className="app grommet">
      <DocumentTitle title='Healthbeacon' />
      <GrommetHeader />
      <main>{this.props.children}</main>
    </div>
  );
}

export default App;
