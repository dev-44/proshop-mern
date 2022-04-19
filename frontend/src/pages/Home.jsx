import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'
import { Row, Col } from "react-bootstrap"
import Product from '../components/Product'   //Component
import Loader from '../components/Loader'
import Message from '../components/Message'
import Paginate from '../components/Paginate'
import ProductCarousel from '../components/ProductCarousel'
import Meta from '../components/Meta'

import { resetLoggedSuccess } from '../features/users/userSlice'
import { getProducts, getTopProducts, reset} from '../features/products/productSlice'

const Home = () => {

  const dispatch = useDispatch()
  const {user, isLoggedSuccess} = useSelector(state => state.user)
  const {products, isLoading, isError, message, isSuccess, page, pages, isLoaded} = useSelector((state) => state.product)

  const [successMsg, setSuccessMsg] = useState('')

  const params = useParams()
  const keyword = params.keyword
  const pageNumber = params.pageNumber || 1
  
  //const [products, setProducts] = useState([])

  useEffect (() => {

    if(isLoggedSuccess && isLoaded){
      setSuccessMsg(`Welcome ${user.name}`)
      setTimeout(() => {dispatch(resetLoggedSuccess())}, 5000)
      setTimeout(() => {setSuccessMsg('')}, 8000)
    }
    
    /*
    return () => {              //Clear/Unmount.Return a function
        if(isSuccess) {
            dispatch(reset())
        }
    }
    */
   
}, [dispatch, isSuccess, isLoggedSuccess, isLoaded])

  useEffect(() => {

    /* MOVE TO REDUX
    const fetchProducts = async() => {
      const { data } = await axios.get('/api/products')
      setProducts(data)
    }

    fetchProducts()
    */

    dispatch(getTopProducts())
    dispatch(getProducts({keyword, pageNumber}))
   

  }, [dispatch, keyword, pageNumber])

  if(isLoading) {
    return <Loader />
  }


  if(isError){
    return <Message variant='danger'>{message}</Message>
  }

  return (
    <>
    <Meta />
      {successMsg && <Message variant='success'>{successMsg}</Message>}
      {!params.keyword ? <ProductCarousel /> : <Link to='/' className='btn btn-light'>Go Back</Link>}
      <h1>LATEST PRODUCTS</h1>
        <Row>
            {products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                    <Product product={product} />             
              </Col> 
            ))}
        </Row>
        <Paginate pages={pages} page={page} keyword={keyword ? keyword : ''}/>
    </>
  )
}

export default Home