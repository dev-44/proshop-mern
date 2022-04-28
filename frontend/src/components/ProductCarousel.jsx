import React, {useEffect, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Carousel, Image } from 'react-bootstrap'
import Loader from './Loader'
import Message from './Message'

const ProductCarousel = ({images, indexPar, openImageViewer, sincronize}) => {

    const [index, setIndex] = useState(0)

    useEffect(() => {
        if(indexPar || indexPar === 0) {
            setIndex(indexPar)
        }

    }, [indexPar])
    
    const handleSelect = (selectedIndex, e) => {
        setIndex(selectedIndex)
        sincronize(selectedIndex)
    }

    const handleOpen = (index) => {
        openImageViewer(index)
    }

 
  return (
      <Carousel variant="dark" pause='hover' activeIndex={index} onSelect={handleSelect} touch>
          {images.map((image, index) => (
              <Carousel.Item key={index}>
                <Image src={image} style={{borderRadius: '0%', margin: '1.5rem', padding: '1.2rem', marginLeft: 'auto', marginRight: 'auto'}} fluid onClick={ () => handleOpen(index) }/>
              </Carousel.Item>
          ))}
      </Carousel>
  )
}

export default ProductCarousel