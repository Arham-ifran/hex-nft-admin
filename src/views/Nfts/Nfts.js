import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { ENV } from '../../config/config';
import { beforeNfts, getNfts } from './nfts.action';
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';
import localeInfo from 'rc-pagination/lib/locale/en_US';
import { Button, Card, Form, Table, Container, Row, Col, OverlayTrigger, Tooltip, Modal, Navbar, Nav, NavDropdown } from "react-bootstrap";
import collectionDefaultImg from '../../assets/img/placeholder.jpg'
import placeholderImg from '../../assets/img/placeholder.png'
import Swal from 'sweetalert2';
import { beforeUser, getUsers } from '../../views/Users/Users.action'
import { beforeCategory, getCategories } from '../../views/Categories/Categories.action'
import { beforeCollection, getCollections } from '../../views/Collection/Collection.action'
import { ipfsToUrl } from 'utils/functions';

const Nfts = (props) => {
    const [nfts, setNfts] = useState(null)
    const [pagination, setPagination] = useState(null)
    const [nftModal, setNftModal] = useState(false)
    const [modalType, setModalType] = useState(0)
    const [nft, setNft] = useState(null)
    const [loader, setLoader] = useState(true)
    const [users, setUsers] = useState(null)
    const [categories, setCategories] = useState(null)
    const [collections, setCollections] = useState(null)
    const [filters, setFilters] = useState({
        status: '',
        min: '',
        max: '',
        collectionId: '',
        categoryId: '',
        creatorId: '',
        type: ''
    })
    const [price, setPrice] = useState({
        min: '',
        max: ''
    })

    useEffect(() => {
        window.scroll(0, 0)
        const qs = ENV.objectToQueryString({ all: true })
        props.getNfts()
        props.getUsers(qs, {}, false)
        props.getCategories(qs, {}, false)
        props.getCollections(qs, {}, false)
    }, [])

    useEffect(() => {
        if (props.nfts.getNftsAuth) {
            const { nfts, pagination } = props.nfts
            setNfts(nfts)
            setPagination(pagination)
            props.beforeNfts()
        }

    }, [props.nfts.getNftsAuth])

    useEffect(() => {
        if (props.user.getUserAuth) {
            const { users } = props.user
            users.sort((a, b) => a.username.localeCompare(b.username))
            setUsers(users)
            props.beforeUser()
        }
    }, [props.user.getUserAuth])

    useEffect(() => {
        if (props.collection.getAuth) {
            const { collections } = props.collection
            if (collections) {
                collections.sort((a, b) => a.name.localeCompare(b.name))
                setCollections(collections)
            }
            props.beforeCollection()
        }
    }, [props.collection.getAuth])

    useEffect(() => {
        if (props.category.getCatAuth) {
            const { categories } = props.category
            categories.sort((a, b) => a.name.localeCompare(b.name))
            setCategories(categories)
            props.beforeCategory()
        }
    }, [props.category.getCatAuth])

    useEffect(() => {
        if (nfts) {
            setLoader(false)
        }
    }, [nfts])

    // when an error is received
    useEffect(() => {
        if (props.error.error)
            setLoader(false)
    }, [props.error.error])

    // set modal type
    const setModal = (type = 0, nftId = null) => {
        setNftModal(!nftModal)
        setModalType(type)
        setLoader(false)
        if (type === 3 && nftId)
            getNft(nftId)
    }

    const getNft = async (nftId) => {
        setLoader(true)
        const nftData = await nfts.find((elem) => String(elem._id) === String(nftId))
        if (nftData)
            setNft({ ...nftData })
        setLoader(false)
    }

    const onPageChange = async (page) => {
        setLoader(true)
        const qs = ENV.objectToQueryString({ page, ...filters })
        props.getNfts(qs)
    }

    const filterReq = async (filterObj) => {
        setLoader(true)
        const qs = ENV.objectToQueryString(filterObj)
        props.getNfts(qs)
    }

    const onChangeMinMax = (e) => {
        const regex = /^[0-9\b]+$/;
        if (e.target.value === '' || regex.test(e.target.value)) {
            setFilters({ ...filters, [e.target.name]: e.target.value });
        }
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
                                                    <Form.Label className="d-block mb-2">Status</Form.Label>
                                                    <select className="form-select pr-3 mr-3" aria-label="Default select example" onChange={(e) => { setFilters({ ...filters, status: e.target.value }); }} value={filters.status} >
                                                        <option value={''}>Status</option>
                                                        <option value={1}>On Auction</option>
                                                        <option value={2}>Has Offer</option>
                                                        <option value={3}>New</option>
                                                    </select>
                                                </Form.Group>
                                            </Col>
                                            <Col xl={3} sm={6}>
                                                <Form.Group>
                                                    <Form.Label className="d-block mb-2">Type</Form.Label>
                                                    <select className="form-select pr-3 mr-3" aria-label="Default select example" onChange={(e) => { setFilters({ ...filters, type: e.target.value }); }} value={filters.type} >
                                                        <option value={''}>Type</option>
                                                        <option value={1}>NFT</option>
                                                        <option value={2}>NFTC</option>
                                                        <option value={3}>NFTD</option>
                                                        <option value={4}>NFTCD</option>
                                                    </select>
                                                </Form.Group>
                                            </Col>
                                            <Col xl={3} sm={6}>
                                                <Form.Group>
                                                    <Form.Label className="d-block mb-2">Collection</Form.Label>
                                                    <select className="form-select pr-3 mr-3" aria-label="Default select example" onChange={(e) => { setFilters({ ...filters, collectionId: e.target.value }); }} value={filters.collectionId}>
                                                        <option value={''}>
                                                            Collection
                                                        </option>
                                                        <option value={''}>
                                                            All
                                                        </option>
                                                        {
                                                            collections && collections.length ? collections.map((item, index) => {
                                                                return (
                                                                    <option key={index} value={item._id}>
                                                                        {item.name}
                                                                    </option>
                                                                )
                                                            }) : ''
                                                        }
                                                    </select>
                                                </Form.Group>
                                            </Col>
                                            <Col xl={3} sm={6}>
                                                <Form.Group>
                                                    <Form.Label className="d-block mb-2">Category</Form.Label>
                                                    <select className="form-select pr-3 mr-3" aria-label="Default select example" onChange={(e) => { setFilters({ ...filters, categoryId: e.target.value }); }} value={filters.categoryId}>
                                                        <option value={''}>
                                                            Category
                                                        </option>
                                                        <option value={''}>
                                                            All
                                                        </option>
                                                        {
                                                            categories && categories.length ? categories.map((item, index) => {
                                                                return (
                                                                    <option key={index} value={item._id}>
                                                                        {item.name}
                                                                    </option>
                                                                )
                                                            }) : ''
                                                        }
                                                    </select>
                                                </Form.Group>
                                            </Col>
                                            <Col xl={3} sm={6}>
                                                <Form.Group>
                                                    <Form.Label className="d-block mb-2">Creator</Form.Label>
                                                    <select className="form-select pr-3 mr-3" aria-label="Default select example" onChange={(e) => { setFilters({ ...filters, creatorId: e.target.value }); }} value={filters.creatorId}>
                                                        <option value={''}>
                                                            Creator
                                                        </option>
                                                        <option value={''}>
                                                            All
                                                        </option>
                                                        {
                                                            users && users.length ? users.map((item, index) => {
                                                                return (
                                                                    <option key={index} value={item._id}>
                                                                        {item.username}
                                                                    </option>
                                                                )
                                                            }) : ''
                                                        }
                                                    </select>
                                                </Form.Group>
                                            </Col>
                                            <Col xl={3} sm={6}>
                                                <Row>
                                                    <Col sm={6}>
                                                        <Form.Group>
                                                            <Form.Label className="d-block mb-2">Min Price</Form.Label>
                                                            <Form.Control type="text" name="min" value={filters.min} onChange={onChangeMinMax} />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col sm={6}>
                                                        <Form.Group>
                                                            <Form.Label className="d-block mb-2">Max Price</Form.Label>
                                                            <Form.Control type="text" name="max" value={filters.max} onChange={onChangeMinMax} />
                                                        </Form.Group>
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col xl={3} sm={6}>
                                                <Form.Group>
                                                    <Form.Label className="d-block mb-2">&nbsp;</Form.Label>
                                                    <div className="d-flex justify-content-between filter-btns-holder">
                                                        <Button className='btn-filled' onClick={(e) => { filterReq(filters); /* setFilters({ status: '', min: '', max: '', collectionId: '', categoryId: '', creatorId: '', type: '' });  */ }}>Search</Button>
                                                        <Button className='outline-button' onClick={(e) => { setFilters({ status: '', min: '', max: '', collectionId: '', categoryId: '', creatorId: '', type: '' }); filterReq({ status: '', min: '', max: '', collectionId: '', categoryId: '', creatorId: '', type: '' }); }}>Reset</Button>
                                                    </div>

                                                    <Nav className="me-auto">
                                                        {/* <NavDropdown title="Price" id="basic-nav-dropdown" className="pr-3 mr-3">
                                                            <Form className="p-3" onSubmit={(e) => { e.preventDefault(); setFilters({ ...filters, min: e.target[0].value, max: e.target[1].value }); filterReq({ ...filters, min: e.target[0].value, max: e.target[1].value }); }}>
                                                                <Form.Group>
                                                                    <Form.Label>Min</Form.Label>
                                                                    <Form.Control type="number" value={price.min} onChange={(e) => { setPrice({ ...price, min: e.target.value }) }} />
                                                                </Form.Group>
                                                                <Form.Group>
                                                                    <Form.Label>Min</Form.Label>
                                                                    <Form.Control type="number" value={price.max} onChange={(e) => { setPrice({ ...price, max: e.target.value }) }} />
                                                                </Form.Group>
                                                                <Form.Group>
                                                                    <Button variant="primary" type="submit">
                                                                        Submit
                                                                    </Button>
                                                                </Form.Group>
                                                            </Form>
                                                        </NavDropdown> */}

                                                    </Nav>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                        <Row>
                            <Col md="12">
                                <Card className="table-big-boy">
                                    <Card.Header>
                                        <div className="d-block d-md-flex align-items-center justify-content-between">
                                            <Card.Title as="h4">NFTs</Card.Title>
                                            {/* <p className="card-collection">List of NFTs</p> */}
                                        </div>
                                    </Card.Header>
                                    <Card.Body className="table-full-width">
                                        <div className="table-responsive">
                                            <Table className="table-bigboy">
                                                <thead>
                                                    <tr>
                                                        <th className=" serial-col">#</th>
                                                        <th className='text-center'>Image</th>
                                                        <th>Name</th>
                                                        <th>Owner</th>
                                                        <th>Creator</th>
                                                        <th>Price</th>
                                                        <th>Type</th>
                                                        <th>Collection</th>
                                                        <th className="td-action text-center">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        nfts && nfts.length ?
                                                            nfts.map((nft, index) => {
                                                                let status = ''
                                                                switch (nft.status) {
                                                                    case 1: status = 'Put On Sale';
                                                                        break;
                                                                    case 2: status = 'Instant Sale Price';
                                                                        break;
                                                                    case 3: status = 'Unlock Purchased';
                                                                        break;
                                                                    default: status = ''
                                                                }
                                                                return (
                                                                    <tr key={index}>
                                                                        <td className="serial-col text-white">{pagination && ((pagination.limit * pagination.page) - pagination.limit) + index + 1}</td>
                                                                        <td>
                                                                            <div>
                                                                                <div className="user-image">
                                                                                    <img src={nft.image ? ipfsToUrl(nft.image) : placeholderImg} className="img-fuild" />
                                                                                </div>
                                                                            </div>
                                                                        </td>
                                                                        <td className='text-white'>
                                                                            {nft.name}
                                                                        </td>
                                                                        <td className='text-white'>
                                                                            {nft.owner.username}
                                                                        </td>
                                                                        <td className='text-white'>
                                                                            {nft.creator.username}
                                                                        </td>
                                                                        <td className="text-white">
                                                                            {
                                                                                nft.currentPrice ?
                                                                                    nft.currentPrice + ' ' + nft.currency
                                                                                    : 'N/A'
                                                                            }
                                                                        </td>
                                                                        <td className='text-white'>
                                                                            {
                                                                                nft.type === 2 ?
                                                                                    nft.isStaked ?
                                                                                        'NFTCD'
                                                                                        :
                                                                                        'NFTC'
                                                                                    :
                                                                                    nft.isStaked ?
                                                                                        'NFTD'
                                                                                        :
                                                                                        'NFT'
                                                                            }
                                                                        </td>
                                                                        <td className="text-white">
                                                                            {nft.collection?.name ? nft.collection.name : 'N/A'}
                                                                        </td>
                                                                        {
                                                                            <td className="td-actions text-center">
                                                                                <ul className="list-unstyled mb-0">
                                                                                    <li className="d-inline-block align-top">
                                                                                        <OverlayTrigger overlay={<Tooltip id="tooltip-897993903">View</Tooltip>} placement="left">
                                                                                            <Button
                                                                                                className="btn-link btn-icon"
                                                                                                type="button"
                                                                                                variant="info"
                                                                                                onClick={() => props.history.push(`nft/${nft._id}`)}
                                                                                            >
                                                                                                <i className="fas fa-eye"></i>
                                                                                            </Button>
                                                                                        </OverlayTrigger>
                                                                                    </li>
                                                                                </ul>
                                                                            </td>
                                                                        }
                                                                    </tr>
                                                                )
                                                            })
                                                            :
                                                            <tr>
                                                                <td colSpan="10" className="text-center">
                                                                    <div className="alert alert-info" role="alert">No NFT Found</div>
                                                                </td>
                                                            </tr>
                                                    }
                                                </tbody>
                                            </Table>
                                            {
                                                pagination &&
                                                <Pagination
                                                    className="m-3 rc-pagination"
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

                        {
                            modalType > 0 && nfts &&
                            <Modal className="modal-primary" onHide={() => setNftModal(!nftModal)} show={nftModal}>
                                <Modal.Header className="justify-content-center">
                                    <Row className="label-font">{modalType === 1 ? 'Add' : modalType === 2 ? 'Edit' : ''} NFT</Row>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form>
                                        <div className="text-center">
                                            <Form.Group>
                                                <label className="label-font">Image: </label>
                                                <div>
                                                    <img src={nft.image ? ipfsToUrl(nft.image) : collectionDefaultImg} width="200" height="200" style={{ borderRadius: "8px" }} />
                                                </div>
                                            </Form.Group>
                                        </div>
                                        <div className="d-flex nft-flex">
                                            <Form.Group>
                                                <label className="label-font">Name: </label><span className="ml-2">{nft.name}</span>
                                            </Form.Group>

                                            <Form.Group>
                                                <label className="label-font">Current Price: </label><span className="ml-2">{nft.currentPrice} {nft.currency}</span>
                                            </Form.Group>
                                        </div>
                                        <div className="d-flex nft-flex">
                                            <Form.Group>
                                                <label className="label-font">Sold: </label><span className="ml-2">{nft.sold}</span>
                                            </Form.Group>

                                            <Form.Group>
                                                <label className="label-font">Copies: </label><span className="ml-2">{nft.copies}</span>
                                            </Form.Group>
                                        </div>
                                        <div className="d-flex nft-flex">
                                            <Form.Group>
                                                <label className="label-font">Status: </label><span className="ml-2">{nft.status === 1 ? 'Put On Sale' : nft.status === 2 ? 'Instant Sale Price' : nft.status === 3 ? 'Unlock Purchased' : ''}</span>
                                            </Form.Group>
                                            <Form.Group>
                                                <label className="label-font">Collection: </label><span className="ml-2">{nft.collection?.name ? nft.collection.name : 'N/A'}</span>
                                            </Form.Group>
                                        </div>
                                        <div className="d-flex nft-flex">
                                            <Form.Group>
                                                <label className="label-font">Creator: </label><span className="ml-2">{nft.creator.username}({nft.creator.email})</span>
                                            </Form.Group>
                                            <Form.Group>
                                                <label className="label-font">Owner: </label><span className="ml-2">{nft.owner.username}({nft.owner.email})</span>
                                            </Form.Group>
                                        </div>
                                    </Form>
                                </Modal.Body>

                                <Modal.Footer>
                                    <Button
                                        className="btn btn-close"
                                        onClick={() => setNftModal(!nftModal)}
                                        variant="link"
                                    >
                                        Close
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                        }
                    </Container>
            }
        </>
    )
}

const mapStateToProps = state => ({
    nfts: state.nfts,
    error: state.error,
    user: state.user,
    collection: state.collection,
    category: state.category,

});

export default connect(mapStateToProps, { beforeNfts, getNfts, beforeUser, getUsers, beforeCategory, getCategories, beforeCollection, getCollections })(Nfts);