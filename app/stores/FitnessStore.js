import Reflux from 'reflux';
import AuthStore from './AuthStore';
import AuthActions from '../actions/AuthActions';
import GoogleAuth from '../services/GoogleAuth';
import fetch from 'isomorphic-fetch';

const FitnessStore = Reflux.createStore({

  state: {},

  /**
   * @return {void}
   */
  init() {
    this.listenTo(AuthStore, this.fetchAggregate);
    this.state = {
      buckets: []
    };
  },

  getInitialState() {
    return this.state;
  },

  fetchAggregate(e) {
    if (e !== 'tokenChanged') {
      return;
    }
    let date = new Date();
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
        "aggregateBy": [{
          "dataTypeName": "com.google.weight"
        }, {
          "dataTypeName": "com.google.distance.delta"
        }],
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
    switch (activityBucket) {
      case 'derived:com.google.distance.delta:com.google.android.gms:aggregated':
        activityBucket = 'distance';
        break;

      case 'derived:com.google.weight.summary:com.google.android.gms:aggregated':
        activityBucket = 'weight';
        break;
    }
    return activityBucket;
  },

  addPoint(timestamp, activityBucket, point) {
    activityBucket = this.mapToHumanName(activityBucket);
    if (!this.state.buckets.hasOwnProperty(activityBucket)) {
      this.state.buckets[activityBucket] = {};
    }
    if (!this.state.buckets[activityBucket].hasOwnProperty(timestamp)) {
      this.state.buckets[activityBucket][timestamp] = [];
    }
    this.state.buckets[activityBucket][timestamp].push(point);
  },

  parseResponse(res) {
    let self = this;
    res.bucket.forEach(function(currentBucket) {
      currentBucket.dataset.forEach(function(dataset) {
        if (dataset.hasOwnProperty('point')) {
          dataset.point.forEach(function(datapoint) {
            self.addPoint(
              currentBucket.startTimeMillis,
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
