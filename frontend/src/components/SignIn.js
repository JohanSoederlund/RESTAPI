import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';

import MaterialUIForm from 'react-material-ui-form'

import api from '../Helpers/api'

const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
});

class SignIn extends React.Component  {

  constructor(props) {
    super(props);
    this.state = {
      username: "",
      token: "",
      signedInCallback: props.signedInCallback,
      heading: props.heading,
      register: props.register
    }
  }

  async submit(values) {
    if (this.state.register && values.confirmPassword !== values.password) return;
    let res = await api.registerOrLogin({username: values.username, password:values.password, register: this.state.register});
    console.log(res);
    if (res.success) {
      this.setState({username: res.username, token: res.token});
      this.state.signedInCallback({username: res.username, token: res.token});
    } else {
      this.setState({message: res.value});
    }
    
  }

  render() {
    const { classes } = this.props;
    let secondPassword = null;
    if (this.state.register) {
      secondPassword = <FormControl margin="normal" required fullWidth>
                          <InputLabel htmlFor="confirm password">Confirm password</InputLabel>
                          <Input name="confirmPassword" type="password" id="confirmPassword" value="" />
                        </FormControl>
    }
    return (
      <main className={classes.main}>
        <CssBaseline />
        <Paper className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            {this.props.heading}
          </Typography>
          <MaterialUIForm className={classes.form}  onSubmit={this.submit.bind(this)}>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="email">Username</InputLabel>
                <Input id="username" name="username" autoComplete="email" value="" autoFocus />
              </FormControl>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="password">Password</InputLabel>
                <Input name="password" type="password" id="password" value=""  />
              </FormControl>
              {secondPassword}
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                {this.props.heading}
              </Button>
          </MaterialUIForm>
          <p>{this.state.message}</p>
        </Paper>
      </main>
    );
  }
}

SignIn.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SignIn);