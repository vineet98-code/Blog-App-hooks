import React, { Component } from 'react';
import Loader from './Loading';
import Comment from './Comment';
import { ARTICLES_URL } from '../utils/Constant';
import UserContext from './UserContext';


export default class Comments extends Component {
  static contextType = UserContext;
  componentDidMount() {
    this.props.fetchComments();
  }
  handleDelete = (id) => {
    fetch(ARTICLES_URL + `/${this.props.slug}/comments/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Token ' + this.context.user.token,
      },
    }).then(this.props.fetchComments)
  };
  render() {
    if (this.props.state.errors)
      return (
        <p className="text-red-500 text-center mt-4">
          {this.props.state.errors}
        </p>
      );
    if (!this.props.state.comments) return <Loader />;
    return (
      <ul className="mt-4 mb-20">
        {this.props.state.comments.map((comment) => {
          console.log(comment);
          return (
            <Comment
              comment={comment}
              key={comment.id}
              handleDelete={this.handleDelete}
            />
          );
        })}
      </ul>
    );
  }
}
