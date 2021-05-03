import {createStore, applyMiddleware} from 'redux'
import {createLogger} from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'
import axios from "axios";
import { GOOGLE_API_KEY } from '../secrets';

//action types
const ADD_PINNED_LOCATION = 'ADD_PINNED_LOCATION';
const ADD_RANKED_LOCATION = 'ADD_RANKED_LOCATION';
const REMOVE_PINNED_LOCATION = 'REMOVE_PINNED_LOCATION';
const REMOVE_RANKED_LOCATION = 'REMOVE_RANKED_LOCATION';
const CHANGE_PINNED_TRAVEL_MODE = 'CHANGE_PINNED_TRAVEL_MODE';

const SELECT_MARKER = 'SELECT_MARKER';

//action creators
const addedRankedLocation = (location, place_id) => ({
  type: ADD_RANKED_LOCATION,
  location,
  place_id
})

const addedPinnedLocation = (location, place_id, distances) => ({
  type: ADD_PINNED_LOCATION,
  location,
  place_id,
  distances
})

export const removeRankedLocation = (place_id) => ({
  type: REMOVE_RANKED_LOCATION,
  place_id
})

export const removePinnedLocation = (place_id) => ({
  type: REMOVE_PINNED_LOCATION,
  place_id
})

const changedPinnedTravelMode = (travelMode, place_id, distances) => ({
  type: CHANGE_PINNED_TRAVEL_MODE,
  place_id,
  travelMode,
  distances
})

export const selectMarker = (place_id) => ({
  type: SELECT_MARKER,
  place_id
})

//thunk creators
export const addPinnedLocation = (nickname, address, category, ranked) => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
          key: GOOGLE_API_KEY,
          address
        }
      })
      const location = {
        nickname,
        category,
        formatted_address: data.results[0].formatted_address,
        position: data.results[0].geometry.location,
        travelMode: 'DRIVING'
      }
      const place_id = data.results[0].place_id;
      const distances = {};

      //compute and add distances to ranked locations
      const rankedKeys = Object.keys(ranked);
      if (rankedKeys.length) {
        const service = new google.maps.DistanceMatrixService();
        service.getDistanceMatrix(
          {
            origins: rankedKeys.map((key) => ranked[key].formatted_address),
            destinations: [location.formatted_address],
            travelMode: 'DRIVING',
            unitSystem: google.maps.UnitSystem.IMPERIAL
          }, (response, status) => {
            if (status === "OK"){
              for (let i=0; i<rankedKeys.length; i++) {
                distances[rankedKeys[i]] = {
                  distance: response.rows[0].elements[i].distance,
                  duration: response.rows[0].elements[i].duration,
                  travelMode: 'DRIVING'
                }
              }
              dispatch(addedPinnedLocation(location, place_id, distances));
            } else {
              throw "Bad response from distance matrix"
            }
          }
        );
      } else {
        dispatch(addedPinnedLocation(location, place_id, distances));
      }
    } catch (error) {
      console.log(error)
    }
  }
}

export const addRankedLocation = (nickname, address, pinned) => {
  return async (dispatch) => {
    try {
      //Google API request to get location
      const { data: place } = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
          key: GOOGLE_API_KEY,
          address
        }
      })
      const location = {
        nickname,
        formatted_address: place.results[0].formatted_address,
        position: place.results[0].geometry.location,
        matrix: {}
      }
      const place_id = place.results[0].place_id;

      //compute and add distances to pinned locations
      const pinnedKeys = Object.keys(pinned);
      if (pinnedKeys.length) {
        const service = new google.maps.DistanceMatrixService();
        service.getDistanceMatrix(
          {
            origins: [location.formatted_address],
            destinations: pinnedKeys.map((key) => pinned[key].formatted_address),
            travelMode: 'DRIVING',
            unitSystem: google.maps.UnitSystem.IMPERIAL
          }, (response, status) => {
            if (status === "OK"){
              for (let i=0; i<pinnedKeys.length; i++) {
                location.matrix[pinnedKeys[i]] = {
                  distance: response.rows[0].elements[i].distance,
                  duration: response.rows[0].elements[i].duration,
                  travelMode: 'DRIVING'
                };
              }
              dispatch(addedRankedLocation(location, place_id));
            } else {
              throw "Bad response from distance matrix"
            }
          }
        );
      } else {
        dispatch(addedRankedLocation(location, place_id));
      }
    } catch (error) {
      console.log(error)
    }
  }
}

