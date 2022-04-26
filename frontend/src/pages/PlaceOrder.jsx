import React, {useEffect} from 'react'
import {useNavigate, Link} from 'react-router-dom'

//Design
import {Button, Row, Col, ListGroup, Image, Card} from 'react-bootstrap'

//Components
import Message from '../components/Message'
import CheckoutSteps from '../components/CheckoutSteps'

//Redux
import {useDispatch, useSelector} from 'react-redux'
import { createOrder, resetIsPlaced } from '../features/orders/orderSlice'
import { clearCart} from '../features/cart/cartSlice'

const PlaceOrder = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    //Cart
    const {cart, shippingAddress, paymentMethod} = useSelector(state => state.cart)
    const {order, isSuccess, isError, message, isPlaced} = useSelector(state => state.order)
    

    useEffect(() => {

        if(!shippingAddress) {
            navigate('/shipping')
        }
        
        if(isPlaced) {
            setTimeout(() => dispatch(clearCart()), 2000)
            setTimeout(() => dispatch(resetIsPlaced()), 2000)
            navigate(`/order/${order._id}`)
        }
        
        //eslint-disable-next-line
    },[navigate, isSuccess, isPlaced, order])

    //Calculate Prices
    const addDecimals = (num) => {
        return (Math.round(num * 100) / 100).toFixed(2)
    }

    let itemsPrice = addDecimals(cart.reduce((acc, item) => acc + item.price * item.qty, 0))
    let shippingPrice = itemsPrice > 100 ? 10 : 0
    let taxPrice = addDecimals(Number(0.15 * itemsPrice))
    let totalPrice = addDecimals(Number(itemsPrice) + Number(shippingPrice) + Number(taxPrice))

    const placeOrderHandler = () => {

        const newOrder = {
            orderItems: cart,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            shippingPrice,
            taxPrice,
            totalPrice
        }

        dispatch(createOrder(newOrder))
    }

  return (
    <>
        <CheckoutSteps step1 step2 step3 step4/>
        <Row>
            <Col md={8}>
                <ListGroup variant='flush'>

                    <ListGroup.Item>
                        <h2>SHIPPING</h2>
                        <p>
                            <strong>Address: </strong>
                            {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.postalCode}, {shippingAddress.country}
                        </p>
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <h2>PAYMENT METHOD</h2>
                        <p>
                            <strong>Method: </strong>
                            {paymentMethod}
                        </p>
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <h2>ORDER ITEMS</h2>
                        {cart.length === 0 ? <Message>Your Cart is Empty</Message> : (
                            <ListGroup variant='flush'>
                                {cart.map((item, index) => (
                                    <ListGroup.Item key={index}>
                                        <Row>
                                            <Col md={1}>
                                                 <Image src={item.images[0]} alt={item.name} fluid rounded />
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
                        
                        {isError && (
                            <ListGroup.Item>
                                <Message variant='danger'>{message}</Message>
                            </ListGroup.Item>
                        )}

                        <ListGroup.Item>
                            <Button type='button' className='btn btn-block' disabled={cart.lenght === 0} onClick={placeOrderHandler}>Place Order</Button>
                        </ListGroup.Item>
                    </ListGroup>
                </Card>
            </Col>
        </Row>
    </>
  )
}

export default PlaceOrder