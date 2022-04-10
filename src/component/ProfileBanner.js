import React, { useContext, useState, useEffect} from 'react';
import { PROFILE_URL } from '../utils/Constant';
import ToggleFollow from './ToggleFollow';
import Loader from './Loader';
import UserContext from './UserContext';

const ProfileBanner = (props) => {
  
   const [profile, setProfile] = useState(null);
   const [error, setError] = useState(null)

  let { user } = useContext(UserContext);

  useEffect(() => {
    let {username} = props;//username from slug
     let token = user ? 'Token ' + user.token : '';
    fetch(PROFILE_URL + '/' + username, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    })
      .then((res) => {
        if (!res.ok) {
          return Promise.reject('Unable to fetch profile!');
        }
        return res.json();
      })
      .then((profile) => setProfile( profile.profile ))
      .catch((error) => {
        setError(error);
      })
  });

    if (!profile) return <Loader />;
    let { username, image } = profile;
    return (
      <div className="bg-gray-200 py-4 text-center">
        <img
          className="w-24 h-24 rounded-full inline-block mt-4 object-cover"
          src={image}
          alt=""
        />
        <h3 className="font-bold text-xl text-gray-700 mt-4">{username}</h3>
        <div className="text-right pr-60">
          <ToggleFollow
            profile={profile}
          />
        </div>
      </div>
  );
  
}

export default ProfileBanner;


