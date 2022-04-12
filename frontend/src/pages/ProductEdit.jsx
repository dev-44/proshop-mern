import {useState, useEffect} from 'react'
import {Link, useNavigate, useParams} from 'react-router-dom'
import {Form, Button, Row, Col} from 'react-bootstrap'
import {useDispatch, useSelector} from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import { getProductDetails, resetMessage, updateProduct, reset } from '../features/products/productSlice'

const ProductEdit = () => {

    const params = useParams()
    const productId = params.id

    const [errorMsg, setErrorMsg] = useState('')
    const [successMsg, setSuccessMsg] = useState('')

    const [name, setName] = useState('')
    const [price, setPrice] = useState(0)
    const [image, setImage] = useState('')
    const [brand, setBrand] = useState('')
    const [category, setCategory] = useState('')
    const [countInStock, setCountInStock] = useState(0)
    const [description, setDescription] = useState('')


    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {product, isLoading, isError, isSuccess, message, isUpdated} = useSelector(state => state.product)

    useEffect(() => {
        if(product._id !== productId) {
            dispatch(getProductDetails(productId))
        } else {
            setName(product.name)
            setPrice(product.price)
            setImage(product.image)
            setBrand(product.brand)
            setCategory(product.category)
            setCountInStock(product.countInStock)
            setDescription(product.description)
        }

        if(errorMsg){
            setTimeout(() => {
                setErrorMsg('')
            }, 5000)
        }

        if(message) {
            setTimeout(() => dispatch(resetMessage()), 5000)
        }

        if(isUpdated) {
            navigate('/admin/productlist')
        }

    }, [navigate, dispatch, productId, product, isSuccess, errorMsg, message, isUpdated])

    const onSubmit = (e) => {
        e.preventDefault()

        const editedProduct = {
            id: productId,
            name,
            image,
            brand,
            category,
            description,
            price,
            countInStock
        }

        dispatch(updateProduct(editedProduct))
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

                            <Form.Group controlId='image'>
                                <Form.Label>Image</Form.Label>
                                <Form.Control type='text' placeholder='Enter Image url' value={image} onChange={(e) => setImage(e.target.value)}></Form.Control>
                            </Form.Group>

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