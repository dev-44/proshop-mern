import React, {useEffect, useState} from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import {Table, Button, Modal, Row, Col, Card} from 'react-bootstrap'
import {useDispatch, useSelector} from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Paginate from '../components/Paginate'
import { getProducts, deleteProduct, resetDeleted, resetMessage, getProductDetails, resetError, resetCrud} from '../features/products/productSlice'

const ProductList = () => {

    const [openModal, setOpenModal] = useState(false)
    const [productToRemove, setProductToRemove] = useState('')
    const [successMessage, setSuccessMessage] = useState('')

    const dispatch = useDispatch()
    const navigate = useNavigate()
    
    const params = useParams()
    const pageNumber = params.pageNumber || 1

    const {user} = useSelector(state => state.user)
    const {products, isLoading, isSuccess, isError, message, isDeleted, isCreated, isUpdated, page, pages, isLoaded} = useSelector(state => state.product)

    useEffect(() => {

        if ((!user && !user.isAdmin) ) {
            navigate('/')
        } 
        // eslint-disable-next-line
    },[])

    useEffect(() => {
        var keyword = ''

        if(params.pageNumber) {
            console.log('Call 1');
            dispatch(getProducts({keyword, pageNumber}))
        }
    }, [params.pageNumber])

    useEffect(() => {

        var keyword = ''

        if(isError) {
            setTimeout(() => dispatch(resetError()), 5000)
        }

        if(isCreated && isLoaded) {
            setSuccessMessage('Product created with success')
            setTimeout(() => setSuccessMessage(''), 5000)
            dispatch(resetCrud())
            console.log('Call 2');
            dispatch(getProducts({keyword, pageNumber}))
        }

        if(isUpdated && isLoaded) {
            setSuccessMessage('Product Updated with success')
            setTimeout(() => setSuccessMessage(''), 5000)
            dispatch(resetCrud())
            console.log('Call 3');
            dispatch(getProducts({keyword, pageNumber}))
        }
        
        if(isDeleted && isLoaded) {
            setSuccessMessage('Product deleted with success')
            setTimeout(() => setSuccessMessage(''), 5000)
            dispatch(resetCrud())
            console.log('Call 4');
            dispatch(getProducts({keyword, pageNumber}))
        }


    }, [dispatch, isDeleted, isError, isCreated, isUpdated, isLoaded])

    const createProductHandler = () => {
        navigate('/admin/product/create')
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

    const editProduct = (id) => {
        dispatch(resetError())
        dispatch(getProductDetails(id))
        navigate(`/admin/product/${id}`)
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
            <Modal.Body>Are you sure you want to delete this User?</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModal}>
                    Close
                </Button>
                <Button variant="danger" onClick={() => deleteHandler()}>
                    Delete
                </Button>
            </Modal.Footer>
        </Modal>

        <Row className=''>
            <Col>
                <h1>Products</h1>
            </Col>


            <Col className='ms-auto'>
                <Button className='my-3' onClick={createProductHandler}>
                    <i className='fas fa-plus'></i> Create Product 
                </Button>
            </Col>
        </Row>



        {isLoading  ? <Loader /> : (
            <>
            {(successMessage) && <Message variant='success'>{successMessage}</Message>}
            {(isError && message) && <Message variant='danger'>{message}</Message>}
            <Table striped bordered hover responsive className='table-sm'>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>PRICE</th>
                        <th>CATEGORY</th>
                        <th>BRAND</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product._id}>
                            <td>{product._id}</td>
                            <td>{product.name}</td>
                            <td>$ {product.price}</td>
                            <td>{product.category}</td>
                            <td>{product.brand}</td>
                            <td>
                
                                <Button variant='light' className='btn-sm' onClick={()=> editProduct(product._id)}>
                                    <i className='fas fa-edit'></i>
                                </Button>
                                
                                
                                <Button variant='danger' className='btn-sm' onClick={()=>preDeleteProduct(product._id)}>
                                    <i className='fas fa-trash'></i>
                                </Button>

                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Paginate pages={pages} page={page} isAdmin={true}/>
            </>
        )}
    </>
  )
}

export default ProductList