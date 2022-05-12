import React from 'react'
import {useSelector} from 'react-redux'
import { Card, Button, Col} from 'react-bootstrap'
import {FaEdit, FaTrash} from 'react-icons/fa'
import SubProductCarousel from './SubProductCarousel'

const SubProduct = ({product, editProduct, preDeleteProduct}) => {

      const {subUpdated} = useSelector(state => state.product)


  return (
      
        <Card bg={subUpdated === product._id && 'success'} id={product._id}>
              <SubProductCarousel images={product.images}  />
            <Card.Body>
                  <Card.Title><strong>Tamaño: </strong>{product.size}</Card.Title>
                  <Card.Title><strong>Color o Estilo: </strong>{product.color}</Card.Title>
                  <Card.Title><strong>Stock: </strong>{product.countInStock}</Card.Title>
                  <Button className='btn-sm mx-2 mt-3' type='button' onClick={() => editProduct(product)}><FaEdit /></Button>
                  <Button className='btn-sm mt-3' onClick={() => preDeleteProduct(product._id)}><FaTrash /></Button>
              </Card.Body>
        </Card>
      
    
  )
}

export default SubProduct