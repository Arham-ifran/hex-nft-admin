import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { ENV } from '../../config/config';
import { beforeFaq, getFaqs, deleteFaq } from './Faq.action';
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';
import localeInfo from 'rc-pagination/lib/locale/en_US';
import Swal from 'sweetalert2';
import { getRole, beforeRole } from 'views/AdminStaff/permissions/permissions.actions';
import { Button, Card, Form, Table, Container, Row, Col, OverlayTrigger, Tooltip, Modal } from "react-bootstrap";
import { faPeopleArrows } from '@fortawesome/free-solid-svg-icons';
import EditFaq from './EditFaq';
var CryptoJS = require("crypto-js");

const Faq = (props) => {
    const [data, setData] = useState(null)
    const [pagination, setPagination] = useState(null)
    const [loader, setLoader] = useState(true)
    const [permissions, setPermissions] = useState({})
    const [searchTitle, setSearchTitle] = useState('')
    const [searchStatus, setSearchStatus] = useState('')


    useEffect(() => {
        window.scroll(0, 0)
        const qs = ENV.objectToQueryString({ page: 1, limit: 10 })
        props.getFaqs()
        let roleEncrypted = localStorage.getItem('role');
        let role = ''
        if (roleEncrypted) {
            let roleDecrypted = CryptoJS.AES.decrypt(roleEncrypted, ENV.secretKey).toString(CryptoJS.enc.Utf8);
            role = roleDecrypted
            props.getRole(role)
        }
    }, [])

    useEffect(() => {
        if (Object.keys(props.getRoleRes).length > 0) {
            setPermissions(props.getRoleRes.role)
            props.beforeRole()
        }
    }, [props.getRoleRes])

    useEffect(() => {
        if (props.faqs.getFaqsAuth) {
            let { faqs, pagination } = props.faqs.faqs
            setData(faqs)
            setPagination(pagination)
            props.beforeFaq()
        }
    }, [props.faqs.getFaqsAuth])

    useEffect(() => {
        if (data) {
            setLoader(false)
        }
    }, [data])

    useEffect(() => {
        if (props.faqs.delFaqAuth) {
            let filtered = data.filter((item) => {
                if (item._id !== props.faqs.faq.faqId)
                    return item
            })
            setData(filtered)
            props.beforeFaq()
        }
    }, [props.faqs.delFaqAuth])

    const deleteFAQ = (faqId) => {
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
                props.deleteFaq(faqId)
            }
        })
    }

    const onPageChange = async (page) => {
        const filter = {}
        if (searchTitle && searchTitle !== '') {
            filter.name = searchTitle
        }
        if (searchStatus !== '') {
            filter.status = searchStatus === 'true' ? true : false
        }

        setLoader(true)
        const qs = ENV.objectToQueryString({ page })
        props.getFaqs(qs, filter)
    }

    const applyFilters = () => {
        const filter = {}
        if (searchTitle && searchTitle !== '') {
            filter.title = searchTitle
        }
        if (searchStatus !== '') {
            filter.status = searchStatus === 'true' ? true : false
        }

        const qs = ENV.objectToQueryString({ page: 1, limit: 10 })
        props.getFaqs(qs, filter)
        setLoader(true)
    }

    const reset = () => {
        setSearchTitle('')
        setSearchStatus('')
        props.getFaqs()
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
                                                    <label style={{ color: 'white' }}>Title</label>
                                                    <Form.Control type="text" value={searchTitle} placeholder="John" onChange={(e) => setSearchTitle(e.target.value)} /*onKeyDown={} */ />
                                                </Form.Group>
                                            </Col>
                                            <Col xl={3} sm={6}>
                                                <label style={{ color: 'white' }}>Status</label>
                                                <Form.Group>
                                                    <select value={searchStatus} onChange={(e) => setSearchStatus(e.target.value)}>
                                                        <option value="">Select Status</option>
                                                        <option value='true'>Active</option>
                                                        <option value="false">Inactive</option>
                                                    </select>
                                                </Form.Group>
                                            </Col>

                                            <Col xl={3} sm={6}>
                                                <Form.Group>
                                                    <Form.Label className="d-block mb-2">&nbsp;</Form.Label>
                                                    <div className="d-flex justify-content-between filter-btns-holder">
                                                        <Button className='btn-filled' onClick={applyFilters}>Search</Button>
                                                        <Button className="outline-button" onClick={reset}>Reset</Button>
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
                                            <Card.Title as="h4">FAQs</Card.Title>
                                            {/* <p className="card-category">List of FAQs</p> */}
                                            {
                                                permissions && permissions.addFaq &&
                                                <Button
                                                    className="float-sm-right btn-filled"
                                                    onClick={() => props.history.push(`/add-faq`)}>
                                                    Add FAQ
                                                </Button>
                                            }
                                        </div>
                                    </Card.Header>
                                    <Card.Body className="table-full-width">
                                        <div className="table-responsive">
                                            <Table className="table-bigboy table-w">
                                                <thead>
                                                    <tr>
                                                        <th className="td-start serial-col">#</th>
                                                        <th className="td-name">
                                                            <div className='faqs-title'>Title</div>
                                                        </th>
                                                        <th className="td-name">
                                                            <div className='faqs-title'>Description</div>
                                                        </th>
                                                        <th>Status</th>
                                                        <th className="td-actions text-center">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        data && data.length ?
                                                            data.map((item, index) => {
                                                                return (
                                                                    <tr key={index}>
                                                                        <td className="serial-col text-white">{pagination && ((pagination.limit * pagination.page) - pagination.limit) + index + 1}</td>
                                                                        <td className="text-white">
                                                                            <div className="faq-title">
                                                                                {item.title}
                                                                            </div>
                                                                        </td>
                                                                        <td className="text-white">
                                                                            <div className='faq-title' dangerouslySetInnerHTML={{ __html: item.desc || 'N/A' }} />
                                                                        </td>
                                                                        <td className="text-white">
                                                                            <span className={`label ${item.status ? 'label-success' : 'label-danger'}`}>{item.status ? 'Active' : 'Inactive'}</span>
                                                                        </td>
                                                                        <td className="td-actions">
                                                                            <ul className="list-unstyled mb-0 d-flex justify-content-center align-items-center">
                                                                                {
                                                                                    permissions && permissions.editFaq &&
                                                                                    <li className="d-inline-block align-top">
                                                                                        <OverlayTrigger overlay={<Tooltip id="tooltip-436082023"> Edit </Tooltip>} placement="left">
                                                                                            <Button
                                                                                                className="btn-link btn-icon"
                                                                                                type="button"
                                                                                                variant="success"
                                                                                                onClick={() => props.history.push(`/edit-faq/${item._id}`)}
                                                                                            >
                                                                                                <i className="fas fa-edit"></i>
                                                                                            </Button>
                                                                                        </OverlayTrigger>
                                                                                    </li>
                                                                                }
                                                                                {
                                                                                    permissions && permissions.deleteFaq &&
                                                                                    <li className="d-inline-block align-top">
                                                                                        <OverlayTrigger overlay={<Tooltip id="tooltip-334669391"> Delete </Tooltip>} placement="left">
                                                                                            <Button
                                                                                                className="btn-link btn-icon"
                                                                                                type="button"
                                                                                                variant="danger"
                                                                                                onClick={() => deleteFAQ(item._id)}
                                                                                            >
                                                                                                <i className="fas fa-trash"></i>
                                                                                            </Button>
                                                                                        </OverlayTrigger>
                                                                                    </li>
                                                                                }
                                                                            </ul>
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            })
                                                            :
                                                            <tr>
                                                                <td colSpan="5" className="text-center">
                                                                    <div className="alert alert-info" role="alert">No FAQ Found</div>
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
    faqs: state.faqs,
    error: state.error,
    getRoleRes: state.role.getRoleRes
});

export default connect(mapStateToProps, { beforeFaq, getFaqs, deleteFaq, getRole, beforeRole })(Faq);