import Reflux from 'reflux';
import AuthStore from './AuthStore';
import AuthActions from '../actions/AuthActions';
import GoogleAuth from '../services/GoogleAuth';
import fetch from 'isomorphic-fetch';

const FitnessStore = Reflux.createStore({

  state: {},

  fields: {
    "distance": "com.google.distance.delta",
    "weight": "com.google.weight"
  },

  /**
   * @return {void}
   */
  init() {
    this.listenTo(AuthStore, this.fetchAggregate);
    this.state = {
      buckets: {}
    };
  },

  getInitialState() {
    return this.state;
  },

  fetchAggregate(e) {
    if (e !== 'tokenChanged') {
      return;
    }
    const date = new Date();
    const aggregateBy = Object.keys(this.fields).map((key) => ({
        "dataTypeName": this.fields[key]
      }));
    fetch('https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AuthStore.getToken()}`
      },
      body: JSON.stringify({
        "startTimeMillis": (date.getTime() - (28 * 24 * 60 * 60 * 1000)),
        "endTimeMillis": date.getTime(),
        "aggregateBy": aggregateBy,
        "bucketByTime": {
          "durationMillis": (24 * 60 * 60 * 1000)
        },

      })
    })
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      this.parseResponse(res);
      this.trigger(this.state);
    })
    .catch((err) => {
      console.error(err);
    });
  },

  mapToHumanName(activityBucket) {
    return Object.keys(this.fields).reduce((previous, current) => {
      return activityBucket.indexOf(this.fields[current]) !== -1 ? current : previous
    }, activityBucket);
  },

  addPoint(activityBucket, point) {
    activityBucket = this.mapToHumanName(activityBucket);
    if (!this.state.buckets.hasOwnProperty(activityBucket)) {
      this.state.buckets[activityBucket] = [];
    }
    point.value.map((value) => ({
      value: (value.fpVal) ? value.fpVal.toFixed(3) : 0,
      date: new Date((point.startTimeNanos/1000000))
    })).map((datapoint) => {
      if (this.state.buckets[activityBucket].find((point) => (
        (point.date.toDateString() === datapoint.date.toDateString()) && (point.value === datapoint.value)
      )) === undefined) {
        this.state.buckets[activityBucket].push(datapoint)
      }
    });
  },

  parseResponse(res) {
    res.bucket.forEach((currentBucket) => {
      currentBucket.dataset.forEach((dataset) => {
        if (dataset.hasOwnProperty('point')) {
          dataset.point.forEach((datapoint) => {
            this.addPoint(
              dataset.dataSourceId,
              datapoint
            );
          });
        }
      });
    });
    this.trigger(this.state);
  },

});

export default FitnessStore;
