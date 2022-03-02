import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { ARTICLES_URL } from '../utils/Constant';
import Posts from './Posts';
import ProfileBanner from './ProfileBanner';
import ProfileFeedNav from './ProfileFeedNav';

class Profile extends Component {
  state = {
    activeTab: 'author',
    error: null,
    articles: null,
  };

  
  handleActiveTab = (label) => {
    this.setState({ activeTab: label }, () => { //fetch data only need to called when state is updated and to do this we use call back function
      this.fetchData({});
    });
  };
  
  componentDidMount() {
    this.fetchData({}); 
  }

  fetchData() {
    let { username } = this.props.match.params;

    fetch(`${ARTICLES_URL}?${this.state.activeTab}=${username}`, {

      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) {
          return Promise.reject('Unable to fetch data for specific user!');
        }
        return res.json();
      })
      .then((data) => this.setState({ articles: data.articles }))
      .catch((error) => this.setState({ error }));
  }

  render() {

    let { articles, error, activeTab } = this.state;

    let { username } = this.props.match.params;
    
    return (
      <section>
        <ProfileBanner username={username} />
        <ProfileFeedNav
          activeTab={activeTab}
          handleActiveTab={this.handleActiveTab}
        />
        <div className="px-60">
          <Posts articles={articles} error={error} />
        </div>
      </section>
    );
  }
}

export default withRouter(Profile);
