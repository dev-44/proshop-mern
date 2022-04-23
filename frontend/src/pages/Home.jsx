import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'
import { Row, Col, Modal, Button } from "react-bootstrap"
import Product from '../components/Product'   //Component
import Loader from '../components/Loader'
import Message from '../components/Message'
import Paginate from '../components/Paginate'
import ProductCarousel from '../components/ProductCarousel'
import Meta from '../components/Meta'

import { resetLoggedSuccess } from '../features/users/userSlice'
import { getProducts, getTopProducts, deleteProduct, resetCrud} from '../features/products/productSlice'

const Home = () => {

  const [openModal, setOpenModal] = useState(false)
  const [productToRemove, setProductToRemove] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const dispatch = useDispatch()
  const {user, isLoggedSuccess} = useSelector(state => state.user)
  const {products, isLoading, isError, message, isSuccess, page, pages, pageSize, isLoaded, isDeleted} = useSelector((state) => state.product)

  const navigate = useNavigate()
  const params = useParams()
  const keyword = params.keyword
  var pageNumber = params.pageNumber || 1
  
  //const [products, setProducts] = useState([])

  useEffect (() => {

    if(isLoggedSuccess && isLoaded){
      setSuccessMessage(`Welcome ${user.name}`)
      setTimeout(() => {dispatch(resetLoggedSuccess())}, 5000)
      setTimeout(() => {setSuccessMessage('')}, 8000)
    }

    if(isDeleted) {
      setSuccessMessage('Product deleted with success')
      setTimeout(() => setSuccessMessage(''), 5000)
      dispatch(getProducts({keyword, pages}))
    }

    if(isDeleted & isLoaded) {
      console.log('Pages:' + pages)
      if (pages === 1) {
        console.log('Call to /')
        navigate('/')
      } else {
        navigate(`/page/${pages}`)
      }
      setTimeout(() => {dispatch(resetCrud())}, 1000)
    }

    
    /*
    return () => {              //Clear/Unmount.Return a function
        if(isSuccess) {
            dispatch(reset())
        }
    }
    */
   
}, [dispatch, isSuccess, isLoggedSuccess, isLoaded, isDeleted])


  useEffect(() => {

    /* MOVE TO REDUX
    const fetchProducts = async() => {
      const { data } = await axios.get('/api/products')
      setProducts(data)
    }

    fetchProducts()
    */

    dispatch(getTopProducts())
    //dispatch(getProducts({keyword, pageNumber}))
    dispatch(getProducts())
    setTimeout(() => {dispatch(resetCrud())}, 2000)

  }, [])
  

  if(isLoading) {
    return <Loader />
  }


  if(isError){
    return <Message variant='danger'>{message}</Message>
  }

  const preDeleteProduct = (id) => {
    setProductToRemove(id)
    handleOpenModal()
  }

  const deleteHandler = () => {
    dispatch(deleteProduct(productToRemove))
    setProductToRemove('')
    handleCloseModal()
  }

  //Modals
  const handleOpenModal = () => setOpenModal(true)
  const handleCloseModal = () => setOpenModal(false)

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

    <Meta />
      {successMessage && <Message variant='success'>{successMessage}</Message>}
      {!params.keyword ? <ProductCarousel /> : <Link to='/' className='btn btn-light'>Go Back</Link>}
      <h1>LATEST PRODUCTS</h1>
        <Row>
            {products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                    <Product product={product} preDeleteProduct={preDeleteProduct}/>             
              </Col> 
            ))}
        </Row>
        <Paginate pages={pages} page={page} keyword={keyword ? keyword : ''}/>
    </>
  )
}

export default Home