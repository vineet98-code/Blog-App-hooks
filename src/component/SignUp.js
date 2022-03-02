import React from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import validate from '../utils/Validate';
import { SIGNUp_URL } from '../utils/Constant';

class Login extends React.Component {
  constructor(props) {
    super();
    this.state = {
      username:  '',
      email: '',
      password: '',
      errors: {
        username:  '',
        email: '',
        password: '',
      },
    };
  }

  handleChange = (event) => {
    event.preventDefault()
    let { name, value } = event.target;

    let errors = { ...this.state.errors }
     validate(errors, name, value)
    
    this.setState({ [name]: value, errors })
  };

  handleSubmit = (event) =>  {
    event.preventDefault() // page is not reloading
    // console.log('hello') 
    const {username, password, email} = this.state;

    fetch(SIGNUp_URL, {
      method: "POST",
      mode: 'cors',
      headers : {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({user: {username, email, password} })
      
    }).then(res => {
      if(!res.ok){

        return res.json().then((errors) => {
            return Promise.reject(errors);
          });
      }
      return res.json();
    })
    .then(({ user }) => {
      console.log(user)
      this.context.updateUser(user.user);
      this.setState({ username: '', password: '', email: ''})
      // this.props.history.push('/login');
    })
    .catch((errors) =>
        this.setState({errors })
      );
  
  };

  render() {
    let { email, username, password, errors } = this.state;

    return (
      <main>
        <section className="mt-20 px-8">
          <form className="w-full md:w-1/3 mx-auto border border-gray-400 p-6 rounded-md" onSubmit={this.handleSubmit}>
            <div className="text-center">
              <legend className="text-2xl font-bold">Sign up</legend>
              < Link to="/login">
                <span className="text-blue-700 text-lg text-center">SignIn</span>
              </Link>
            </div>
            <fieldset className="my-3">

              <span className="text-red-500">{errors.username}</span>
              <input className="block w-full my-3 py-2 px-3 border border-gray-400 rounded-md" type="text" placeholder="Enter Username" value={username} name="username" onChange={(e) => this.handleChange(e)} />

              <span className="text-red-500">{errors.email}</span>
              <input className="block w-full my-3 py-2 px-3 border border-gray-400 rounded-md" type="text" placeholder="Enter Email" value={email} name="email" onChange={(e) => this.handleChange(e)} />

              <span className="text-red-500">{errors.password}</span>
              <input className="block w-full my-3 py-2 px-3 border border-gray-400 rounded-md" type="text" placeholder="Enter Password" value={password} name="password" onChange={(e) => this.handleChange(e)} />

              <input type="submit" disabled={errors.email || errors.password || errors.username } value="SignUp" className="block w-full my-6 py-2 px-3 bg-blue-500 text-white font-bold cursor-pointer" />

            </fieldset>
          </form>
        </section>
      </main>
    )
  }
}

export default withRouter(Login);