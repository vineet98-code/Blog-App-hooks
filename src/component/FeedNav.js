import React, {useContext} from 'react';
import UserContext from './UserContext';


function FeedNav(props) {
   
  let { user } = useContext(UserContext);
  
  let { activeTag, handleNavigation, activeNav } = props;

  return (
      <nav className="mt-8">
        <ul className="border-b flex">
          <li
            className={`text-gray-400 px-6 pb-2 cursor-pointer ${
              !activeTag && activeNav === 'global'
              ? 'border-b-2 border-green-500'
              : ''
            }`}
            onClick={() => {
              handleNavigation('global');
            }}
            >
            Global Feed
          </li>
            {user && (
              <li
                className={`text-gray-400 px-6 pb-2 cursor-pointer ${
                  !activeTag && activeNav === 'your'
                    ? 'border-b-2 border-green-500'
                    : ''
                }`}
                onClick={() => {
                  handleNavigation('your');
                }}
              >
                Your Feed
              </li>
            )}

          {activeTag && (
            <li
              className={`text-gray-400 px-6 pb-2 cursor-pointer ${
                activeTag ? 'border-b-2 border-green-500' : ''
              }`}
            >
              {activeTag}
            </li>
          )}
        </ul>
      </nav>
    );
  
}

export default FeedNav;