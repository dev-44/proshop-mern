import { useEffect, useState } from 'react'
import { Row, Col } from "react-bootstrap"
import Product from '../components/Product'   //Component
import Loader from '../components/Loader'
import Message from '../components/Message'
//import products from "../products"              //Json File
//import axios from 'axios'

//Redux
import {useSelector, useDispatch} from 'react-redux'
import { getProducts, reset } from '../features/products/productSlice'
import { resetUser } from '../features/users/userSlice'

const Home = () => {

  const dispatch = useDispatch()
  const {user, isLoggedIn} = useSelector(state => state.user)
  const {products, isLoading, isError, message, isSuccess} = useSelector((state) => state.product)

  const [successMsg, setSuccessMsg] = useState('')
  
  //const [products, setProducts] = useState([])

  useEffect (() => {

    if(isLoggedIn){
      setSuccessMsg(`Welcome ${user.name}`)
      setTimeout(() => {
        setSuccessMsg('')
      }, 5000)
      dispatch(resetUser())
    }
    return () => {              //Clear/Unmount.Return a function
        if(isSuccess) {
            dispatch(reset())
        }
    }
}, [dispatch, isSuccess, isLoggedIn])

  useEffect(() => {

    /* MOVE TO REDUX
    const fetchProducts = async() => {
      const { data } = await axios.get('/api/products')
      setProducts(data)
    }

    fetchProducts()
    */

    dispatch(getProducts())
   

  }, [dispatch])

  if(isLoading) {
    return <Loader />
  }


  if(isError){
    return <Message variant='danger'>{message}</Message>
  }

  return (
    <>
      {successMsg && <Message variant='success'>{successMsg}</Message>}
      <h1>LATEST PRODUCTS</h1>
        <Row>
            {products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                    <Product product={product} />             
              </Col> 
            ))}
        </Row>
    </>
  )
}

export default Home