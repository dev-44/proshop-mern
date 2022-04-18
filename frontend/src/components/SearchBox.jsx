import React, {useState} from 'react'
import {Form, Button, Col} from 'react-bootstrap'
import {useNavigate} from 'react-router-dom'

const SearchBox = () => {

    const [keyword, setKeyword] = useState('')

    const navigate = useNavigate()
    

    const submitHandler = (e) => {
        e.preventDefault()

        if(keyword.trim()) {
            navigate(`/search/${keyword}`)
        } else {
            navigate('/')
        }
    }

  return (
    <Form onSubmit={submitHandler} className='row g-12'>
        <Col md={6}>
            <Form.Control type='text' name='q' value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder='Search Products' className='mr-sm-2 ml-sm-5'></Form.Control>
        </Col>
        <Col md={3}>
            <Button type='submit' variant='outline-success' className='p-2'>Search</Button>
        </Col>
    </Form>
  )
}

export default SearchBox