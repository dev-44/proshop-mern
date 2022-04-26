import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Carousel, Image } from 'react-bootstrap'
import Loader from './Loader'
import Message from './Message'

const HomeCarousel = () => {

    const {topRated, isLoadingCarousel, isError, message} = useSelector(state => state.product)

    /*
    useEffect(() => {
        dispatch(getTopProducts())
    }, [dispatch])
    */


  return isLoadingCarousel ? <Loader /> : isError ? <Message variant='danger'>{message}</Message> : (
      <Carousel pause='hover' className='bg-dark'>
          {topRated.map(product => (
              <Carousel.Item key={product._id}>
                  <Link to={`/product/${product._id}`}>
                      <Image src={product.image} alt={product.name} fluid />
                      <Carousel.Caption className='carousel-caption'>
                        <h3>{product.name} ($ {product.price})</h3>
                      </Carousel.Caption>
                  </Link>
              </Carousel.Item>
          ))}
      </Carousel>
  )
}

export default HomeCarousel