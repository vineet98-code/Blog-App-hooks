import React, { Component } from 'react';
import { ARTICLES_URL } from '../utils/Constant';
import validate from '../utils/Validate';
import { withRouter } from 'react-router-dom';
import Loader from './Loading';
import UserContext from './UserContext';

class EditArticle extends Component {
  state = {
    title: '',
    description: '',
    body: '',
    tagList: '',
    error: '',
    isDataFetched: false,
    errors: {
      title: '',
      description: '',
      body: '',
      tagList: '',
    },
  };

  static contextType = UserContext;

  componentDidMount() {
    let slug = this.props.match.params.slug;
    fetch(ARTICLES_URL + '/' + slug)
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText);
        else return res.json();
      })
      .then((data) => {
        let { title, body, description, tagList } = data.article;
        tagList = tagList.join();
        this.setState({
          title,
          body,
          description,
          tagList,
          isDataFetched: true,
        });
      })
      .catch((error) => {
        this.setState({ error: 'Unable to fetch article!' });
      });
  }

  handleChange = (event) => {
    let { name, value } = event.target;
    let errors = this.state.errors;
    validate(errors, name, value);
    this.setState({ [name]: value });
  };
  handleSubmit = (event) => {
    event.preventDefault();
    this.fetchArticle();
  };

  fetchArticle() {
    let slug = this.props.match.params.slug;
    let { title, description, body, tagList } = this.state;
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
        Authorization: 'Token ' + this.context.user.token,
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
        this.setState(
          { title: '', description: '', body: '', tagList: '' },
          () => {
            this.props.history.push(
              `/articles/${this.props.match.params.slug}`
            );
          }
        );
      });
  }

  render() {
    let { errors, title, description, body, tagList } = this.state;
    if (!this.state.isDataFetched) return <Loader />;
    return (
      <section className="text-center pt-14 px-64">
        <form onSubmit={this.handleSubmit}>
          <input
            onChange={this.handleChange}
            type="text"
            name="title"
            className="block w-full border rounded-lg border-gray-300 px-2  py-3 mx-auto mt-4 text-lg"
            placeholder="Article Title"
            value={title}
          />
          <span className="text-red-500 block">{errors.title}</span>
          <input
            onChange={this.handleChange}
            type="text"
            name="description"
            className="block w-full border rounded-lg border-gray-300 px-2 py-3 mx-auto mt-4 h-10"
            placeholder="description"
            value={description}
          />
          <span className="text-red-500 block">{errors.description}</span>
          <textarea
            onChange={this.handleChange}
            name="body"
            className="block w-full border rounded-lg border-gray-300 px-2 py-3 mx-auto mt-4  text-gray-400"
            rows="6"
            placeholder="Write your article (in markdown)"
            value={body}
          ></textarea>
          <span className="text-red-500 block">{errors.body}</span>
          <input
            onChange={this.handleChange}
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
}

export default withRouter(EditArticle);
