import React, {useEffect, useState} from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import {Table, Button, Modal, Row, Col, Card} from 'react-bootstrap'
import {useDispatch, useSelector} from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Paginate from '../components/Paginate'
import { getProducts, deleteProduct, getProductDetails, resetError, resetCrud} from '../features/products/productSlice'

const ProductList = () => {

    const [openModal, setOpenModal] = useState(false)
    const [productToRemove, setProductToRemove] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    const [focus, setFocus] = useState('')

    const dispatch = useDispatch()
    const navigate = useNavigate()
    
    const params = useParams()
    const pageNumber = params.pageNumber || 1


    const {user} = useSelector(state => state.user)
    const {products, isLoading, isSuccess, isError, message, isDeleted, isCreated, isUpdated, page, pages, isLoaded, product} = useSelector(state => state.product)

    useEffect(() => {

        if ((!user && !user.isAdmin) ) {
            navigate('/')
        }

        var keyword = ''
        console.log('Call on Load');
        dispatch(getProducts({keyword, pageNumber}))
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

        if(isUpdated) {
            setFocus(product._id)
            setTimeout(() => setFocus(''), 7000)
            //dispatch(getProducts({keyword, pageNumber}))
            if(isLoaded) {
                setSuccessMessage('Product Updated with success')
                setTimeout(() => setSuccessMessage(''), 5000)
                dispatch(resetCrud())
            }
            
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
        navigate(`/admin/product/${id}?redirect=productlist&page=${pageNumber}`)
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
                    {products.map((item) => (
                        <tr key={item._id} style={{backgroundColor: focus === item._id ? '#18bc9c' : ''}}>
                            <td>{item._id}</td>
                            <td>{item.name}</td>
                            <td>$ {item.price}</td>
                            <td>{item.category}</td>
                            <td>{item.brand}</td>
                            <td>
                
                                <Button variant='light' className='btn-sm' onClick={()=> editProduct(item._id)}>
                                    <i className='fas fa-edit'></i>
                                </Button>
                                
                                
                                <Button variant='danger' className='btn-sm' onClick={()=>preDeleteProduct(item._id)}>
                                    <i className='fas fa-trash'></i>
                                </Button>

                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Paginate pages={pages} page={page} isAdmin={true}/>
            {(successMessage) && <Message variant='success'>{successMessage}</Message>}
            {(isError && message) && <Message variant='danger'>{message}</Message>}
            </>
        )}
    </>
  )
}

export default ProductList