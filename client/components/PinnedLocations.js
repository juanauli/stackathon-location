import React from 'react';
import { connect } from 'react-redux';
import SinglePinnedLocation from './SinglePinnedLocation';

const PinnedLocations = (props) => {
  const { pinned } = props;
  return (
    <div id="pinned-locations">
      <h4>Pinned Locations</h4>
      {Object.keys(pinned).map((key) => {
        return (<SinglePinnedLocation key={key} location={pinned[key]} place_id={key} />);
      })}
    </div>
  );
}

const mapStateToProps = (state) => ({
  pinned: state.pinned,
})

export default connect(mapStateToProps, null)(PinnedLocations);
