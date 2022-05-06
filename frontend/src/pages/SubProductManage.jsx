import React, {useState, useEffect} from 'react'
import {Link, useNavigate, useParams} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'

import { getProductDetails, resetMessage, resetCrud } from '../features/products/productSlice'

import SubProduct from '../components/SubProduct'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'

import {Convert} from '../converter'
import { Form, FormGroup, Image, Col, ListGroup, Card, Button, CardGroup } from 'react-bootstrap'

const SubProductManage = () => {

     const [errorMsg, setErrorMsg] = useState('')
     const [successMessage, setSuccessMessage] = useState('')

     //SubProducts
    const [images, setImages] = useState()
    const [size, setSize] = useState('')
    const [color, setColor] = useState('')
    const [countInStock, setCountInStock] = useState(0)
    const [previewImages, setPreviewImages] = useState()
    const [subProducts, setSubProducts] = useState('')

    const [chooseToDelete, setChooseToDelete] = useState('')

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const params = useParams()

    const id = params.id

    const {user} = useSelector(state => state.user)
    const {product, isLoading, isError, isSuccess, message, isCreated, isLoaded, pages} = useSelector(state => state.product)

    useEffect(() => {
     dispatch(getProductDetails(id))
    }, [])


    useEffect(() => {
          if(isLoaded && product.products.length > 0){
               setSubProducts(product.products)
          }
    }, [isLoaded])

    const onSubmit = async (e) => {
          e.preventDefault()
          
          const files = Array.from(images)
          console.log(files)
          var convertedImages = []
          
          for (var i=0; i<files.length; i++) {
          var element = files[i]
          var elementConverted = await Convert(element)
          convertedImages.push(elementConverted)
          }
     
          //const convertedImage = await Convert(image)

          if(convertedImages) {
          console.log('Images converted')
          console.log(convertedImages)
          } else{
          console.log('The file is not in format of image/jpeg or image/png')
          }
          
          /*
          const newProduct = {
          user: user._id,
          name,
          images: convertedImages,
          brand,
          category,
          description,
          price,
          countInStock
          }
          */

          //dispatch(createProduct(newProduct))
     }

     const handleUploadFiles = (e) => {
          var fileArray = []
          var ObjImgs = (e.target.files)
          for (let i = 0; i < ObjImgs.length; i++) {
              fileArray.push(URL.createObjectURL(ObjImgs[i]))
          }
          setPreviewImages(fileArray)
      }

     const editProduct = (id) => {

     }

     const preDeleteProduct = (id) => {

     }

     return (
     <>
          <h1 className='text-center'>Agrega un Nuevo SubProducto</h1>
          {message && <Message variant='danger'>{message}</Message>}
          {errorMsg && <Message variant='danger'>{errorMsg}</Message>}
          {successMessage && <Message variant='success'>{successMessage}</Message>}
          {isLoading && <Loader />}

          {(!isLoading && subProducts.length) > 0 && (
               <CardGroup>
                    {subProducts.map((product) => (<SubProduct key={product._id} product={product} editProduct={editProduct} preDeleteProduct={preDeleteProduct}/> ))}
               </CardGroup>
          )}

          {!isLoading && subProducts.length === 0 && (
               <FormContainer>

                    <ListGroup variant='flush' >
                         <ListGroup.Item>
                              <h3><strong>{product.name}</strong></h3>
                              <h5><strong>Descripción:</strong> {product.description}</h5>
                              <h5><strong>Marca:</strong> {product.brand}</h5>
                              <h5><strong>Categoría:</strong> {product.category}</h5>
                              <h5><strong>Precio: </strong> {product.price}</h5>
                         </ListGroup.Item>
                    </ListGroup>

                    <Form onSubmit={onSubmit}>
                         <FormGroup className="mb-2">
                              <Form.Label>Tamaño</Form.Label>
                              <Col md lg="4">
                                   <Form.Select aria-label="Default select example" onChange={(e) => setSize(e.target.value)}>
                                        <option>Seleccione un Tamaño</option>
                                        <option value="xp">Extra Pequeño - xp</option>
                                        <option value="p">Pequeño - p</option>
                                        <option value="m">Mediano - m</option>
                                        <option value="G">Grande - G</option>
                                        <option value="XG">Extra Grande - XG</option>
                                        <option value="XXG">Extra Extra Grande - XXG</option>
                                   </Form.Select>    
                              </Col>
                         </FormGroup>                                                 
                                                 
                         <Form.Group controlId='countInStock' className="mb-2">
                              <Form.Label>Count in Stock</Form.Label>
                              <Col md lg="4">
                                   <Form.Control type='number' placeholder='Enter Count in Stock' value={countInStock} onChange={(e) => setCountInStock(e.target.value)}></Form.Control>
                              </Col>
                         </Form.Group>

                         <Form.Group controlId='images' className="mb-2">
                              <Form.Label>Imágenes</Form.Label>
                              <Form.Control type='file' multiple placeholder='Select the images to upload' onChange={(e) => {
                                   setImages(e.target.files)
                                   handleUploadFiles(e)
                                   }}></Form.Control>
                              <div className="form-group multi-preview">{previewImages && previewImages.map(img => (<Image style={{width: '140px', padding: '5px', marginBlockEnd: '1px'}} src={img} alt="..." />))}</div>
                         </Form.Group>
                    </Form>
               </FormContainer>
          )}
     </>
     )
}

export default SubProductManage