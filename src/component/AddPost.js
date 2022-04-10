import React, { useState, useContext } from 'react';
import { ARTICLES_URL } from '../utils/Constant';
import validate from '../utils/Validate';
import { withRouter } from 'react-router-dom';
import UserContext from './UserContext';

const addArticleIntial = {
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
function AddPost (props) {

  const [addarticle, setAddarticle] = useState(addArticleIntial)
  let { title, description, body, tagList, errors } = addarticle;
  let { user } = useContext(UserContext);

const handleChange = (event) => {
    let { name, value } = event.target;
    validate(errors, name, value);
    setAddarticle({ ...addarticle, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchData();
  };

  const fetchData = () => {
    let { title, description, body, tagList } = addarticle;

    tagList = tagList.split(',').map((tag) => tag.trim()); //send it in the form of array, to remove the extra space

    let data = { article: { title, description, body, tagList } };

    fetch(ARTICLES_URL, {
      method: 'POST',
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
        setAddarticle({ title: '', description: '', body: '', tagList: '' });
        props.history.push('/'); // to access to the history use withRouter
      })
      .catch((errors) => {
        console.log(errors);
      });
  };

  return (
     <section className="text-center pt-14 px-64">
        <form onSubmit={handleSubmit} className="border p-8 rounded shadow py-3">

          <h2 className="text-left text-xl">Write your Article...</h2>
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
            rows="4"
            placeholder="Write your article (in markdown)"
            value={body}
          ></textarea>
          <span className="text-red-500 block">{errors.article}</span>
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
              className=" bg-blue-700 px-6 rounded text-white h-10 inline-block submit hover:bg-green-700 submit"
              type="submit"
              disabled={
                errors.title ||
                errors.description ||
                errors.body ||
                errors.tagList ||
                !title ||
                !description ||
                !body ||
                !tagList
              }
            >
              Add Article
            </button>
          </div>
        </form>
      </section>
    );
}

export default withRouter(AddPost);
