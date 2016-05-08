import React from 'react';
import DocumentTitle from 'react-document-title';
import { Link } from 'react-router';
import FitnessStore from '../stores/FitnessStore';
import Section from 'grommet/components/Section';
import Box from 'grommet/components/Box';
import Heading from 'grommet/components/Heading';
import Spinning from 'grommet/components/icons/Spinning';
import SparklineChart from '../components/SparklineChart';

class DetailsPage extends React.Component {

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
      return (<Spinning />)
    }
    return (
      <Box pad={{vertical: 'small', horizontal: 'medium'}}>
        <DocumentTitle title='Details - Healthbeacon' />
        <Heading>Details</Heading>
        <Section primary={true}>
          {Object.keys(this.state.fitness.buckets).map((bucket) =>
            <SparklineChart key={bucket} name={bucket} data={this.state.fitness.buckets[bucket]} />
          )}
        </Section>
      </Box>
    )
  };

}

export default DetailsPage;
