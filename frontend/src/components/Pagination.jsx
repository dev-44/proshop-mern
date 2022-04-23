import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Pagination = ({ postsPerPage, totalPosts, paginate, currentPage }) => {

  const {isCreated, isDeleted, isUpdated} = useSelector(state => state.product)

  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i);
  }

  if(isCreated || isDeleted) {
      var length = pageNumbers.length
      paginate(pageNumbers[length - 1])
  }

  if(isUpdated) {
    paginate(currentPage)
  }


  return pageNumbers.length > 1 && (
    <nav>
      <ul className='pagination justify-content-center'>
        {pageNumbers.map(number => (
          <li key={number} className={Number(currentPage) === number ? 'page-item active' : 'page-item'} aria-current="page">
            <Link to='' onClick={() => paginate(number)} className='page-link'>
              {number}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Pagination;