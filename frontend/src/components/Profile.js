
import React from 'react';

import api from '../Helpers/api'

class Profile extends React.Component  {

  constructor(props) {
    super(props);
    this.state = {
      articles: [""]
    }
  }

  async componentDidMount() {
    //await this.submit({username: this.props.username, token: this.props.token});
    let res = await api.getProfile({username: this.props.username, token: this.props.token});
    console.log("componentDidMount");
    console.log(res);
    if (res.success) this.setState({articles: res.articles});
    
  }

  async submit(values) {
    if (this.state.register && values.confirmPassword !== values.password) return;
    let res = await api.getProfile({username: values.username, token:values.token});
    this.setState({username: res.username, token: res.token});
    this.state.signedInCallback({username: res.username, token: res.token});
  }

  article() {
    return;
  }

  render() {
    return (
      <div>
        <h3>My profile</h3>
        <p>username {this.props.username}</p>
        <article>
          <h4>TODAY</h4>
          <p>{this.state.articles[0]}</p>
        </article>
          
      </div>
      );
    }
  }

  export default Profile;