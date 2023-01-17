import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { ENV } from '../../config/config';
import { beforeCollection, getCollections } from './Collection.action';
import { getCategories, beforeCategory } from '../Categories/Categories.action'
import { getUsers, beforeUser } from '../Users/Users.action'
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';
import localeInfo from 'rc-pagination/lib/locale/en_US';
import moment from 'moment';
import { Button, Card, Form, Table, Container, Row, Col, OverlayTrigger, Tooltip, Modal } from "react-bootstrap";
import colDefaultImg from '../../assets/img/placeholder.jpg'


const Collections = (props) => {
    const [collections, setCollections] = useState(null)
    const [owners, setOwners] = useState()
    const [categories, setCategories] = useState()
    const [pagination, setPagination] = useState(null)
    const [loader, setLoader] = useState(true)
    const [searchName, setSearchName] = useState('')
    const [searchAddress, setSearchAddress] = useState('')
    const [searchOwner, setSearchOwner] = useState('')
    const [searchCategory, setSearchCategory] = useState('')

    useEffect(() => {
        window.scroll(0, 0)
        props.getCollections()
        props.getCategories()
        props.getUsers()
    }, [])

    useEffect(() => {
        if (props.collection.getAuth) {
            const { collections, pagination } = props.collection
            let usersArray = []
            let categoriesArray = []
            // collections.map((collection) => {
            //     usersArray.push({name : collection.user.username , id : collection.user._id})
            //     categoriesArray.push({name : collection.category.name , id : collection.category._id})
            //     return 
            // })
            // setOwners(usersArray)
            // setCategories(categoriesArray)
            setCollections(collections)
            setPagination(pagination)
            props.beforeCollection()
        }
    }, [props.collection.getAuth])

    useEffect(() => {
        if (props.user.getUserAuth) {
            const { users, pagination } = props.user
            setOwners(users)
            props.beforeUser()
        }
    }, [props.user.getUserAuth])

    useEffect(() => {
        if (props.category.getCatAuth) {
            const { categories, pagination } = props.category
            setCategories(categories)
            props.beforeCategory()
        }
    }, [props.category.getCatAuth])


    useEffect(() => {
        if (collections) {
            setLoader(false)
        }
    }, [collections])

    // when an error is received
    useEffect(() => {
        if (props.error.error)
            setLoader(false)
    }, [props.error.error])

    // set modal type
    const setModal = (type = 0, collectionId = null) => {
        setLoader(false)
        if (type === 3 && collectionId)
            getCollection(collectionId)
    }

    const getCollection = async (collectionId) => {
        setLoader(true)
        props.history.push(`/collection/${collectionId}`)
    }

    const onPageChange = async (page) => {
        const filter = {}
        if (searchName) {
            filter.name = searchName
        }
        if (searchAddress) {
            filter.address = searchAddress
        }
        if (searchOwner) {
            filter.userId = searchOwner
        }
        if (searchCategory) {
            filter.categoryId = searchCategory
        }

        setLoader(true)
        const qs = ENV.objectToQueryString({ page })
        props.getCollections(qs, filter)
    }

    const applyFilters = () => {
        const filter = {}

        if (searchName) {
            filter.name = searchName
        }
        if (searchAddress) {
            filter.address = searchAddress
        }
        if (searchOwner) {
            filter.userId = searchOwner
        }
        if (searchCategory) {
            filter.categoryId = searchCategory
        }
        const qs = ENV.objectToQueryString({ page: 1, limit: 10 })
        props.getCollections(qs, filter)
        setLoader(true)
    }

    const reset = () => {
        setSearchOwner('')
        setSearchCategory('')
        setSearchAddress('')
        setSearchName('')
        props.getCollections()
        setLoader(true)
    }

    return (
        <>
            {
                loader ?
                    <FullPageLoader />
                    :
                    <Container fluid>
                        <Row className="pb-3">
                            <Col sm={12}>
                                <Card className="filter-card">
                                    <Card.Header>
                                        <div className="d-block d-md-flex align-items-center justify-content-between">
                                            <Card.Title as="h4">Filters</Card.Title>
                                            {/* <p className="card-collection">List of Auctions</p> */}
                                        </div>
                                    </Card.Header>
                                    <Card.Body>
                                        <Row>
                                            <Col xl={3} sm={6}>
                                                <Form.Group>
                                                    <label className='text-white'>Name</label>
                                                    <Form.Control value={searchName} type="text" placeholder="John" onChange={(e) => setSearchName(e.target.value)} /*onKeyDown={} */ />
                                                </Form.Group>
                                            </Col>
                                            <Col xl={3} sm={6}>
                                                <Form.Group>
                                                    <label className='text-white'>Owner</label>
                                                    <select value={searchOwner} onChange={(e) => setSearchOwner(e.target.value)}>
                                                        <option value="">Select Owner</option>
                                                        {
                                                            owners && owners.length ?
                                                                owners.map((owner, index) => {
                                                                    return <option key={index} value={owner._id}>{owner.username}</option>
                                                                })
                                                                :
                                                                <option >No owners found</option>

                                                        }
                                                    </select>
                                                </Form.Group>
                                            </Col>
                                            <Col xl={3} sm={6}>
                                                <Form.Group>
                                                    <label className='text-white'>Category</label>
                                                    <select value={searchCategory} onChange={(e) => setSearchCategory(e.target.value)}>
                                                        <option value="">Select Category</option>
                                                        {
                                                            categories && categories.length ?
                                                                categories.map((category, index) => {
                                                                    return <option key={index} value={category._id}>{category.name}</option>
                                                                })
                                                                :
                                                                <option >No categories found</option>

                                                        }
                                                    </select>
                                                </Form.Group>
                                            </Col>
                                            <Col xl={3} sm={6}>
                                                <label className='text-white'>Address</label>
                                                <Form.Control value={searchAddress} type="text" placeholder="Wallet Address" onChange={(e) => setSearchAddress(e.target.value)}/* onChange={} onKeyDown={} */ />
                                            </Col>
                                            <Col xl={3} sm={6}>
                                                <Form.Group>
                                                    <Form.Label className="d-block mb-2">&nbsp;</Form.Label>
                                                    <div className="d-flex justify-content-between filter-btns-holder">
                                                        <Button className='btn-filled' onClick={applyFilters}>Search</Button>
                                                        <Button className='outline-button' onClick={reset}>Reset</Button>
                                                    </div>

                                                </Form.Group>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <span className='text-white'>{`Total : ${pagination?.total}`}</span>
                                <label>&nbsp;</label>
                            </Col>
                        </Row>
                        <Row>
                            <Col md="12">
                                <Card className="table-big-boy">
                                    <Card.Header>
                                        <div className="d-block d-md-flex align-items-center justify-content-between">
                                            <Card.Title as="h4">Collections</Card.Title>
                                            {/* <p className="card-collection">List of Collections</p> */}
                                        </div>
                                    </Card.Header>
                                    <Card.Body className="table-full-width">
                                        <div className="table-responsive">
                                            <Table className="table-bigboy">
                                                <thead>
                                                    <tr>
                                                        <th className=" serial-col">#</th>
                                                        <th className='text-center'>Logo</th>
                                                        <th>Name</th>
                                                        <th>User</th>
                                                        <th>Category</th>
                                                        <th className="text-center">Created At</th>
                                                        <th className="td-action text-center">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        collections && collections.length ?
                                                            collections.map((collection, index) => {
                                                                return (
                                                                    <tr key={index}>
                                                                        <td className="serial-col text-white">{pagination && ((pagination.limit * pagination.page) - pagination.limit) + index + 1}</td>
                                                                        <td>
                                                                            <div className="user-image">
                                                                                <img className="img-fluid" alt="Collection logo" src={collection.logo || colDefaultImg} />
                                                                            </div>
                                                                        </td>
                                                                        <td className="text-white">
                                                                            {collection.name}
                                                                        </td>
                                                                        <td className='text-white'>
                                                                            {collection.user.username}
                                                                        </td>
                                                                        <td className='text-white'>
                                                                            {collection.category ? collection.category.name : 'N/A'}
                                                                        </td>
                                                                        <td className="td-number text-white text-center">{moment(collection.createdAt).format('DD MMM YYYY')}</td>
                                                                        <td className="td-actions text-center">
                                                                            <ul className="list-unstyled mb-0">
                                                                                <li className="d-inline-block align-top">
                                                                                    <OverlayTrigger overlay={<Tooltip id="tooltip-897993903">View</Tooltip>} placement="left">
                                                                                        <Button className="btn-link btn-icon" type="button" variant="info" onClick={() => setModal(3, collection._id)}>
                                                                                            <i className="fas fa-eye"></i>
                                                                                        </Button>
                                                                                    </OverlayTrigger>
                                                                                </li>
                                                                            </ul>
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            })
                                                            :
                                                            <tr>
                                                                <td colSpan="7" className="text-center">
                                                                    <div className="alert alert-info" role="alert">No Collection Found</div>
                                                                </td>
                                                            </tr>
                                                    }
                                                </tbody>
                                            </Table>
                                            {
                                                pagination &&
                                                <Pagination
                                                    className="m-3"
                                                    defaultCurrent={1}
                                                    pageSize // items per page
                                                    current={pagination.page} // current active page
                                                    total={pagination.pages} // total pages
                                                    onChange={onPageChange}
                                                    locale={localeInfo}
                                                />
                                            }
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
            }
        </>
    )
}

const mapStateToProps = state => ({
    collection: state.collection,
    category: state.category,
    user: state.user,
    error: state.error,

});

export default connect(mapStateToProps, { beforeCollection, getCollections, getCategories, beforeCategory, getUsers, beforeUser })(Collections);