import React from 'react'
import {useDispatch, useSelector} from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { Row, Col, ListGroup, Image, Form, Button, Card } from 'react-bootstrap'
import { changeQty, removeItem } from '../features/cart/cartSlice'
import Loader from '../components/Loader'
import Message from '../components/Message'

const Cart = () => {
    const dispatch = useDispatch()
    const {cart, isLoading, isError, message} = useSelector((state) => state.cart)
    const navigate = useNavigate()
    
    //const {id} = useParams()
    //const [searchParams, setSearchParams] = useSearchParams()
    //const qty = searchParams.get('qty')

/*
  useEffect(() => {
      const itemData = {id, qty}
      if(id) {
          dispatch(addItem(itemData))
      }
  }, [dispatch, id, qty])
  */

  const removeItemHandler = (id) => {
    dispatch(removeItem(id))
  }

  const checkoutHandler = () => {
      console.log('Checkout')
      navigate('/login?redirect=/shipping')
  }

  if(isLoading) {
    return <Loader />
  }


  if(isError){
    return <Message variant='danger'>{message}</Message>
  }

  return (
    <Row>
        <Col md={8}>
            <h1>Shopping Cart</h1>
            {cart.length === 0 ? <Message>Your cart is empty <Link to='/'>Go Back</Link></Message> : (
                <ListGroup variant='flush'>
                    {cart.map((item) => (
                        <ListGroup.Item key={item.id}>
                            <Row>
                                <Col md={2}>
                                    <Image src={item.image} alt={item.name} fluid rounded />
                                </Col>
                                <Col md={3}>
                                    <Link to={`/product/${item.id}`}>{item.name}</Link>
                                </Col>
                                <Col md={2}>
                                    ${item.price}
                                </Col>
                                <Col md={2}>
                                    <Form.Control as='select'  className='form-select' value={item.qty} onChange={(e) => {
                                        let itemData = {
                                            id: item.id,
                                            qty: Number(e.target.value)
                                        }
                                        dispatch(changeQty(itemData))
                                    }}>
                                        {[...Array(item.countInStock).keys()].map((x => (
                                            <option key={x + 1} value={x + 1}>{x + 1}</option>
                                        )))}
                                    </Form.Control>
                                </Col>
                                <Col md={2}>
                                    <Button type='button' variant='light' onClick={() => removeItemHandler(item.id)}>
                                        <i className='fas fa-trash'></i>
                                    </Button>
                                </Col>
                            </Row>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            )}
        </Col>
        <Col md={4}>
            <Card>
                <ListGroup variant='flush'>
                    <ListGroup.Item>
                        <h3>Subtotal ({cart.reduce((acc, cur) => acc + Number(cur.qty), 0)}) items</h3>
                        ${cart.reduce((acc, cur) => acc + cur.qty * cur.price, 0).toFixed(2)}
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <Button type='button' className='btn-block' disabled={cart.length === 0} onClick={checkoutHandler}>
                            Proceed to Checkout
                        </Button>
                    </ListGroup.Item>
                </ListGroup>
            </Card>                                    
        </Col>
    </Row>
  )
}

export default Cart