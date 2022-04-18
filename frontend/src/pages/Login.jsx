import React, {useState, useEffect} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {Form, Button, Row, Col} from 'react-bootstrap'
import {useDispatch, useSelector} from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import {login, resetError} from '../features/users/userSlice'
import FormContainer from '../components/FormContainer'

const Login = () => {

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    const {email, password} = formData

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {user, isLoading, isError, isSuccess, message} = useSelector(state => state.user)

    useEffect(() => {
        if(message) {
            setTimeout(() => dispatch(resetError()), 5000)
        }

        //Redirect when register
        if(isSuccess || user){
            navigate('/')
        }
    }, [isSuccess, user, navigate, dispatch, message])

    const onSubmit = (e) => {
        e.preventDefault()

        const userData = {
            email, password
        }

        dispatch(login(userData))
    }

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value
        }))
    }

    return (
        <FormContainer>
            <h1>Sign In</h1>
            {message && <Message variant='danger'>{message}</Message>}
            {isLoading && <Loader />}
            <Form onSubmit={onSubmit}>
                <Form.Group controlId='email'>
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control type='email' placeholder='Enter Email' value={email} onChange={onChange}></Form.Control>
                </Form.Group>

                <Form.Group controlId='password'>
                    <Form.Label>Password Address</Form.Label>
                    <Form.Control type='password' placeholder='Enter Password' value={password} onChange={onChange}></Form.Control>
                </Form.Group>

                <Button className='mt-3' type='submit' variant='primary'>Sign In</Button>
            </Form>

            <Row className='py-3'>
                <Col>New Customer? <Link to='/register'>Register</Link></Col>
            </Row>
        </FormContainer>
    )
}

export default Login