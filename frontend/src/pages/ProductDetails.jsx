import React, {useState, useEffect, useCallback} from 'react'
import { Link, useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { Row, Col, Image, ListGroup, Card, Button, Form} from 'react-bootstrap'
import Rating from '../components/Rating'
import { useDispatch, useSelector } from 'react-redux'
import { getProductDetails, createProductReview, resetMessage, resetReviewCreated, resetCrud } from '../features/products/productSlice'
import { addItem } from '../features/cart/cartSlice'
import Loader from '../components/Loader'
import Message from '../components/Message'
import Meta from '../components/Meta'
import ProductCarousel from '../components/ProductCarousel'
import ImageViewer from 'react-simple-image-viewer';
//import axios from 'axios'
//import products from '../products'

const ProductDetails = () => {


    const [qty, setQty] = useState(1)
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')
    const [successMsg, setSuccessMsg] = useState('')
    const [url, setUrl] = useState('')

    const [sizes, setSizes] = useState()
    const [colors, setColors] = useState()
    const [images, setImages] = useState()

    //Filters
    const [sizeChoosed, setSizeChoosed] = useState()
    const [colorChoosed, setColorChoosed] = useState()

    //Set Image on the carousel
    const [indexSelected, setIndexSelected] = useState(0)

    //ImageViewer
    const [currentImage, setCurrentImage] = useState(0);
    const [isViewerOpen, setIsViewerOpen] = useState(false);

    const [searchParams] = useSearchParams()
    const redirect = searchParams.get('redirect')

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const {id} = useParams()

    const {user} = useSelector((state) => state.user)
    const {product, isLoading, isSuccess, isError, message, reviewCreated, isLoadingReview, isLoaded} = useSelector((state) => state.product)

    //const product = products.find(p => p._id === params.id)
    //const [product, setProduct] = useState({})

    useEffect(() => {
        dispatch(getProductDetails(id))

        if (redirect === 'productlist') {
            setUrl('/admin/productlist')
        }

        if(redirect === 'home') {
            setUrl('/')
        }

    }, [])

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

    useEffect(() => {
        if(isLoaded) {
            //All Images
            var allImages = []
            var allSizes = []

            product.products.map(product => product.images.map((img => allImages.push(img))))
            setImages(allImages)

            product.products.map(function(product) {
                if(!allSizes.includes(product.size)) {
                    allSizes.push(product.size)
                }
            })
            setSizes(allSizes)
        }

        dispatch(resetCrud())
    }, [isLoaded])

    useEffect(() => {
        setIndexSelected(0)
    }, [images])



    const addToCartHandler = () => {
        dispatch(addItem({id, qty}))
        navigate(`/cart`)
    }

    const addReviewHandler = (e) => {
        e.preventDefault()
        dispatch(createProductReview({id, rating, comment}))
    }

    //ImageViewer
    const openImageViewer = useCallback((index) => {
        setCurrentImage(index)
        setIsViewerOpen(true)
    }, [])
    
    const closeImageViewer = () => {
        setCurrentImage(0)
        setIsViewerOpen(false)
    }

    const sincronize = (index) => {
        setIndexSelected(index)
    }

    //Filter Results
    const filter = (size) => {
        setSizeChoosed(size)
        var filtered = []
        var filteredImages = []

        filtered = product.products.filter(item => item.size === size)
        console.log(filtered)
        //setSizes(filtered)

        filtered.map(product => product.images.map((img => filteredImages.push(img))))
        console.log(filteredImages)
        setImages(filteredImages)
    }

  return (
    <>
        <Link to={url} className='btn btn-light my-3 mx-3'>Go Back <i className='fas fa-arrow-left'></i></Link>
        {/*
        <Link to='/' className='btn btn-light my-3 mx-3'>Go Home <i className='fas fa-home'></i></Link>
        <Link to='/admin/productlist' className='btn btn-light my-3'>Go to Products Table <i className='fas fa-table'></i></Link>
        */}

        {isLoading ? <Loader /> : Object.keys(product).length !== 0 && (
            <>
                <Meta title={product.name}/>
                <Row>
                    
                    {/*fluid: Fill only his container */}
                    {/*}
                    <Col md={6}>
                        <Image src={product.image} alt={product.name} fluid/>       
                    </Col> 
                    */}
                          {isViewerOpen && (
                                <ImageViewer
                                src={ product.images }
                                currentIndex={ currentImage }
                                onClose={ closeImageViewer }
                                disableScroll={ true }
                                closeOnClickOutside={ true }
                                backgroundStyle={{
                                    backgroundColor: "rgba(0,0,0,0.9)"
                                  }}
                                />
                            )}
                    {images && (
                        <Col m={8}>
                            <ProductCarousel images={images} indexPar={indexSelected} openImageViewer={openImageViewer} sincronize={sincronize} />
                            <div className="form-group multi-preview">{images.map((img, index) => (<Image onClick={() => setIndexSelected(index)} key={index} style={{width: '100px', padding: '5px', opacity: indexSelected !== index && '0.4', cursor: 'pointer'}} src={img} alt="..." />))}
                            </div>                       
                        </Col>
                    )}

                    <Col md={3}>
                        <ListGroup variant='flush'>                                 {/*variant='flush' Takes away the spacing or takes away the border*/}

                            <ListGroup.Item>
                                <h3>{product.name}</h3>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Rating value={product.rating} text={`${product.numReviews} reviews`}/>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <strong>Precio: Gs. </strong> {product.price}
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <strong>Description: </strong> {product.description}
                            </ListGroup.Item>
                        </ListGroup>

                        {sizes && (
                            <ListGroup variant='flush' className='mt-3'>
                                <ListGroup.Item><strong>SELECCIONE UN TAMAÑO</strong></ListGroup.Item>
                                <ListGroup.Item>
                                    {sizes.map(size => (
                                        <Button variant={sizeChoosed === size ? 'success' : 'light'} className='me-2' value={size} onClick={(e) => filter(e.target.value)}>{size}</Button>
                                    ))}
                                </ListGroup.Item>
                            </ListGroup>
                        )}
                    </Col>

                    <Col md={3}>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <Row>
                                    <Col>
                                        Precio:
                                    </Col>
                                    <Col>
                                        <strong>Gs. {product.price}</strong>
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
                        {!isLoadingReview && product.reviews.length === 0 && <Message>No reviews</Message>}
                        {isLoadingReview ? <Loader /> : (
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
                        )}

                    </Col>
                </Row>
            </>
        )}

    </>
  )
}

export default ProductDetails