import { useState, useEffect} from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Row, Col, Image, ListGroup, Card, Button, Form} from 'react-bootstrap'
import Rating from '../components/Rating'
import { useDispatch, useSelector } from 'react-redux'
import { getProductDetails, reset } from '../features/products/productSlice'
import Loader from '../components/Loader'
import Message from '../components/Message'
//import axios from 'axios'
//import products from '../products'

const ProductDetails = () => {
    const [qty, setQty] = useState(1)
    const dispatch = useDispatch()
    const {id} = useParams()
    const {product, isLoading, isError, message} = useSelector((state) => state.product)
    const navigate = useNavigate()

    //const product = products.find(p => p._id === params.id)
    //const [product, setProduct] = useState({})

    useEffect(() => {
        /*
        const fetchProduct = async() => {
          const { data } = await axios.get(`/api/products/${params.id}`)
    
          setProduct(data)
        }
    
        fetchProduct()
        */

        if(isError){
            <Message variant='danger'>{message}</Message>
        }

        dispatch(getProductDetails(id))
    
      }, [dispatch, id, isError, message])

    const addToCartHandler = () => {
        navigate(`/cart/${id}?qty=${qty}`)
    }

    if(isLoading) {
        return <Loader />
    }

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

                    {product.countInStock > 0 && (
                        <ListGroup.Item>
                            <Row>
                                <Col>Qty</Col>
                                <Col>
                                    <Form.Control as='select'  className='form-select' value={qty} onChange={(e) => setQty(e.target.value)}>
                                        {[...Array(product.countInStock).keys()].map((x => (
                                            <option key={x + 1} value={x + 1}>{x + 1}</option>
                                        )))}
                                    </Form.Control>
                                </Col>
                            </Row>
                        </ListGroup.Item>
                    )}

                    <ListGroup.Item>
                        <Button className='btn-block' type='button' disabled={product.countInStock === 0} onClick={addToCartHandler}>
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