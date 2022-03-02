import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { CURRENT_USER_URL } from '../utils/Constant';
import validate from '../utils/Validate';
import UserContext from './UserContext';

class Setting extends Component {
  state = {
    image: '',
    username: '',
    bio: '',
    email: '',
    password: '',
    errors: {
      image: '',
      username: '',
      bio: '',
      email: '',
      password: '',
    },
  };

  static contextType = UserContext;
  componentDidMount() {
    let { username, email, image, bio } = this.context.user;
    this.setState({ username, email, image, bio });
  }

  handleChange = (event) => {
    let { name, value } = event.target;
    let { errors } = this.state;
    validate(errors, name, value);
    this.setState({ [name]: value });
  };

  handleLogout = () => {
    localStorage.clear();
    this.props.history.push('/');
  };

  handleSubmit = (event) => {
    event.preventDefault();
    let { image, username, bio, email, password } = this.state;
    let body = {
      user: {
        email,
        bio,
        image,
        username,
      },
    };

    if (password) body.user.password = password;

    fetch(CURRENT_USER_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Token ' + this.context.user.token,
      },
      body: JSON.stringify(body),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((errors) => Promise.reject(errors));
        }
        return res.json();
      })
      .then((user) => {
        this.context.updateUser(user.user);
        this.props.history.push('/');
      })
      .catch((errors) => {
        this.setState({ errors: errors.errors });
      });
  };

  render() {

    let { image, username, bio, email, password, errors } = this.state;

    return (
      
      <section className="pt-8 px-64">
        <form onSubmit={this.handleSubmit} className="border p-4 px-8 rounded shadow">
        <h2 className="text-center text-2xl mt-4">Your Setting</h2>
          <input
            onChange={this.handleChange}
            type="text"
            name="image"
            className="block w-full border rounded-lg border-gray-300 px-2  py-3 mx-auto mt-4 h-10"
            placeholder="URL of profile picture"
            value={image}
          />
          <input
            onChange={this.handleChange}
            name="username"
            type="text"
            className="block w-full border rounded-lg border-gray-300 px-2  py-3 mx-auto mt-4"
            value={username}
          />
          <span className="text-red-500 block text-center">
            {errors.username}
          </span>
          <textarea
            onChange={this.handleChange}
            name="bio"
            className="block w-full border rounded-lg border-gray-300 px-2 py-3 mx-auto mt-4  text-gray-400"
            rows="6"
            placeholder={bio}
            value={bio}
          ></textarea>
          <input
            onChange={this.handleChange}
            type="email"
            name="email"
            className="block w-full border rounded-lg border-gray-300 px-2  py-3 mx-auto mt-4"
            placeholder="Email"
            value={email}
          />
          <span className="text-red-500 block text-center">{errors.email}</span>
          <input
            onChange={this.handleChange}
            name="password"
            type="password"
            className="block w-full border rounded-lg border-gray-300 px-2  py-3 mx-auto mt-4"
            placeholder="New Password"
            value={password}
          />
          <span className="text-red-500 block text-center">
            {errors.password}
          </span>
          <div className="w-full mx-auto text-right pt-8">
            <button
              className="bg-green-700 px-6 py-3 rounded text-white inline-block submit"
              type="submit"
              disabled={errors.email || errors.password}
            >
              Update Setting
            </button>
          </div>
        </form>
        <div className="w-full mx-auto text-left pt-8">
            <button
              className="border border-red-500 px-6 rounded text-red-500 inline-block submit h-10 hover:bg-red-500 hover:text-white"
              onClick={this.handleLogout}
            >
              Click here to logout.
            </button>
          </div>
      </section>
    );
  }
}

export default withRouter(Setting);
