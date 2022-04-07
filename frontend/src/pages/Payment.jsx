import {useState} from 'react'
import {useNavigate, Link} from 'react-router-dom'
import {Form, Button, Col} from 'react-bootstrap'
import FormContainer from '../components/FormContainer'
import CheckoutSteps from '../components/CheckoutSteps'

import {useDispatch, useSelector} from 'react-redux'
import { savePaymentMethod } from '../features/cart/cartSlice'

const Payment = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [paymentMethod, setPaymentMethod] = useState('Paypal')

    const {user} = useSelector(state => state.user)
    const {cart, shippingAddress} = useSelector((state) => state.cart)

    if(!shippingAddress) {
        navigate('/shipping')
    }

    const onSubmit = (e) => {
        e.preventDefault()
        dispatch(savePaymentMethod(paymentMethod))
        navigate('/placeorder')
    }

  return (
      <>
            {/*Conditional*/}
            <FormContainer>
                <CheckoutSteps step1 step2 step3/>
                <h1>PAYMENT METHOD</h1>
                <Form onSubmit={onSubmit}>
                    <Form.Group>
                        <Form.Label as='legend'>Select Method</Form.Label>
                    
                        <Col>
                            <Form.Check type='radio' label='PayPal' id='paypal' name='paymentMethod' value='PayPal' checked onChange={(e) => setPaymentMethod(e.target.value)} />
                            {/* <Form.Check type='radio' label='Stripe' id='stripe' name='paymentMethod' value='Stripe' onChange={(e) => setPaymentMethod(e.target.value)} /> */}
                        </Col>
                    </Form.Group>
                    <Button type='submit' variant='primary' className='mt-3'>CONTINUE</Button>
                </Form>
        </FormContainer>

      </>
  )
}

export default Payment