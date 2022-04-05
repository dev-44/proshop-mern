//Hooks
import {useState, useEffect} from 'react'
import {useNavigate, Link} from 'react-router-dom'

//Redux
import {useDispatch, useSelector} from 'react-redux'
//import { addShippingAddress } from '../features/cart/cartSlice'
import { addShippingAddress, editShippingAddress } from '../features/users/userSlice'

//Design
import {Card, Form, Button, Row, Col, Modal} from 'react-bootstrap'
import FormContainer from '../components/FormContainer'
import CheckoutSteps from '../components/CheckoutSteps'
import ShippingAddress from '../components/ShippingAddress'
import {FaEdit, FaTrash} from 'react-icons/fa'

const Shipping = () => {
    const [addressId, setAddressId] = useState('')
    const [address, setAddress] = useState('')
    const [city, setCity] = useState('')
    const [postalCode, setPostalCode] = useState('')
    const [country, setCountry] = useState('')
    const [openForm, setOpenForm] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [openModal, setOpenModal] = useState(false)

    const {user} = useSelector(state => state.user)
    const {shippingAddresses} = useSelector(state => state.user.user)

    const {shippingAddress, isSuccess} = useSelector(state => state.cart)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        if (shippingAddresses.length === 0) {
            setOpenForm(true)
        }
    }, [])

    const onSubmit = (e) => {
        e.preventDefault()
        
        const newAddress = {
            address,
            city,
            postalCode,
            country
        }

        console.log(newAddress)
        
        //After Confirm the Address
        //dispatch(addShippingAddress(newAddress))
        dispatch(addShippingAddress(newAddress))
        clearForm()
        setOpenForm(!openForm)
    }

    const editAddress = (address, id) => {
        if(!user){
            navigate('/')
        } else {
            console.log(id);
            setIsEditing(true)
            setAddressId(address._id)
            setAddress(address.address)
            setCity(address.city)
            setPostalCode(address.postalCode)
            setCountry(address.country)
    
            setOpenForm(!openForm)
        }
    }

    const updateAddress = () => {
        console.log('Update');
        const editedAddress = {
            id: addressId,
            address: address,
            city: city,
            postalCode: postalCode,
            country: country
        }

        dispatch(editShippingAddress(editedAddress))
        setIsEditing(false)
        clearForm()
        setOpenForm(!openForm)
    }

    const deleteAddress = () => {
        console.log('Delete')
        handleCloseModal()
    }

    const clearForm = () => {
        setAddressId('')
        setAddress('')
        setCity('')
        setPostalCode('')
        setCountry('')
        console.log('Form Cleared');
    }

    const handleOpenModal = () => setOpenModal(true)
    const handleCloseModal = () => setOpenModal(false)

    const addressForm = (
        <FormContainer>

            {isEditing ? <h1 className='text-center'>EDIT ADDRESS</h1>  : <h1>NEW SHIPPING ADDRESS</h1>}
            <Form onSubmit={onSubmit}>

                <Form.Group controlId='address'>
                    <Form.Label>Address</Form.Label>
                    <Form.Control type='text' placeholder='Enter Address' value={address} onChange={(e) => setAddress(e.target.value)} required></Form.Control>
                </Form.Group>

                <Form.Group controlId='city'>
                    <Form.Label>City</Form.Label>
                    <Form.Control type='text' placeholder='Enter City' value={city} onChange={(e) => setCity(e.target.value)} required></Form.Control>
                </Form.Group>

                <Form.Group controlId='postalCode'>
                    <Form.Label>Postal Code</Form.Label>
                    <Form.Control type='text' placeholder='Enter Postal Code' value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required></Form.Control>
                </Form.Group>

                <Form.Group controlId='country'>
                    <Form.Label>Country</Form.Label>
                    <Form.Control type='text' placeholder='Enter Country' value={country} onChange={(e) => setCountry(e.target.value)} required></Form.Control>
                </Form.Group>
                
                {isEditing 
                    ? <Button type='button' variant='primary' className='mt-3 btn-block' onClick={updateAddress}>UPDATE</Button> 
                    : <Button type='submit' variant='primary' className='mt-3 btn-block'>ADD</Button>
                }
            </Form>
    </FormContainer>
    )

  return (
      <>    
        <Modal show={openModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
                <Modal.Title>Attention</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure to delete this Address?</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModal}>
                    Close
                </Button>
                <Button variant="danger" onClick={deleteAddress}>
                    Delete
                </Button>
            </Modal.Footer>
      </Modal>

            <CheckoutSteps step1 step2 />
            <h1 className='text-center'>Shipping Address</h1>
            {shippingAddresses.length > 0 && !openForm ? (
                <>
                
                <Row>
                    {shippingAddresses.map((address) => (
                      <Col  sm={12} md={6} lg={4} xl={3}>
                            <Card className='px-3 py-3'>
                                <div>
                                    <ShippingAddress key={address._id} address={address} />
                                    <Button className='btn-reverse btn-sm mt-3'>Choose</Button>
                                    <Button className='btn-sm mx-2 mt-3' type='button' onClick={() => editAddress(address, address._id)}><FaEdit /></Button>
                                    <Button className='btn-sm mt-3' onClick={handleOpenModal} ><FaTrash /></Button>
                                </div>
                            </Card>
                      </Col> 
                    ))}
                </Row>


                </>
            ) : addressForm} 
        {shippingAddresses.length > 0 && !openForm ? 
            (<div className='mt-5 text-center'>Want to send to another address? <Link to='' onClick={() => {
                setOpenForm(!openForm)
                clearForm()
            }}>Add one</Link></div>) : 
            (<div className='mt-5 text-center'><Link to='' onClick={() => {
                setOpenForm(!openForm) 
                clearForm()
            }}>Back to addresses</Link></div>)}
      </>
  )
}

export default Shipping