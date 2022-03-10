import React from 'react';
import { Counter } from './features/counter/Counter'
import Header from './components/Header'
import Footer from './components/Footer'
import {Container} from 'react-bootstrap'
import Home from './pages/Home'

function App() {
  return (
    <>
    <Header />
      <main className='py-3'>
        <Container>
          <Home />
        </Container>
      </main>
    <Footer />
    </>
  );
}

export default App;
