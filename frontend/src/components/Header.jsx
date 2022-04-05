import { Nav, Navbar, Container, NavDropdown} from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import {FaShoppingCart, FaUser} from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import {logout, resetUser} from '../features/users/userSlice'

const Header = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.user)
  const navigate = useNavigate()

  const onLogout = () => {
     dispatch(logout())
     navigate('/')
  }

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
              {user ? (
                <NavDropdown title={user.name} id='username'>
                  <LinkContainer to='/profile'>
                      <NavDropdown.Item>Edit Profile</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/orders'>
                      <NavDropdown.Item>Orders</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/change-pass'>
                      <NavDropdown.Item>Change Password</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item onClick={onLogout}>Logout</NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to='/login'>
                <Nav.Link ><FaUser /> SIGN IN</Nav.Link>
              </LinkContainer>
              )}

              
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  )
}

export default Header