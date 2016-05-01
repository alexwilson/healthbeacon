import React from 'react';
import DocumentTitle from 'react-document-title';
import Header from './components/Header';

class App extends React.Component {
  render = () => (
    <div className="app">
      <DocumentTitle title='Healthbeacon' />
      <Header />
      <main>{this.props.children}</main>
    </div>
  );
}

export default App;
