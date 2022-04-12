import {useState, useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { checkPassword, updateUser, resetError, reset } from '../features/users/userSlice'
import FormContainer from "../components/FormContainer"
import {Form, Button} from 'react-bootstrap'


const ChangePassword = () => {

    const [oldPassword, setOldPassword] = useState('')
    const [password, setPassword] = useState('')
    const [password2, setPassword2] = useState('')
    const [successMsg, setSuccessMsg] = useState('')
    const [errorMsg, setErrorMsg] = useState('')

    const dispatch = useDispatch()
    const {user, isLoading, isError, isSuccess, message, isMatch} = useSelector(state => state.user)

    const {_id, name, email, token} = user



    useEffect(() => {

        if(errorMsg){
            setTimeout(() => {
                setErrorMsg('')
            }, 5000)
        }

        if(message) {
            setTimeout(() => dispatch(resetError()), 5000)
        }

        if(successMsg){
            setTimeout(() => {
                setSuccessMsg('')
            }, 5000)
        }

    }, [errorMsg, successMsg, message, dispatch])

    useEffect(() => {
        if(isMatch){
            const userData = {
                _id,
                name,
                email,
                password,
                token
            }
            dispatch(updateUser(userData))
            setSuccessMsg('Password changed successfully')
            dispatch(reset())
        }
    }, [isMatch, reset])

    const onSubmit = (e) => {
        e.preventDefault()

        if(oldPassword === '' || password === '' || password2 === ''){
            setErrorMsg('Please fill all the fields')
            return
        }

        if(password !== password2){
            setErrorMsg('Passwords do not match')
            return
        }

        dispatch(checkPassword({oldPassword}))
    }

  return (
    <FormContainer>
        <h1>Change Password</h1>
        {message && <Message variant='danger'>{message}</Message>}
        {successMsg && <Message variant='success'>{successMsg}</Message>}
        {errorMsg && <Message variant='danger'>{errorMsg}</Message>}
        {isLoading && <Loader />}
        <Form onSubmit={onSubmit}>
            <Form.Group controlId='oldpassword'>
                <Form.Label>Enter Current Password</Form.Label>
                <Form.Control type='password' placeholder='Enter Current Password' value={oldPassword} onChange={(e) => setOldPassword(e.target.value)}></Form.Control>
            </Form.Group>

            <Form.Group controlId='password'>
                <Form.Label>Enter New Password</Form.Label>
                <Form.Control type='password' placeholder='Enter new Password' value={password} onChange={(e) => setPassword(e.target.value)}></Form.Control>
            </Form.Group>

            <Form.Group controlId='password2'>
                <Form.Label>Confirm New Password</Form.Label>
                <Form.Control type='password' placeholder='Confirm New Password' value={password2} onChange={(e) => setPassword2(e.target.value)}></Form.Control>
            </Form.Group>

            <Button className='mt-3' type='submit' variant='primary'>Change Password</Button>
        </Form>
    </FormContainer>
  )
}

export default ChangePassword