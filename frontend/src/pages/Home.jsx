import { Row, Col } from "react-bootstrap"
import products from "../products"              //Json File
import Product from '../components/Product'   //Component

const Home = () => {
  return (
    <>
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