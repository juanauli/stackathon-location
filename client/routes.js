import React, {Component, Fragment} from 'react'
import {connect} from 'react-redux'
import {withRouter, Route, Switch, Redirect} from 'react-router-dom'
import Dashboard from './components/Dashboard';

/**
 * COMPONENT
 */
class Routes extends Component {
  componentDidMount() {
  }

  render() {
    return (
      <div>
        <Switch>
          <Route path="/" component={Dashboard} />
        </Switch>
      </div>
    )
  }
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    // Being 'logged in' for our purposes will be defined has having a state.auth that has a truthy id.
    // Otherwise, state.auth will be an empty object, and state.auth.id will be falsey
    isLoggedIn: state
  }
}

const mapDispatch = dispatch => {
  return {

  }
}

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(Routes))
