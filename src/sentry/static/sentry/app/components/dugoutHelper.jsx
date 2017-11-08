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

  currentGuide() {
    return this.state.guides[this.state.guide];
  },

  currentStep() {
    return this.currentGuide().steps[this.state.step];
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

  onClick() {
    if (this.currentStep().event !== "click") return;
    if (this.step >= this.currentGuide().steps.length) {
      this.setState({
        guide: this.state.guide++,
        step: 0
      });
    } else {
      this.setState({
        step: this.state.step + 1
      });
    }
  },

  componentDidMount() {
    this.requestGuides();
  },

  render() {
    if (!this.currentGuide()) return null;
    const element = this.currentStep().element;
    let {left, top} = element.getBoundingClientRect();
    left = left + element.clientWidth / 2;
    top = top + element.clientHeight / 2;

    return (
      <div>
        <div className="dugout-blinker" onClick={this.onClick} style={{top, left}}>
          <div className="dugout-blink-inner-1" />
          <div className="dugout-blink-inner-2" />
        </div>
        <div className="dugout-message" onClick={this.onClick}>
          {this.currentStep().title}
        </div>
      </div>
    );
  }
});

export default DugoutHelper;
