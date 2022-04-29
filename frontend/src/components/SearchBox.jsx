import React, {useState} from 'react'
import {Form, Button, Col, Row} from 'react-bootstrap'
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
    <Form onSubmit={submitHandler} className="d-flex">
        <Row className=''>
            <Col xs={9} sm={9} md={8} lg={8}>
                <Form.Control type='text' name='q' value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder='Search Products' className='mr-sm-2 ml-sm-5'></Form.Control>
            </Col>


            <Col xs={2} sm={2} md={3} lg={3} >
                <Button type='submit' variant='outline-success' className='p-2 ms-auto'>Search</Button>
            </Col>
        </Row>
    </Form>
  )
}

export default SearchBox