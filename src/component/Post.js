import { Link } from 'react-router-dom';
import React, { useState, useContext, useEffect } from 'react';
import { ARTICLES_URL } from '../utils/Constant';
import moment from 'moment';
import UserContext from './UserContext';

function Post(props) {

  const [favorited, setFavorited] = useState(null)
  const [favoritesCount, setFavoritesCount] = useState(0)
  const [error, setError] = useState(0)

  const { user } = useContext(UserContext);


  useEffect(() => {
    setFavorited(props.favorited);
    setFavoritesCount(props.favoritesCount);

  }, []);

  const handleFavorite = ((slug) => {

    let method = favorited ? 'DELETE' : 'POST';

    let token = user ? 'Token ' + user.token : '';

    fetch(ARTICLES_URL + `/${slug}/favorite`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    })
      .then((res) => res.json())
      .then((article) => {
        let { favorited, favoritesCount } = article.article;
        setFavorited(favorited);
        setFavoritesCount(favoritesCount);
      })
      .catch((error) => {
        setError(error.message);
      })
  });

  let { author, createdAt, title, description, tagList, slug } = props;

  if (error)
    return <p className="text-3xl text-center mt-4 text-red-500">{error}</p>;
  return (
    <section className="mt-10 shadow p-4 rounded">
      <div className="flex justify-between">
        <div className="flex items-center">
          <img
            className="w-8 rounded-full h-8 object-cover"
            src={author.image}
            alt={author.name}
          />
          <div className="ml-2">
            <h4 className="text-primary neg-mb-10 font-roboto">
              <Link to={`/profile/${author.username}`}>{author.username}</Link>
            </h4>
            <time dateTime="" className="text-xs text-gray-400">
              {moment(createdAt).format('ddd MMM D YYYY')}
            </time>
          </div>
        </div>
        <div>
          {user && (
            <button
              className={`border border-primary rounded py-1 px-2 text-sm shadow ${favorited ? 'bg-primary text-white' : 'bg-white text-primary'
                }`}
              onClick={() => {
                handleFavorite(slug);
              }}
            >
              <i className="fas fa-heart"></i> <span>{favoritesCount}</span>
            </button>
          )}
        </div>
      </div>
      <Link to={`/articles/${slug}`}>
        <h2 className="font-medium text-2xl font-roboto">{title}</h2>
      </Link>
      <Link to={`/articles/${slug}`}>
        <p className="text-gray-400 font-light">{description}</p>
      </Link>
      <div className="flex justify-between items-center">
        <Link to={`/articles/${slug}`}>
          <button className="text-gray-500 mt-4">Read More...</button>
        </Link>
        <ul>
          {tagList.map((tag) => (
            <li
              key={tag}
              className="text-gray-400 font-light border rounded-lg inline-block px-2 text-xs ml-1"
            >
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );

}

export default Post;
