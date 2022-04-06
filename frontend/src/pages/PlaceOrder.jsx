import {useState} from 'react'
import {useNavigate, Link} from 'react-router-dom'
import {Button, Row, Col, ListGroup, Image, Card} from 'react-bootstrap'
import Message from '../components/Message'
import CheckoutSteps from '../components/CheckoutSteps'

import {useDispatch, useSelector} from 'react-redux'


const PlaceOrder = () => {

    const {shippingAddress, paymentMethod} = useSelector(state => state.cart)

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

                </ListGroup>
            </Col>
        </Row>
    </>
  )
}

export default PlaceOrder