import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { ENV } from '../../config/config';
import { beforeUser, getUsers, deleteUser } from './Users.action';
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';
import localeInfo from 'rc-pagination/lib/locale/en_US';
import moment from 'moment';
import Swal from 'sweetalert2';
import { Button, Card, Form, Table, Container, Row, Col, OverlayTrigger, Tooltip, Modal } from "react-bootstrap";
import userDefaultImg from '../../assets/img/transparent-placeholder.png'

const Users = (props) => {
    const [users, setUsers] = useState(null)
    const [pagination, setPagination] = useState(null)
    const [userModal, setUserModal] = useState(false)
    const [modalType, setModalType] = useState(0)
    const [user, setUser] = useState(null)
    const [loader, setLoader] = useState(true)
    const [searchUsername, setSearchName] = useState('')
    const [searchAddress, setSearchAddress] = useState('')
    const [searchAtFrom, setSearchCreatedAtFrom] = useState('')
    const [searchAtTo, setSearchCreatedAtTo] = useState('')


    useEffect(() => {
        window.scroll(0, 0)
        props.getUsers()
    }, [])


    useEffect(() => {
        if (props.user.getUserAuth) {
            const { users, pagination } = props.user
            setUsers(users)
            setPagination(pagination)
            props.beforeUser()
        }
    }, [props.user.getUserAuth])

    useEffect(() => {
        if (props.user.deleteUserAuth) {
            let filtered = users.filter((item) => {
                if (item._id !== props.user.userId)
                    return item
            })
            setUsers(filtered)
            props.beforeUser()
        }
    }, [props.user.deleteUserAuth])

    useEffect(() => {
        if (users) {
            setLoader(false)
            if (window.location.search) {
                const urlParams = new URLSearchParams(window.location.search);
                setModal(3, urlParams.get('userId'))
            }
        }
    }, [users])

    // when an error is received
    useEffect(() => {
        if (props.error.error)
            setLoader(false)
    }, [props.error.error])

    // set modal type
    const setModal = (type = 0, userId = null) => {
        setUserModal(!userModal)
        setModalType(type)
        setLoader(false)
        // add user
        if (type === 1) {
            let user = {
                name: '', image: '', description: '', status: false
            }
            setUser(user)
        }
        // edit or view user
        else if ((type === 2 || type === 3) && userId)
            getUser(userId)
    }

    const getUser = async (userId) => {
        setLoader(true)
        const userData = await users.find((elem) => String(elem._id) === String(userId))
        if (userData)
            setUser({ ...userData })
        setLoader(false)
    }

    const onPageChange = async (page) => {
        const filter = {}
        if (searchUsername) {
            filter.username = searchUsername

        }
        if (searchAddress) {
            filter.address = searchAddress

        }
        if (searchAtFrom) {
            filter.createdAtFrom = searchAtFrom

        }
        if (searchAtTo) {
            filter.createdAtTo = searchAtTo
        }

        setLoader(true)
        const qs = ENV.objectToQueryString({ page })
        props.getUsers(qs, filter, true)
    }

    const deleteUser = (userId) => {
        Swal.fire({
            title: 'Are you sure you want to delete?',
            html: 'If you delete an item, it would be permanently lost.',
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Delete'
        }).then(async (result) => {
            if (result.value) {
                setLoader(true)
                props.deleteUser(userId)
            }
        })
    }

    const applyFilters = () => {
        const filter = {}
        if (searchUsername) {
            filter.username = searchUsername
        }
        if (searchAddress) {
            filter.address = searchAddress

        }
        if (searchAtFrom) {
            filter.createdAtFrom = searchAtFrom
        }
        if (searchAtTo) {
            filter.createdAtTo = searchAtTo
        }

        const qs = ENV.objectToQueryString({ page: 1, limit: 10 })
        props.getUsers(qs, filter)
        setLoader(true)
    }

    const reset = () => {
        setSearchCreatedAtFrom('')
        setSearchCreatedAtTo('')
        setSearchAddress('')
        setSearchName('')
        props.getUsers()
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
                                                    <label style={{ color: 'white' }}>Name</label>
                                                    <Form.Control value={searchUsername} type="text" placeholder="John" onChange={(e) => setSearchName(e.target.value)} /*onKeyDown={} */ />
                                                </Form.Group>
                                            </Col>
                                            <Col xl={3} sm={6}>
                                                <label style={{ color: 'white' }}>Wallet Address</label>
                                                <Form.Control value={searchAddress} type="text" placeholder="Wallet Address" onChange={(e) => setSearchAddress(e.target.value)}/* onChange={} onKeyDown={} */ />
                                            </Col>
                                            <Col xl={3} sm={6}>
                                                <Form.Group>
                                                    <label style={{ color: 'white' }}>Created At From</label>
                                                    <Form.Control value={searchAtFrom} type="date" placeholder="mm/dd/yyyy" onChange={(e) => setSearchCreatedAtFrom(e.target.value)}/* onChange={} onKeyDown={} */ />
                                                </Form.Group>
                                            </Col>
                                            <Col xl={3} sm={6}>
                                                <Form.Group>
                                                    <label style={{ color: 'white' }}>Created At To</label>
                                                    <Form.Control value={searchAtTo} type="date" placeholder="mm/dd/yyyy" onChange={(e) => setSearchCreatedAtTo(e.target.value)}/* onChange={} onKeyDown={} */ />
                                                </Form.Group>
                                            </Col>

                                            <Col xl={3} sm={6}>
                                                <Form.Group>
                                                    <Form.Label className="d-block mb-2">&nbsp;</Form.Label>
                                                    <div className="d-flex justify-content-between filter-btns-holder">
                                                        <Button className="btn-filled" onClick={applyFilters}>Search</Button>
                                                        <Button variant="warning" className='outline-button' onClick={reset}>Reset</Button>
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
                                <span style={{ color: 'white' }}>{`Total : ${pagination?.total}`}</span>
                                <label>&nbsp;</label>
                            </Col>
                        </Row>
                        <Row>
                            <Col md="12">
                                <Card className="table-big-boy">
                                    <Card.Header>
                                        <div className="d-block d-md-flex align-items-center justify-content-between">
                                            <Card.Title as="h4">Users</Card.Title>
                                        </div>
                                    </Card.Header>
                                    <Card.Body className="table-full-width">
                                        <div className="table-responsive">
                                            <Table className="table-bigboy">
                                                <thead>
                                                    <tr>
                                                        <th className="serial-col">#</th>
                                                        <th className='text-center'>Image</th>
                                                        <th>Username</th>
                                                        {/* <th>Email</th> */}
                                                        <th>Address</th>
                                                        <th className="text-center">Created At</th>
                                                        <th className="td-actions text-center">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        users && users.length ?
                                                            users.map((user, index) => {
                                                                return (
                                                                    <tr key={index}>
                                                                        <td className="serial-col text-white">{pagination && ((pagination.limit * pagination.page) - pagination.limit) + index + 1}</td>
                                                                        <td>
                                                                            <div className="user-image">
                                                                                <img className="img-fluid" alt="User Image" src={user.profileImage ? user.profileImage : userDefaultImg} />
                                                                            </div>
                                                                        </td>
                                                                        <td className='text-white'>
                                                                            {user.username}
                                                                        </td>
                                                                        {/* <td>
                                                                            {user.email}
                                                                        </td> */}
                                                                        <td className='text-white'>
                                                                            {user.address}
                                                                        </td>
                                                                        <td className="td-number text-white text-center">{moment(user.createdAt).format('DD MMM YYYY')}</td>

                                                                        <td className="td-actions text-center">
                                                                            <ul className="list-unstyled mb-0 d-flex justify-content-center">
                                                                                <li className="d-inline-block align-top">
                                                                                    <OverlayTrigger overlay={<Tooltip id="tooltip-897993903">View</Tooltip>} placement="left" >
                                                                                        <Button
                                                                                            className="btn-link btn-icon"
                                                                                            type="button"
                                                                                            variant="info"
                                                                                            onClick={() => setModal(3, user._id)}
                                                                                        >
                                                                                            <i className="fas fa-eye"></i>
                                                                                        </Button>
                                                                                    </OverlayTrigger>
                                                                                </li>
                                                                                {/* <li className="d-inline-block align-top">
                                                                                    <OverlayTrigger overlay={<Tooltip id="tooltip-334669391">Delete</Tooltip>} placement="left">
                                                                                        <Button
                                                                                            className="btn-link btn-icon"
                                                                                            type="button"
                                                                                            variant="danger"
                                                                                            onClick={() => deleteUser(user._id)}
                                                                                        >
                                                                                            <i className="fas fa-trash"></i>
                                                                                        </Button>
                                                                                    </OverlayTrigger>
                                                                                </li> */}
                                                                            </ul>
                                                                        </td>

                                                                    </tr>
                                                                )
                                                            })
                                                            :
                                                            <tr>
                                                                <td colSpan="8" className="text-center">
                                                                    <div className="alert alert-info" role="alert">No User Found</div>
                                                                </td>
                                                            </tr>
                                                    }
                                                </tbody>
                                            </Table>
                                            <div className="pb-4">
                                                {pagination &&
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
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>

                        {
                            modalType > 0 && user &&
                            <Modal className="modal-primary" onHide={() => setUserModal(!userModal)} show={userModal}>
                                <Modal.Header className="justify-content-center">
                                    <Row>
                                        <div className="col-12">
                                            <h4 className="mb-0 mb-md-3 mt-0">
                                                {modalType === 1 ? 'Add' : modalType === 2 ? 'Edit' : ''} {user.username}
                                            </h4>
                                        </div>
                                    </Row>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form className="text-left">
                                        <Form.Group>
                                            <label className="label-font mr-2">Profile Image: </label>
                                            <div>
                                                <div className="user-view-image">
                                                    <img src={user.profileImage ? user.profileImage : userDefaultImg} />
                                                </div>
                                            </div>
                                        </Form.Group>
                                        {/* <div className="d-flex name-email">
                                            <Form.Group className="flex-fill d-flex align-items-center">
                                                <label className="label-font mr-2">Username: </label><span className="field-value text-white">{user.username}</span>
                                            </Form.Group>
                                        </div> */}
                                        {/* <div className="d-flex name-email">
                                            <Form.Group className="flex-fill">
                                                <label className="label-font mr-2">Email: </label><span className="field-value">{user.email}</span>
                                            </Form.Group>
                                        </div> */}
                                        <div className="d-flex name-email">
                                            <Form.Group className=' d-flex'>
                                                <label className="label-font mr-2">Description:</label><span className="field-value text-white"> {user.description ? user.description : 'N/A'}</span>
                                            </Form.Group>
                                        </div>
                                        <div className="d-flex name-email">
                                            <Form.Group className=' d-flex align-items-center'>
                                                <label className="label-font mr-2" l>Facebook: </label><span className="field-value text-white">{user.facebookLink ? user.facebookLink : 'N/A'}</span>
                                            </Form.Group>
                                        </div>
                                        <div className="d-flex name-email">
                                            <Form.Group className=' d-flex align-items-center'>
                                                <label className="label-font mr-2">Twitter: </label><span className="field-value text-white">{user.twitterLink ? user.twitterLink : 'N/A'}</span>
                                            </Form.Group>
                                        </div>
                                        <div className="d-flex name-email">
                                            <Form.Group className=' d-flex align-items-center'>
                                                <label className="label-font mr-2">G Plus: </label><span className="field-value text-white">{user.gPlusLink ? user.gPlusLink : 'N/A'}</span>
                                            </Form.Group>
                                        </div>
                                        <div className="d-flex name-email">
                                            <Form.Group className=' d-flex align-items-center'>
                                                <label className="label-font mr-2">Vine: </label><span className="field-value text-white">{user.vineLink ? user.vineLink : 'N/A'}</span>
                                            </Form.Group>
                                        </div>
                                    </Form>
                                </Modal.Body>
                                {/* <Modal.Footer>
                                    <Button className="btn btn-info" onClick={() => setUserModal(!userModal)}>Close</Button>
                                </Modal.Footer> */}
                                <Modal.Footer>
                                    {/* <Button className="btn btn-danger" onClick={() => setContentModal(!contentModal)}>Close</Button> */}
                                    {/* <Button className="btn btn-danger" onClick={() => onCloseHandler()}>Close</Button> */}
                                    {/* <Button className="btn btn-danger" onClick={() => setUserModal(!userModal)}>Close</Button> */}
                                    <Button className="outline-button" onClick={() => setUserModal(!userModal)}>Close</Button>
                                </Modal.Footer>
                            </Modal>
                        }
                    </Container>
            }
        </>
    )
}

const mapStateToProps = state => ({
    user: state.user,
    error: state.error,

});

export default connect(mapStateToProps, { beforeUser, getUsers, deleteUser })(Users);