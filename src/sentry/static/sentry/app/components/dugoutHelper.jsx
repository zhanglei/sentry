import React from 'react';
import ApiMixin from '../mixins/apiMixin';

const DugoutHelper = React.createClass({

  mixins: [ApiMixin],

  getInitialState(props) {
   return {
     guides: []
   };
  },

  beginPolling() {
    this.api.request(`/dugout/${this.props.organizationId}/`, {
      method: 'GET',
      success: (response) => {
        if (response) this.setState({guides: response});
        window.setTimeout(this.beginPolling, 3000);
      }
    });
  },

  componentDidMount() {
    this.beginPolling();
  },

  render() {
    if (!this.state.guides.length) return null;
    const {target} = this.state.guides[0].steps[0];
    const element = document.querySelectorAll(target)[0];
    if (!element) return null;
    const left = element.offsetLeft - (element.clientWidth / 2) + parseInt(window.getComputedStyle(element, null).marginLeft, 10);
    const top = element.offsetTop;

    return (
      <div className="dugout-blinker" style={{top, left}}>
        <div className="dugout-blink-inner-1" />
        <div className="dugout-blink-inner-2" />
      </div>
    );
  }
});

export default DugoutHelper;
