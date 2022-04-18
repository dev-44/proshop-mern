import React, {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import {Table, Button, Modal, Row, Col, Card} from 'react-bootstrap'
import {useDispatch, useSelector} from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { getOrders, resetMessage} from '../features/admins/adminSlice'

const OrderList = () => {

    const [openModal, setOpenModal] = useState(false)
    const [productToRemove, setProductToRemove] = useState('')
    const [successMessage, setSuccessMessage] = useState('')

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const {user} = useSelector(state => state.user)
    const {orders, isLoading, isError, message} = useSelector(state => state.admin)

    useEffect(() => {
        //dispatch(reset())
        if ((!user && !user.isAdmin) ) {
            navigate('/')
        } else {
            dispatch(getOrders())
        }
        // eslint-disable-next-line
    },[])

    useEffect(() => {

        if(isError) {
            setTimeout(() => dispatch(resetMessage()), 5000)
        }

    }, [dispatch, isError])


  return (
    <>
        <Row className='align-items-center'>
            <Col>
                <h1>Orders</h1>
            </Col>
        </Row>

        {(successMessage) && <Message variant='success'>{successMessage}</Message>}
        {(isError && message) && <Message variant='danger'>{message}</Message>}

        {isLoading  ? <Loader /> : (
            <Table striped bordered hover responsive className='table-sm'>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>USER</th>
                        <th>DATE</th>
                        <th>TOTAL</th>
                        <th>PAID</th>
                        <th>DELIVERED</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order._id}>
                            <td>{order._id}</td>
                            <td>{order.user && order.user.name}</td>
                            <td>{order.createdAt.substring(0,10)}</td>
                            <td>$ {order.totalPrice}</td>
                            <td>{order.isPaid ? 
                            (order.paidAt.substring(0,10)
                            ) : (<i className='fas fa-times' style={{color: 'red'}}/> )}</td>

                            <td>{order.isDelivered ? 
                            (order.deliveredAt.substring(0,10)) : 
                            (<i className='fas fa-times' style={{color: 'red'}}/> )}</td>

                            <td>
                                <LinkContainer to={`/order/${order._id}`}>
                                    <Button variant='light' className='btn-sm'>
                                        Details
                                    </Button>
                                </LinkContainer>
                                
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        )}
    </>
  )
}

export default OrderList