import PropTypes from 'prop-types';
import React from 'react';
import Reflux from 'reflux';
import GuideStore from '../stores/guideStore';

const GuideAnchor = React.createClass({
  propTypes: {
    target: PropTypes.string.isRequired,
  },

  mixins: [
    Reflux.listenTo(GuideStore, 'onGuideChange'),
  ],

  getInitialState() {
    return {active: false};
  },

  onGuideChange(guideState) {
    if (guideState.step >= 0 && guideState.guide.steps[guideState.step].target == this.props.target) {
        this.setState({active: true});
    } else {
        this.setState({active: false});
    }
  },

  handlePingClick(e) {
  },

  handleClick(e) {
    GuideStore.completeStep();
  },

  render() {
    let target = this.props.target + ' dugout-ping';
    if (this.state.active) {target = target + ' active';}
    let style = {
        position: 'absolute',
        left: 0,
        bottom: 0,
        width: '2pt',
        height: '2pt',
        backgroundColor: 'red'
    };
    return (
      <div onClick={this.handleClick}>
          {this.props.children}
          <span className={target} onClick={this.handlePingClick} style={style} />
      </div>
    );
  },


});

export default GuideAnchor;
