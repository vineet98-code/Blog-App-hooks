import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import validate from '../utils/Validate';
import { LOGIN_URL } from '../utils/Constant';
import UserContext from './UserContext';

class Login extends Component {
  state = {
    email: 'username5@gmail.com',
    password: 'username5',
    errors: {
      email: '',
      password: '',
    },
  };
  static contextType = UserContext;
  handleChange = (event) => {
    let { name, value } = event.target;
    let errors = this.state.errors;
    validate(errors, name, value);
    this.setState({ [name]: value });
  };
  handleSubmit = (event) => {
    event.preventDefault();
    let data = {
      user: {
        email: this.state.email,
        password: this.state.password,
      },
    };
    fetch(LOGIN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((errors) => {
            return Promise.reject(errors);
          });
        }
        return res.json();
      })
      .then((user) => {
        this.context.updateUser(user.user);
        // this.setState({ email: '', password: '' });
        this.props.history.push('/');
      })
      .catch((errors) =>
        this.setState({
          errors: { email: 'Email or password is incorrect!' },
        })
      );
  };

  render() {
    let { email, password, errors } = this.state;

    return (
      <main>
        <section className="mt-20 px-8">
          <form className="w-full md:w-1/3 mx-auto border border-gray-400 p-6 rounded-md" onSubmit={this.handleSubmit}>
            <div className="text-center">
              <legend className="text-2xl font-bold">Sign In</legend>
              < Link to="/signup">
                <span className="text-blue-700 text-lg text-center">Need an account? </span>
              </Link>
            </div>
            <fieldset className="my-3">

              <span className="text-red-500">{errors.email}</span>
              <input className="block w-full my-3 py-2 px-3 border border-gray-400 rounded-md" type="text" placeholder="Enter Email" value={email} name="email" onChange={(e) => this.handleChange(e)} />

              <span className="text-red-500">{errors.password}</span>
              <input className="block w-full my-3 py-2 px-3 border border-gray-400 rounded-md" type="text" placeholder="Enter Password" value={password} name="password" onChange={(e) => this.handleChange(e)} />

              <input type="submit" disabled={errors.email || errors.password } value="Login" className="block w-full my-6 py-2 px-3 bg-blue-500 text-white font-bold cursor-pointer" />

            </fieldset>
          </form>
        </section>
      </main>
    )
  }
}

export default withRouter(Login);