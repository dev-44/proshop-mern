import React from 'react';
import {BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import {Container} from 'react-bootstrap'
import Home from './pages/Home'
import ProductDetails from './pages/ProductDetails'
import Cart from './pages/Cart';

function App() {
  return (
    <>
    <Router>
      <Header />
        <main className='py-3'>
          <Container>
          <Routes>
            <Route path='/' element={<Home />} exact/>
            <Route path='/product/:id' element={<ProductDetails />} />

            <Route path="/cart">
              <Route index element={<Cart />} />
              <Route path=":id" element={<Cart />} />
            </Route>

          </Routes>
          </Container>
        </main>
      <Footer />
    </Router>
    </>
  );
}

export default App;
