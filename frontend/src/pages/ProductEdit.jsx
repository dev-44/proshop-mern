import React, {useState, useEffect} from 'react'
import {Link, useNavigate, useParams, useLocation, useSearchParams} from 'react-router-dom'
import {Form, Button, Image} from 'react-bootstrap'
import {useDispatch, useSelector} from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import { getProductDetails, updateProduct, resetError, resetCrud } from '../features/products/productSlice'

const ProductEdit = () => {

    const params = useParams()
    const productId = params.id

    const [errorMsg, setErrorMsg] = useState('')
    const [successMsg, setSuccessMsg] = useState('')

    const [name, setName] = useState('')
    const [price, setPrice] = useState(0)
    const [images, setImages] = useState('')
    const [brand, setBrand] = useState('')
    const [category, setCategory] = useState('')
    const [countInStock, setCountInStock] = useState(0)
    const [description, setDescription] = useState('')

    const [previewImages, setPreviewImages] = useState()

    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const location = useLocation()

    //const redirect = location.search.split('=',)[1]
    const redirect = searchParams.get('redirect')
    const pageNumber = searchParams.get('page')
    
    const dispatch = useDispatch()
    const {product, isLoading, isError, message, isUpdated} = useSelector(state => state.product)

    useEffect(() => {
        dispatch(getProductDetails(productId))



    }, [productId])

    useEffect(() => {
        setName(product.name)
        setPrice(product.price)
        setImages(product.images)
        setPreviewImages(product.images)
        setBrand(product.brand)
        setCategory(product.category)
        setCountInStock(product.countInStock)
        setDescription(product.description)
    }, [product])

    useEffect(() => {

        if(errorMsg){
            setTimeout(() => {setErrorMsg('')}, 5000)
        }

        if(isError) {
            setTimeout(() => dispatch(resetError()), 5000)
        }

        if(isUpdated) {
            
            if(redirect === 'details') {
                navigate(`/product/${productId}`)
                dispatch(resetCrud())
            }

            if(redirect === 'productlist') {
                navigate(`/admin/productlist?page=${pageNumber}`)
                //navigate(`/admin/productlist/${pageNumber}`)
            }
        }

    }, [dispatch, errorMsg, isUpdated, isError])

    const onSubmit = (e) => {
        e.preventDefault()

        const editedProduct = {
            id: productId,
            name,
            images,
            brand,
            category,
            description,
            price,
            countInStock
        }

        dispatch(updateProduct(editedProduct))
    }

    const handleUploadFiles = () => {

    }

    return (
        <>
            <Link to='/admin/productlist' className='btn btn-light my-3'>
                Go Back
            </Link>
            
                {message && <Message variant='danger'>{message}</Message>}
                {errorMsg && <Message variant='danger'>{errorMsg}</Message>}
                {successMsg && <Message variant='success'>{successMsg}</Message>}

                <h1 className='text-center'>EDIT PRODUCT</h1>
                {isLoading ? <Loader/> : (
                    <FormContainer>
                            <Form onSubmit={onSubmit}>

                            <Form.Group controlId='name'>
                                <Form.Label>Name</Form.Label>
                                <Form.Control type='text' placeholder='Enter Name' value={name} onChange={(e) => setName(e.target.value)}></Form.Control>
                            </Form.Group>

                            <Form.Group controlId='price'>
                                <Form.Label>Price</Form.Label>
                                <Form.Control type='number' placeholder='Enter Price' value={price} onChange={(e) => setPrice(e.target.value)}></Form.Control>
                            </Form.Group>

                            <Form.Group controlId='images'>
                                <Form.Label>Image/s</Form.Label>
                                <Form.Control type='file' multiple placeholder='Select the images to upload' onChange={(e) => {
                                    setImages(e.target.files)
                                    handleUploadFiles(e)
                                    }}>
                                </Form.Control>
                                <div className="form-group multi-preview">{previewImages && previewImages.map(img => (
                                        <div className='image-container'>
                                            <Image className='preview-image' style={{width: '140px', padding: '5px', cursor: 'pointer'}} src={img} alt="..." />
                                            <div className='overlay'>
                                                <Button className='btn-sm' style={{backgroundColor: 'transparent', borderStyle: 'none'}}>
                                                    <i className='fas fa-edit'></i>   
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Form.Group>

                        {/* <Form.Group controlId='image'>
                                <Form.Label>Image</Form.Label>
                                <Form.Control type='text' placeholder='Enter Image url' value={image} onChange={(e) => setImage(e.target.value)}></Form.Control>
                            </Form.Group> */}

                            <Form.Group controlId='brand'>
                                <Form.Label>Brand</Form.Label>
                                <Form.Control type='text' placeholder='Enter Brand' value={brand} onChange={(e) => setBrand(e.target.value)}></Form.Control>
                            </Form.Group>

                            <Form.Group controlId='countInStock'>
                                <Form.Label>Count in Stock</Form.Label>
                                <Form.Control type='number' placeholder='Enter Count in Stock' value={countInStock} onChange={(e) => setCountInStock(e.target.value)}></Form.Control>
                            </Form.Group>

                            <Form.Group controlId='category'>
                                <Form.Label>Category</Form.Label>
                                <Form.Control type='text' placeholder='Enter Category' value={category} onChange={(e) => setCategory(e.target.value)}></Form.Control>
                            </Form.Group>

                            <Form.Group controlId='description'>
                                <Form.Label>Description</Form.Label>
                                <Form.Control type='text' placeholder='Enter Category' value={description} onChange={(e) => setDescription(e.target.value)}></Form.Control>
                            </Form.Group>

                            <Button className='mt-3' type='submit' variant='primary'>UPDATE</Button>
                        </Form>
                    </FormContainer>
                )}
        </>
    )
}

export default ProductEdit