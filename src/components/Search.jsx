import React from 'react'

const Search = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="searh text-white flex justify-center w-ful mt-18">
      <div className="flex items-center bg-gray-800 rounded-lg p-2 w-96">
        <img src="search.svg" alt="search" className="w-6 h-6 mr-2"/>

        <input type="text" 
        placeholder="Search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
         className="bg-transparent text-white outline-none placeholder-gray-400 w-full"
        />
      </div>
    </div>
  )
}

export default Search
