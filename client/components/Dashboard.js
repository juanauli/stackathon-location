import React from 'react'
import Map from './Map'
import { connect } from 'react-redux';
import Sidebar from './Sidebar';
import PinnedLocations from './PinnedLocations';
import RankedLocations from './RankedLocations';
import { selectMarker } from '../store';
/**
 * COMPONENT
 */
const Dashboard = props => {
  return (
    <div id="page">
      <div id="top-bar">
        fake
      </div>
      <div id="dashboard">
        <Sidebar />
        <div id="large-container">
          <div id="top-container">
            <Map {...props} />
            <PinnedLocations />
          </div>
          <div id="bottom-container">
            <RankedLocations />
          </div>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => ({
  pinned: state.pinned,
  ranked: state.ranked,
  selectedMarker: state.selectedMarker
})

const mapDispatchToProps = (dispatch) => ({
  selectMarker: (place_id) => dispatch(selectMarker(place_id))
})

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
