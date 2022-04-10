import React, { useState, useEffect } from 'react';
import { Switch, Route } from "react-router-dom";
import Header from './component/Header';
import Loader from './component/Loader';
import Home from './component/Home';
import Login from './component/Login';
import SignUp from './component/SignUp';
import NotFound from './component/NotFound';
import SinglePost from './component/SinglePost';
import AddPost from './component/AddPost';
import UserContext from './component/UserContext';
import { LocalStorageKey, User_Verify_URL } from './utils/Constant'
import EditArticle from './component/EditArticle';
import Setting from './component/Setting';
import Profile from './component/Profile';


function App(props) {

  const [user, setUser] = useState(null);
  const [isUserLogged, setIsUserLogged] = useState(false);
  const [userVerifying, setUserVerifying] = useState(true);

  useEffect(() => {
    let token = localStorage[LocalStorageKey];
    console.log(token);

    fetch(User_Verify_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Token ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((errors) => Promise.reject(errors));
        }
        return res.json();
      })
      .then((user) => {
        setUser(user.user);
      })
      .catch((errors) => {
        console.log(errors);
      });

  }, [])

  const updateUser = (user) => {
    setUser(user);
    setIsUserLogged(true);
    setUserVerifying(false);
    localStorage.setItem(LocalStorageKey, user.token);
  };

  if (userVerifying) {
    <Loader />
  }

  return (
    <div>
      <UserContext.Provider
        value={{ user: user, isUserLogged: isUserLogged, updateUser: updateUser, userVerifying: userVerifying }}>

        <Header />

        {isUserLogged ? (
          <AuthenticatedApp />
        ) : (
          <UnAuthenticatedApp />
        )}

      </UserContext.Provider>
    </div>

  );
}

function AuthenticatedApp(props) {
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/articles/:slug">
        <SinglePost />
      </Route>
      <Route path="/new-post">
        <AddPost />
      </Route>
      <Route path="/edit-article/:slug">
        <EditArticle />
      </Route>
      <Route path="/setting">
        <Setting />
      </Route>
      <Route path="/profile/:username" exact>
        <Profile />
      </Route>
      <Route path="*">
        <NotFound />
      </Route>
    </Switch>
  );
}
function UnAuthenticatedApp(props) {
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/articles/:slug">
        <SinglePost />
      </Route>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/register">
        <SignUp />
      </Route>
      <Route path="*">
        <NotFound />
      </Route>
    </Switch>
  );
}

export default App;