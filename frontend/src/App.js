import React from 'react';
import {BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import {Container} from 'react-bootstrap'
import Home from './pages/Home'
import ProductDetails from './pages/ProductDetails'
import Cart from './pages/Cart'
import Register from './pages/Register'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Orders from './pages/Orders'
import ChangePassword from './pages/ChangePassword'
import Shipping from './pages/Shipping'
import Payment from './pages/Payment'
import PlaceOrder from './pages/PlaceOrder'
import Order from './pages/Order'
import UsersList from './pages/UsersList'
import ProductList from './pages/ProductList'
import ProductEdit from './pages/ProductEdit'
import ProductCreate from './pages/ProductCreate'
import OrderList from './pages/OrderList'

function App() {
  return (
    <>
    <Router>
      <Header />
        <main className='py-3'>
          <Container>
          <Routes>
            <Route path='/' element={<Home />} exact />
            <Route path='/search/:keyword' element={<Home />} exact/>
            <Route path='/page/:pageNumber' element={<Home />} exact />
            <Route path='/search/:keyword/page/:pageNumber' element={<Home />} exact />
            <Route path='/register' element={<Register />} />
            <Route path='/login' element={<Login />} />
            <Route path='/profile' element={<Profile />}  />
            <Route path='/changepassword' element={<ChangePassword />} />
            <Route path='/orders' element={<Orders />} exact />
            <Route path='/product/:id' element={<ProductDetails />} />
            <Route path='/shipping' element={<Shipping />} />
            <Route path='/payment' element={<Payment />} />
            <Route path='/placeorder' element={<PlaceOrder />} />
            <Route path='/order/:id' element={<Order />} />
            <Route path='/admin/userslist' element={<UsersList />} />
            <Route path='/admin/productlist' element={<ProductList />} exact/>
            <Route path='/admin/productlist/:pageNumber' element={<ProductList />} exact />
            <Route path='/admin/product/:id' element={<ProductEdit />} />
            <Route path='/admin/product/create' element={<ProductCreate />} />
            <Route path='/admin/orderlist' element={<OrderList />} />
            <Route path="*" element={
                    <main style={{ padding: "1rem" }}>
                      <p>There's nothing here!</p>
                    </main>
                  }
            />



            {/*}
            <Route path="/cart">
              <Route index element={<Cart />} />
              <Route path=":id" element={<Cart />} />
            </Route>
          */}

          <Route path='/cart' element={<Cart />} />

          </Routes>
          </Container>
        </main>
      <Footer />
    </Router>
    </>
  );
}

export default App;
