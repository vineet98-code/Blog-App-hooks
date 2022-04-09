import React, { useState, useContext, useEffect } from 'react';
import Posts from './Posts';
import SearchBar from './SearchBar';
import Tags from './Tags';
import { ARTICLES_URL } from '../utils/Constant';
import Pagination from './Pagination';
import FeedNav from './FeedNav';
import UserContext from './UserContext';

const articleState = {
  articles: null,
  error: null,
  articlesCount: 0,
  articlePerPage: 10,
  activePageIndex: 0,
  activeNav: 'global',
  tagSelected: '',
};

function Home() {
  
  const [searchQuery, setSearchQuery] = useState('')

  const [articleCredentials, setArticleCredentials] = useState(articleState);

  const {articles, articlesCount, articlePerPage, activePageIndex, tagSelected, activeNav } = articleCredentials

  let { user } = useContext(UserContext);
  
  // searching function
  const getArticle = () => {
    if(searchQuery.length > 2){
      return articles.filter((article) => {
        const articleName = article.title.toLowerCase();
        return articleName.includes(searchQuery)
      })
    }
    return articles;
  }

  useEffect(() => {
    const limit = articlePerPage;
    const offset = activePageIndex * 10;
    const tag = tagSelected;
    let feed = activeNav === 'your' ? '/feed' : '';
    let token = user ? 'Token ' + user.token : '';


    fetch(ARTICLES_URL + `/${feed}/?limit=${limit}&offset=${offset}` + (tag && `&tag=${tag}`),
      {
        method: 'GET',
        headers: {
          'Conten-Type': 'application/json',
          Authorization: token,
        }
      })
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText);
        else return res.json();
      })
      .then((data) =>
      setArticleCredentials((articleCredentials) => {
          return {
            ...articleCredentials,
            articles: data.articles,
            articlesCount: data.articlesCount,
          }
        })
      )
      .catch((error) =>
      setArticleCredentials((articleCredentials) => {
          return {
            ...articleCredentials,
            error: 'Not able to fetch articles!',
          };
        })
      );
  }, [activePageIndex,articlePerPage, user, tagSelected, activeNav]);

  const handleNavigation = (tab) => {
    setArticleCredentials((articleCredentials) => {
      return {
        ...articleCredentials,
        tagSelected: '',
        activeNav: tab,
        activePageIndex: 0,
      };
    });
  };

  const addTagTab = (tag) => {
    setArticleCredentials((articleCredentials) => {
      return {
        ...articleCredentials,
        tagSelected: tag,
        activeNav: '',
        activePageIndex: 0,
      };
    });
  };

  const handlePagination = (pageIndex) => {
    setArticleCredentials((articleCredentials) => {
      return { ...articleCredentials, activePageIndex: pageIndex };
    });
  };

  return (
    <main>
      <SearchBar setSearchQuery={setSearchQuery} searchQuery={searchQuery}/>
      <div className="px-40">
        <div className="flex">
          <div className="w-8/12">
            <FeedNav activeNav={activeNav} tagSelected={tagSelected} handleNavigation={handleNavigation} />
            <Posts {...articleCredentials}  articles={getArticle()}/>
          </div>
          <div className="w-3/12 ml-12 mt-4">
            <Tags addTagTab={addTagTab} activeNav={activeNav} />
          </div>
        </div>
        <Pagination
          articlesCount={articlesCount}
          articlePerPage={articlePerPage}
          handlePagination={handlePagination}
          activePageIndex={activePageIndex}
        />
      </div>
    </main>
  );

}

export default Home;