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

    let itemsPrice = cart.reduce((acc, item) => acc + item.price * item.qty, 0)
    let shippingPrice = itemsPrice < 100000 ? 10000 : 0
    let taxPrice = Number(0.1 * itemsPrice)
    let totalPrice = Number(itemsPrice) + Number(shippingPrice)

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
                        <h2>DIRECCIÓN DE ENVÍO</h2>
                        <p>
                            <strong>Dirección: </strong>
                            {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.postalCode}, {shippingAddress.country}
                        </p>
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <h2>MÉTODO DE PAGO</h2>
                        <p>
                            <strong>Método: </strong>
                            {paymentMethod}
                        </p>
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <h2>ORDEN</h2>
                        {cart.length === 0 ? <Message>Your Cart is Empty</Message> : (
                            <ListGroup variant='flush'>
                                {cart.map((item, index) => (
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
                                                {item.qty} x Gs.{item.price.toLocaleString('es-CO')} = Gs.{(item.qty * item.price).toLocaleString('es-CO')}
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
                            <h2>Resumen</h2>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Row>
                                <Col>Items</Col>
                                <Col>Gs. {itemsPrice.toLocaleString('es-CO')}</Col>
                            </Row>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Row>
                                <Col>Delivery</Col>
                                <Col>Gs. {shippingPrice.toLocaleString('es-CO')}</Col>
                            </Row> 
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Row>
                                <Col>IVA</Col>
                                <Col>Gs. {taxPrice.toLocaleString('es-CO')}</Col>
                            </Row>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Row>
                                <Col><strong>TOTAL</strong></Col>
                                <Col>Gs. <strong>{totalPrice.toLocaleString('es-CO')}</strong></Col>
                            </Row>
                        </ListGroup.Item>
                        
                        {isError && (
                            <ListGroup.Item>
                                <Message variant='danger'>{message}</Message>
                            </ListGroup.Item>
                        )}

                        <ListGroup.Item>
                            <div className="d-grid gap-2">
                                <Button type='button' className='btn btn-block' disabled={cart.lenght === 0} onClick={placeOrderHandler}>CONFIRMAR</Button>
                            </div>
                        </ListGroup.Item>
                    </ListGroup>
                </Card>
            </Col>
        </Row>
    </>
  )
}

export default PlaceOrder