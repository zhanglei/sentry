import React from 'react';
import ApiMixin from '../mixins/apiMixin';

const DugoutHelper = React.createClass({

  mixins: [ApiMixin],

  getInitialState(props) {
   return {
     guides: [],
     guide: 0,
     step: 0
   };
  },

  requestGuides() {
    this.api.request(`/dugout/${this.props.organizationId}/`, {
      method: 'GET',
      success: (response) => {
        if (response) this.setupGuides(response);
        window.setTimeout(this.requestGuides, 3000);
      }
    });
  },

  setupGuides(json) {
    if (!json.length) return;

    const guides = json.map(g => Object.assign({}, g, {
      firstStepElement: document.querySelectorAll(g.steps[0].target)[0]
    })).filter(g => g.firstStepElement);

    if (!guides.length) return;

    this.setState({guides});
  },

  currentGuide() {
    return this.state.guides[this.state.guide];
  },

  componentDidMount() {
    this.requestGuides();
  },

  render() {
    if (!this.currentGuide()) return null;
    const {left, top} = this.currentGuide().firstStepElement.getBoundingClientRect();

    return (
      <div className="dugout-blinker" style={{top, left}}>
        <div className="dugout-blink-inner-1" />
        <div className="dugout-blink-inner-2" />
      </div>
    );
  }
});

export default DugoutHelper;
