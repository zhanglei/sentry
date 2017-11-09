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
     needsUpdate: false
   };
  },

  isFirstStep() {
    return GuideStore._internal.step == -1;
  },

  currentStep() {
    const g = GuideStore;
    if (!this.isFirstStep()) {
      return GuideStore._internal.guide.steps[GuideStore._internal.step];
    } else {
      return GuideStore._internal.guide.steps[0];
    }
  },

  onGuideChange(guideState) {
    this.setState({needsUpdate: !!this.state.needsUpdate})
  },

  largeMessage() {
    if (!this.isFirstStep()) return (
      <div className="dugout-message-large">
        <div className="dugout-message-large-title">{this.currentStep().title}</div>
        <div className="dugout-message-large-text">{this.currentStep().description}</div>
      </div>
    );
  },

  clickedHandle() {
    if (this.isFirstStep()) GuideStore.completeStep();
  },

  render() {
    return (
      <div>
        <div onClick={this.clickedHandle} className={classNames('dugout-drawer', {'dugout-drawer--engaged': !this.isFirstStep()})}>
          <div className="dugout-message">{this.currentStep().title}</div>
          {this.largeMessage()}
        </div>
      </div>
    );
  }
});

export default DugoutHelper;
