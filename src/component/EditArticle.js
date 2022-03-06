import React, { useContext, useState, useEffect } from 'react';
import { ARTICLES_URL } from '../utils/Constant';
import validate from '../utils/Validate';
import { withRouter } from 'react-router-dom';
import Loader from './Loading';
import UserContext from './UserContext';

const EditArticle = (props) => {
  const editArticleIntialState = {
    title: '',
    description: '',
    body: '',
    tagList: '',
    errors: {
      title: '',
      description: '',
      body: '',
      tagList: '',
    },
  };
  const [article, setArtcle] = useState(editArticleIntialState);
  const [error, setError] = useState(null);
  const [isDataFetched, setIsDataFetched] = useState(false);
  let { title, body, description, tagList, errors } = article;
  let { user } = useContext(UserContext);
  let slug = props.match.params.slug;

  useEffect(() => {
    fetch(ARTICLES_URL + '/' + slug)
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText);
        else return res.json();
      })
      .then((data) => {
        let { title, body, description, tagList } = data.article;
        tagList = tagList.join();
        setArtcle({
          ...article,
          title,
          body,
          description,
          tagList
        });
        setIsDataFetched(true);
      })
      .catch((error) => {
        setError('Unable to fetch article!');
      });
  },[]);

  const handleChange = (event) => {
    let { name, value } = event.target;
    validate(errors, name, value);
    setArtcle({ ...article, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchArticle();
  };

  const fetchArticle = () => {
    let slug = props.match.params.slug;
    
    tagList = tagList.split(',').map((ele) => ele.trim());
    let data = {
      article: {
        title,
        description,
        tagList,
        body,
      },
    };

    fetch(ARTICLES_URL + '/' + slug, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Token ' + user.token,
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((error) => Promise.reject(error));
        }
        return res.json();
      })
      .then((article) => {
        setArtcle(editArticleIntialState);
        props.history.push(`/articles/${props.match.params.slug}`)
      })
      .catch((error) => {
        setError('Unable to fetch article!');
      });
  };

  if (error)
  return <p className="text-3xl text-center mt-4 text-red-500">{error}</p>;

  if (!isDataFetched) return <Loader />;

  return (
    <section className="text-center pt-14 px-64">
      <form onSubmit={handleSubmit}>
        <input
          onChange={handleChange}
          type="text"
          name="title"
          className="block w-full border rounded-lg border-gray-300 px-2  py-3 mx-auto mt-4 text-lg"
          placeholder="Article Title"
          value={title}
        />
        <span className="text-red-500 block">{errors.title}</span>
        <input
          onChange={handleChange}
          type="text"
          name="description"
          className="block w-full border rounded-lg border-gray-300 px-2 py-3 mx-auto mt-4 h-10"
          placeholder="description"
          value={description}
        />
        <span className="text-red-500 block">{errors.description}</span>
        <textarea
          onChange={handleChange}
          name="body"
          className="block w-full border rounded-lg border-gray-300 px-2 py-3 mx-auto mt-4  text-gray-400"
          rows="6"
          placeholder="Write your article (in markdown)"
          value={body}
        ></textarea>
        <span className="text-red-500 block">{errors.body}</span>
        <input
          onChange={handleChange}
          name="tagList"
          type="text"
          className="block w-full border rounded-lg border-gray-300 px-2  py-3 mx-auto mt-4 h-10"
          placeholder="Enter tags sperated by a comma"
          value={tagList}
        />
        <span className="text-red-500 block">{errors.tagList}</span>
        <div className="text-right pt-8">
          <button
            className="bg-primary px-6 rounded text-white h-10 inline-block submit hover:bg-green-700 submit"
            type="submit"
            disabled={
              errors.title ||
              errors.description ||
              errors.body ||
              errors.tagList
            }
          >
            Update Article
          </button>
        </div>
      </form>
    </section>
  );
}

export default withRouter(EditArticle);
