import React from 'react'
import Loader from './Loader'
import Post from './Post';

function Posts(props) {

  const { articles, error } = props
  
  if (error) {
    return <p className="text-3xl text-center mt-4 text-red-500">{error}</p>
  }
  if (!articles) {
    return <Loader />
  }
  return (
    <ul>
      {articles.map(article => <Post user={props.user} key={article.slug} {...article} />)}
    </ul>
  )

}

export default Posts