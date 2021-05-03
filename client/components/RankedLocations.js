import React, {Component} from 'react';
import { connect } from 'react-redux';
import { removeRankedLocation } from '../store';

const RankedLocations = (props) => {
    const { ranked, pinned, deleteRanked, selectedMarker } = props;
    const rankedKeys = Object.keys(ranked);
    const pinnedKeys = Object.keys(pinned);

    //averages array
    const averages = {};
    rankedKeys.forEach((key) => {
      if (pinnedKeys.length) {
        averages[key] = (pinnedKeys.reduce((accumulator, current) => {
          return accumulator + ranked[key].matrix[current].duration.value
        }, 0))/pinnedKeys.length
      } else {
        averages[key] = Infinity;
      }
    })
    //sort rankedKeys by averages
    rankedKeys.sort((a, b) => averages[a]-averages[b]);
    return (
      <div id="ranked-locations">
        <h4>Ranked Locations</h4>
        {rankedKeys.length ?
        <table>
          <thead>
            <tr>
              <th>Location</th>
              {pinnedKeys.length ? pinnedKeys.map((key) => {
                return (<th key={key} >{pinned[key].nickname}</th>);
              })
              : null
              }
              <th>Avg. Commute (min)</th>
            </tr>
          </thead>
          <tbody>
            {rankedKeys.map((key)=> {
              return (
                <tr key={key} className={selectedMarker === key ? "selected-ranked-marker": null}>
                  <td><button onClick={() => deleteRanked(key)} title="delete location">X</button>{ranked[key].formatted_address.split(',')[0]}</td>
                  {pinnedKeys.length ? pinnedKeys.map((pinnedKey) => {
                    return (
                      <td key={pinnedKey}>
                        {ranked[key].matrix[pinnedKey].duration.text}
                      </td>
                    );
                  }) : null }
                  <td>{(averages[key]/60).toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        : null }
      </div>
    );
}

const mapStateToProps = (state) => ({
  ranked: state.ranked,
  pinned: state.pinned,
  selectedMarker: state.selectedMarker
})

const mapDispatchToProps = (dispatch) => ({
  deleteRanked: (place_id) => dispatch(removeRankedLocation(place_id))
})

export default connect(mapStateToProps, mapDispatchToProps)(RankedLocations);
