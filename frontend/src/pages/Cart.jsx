import { useEffect } from 'react'
import {useDispatch, useSelector} from 'react-redux'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { Row, Col, ListGroup, Image, Form, Button, Card } from 'react-bootstrap'
import { addItem } from '../features/cart/cartSlice'
import Loader from '../components/Loader'
import Message from '../components/Message'

const Cart = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const dispatch = useDispatch()
  const {cartItems, isLoading, isError, message} = useSelector((state) => state.cart)

  const {id} = useParams()
  const qty = searchParams.get('qty')


  useEffect(() => {
      const itemData = {id, qty}
      if(id) {
          dispatch(addItem(itemData))
      }
  }, [dispatch, id, qty])

  const removeItemHandler = (id) => {
    console.log('remove');
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
            {cartItems.length === 0 ? <Message>Your cart is empty <Link to='/'>Go Back</Link></Message> : (
                <ListGroup variant='flush'>
                    {cartItems.map((item) => (
                        <ListGroup.Item key={item.product}>
                            <Row>
                                <Col md={2}>
                                    <Image src={item.image} alt={item.name} fluid rounded />
                                </Col>
                                <Col md={3}>
                                    <Link to={`/product/${item.product}`}>{item.name}</Link>
                                </Col>
                                <Col md={2}>
                                    ${item.price}
                                </Col>
                                <Col md={2}>
                                    <Form.Control as='select'  className='form-select' value={item.qty} onChange={(e) => dispatch(item.product, Number(e.target.value))}>
                                        {[...Array(item.countInStock).keys()].map((x => (
                                            <option key={x + 1} value={x + 1}>{x + 1}</option>
                                        )))}
                                    </Form.Control>
                                </Col>
                                <Col md={2}>
                                    <Button type='button' variant='light' onClick={() => removeItemHandler(item.product)}>
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
                </Card>                                    
        </Col>
    </Row>
  )
}

export default Cart