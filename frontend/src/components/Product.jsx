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


                    <Button variant='light' className='' onClick={() => editProduct(product)}>
                        <i className='fas fa-edit'></i>
                    </Button>

                    
                    <Button variant='danger' className='text-right' onClick={()=>preDeleteProduct(product._id)} style={{float: 'right'}}>
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