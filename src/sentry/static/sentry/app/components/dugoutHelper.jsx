import React from 'react';
import ApiMixin from '../mixins/apiMixin';

const DugoutHelper = React.createClass({

  mixins: [ApiMixin],

  getInitialState(props) {
   return {};
  },

  beginPolling() {
    this.api.request("/dugout/", {
      method: 'GET',
      success: (response) => {
        if (response) this.setState(Object.assign({}, this.state, response));
        window.setTimeout(this.beginPolling, 3000);
      }
    });
  },

  componentDidMount() {
    this.beginPolling();
  },

  render() {
    let {thingy} = this.state;

    return (
      <h1>dugout == {thingy}</h1>
    );
  }
});

export default DugoutHelper;
