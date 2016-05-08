import Reflux from 'reflux';
import AuthStore from './AuthStore';
import AuthActions from '../actions/AuthActions';
import GoogleAuth from '../services/GoogleAuth';
import fetch from 'isomorphic-fetch';
import { BloomFilter } from 'bloomfilter';

const FitnessStore = Reflux.createStore({

  state: {},

  fields: {
    "distance": "com.google.distance.delta",
    "weight": "com.google.weight",
    "calories": "com.google.calories.expended",
  },

  /**
   * @return {void}
   */
  init() {
    this.listenTo(AuthStore, this.fetchAggregate);
    this.state = {
      buckets: {}
    };
    this.bloomFilter = new BloomFilter(32 * 256, 16);
  },

  getInitialState() {
    return this.state;
  },

  fetchAggregate(e) {
    if (e !== 'tokenChanged') {
      return;
    }

    const startTime = new Date();
    startTime.setHours((-28 * 24), 0, 0, 0);

    const endTime = new Date();
    endTime.setHours(24, 0, 0, 0);

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
        "startTimeMillis": startTime.getTime(),
        "endTimeMillis": endTime.getTime(),
        "aggregateBy": aggregateBy,
        "bucketByTime": {
          "durationMillis": (24 * 60 * 60 * 1000),
          "period": {
            "type": "day",
            "value": 1,
            "timeZoneId": "Europe/London"
          }
        },

      })
    })
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      if (res.error) {
        throw new Error(res.error.message);
      }
      this.parseResponse(res);
      this.trigger(this.state);
    })
    .catch((err) => {
      console.error(err);
    });
  },

  mapToHumanName(activityBucket) {
    return Object.keys(this.fields).reduce((previous, current) => (
      activityBucket.indexOf(this.fields[current]) !== -1 ? current : previous
    ), activityBucket);
  },

  addPoint(activityBucket, point) {
    activityBucket = this.mapToHumanName(activityBucket);
    if (!this.state.buckets.hasOwnProperty(activityBucket)) {
      this.state.buckets[activityBucket] = new Set();
    }
    point.value.forEach((value) => {
      const date = new Date((point.startTimeNanos/1000000));
      date.setHours(date.getHours(), 0, 0, 0)
      const datapoint = {
        value: (value.fpVal) ? +value.fpVal.toFixed(3) : 0,
        date: date
      };
      if (!this.bloomFilter.test(JSON.stringify(datapoint))) {
        this.state.buckets[activityBucket].add(datapoint);
        this.bloomFilter.add(JSON.stringify(datapoint));
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
