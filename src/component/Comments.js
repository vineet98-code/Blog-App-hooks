import { useEffect, useContext } from 'react';
import Loader from './Loader';
import Comment from './Comment';
import { ARTICLES_URL } from '../utils/Constant';
import UserContext from './UserContext';


const Comments = (props) => {

  let { user } = useContext(UserContext);
  const { slug, fetchComments, errors, comments, setError } = props

  useEffect(() => {
    fetchComments();
  },[])
  
  const handleDelete = (id) => {
    fetch(ARTICLES_URL + `/${slug}/comments/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Token ' + user.token,
      },
    })
    .then((res) => {
      if (!res.ok) {
        throw new Error('Unable to fetch!');
      }
      fetchComments();
    })
    .catch((error) => {
      setError(error.message);
    });
  };

    if (errors)
      return (
        <p className="text-red-500 text-center mt-4">
          {errors}
        </p>
      );

    if (!comments) return <Loader />;

    return (
      <ul className="mt-4 mb-20">
        {comments.map((comment) => {
          // console.log(comment);
          return (
            <Comment
              comment={comment}
              key={comment.id}
              handleDelete={handleDelete}
            />
          );
        })}
      </ul>
    );
  
}

export default Comments
