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

  const removeItemHandler = (subid) => {
    dispatch(removeItem(subid))
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
            <h1>Carrito de Compras</h1>
            {cart.length === 0 ? <Message>El Carrito está vacío. <Link to='/'>Ir a Inicio</Link></Message> : (
                <ListGroup variant='flush'>
                    {cart.map((item) => (
                        <ListGroup.Item key={item.id}>
                            <Row>
                                <Col md={2}>
                                    <Image src={item.image} alt={item.name} fluid rounded style={{width: '200px', height: '100px'}}/>
                                </Col>
                                <Col md={2}>
                                    <Link to={`/product/${item.id}`}>{item.name}</Link>
                                </Col>
                                <Col md={1}>
                                    {item.size}
                                </Col>
                                <Col md={1}>
                                    {item.color}
                                </Col>
                                <Col md={2}>
                                    Gs. {item.price.toLocaleString('es-CO')}
                                </Col>
                                <Col md={2}>
                                    <Form.Control as='select' className='form-select' value={item.qty} onChange={(e) => {
                                        let itemData = {
                                            subid: item.subid,
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
                                    <Button type='button' variant='light' onClick={() => removeItemHandler(item.subid)}>
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
            <Card className='align-items-center'>
                <ListGroup variant='flush'>
                    <ListGroup.Item>
                        <h3>Subtotal ({cart.reduce((acc, cur) => acc + Number(cur.qty), 0)}) items</h3>
                        Gs. {cart.reduce((acc, cur) => acc + cur.qty * cur.price, 0).toLocaleString('es-Co')}
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <Button type='button' className='btn-block' disabled={cart.length === 0} onClick={checkoutHandler}>
                            Confirmar Pedido
                        </Button>
                    </ListGroup.Item>
                </ListGroup>
            </Card>                                    
        </Col>
    </Row>
  )
}

export default Cart