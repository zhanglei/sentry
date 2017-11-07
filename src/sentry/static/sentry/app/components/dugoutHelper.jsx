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
        if (response) this.setState({guides: response});
        window.setTimeout(this.requestGuides, 3000);
      }
    });
  },

  beginGuide({steps, slug, complete, firstStepElement}) {
  },

  componentDidMount() {
    this.requestGuides();
  },

  render() {
    if (!this.state.guides.length) return null;
    const activeGuides = this.state.guides.map(g => Object.assign({}, g, {
      firstStepElement: document.querySelectorAll(g.steps[0].target)[0]
    })).filter(g => g.firstStepElement);
    if (!activeGuides.length) return null;
    this.beginGuide(activeGuides[this.state.guide]);
    const {left, top} = activeGuides[this.state.guide].firstStepElement.getBoundingClientRect();

    return (
      <div className="dugout-blinker" style={{top, left}}>
        <div className="dugout-blink-inner-1" />
        <div className="dugout-blink-inner-2" />
      </div>
    );
  }
});

export default DugoutHelper;
