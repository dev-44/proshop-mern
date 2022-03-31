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

function App() {
  return (
    <>
    <Router>
      <Header />
        <main className='py-3'>
          <Container>
          <Routes>
            <Route path='/' element={<Home />} exact/>
            <Route path='/register' element={<Register />} exact />
            <Route path='/login' element={<Login />} exact />
            <Route path='/profile' element={<Profile />} exact />
            <Route path='/change-pass' element={<ChangePassword />} exact />
            <Route path='/orders' element={<Orders />} exact />
            <Route path='/product/:id' element={<ProductDetails />} />
            <Route path='/shipping' element={<Shipping />} />

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
