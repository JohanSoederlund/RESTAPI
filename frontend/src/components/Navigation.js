import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";

import Home from './Home'
import Profile from './Profile'
import SignIn from './SignIn'


const styles = theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  appBar: {
    position: 'relative',
  },
  toolbarTitle: {
    flex: 1,
  }
});

class Navigation extends React.Component  {
  
  constructor(props) {
    super(props);
    this.state = {
      redirect: false
    }
  }
  
  renderRedirect = (url) => {
    if (this.state.redirect) {
      this.setState({
        redirect: false
      })
      return <Redirect to={url} />
    }
  }

  signedInCallback(user) {
    console.log(user);
    this.setState({
      redirect: true,
      username: user.username,
      token: user.token
    })
  }

  render() {
    const { classes } = this.props;
  return (
    <Router>  
    {this.renderRedirect("/profile")}
    <React.Fragment>
      <CssBaseline />
      <AppBar position="static" color="default" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap className={classes.toolbarTitle}>
            REST API
          </Typography>
          
          <Button>
            <Link to="/home">Home</Link>
          </Button>
          <Button>
            <Link to="/profile">Profile</Link>
          </Button>
          <Button>
            <Link to="/register">Register</Link>
          </Button>
          <Button variant="outlined">
            <Link to="/login">Sign in</Link>
          </Button>
          
        </Toolbar>
      </AppBar>
    </React.Fragment>

    <Route path="/login" 
      render={(props) => <SignIn {...props} signedInCallback={this.signedInCallback.bind(this)} heading={"Sign In"} register={false} />}
    />

    <Route path="/register" 
      render={(props) => <SignIn {...props} signedInCallback={this.signedInCallback.bind(this)} heading={"Register"} register={true} />}
    />

    <Route path="/profile" 
      render={(props) => <Profile {...props} username={this.state.username} token={this.state.token} />}
    />

    <Route path="/home" component={Home} />

</Router>
  );
}}

Navigation.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Navigation);
