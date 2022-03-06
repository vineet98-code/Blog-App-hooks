import React, { useState, useContext } from 'react';
import { ARTICLES_URL } from '../utils/Constant';
import Comment from './Comments';
import UserContext from './UserContext';

function CommentBox({slug}) {

  const [comments, setComments] = useState(null);
  const [error, setError] = useState(null);
  const [body, setBody] = useState('');

  let { user } = useContext(UserContext);

  const handleChange = (event) => {
    setBody(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    let commentBody = {
      comment: {
        body,
      },
    };
    fetch(ARTICLES_URL + `/${slug}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Token ' + user.token,
      },
      body: JSON.stringify(commentBody),
    })
      .then((res) => {
        if (!res.ok)
          return res.json((error) =>
            Promise.reject('Unable to post comments!')
          );
        return res.json();
      })
      .then(() => {
        fetchComments();
        setBody('');
      })
      .catch((error) => {
        setError(error);
      });
  };

  const fetchComments = () => {
    fetch(ARTICLES_URL + `/${slug}/comments`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Token ' + user.token,
      },
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((error) => Promise.reject());
        }
        return res.json();
      })
      .then((data) => setComments(data.comments))

      .catch((error) =>
        setError(error)
      );
  
  };
    return (
      <section className="px-48 pt-12">
        <form
          className="border rounded border-gray-200"
          onSubmit={handleSubmit}
        >
          <textarea
            name="body"
            rows="3"
            className=" w-full text-gray-400 p-4"
            onChange={handleChange}
            placeholder="Write a comment..."
            value={body}
            required={true}
          ></textarea>
          <div className="p-2 border-t text-right ">
            
            <button
              className="bg-green-700 px-4 py-3 rounded text-white inline-block"
              type="submit"
            >
              Post Comment
            </button>
          </div>
        </form>
        <Comment
          slug={slug}
          fetchComments={fetchComments}
          comments={comments}
          error={error}
          setError={setError}
        />
      </section>
  );
  
}

export default CommentBox;
