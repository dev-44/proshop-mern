import React, {useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Carousel, Image } from 'react-bootstrap'
import Loader from './Loader'
import Message from './Message'
import { getTopProducts } from '../features/products/productSlice'

const ProductCarousel = () => {

    const dispatch = useDispatch()
    const {topRated, isLoading, isError, message} = useSelector(state => state.product)

    useEffect(() => {
        dispatch(getTopProducts())
    }, [])


  return isLoading ? <Loader /> : isError ? <Message variant='danger'>{message}</Message> : (
      <Carousel pause='hover' className='bg-dark'>
          {topRated.map(product => (
              <Carousel.Item key={product._id}>
                  <Link to={`/product/${product._id}`}>
                      <Image src={product.image} alt={product.name} fluid />
                      <Carousel.Caption className='carousel-caption'>
                        <h2>{product.name} ({product.price})</h2>
                      </Carousel.Caption>
                  </Link>
              </Carousel.Item>
          ))}
      </Carousel>
  )
}

export default ProductCarousel