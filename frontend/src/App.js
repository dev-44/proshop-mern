import React from 'react';
import {BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom'
import { Counter } from './features/counter/Counter'
import Header from './components/Header'
import Footer from './components/Footer'
import {Container} from 'react-bootstrap'
import Home from './pages/Home'
import ProductDetails from './pages/ProductDetails'

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
          </Routes>
          </Container>
        </main>
      <Footer />
    </Router>
    </>
  );
}

export default App;
