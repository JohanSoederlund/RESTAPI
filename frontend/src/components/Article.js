
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';


const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block',
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(100% + theme.spacing.unit * 3 * 2)]: {
      width: '100%',
      marginLeft: 'auto',
      marginRight: 'auto',
      marginBottom: '10px',
    },
  }
});

/**
 * One article/post
 */
class Article extends React.Component  {

  render() {
    const { classes } = this.props;

    return (
      <main className={classes.main}>
        <Paper elevation={1}>
            <Typography variant="h5" component="h3">
              {this.props.article.date}
            </Typography>
            <Typography component="p">
                {this.props.article.article}
            </Typography>
        </Paper>

      </main>
      );
    }
  }

export default withStyles(styles)(Article);
