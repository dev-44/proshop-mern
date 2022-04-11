import {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {LinkContainer} from 'react-router-bootstrap'
import {Table, Button, Modal} from 'react-bootstrap'
import {useDispatch, useSelector} from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { getUsers, deleteUser, makeAdmin} from '../features/admins/adminSlice'

const UsersList = () => {

    const [openModal, setOpenModal] = useState(false)
    const [openModal2, setOpenModal2] = useState(false)
    const [userToDelete, setUserToDelete ] = useState('')
    const [userToAdmin, setUserToAdmin ] = useState('')
    const [isAdmin, setIsAdmin ] = useState(false)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const {users, isLoading, isSuccess, isError, message} = useSelector(state => state.admin)
    const {user} = useSelector(state => state.user)

    useEffect(() => {
        if ((user && user.isAdmin) || isSuccess) {
            dispatch(getUsers())
        } else {
            navigate('/')
        }
    }, [dispatch, navigate, user, isSuccess])

    const preDeleteUser = (id) => {
        setUserToDelete(id)
        handleOpenModal()
    }

    const confirmDeleteUser = () => {
        console.log('Click')
        dispatch(deleteUser(userToDelete))
        setUserToDelete('')
        handleCloseModal()
    }

    const preMakeAdmin = (id, isAdmin) => {
        if(isAdmin) {
            setIsAdmin(true)
        } else {
            setIsAdmin(false)
        }
        setUserToAdmin(id)
        handleOpenModal2()
    }

    const makeAdminHandler = () => {
        dispatch(makeAdmin(userToAdmin))
        setUserToAdmin('')
        handleCloseModal2()
    }

    //Modals
    const handleOpenModal = () => setOpenModal(true)
    const handleCloseModal = () => setOpenModal(false)
    const handleOpenModal2 = () => setOpenModal2(true)
    const handleCloseModal2 = () => setOpenModal2(false)

  return (
    <>
        <Modal show={openModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
                <Modal.Title>Attention</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure you want to delete this User?</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModal}>
                    Close
                </Button>
                <Button variant="danger" onClick={() => confirmDeleteUser()}>
                    Delete
                </Button>
            </Modal.Footer>
        </Modal>

        <Modal show={openModal2} onHide={handleCloseModal2}>
            <Modal.Header closeButton>
                <Modal.Title>Attention</Modal.Title>
            </Modal.Header>
            {!isAdmin ? (
                <Modal.Body>Are you sure you want to upgrade this user as an ADMIN?</Modal.Body>
            ) : (
                <Modal.Body>Are you sure you want to remove privilegies as an ADMIN?</Modal.Body>
            )}
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModal2}>
                    Close
                </Button>

                {!isAdmin ? (
                    <Button variant="success" onClick={() => makeAdminHandler()}>
                        Make it ADMIN!
                    </Button>
                ) :(
                    <Button variant="danger" onClick={() => makeAdminHandler()}>
                        Remove privilegies!
                    </Button>
                )}
            </Modal.Footer>
        </Modal>

        <h1>Users</h1>
        {isLoading  ? <Loader /> : isError ? <Message variant='danger'>{message}</Message> : (
            <Table striped bordered hover responsive className='table-sm'>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Admin</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((item) => (
                        <tr key={item._id}>
                            <td>{item._id}</td>
                            <td>{item.name}</td>
                            <td><a href={`mailto:${item.email}`}>{item.email}</a></td>
                            <td>{item.isAdmin ? (<i className='fas fa-check' style={{color: 'green'}}></i>) : (<i className='fas fa-times' style={{color: 'red'}}></i>)}</td>
                            <td>{user._id !== item._id ? (<>
                                <Button variant='light' className='btn-sm' onClick={() => preMakeAdmin(item._id, item.isAdmin)}>
                                    <i className='fas fa-crown' style={item.isAdmin ? {color: 'red'} : {color: 'green'}}></i>
                                </Button>
                                
                                <Button variant='danger' className='btn-sm' onClick={()=>preDeleteUser(item._id)}>
                                    <i className='fas fa-trash'></i>
                                </Button>
                            </>
                            ) : 'This is you :)'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        )}
    </>
  )
}

export default UsersList