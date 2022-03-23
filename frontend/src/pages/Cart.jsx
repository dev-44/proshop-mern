import { useEffect } from 'react'
import {useDispatch, useSelector} from 'react-redux'
import Message from '../components/Message'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { Row, Col, ListGroup, Image, Form, Button, Card } from 'react-bootstrap'
import { addItem } from '../features/cart/cartSlice'

const Cart = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const dispatch = useDispatch()

  const {id} = useParams()
  const qty = searchParams.get('qty')


  useEffect(() => {
      const itemData = {id, qty}
      if(id) {
          dispatch(addItem(itemData))
      }
  }, [dispatch, id, qty])

  return (
    <div>Cart</div>
  )
}

export default Cart