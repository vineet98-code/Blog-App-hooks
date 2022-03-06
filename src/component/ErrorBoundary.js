import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';


class ErrorBoundary extends Component {
  constructor() {
    super();
    this.state = {
      hasError: false,
    };
  }

  
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  handleError = () => {
    this.setState({ hasError: false });
    this.props.history.push('/');
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center shadow rounded mx-40 my-20 p-20">
          <img src={'./image.png'} className="w-40 mx-auto" alt="" />
          <h1 className="text-2xl text-red-800 mt-4">
            Something went wrong...
          </h1>
          <button
            className="mt-8 text-primary text-xl"
            onClick={this.handleError}
          >
            <span className="mr-2">
              <i className="fas fa-arrow-left"></i>
            </span>{' '}
            Go to home page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default withRouter(ErrorBoundary);