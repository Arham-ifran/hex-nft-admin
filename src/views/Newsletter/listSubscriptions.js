import React, { useState, useEffect } from 'react';
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import { getRole, beforeRole } from 'views/AdminStaff/permissions/permissions.actions';
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';
import localeInfo from 'rc-pagination/lib/locale/en_US';
import { viewSubscriptions, beforeSubscription } from './newsletter.actions'
import { Button, Card, Form, Table, Container, Row, Col, OverlayTrigger, Tooltip, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from 'react-redux';
var CryptoJS = require("crypto-js");
import { ENV } from 'config/config';
import moment from 'moment';
import { toast } from 'react-toastify';
const ListSubscriptions = () => {

    const dispatch = useDispatch()

    const subscriptions = useSelector((state) => state.newsletter)
    const getRoleRes = useSelector((state) => state.role.getRoleRes)
    const error = useSelector((state) => state.error)

    const [subscribedUsers, setSubscribedUsers] = useState()
    const [pagination, setPagination] = useState(null)
    const [loader, setLoader] = useState(true)
    const [permissions, setPermissions] = useState({})
    const [searchEmail, setSearchEmail] = useState('')
    const [searchIp, setSearchIp] = useState('')



    useEffect(() => {
        window.scroll(0, 0)
        let roleEncrypted = localStorage.getItem('role');
        let role = ''
        if (roleEncrypted) {
            let roleDecrypted = CryptoJS.AES.decrypt(roleEncrypted, ENV.secretKey).toString(CryptoJS.enc.Utf8);
            role = roleDecrypted
            dispatch(getRole(role))
        }

        dispatch(viewSubscriptions())

    }, [])

    useEffect(() => {
        if (Object.keys(getRoleRes).length > 0) {
            setPermissions(getRoleRes.role)
            dispatch(beforeRole())
        }
    }, [getRoleRes])

    useEffect(() => {
        if (subscriptions.viewSubscriptionsAuth) {
            let data = subscriptions?.viewSubscriptions
            setSubscribedUsers(data.subscribedUsers?.length ? data.subscribedUsers : [])
            setPagination(data.pagination)
            dispatch(beforeSubscription())
        }
    }, [subscriptions.viewSubscriptionsAuth])

    useEffect(() => {
        if (subscribedUsers) {
            setLoader(false)
            toast.success('Subscribed Users fetched successfully!')
        }
    }, [subscribedUsers])

    // when an error is received
    useEffect(() => {
        if (error.error)
            setLoader(false)
    }, [error.error])

    const onPageChange = async (page) => {
        setLoader(true)

        let queryFilter = { page }

        if (searchEmail !== '') {
            queryFilter.userEmail = searchEmail
        }
        if (searchIp !== '') {
            queryFilter.ipAddress = searchIp
        }

        const qs = ENV.objectToQueryString(queryFilter)
        dispatch(viewSubscriptions(qs))
    }

    const applyFilters = () => {
        const queryFilter = { page : 1, limit : 10 }
        if (searchEmail !== '') {
            queryFilter.userEmail = searchEmail
        }
        if (searchIp !== '') {
            queryFilter.ipAddress = searchIp
        }

        const qs = ENV.objectToQueryString(queryFilter)
        dispatch(viewSubscriptions(qs))
        setLoader(true)
    }

    const reset = () => {
        setSearchEmail('')
        setSearchIp('')
        dispatch(viewSubscriptions())
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
                                        </div>
                                    </Card.Header>
                                    <Card.Body>
                                        <Row>
                                            <Col xl={3} sm={6}>
                                                <Form.Group>
                                                    <label style={{ color: 'white' }}>Email</label>
                                                    <Form.Control type="text" value={searchEmail} placeholder="John Doe" onChange={(e) => setSearchEmail(e.target.value)} /*onKeyDown={} */ />
                                                </Form.Group>
                                            </Col>
                                            <Col xl={3} sm={6}>
                                                <Form.Group>
                                                    <label style={{ color: 'white' }}>IP Address</label>
                                                    <Form.Control type="text" value={searchIp} placeholder="e.g. 192.162.12.2" onChange={(e) => setSearchIp(e.target.value)} /*onKeyDown={} */ />
                                                </Form.Group>
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
                                <span style={{ color: 'white' }}>{`Total : ${pagination?.total}`}</span>
                                <label>&nbsp;</label>
                            </Col>
                        </Row>
                        <Row>
                            <Col md="12">
                                <Card className="table-big-boy">
                                    <Card.Header>
                                        <div className="d-block d-md-flex align-items-center justify-content-between">
                                            <Card.Title as="h4">Newsletters</Card.Title>
                                        </div>
                                    </Card.Header>
                                    <Card.Body className="table-full-width">
                                        <div className="table-responsive">
                                            <Table className="table-bigboy">
                                                <thead>
                                                    <tr>
                                                        <th className="text-center serial-col">#</th>
                                                        <th>Email</th>
                                                        <th>Ip Address</th>
                                                        <th>Created At</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        subscribedUsers && subscribedUsers.length ?
                                                            subscribedUsers.map((user, index) => {
                                                                return (
                                                                    <tr key={index}>
                                                                        <td className="text-center serial-col text-white">{pagination && ((pagination.limit * pagination.page) - pagination.limit) + index + 1}</td>

                                                                        <td className='text-white'>
                                                                            {user.userEmail}
                                                                        </td>
                                                                        <td className='text-white'>
                                                                            {user.ipAddress}
                                                                        </td>
                                                                        <td className='text-white'>
                                                                            {moment(user.createdAt).format('DD MMM YYYY')}
                                                                        </td>

                                                                        {/* {
                                                                            permissions && permissions.editEmails &&
                                                                            <td className="td-actions text-center">
                                                                            <ul className="list-unstyled mb-0">
                                                                                <li className="d-inline-block align-top">
                                                                                    <OverlayTrigger overlay={ <Tooltip id="tooltip-436082023"> Edit </Tooltip> } placement="left" >
                                                                                        <Button
                                                                                            className="btn-link btn-icon"
                                                                                            type="button"
                                                                                            variant="success"
                                                                                            onClick={() => {
                                                                                                setLoader(true);
                                                                                                props.history.push(`/email-template/${email._id}`);
                                                                                            }}
                                                                                        >
                                                                                            <i className="fas fa-edit"></i>
                                                                                        </Button>
                                                                                    </OverlayTrigger>
                                                                                </li>
                                                                            </ul>
                                                                            </td>   
                                                                        } */}
                                                                    </tr>
                                                                )
                                                            })
                                                            :
                                                            <tr>
                                                                <td colSpan="4" className="text-center">
                                                                    <div className="alert alert-info" role="alert">No Subscribed Users Found</div>
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

export default ListSubscriptions;