import React, { Component } from 'react';
import { TAGS_URL } from '../utils/Constant';
import Loader from './Loading';

export default class Tags extends Component {

  state = { tags: null, error: null };

  componentDidMount() {
    fetch(TAGS_URL)
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText);
        else return res.json();
      })
      .then((data) => this.setState({ tags: data.tags.filter(tag=>tag) }))
      .catch((error) => this.setState({ error: 'Not able to fetch data!' }));
  }

  render() {
    
    let { tags, error } = this.state;

    let { activeTag, addTagTab } = this.props;

    if (error) {
      return <p className="text-3xl text-center mt-4 text-red-500">{error}</p>;
    }

    if (!tags) return <Loader />;

    return (
      <aside className="bg-gray-100 rounded p-2">
        <h3 className="mb-4 text-lg">Popular Tags</h3>
        <ul className="flex flex-wrap">
          {tags.map((tag) => (
            <li
              key={tag}
              className={`border rounded-lg text-sm mr-1 px-1 mb-2 text-white cursor-pointer ${
                activeTag === tag ? 'bg-primary' : 'bg-gray-400'
              }`}
              onClick={() => {
                addTagTab(tag);
              }}
            >
              {tag.length === 0 ? '' : tag}
            </li>
          ))}
        </ul>
      </aside>
    );
  }
}
