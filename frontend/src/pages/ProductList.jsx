import React, {useEffect, useState, useCallback} from 'react'
import {useNavigate, useParams, useSearchParams, Link} from 'react-router-dom'
import {Table, Button, Modal, Row, Col, Card, Form, InputGroup} from 'react-bootstrap'
import {useDispatch, useSelector} from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Pagination from '../components/Pagination'
import { getProducts, deleteProduct, resetError, resetCrud} from '../features/products/productSlice'

const ProductList = () => {

    //Pagination
    const [currentPage, setCurrentPage] = useState(1)
    const [postsPerPage] = useState(5)

    const [openModal, setOpenModal] = useState(false)
    const [productToRemove, setProductToRemove] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    const [focus, setFocus] = useState('')

    //Filters
    const [idFilter, setIdFilter] = useState('')
    const [nameFilter, setNameFilter] = useState('')
    const [minPriceFilter, setMinPriceFilter] = useState()
    const [maxPriceFilter, setMaxPriceFilter] = useState()
    const [categoryFilter, setCategoryFilter] = useState('')
    const [brandFilter, setBrandFilter] = useState('')

    const [currentPosts, setCurrentPosts] = useState([])
    const [dataTable, setDataTable] = useState([])
    const [isSort, setIsSort] = useState(false)
    const [isFiltered, setIsFiltered] = useState(false)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [searchParams] = useSearchParams()
    const pageNumber = searchParams.get('page') || 1

    
    //Pagination from DB
    //const params = useParams()
    //const pageNumber = params.pageNumber || 1


    const {user} = useSelector(state => state.user)
    const {products, isLoading, isError, message, isDeleted, isCreated, isUpdated, page, pages, isLoaded, product} = useSelector(state => state.product)

    // Get current posts
    /*
    const indexOfLastPost = currentPage * postsPerPage
    const indexOfFirstPost = indexOfLastPost - postsPerPage
    let currentPosts = products.slice(indexOfFirstPost, indexOfLastPost)
    var filteredPosts = products
    */
    var categories = []
    var brands = []
    //var dataTable = []
    populateCategories(products)
    populateBrands(products)

    useEffect(() => {

        if ((!user && !user.isAdmin) ) {
            navigate('/')
        }
        dispatch(getProducts())

        if(isUpdated && pageNumber) {
            setFocus(product._id)
            setTimeout(() => setFocus(''), 12000)
            paginate(pageNumber)
            if(isLoaded) {
                setSuccessMessage('Product Updated with Success!')
                setTimeout(() => setSuccessMessage(''), 5000)
            }
            dispatch(resetCrud())
        }
        // eslint-disable-next-line
    },[])

    useEffect(() => {
        const indexOfLastPost = currentPage * postsPerPage
        const indexOfFirstPost = indexOfLastPost - postsPerPage
        var slice = products.slice(indexOfFirstPost, indexOfLastPost)
        setCurrentPosts(slice)
        setDataTable(slice)
    }, [products, currentPage])

    useEffect(() => {
        if(isDeleted) {
            dispatch(getProducts())

            if(isLoaded) {
                setSuccessMessage('Product Deleted with Success!')
                setTimeout(() => setSuccessMessage(''), 5000)
            }
            dispatch(resetCrud())
        }

        if(isCreated) {
            if(isLoaded) {
                setSuccessMessage('Product Created with Success!')
                setTimeout(() => setSuccessMessage(''), 5000)
            }
            dispatch(resetCrud())
        }

    }, [isDeleted, isUpdated])


    useEffect(() => {

        var filteredPosts = products
        if(idFilter) {
            filteredPosts = filteredPosts.filter(item => item._id.toLowerCase().includes(idFilter.toLowerCase()))
        }

        if (nameFilter) {
            filteredPosts = filteredPosts.filter(item => item.name.toLowerCase().includes(nameFilter.toLowerCase()))
        }
    
        if(minPriceFilter) {
            filteredPosts = filteredPosts.filter(item => Number(item.price) >= Number(minPriceFilter))
        }
    
        if(maxPriceFilter) {
            filteredPosts = filteredPosts.filter(item => Number(item.price) <= Number(maxPriceFilter))
        }
    
        if (categoryFilter) {
            filteredPosts = filteredPosts.filter(item => item.category === categoryFilter)
        }
    
        if (brandFilter) {
            filteredPosts = filteredPosts.filter(item => item.brand === brandFilter)
        }
        
        if(!idFilter && !nameFilter && !minPriceFilter && !maxPriceFilter && !categoryFilter && !brandFilter) {
            setDataTable(currentPosts)
            setIsFiltered(false)
        } else {
            setDataTable(filteredPosts)
            setIsFiltered(true)
        }
    }, [idFilter, nameFilter, minPriceFilter, maxPriceFilter, categoryFilter, brandFilter])


    /*
    useEffect(() => {
        var keyword = ''

        //Every time click on one page
        if(params.pageNumber && !isCreated) {
            console.log('Call 1')
            dispatch(getProducts({keyword, pageNumber}))
            setTimeout(() => {dispatch(resetCrud())}, 5000)
        }
    }, [params.pageNumber])
    */

    /*
    useEffect(() => {

        var keyword = ''

        if(isError) {
            setTimeout(() => dispatch(resetError()), 5000)
        }

        if(isCreated || isDeleted) {
            console.log('isCreated or isDeleted');
            dispatch(getProducts({keyword, pageNumber}))
        }   

        if(isUpdated) {
            setFocus(product._id)
            setTimeout(() => setFocus(''), 7000)
            //dispatch(getProducts({keyword, pageNumber}))
            if(isLoaded) {
                setSuccessMessage('Product Updated with success')
                setTimeout(() => setSuccessMessage(''), 5000)
                dispatch(resetCrud())
            }    
        }


        if(isLoaded) {
            console.log('Is Loaded')
            if(isDeleted) {
                setSuccessMessage('Product Deleted with success')
                setTimeout(() => setSuccessMessage(''), 5000)
            }

            if(isCreated) {
                setSuccessMessage('Product Created with success')
                setTimeout(() => setSuccessMessage(''), 5000)
            }

            if (pages === 1) {
                console.log('camino 1')
                navigate('/admin/productlist')
            } else {
                console.log('camino 2')
                navigate(`/admin/productlist/${pages}`)
            }
            setTimeout(() => dispatch(resetCrud()), 5000)
        }


    }, [dispatch, isDeleted, isError, isCreated, isUpdated, isLoaded])
    */


    const createProductHandler = () => {
        navigate('/admin/product/create')
    }

    const preDeleteProduct = (id) => {
        setProductToRemove(id)
        handleOpenModal()
    }

    const deleteHandler = () => {
        dispatch(deleteProduct(productToRemove))
        setProductToRemove('')
        handleCloseModal()
    }

    const editProduct = (id) => {
        dispatch(resetError())
        navigate(`/admin/product/${id}?redirect=productlist&page=${currentPage}`)
        //navigate(`/admin/product/${id}?redirect=productlist&page=${pageNumber}`)
    }

    //Modals
    const handleOpenModal = () => setOpenModal(true)
    const handleCloseModal = () => setOpenModal(false)

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber)

    //Search Filters
    /*
    if(idFilter) {
        filteredPosts = filteredPosts.filter(item => item._id.toLowerCase().includes(idFilter.toLowerCase()))
    }

    if (nameFilter) {
        filteredPosts = filteredPosts.filter(item => item.name.toLowerCase().includes(nameFilter.toLowerCase()))
    }

    if(minPriceFilter) {
        filteredPosts = filteredPosts.filter(item => Number(item.price) >= Number(minPriceFilter))
    }

    if(maxPriceFilter) {
        filteredPosts = filteredPosts.filter(item => Number(item.price) <= Number(maxPriceFilter))
    }

    if (categoryFilter) {
        filteredPosts = filteredPosts.filter(item => item.category === categoryFilter)
    }

    if (brandFilter) {
        filteredPosts = filteredPosts.filter(item => item.brand === brandFilter)
    }


    if(!idFilter && !nameFilter && !minPriceFilter && !maxPriceFilter && !categoryFilter && !brandFilter) {
        dataTable = currentPosts
    } else {
        dataTable = filteredPosts
    }
    */

    function populateCategories(products) {
        products.map(function(item) {
            if (!categories.includes(item.category)) {
                categories.push(item.category)
            }
        })
    }

    function populateBrands(products) {
        products.map(function(item) {
            if (!brands.includes(item.brand)) {
                brands.push(item.brand)
            }
        })
    }

    //Sorting
    function sortDesc() {
        
        // array temporal contiene objetos con posición y valor de ordenamiento
        var mapped = dataTable.map(function(item, index) {
            return { index, value: item.name.toLowerCase() };
          })
        
        
        // ordenando el array mapeado que contiene los valores reducidos
        mapped.sort(function(a, b) {
            if (a.value > b.value) {
            return 1
            }
            if (a.value < b.value) {
            return -1
            }
            return 0
        })

        // contenedor para el orden resultante
        setDataTable(mapped.map(function(item){
            return dataTable[item.index]
        }))

        setIsSort(true)
    }

  return (
    <>
        <Modal show={openModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
                <Modal.Title>Attention</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure you want to delete this Product?</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModal}>
                    Close
                </Button>
                <Button variant="danger" onClick={() => deleteHandler()}>
                    Delete
                </Button>
            </Modal.Footer>
        </Modal>

        <Row className=''>
            <Col>
                <h1>Products</h1>
            </Col>


            <Col className='ms-auto'>
                <Button className='my-3' onClick={createProductHandler}>
                    <i className='fas fa-plus'></i> Create Product 
                </Button>
            </Col>
        </Row>



        {isLoading  ? <Loader /> : (
            <>
            <Table striped bordered hover responsive className='table-sm' >
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>NAME <Link to=''><i className='fas fa-arrow-up' onClick={() => sortDesc()}></i></Link></th>
                        <th>PRICE</th>
                        <th>CATEGORY</th>
                        <th>BRAND</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>    {/* SEARCH FILTERS*/}
                        <td>
                            <Form.Control type='text' value={idFilter} onChange={(e) => setIdFilter(e.target.value)} placeholder='Search by ID' className='mr-sm-2 ml-sm-5'></Form.Control>
                        </td>
                        <td>
                            <Form.Control type='text' value={nameFilter} onChange={(e) => setNameFilter(e.target.value)} placeholder='Search by Name' className='mr-sm-2 ml-sm-5'></Form.Control>
                        </td>
                        <td>
                            <InputGroup>
                                <Form.Control as='input' htmlSize={6} type='number' value={minPriceFilter} onChange={(e) => setMinPriceFilter(e.target.value)} placeholder='Min Price' className='mr-sm-2 ml-sm-5'  />
                                <Form.Control as='input' htmlSize={6} type='number' value={maxPriceFilter} onChange={(e) => setMaxPriceFilter(e.target.value)} placeholder='Max Price' className='mr-sm-2 ml-sm-5'/> 
                            </InputGroup>
                        </td>
                        <td>
                            <Form.Select onChange={(e) => setCategoryFilter(e.target.value)}>
                                <option value=''>Select the Category</option>
                                {categories.map((item, index) => <option key={index} value={item}>{item}</option>)}
                            </Form.Select>
                        </td>
                        <td>
                            <Form.Select onChange={(e) => setBrandFilter(e.target.value)}>
                                <option value=''>Select the Brand</option>
                                {brands.map((item, index) => <option key={index} value={item}>{item}</option>)}
                            </Form.Select>
                        </td>
                    </tr>
                        {/* DATA */}
                    {dataTable && dataTable.map((item) => (
                            <tr key={item._id} style={{backgroundColor: focus === item._id ? '#18bc9c' : ''}} >
                                <td>{item._id}</td>
                                <td>
                                <Link to={`/product/${item._id}?redirect=productlist`} style={{color: focus === item._id && 'black'}}>{item.name}</Link>
                                </td>
                                <td style={{textAlign: 'center'}}>$ {item.price}</td>
                                <td>{item.category}</td>
                                <td>{item.brand}</td>
                                <td>
                    
                                    <Button variant='light' className='btn-sm' onClick={()=> editProduct(item._id)}>
                                        <i className='fas fa-edit'></i>
                                    </Button>
                                    
                                    
                                    <Button variant='danger' className='btn-sm' onClick={()=>preDeleteProduct(item._id)}>
                                        <i className='fas fa-trash'></i>
                                    </Button>

                                </td>
                            </tr>
                        ))}
                    {/*}
                    {products.map((item) => (
                        <tr key={item._id} style={{backgroundColor: focus === item._id ? '#18bc9c' : ''}}>
                            <td>{item._id}</td>
                            <td>{item.name}</td>
                            <td>$ {item.price}</td>
                            <td>{item.category}</td>
                            <td>{item.brand}</td>
                            <td>
                
                                <Button variant='light' className='btn-sm' onClick={()=> editProduct(item._id)}>
                                    <i className='fas fa-edit'></i>
                                </Button>
                                
                                
                                <Button variant='danger' className='btn-sm' onClick={()=>preDeleteProduct(item._id)}>
                                    <i className='fas fa-trash'></i>
                                </Button>

                            </td>
                        </tr>
                    ))}
                    */}
                </tbody>
            </Table>
            {((dataTable === currentPosts) || (isSort && !isFiltered))  && <Pagination postsPerPage={postsPerPage} totalPosts={products.length} paginate={paginate} currentPage={currentPage} />}

            {/*<Paginate pages={pages} page={page} isAdmin={true}/>*/}
            {(successMessage) && <Message variant='success'>{successMessage}</Message>}
            {(isError && message) && <Message variant='danger'>{message}</Message>}
            </>
        )}
    </>
  )
}

export default ProductList