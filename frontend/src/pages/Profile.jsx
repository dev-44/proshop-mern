import {useState, useEffect} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {Form, Button, Row, Col} from 'react-bootstrap'
import {useDispatch, useSelector} from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { updateUser, clearMsg } from '../features/users/userSlice'
import FormContainer from '../components/FormContainer'
import {FaEdit} from 'react-icons/fa'

const Profile = () => {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [errorMsg, setErrorMsg] = useState('')

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {user, isLoading, isError, isSuccess, message} = useSelector(state => state.user)

    useEffect(() => {

        if(!user){
            navigate('/')
        } else {
            setName(user.name)
            setEmail(user.email)
        }

        /*
        //Redirect when register
        if(isSuccess){
            navigate('/')
        }
        */

        if(errorMsg){
            setTimeout(() => {
                setErrorMsg('')
            }, 5000)
        }

        if(message) {
            setTimeout(() => dispatch(clearMsg()), 5000)
        }
    }, [isSuccess, user, navigate, dispatch, errorMsg, message])

    const onSubmit = (e) => {
        e.preventDefault()

        if(name === '' || email === ''){
            setErrorMsg('Please fill all the fields')
            return
        }
        
        const userData = {
            _id: user._id,
            name, 
            email,
            token: user.token
        }

        dispatch(updateUser(userData))
    }

    return (
        <FormContainer>
            <h1>Edit User Profile</h1>
            {message && <Message variant='danger'>{message}</Message>}
            {errorMsg && <Message variant='danger'>{errorMsg}</Message>}
            {isLoading && <Loader />}
            <Form onSubmit={onSubmit}>

                <Form.Group controlId='name'>
                    <Form.Label>Name</Form.Label>
                    <Form.Control type='text' placeholder='Enter Name' value={name} onChange={(e) => setName(e.target.value)}></Form.Control>
                </Form.Group>

                <Form.Group controlId='email'>
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control type='email' placeholder='Enter Email' value={email} onChange={(e) => setEmail(e.target.value)}></Form.Control>
                </Form.Group>

                <Button className='mt-3' type='submit' variant='primary'>Update</Button>
            </Form>
        </FormContainer>
    )
}

export default Profile