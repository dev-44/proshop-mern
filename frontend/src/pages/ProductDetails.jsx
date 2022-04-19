import React, {useState, useEffect} from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Row, Col, Image, ListGroup, Card, Button, Form} from 'react-bootstrap'
import Rating from '../components/Rating'
import { useDispatch, useSelector } from 'react-redux'
import { getProductDetails, createProductReview, resetMessage, resetReviewCreated } from '../features/products/productSlice'
import { addItem } from '../features/cart/cartSlice'
import Loader from '../components/Loader'
import Message from '../components/Message'
import Meta from '../components/Meta'
//import axios from 'axios'
//import products from '../products'

const ProductDetails = () => {
    const [qty, setQty] = useState(1)
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')
    const [successMsg, setSuccessMsg] = useState('')

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const {id} = useParams()

    const {user} = useSelector((state) => state.user)
    const {product, isLoading, isSuccess, isError, message, reviewCreated} = useSelector((state) => state.product)

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

        if(!product || product._id !== id) {
            dispatch(getProductDetails(id))
        }

        if(isError){
            setRating(0)
            setComment('')
            setTimeout(() => dispatch(resetMessage()), 5000)
        }

        if(reviewCreated) {
            setSuccessMsg('Review Submitted!')
            setTimeout(() => {setSuccessMsg('')}, 3000)
            setRating(0)
            setComment('')
            dispatch(getProductDetails(id))
            dispatch(resetReviewCreated())
        }

    
      }, [dispatch, id, isError, message, reviewCreated])

    const addToCartHandler = () => {
        dispatch(addItem({id, qty}))
        navigate(`/cart`)
    }

    const addReviewHandler = (e) => {
        e.preventDefault()
        dispatch(createProductReview({id, rating, comment}))
    }

  return (
    <>
        
        <Link to='/' className='btn btn-light my-3'>Go Back</Link>

        {isLoading ? <Loader /> : Object.keys(product).length !== 0 && (
            <>
                <Meta title={product.name}/>
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
                                <strong>Price: </strong>$ {product.price}
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
                                        <strong>$ {product.price}</strong>
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

                <Row>
                    <Col md={6}>
                        <h2>Reviews</h2>
                        {successMsg && <Message variant='success'>{successMsg}</Message>}
                        {isError && (<Message variant='danger'>{message}</Message>)}
                        {product.reviews.length === 0 && <Message>No reviews</Message>}
                        <ListGroup variant='flush'>
                            {product.reviews.map(review => (
                                <ListGroup.Item key={review._id}>
                                    <strong>{review.name}</strong>
                                    <Rating value={review.rating}/>
                                    <p>{review.createdAt.substring(0,10)}</p>
                                    <p>{review.comment}</p>
                                </ListGroup.Item>
                            ))}

                            <ListGroup.Item>
                                <h2>Write a Customer Review</h2>
                                {user ? (
                                <Form onSubmit={addReviewHandler}>
                                    <Form.Group controlId='rating'>
                                        <Form.Label>Rating</Form.Label>
                                        <Form.Control as='select' value={rating} onChange={(e) => setRating(e.target.value)}>
                                            <option value=''>Select...</option>
                                            <option value='1'>1 - Poor</option>
                                            <option value='2'>2 - Fair</option>
                                            <option value='3'>3 - Good</option>
                                            <option value='4'>4 - Very Good</option>
                                            <option value='5'>5 - Excellent</option>
                                        </Form.Control>
                                    </Form.Group>

                                    <Form.Group controlId='comment'>
                                        <Form.Label>Comment</Form.Label>
                                        <Form.Control as='textarea' row='3' value={comment} onChange={(e) => setComment(e.target.value)}></Form.Control>
                                    </Form.Group>

                                    <Button type='submit' variant='primary'>Submit</Button>
                                </Form>
                                ) : (<Message>Please <Link to='/login'>sign in</Link> to write a review</Message>)}
                            </ListGroup.Item>
                        </ListGroup>
                    </Col>
                </Row>
            </>
        )}

    </>
  )
}

export default ProductDetails