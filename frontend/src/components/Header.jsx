import {
    Nav, 
    Navbar, 
    Container
} from 'react-bootstrap'
import {FaShoppingCart, FaUser} from 'react-icons/fa'

const Header = () => {
  return (
    <header>
      <Navbar bg="primary" variant="dark" expand="md" collapseOnSelect>
        <Container>
          <Navbar.Brand href="/">PROSHOP</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className='ms-auto'>
                <Nav.Link href="/cart"><FaShoppingCart /> CART</Nav.Link>
                <Nav.Link href="/login"><FaUser /> SIGN IN</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  )
}

export default Header