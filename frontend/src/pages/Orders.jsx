import React, {useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { getUserOrders } from "../features/users/userSlice"
import { Table, Button } from "react-bootstrap"
import { LinkContainer } from "react-router-bootstrap"
import Loader from "../components/Loader"
import Message from "../components/Message"

const Orders = () => {

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const {user, orders, isLoading, isSuccess, isError, message} = useSelector((state) => state.user)
  

  useEffect(() => {
    if(!user){
      navigate('/login')
    } else {
      dispatch(getUserOrders())
    }
    // eslint-disable-next-line
  }, [])

  return (
    <>
      <h2>My Orders</h2>
      {isError ? <Message variant='danger'>{message}</Message> : isLoading ? <Loader /> : (isSuccess && orders.length > 0) ? (
        <Table striped bordered hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>ID</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>{order.totalPrice}</td>
                <td>{order.isPaid ? order.paidAt.substring(0, 10) : (<i className="fas fa-times" style={{color: 'red'}} />)}</td>
                <td>{order.isDelivered ? order.deliveredAt.substring(0, 10) : (<i className="fas fa-times" style={{color: 'red'}} />)}</td>
                <td>
                  <LinkContainer to={`/order/${order._id}`}>
                    <Button className='btn-sm'variant='light'>Details</Button>
                  </LinkContainer>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : orders.length === 0 && <h3 className="text-center">No Orders Yet</h3>}
    </>
  )
}

export default Orders