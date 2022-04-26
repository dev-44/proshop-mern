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
      <Carousel fade variant="dark" pause='hover' activeIndex={index} onSelect={handleSelect} touch>
          {images.map((image, index) => (
              <Carousel.Item key={index}>
                <Image src={image} style={{borderRadius: '0%', margin: '1.5rem', padding: '1.2rem', marginLeft: 'auto', marginRight: 'auto'}} fluid />
              </Carousel.Item>
          ))}
      </Carousel>
  )
}

export default ProductCarousel