import React from 'react';
import DocumentTitle from 'react-document-title';
import { Link } from 'react-router';
import FitnessStore from '../stores/FitnessStore';
import SparklineChart from '../components/SparklineChart';

class DashboardPage extends React.Component {

  constructor(props) {
    super(props);
    this.onFitnessChange = this.onFitnessChange.bind(this);
  };

  state: {
    fitness: {};
  };

  onFitnessChange(fitness) {
    this.setState({
        fitness: fitness
    });
  };

  componentDidMount() {
      this.unsubscribe = FitnessStore.listen(this.onFitnessChange);
  };

  componentWillUnmount() {
      this.unsubscribe();
  };

  render() {
    if (!this.state || !this.state.fitness) {
      return (<span>Loading data...</span>);
    }


    return (
    <div>
      <DocumentTitle title='Dashboard - Healthbeacon' />
      <h1>Dashboard</h1>
      {Object.keys(this.state.fitness.buckets).map((bucket) =>
        <SparklineChart key={bucket} name={bucket} data={this.state.fitness.buckets[bucket]} />
      )}
    </div>
  )};

}

export default DashboardPage;
