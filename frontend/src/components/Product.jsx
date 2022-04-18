import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Button } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import Rating from './Rating'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'


const Product = ({product}) => {

    const navigate = useNavigate()

    const {user} = useSelector((state) => state.user)

    const preDeleteProduct = (id) => {
        console.log(id)
    }

    const editProduct = (product) => {
        navigate(`/admin/product/${product._id}`)
    }
    
  return (
      <>
      {(user && user.isAdmin) ? (
                  <Card className='my-3 p-3 rounded position-relative' style={{ minHeight: '28rem', maxHeight: '28rem' }}>
                  <Link to={`/product/${product._id}`}>
                      <Card.Img src={product.image} variant='top' style={{minHeight: '12rem', maxHeight: '12rem'}} />
                  </Link>
      
                  <Card.Body>
                      <Link to={`/product/${product._id}`}>
                          <Card.Title as='div'>
                              <strong>{product.name}</strong>
                          </Card.Title>
                      </Link>

                      <Card.Text as='div'>
                          <Rating value={product.rating} text={`${product.numReviews} reviews`}/>
                      </Card.Text>
    
                      <Card.Text as='h3'>
                          ${product.price}
                      </Card.Text>

                    <Button variant='light' className='position-absolute bottom-0 start-0 mx-2 my-2' onClick={() => editProduct(product)}>
                        <i className='fas fa-edit'></i>
                    </Button>

                    
                    <Button variant='danger' className='position-absolute bottom-0 end-0 mx-2 my-2' onClick={()=>preDeleteProduct(product._id)} style={{float: 'right'}}>
                        <i className='fas fa-trash'></i>
                    </Button>
      
                  </Card.Body>
              </Card>
      ) : (
                  <Card className='my-3 p-3 rounded'>
                  <Link to={`/product/${product._id}`}>
                      <Card.Img src={product.image} variant='top' />
                  </Link>
      
                  <Card.Body>
                      <Link to={`/product/${product._id}`}>
                          <Card.Title as='div'>
                              <strong>{product.name}</strong>
                          </Card.Title>
                      </Link>
      
                      <Card.Text as='div'>
                          <Rating value={product.rating} text={`${product.numReviews} reviews`}/>
                      </Card.Text>
      
                      <Card.Text as='h3'>
                          ${product.price}
                      </Card.Text>
      
                  </Card.Body>
              </Card>
      )}

      </>
  )
}

export default Product