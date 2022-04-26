import React, {useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Carousel, Image } from 'react-bootstrap'
import Loader from './Loader'
import Message from './Message'

const ProductCarousel = ({images}) => {

    const [index, setIndex] = useState(0);
    
    const handleSelect = (selectedIndex, e) => {
        setIndex(selectedIndex)
    }
 
  return (
      <Carousel fade pause='hover' className='bg-dark' activeIndex={index} onSelect={handleSelect}>
          {images.map((image, index) => (
              <Carousel.Item key={index}>
                <Image src={image} fluid />
              </Carousel.Item>
          ))}
      </Carousel>
  )
}

export default ProductCarousel