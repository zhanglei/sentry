import React from 'react';
import Reflux from 'reflux';
import classNames from 'classnames';
import ApiMixin from '../mixins/apiMixin';
import GuideStore from '../stores/guideStore';

const DugoutHelper = React.createClass({

  mixins: [
    ApiMixin,
    Reflux.listenTo(GuideStore, 'onGuideChange'),
  ],

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

  onGuideChange(guideState) {
    
  },

  requestGuides() {
    this.api.request(`/dugout/${this.props.organizationId}/`, {
      method: 'GET',
      success: (response) => {
        if (response) this.setupGuides(response);
        window.setTimeout(this.requestGuides, 5000);
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
    if (this.currentStep().event !== 'click') return;
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

  largeMessage() {
    if (this.state.step > 0) return (
      <div className="dugout-message-large">
        <div className="dugout-message-large-title">{this.currentStep().title}</div>
        <div className="dugout-message-large-text">cat cat cat cat cat</div>
      </div>
    );
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
        <div onClick={this.onClick} className={classNames('dugout-drawer', {'dugout-drawer--engaged': !!this.state.step})}>
          <div className="dugout-message">{this.currentStep().title}</div>
          {this.largeMessage()}
        </div>
      </div>
    );
  }
});

export default DugoutHelper;
