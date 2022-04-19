import React, {useState, useEffect} from 'react'
import {useNavigate, useParams, Link} from 'react-router-dom'
import axios from 'axios'

import {Button, Row, Col, ListGroup, Image, Card} from 'react-bootstrap'
import {PayPalButton} from 'react-paypal-button-v2'
import Message from '../components/Message'
import Loader from '../components/Loader'

import {useDispatch, useSelector} from 'react-redux'
import { getOrder, payOrder, reset as resetOrder, deliverOrder} from '../features/orders/orderSlice'

const Order = () => {

    const [sdkReady, setSdkReady] = useState(false)

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const orderId = useParams().id
    console.log('orderId: ' + orderId)

    const {user} = useSelector(state => state.user)
    const {isLoading: isLoadingDeliver} = useSelector(state => state.admin)
    const {order, isLoading, isSuccess, isError, message, isPaid, isLoadingPay, isDelivered} = useSelector(state => state.order)
    const {orderItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice} = order

    useEffect(() => {
        dispatch(resetOrder())
        // eslint-disable-next-line
    }, [])
    
    useEffect(() => {

        //Adding the script dinamically
        const addPayPalScript = async () => {
            const {data:clientId} = await axios.get('/api/config/paypal')
            const script = document.createElement('script')
            script.type = 'text/javascript'
            script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`
            script.async = true
            script.onload = () => {
                setSdkReady(true)
            }

            document.body.appendChild(script)
        }

        if(Object.keys(order).length === 0 || isPaid || isDelivered){
            dispatch(resetOrder())
            dispatch(getOrder(orderId))
        } else if (!order.isPaid) {
            if(!window.paypal) {
                addPayPalScript()
            } else {
                setSdkReady(true)
            }
        }
    },[dispatch, orderId, isPaid, order, isDelivered])

    //Calculate Prices
    const addDecimals = (num) => {
        return (Math.round(num * 100) / 100).toFixed(2)
    }

    const successPaymentHandler = (paymentResult) => {
        console.log(paymentResult)
        dispatch(payOrder(paymentResult))
    }

    const deliverHandler = () => {
        dispatch(deliverOrder(order._id))
    }


  return isLoading ? <Loader /> : isError ? <Message variant='danger'>{message}</Message> : isSuccess &&
  <>
    {user.isAdmin ? (
        <Link to='/admin/orderlist' className='btn btn-light my-3'>
            Go Back
        </Link>
    ) : (
        <Link to='/orders' className='btn btn-light my-3'>
            Go Back
        </Link>
    )}

    
    <h1>ORDER {order._id.toUpperCase()}</h1>
    <Row>
            <Col md={8}>
                <ListGroup variant='flush'>

                    <ListGroup.Item>
                        <h2>SHIPPING</h2>
                        <p><strong>Name: </strong>{order.user.name}</p>
                        <p><strong>Email: </strong>{' '}
                        <a href={`mailto:${order.user.email}`}>{order.user.email}</a></p>
                        <p>
                            <strong>Address: </strong>
                            {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.postalCode}, {shippingAddress.country}
                        </p>
                        {order.isDelivered ? <Message variant='success'>Delivered on {order.deliveredAt}</Message> : <Message variant='danger'>Not Delivered</Message>}
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <h2>PAYMENT METHOD</h2>
                        <p>
                            <strong>Method: </strong>
                            {paymentMethod}
                        </p>
                        {order.isPaid ? <Message variant='success'>Paid on {order.paidAt}</Message> : <Message variant='danger'>Not Paid</Message>}
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <h2>ORDER ITEMS</h2>
                        {orderItems.length === 0 ? <Message>Order is Empty</Message> : (
                            <ListGroup variant='flush'>
                                {orderItems.map((item, index) => (
                                    <ListGroup.Item key={index}>
                                        <Row>
                                            <Col md={1}>
                                                 <Image src={item.image} alt={item.name} fluid rounded />
                                            </Col>
                                            <Col>
                                                <Link to={`/product/${item.product}`}>
                                                    {item.name}
                                                </Link>
                                            </Col>
                                            <Col md={4}>
                                                {item.qty} x ${item.price} = ${addDecimals(item.qty * item.price)}
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        )}
                    </ListGroup.Item>

                </ListGroup>
            </Col>

            <Col md={4}>
                <Card>
                    <ListGroup variant='flush'>

                        <ListGroup.Item>
                            <h2>Order Summary</h2>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Row>
                                <Col>Items</Col>
                                <Col>$ {itemsPrice}</Col>
                            </Row>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Row>
                                <Col>Shipping</Col>
                                <Col>$ {shippingPrice}</Col>
                            </Row> 
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Row>
                                <Col>Tax</Col>
                                <Col>$ {taxPrice}</Col>
                            </Row>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Row>
                                <Col>TOTAL</Col>
                                <Col>$ {totalPrice}</Col>
                            </Row>
                        </ListGroup.Item>
                        {(!order.isPaid  && !user.isAdmin) && (
                            <ListGroup.Item>
                                {isLoadingPay && <Loader />}
                                {!sdkReady ? <Loader /> : (
                                    <PayPalButton amount={totalPrice} onSuccess={successPaymentHandler}/>
                                )}
                            </ListGroup.Item>
                        )}

                        {isLoadingDeliver && <Loader />}
                        {(user && user.isAdmin && order.isPaid && !order.isDelivered) && (
                            <ListGroup.Item>
                                <Button type='button' className='btn btn-block' onClick={deliverHandler}>
                                    Mark as Delivered
                                </Button>
                            </ListGroup.Item>
                        )} 
                            
                        
                    </ListGroup>
                </Card>
            </Col>
        </Row>
  </>
}

export default Order