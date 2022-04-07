//Hooks
import {useState, useEffect} from 'react'
import {useNavigate, Link} from 'react-router-dom'

//Redux
import {useDispatch, useSelector} from 'react-redux'
import { addShippingAddressCart } from '../features/cart/cartSlice'
import { addShippingAddress, editShippingAddress, deleteShippingAddress, clearMsg } from '../features/users/userSlice'

//Design
import {Card, Form, Button, Row, Col, Modal} from 'react-bootstrap'
import FormContainer from '../components/FormContainer'
import CheckoutSteps from '../components/CheckoutSteps'
import ShippingAddress from '../components/ShippingAddress'
import {FaEdit, FaTrash} from 'react-icons/fa'
import Message from '../components/Message'

const Shipping = () => {
    const [addressId, setAddressId] = useState('')
    const [address, setAddress] = useState('')
    const [city, setCity] = useState('')
    const [postalCode, setPostalCode] = useState('')
    const [country, setCountry] = useState('')
    const [openForm, setOpenForm] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [openModal, setOpenModal] = useState(false)
    const [successMsg, setSuccessMsg] = useState('')
    const [choose, setChoose] = useState('')
    const [chooseToDelete, setChooseToDelete] = useState('')
    const [addressSelected, setAddressSelected] = useState({
        id: '',
        address: '',
        city: '',
        postalCode: '',
        country: ''
    })

    const {user, message, isSuccess} = useSelector(state => state.user)
    const {shippingAddresses} = useSelector(state => state.user.user)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        if (shippingAddresses.length === 0) {
            setIsEditing(false)
            setOpenForm(true)
        }
    }, [shippingAddresses.length])

    useEffect(() => {
        if(message) {
            setTimeout(() => dispatch(clearMsg()), 5000)
        }
    }, [message, dispatch])

    const onSubmit = (e) => {
        e.preventDefault()
        
        const newAddress = {
            address,
            city,
            postalCode,
            country
        }

        console.log(newAddress)
        dispatch(addShippingAddress(newAddress))
        setOpenForm(!openForm)
        clearForm()

        if(isSuccess) {
            setSuccessMsg('SHIPPING ADDRESS has been CREATED successfully')
            setTimeout(() => {setSuccessMsg('')}, 5000)
        }
    }

    const editAddress = (address, id) => {
        if(!user){
            navigate('/')
        } else {
            console.log(id)
            setChoose('')
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

        if(isSuccess) {
            setSuccessMsg('SHIPPING ADDRESS has been MODIFIED successfully')
            setTimeout(() => {setSuccessMsg('')}, 5000)
        }
    }

    const preDeleteAddress = (addressId) => {
        console.log(addressId)
        setChoose('')
        setChooseToDelete(addressId)
        setAddressId(addressId)
        handleOpenModal()
    }

    const deleteAddress = () => {
        console.log('Delete')
        dispatch(deleteShippingAddress(addressId))
        setChooseToDelete('')
        handleCloseModal()

        if(isSuccess) {
            setSuccessMsg('SHIPPING ADDRESS has been DELETED successfully')
            setTimeout(() => {setSuccessMsg('')}, 5000)
        }
    }

    const clearForm = () => {
        setAddressId('')
        setAddress('')
        setCity('')
        setPostalCode('')
        setCountry('')
        console.log('Form Cleared');
    }

    //Modal
    const handleOpenModal = () => setOpenModal(true)
    const handleCloseModal = () => {
        setChooseToDelete('')
        setOpenModal(false)
    }

    const chooseAddress = (address) => {
        if(address._id === choose) {
            setChoose('')
        } else {
            setChoose(address._id)

            const choise = {
                id: address._id,
                address: address.address,
                city: address.city,
                postalCode: address.postalCode,
                country: address.country
            }

            setAddressSelected(choise)
        }
    }

    const saveAddress = () => {
        console.log('Click on saveAddress')
        dispatch(addShippingAddressCart(addressSelected))
        navigate('/payment')
    }

    const addressForm = (
        <FormContainer>

            <h1 className='text-center'>{isEditing ? 'Edit Address' : 'New Shipping Address'}</h1>
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
            <Modal.Body>Are you sure you want to delete this Address?</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModal}>
                    Close
                </Button>
                <Button variant="danger" onClick={() => deleteAddress(addressId)}>
                    Delete
                </Button>
            </Modal.Footer>
      </Modal>

            <CheckoutSteps step1 step2 />
            <h1 className='text-center'>SHIPPING ADDRESS</h1>
            {successMsg && <Message variant='success'>{successMsg}</Message>}
            {message && <Message variant='danger'>{message}</Message>}
            {shippingAddresses.length > 0 && !openForm ? (
                <>
                
                <Row>
                    {shippingAddresses.map((address) => (
                      <Col sm={12} md={6} lg={4} xl={3}>
                            <Card className={`py-3 px-3 ${(choose === address._id || chooseToDelete === address._id) && 'choose'}`} bg={choose === address._id ? 'success' : chooseToDelete === address._id && 'danger' }>
                                <div>
                                    <ShippingAddress key={address._id} address={address} />
                                    <Button className='btn-reverse btn-sm mt-3' onClick={() => chooseAddress(address)}>{choose !== address._id ? 'Choose' : 'Quit'}</Button>
                                    <Button className='btn-sm mx-2 mt-3' type='button' onClick={() => editAddress(address, address._id)}><FaEdit /></Button>
                                    <Button className='btn-sm mt-3' onClick={() => preDeleteAddress(address._id)}><FaTrash /></Button>
                                </div>
                            </Card>
                      </Col> 
                    ))}
                </Row>


                </>
            ) : addressForm}

        {choose && (
        <div className='container'>
            <div className='center'>
                <Button variant='primary' onClick={() => saveAddress()}>Continue</Button>
            </div>
        </div>
        )}

        {shippingAddresses.length > 0 && !openForm ? 
            (<div className='mt-3 text-center'>Want to send to another address? <Link to='' onClick={() => {
                setOpenForm(!openForm)
                setChoose('')
                clearForm()
            }}>Add one</Link></div>) : 
            (<div className='mt-3 text-center'><Link to='' onClick={() => {
                setOpenForm(!openForm) 
                setChoose('')
                clearForm()
            }}>Back to addresses</Link></div>)}
      </>
  )
}

export default Shipping