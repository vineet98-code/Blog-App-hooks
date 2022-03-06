import React, { useState, useEffect } from 'react';
import { Switch, Route } from "react-router-dom";
import Header from './component/Header';
import Loader from './component/Loading';
import Home from './component/Home';
import Login from './component/Login';
import SignUp from './component/SignUp';
import NoMatch from './component/NoMatch';
import SinglePost from './component/SinglePost';
import NewPost from './component/NewPost';
import UserContext from './component/UserContext';
import {LocalStorageKey, CURRENT_USER_URL } from './utils/Constant'
import EditArticle from './component/EditArticle';
import Setting from './component/Setting';
import Profile from './component/Profile';
import ErrorBoundary from './component/ErrorBoundary';

function App(props) {

  const [user, setUser] = useState(null);
  const [isUserLogged, setIsUserLogged] = useState(false);
  const [userVerifying, setUserVerifying] = useState(false);

  useEffect(() => {
    let token = localStorage.getItem(LocalStorageKey);
    
      fetch(CURRENT_USER_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
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
    setUserVerifying(true);
    localStorage.setItem(LocalStorageKey, user.token);
  };

   if (userVerifying) {
    <Loader />
  }

  return (
    <div>
      <ErrorBoundary>

        <UserContext.Provider
          value={{user:user, isUserLogged: isUserLogged, updateUser: updateUser, userVerifying: userVerifying }}>

          <Header />

          {isUserLogged ? (
            <AuthenticatedApp />
          ) : (
            <UnAuthenticatedApp />
          )}

        </UserContext.Provider>
      </ErrorBoundary>
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
        <NewPost />
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
        <NoMatch />
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
      <Route path="/signup">
        <SignUp />
      </Route>

      <Route path="*">
        <NoMatch />
      </Route>
    </Switch>
  );
}

export default App;