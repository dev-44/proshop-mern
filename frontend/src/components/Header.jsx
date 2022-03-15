import { Nav, Navbar, Container} from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import {FaShoppingCart, FaUser} from 'react-icons/fa'

const Header = () => {
  return (
    <header>
      <Navbar bg="primary" variant="dark" expand="md" collapseOnSelect>
        <Container>
            <LinkContainer to='/'>
              <Navbar.Brand>PROSHOP</Navbar.Brand>  
            </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className='ms-auto'>

              <LinkContainer to='/cart'>
                <Nav.Link ><FaShoppingCart /> CART</Nav.Link>
              </LinkContainer>

              <LinkContainer to='/login'>
                <Nav.Link ><FaUser /> SIGN IN</Nav.Link>
              </LinkContainer>
              
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  )
}

export default Header