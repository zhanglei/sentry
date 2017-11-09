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
     title: GuideStore._internal.guide.starting_message,
     description: ''
   };
  },

  isFirstStep() {
    return GuideStore._internal.step == -1;
  },

  currentStep() {
    return GuideStore.getCurrentStep() || GuideStore.getFirstStep();
  },

  currentGuide() {
    return GuideStore.getCurrentGuide();
  },

  onGuideChange(guideState) {
    const {title, description} = GuideStore.getCurrentStep();
    this.setState({title, description});
  },

  largeMessage() {
    return (this.isFirstStep()) ? '' : (
      <div className="dugout-message-large">
        <div className="dugout-message-large-title">{this.state.title}</div>
        <div className="dugout-message-large-text">{this.state.description}</div>
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
          <div className="dugout-message">{this.currentGuide().starting_message}</div>

          {this.largeMessage()}
        </div>
      </div>
    );
  }
});

export default DugoutHelper;
