
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';
import MaterialUIForm from 'react-material-ui-form'
import Typography from '@material-ui/core/Typography';

import api from '../Helpers/api';
import Article from './Article';

const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block',
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(60% + theme.spacing.unit * 3 * 2)]: {
      width: '60%',
      marginLeft: 'auto',
      marginRight: 'auto',
      
    },
  },
  heading: {
    marginBottom: '4%',
    marginTop: '4%'
  }
});

class Journal extends React.Component  {

  constructor(props) {
    super(props);
    this.state = {
      username: "anonymous",
      token: "",
      articles: [{article: "", date: ""}]
    }
  }

  async componentDidMount() {
    //undefined if cookie is missing
    if (this.props.token !== undefined) {
      let res = await api.getJournal(this.props.token);
      this.updateArticles(res.articles);
      this.setState({username: res.username, articles: res.articles});
    }
  }
  
  /**
   * Post newly created article to API
   */
  async submit() {
    //cancel submit if not logged in or no article is written
    if (this.state.multiline === undefined || this.props.token === "") return;
    let res = await api.postJournal(this.props.token, {article: this.state.multiline, date: this.formatedDate()});
    if (res.articles.length > this.state.articles.length) this.setState({articles: res.articles});
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  updateArticles(articles) {
    if (Array.isArray(articles)) {
      //Create a list of all articles/posts
      this.articles = articles.map((item, key) =>
        <Article key={key} article={item}/>
        );
    }
  }

  formatedDate() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();
    if (dd < 10)  dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    return dd + '/' + mm + '/' + yyyy;
  }

  render() {
    const { classes } = this.props;

    this.updateArticles(this.state.articles);

    return (
      <main className={classes.main}>
        <Typography className={classes.heading} variant="h4" component="h4">
          {this.state.username}'s journal 
        </Typography>
        
        {this.articles}

        <MaterialUIForm className={classes.form}  onSubmit={this.submit.bind(this)}>
          <TextField 
            fullWidth
            id="filled-multiline-flexible"
            label="My journal"
            multiline
            rowsMax="8"
            value={this.state.multiline}
            onChange={this.handleChange('multiline')}
            margin="normal"
            helperText="Write about todays event"
            variant="filled"
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Post
          </Button>
        </MaterialUIForm>
      </main>
      );
    }
  }

export default withStyles(styles)(Journal);
