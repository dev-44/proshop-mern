import { useState, useEffect} from 'react'
import { Link, useParams} from 'react-router-dom'
import { Row, Col, Image, ListGroup, Card, Button} from 'react-bootstrap'
import Rating from '../components/Rating'
import axios from 'axios'
//import products from '../products'

const ProductDetails = ({ match }) => {
    const params = useParams()
    //const product = products.find(p => p._id === params.id)

    const [product, setProduct] = useState({})

    useEffect(() => {
        const fetchProduct = async() => {
          const { data } = await axios.get(`/api/products/${params.id}`)
    
          setProduct(data)
        }
    
        fetchProduct()
    
      }, [])

  return (
    <>
        <Link to='/' className='btn btn-light my-3'>Go Back</Link>
        <Row>
            <Col md={6}>
                <Image src={product.image} alt={product.name} fluid/>       {/*fluid: Fill only his container */}
            </Col> 
            <Col md={3}>
                <ListGroup variant='flush'>                                 {/*variant='flush' Takes away the spacing or takes away the border*/}

                    <ListGroup.Item>
                        <h3>{product.name}</h3>
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <Rating value={product.rating} text={`${product.numReviews} reviews`}/>
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <strong>Price: </strong>${product.price}
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <strong>Description: </strong> {product.description}
                    </ListGroup.Item>
                </ListGroup>
            </Col>
            <Col md={3}>
                <ListGroup variant='flush'>

                    <ListGroup.Item>
                        <Row>
                            <Col>
                                Price:
                            </Col>
                            <Col>
                                <strong>{product.price}</strong>
                            </Col>
                        </Row>
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <Row>
                            <Col>
                                Status:
                            </Col>
                            <Col>
                                {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                            </Col>
                        </Row>
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <Button className='btn-block' type='button' disabled={product.countInStock === 0}>
                            Add to Cart
                        </Button>
                    </ListGroup.Item>

                </ListGroup>
            </Col>
        </Row>
    </>
  )
}

export default ProductDetails