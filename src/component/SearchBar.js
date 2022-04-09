import React from 'react'

const Banner = (props) => {
  const { searchQuery, setSearchQuery } = props
  return (
    <div className="bg-purple-500  text-white">
    <div className="flex justify-center">
        <div className=" 2xl:w-96">
          <div className="input-group relative flex  items-stretch w-full my-5">

            <input  type="search"  onChange={(event) => setSearchQuery(event.target.value.trim())} className="form-control relative flex-auto min-w-0 block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" placeholder="Search" aria-label="Search" aria-describedby="button-addon2" value={searchQuery} />
          </div>
        </div>
      </div>
    </div>

  )
}

export default Banner