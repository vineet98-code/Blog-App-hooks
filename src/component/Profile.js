import React, { useState, useEffect} from 'react';
import { withRouter } from 'react-router';
import { ARTICLES_URL } from '../utils/Constant';
import Posts from './Posts';
import ProfileBanner from './ProfileBanner';
import ProfileFeedNav from './ProfileFeedNav';

const Profile = (props) => {

  const [activeTab, setActiveTab] = useState('author');
  const [articles, setArticles] = useState(null);
  const [error, setError] = useState(null);

  const handleActiveTab = (label) => {
    setActiveTab(label, () => { //fetch data only need to called when state is updated and to do this we use call back function
      fetchData({});
    });
  };
  
  useEffect(() => {
    fetchData(); 
  })

  const fetchData = ()=> {
    let { username } = props.match.params;

    fetch(`${ARTICLES_URL}?${activeTab}=${username}`, {

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
      .then((data) => setArticles( data.articles ))
      .catch((error) => setError( error ));
  }

  let { username } = props.match.params;
    
    return (
      <section>
        <ProfileBanner username={username} />
        <ProfileFeedNav
          activeTab={activeTab}
          handleActiveTab={handleActiveTab}
        />
        <div className="px-60">
          <Posts articles={articles} error={error} />
        </div>
      </section>
    );
}

export default withRouter(Profile);
