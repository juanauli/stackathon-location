import { connect } from 'react-redux';
import React, { Component } from 'react';
import { addRankedLocation, addPinnedLocation } from '../store';

const initialState = {
  address: '',
  type: '',
  nickname: '',
  category: ''
};

class LocationSearch extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.validate = this.validate.bind(this);
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  validate() {
    const { address, nickname, category, type } = this.state;
    const { pinned } = this.props;

    if (type === '') return "You must choose a type"
    else if (nickname === '') return "You must choose a nickname"
    else if (address === '') return "The address cannot be empty"
    else if (type === 'pinned' && category === '') return "You must choose a category"
    else if (type === 'ranked' && Object.keys(pinned).length === 0) return "You must have at leat one pinned location"
    return "Good to go"
  }

  handleSubmit(e) {
    e.preventDefault();

    const { validate } = this;
    const { address, nickname, category, type } = this.state;
    const { addRankedLocation, addPinnedLocation, pinned, ranked } = this.props;

    if (validate() === 'Good to go') {
      if (type === 'pinned') addPinnedLocation(nickname, address, category, ranked)
      else if (type === 'ranked') addRankedLocation(nickname, address, pinned);
      this.setState(initialState);
    } else {
      alert(validate())
    }
  }

  render() {
    const { address, nickname, type, category } = this.state;
    const { handleChange, handleSubmit } = this;
    return (
      <div>
        <h4 id='location-search-title'>Add a Location</h4>
        <form id='location-search' onSubmit={handleSubmit}>
          <div id="type-image-container">
            <p>Type:</p>
            <div className={type==='pinned' ? 'selected-type-image' : 'type-image'} onClick={() => this.setState({type: "pinned"})}>
              <img alt="pinned" id="pinned-image" src="./images/pin.png" width="24px" />
              <label htmlFor="pinned-image">pinned</label>
            </div>
            <div className={type==='ranked' ? 'selected-type-image' : 'type-image'} onClick={() => this.setState({type: "ranked"})}>
              <img alt="to-rank" id="ranked-image" src="./images/rank.png" width="24px" />
              <label htmlFor="ranked-image">to rank</label>
            </div>
          </div>
          <input
            name='nickname'
            type='text'
            autocomplete='off'
            value={nickname}
            onChange={handleChange}
            placeholder='nickname'
          />
          <input
            name='address'
            id='autocomplete'
            autocomplete='off'
            type='text'
            value={address}
            onChange={handleChange}
            placeholder='address'
          />
          {type === 'pinned' ? (<select name="category" value={category} onChange={handleChange}>
            <option value="">select location category</option>
            <option value="office">office</option>
            <option value="school">school</option>
            <option value="public-transportation">public transportation</option>
            <option value="grocery">grocery</option>
            <option value="home">home</option>
            <option value="restaurant">restaurant</option>
            <option value="park">park</option>
            <option value="attraction">attraction</option>
            <option value="museum">museum</option>
            <option value="other">other</option>
          </select>) : <div></div>}
          <button type='submit'>Add Location</button>
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  pinned: state.pinned,
  ranked: state.ranked
})

const mapDispatchToProps = (dispatch) => ({
  addRankedLocation: (nickname, address, pinned) => dispatch(addRankedLocation(nickname, address, pinned)),
  addPinnedLocation: (nickname, address, category, ranked) => dispatch(addPinnedLocation(nickname, address, category, ranked))
})

export default connect(mapStateToProps, mapDispatchToProps)(LocationSearch);
