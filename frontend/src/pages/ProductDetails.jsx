import React, {useState, useEffect, useCallback} from 'react'
import {FaCartPlus} from 'react-icons/fa'
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

    const [sizes, setSizes] = useState([])
    const [colors, setColors] = useState([])
    const [images, setImages] = useState([])

    //Filters
    const [sizeChoosed, setSizeChoosed] = useState('')
    const [colorChoosed, setColorChoosed] = useState('')
    const [filteredProducts, setFilteredProducts] = useState()
    const [productChoosed, setProductChoosed] = useState()

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

        if(redirect === 'home' || !redirect) {
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
            var allSizes = []
            var allImages = []

            product.products.map(product => product.images.map((img => allImages.push(img))))
            setImages(allImages)

            product.products.map(function(product) {
                if(!allSizes.includes(product.size)) {
                    allSizes.push(product.size)
                }
            })
            setSizes(allSizes)

            setFilteredProducts(product.products)

        }

        dispatch(resetCrud())
    }, [isLoaded])

    useEffect(() => {
        setIndexSelected(0)
    }, [images])


    const addToCartHandler = () => {

        const {_id, name, price} = product
        const {_id: subid, images, size, color, countInStock} = productChoosed[0]

        const productData = {
            id: _id,
            name,
            price,
            subid,
            image: images[0],
            size,
            color,
            countInStock
        }
        dispatch(addItem({productData, qty}))
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
    const filterBySize = (size) => {
        if (sizeChoosed === size) {
            setSizeChoosed('')
            setColors('')
            setProductChoosed('')

            //All Images
            var allImages = []

            product.products.map(product => product.images.map((img => allImages.push(img))))
            setImages(allImages)

            setFilteredProducts(product.products)
        } else {

            console.log('aqui');
            setColorChoosed('')
            setProductChoosed('')
    
            setSizeChoosed(size)
            var filtered = []
            var filteredImages = []
            var colorsFiltered = []
    
            filtered = product.products.filter(item => item.size === size)
            setFilteredProducts(filtered)
    
            filtered.map(product => product.images.map((img => filteredImages.push(img))))
            setImages(filteredImages)
    
            colorsFiltered = filtered.map(product => product.color)
            setColors(colorsFiltered)

            if(colorsFiltered.length === 1){
                var color = colorsFiltered[0]
                console.log("Solo un color")
                console.log(colorsFiltered)

                setColorChoosed(color)
        
                filtered = filtered.filter(item => item.color === color)
                console.log('Product Choosed')
                console.log(filtered)
                setProductChoosed(filtered)
        
                filteredImages = []
                filtered.map(product => product.images.map((img => filteredImages.push(img))))
                setImages(filteredImages)
                console.log('Hasta aqui')
            }
        }

    }

    const filterByColor = (color) => {
        if (colorChoosed === color) {
            setColorChoosed('')
            setProductChoosed('')
            
            var filtered = []
            var filteredImages = []
            var colorsFiltered = []
    
            filtered = product.products.filter(item => item.size === sizeChoosed)
            setFilteredProducts(filtered)
    
            filtered.map(product => product.images.map((img => filteredImages.push(img))))
            setImages(filteredImages)
    
            colorsFiltered = filtered.map(product => product.color)
            setColors(colorsFiltered)

        } else {
            setColorChoosed(color)
            var filtered = []
            var filteredImages = []
    
            filtered = filteredProducts.filter(item => item.color === color)
            setProductChoosed(filtered)
    
            filtered.map(product => product.images.map((img => filteredImages.push(img))))
            setImages(filteredImages)
        }
    }


  return (
    <>
        
        {/*
        <Link to='/' className='btn btn-light my-3 mx-3'>Go Home <i className='fas fa-home'></i></Link>
        <Link to='/admin/productlist' className='btn btn-light my-3'>Go to Products Table <i className='fas fa-table'></i></Link>
        */}

        {isLoading ? <Loader /> : Object.keys(product).length !== 0 && (
            <>
                <Meta title={product.name}/>
                <Link to={url} className='btn btn-light my-3 mx-3'>Volver <i className='fas fa-arrow-left'></i></Link>
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
                                <Rating value={product.rating} text={`${product.numReviews} reseñas`}/>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <strong>Precio: Gs. </strong> {product.price.toLocaleString('es-CO')}
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <strong>Descripción: </strong> {product.description}
                            </ListGroup.Item>
                        </ListGroup>

                        {sizes && (
                            <ListGroup variant='flush' className='mt-3'>
                                <ListGroup.Item><strong>SELECCIONE UN TAMAÑO</strong></ListGroup.Item>
                                <ListGroup.Item>
                                    {sizes.map((size, index) => (
                                        <Button variant={sizeChoosed === size ? 'success' : 'light'} className='me-2' value={size} onClick={(e) => filterBySize(e.target.value)} key={index}>{size}</Button>
                                    ))}
                                </ListGroup.Item>
                            </ListGroup>
                        )}

                        {colors && (
                            <ListGroup variant='flush' className='mt-3'>
                                <ListGroup.Item><strong>SELECCIONE UN COLOR</strong></ListGroup.Item>
                                <ListGroup.Item>
                                    {colors.map((color, index) => (
                                        <Button variant={colorChoosed === color ? 'success' : 'light'} className='me-2 mb-2' value={color} onClick={(e) => filterByColor(e.target.value)} key={index}>{color}</Button>
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
                                        <strong>Gs. {product.price.toLocaleString('es-CO')}</strong>
                                    </Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>
                                        Estado:
                                    </Col>
                                    {productChoosed && (
                                        <Col>
                                            {(Number(productChoosed[0].countInStock) > 0) && <span className='highlight-green'>Disponible!</span>}
                                            {(Number(productChoosed[0].countInStock) === 0) && <span className='circle-sketch-highlight'>No Disponible</span>}
                                        </Col>

                                    )}
                                </Row>
                            </ListGroup.Item>

                            {(user && user.isAdmin && productChoosed && productChoosed[0].countInStock > 0) && (
                                <ListGroup.Item>
                                    <Row>
                                        <Col>
                                            Cantidad: 
                                        </Col>
                                        <Col>
                                            {productChoosed[0].countInStock}
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            )}

                            {((!user && productChoosed && productChoosed[0].countInStock > 0) || (user && !user.isAdmin && productChoosed && productChoosed[0].countInStock > 0)) && (
                                                  
                                <ListGroup.Item>
                                    <Row>
                                        <Col>
                                            Cantidad: 
                                        </Col>
                                        <Col>
                                            <Form.Control
                                            as='select'
                                            className='form-select'
                                            value={qty}
                                            onChange={(e) => setQty(e.target.value)}
                                            >
                                            {[...Array(productChoosed[0].countInStock).keys()].map(
                                                (x) => (
                                                <option key={x + 1} value={x + 1}>
                                                    {x + 1}
                                                </option>
                                                )
                                            )}
                                            </Form.Control>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                                                 
                            )}


                            {product.countInStock > 0 && (
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Cantidad</Col>
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
                                <Button className='btn-block' type='button' disabled={(productChoosed && Number(productChoosed.countInStock) === 0) || !sizeChoosed || !colorChoosed} onClick={addToCartHandler}>
                                    Agregar al Carrito <FaCartPlus />
                                </Button>
                            </ListGroup.Item>

                        </ListGroup>
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                        <h2>Reseñas</h2>
                        {successMsg && <Message variant='success'>{successMsg}</Message>}
                        {isError && (<Message variant='danger'>{message}</Message>)}
                        {!isLoadingReview && product.reviews.length === 0 && <Message>No hay reseñas</Message>}
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
                            <h2>Escribe una reseña</h2>
                            {user ? (
                            <Form onSubmit={addReviewHandler}>
                                <Form.Group controlId='rating'>
                                    <Form.Label>Rating</Form.Label>
                                    <Form.Control as='select' value={rating} onChange={(e) => setRating(e.target.value)}>
                                        <option value=''>Seleccionar...</option>
                                        <option value='1'>1 - Malo</option>
                                        <option value='2'>2 - Aceptable</option>
                                        <option value='3'>3 - Bueno</option>
                                        <option value='4'>4 - Muy Bueno</option>
                                        <option value='5'>5 - Excelente</option>
                                    </Form.Control>
                                </Form.Group>

                                <Form.Group controlId='comment'>
                                    <Form.Label>Comentario</Form.Label>
                                    <Form.Control as='textarea' row='3' value={comment} onChange={(e) => setComment(e.target.value)}></Form.Control>
                                </Form.Group>

                                <Button type='submit' variant='primary' className='mt-2'>Enviar</Button>
                            </Form>
                            ) : (<Message>Por favor <Link to='/login'>inicie Sesión</Link> para escribir una reseña</Message>)}
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