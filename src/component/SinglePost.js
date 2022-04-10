import React, { useContext, useState, useEffect } from 'react';
import { ARTICLES_URL } from '../utils/Constant';
import Loader from './Loader';
import CommentBox from './CommentBox';
import { Link, withRouter } from 'react-router-dom'; // withRouter is used to access the history object
import moment from 'moment';
import UserContext from './UserContext';

const SinglePost = (props) => {

  const [article, setArticle] = useState(null);
  const [error, setError] = useState('')

  let { user, isUserLogged } = useContext(UserContext);

  useEffect(() => {
    let slug = props.match.params.slug;

    fetch(ARTICLES_URL + '/' + slug)
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText);
        else return res.json();
      })
      .then((data) => {
        setArticle(data.article);
      })
      .catch((error) => {
        setError('Unable to fetch article!');
      });
  });

  const handleDelete = (slug) => {

    fetch(ARTICLES_URL + '/' + slug, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Token ' + user.token,
      },
    })
      .then((res) => {
        if (!res.ok) {
          return Promise.reject('Unable to delete!');
        }
      })
      .then(() => {
        props.history.push('/');
      })
      .catch((error) => setError(error));
  };

  if (error)
    return (
      <p className="text-red-500 mt-8 text-lg text-center">{error}</p>
    );

  if (!article) return <Loader />

  
  let { author, createdAt, title, body, slug } = article;
  return (
    <section className="px-40">
      <div className="bg-secondaryshadow">
        <h1 className="text-black text-3xl mb-8">{title}</h1>
        <div className="flex rounded-full ">
          <img
            className="flex"
            src={author.image}
            alt={author.username}
          />

          {user &&
            user.username === author.username ? (
            <div>
              <button className="border border-gray-400 rounded ml-6 px-3 text-sm py-1 text-gray-400 bg-gray-400 hover:text-white">
                <Link to={`/edit-article/${slug}`}>
                  <i className="fas fa-edit"></i> Edit Article
                </Link>
              </button>
              <button
                className=" border-red-400 rounded ml-2 px-3 text-sm py-1 text-red-400 hover:bg-red-400 "
                onClick={() => {
                  handleDelete(slug);
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
      <p className=" py-10 text-lg text-gray-600">{body}</p>
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

      <div className="border-t border-gray-300 w-full mx-auto mt-8"></div>
      
      {!isUserLogged ? (
        <h4 className="text-center mt-8">
          <Link className="text-primary text-lg  text-blue-600 visited:text-purple-600 ..." to="/login">
            Sign in
          </Link>{' '}
          or{' '}
          <Link className="text-primary text-lg text-blue-600 visited:text-purple-600 ..." to="/register">
            Sign up
          </Link>{' '}
          to add comments on this article
        </h4>
      ) : (
        <CommentBox slug={props.match.params.slug} />
      )}
    </section>
  );

}


export default withRouter(SinglePost);