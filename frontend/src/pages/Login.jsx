import React, {useState, useEffect} from 'react'
import {Link, useNavigate, useLocation} from 'react-router-dom'
import {Form, Button, Row, Col, InputGroup} from 'react-bootstrap'
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

    const [showPsw, setShowPsw] = useState(false)

    const {email, password} = formData

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()

    const redirect = location.search.split('=')[1]

    const {user, isLoading, isError, isSuccess, message} = useSelector(state => state.user)

    useEffect(() => {
        if(message) {
            setTimeout(() => dispatch(resetError()), 5000)
        }

        //Redirect when register
        if(user && !redirect){
            navigate('/')
        }

        if(user && redirect){
            navigate(redirect)
        }
    }, [isSuccess, user, navigate, dispatch, message, redirect])

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
                    <Form.Label>Password</Form.Label>
                    <InputGroup>
                        <Form.Control type={showPsw ? 'text' : 'password'} placeholder='Enter Password' value={password} onChange={onChange}></Form.Control>
                        <InputGroup.Text>
                            <i onClick={() => setShowPsw(!showPsw)} className={!showPsw ? 'fas fa-eye' : 'fas fa-eye-slash'} ></i>
                        </InputGroup.Text>
                    </InputGroup>                   
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