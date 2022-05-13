import React, {useState, useEffect, useRef} from 'react'
import {Link, useNavigate, useParams} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'

import { getProductDetails, 
          resetCrud, 
          createSubProduct,
          updateSubProduct,
          deleteSubProduct
     } from '../features/products/productSlice'

import SubProduct from '../components/SubProduct'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'

import {Convert} from '../converter'
import { Form, FormGroup, Image, Row, Col, ListGroup, Modal, Button, CardGroup } from 'react-bootstrap'

const SubProductManage = () => {

     //Messages
     const [errorMsg, setErrorMsg] = useState('')
     const [successMessage, setSuccessMessage] = useState('')

     //SubProducts
     const [subProductId, setSubProductId] = useState('')
     const [images, setImages] = useState([])
     const [size, setSize] = useState('')
     const [color, setColor] = useState('')
     const [countInStock, setCountInStock] = useState(0)
     const [previewImages, setPreviewImages] = useState([])
     const [subProducts, setSubProducts] = useState([])
     const [openForm, setOpenForm] = useState(false)

     const [isEditing, setIsEditing] = useState(false)
     const [isArraysMatch, setIsArraysMatch] = useState(false)
     const [productToRemove, setProductToRemove] = useState('')
     const [openModal, setOpenModal] = useState(false)

     const [dragId, setDragId] = useState("")

     const dispatch = useDispatch()
     const navigate = useNavigate()
     const params = useParams()

     const id = params.id

     const {user} = useSelector(state => state.user)
     const {product, isLoading, message, isCreated, isLoaded, pages, isUpdated, subUpdated, isDeleted} = useSelector(state => state.product)

     const colorRef = useRef('')
     const stockRef = useRef(0)
     const sizeRef = useRef('')

     useEffect(() => {
          dispatch(getProductDetails(id))
     }, [])


     useEffect(() => {
          if(isLoaded && product.products) {

               if(product.products.length > 0){
                    setSubProducts(product.products)
                    dispatch(resetCrud())
                    console.log('There are subproducts')
               }
     
               if(product.products.length === 0) {
                    setOpenForm(true)
                    dispatch(resetCrud())
                    console.log('There are NOT subproducts')
               }
          }
          
     }, [isLoaded])

     useEffect(() => {
          if(isCreated) {
               setOpenForm(false)
               setSubProducts(product.products)
               setSuccessMessage('Producto Creado exitosamente')
               setTimeout(() => setSuccessMessage(''), 5000)
               dispatch(resetCrud())
          }

          if(isUpdated) {
               setOpenForm(false)
               setSubProducts(product.products)
               
               setSuccessMessage('Producto Actualizado exitosamente')
               setTimeout(() => setSuccessMessage(''), 5000)
               //dispatch(resetCrud())
          }

          if(subUpdated) {
               setTimeout(() => dispatch(resetCrud()), 5000)
          }

          if(isDeleted) {
               setSubProducts(product.products)
               setSuccessMessage('Producto Eliminado exitosamente')
               setTimeout(() => setSuccessMessage(''), 5000)
          }

     }, [isCreated, isUpdated, subUpdated, isDeleted])

     useEffect(() => {
          if(isEditing){

               if(images && previewImages) {
                    //console.log(images.length)
                    //console.log(previewImages.length)
                    if(images.length === previewImages.length) {
                         //console.log('same length')
                         if(images.every((v, i) => v === previewImages[i])) {
                              setIsArraysMatch(true)
                              //console.log('MATCH!')
                         } else {
                              setIsArraysMatch(false)
                              //console.log('False 1')
                         }
                    } else {
                         setIsArraysMatch(false)
                         //console.log('False 2')
                    }
               }
          }

     }, [previewImages])

     useEffect(() => {
          if(productToRemove) {

               var card = document.getElementById(productToRemove)
               card.setAttribute("style", "background-color: #e74c3c;")
          }

     }, [productToRemove])


    const onSubmit = async (e) => {
          e.preventDefault()

          if(!isEditing) {
               //INSERT
               const files = Array.from(images)
               console.log(files)
               var convertedImages = []
               
               for (var i=0; i<files.length; i++) {
                    var element = files[i]
                    var elementConverted = await Convert(element)
                    convertedImages.push(elementConverted)
               }
          
               if(convertedImages) {
                    console.log('Images converted')
                    //console.log(convertedImages)
               } else{
                    console.log('The file is not in format of image/jpeg or image/png')
               }
                 
               const newSubProduct = {
                    id: product._id,
                    token: user.token,
                    images: convertedImages,
                    size,
                    color,
                    countInStock
               }
     
               dispatch(createSubProduct(newSubProduct))
               clearForm()
          } else {
               //EDIT
               const editedSubProduct = {
                    id: product._id,
                    subid: subProductId,
                    token: user.token,
                    images: previewImages,
                    size,
                    color,
                    countInStock
               }
     
               dispatch(updateSubProduct(editedSubProduct))
               clearForm()
          }


     }

     const handleUploadFiles = (e) => {
          var fileArray = []
          var ObjImgs = (e.target.files)
          for (let i = 0; i < ObjImgs.length; i++) {
              fileArray.push(URL.createObjectURL(ObjImgs[i]))
          }

          setPreviewImages(fileArray)
     }

     const handleUploadFilesInEdit = async(e) => {
          
          const files = Array.from(e.target.files)
          console.log(files)
          var convertedImages = []
          
          
          for (var i=0; i<files.length; i++) {
               var element = files[i]
               var elementConverted = await Convert(element)
               convertedImages.push(elementConverted)
          }
     

          if(convertedImages) {
               console.log('Images converted')
               /*
               if(newImages) {
                    var accArray = Array.from(newImages)
                    convertedImages.map(item => accArray.push(item))
                    setNewImages(accArray)
               } else {
                    setNewImages(convertedImages)
               }
               */
          } else{
               console.log('The file is not in format of image/jpeg or image/png')
          }

          const finalArray = Array.from(previewImages)
          convertedImages.map(item => finalArray.push(item))
          setPreviewImages(finalArray)
     }

     const editProduct = (product) => {
          if(!user){
               navigate('/')
          } else {
               setIsEditing(true)
               setSubProductId(product._id)
               setImages(product.images)
               setPreviewImages(product.images)
               setColor(product.color)
               colorRef.current = product.color
               setSize(product.size)
               sizeRef.current = product.size
               setCountInStock(product.countInStock)
               stockRef.current = product.countInStock
               setOpenForm(true)
               
               //imagesRef.current = product.images
               //console.log(previewImages.every((v, i) => v === imagesRef[i]))
          }
     }

     const preDeleteProduct = (id) => {
          setProductToRemove(id)
          handleOpenModal()
     }

     const deleteHandler = (id) => {
          dispatch(deleteSubProduct(productToRemove))
          setProductToRemove('')
          handleCloseModal()
     }

     const clearForm = () => {
          setImages('')
          setPreviewImages('')
          setSize('')
          setColor('')
          setCountInStock('')
          console.log('Form Cleared');
     }

     //Drag, Drop and Sort Images
     const handleDragStart = (e) => {
          setDragId(e.currentTarget.id)
     }

     const handleDragOver = (e) => {
          e.preventDefault()
     }
     
     const handleDrop = async (e) => {
          e.preventDefault()
          var from = dragId
          var to = e.currentTarget.id
          console.log('From: ' + from)
          console.log('To: ' + to)
          
          
          var imagesData = previewImages.map(img => img);

          [imagesData[from], imagesData[to]] = [imagesData[to], imagesData[from]]
          setPreviewImages(imagesData)
     }

     const deleteImage = (i) => {
          var imagesData = previewImages.map(img => img)
          imagesData = imagesData.filter((img, index) => index !== i)
          setPreviewImages(imagesData)
     }

     //Modals
     const handleOpenModal = () => setOpenModal(true)

     const handleCloseModal = () => {
          setOpenModal(false)
          var card = document.getElementById(productToRemove)
          card.setAttribute("style", "background-color: none;")
     }

     return (
          <>

               <Modal show={openModal} onHide={handleCloseModal}>
                    <Modal.Header closeButton>
                    <Modal.Title>Attention</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Are you sure you want to delete this Product?</Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                         Close
                    </Button>
                    <Button variant="danger" onClick={() => deleteHandler()}>
                         Delete
                    </Button>
                    </Modal.Footer>
               </Modal>

          {message && <Message variant='danger'>{message}</Message>}
          {errorMsg && <Message variant='danger'>{errorMsg}</Message>}
          {successMessage && <Message variant='success'>{successMessage}</Message>}
          {isLoading && <Loader />}

          {(!isLoading && openForm) && (
               <Button type='button' className='my-4' onClick={() => {
                    setOpenForm(!openForm)
                    isEditing && setIsEditing(false)
               }}>
                    Volver a SubProductos
               </Button>
          )}


          {!isLoading && (
               
                         <ListGroup as='div' variant='flush' style={{justifyItems: 'center' , display: 'grid', margin: 'auto'}}>
                              <ListGroup.Item>
                                   <Row>
                                        <Col>
                                             <h3><strong>{product.name}</strong></h3>
                                             <h5><strong>Descripción:</strong></h5>
                                             <h5>{product.description}</h5>
                                             <h5><strong>Marca:</strong> {product.brand}</h5>
                                             <h5><strong>Categoría:</strong> {product.category}</h5>
                                             <h5><strong>Precio: </strong> {product.price}</h5>
                                        </Col>
                                        <Col className='mt-5'>
                                             <Image src={product.imageCover} style={{width: '200px', height: '200px'}} />
                                        </Col>

                                   </Row>
                              
                              </ListGroup.Item>
                         </ListGroup>
                    
          )}

          {(!isLoading && subProducts.length > 0 && !openForm) && (
               <>
                    <h3 className='text-center'><strong>SUB PRODUCTOS</strong></h3>
                    <CardGroup as='div'>
                         <Row xs={1} md={2} lg xl={4}>
                              {subProducts.map((product) => (<SubProduct key={product._id} product={product} editProduct={editProduct} preDeleteProduct={preDeleteProduct} />))} 
                         </Row>   
                    </CardGroup>    
                    
               </>
          )}

          {(!isLoading && !openForm) && (
               
               <Button size="lg" variant='success' className='mt-3 mb-3' style={{display: 'block',  margin: 'auto'}} onClick={() => setOpenForm(!openForm)}>
                    <i className='fas fa-plus'></i>Agregar 
               </Button>
          )}



          {(!isLoading && openForm && !isEditing) && <h2 className='text-center mt-3'>Agrega un Nuevo SubProducto</h2>}
          {(!isLoading && openForm && isEditing) && <h2 className='text-center mt-3'>Editar SubProducto</h2>}

          {((!isLoading && openForm)) && (
               <FormContainer>
                    <Form onSubmit={onSubmit}>
                         <Form.Group controlId='images' className="mb-2">
                              <Form.Label>Imágenes</Form.Label>
                              {!isEditing ? (
                                   <Form.Control type='file' multiple placeholder='Select the images to upload' onChange={(e) => {
                                        setImages(e.target.files)
                                        handleUploadFiles(e)
                                        }}>
                                   </Form.Control>

                              ): (
                                   <Form.Control type='file' multiple placeholder='This is Edit' onChange={(e) => handleUploadFilesInEdit(e)}></Form.Control>  
                              )}
                              {previewImages && previewImages.map((img, index) => (
                                   <div className='gallery' key={index}>
                                        <Image 
                                             id={index}                                        
                                             // style={{width: '140px', padding: '5px', marginBlockEnd: '1px'}} 
                                             src={img} alt="..." 
                                             draggable 
                                             onDragStart={(e) => handleDragStart(e)} 
                                             onDragOver={(e) => handleDragOver(e)} 
                                             onDrop={(e) => handleDrop(e)}
                                        />
                                        <div className='desc'>
                                             <div className='image-order'>
                                                  <i className='fas fa-trash' style={{cursor: 'pointer'}} onClick={() => deleteImage(index)}></i>
                                             </div>
                                        </div>
                                   </div>
                                   ))}
                              
                         </Form.Group>

                         <FormGroup className="mb-2">
                              <Form.Label>Color o Estilo</Form.Label>
                              <Form.Control type="text" placeholder='Ingrese un Color o Estilo' value={color} onChange={(e) => setColor(e.target.value)}></Form.Control>
                         </FormGroup> 

                         <FormGroup className="mb-2">
                              <Form.Label>Tamaño</Form.Label>
                              <Col md lg="6">
                                   <Form.Select aria-label="Default select example" value={size ? size : ''}  onChange={(e) => setSize(e.target.value)}>
                                        <option value="">Seleccione un Tamaño</option>
                                        <option value="xp">Extra Pequeño - xp</option>
                                        <option value="p">Pequeño - p</option>
                                        <option value="m">Mediano - M</option>
                                        <option value="G">Grande - G</option>
                                        <option value="XG">Extra Grande - XG</option>
                                        <option value="XXG">Extra Extra Grande - XXG</option>
                                   </Form.Select>    
                              </Col>
                         </FormGroup>
                                                
                                                 
                         <Form.Group controlId='countInStock' className="mb-2">
                              <Form.Label>Stock</Form.Label>
                              <Col md lg="4">
                                   <Form.Control type='number' placeholder='Ingrese la cantidad existente' value={countInStock} onChange={(e) => setCountInStock(e.target.value)}></Form.Control>
                              </Col>
                         </Form.Group>
                         
                         {(openForm && !isEditing) && (
                              <div className="d-grid gap-2">
                                   <Button className='mt-3' type='submit' variant='primary' disabled={images.length === 0 || !size || !color || Number(countInStock) === 0}>CREAR</Button>
                              </div>
                         )}

                         {(openForm && isEditing) && (
                              <div className="d-grid gap-2">
                                   <Button className='mt-3' type='submit' variant='info' disabled={(isArraysMatch && color === colorRef.current && size === sizeRef.current && Number(countInStock) === stockRef.current) || !color || !size || Number(countInStock) === 0}>EDITAR</Button>
                              </div>
                         )}

                    </Form>
               </FormContainer>
          )}
     </>
     )
}

export default SubProductManage