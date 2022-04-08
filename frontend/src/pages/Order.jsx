import {useState, useEffect} from 'react'
import {useNavigate, useParams, Link} from 'react-router-dom'
import axios from 'axios'

import {Button, Row, Col, ListGroup, Image, Card} from 'react-bootstrap'
import Message from '../components/Message'
import Loader from '../components/Loader'

import {useDispatch, useSelector} from 'react-redux'
import { getOrder } from '../features/orders/orderSlice'

const Order = () => {

    const [sdkReady, setSdkReady] = useState(false)

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const params = useParams()

    console.log(params.id)

    const {order, isLoading, isSuccess, isError, message, isPaid} = useSelector(state => state.order)
    const {orderItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice} = order
    
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

        addPayPalScript()

        dispatch(getOrder(params.id))
    },[])

    //Calculate Prices
    const addDecimals = (num) => {
        return (Math.round(num * 100) / 100).toFixed(2)
    }


  return isLoading ? <Loader /> : isError ? <Message variant='danger'>{message}</Message> : isSuccess &&
  <>
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
                        {order.isPaid ? <Message variant='success'>Paid on {order.payAt}</Message> : <Message variant='danger'>Not Paid</Message>}
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

                    </ListGroup>
                </Card>
            </Col>
        </Row>
  </>
}

export default Order