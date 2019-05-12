import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";

import Journal from './Journal';
import SignIn from './SignIn';
import Cookie from '../Helpers/cookie';


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
    let cookie = new Cookie();
    let token = cookie.getCookie();
    let signin = "Sign In";
    if (token !== undefined) {
      signin = "Sign Out"
    }
    this.state = {
      token: token,
      cookie: cookie,
      redirect: false,
      signin: signin
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

  async signedInCallback(user) {
    await this.state.cookie.setCookie(user.token);

    this.setState({
      redirect: true,
      username: user.username,
      token: user.token,
      signin: "Sign Out"
    })
  }

  async manageSignOut() {
    if (this.state.signin === "Sign Out") {
      await this.state.cookie.removeCookie();
      this.setState({
        token: "",
        signin: "Sign In"
      })
    }
  }

  render() {
    const { classes } = this.props;
  return (
    <Router>  
      {this.renderRedirect("/journal")}
      <React.Fragment>
        <CssBaseline />
        <AppBar position="static" color="default" className={classes.appBar}>
          <Toolbar>
            <Typography variant="h6" color="inherit" noWrap className={classes.toolbarTitle}>
              REST API
            </Typography>
            <Button>
              <Link to="/journal">Journal</Link>
            </Button>
            <Button>
              <Link to="/register">Register</Link>
            </Button>
            <Button variant="outlined" >
              <Link onClick={this.manageSignOut.bind(this)} to="/login">{this.state.signin}</Link>
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

      <Route path="/journal" 
        render={(props) => <Journal {...props} username={this.state.username} token={this.state.token} />}
      />

    </Router>
    );
  }}

Navigation.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Navigation);
