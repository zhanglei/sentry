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
      steps: g.steps.map(s => Object.assign({}, s, {element: document.querySelectorAll(s.target)[0]}))
    })).filter(g => g.steps[0].element);

    if (!guides.length) return;

    this.setState({guides});
  },

  currentGuide() {
    return this.state.guides[this.state.guide];
  },

  currentStep() {
    return this.currentGuide().steps[this.state.step];
  },

  componentDidMount() {
    this.requestGuides();
  },

  render() {
    if (!this.currentGuide()) return null;
    const {left, top} = this.currentStep().element.getBoundingClientRect();

    return (
      <div>
        <div className="dugout-blinker" style={{top, left}}>
          <div className="dugout-blink-inner-1" />
          <div className="dugout-blink-inner-2" />
        </div>
        <div className="dugout-message">
          {this.currentStep().title}
        </div>
      </div>
    );
  }
});

export default DugoutHelper;
