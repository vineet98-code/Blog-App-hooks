import React from 'react';
import moment from 'moment';
import { useContext } from 'react';
import UserContext from './UserContext';

const Comment = (props) => {
  
  let { user } = useContext(UserContext);
  let { id, author, body, createdAt } = props.comment;

  return (
    <li className="bg-tertiary border rounded border-gray-200 mb-4">
      <p className="bg-white p-4">{body}</p>
      <div className="flex px-4 py-3 items-center justify-between">
        <div className="flex items-center">
          <img
            className="w-4 rounded-full h-4 object-cover"
            src={author.image}
            alt={author.username}
          />
          <span className="text-primary text-sm font-light mx-1">
            {author.username}
          </span>
          <span className="text-gray-400 font-light text-xs">
            {moment(createdAt).format('ddd MMM D YYYY')}
          </span>
        </div>
        {author.username === user.username ? (
          <button
            className="text-gray-400 text-sm px-2 rounded hover:bg-gray-400 p-1 hover:text-black"
            onClick={() => {
              props.handleDelete(id);
            }}
          >
            <i className="fas fa-trash-alt"></i>
          </button>
        ) : (
          ''
        )}
      </div>
    </li>
  )
}

export default Comment