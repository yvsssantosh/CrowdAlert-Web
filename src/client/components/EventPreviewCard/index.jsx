import React from 'react';
import proptypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  Responsive,
  Transition,
  Segment,
  Header,
  Icon,
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import style from './style';
import { closeEventPreview } from './actions';
import calcAge from '../../utils/time';
import getEventColor from '../../utils/eventcolors';
import getWidth from '../../utils/width';


const EventPreviewCard = (props) => {
  if (!props.eventPreview.event) {
    return null;
  }
  return (
    <div data-test="component-event-preview-card">
      <Responsive fireOnMount getWidth={getWidth} minWidth={900}>
        <div style={style.widescreen}>
          {/* Animation isn't working as it requires component to be mounted
            before visibility is set true. Probably we can achive that using
            a two-fold function call. First one mounts the component & second
            one shows the component */}
          <Transition
            style={style.widescreen}
            visible={props.eventPreview.isOpen}
            animation="fly up"
            duration={1000}
          >
            <Segment color={getEventColor(props.eventPreview.event.category)}>
              <div>
                <Header as="h3" floated="left" data-test="component-header">
                  {props.eventPreview.event.category.toLocaleUpperCase()}
                </Header>
                <Header
                  as="p"
                  floated="right"
                  onClick={() => props.closeEventPreview()}
                >
                  <Icon name="close" size="mini" fitted />
                </Header>
              </div>
              <br />
              <Header as="h4" data-test="component-title">{props.eventPreview.event.title}</Header>
              <p data-test="jsx-datetime">{calcAge(props.eventPreview.event.datetime)}</p>
              <Link
                to={`/view/${props.eventPreview.event.key}`}
                onClick={() => props.closeEventPreview()}
              >
                View Incident
              </Link>
            </Segment>
          </Transition>
        </div>
      </Responsive>
      <Responsive fireOnMount getWidth={getWidth} maxWidth={900}>
        <div style={style.mobile}>
          <Transition
            style={style.mobile}
            visible={props.eventPreview.isOpen}
            animation="fly up"
            duration={1000}
          >
            <Segment color={getEventColor(props.eventPreview.event.category)}>
              <div>
                <Header as="h3" floated="left" data-test="component-header">
                  {props.eventPreview.event.category.toLocaleUpperCase()}
                </Header>
                <Header
                  as="p"
                  floated="right"
                  onClick={() => props.closeEventPreview()}
                >
                  <Icon name="close" size="mini" fitted />
                </Header>
              </div>
              <br />
              <Header as="h4" data-test="component-title">{props.eventPreview.event.title}</Header>
              <p data-test="jsx-datetime">{calcAge(props.eventPreview.event.datetime)}</p>
              <Link
                to={`/view/${props.eventPreview.event.key}`}
                onClick={() => props.closeEventPreview()}
              >
                View Incident
              </Link>
            </Segment>
          </Transition>
        </div>
      </Responsive>
    </div>
  );
};

EventPreviewCard.propTypes = {
  closeEventPreview: proptypes.func.isRequired,
  eventPreview: proptypes.shape({
    event: proptypes.shape({
      key: proptypes.string,
      lat: proptypes.number,
      long: proptypes.number,
      category: proptypes.string,
      title: proptypes.string,
      datetime: proptypes.number,
    }),
    isOpen: proptypes.bool,
  }),
};

EventPreviewCard.defaultProps = {
  eventPreview: null,
};


const mapStateToProps = (state) => {
  const { eventPreview } = state;
  return {
    eventPreview
  };
};
const mapDispatchToProps = dispatch => (
  bindActionCreators({
    closeEventPreview,
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(EventPreviewCard);
