import React from 'react'
import {useState, useEffect} from 'react'
import {Link, useNavigate, useParams} from 'react-router-dom'
import {Form, Button, Image, InputGroup} from 'react-bootstrap'
import {useDispatch, useSelector} from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import { createProduct, getProducts, resetCrud, resetError } from '../features/products/productSlice'
import {Convert} from '../converter'

const ProductCreate = () => {

    const params = useParams()
    const productId = params.id
    const pageNumber = params.pageNumber || 1

    const [errorMsg, setErrorMsg] = useState('')
    const [successMessage, setSuccessMessage] = useState('')

    //Product
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [imageCover, setImageCover] = useState()
    const [brand, setBrand] = useState('')
    const [category, setCategory] = useState('')
    const [price, setPrice] = useState(0)

    const [previewImage, setPreviewImage] = useState()

    const dispatch = useDispatch()
    const navigate = useNavigate()

   const {products, product, isLoading, isError, isSuccess, message, isCreated, isLoaded} = useSelector(state => state.product)
    const {user} = useSelector(state => state.user)

    useEffect(() => {

        if(errorMsg){
            setTimeout(() => {
                setErrorMsg('')
            }, 5000)
        }

        if(isError) {
            setTimeout(() => dispatch(resetError()), 5000)
        }

        if(isCreated) {
            let index = products.length - 1
            let id = products[index]._id
            navigate(`/admin/subproducts/${id}`)
            //navigate('/admin/productlist')
        }
        /*
        if(isSuccess && isCreated) {
            const file = picture
            const formData = new FormData()
            formData.append('image', file)
            dispatch(createImage(formData))
        }
        */

    }, [navigate, dispatch, productId, product, errorMsg, , isCreated, isSuccess, isError, isLoaded])


    const onSubmit = async (e) => {
        e.preventDefault()
        
        const convertedImage = await Convert(imageCover)

        if(convertedImage) {
            console.log('Images converted')
            console.log(convertedImage)
        } else{
            console.log('The file is not in format of image/jpeg or image/png')
        }
         
        const newProduct = {
            user: user._id,
            name,
            description,
            image: convertedImage,
            brand,
            category,
            price,
        }
 
        dispatch(createProduct(newProduct))
    }

    const handleUploadImage = (file) => {

        let fileConverted = URL.createObjectURL(file)
        
        setPreviewImage(fileConverted)
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
                {successMessage && <Message variant='success'>{successMessage}</Message>}
                {isLoading ? <Loader/> : (
                    <FormContainer>
                        <Form onSubmit={onSubmit}>

                            <Form.Group controlId='name' className="mb-2">
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control type='text' placeholder='Ingrese el nombre del Producto' value={name} onChange={(e) => setName(e.target.value)}></Form.Control>
                            </Form.Group>
                            
                            <Form.Group controlId='price' className="mb-2">
                                <Form.Label>Precio</Form.Label>
                                <InputGroup>
                                    <InputGroup.Text id="basic-addon1">Gs.</InputGroup.Text>
                                    <Form.Control type='number' placeholder='Ingrese el Precio' value={price} onChange={(e) => setPrice(e.target.value)}></Form.Control>
                                </InputGroup>
                            </Form.Group>
                            

                            {/* MULTIPLES IMAGENES                        
                            <Form.Group controlId='images'>
                                <Form.Label>Image/s</Form.Label>
                                <Form.Control type='file' multiple placeholder='Select the images to upload' onChange={(e) => {
                                    setImages(e.target.files)
                                    handleUploadFiles(e)
                                    }}></Form.Control>
                                <div className="form-group multi-preview">{previewImages && previewImages.map(img => (<Image style={{width: '140px', padding: '5px'}} src={img} alt="..." />))}</div>
                            </Form.Group> */}

                            


                            {/* BRAD'S SECTION
                            <Form.Group controlId='image'>
                                <Form.Label>Image</Form.Label>
                                <Form.Control type='text' placeholder='Enter Image url' value={image} onChange={(e) => setImage(e.target.value)}></Form.Control>
                                
                                <Form.Control type="file" label='Choose File' custom onChange={(e)=> setPicture(e.target.files[0])}/>
                                {uploading && <Loader />}
                                
                                <Form.Control type="file" id='image-file' label='Choose File' custom onChange={uploadFileHandler}/>
                                {uploading && <Loader />} 
                            </Form.Group>
                            */}

                            <Form.Group controlId='brand' className="mb-2">
                                <Form.Label>Marca</Form.Label>
                                <Form.Control type='text' placeholder='Ingrese la Marca' value={brand} onChange={(e) => setBrand(e.target.value)}></Form.Control>
                            </Form.Group>

                            {/* MOVE TO SUBPRODUCT                           
                            <Form.Group controlId='countInStock'>
                                <Form.Label>Count in Stock</Form.Label>
                                <Form.Control type='number' placeholder='Enter Count in Stock' value={countInStock} onChange={(e) => setCountInStock(e.target.value)}></Form.Control>
                            </Form.Group> */}

                            <Form.Group controlId='category' className="mb-2">
                                <Form.Label>Categoría</Form.Label>
                                <Form.Control type='text' placeholder='Ingrese la Categoría del Producto' value={category} onChange={(e) => setCategory(e.target.value)}></Form.Control>
                            </Form.Group>

                            <Form.Group controlId='imageCover' className="mb-2">
                                <Form.Label>Imagen de Portada</Form.Label>
                                <Form.Control type='file' placeholder='Adjunte la imagen' onChange={(e) => 
                                    {setImageCover(e.target.files[0])
                                    handleUploadImage(e.target.files[0])
                                }}></Form.Control>
                                <div className="form-group multi-preview">{previewImage && (<Image style={{width: '140px', padding: '5px'}} src={previewImage} alt="..." />)}</div>                           
                            </Form.Group>

                            <Form.Group controlId='description' className="mb-2">
                                <Form.Label>Descripción</Form.Label>
                                <Form.Control as='textarea' type='text' placeholder='Ingresa una Descripción del Producto' value={description} onChange={(e) => setDescription(e.target.value)} cols='30' rows='5'></Form.Control>
                            </Form.Group>

                            <div className="d-grid gap-2">
                                <Button className='mt-3' type='submit' variant='primary'>CREATE</Button>
                            </div>
                        </Form>
                    </FormContainer>
                )}
        </>
    )
}

export default ProductCreate