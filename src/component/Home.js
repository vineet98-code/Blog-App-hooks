import React, { Component } from 'react';
import Posts from './Posts';
import Banner from './Banner';
import Tags from './Tags';
import { ARTICLES_URL } from '../utils/Constant';
import Pagination from './Pagination';
import FeedNav from './FeedNav';

export default class Home extends Component {

  state = {
    articles: null,
    error: null,
    articlesCount: 0,
    articlePerPage: 10,
    activePageIndex: 0,
    activeNav: '',
  };

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.activePageIndex !== this.state.activePageIndex ||
      prevState.activeNav !== this.state.activeNav
    ) {
      this.fetchData();
    }
  }

  removeTagTab = () => {
    this.setState({ activeNav: '' });
  };

  addTagTab = (tag) => {
    this.setState({ activeNav: tag }, this.fetchData);
  };

  fetchData() {
    const limit = this.state.articlePerPage;
    const offset = this.state.activePageIndex * 10;
    const tag = this.state.activeNav;
    
    fetch( ARTICLES_URL + `/?limit=${limit}&offset=${offset}`+(tag && `&tag=${tag}`))
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText);
        else return res.json();
      })
      .then((data) =>
        this.setState({
          articles: data.articles,
          articlesCount: data.articlesCount,
        })
      )
      .catch((error) =>
        this.setState({ error: 'Not able to fetch articles!' })
      );
  }

  handlePagination = (pageIndex) => {
    this.setState({ activePageIndex: pageIndex });
  };

  render() {
    let { articlesCount, articlePerPage, activePageIndex, activeNav } = this.state;

    return (
      <main>
        <Banner />
        <div className="px-40">
          <div className="flex">
            <div className="w-8/12">
              <FeedNav activeNav={activeNav} removeTagTab={this.removeTagTab} />
              <Posts {...this.state} />
            </div>
            <div className="w-3/12 ml-12 mt-4">
              <Tags addTagTab={this.addTagTab} activeNav={activeNav} />
            </div>
          </div>
          <Pagination
            articlesCount={articlesCount}
            articlePerPage={articlePerPage}
            handlePagination={this.handlePagination}
            activePageIndex={activePageIndex}
          />
        </div>
      </main>
    );
  }
}