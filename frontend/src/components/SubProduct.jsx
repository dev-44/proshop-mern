import React from 'react'
import { Card, Button } from 'react-bootstrap'
import {FaEdit, FaTrash} from 'react-icons/fa'
import ProductCarousel from './ProductCarousel'

const SubProduct = ({product, editProduct, preDeleteProduct}) => {

  return (
    <Card style={{ width: '18rem' }}>
          <ProductCarousel images={product.images}  />
         <Card.Body>
               <Card.Title>Tamaño {product.size}</Card.Title>
               <Card.Title>Color o Estilo: {product.color}</Card.Title>
               <Card.Title>Stock: {product.countInStock}</Card.Title>
               <Button className='btn-sm mx-2 mt-3' type='button' onClick={() => editProduct(product, product._id)}><FaEdit /></Button>
               <Button className='btn-sm mt-3' onClick={() => preDeleteProduct(product._id)}><FaTrash /></Button>
          </Card.Body>
    </Card>
  )
}

export default SubProduct