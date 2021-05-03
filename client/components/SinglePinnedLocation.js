import React, {Component} from 'react';
import { connect } from 'react-redux';
import { removePinnedLocation, changePinnedTravelMode } from '../store';

class SinglePinnedLocation extends Component {
  constructor(props) {
    super(props);
    this.state ={
      travelMode: "DRIVING"
    }
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    const { location, place_id, changeTravelMode, ranked } = this.props;
    this.setState({
      [e.target.name]: e.target.value
    })
    changeTravelMode(location.formatted_address, e.target.value, place_id, ranked);
  }

  render() {
    const { location, place_id, deletePinned, selectedMarker } = this.props;
    const { travelMode } = this.state;
    const { handleChange } = this;
    return (
      <div className={selectedMarker === place_id ? "single-pinned-location-selected": "single-pinned-location"}>
        <div className="single-pinned-location-1">
          <img src={`./images/${location.category}.png`} title={location.category} className="category-icon" alt="category" width="32px" />
          <p><strong>{`${location.nickname}: `}</strong>{location.formatted_address.split(',')[0]}</p>
        </div>
        <div className="single-pinned-location-2">
          <img className="travel-mode-icon" alt="travelMode" src={`./images/${travelMode}.png`} width="16px" height= "16px" />
          <select name="travelMode" value={travelMode} onChange={handleChange}>
            <option value="DRIVING">driving</option>
            <option value="BICYCLING">bicycling</option>
            <option value="TRANSIT">transit</option>
            <option value="WALKING">walking</option>
          </select>
          <button type="submit" onClick={() => deletePinned(place_id)}title="delete location">X</button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  ranked: state.ranked,
  selectedMarker: state.selectedMarker
})

const mapDispatchToProps = (dispatch) => ({
  deletePinned: (place_id) => dispatch(removePinnedLocation(place_id)),
  changeTravelMode: (formatted_address, travelMode, place_id, ranked) => dispatch(changePinnedTravelMode(formatted_address, travelMode, place_id, ranked))
})

export default connect(mapStateToProps, mapDispatchToProps)(SinglePinnedLocation)
