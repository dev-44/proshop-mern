import React, { useEffect, useState, useContext } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'
import { Row, Col, Modal, Button, InputGroup, Form } from "react-bootstrap"
import Product from '../components/Product'   //Component
import Loader from '../components/Loader'
import Message from '../components/Message'
import Pagination from '../components/Pagination'
import HomeCarousel from '../components/HomeCarousel'
import Meta from '../components/Meta'

import HomeContext from '../context/HomeContext'

import { resetLoggedSuccess } from '../features/users/userSlice'
import { getProducts, getTopProducts, deleteProduct, resetCrud} from '../features/products/productSlice'

const Home = () => {

  //Pagination
  /*1*/ const [currentPage, setCurrentPage] = useState(1)
  /*2*/ const [postsPerPage] = useState(5)

  /*3*/ const [openModal, setOpenModal] = useState(false)
  /*4*/ const [productToRemove, setProductToRemove] = useState('')
  /*5*/ const [successMessage, setSuccessMessage] = useState('')

  //Filters
  /*6*/ const [nameFilter, setNameFilter] = useState('')
  /*7*/ const [minPriceFilter, setMinPriceFilter] = useState('')
  /*8*/ const [maxPriceFilter, setMaxPriceFilter] = useState('')
  /*9*/ const [categoryFilter, setCategoryFilter] = useState('')
  /*10*/const [brandFilter, setBrandFilter] = useState('')

  /*11*/const [isSortNameAsc, setIsSortNameAsc] = useState(false)
  /*12*/const [isSortNameDesc, setIsSortNameDesc] = useState(false)
  /*13*/const [isSortPriceAsc, setIsSortPriceAsc] = useState(false)
  /*14*/const [isSortPriceDesc, setIsSortPriceDesc] = useState(false)

  /*15*/const [isFiltered, setIsFiltered] = useState(false)
  /*16*/const [isSort, setIsSort] = useState(false)
  /*17*/const [isSearchAndSortOpen, setIsSearchAndSortOpen] = useState(false)

  const [totalData, setTotalData] = useState([])
  const [dataPage, setDataPage] = useState([])

  const dispatch = useDispatch()
  const {user, isLoggedSuccess} = useSelector(state => state.user)
  const {products, isLoading, isError, message, isSuccess, page, pages, pageSize, isLoaded, isDeleted} = useSelector((state) => state.product)

  const navigate = useNavigate()

  //Pagination from DB
  //const params = useParams()
  //const keyword = params.keyword
  //var pageNumber = params.pageNumber || 1
  
  //const [products, setProducts] = useState([])

  //const [searchParams] = useSearchParams()
  //const pageNumber = searchParams.get('page') || 1

  var categories = []
  var brands = []

  populateCategories(products)
  populateBrands(products)

  //Initial
  useEffect(() => {
    dispatch(getTopProducts())
    //dispatch(getProducts({keyword, pageNumber}))
    dispatch(getProducts())
    setTimeout(() => {dispatch(resetCrud())}, 2000)
  }, [])

  //Triggers after Products Load, Logged in and Delete
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

    if(isLoaded) {
      const indexOfLastPost = currentPage * postsPerPage
      const indexOfFirstPost = indexOfLastPost - postsPerPage
      if (products.length > postsPerPage) {
        var slice = products.slice(indexOfFirstPost, indexOfLastPost)
        setDataPage(slice)
      } else {
        setDataPage(products)
      }
      setTotalData(products)
    }

    /*
    return () => {              //Clear/Unmount.Return a function
        if(isSuccess) {
            dispatch(reset())
        }
    }
    */

  }, [dispatch, isSuccess, isLoggedSuccess, isLoaded, isDeleted])

  
  //Filtering
  useEffect(() => {
               
    var filteredPosts = products

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
    
    if(!nameFilter && !minPriceFilter && !maxPriceFilter && !categoryFilter && !brandFilter) {
      setIsFiltered(false)
      
      var indexOfLastPost = currentPage * postsPerPage
      var indexOfFirstPost = indexOfLastPost - postsPerPage
      var slice = products.slice(indexOfFirstPost, indexOfLastPost)
      setTotalData(products)
      setDataPage(slice)
    } else {
      var indexOfLastPost = currentPage * postsPerPage
      var indexOfFirstPost = indexOfLastPost - postsPerPage
      if (filteredPosts.length > postsPerPage) {
        var slice = filteredPosts.slice(indexOfFirstPost, indexOfLastPost)
        setDataPage(slice)
      } else {
        setDataPage(filteredPosts)
      }

      setTotalData(filteredPosts)
      setIsFiltered(true)
    }

    if(isSortNameAsc) {
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
      var aux = (mapped.map(function(item){
          return filteredPosts[item.index]
      }))

      setTotalData(aux)

      var indexOfLastPost = currentPage * postsPerPage
      var indexOfFirstPost = indexOfLastPost - postsPerPage
      if (aux.length > postsPerPage) {
        var slice = aux.slice(indexOfFirstPost, indexOfLastPost)
        setDataPage(slice)
      } else {
        setDataPage(aux)
      }
    }

    if(isSortNameDesc) {
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
      var aux = (mapped.map(function(item){
          return filteredPosts[item.index]
      }))

      aux = aux.reverse()

      setTotalData(aux)

      var indexOfLastPost = currentPage * postsPerPage
      var indexOfFirstPost = indexOfLastPost - postsPerPage
      if (aux.length > postsPerPage) {
        var slice = aux.slice(indexOfFirstPost, indexOfLastPost)
        setDataPage(slice)
      } else {
        setDataPage(aux)
      }
    }

    //Price Ascending
    if(isSortPriceAsc) {

      // array temporal contiene objetos con posición y valor de ordenamiento
      var mapped = filteredPosts.map(function(item, index) {
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
      var aux = mapped.map(function(item){
          return filteredPosts[item.index]
      })

      aux = aux.reverse()
      setTotalData(aux)

      var indexOfLastPost = currentPage * postsPerPage
      var indexOfFirstPost = indexOfLastPost - postsPerPage
      if (aux.length > postsPerPage) {
        var slice = aux.slice(indexOfFirstPost, indexOfLastPost)
        setDataPage(slice)
      } else {
        setDataPage(aux)
      }      
    }

    //Price Descending
    if(isSortPriceDesc) {

      // array temporal contiene objetos con posición y valor de ordenamiento
      var mapped = filteredPosts.map(function(item, index) {
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
      var aux = mapped.map(function(item){
          return filteredPosts[item.index]
      })

      setTotalData(aux)

      var indexOfLastPost = currentPage * postsPerPage
      var indexOfFirstPost = indexOfLastPost - postsPerPage
      if (aux.length > postsPerPage) {
        var slice = aux.slice(indexOfFirstPost, indexOfLastPost)
        setDataPage(slice)
      } else {
        setDataPage(aux)
      }
    }

    if(currentPage !==1) {
      paginate(1)
    }


  }, [nameFilter, minPriceFilter, maxPriceFilter, categoryFilter, brandFilter])

  
  //Sorting
  useEffect(() => {

    console.log('Lets sort')

    //Name Ascending
    if (isSortNameAsc) {


      // array temporal contiene objetos con posición y valor de ordenamiento
      var mapped = totalData.map(function(item, index) {
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
      var aux = (mapped.map(function(item){
          return totalData[item.index]
      }))

      console.log(aux)
      setTotalData(aux)

      var indexOfLastPost = currentPage * postsPerPage
      var indexOfFirstPost = indexOfLastPost - postsPerPage
      if (aux.length > postsPerPage) {
        var slice = aux.slice(indexOfFirstPost, indexOfLastPost)
        setDataPage(slice)
      } else {
        setDataPage(aux)
      }
    }

    //Name Descending
    if (isSortNameDesc) {

      // array temporal contiene objetos con posición y valor de ordenamiento
      var mapped = totalData.map(function(item, index) {
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
      var aux = (mapped.map(function(item){
          return totalData[item.index]
      }))

      aux = aux.reverse()
      setTotalData(aux)

      var indexOfLastPost = currentPage * postsPerPage
      var indexOfFirstPost = indexOfLastPost - postsPerPage
      if (aux.length > postsPerPage) {
        var slice = aux.slice(indexOfFirstPost, indexOfLastPost)
        setDataPage(slice)
      } else {
        setDataPage(aux)
      }
    }

    //Price Ascending
    if(isSortPriceAsc) {

      // array temporal contiene objetos con posición y valor de ordenamiento
      var mapped = totalData.map(function(item, index) {
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
      var aux = mapped.map(function(item){
          return totalData[item.index]
      })

      aux = aux.reverse()
      setTotalData(aux)

      var indexOfLastPost = currentPage * postsPerPage
      var indexOfFirstPost = indexOfLastPost - postsPerPage
      if (aux.length > postsPerPage) {
        var slice = aux.slice(indexOfFirstPost, indexOfLastPost)
        setDataPage(slice)
      } else {
        setDataPage(aux)
      }

    }

    //Price Descending
    if(isSortPriceDesc) {

      // array temporal contiene objetos con posición y valor de ordenamiento
      var mapped = totalData.map(function(item, index) {
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
      var aux = mapped.map(function(item){
          return totalData[item.index]
      })

      setTotalData(aux)

      var indexOfLastPost = currentPage * postsPerPage
      var indexOfFirstPost = indexOfLastPost - postsPerPage
      if (aux.length > postsPerPage) {
        console.log('Lets paginate the sorted array')
        var slice = aux.slice(indexOfFirstPost, indexOfLastPost)
        setDataPage(slice)
      } else {
        console.log('The sorted array is show in 1 page')
        setDataPage(aux)
      }
    }

    //Control
    if(!isSortNameAsc && !isSortNameDesc && !isSortPriceAsc && !isSortPriceDesc) {
      setIsSort(false)
    } else {
      setIsSort(true)
    }

    //Always start in the page 1
    if(currentPage !==1) {
      paginate(1)
    }

  }, [isSortNameAsc, isSortNameDesc, isSortPriceAsc, isSortPriceDesc])
  

  //Change Page
  useEffect(() => {
    console.log('Change of Page');
    const indexOfLastPost = currentPage * postsPerPage
    const indexOfFirstPost = indexOfLastPost - postsPerPage
    var slice = totalData.slice(indexOfFirstPost, indexOfLastPost)
    setDataPage(slice)  
  }, [currentPage])

  //No Sorting or Filtering. Back to original order
  useEffect(() => {
    if(!isSortNameAsc && !isSortNameDesc && !isSortPriceAsc && !isSortPriceDesc && !nameFilter && !minPriceFilter && !maxPriceFilter && !categoryFilter && !brandFilter) {
      const indexOfLastPost = currentPage * postsPerPage
      const indexOfFirstPost = indexOfLastPost - postsPerPage
      if (products.length > postsPerPage) {
        var slice = products.slice(indexOfFirstPost, indexOfLastPost)
        setDataPage(slice)
      } else {
        setDataPage(products)
      }
      setTotalData(products)
    }
  }, [isSortNameAsc, isSortNameDesc, isSortPriceAsc, isSortPriceDesc, nameFilter, minPriceFilter, maxPriceFilter, categoryFilter, brandFilter])


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

  //Change page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  //Populate Selects
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

  const chooseTypeOfSort = (option) => {
    option = Number(option)
    switch (option) {
      case 1:
        setIsSortNameDesc(false)
        setIsSortPriceAsc(false)
        setIsSortPriceDesc(false)
        setIsSortNameAsc(!isSortNameAsc)
        break
      
      case 2:
        setIsSortNameAsc(false)
        setIsSortPriceAsc(false)
        setIsSortPriceDesc(false)
        setIsSortNameDesc(!isSortNameDesc)
        console.log('Option 2')
        break

      case 3:
        setIsSortNameAsc(false)
        setIsSortNameDesc(false)
        setIsSortPriceDesc(false)
        setIsSortPriceAsc(!isSortPriceAsc)
        console.log('Option 3')
        break
        
        case 4:
        setIsSortNameAsc(false)
        setIsSortNameDesc(false)
        setIsSortPriceAsc(false)
        setIsSortPriceDesc(!isSortPriceDesc)
        console.log('Option 4')
        break

      default:
        break;
    }
  }

  const sortNameAsc = () => {
    setIsSortNameDesc(false)
    setIsSortPriceAsc(false)
    setIsSortPriceDesc(false)
    setIsSortNameAsc(!isSortNameAsc)
  }

  const sortNameDesc = () => {
    setIsSortNameAsc(false)
    setIsSortPriceAsc(false)
    setIsSortPriceDesc(false)
    setIsSortNameDesc(!isSortNameDesc)
  }

  const sortPriceAsc = () => {
    setIsSortNameAsc(false)
    setIsSortNameDesc(false)
    setIsSortPriceDesc(false)
    setIsSortPriceAsc(!isSortPriceAsc)
  }

  const sortPriceDesc = () => {
    setIsSortNameAsc(false)
    setIsSortNameDesc(false)
    setIsSortPriceAsc(false)
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
        <>
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
        
            <Col md lg="4" className='mb-3'>
              <Form.Label>Sort</Form.Label>
              <Form.Select aria-label="Default select example" onChange={(e) => chooseTypeOfSort(e.target.value)} >
                <option value="">Seleccione una forma de ordenar</option>
                <option value="1">Sort By Name Ascending A-Z</option>
                <option value="2">Sort By Name Descending Z-A</option>
                <option value="3">Sort By Major Price</option>
                <option value="4">Sort By Less Price</option>
                <option value="5">New Products</option>
                <option value="6">Most Seen</option>
                <option value="7">Most Shopped</option>
                <option value="8">Best Ranked</option>
              </Form.Select>
            </Col>
          
        </>
      )}


      {(!isFiltered && !isSort) && <HomeCarousel />}
      {(isFiltered || isSort) ? dataPage.length > 0 ? <h3>Results</h3> :<h5 style={{color: 'red', marginTop: '3px'}}>No results</h5> :<h1>LATEST PRODUCTS</h1>}
      {totalData.length <= postsPerPage  ? `${totalData.length} Results` : `${postsPerPage} of ${totalData.length} Results` }
        <Row>
            {dataPage.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                    <Product product={product} preDeleteProduct={preDeleteProduct}/>             
              </Col> 
            ))}
        </Row>
        {/* <Paginate pages={pages} page={page} keyword={keyword ? keyword : ''}/> */}

        {totalData.length > postsPerPage && <Pagination postsPerPage={postsPerPage} totalPosts={products.length} paginate={paginate} currentPage={currentPage} />}
        
    </>
  )
}

export default Home