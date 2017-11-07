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
    if (!this.state.steps || !this.state.steps.length) return null;
    const {target} = this.state.steps[0];
    const element = document.querySelectorAll(target)[0];
    if (!element) return null;
    const left = element.offsetLeft - (element.clientWidth / 2) + parseInt(window.getComputedStyle(element, null).marginLeft, 10);
    const top = element.offsetTop;

    return (
      <div className="dugout-blinker" style={{top: top, left: left}}></div>
    );
  }
});

export default DugoutHelper;
