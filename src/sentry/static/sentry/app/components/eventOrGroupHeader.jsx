import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import {Link} from 'react-router';

import {Metadata} from '../proptypes';
import EventOrGroupTitle from './eventOrGroupTitle';
import GuideAnchor from './guideAnchor';

/**
 * Displays an event or group/issue title (i.e. in Stream)
 */
class EventOrGroupHeader extends React.Component {
  static propTypes = {
    orgId: PropTypes.string.isRequired,
    projectId: PropTypes.string.isRequired,
    /** Either an issue or event **/
    data: PropTypes.shape({
      id: PropTypes.string,
      type: PropTypes.oneOf(['error', 'csp', 'default']).isRequired,
      title: PropTypes.string,
      metadata: Metadata,
      groupID: PropTypes.string,
      culprit: PropTypes.string,
    }),
    includeLink: PropTypes.bool,
    hideIcons: PropTypes.bool,
  };

  static defaultProps = {
    includeLink: true,
  };

  getMessage() {
    let {data} = this.props;
    let {metadata, type, culprit} = data || {};

    switch (type) {
      case 'error':
        return metadata.value;
      case 'csp':
        return metadata.message;
      default:
        return culprit || '';
    }
  }

  getTitle() {
    let {hideIcons, includeLink, orgId, projectId, data} = this.props;
    let {id, groupID} = data || {};
    let isEvent = !!data.eventID;

    let props = {};
    let Wrapper;
    if (includeLink) {
      props.to = `/${orgId}/${projectId}/issues/${isEvent ? groupID : id}/${isEvent
        ? `events/${data.id}/`
        : ''}`;
      Wrapper = Link;
    } else {
      Wrapper = 'span';
    }

    return (
      <Wrapper {...props}>
        {!hideIcons && <span className="icon icon-soundoff" />}
        {!hideIcons && <span className="icon icon-star-solid" />}
        <EventOrGroupTitle {...this.props} />
      </Wrapper>
    );
  }

  render() {
    let {className} = this.props;
    let cx = classNames('event-issue-header', this.props.data.shortId, className);
    let message = this.getMessage();

    return (
      <div className={cx}>
<<<<<<< HEAD
        <GuideAnchor target="project-first-issue" type="text">
=======
        <GuideAnchor target={this.props.data.shortId}>
>>>>>>> getting it working with lists
          <h3 className="truncate">{this.getTitle()}</h3>
        </GuideAnchor>
        {message && (
          <div className="event-message truncate">
            <span className="message">{message}</span>
          </div>
        )}
      </div>
    );
  }
}

export default EventOrGroupHeader;
