import React, { useContext } from 'react';
import { NavLink, Link } from 'react-router-dom';
import UserContext from './UserContext';

export default function Header(props) {

  let {isUserLogged} = useContext(UserContext);

  return (
    <header className="px-40 flex justify-between items-center">
      <button className="text-primary font-bold text-2xl py-3">
        <Link to="/">BlogApp</Link>
      </button>
      {isUserLogged ? (
        <AuthHeader  />
      ) : (
        <NonAuthHeader />
      )}
    </header>
  );
}

function NonAuthHeader() {
  return (
    <div>
      <button className="text-gray-400 ml-6">
        <NavLink exact activeClassName="active" to="/">
          Home
        </NavLink>
      </button>
      <button className="text-gray-400 ml-6">
        <NavLink activeClassName="active" to="/login">
          Sign In
        </NavLink>
      </button>
      <button className="text-gray-400 ml-6">
        <NavLink activeClassName="active" to="/register">
          Sign Up
        </NavLink>
      </button>
    </div>
  );
}

function AuthHeader(props) {
  let {user} = useContext(UserContext);
  return (
    <div className="font-roboto">
      <button className="text-gray-400 ml-6">
        <NavLink exact activeClassName="active" to="/">
          Home
        </NavLink>
      </button>
      <button className="text-gray-400 ml-6">
        <NavLink activeClassName="active" to="/new-post">
          <i className="fas fa-edit"></i>New Article
        </NavLink>
      </button>
      <button className="text-gray-400 ml-6">
        <NavLink activeClassName="active" to="/setting">
          <i className="fas fa-cog"></i> Setting
        </NavLink>
      </button>
      <button className="text-gray-400 ml-6">
        <NavLink
          activeClassName="active"
          to={`/profile/${user.username}`}
        >
          <i className="fas fa-user"></i> {user.username}
        </NavLink>
      </button>
    </div>
  );
}