export const changePinnedTravelMode = (formatted_address, travelMode, place_id, ranked) => {
  return (dispatch) => {
    try {
      const distances = {};

      //compute and add distances to ranked locations
      const rankedKeys = Object.keys(ranked);
      if (rankedKeys.length) {
        const service = new google.maps.DistanceMatrixService();
        service.getDistanceMatrix(
          {
            origins: rankedKeys.map((key) => ranked[key].formatted_address),
            destinations: [formatted_address],
            travelMode: travelMode,
            unitSystem: google.maps.UnitSystem.IMPERIAL
          }, (response, status) => {
            if (status === "OK"){
              for (let i=0; i<rankedKeys.length; i++) {
                distances[rankedKeys[i]] = {
                  distance: response.rows[0].elements[i].distance,
                  duration: response.rows[0].elements[i].duration,
                  travelMode: travelMode
                }
              }
              dispatch(changedPinnedTravelMode(travelMode, place_id, distances));
            } else {
              throw "Bad response from distance matrix"
            }
          }
        );
      } else {
        dispatch(changedPinnedTravelMode(travelMode, place_id, distances));
      }
    } catch (error) {
      console.log(error)
    }
  }
}

const initState = {
  pinned: {},
  ranked: {},
  selectedMarker: ""
}

const reducer = (state = initState, action) => {
  switch (action.type) {
    case ADD_RANKED_LOCATION:
      return {...state, ranked: {...state.ranked, [action.place_id]: action.location}}
    case ADD_PINNED_LOCATION:
      const newAddRanked = {...state.ranked}
      for (let key of Object.keys(newAddRanked)) {
        newAddRanked[key].matrix[action.place_id] = action.distances[key];
      }
      return {...state, pinned: {...state.pinned, [action.place_id]: action.location}, ranked: newAddRanked};
    case REMOVE_PINNED_LOCATION:
      const newTempRanked = {...state.ranked};
      for (let key of Object.keys(newTempRanked)) {
        const {[action.place_id]: removeRankedValue, ...newTempRankedMatrix} = newTempRanked[key].matrix;
        newTempRanked[key].matrix = newTempRankedMatrix;
      }
      const {[action.place_id]: removeValuePinned, ...newRemovePinned} = state.pinned;
      return {...state, pinned: newRemovePinned, ranked: newTempRanked};
    case REMOVE_RANKED_LOCATION:
      const {[action.place_id]: removeValueRanked, ...newRemoveRanked} = state.ranked;
      return {...state, ranked: newRemoveRanked};
    case CHANGE_PINNED_TRAVEL_MODE:
      const newChangePinnedRanked = {...state.ranked}
      for (let key of Object.keys(newChangePinnedRanked)) {
        newChangePinnedRanked[key].matrix[action.place_id] = action.distances[key];
      }
      return {...state, pinned: {...state.pinned, [action.place_id]: {...state.pinned[action.place_id], travelMode: action.travelMode}}, ranked: newChangePinnedRanked};
    case SELECT_MARKER:
      return {...state, selectedMarker: action.place_id}
    default:
      return state;
  }
}

//thunk middleware
const middleware = composeWithDevTools(
  applyMiddleware(thunkMiddleware, createLogger({collapsed: true}))
)

//store
const store = createStore(reducer, middleware)

export default store;
