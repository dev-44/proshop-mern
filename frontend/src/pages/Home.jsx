import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'
import { Row, Col, Modal, Button, InputGroup, Form } from "react-bootstrap"
import Product from '../components/Product'   //Component
import Loader from '../components/Loader'
import Message from '../components/Message'
import Pagination from '../components/Pagination'
import HomeCarousel from '../components/HomeCarousel'
import Meta from '../components/Meta'

import { resetLoggedSuccess } from '../features/users/userSlice'
import { getProducts, getTopProducts, deleteProduct, resetCrud} from '../features/products/productSlice'

const Home = () => {

  //Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [postsPerPage] = useState(5)

  const [openModal, setOpenModal] = useState(false)
  const [productToRemove, setProductToRemove] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  //Filters
  const [idFilter, setIdFilter] = useState('')
  const [nameFilter, setNameFilter] = useState('')
  const [minPriceFilter, setMinPriceFilter] = useState()
  const [maxPriceFilter, setMaxPriceFilter] = useState()
  const [categoryFilter, setCategoryFilter] = useState('')
  const [brandFilter, setBrandFilter] = useState('')

  const [currentPosts, setCurrentPosts] = useState([])
  const [dataTable, setDataTable] = useState([])
  const [isFiltered, setIsFiltered] = useState(false)
  const [isSortNameAsc, setIsSortNameAsc] = useState(false)
  const [isSortNameDesc, setIsSortNameDesc] = useState(false)
  const [isSortPriceAsc, setIsSortPriceAsc] = useState(false)
  const [isSortPriceDesc, setIsSortPriceDesc] = useState(false)
  const [isSort, setIsSort] = useState(false)
  const [isSearchAndSortOpen, setIsSearchAndSortOpen] = useState(false)

  const dispatch = useDispatch()
  const {user, isLoggedSuccess} = useSelector(state => state.user)
  const {products, isLoading, isError, message, isSuccess, page, pages, pageSize, isLoaded, isDeleted} = useSelector((state) => state.product)

  const navigate = useNavigate()

  //Pagination from DB
  //const params = useParams()
  //const keyword = params.keyword
  //var pageNumber = params.pageNumber || 1
  
  //const [products, setProducts] = useState([])

  const [searchParams] = useSearchParams()
  const pageNumber = searchParams.get('page') || 1

  var categories = []
  var brands = []

  populateCategories(products)
  populateBrands(products)

  useEffect (() => {

    if(isLoggedSuccess && isLoaded){
      setSuccessMessage(`Welcome ${user.name}`)
      setTimeout(() => {dispatch(resetLoggedSuccess())}, 5000)
      setTimeout(() => {setSuccessMessage('')}, 8000)
    }

    if(isDeleted) {
      setSuccessMessage('Product deleted with success')
      setTimeout(() => setSuccessMessage(''), 5000)
      //dispatch(getProducts({keyword, pages}))
      dispatch(getProducts())
    }

    if(isDeleted & isLoaded) {
      console.log('Pages:' + pages)
      if (pages === 1) {
        console.log('Call to /')
        navigate('/')
      } else {
        navigate(`/page/${pages}`)
      }
      setTimeout(() => {dispatch(resetCrud())}, 1000)
    }

    /*
    return () => {              //Clear/Unmount.Return a function
        if(isSuccess) {
            dispatch(reset())
        }
    }
    */

}, [dispatch, isSuccess, isLoggedSuccess, isLoaded, isDeleted])


  useEffect(() => {

    /* MOVE TO REDUX
    const fetchProducts = async() => {
      const { data } = await axios.get('/api/products')
      setProducts(data)
    }

    fetchProducts()
    */

    dispatch(getTopProducts())
    //dispatch(getProducts({keyword, pageNumber}))
    dispatch(getProducts())
    setTimeout(() => {dispatch(resetCrud())}, 2000)
  
  }, [])

    //Search, Filter and Sort
    useEffect(() => {
      const indexOfLastPost = currentPage * postsPerPage
      const indexOfFirstPost = indexOfLastPost - postsPerPage
      var slice = products.slice(indexOfFirstPost, indexOfLastPost)
      setCurrentPosts(slice)
      setDataTable(slice)
  }, [products, currentPage])
  
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

    if (isSortNameAsc) {
        console.log('Call to order name asc')
        if(isSortNameDesc) {
          setIsSortNameDesc(false)
        }

          // array temporal contiene objetos con posición y valor de ordenamiento
          var mapped = filteredPosts.map(function(item, index) {
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
          filteredPosts = (mapped.map(function(item){
              return filteredPosts[item.index]
          }))

          setIsSort(true)
    }
    
    if(!idFilter && !nameFilter && !minPriceFilter && !maxPriceFilter && !categoryFilter && !brandFilter && !isSort) {
        setDataTable(currentPosts)
        setIsFiltered(false)
        setIsSort(false)
    } else {
        setDataTable(filteredPosts)
        setIsFiltered(true)
    }
  }, [idFilter, nameFilter, minPriceFilter, maxPriceFilter, categoryFilter, brandFilter, isSortNameAsc])

  

  if(isLoading) {
    return <Loader />
  }


  if(isError){
    return <Message variant='danger'>{message}</Message>
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

  //Modals
  const handleOpenModal = () => setOpenModal(true)
  const handleCloseModal = () => setOpenModal(false)

  // Change page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber)
    setIsSortNameAsc(false)
    setIsSortNameDesc(false)
  }

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

function sortNameAsc() {
  setIsSortNameAsc(!isSortNameAsc)
  /*
    if(isSortNameDesc) {
        setIsSortNameDesc(false)
    }

    if(!isSortNameAsc) {
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

    } else {
        setDataTable(currentPosts)
        setIsSort(false)
    }

    setIsSortNameAsc(!isSortNameAsc)
    */
}



function sortNameDesc() {
    if(isSortNameAsc) {
        setIsSortNameAsc(false)
    }

    if(!isSortNameDesc) {
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
        var auxArray = mapped.map(function(item){
            return dataTable[item.index]
        })

        setDataTable(auxArray.reverse())
        setIsSort(true)
    } else {
        setDataTable(currentPosts)
        setIsSort(false)
    }

    setIsSortNameDesc(!isSortNameDesc)
}

function sortPriceAsc() {
    if(isSortPriceDesc) {
        setIsSortPriceDesc(false)
    }

    if(!isSortPriceAsc) {
        // array temporal contiene objetos con posición y valor de ordenamiento
        var mapped = dataTable.map(function(item, index) {
            return { index, value: item.price}
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
        var auxArray = mapped.map(function(item){
            return dataTable[item.index]
        })

        auxArray = auxArray.reverse()

        setDataTable(auxArray)
        setIsSort(true)
    } else {
        setDataTable(currentPosts)
        setIsSort(false)
    }

    setIsSortPriceAsc(!isSortPriceAsc)
}

function sortPriceDesc() {
    if(isSortPriceAsc) {
        setIsSortPriceAsc(false)
    }

    if(!isSortPriceDesc) {

        // array temporal contiene objetos con posición y valor de ordenamiento
        var mapped = dataTable.map(function(item, index) {
            return { index, value: item.price}
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
        var auxArray = mapped.map(function(item){
            return dataTable[item.index]
        })

        setDataTable(auxArray)
        setIsSort(true)
    } else {
        setDataTable(currentPosts)
        setIsSort(false)
    }

    setIsSortPriceDesc(!isSortPriceDesc)
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

    <Meta />
      {successMessage && <Message variant='success'>{successMessage}</Message>}

      <Button className='mb-2 inline' onClick={() => setIsSearchAndSortOpen(!isSearchAndSortOpen)}>
        <i className='fas fa-filter'></i>
      </Button>


      {isFiltered && (
        <Button variant='light' className='mb-2 mx-2'>
          Clear Filters
        </Button>
      )}
      {isSearchAndSortOpen && (
        <InputGroup>

          <Col className='me-3 mb-3' >
            <Form.Label>Search By Name</Form.Label>
            <i className='fas fa-arrow-up ms-2' onClick={() => sortNameAsc()} style={{color: isSortNameAsc ? '#18bc9c' : '#000000', cursor: 'pointer'}}></i>
            <i className='fas fa-arrow-down ms-2' onClick={() => sortNameDesc()} style={{color: isSortNameDesc ? '#18bc9c' : '#000000', cursor: 'pointer'}}></i>
            <Form.Control type='text' value={nameFilter} onChange={(e) => setNameFilter(e.target.value)} placeholder='Search by Name'/>
          </Col>

          <Col className='me-3 mb-3'>
            <Form.Label>Search By Min Price</Form.Label>
            <i className='fas fa-arrow-down ms-1' onClick={() => sortPriceDesc()} style={{color: isSortPriceDesc ? '#18bc9c' : '#000000', cursor: 'pointer'}}></i>
            <Form.Control type='number' value={minPriceFilter} onChange={(e) => setMinPriceFilter(e.target.value)} placeholder='Min Price'/>
          </Col>

          <Col className='me-3 mb-3'>
            <Form.Label>Search By Max Price</Form.Label>
            <i className='fas fa-arrow-up ms-2' onClick={() => sortPriceAsc()} style={{color: isSortPriceAsc ? '#18bc9c' : '#000000', cursor: 'pointer'}}></i>
            <Form.Control type='number' value={maxPriceFilter} onChange={(e) => setMaxPriceFilter(e.target.value)} placeholder='Max Price' /> 
          </Col>

          <Col className='me-3 mb-3'>
            <Form.Label>Search By Category</Form.Label>
            <Form.Select onChange={(e) => setCategoryFilter(e.target.value)}>
              <option value=''>Select the Category</option>
              {categories.map((item, index) => <option key={index} value={item}>{item}</option>)}
            </Form.Select>
          </Col>

          <Col className='me-3 mb-3'>
            <Form.Label>Search By Brand</Form.Label>
            <Form.Select onChange={(e) => setBrandFilter(e.target.value)}>
              <option value=''>Select the Brand</option>
              {brands.map((item, index) => <option key={index} value={item}>{item}</option>)}
            </Form.Select>
          </Col>

        </InputGroup>
      )}


      {(!isFiltered && !isSort) && <HomeCarousel />}
      {isSearchAndSortOpen ? <h3>Results</h3> :<h1>LATEST PRODUCTS</h1>}
        <Row>
            {dataTable.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                    <Product product={product} preDeleteProduct={preDeleteProduct}/>             
              </Col> 
            ))}
        </Row>
        {/* <Paginate pages={pages} page={page} keyword={keyword ? keyword : ''}/> */}

        {((dataTable === currentPosts) || (isSort && !isFiltered))  && <Pagination postsPerPage={postsPerPage} totalPosts={products.length} paginate={paginate} currentPage={currentPage} />}
    </>
  )
}

export default Home