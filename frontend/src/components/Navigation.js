import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import SignIn from './SignIn'
import Home from './Home'

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


function Navigation(props) {
  const { classes } = props;

  

  return (
    <Router>  
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
          <Button color="primary" variant="outlined">
            <Link to="/login">Login</Link>
          </Button>
          
        </Toolbar>
      </AppBar>
    </React.Fragment>

    <Route path="/login" component={SignIn} />

    <Route path="/home" component={Home} />
        
</Router>
  );
}

Navigation.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Navigation);
