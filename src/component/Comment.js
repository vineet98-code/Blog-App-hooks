import React from 'react';
import moment from 'moment';
import { useContext } from 'react';
import UserContext from './UserContext';

const Comment = (props) => {

  let { user } = useContext(UserContext);
  let { id, author, body, createdAt } = props.comment;

  return (
    <li className="bg-tertiary border rounded border-gray-200 mb-4">
      <div className="px-4 py-3 ">
        <div className="flex items-center flex-row">
          <img
            className="w-8 rounded-full h-8 object-cover"
            src={author.image}
            alt={author.username}
          />
          <span className="text-primary text-sm font-light mx-1">
            {author.username}
          </span>
        </div>
        <div className="flex justify-between">

        <div>
          <p className="bg-white">{body}</p>
          <span className="text-gray-400 font-light text-xs">
            {moment(createdAt).format('ddd MMM D YYYY')}
          </span>
        </div>

        {author.username === user.username ? (
          <button
          className="text-gray-400 text-sm px-2 rounded hover:bg-gray-400 p-1 hover:text-red "
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
      </div>
    </li>
  )
}

export default Comment