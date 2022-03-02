import React from 'react';

export default function ProfileFeedNav(props) {
  return (
    <nav className="mt-8 px-60">
      <div className="border-b flex">
        <button
          className={`text-gray-400 px-6 pb-2 ${
            props.activeTab === 'author' ? 'border-b-2 border-green-500' : ''
          }`}
          onClick={() => {
            props.handleActiveTab('author');
          }}
        >
          My Articles
        </button>
        {
          <button
            className={`text-gray-400 px-6 pb-2 ${
              props.activeTab === 'favorited'
                ? 'border-b-2 border-green-500'
                : ''
            }`}
            onClick={() => {
              props.handleActiveTab('favorited');
            }}
          >
            Favorited Articles
          </button>
        }
      </div>
    </nav>
  );
}
