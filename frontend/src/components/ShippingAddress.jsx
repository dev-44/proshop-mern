import { Link } from 'react-router-dom'
import { Card, Form, Button, Row, Col } from 'react-bootstrap'

const ShippingAddress = ({address}) => {
         
  return (
    <>
        <Form>
          <div key={address._id}>
            <div id='address'>Address: {address.address}</div>
            <div id='city'>City: {address.city}</div>
            <div id='postalCode'>Postal Code: {address.postalCode}</div>
            <div id='country'>Country: {address.country}</div>

          </div>
        </Form>
    </>
  )
}

export default ShippingAddress