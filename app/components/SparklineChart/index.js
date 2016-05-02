import d3 from 'd3';
import React from 'react';
import ReactFauxDOM from 'react-faux-dom';
import styles from './style';

class SparklineChart extends React.Component {

  render() {
      const margin = {top: 20, right: 20, bottom: 30, left: 50}
      const width = 960 - margin.left - margin.right
      const height = 500 - margin.top - margin.bottom

      const data = Object.keys(this.props.data).map(function(key) {
        let dataset = this.props.data[key];

        let val = 0;
        if (dataset.length > 0) {
          let dataVal = dataset.shift().value;
          if (dataVal && dataVal.length > 0) {
            val = dataVal.shift().fpVal;
          }
        }

        return {
          value: val,
          date: new Date(+key)
        }
      }.bind(this));

      const x = d3.time.scale()
        .domain(d3.extent(data, (d) => (d.date.getTime())))
        .range([0, width]);

      const y = d3.scale.linear()
        .domain(d3.extent(data, (d) => (d.value)))
        .range([height, 0]);

      const xAxis = d3.svg.axis()
        .scale(x)
        .ticks(d3.time.days, 1)
        .tickFormat(d3.time.format('%a %d'))
        .tickSize(0)
        .tickPadding(8)
        .orient('bottom')

      const yAxis = d3.svg.axis()
        .scale(y)
        .orient('left')

      const line = d3.svg.line()
        .x((d) => (x(d.date)))
        .y((d) => (y(d.value)))
        .interpolate("basis");

      const node = ReactFauxDOM.createElement('svg')
      const svg = d3.select(node)
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .attr('class', styles.chart)
      .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

      svg.append('g')
        .attr('class', `${styles['chart__axis']} ${styles['chart__axis--x']}`)
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis)

      svg.append('g')
        .attr('class', `${styles['chart__axis']} ${styles['chart__axis--y']}`)
        .call(yAxis)
      .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '.71em')
        .style("text-anchor", "end")
        .text(`${this.props.name}`);

      svg.append('path')
        .datum(data)
        .attr('class', styles.chart__line)
        // .attr('d', (d) => ( line(d) + "Z" ))
        .attr('d', line)

      console.log(node.getElementsByTagName('line'));

      return node.toReact();
  }
};

export default SparklineChart;