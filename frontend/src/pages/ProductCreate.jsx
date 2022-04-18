import React from 'react'
import {useState, useEffect} from 'react'
import axios from 'axios'
import {Link, useNavigate, useParams} from 'react-router-dom'
import {Form, Button} from 'react-bootstrap'
import {useDispatch, useSelector} from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import { createProduct, resetMessage, createImage } from '../features/products/productSlice'
import {Convert} from '../converter'

const ProductCreate = () => {

    const params = useParams()
    const productId = params.id

    const [errorMsg, setErrorMsg] = useState('')
    const [successMsg, setSuccessMsg] = useState('')

    const [name, setName] = useState('')
    const [price, setPrice] = useState(0)
    const [image, setImage] = useState()
    const [brand, setBrand] = useState('')
    const [category, setCategory] = useState('')
    const [countInStock, setCountInStock] = useState(0)
    const [description, setDescription] = useState('')
    const [uploading, setUploading] = useState(false)
    const [picture, setPicture] = useState()

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const {product, isLoading, isError, isSuccess, message, isCreated, isImage} = useSelector(state => state.product)
    const {user} = useSelector(state => state.user)

    useEffect(() => {

        if(errorMsg){
            setTimeout(() => {
                setErrorMsg('')
            }, 5000)
        }

        if(message) {
            setTimeout(() => dispatch(resetMessage()), 5000)
        }

        /*
        if(isSuccess && isCreated) {
            const file = picture
            const formData = new FormData()
            formData.append('image', file)
            dispatch(createImage(formData))
        }
        */

        if(isCreated) {
            navigate('/admin/productlist')
            dispatch(resetMessage())
        }

    }, [navigate, dispatch, productId, product, errorMsg, message, isCreated, isSuccess,isImage])

    const onSubmit = async (e) => {
        e.preventDefault()

        const convertedImage = await Convert(image)

        if(convertedImage) {
            console.log(convertedImage);
            } else{
                console.log('The file is not in format of image/jpeg or image/png')
            }
        
        const newProduct = {
            user: user._id,
            name,
            image: convertedImage,
            brand,
            category,
            description,
            price,
            countInStock
        }
 
        dispatch(createProduct(newProduct))
    }

    /*
    const uploadFileHandler = async(e) =>{
        const file = e.target.files[0]
        const formData = new FormData()
        formData.append('image', file)
        setUploading(true)

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            }

            const {data} = await axios.post('/api/upload', formData, config)
            setImage(data)
            setUploading(false)
        } catch (error) {
            console.error(error)
            setUploading(false)
        }
    }
    */

    return (
        <>
            <Link to='/admin/productlist' className='btn btn-light my-3'>
                Go Back
            </Link>
            
                <h1 className='text-center'>ADD A NEW PRODUCT</h1>
                {message && <Message variant='danger'>{message}</Message>}
                {errorMsg && <Message variant='danger'>{errorMsg}</Message>}
                {successMsg && <Message variant='success'>{successMsg}</Message>}
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
                                <Form.Control type='file' placeholder='Enter Image url' onChange={(e) => setImage(e.target.files[0])}></Form.Control>
                            </Form.Group>

                            {/*
                            <Form.Group controlId='image'>
                                <Form.Label>Image</Form.Label>
                                <Form.Control type='text' placeholder='Enter Image url' value={image} onChange={(e) => setImage(e.target.value)}></Form.Control>
                                
                                <Form.Control type="file" label='Choose File' custom onChange={(e)=> setPicture(e.target.files[0])}/>
                                {uploading && <Loader />}
                                
                                <Form.Control type="file" id='image-file' label='Choose File' custom onChange={uploadFileHandler}/>
                                {uploading && <Loader />} 
                            </Form.Group>
                            */}

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

                            <Button className='btn-block mt-3' type='submit' variant='primary'>CREATE</Button>
                        </Form>
                    </FormContainer>
                )}
        </>
    )
}

export default ProductCreate