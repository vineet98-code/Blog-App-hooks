import React, { Component } from 'react';
import { ARTICLES_URL } from '../utils/Constant';
import Loader from './Loading';
import CommentBox from './CommentBox';
import { Link, withRouter } from 'react-router-dom'; // withRouter is used to access the history object
import moment from 'moment';
import UserContext from './UserContext';


export class SinglePost extends Component {
  state = { article: null, error: '' };

  static contextType = UserContext;

  componentDidMount() {

    let slug = this.props.match.params.slug;

    fetch(ARTICLES_URL + '/' + slug)
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText);
        else return res.json();
      })
      .then((data) => {
        this.setState({ article: data.article });
      })
      .catch((error) => {
        this.setState({ error: 'Unable to fetch article!' });
      });
  }

  handleDelete = (slug) => {

    fetch(ARTICLES_URL + '/' + slug, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Token ' + this.context.user.token,
      },
    })
    .then((res) => {
        if (!res.ok) {
          return Promise.reject('Unable to delete!');
        }
    })
    .then(() => {
        this.props.history.push('/');
    })
    .catch((error) => this.setState({ error }));
  };

  render() {
    if (this.state.error)
      return (
        <p className="text-red-500 mt-8 text-lg text-center">{this.state.error}</p>
      );

    if (!this.state.article) return <Loader />;

    let { author, createdAt, title, body, slug } = this.state.article;

    return (
      <section className="px-40">
        <div className="bg-secondary py-8 pl-40 shadow">
          <h1 className="text-white text-5xl mb-8">{title}</h1>
          <div className="flex items-center">
            <img
              className="w-8 rounded-full h-8 object-cover"
              src={author.image}
              alt={author.username}
            />
            <div className="ml-1">
              <h4 className="text-primary neg-mb-10">
                <Link to={'/profile/' + author.username}>
                  {author.username}
                </Link>
              </h4>
              <time dateTime="" className="text-xs text-gray-400 inline-block">
                {moment(createdAt).format('ddd MMM D YYYY')}
              </time>
            </div>

            {this.context.user &&
            this.context.user.username === author.username ? (
              <div>
                <button className="border border-gray-400 rounded ml-6 px-3 text-sm py-1 text-gray-400 hover:bg-gray-400 hover:text-white">
                  <Link to={`/edit-article/${slug}`}>
                    <i className="fas fa-edit"></i> Edit Article
                  </Link>
                </button>
                <button
                  className="border border-red-400 rounded ml-2 px-3 text-sm py-1 text-red-400 hover:bg-red-400 hover:text-white"
                  onClick={() => {
                    this.handleDelete(slug);
                  }}
                >
                  <i className="fas fa-trash-alt"></i> Delete Article
                </button>
              </div>
            ) : (
              ''
            )}
          </div>
        </div>
        <p className="px-40 py-10 text-lg text-gray-600">{body}</p>
        
        <div className="border-t border-gray-300 w-full mx-auto mt-8"></div>
        {/* if user not logged in, then display sign in and sign out otherwise don't display */}
        {!this.context.isUserLogged ? (
          <h4 className="text-center mt-8">
            <Link className="text-primary text-lg  text-blue-600 visited:text-purple-600 ..." to="/login">
              Sign in
            </Link>{' '}
            or{' '}
            <Link className="text-primary text-lg text-blue-600 visited:text-purple-600 ..." to="/signup">
              Sign up
            </Link>{' '}
            to add comments on this article
          </h4>
        ) : (
          <CommentBox slug={this.props.match.params.slug} />
        )}
      </section>
    );
  }
}

// withRouter is used to access the history object
export default withRouter(SinglePost);