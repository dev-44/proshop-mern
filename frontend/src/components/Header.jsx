import React from 'react'
import {Routes, Route} from 'react-router-dom'
import { Nav, Navbar, Container, NavDropdown, Col, Row} from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import {FaShoppingCart, FaUser} from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import {logout, reset} from '../features/users/userSlice'
import { reset as resetAdmin } from '../features/admins/adminSlice'
import SearchBox from './SearchBox'

const Header = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.user)
  const navigate = useNavigate()

  const onLogout = () => {
     dispatch(logout())

     if (user.isAdmin) {
       dispatch(resetAdmin())
     }
     navigate('/')
  }

  return (
    <header>
      <Navbar bg={!user ? 'primary' : user.isAdmin ? '' : 'primary'} style={(user && user.isAdmin) ? {backgroundColor: '#236968'} : {}} variant="dark" expand="md" collapseOnSelect>
        <Container >

          <LinkContainer to='/'>
            <Navbar.Brand>PROSHOP</Navbar.Brand>  
          </LinkContainer>

          
          <SearchBox/>  
          

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className='ms-auto'>

              <LinkContainer to='/cart'>
                <Nav.Link ><FaShoppingCart /> CART</Nav.Link>
              </LinkContainer>

              {(user && !user.isAdmin) ? (
                <NavDropdown title={user.name} id='username'>
                  <LinkContainer to='/profile'>
                      <NavDropdown.Item>Edit Profile</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/orders'>
                      <NavDropdown.Item>Orders</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/changepassword'>
                      <NavDropdown.Item>Change Password</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item onClick={onLogout}>Logout</NavDropdown.Item>
                </NavDropdown>
              ) : !user && (
                <LinkContainer to='/login'>
                <Nav.Link ><FaUser /> SIGN IN</Nav.Link>
              </LinkContainer>
              )}

              {(user && user.isAdmin) && (
                <NavDropdown title='ADMIN' id='adminmenu'>

                  <LinkContainer to='/admin/userslist'>
                      <NavDropdown.Item>USERS</NavDropdown.Item>
                  </LinkContainer>

                  <LinkContainer to='/admin/productlist'>
                      <NavDropdown.Item>PRODUCTS</NavDropdown.Item>
                  </LinkContainer>

                  <LinkContainer to='/admin/orderlist'>
                      <NavDropdown.Item>ORDERS</NavDropdown.Item>
                  </LinkContainer>

                  <LinkContainer to='/changepassword'>
                      <NavDropdown.Item>Change Password</NavDropdown.Item>
                  </LinkContainer>

                  <NavDropdown.Item onClick={onLogout}>Logout</NavDropdown.Item>

              </NavDropdown>
              )}

            </Nav>
          </Navbar.Collapse>


        </Container>
      </Navbar>
    </header>
  )
}

export default Header