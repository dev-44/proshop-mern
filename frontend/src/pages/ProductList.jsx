import {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import {Table, Button, Modal, Row, Col} from 'react-bootstrap'
import {useDispatch, useSelector} from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { getProducts, deleteProduct, resetDeleted, resetMessage} from '../features/products/productSlice'

const ProductList = () => {

    const [openModal, setOpenModal] = useState(false)
    const [productToRemove, setProductToRemove] = useState('')
    const [successMessage, setSuccessMessage] = useState('')

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const {user} = useSelector(state => state.user)
    const {products, isLoading, isSuccess, isError, message, isDeleted} = useSelector(state => state.product)

    useEffect(() => {
        if ((user && user.isAdmin) ) {
            dispatch(getProducts())
        } else {
            navigate('/')
        }
        // eslint-disable-next-line
    },[])

    useEffect(() => {
        if(isDeleted) {
            dispatch(getProducts())
            setSuccessMessage('Product deleted with success')
            setTimeout(() => setSuccessMessage(''), 5000)
            dispatch(resetDeleted())
        }

        if(isError) {
            setTimeout(() => dispatch(resetMessage()), 5000)
        }

    }, [dispatch, isDeleted, isError])

    const createProductHandler = () => {

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

        <Row className='align-items-center'>
            <Col>
                <h1>Products</h1>
            </Col>

            <Col className='text-right'>
                <Button className='my-3' onClick={createProductHandler}>
                    <i className='fas fa-plus'></i> Create Product 
                </Button>
            </Col>
        </Row>

        {(successMessage) && <Message variant='success'>{successMessage}</Message>}
        {(isError && message) && <Message variant='danger'>{message}</Message>}

        {isLoading  ? <Loader /> : (
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
                                <LinkContainer to={`/admin/product/${product._id}`}>
                                    <Button variant='light' className='btn-sm'>
                                        <i className='fas fa-edit'></i>
                                    </Button>
                                </LinkContainer>
                                
                                <Button variant='danger' className='btn-sm' onClick={()=>preDeleteProduct(product._id)}>
                                    <i className='fas fa-trash'></i>
                                </Button>

                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        )}
    </>
  )
}

export default ProductList