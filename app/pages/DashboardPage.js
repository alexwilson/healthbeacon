import React from 'react';
import DocumentTitle from 'react-document-title';
import { Link } from 'react-router';
import FitnessStore from '../stores/FitnessStore';
import Section from 'grommet/components/Section';
import Chart from 'grommet/components/Chart';
import Value from 'grommet/components/Value';
import Box from 'grommet/components/Box';
import Heading from 'grommet/components/Heading';
import Tile from 'grommet/components/Tile';
import Tiles from 'grommet/components/Tiles';
import LinkUp from 'grommet/components/icons/base/LinkUp';
import LinkDown from 'grommet/components/icons/base/LinkDown';
import More from 'grommet/components/icons/base/More';

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
    let series = [];
    let figures = [];
    if (this.state && this.state.fitness) {
      series = Object.keys(this.state.fitness.buckets).map((bucket) => ({
          'label': bucket,
          'values': [...this.state.fitness.buckets[bucket]]
            .map((point) => [point.date, point.value]),
        })
      );

      if (this.state.fitness.buckets['weight']) {
        let bucket = [...this.state.fitness.buckets['weight']].sort((a, b) => a.date - b.date);
        let currentWeight = bucket.pop();
        let previousWeight = bucket.pop();
        let trendIcon = (currentWeight.value === previousWeight.value) ? (
          <More size="xlarge" colorIndex="warning" />
        ) : (
          (currentWeight.value < previousWeight.value) ?
          <LinkDown size="xlarge" colorIndex="ok" /> : <LinkUp size="xlarge" colorIndex="error" />
        );
        figures.push({
          type: 'weight',
          value: currentWeight.value.toFixed(1),
          units: "kg",
          label: "Weight",
          trendIcon: trendIcon
        });
      }

      if (this.state.fitness.buckets['calories']) {
        let bucket = [...this.state.fitness.buckets['calories']].sort((a, b) => a.date - b.date);
        let currentCalories = bucket.pop();
        let previousCalories = bucket.pop();
        let trendIcon = (currentCalories.value > previousCalories.value) ?
          <LinkUp size="xlarge" colorIndex="ok" /> : <LinkDown size="xlarge" colorIndex="warning" />
        ;
        figures.push({
          type: "calories",
          value: currentCalories.value.toFixed(1),
          units: "kcal",
          label: "Calories Consumed",
          trendIcon: trendIcon
        });
      }

    }
    return (
      <Box>
        <DocumentTitle title='Dashboard - Healthbeacon' />
        <Heading>Dashboard</Heading>
        <Section primary={true}>
          <Chart
            series={series}
            size={'large'}
            type={'area'}
            smooth={true}
            legend={{position: 'overlay', total: false}}
            a11yTitleId="AggregateChart"
            a11yDescId="Aggregate Chart"
          />
          <Tiles flush={false} justify="center" fill={true} full="horizontal">
            {figures.map((figure) => (
              <Tile colorIndex="light-1">
                <Value key={figure.type} value={figure.value} units={figure.units} trendIcon={figure.trendIcon} label={figure.label} size="large" />
              </Tile>
            ))}
          </Tiles>
        </Section>
      </Box>
    )
  };

}

export default DashboardPage;
