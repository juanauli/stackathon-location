import React, { Component } from 'react';
import { GoogleApiWrapper, Map, InfoWindow, Marker } from 'google-maps-react';
import { GOOGLE_API_KEY } from '../secrets';

class MapContainer extends Component {
  constructor(props) {
    super(props);
    this.onMarkerClick = this.onMarkerClick.bind(this);
  }

  onMarkerClick(info) {
    const { place_id } = info;
    const { selectMarker } = this.props;
    selectMarker(place_id);
  }

  render() {
    const { google, pinned, ranked } = this.props;
    const pinnedKeys = Object.keys(pinned);
    const rankedKeys = Object.keys(ranked);

    //automatically adjust bounds to fit markers
    const bounds = new google.maps.LatLngBounds()
    for (let i = 0; i < pinnedKeys.length; i++) {
      bounds.extend(pinned[pinnedKeys[i]].position);
    }
    for (let i = 0; i < rankedKeys.length; i++) {
      bounds.extend(ranked[rankedKeys[i]].position);
    }

    //styling and positioning
    const style = {
      width: '100%',
      height: '100%'
    }

    const containerStyle = {
      position: 'relative',
      width: '500px',
      height: '400px'
    }

    return (
      <Map google={google}
        containerStyle={containerStyle}
        style={style}
        initialCenter={{
          lat: 40.7861384,
          lng: -73.9768964
        }}

        onClick={this.mapClicked}
        zoom={14}
        bounds={bounds}>

        {
          pinnedKeys.length ? pinnedKeys.map((place_id) => {
            return (
              <Marker key={place_id}
                title={pinned[place_id].nickname}
                name={pinned[place_id].nickname}
                onClick={this.onMarkerClick}
                place_id={place_id}
                position={pinned[place_id].position}/>
            );
          })
          : null
        }

        {
          rankedKeys.length ? rankedKeys.map((place_id) => {
            return (
                <Marker key={place_id}
                  title={ranked[place_id].nickname}
                  name={ranked[place_id].nickname}
                  onClick={this.onMarkerClick}
                  place_id={place_id}
                  position={ranked[place_id].position}/>
            );
          })
          : null
        }

        {/* {this.state ? <InfoWindow
          marker={this.state.activeMarker}
          visible={this.state.showingInfoWindow}>
          <div className="marker">
            <a href=""><h2>{this.state.selectedPlace.name}</h2></a>
            <img src={`${this.findUrl()}`} classname="infoWindow-pic"/>
          </div>
        </InfoWindow> : null} */}

        {/* {this.state.visible ? (
          <div>
            <h1>{this.state.selectedPlace.nickname}</h1>
          </div>) : null} */}

        {/* <InfoWindow onClose={this.onInfoWindowClose}>
            <div>
              <h1>{this.state.selectedPlace.name}</h1>
            </div>
        </InfoWindow> */}

      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: (GOOGLE_API_KEY)
})(MapContainer)
