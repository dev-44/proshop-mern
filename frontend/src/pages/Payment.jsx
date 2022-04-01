import {useState} from 'react'
import {useNavigate, Link} from 'react-router-dom'
import {Form, Button, Col} from 'react-bootstrap'
import FormContainer from '../components/FormContainer'
import CheckoutSteps from '../components/CheckoutSteps'

import {useDispatch, useSelector} from 'react-redux'
import { savePaymentMethod } from '../features/cart/cartSlice'

const Payment = () => {
    const [address, setAddress] = useState('')
    const [city, setCity] = useState('')
    const [postalCode, setPostalCode] = useState('')
    const [country, setCountry] = useState('')

    const {user} = useSelector(state => state.user)
    const {cart, shippingAddress} = useSelector((state) => state.cart)

    const onSubmit = (e) => {
        e.preventDefault()
    }

  return (
      <>
            {/*Conditional*/}
            <FormContainer>
                <CheckoutSteps step1 step2 />
                <h1>SHIPPING</h1>
                <Form onSubmit={onSubmit}>

                    <Form.Group controlId='address'>
                        <Form.Label>Address</Form.Label>
                        <Form.Control type='text' placeholder='Enter Address' value={address} onChange={(e) => setAddress(e.target.value)} required></Form.Control>
                    </Form.Group>

                    <Form.Group controlId='city'>
                        <Form.Label>City</Form.Label>
                        <Form.Control type='text' placeholder='Enter City' value={city} onChange={(e) => setCity(e.target.value)} required></Form.Control>
                    </Form.Group>

                    <Form.Group controlId='postalCode'>
                        <Form.Label>Postal Code</Form.Label>
                        <Form.Control type='text' placeholder='Enter Postal Code' value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required></Form.Control>
                    </Form.Group>

                    <Form.Group controlId='country'>
                        <Form.Label>Country</Form.Label>
                        <Form.Control type='text' placeholder='Enter Country' value={country} onChange={(e) => setCountry(e.target.name)} required></Form.Control>
                    </Form.Group>
                    
                    <Button type='submit' variant='primary' className='mt-3'>CONTINUE</Button>
                </Form>
        </FormContainer>

      </>
  )
}

export default Payment