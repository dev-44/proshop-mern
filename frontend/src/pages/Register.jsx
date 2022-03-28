import {useState, useEffect} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {Form, Button, Row, Col} from 'react-bootstrap'
import {useDispatch, useSelector} from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { register, clearMsg } from '../features/users/userSlice'
import FormContainer from '../components/FormContainer'

const Register = () => {

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password2: ''
    })

    const[errorMsg, setErrorMsg] = useState('')

    const {name, email, password, password2} = formData

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {user, isLoading, isError, isSuccess, message} = useSelector(state => state.user)

    useEffect(() => {
        //Redirect when register
        if(isSuccess || user){
            navigate('/')
        }

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

        if(password !== password2){
            setErrorMsg('Password do not match')
            return
        } 

        if(name === '' || email === '' || password === '' || password2 === ''){
            setErrorMsg('Please fill all the fields')
            return
        }
        
        const userData = {
            name,
            email,
            password
        }

        dispatch(register(userData))
        
    }

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value
        }))
    }

    return (
        <FormContainer>
            <h1>Register</h1>
            {message && <Message variant='danger'>{message}</Message>}
            {errorMsg && <Message variant='danger'>{errorMsg}</Message>}
            {isLoading && <Loader />}
            <Form onSubmit={onSubmit}>

                <Form.Group controlId='name'>
                    <Form.Label>Name</Form.Label>
                    <Form.Control type='text' placeholder='Enter Name' value={name} onChange={onChange}></Form.Control>
                </Form.Group>

                <Form.Group controlId='email'>
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control type='email' placeholder='Enter Email' value={email} onChange={onChange}></Form.Control>
                </Form.Group>

                <Form.Group controlId='password'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control type='password' placeholder='Enter Password' value={password} onChange={onChange}></Form.Control>
                </Form.Group>

                <Form.Group controlId='password2'>
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control type='password' placeholder='Confirm Password' value={password2} onChange={onChange}></Form.Control>
                </Form.Group>

                <Button className='mt-3' type='submit' variant='primary'>Register</Button>
            </Form>

            <Row className='py-3'>
                <Col>Have an Account? <Link to='/login'>Login</Link></Col>
            </Row>
        </FormContainer>
    )
}

export default Register