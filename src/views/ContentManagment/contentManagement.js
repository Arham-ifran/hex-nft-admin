import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ENV } from '../../config/config';
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';
import localeInfo from 'rc-pagination/lib/locale/en_US';
import Swal from 'sweetalert2';
import { getRole, beforeRole } from 'views/AdminStaff/permissions/permissions.actions';
import { getContentPages, beforeContent, deleteContent } from './cms.action';
import { Button, Card, Form, Table, Container, Row, Col, OverlayTrigger, Tooltip, Modal } from "react-bootstrap";
var CryptoJS = require("crypto-js");

const Faq = (props) => {
    const dispatch = useDispatch()
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState()
    const [status, setStatus] = useState(true)
    const [slug, setSlug] = useState('')
    const [pagination, setPagination] = useState(null)
    const [contentPages, setContentPages] = useState({})
    const [loader, setLoader] = useState(true)
    const [permissions, setPermissions] = useState({})
    const [contentModal, setContentModal] = useState(false)
    const [searchTitle, setSearchTitle] = useState('')
    const [searchStatus, setSearchStatus] = useState('')
    const [searchSlug, setSearchSlug] = useState('')

    const getContentPagesRes = useSelector(state => state.content.getContentPagesRes)
    const getRoleRes = useSelector(state => state.role.getRoleRes)
    const deleteContentRes = useSelector(state => state.content.deleteContentRes)

    useEffect(() => {
        window.scroll(0, 0)
        let roleEncrypted = localStorage.getItem('role');
        let role = ''
        if (roleEncrypted) {
            let roleDecrypted = CryptoJS.AES.decrypt(roleEncrypted, ENV.secretKey).toString(CryptoJS.enc.Utf8);
            role = roleDecrypted
            dispatch(getRole(role))
        }
        dispatch(getContentPages())
    }, [])

    useEffect(() => {
        if (Object.keys(getRoleRes).length > 0) {
            setPermissions(getRoleRes.role)
            dispatch(beforeRole())
        }
    }, [getRoleRes])

    useEffect(() => {
        if (getContentPagesRes && Object.keys(getContentPagesRes).length > 0) {
            setLoader(false)
            setContentPages(getContentPagesRes.contentPages)
            setPagination(getContentPagesRes.pagination)
            dispatch(beforeContent())
        }
    }, [getContentPagesRes])

    useEffect(() => {
        if (deleteContentRes && Object.keys(deleteContentRes).length > 0) {
            // setLoader(false)
            dispatch(getContentPages('', {}, false))
        }
    }, [deleteContentRes])


    const deleteContentPageHandler = (contentId) => {
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
                dispatch(deleteContent(contentId))
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
        if (searchSlug && searchSlug !== '')
            filter.slug = searchSlug

        setLoader(true)
        const qs = ENV.objectToQueryString({ page })
        dispatch(getContentPages(qs, filter))
    }

    const setModal = (data) => {
        setContentModal(!contentModal)
        setTitle(data.title)
        setSlug(data.slug)
        setDescription(data.description)
        setStatus(data.status)
    }

    const applyFilters = () => {
        const filter = {}
        if (searchTitle && searchTitle !== '') {
            filter.title = searchTitle
        }
        if (searchStatus !== '') {
            filter.status = searchStatus === 'true' ? true : false
        }
        if (searchSlug && searchSlug !== '') {
            filter.slug = searchSlug
        }

        const qs = ENV.objectToQueryString({ page: 1, limit: 10 })
        dispatch(getContentPages(qs, filter))
        setLoader(true)
    }

    const reset = () => {
        setSearchTitle('')
        setSearchStatus('')
        setSearchSlug('')
        dispatch(getContentPages())
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
                                                    <Form.Control type="text" value={searchTitle} placeholder="John Doe" onChange={(e) => setSearchTitle(e.target.value)} /*onKeyDown={} */ />
                                                </Form.Group>
                                            </Col>
                                            <Col xl={3} sm={6}>
                                                <Form.Group>
                                                    <label style={{ color: 'white' }}>Slug</label>
                                                    <Form.Control type="text" value={searchSlug} placeholder="john-doe- / john-" onChange={(e) => setSearchSlug(e.target.value)} /*onKeyDown={} */ />
                                                </Form.Group>
                                            </Col>
                                            <Col xl={3} sm={6}>
                                                <Form.Group>
                                                    <label style={{ color: 'white' }}>Status</label>
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
                                                        <Button className="btn-filled" onClick={applyFilters}>Search</Button>
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
                                            <Card.Title as="h4">Content Management</Card.Title>
                                            {/* <p className="card-category">List of FAQs</p> */}
                                            {
                                                permissions && permissions.addContent &&
                                                <Button
                                                    className="float-sm-right btn-filled"
                                                    onClick={() => props.history.push(`/add-cms`)}>
                                                    Add Content Page
                                                </Button>
                                            }
                                        </div>
                                    </Card.Header>
                                    <Card.Body className="table-full-width">
                                        <div className="table-responsive">
                                            <Table className="table-bigboy">
                                                <thead>
                                                    <tr>
                                                        <th className="serial-col">#</th>
                                                        <th>Title</th>
                                                        <th>Slug</th>
                                                        <th>Status</th>
                                                        <th className="td-actions text-center">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        contentPages && contentPages.length ?
                                                            contentPages.map((item, index) => {
                                                                return (
                                                                    <tr key={index}>
                                                                        <td className="serial-col text-white">{pagination && ((pagination.limit * pagination.page) - pagination.limit) + index + 1}</td>
                                                                        <td className="td-name text-weight text-white">
                                                                            {item.title}
                                                                        </td>
                                                                        <td className="td-name text-weight text-white">
                                                                            {item.slug}
                                                                        </td>
                                                                        <td className="td-name text-weight text-white">
                                                                            {/* <span className='label label-danger'>{item.status ? 'Active' : 'Inactive'}</span> */}
                                                                            <span className={`label ${item.status ? 'label-success' : 'label-danger'}`}>{item.status ? 'Active' : 'Inactive'}</span>
                                                                        </td>
                                                                        <td className="td-actions text-white text-center">
                                                                            <ul className="list-unstyled mb-0">
                                                                                <li className="d-inline-block align-top">
                                                                                    <OverlayTrigger overlay={<Tooltip id="tooltip-436082023"> View </Tooltip>} placement="left">
                                                                                        <Button
                                                                                            className="btn-link btn-icon"
                                                                                            type="button"
                                                                                            variant="info"
                                                                                            onClick={() => setModal(item)}
                                                                                        >
                                                                                            <i className="fa fa-eye"></i>
                                                                                        </Button>
                                                                                    </OverlayTrigger>
                                                                                </li>

                                                                                {
                                                                                    permissions && permissions.editContent &&
                                                                                    <li className="d-inline-block align-top">
                                                                                        <OverlayTrigger overlay={<Tooltip id="tooltip-436082023"> Edit </Tooltip>} placement="left">
                                                                                            <Button
                                                                                                className="btn-link btn-icon"
                                                                                                type="button"
                                                                                                variant="success"
                                                                                                onClick={() => props.history.push(`/edit-cms/${item._id}`)}
                                                                                            >
                                                                                                <i className="fas fa-edit"></i>
                                                                                            </Button>
                                                                                        </OverlayTrigger>
                                                                                    </li>
                                                                                }
                                                                                {
                                                                                    permissions && permissions.deleteContent &&
                                                                                    <li className="d-inline-block align-top">
                                                                                        <OverlayTrigger overlay={<Tooltip id="tooltip-334669391"> Delete </Tooltip>} placement="left">
                                                                                            <Button
                                                                                                className="btn-link btn-icon"
                                                                                                type="button"
                                                                                                variant="danger"
                                                                                                onClick={() => deleteContentPageHandler(item._id)}
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
                                                                    <div className="alert alert-info" role="alert">No Content Pages  Found</div>
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
                        {
                            contentPages &&
                            <Modal className="modal-primary" id="content-Modal" onHide={() => setContentModal(!contentModal)} show={contentModal}>
                                <Modal.Header className="justify-content-center">
                                    <Row>
                                        <div className="col-12">
                                            <h4 className="mb-0 mb-md-3 mt-0">
                                                View Content Page
                                            </h4>
                                        </div>
                                    </Row>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form>
                                        <Form.Group>
                                            <label className='text-white'>Title <span className="text-danger">*</span></label>
                                            <Form.Control
                                                readOnly
                                                type="text"
                                                value={title}
                                            />
                                        </Form.Group>
                                        <Form.Group>
                                            <label className='text-white'>Slug <span className="text-danger">*</span></label>
                                            <Form.Control
                                                readOnly
                                                type="text"
                                                value={slug}
                                            />
                                        </Form.Group>
                                        <Form.Group>
                                            <label className='text-white'>Description</label>
                                            <div className='text-white'
                                                dangerouslySetInnerHTML={{ __html: description }}
                                            ></div>

                                        </Form.Group>

                                        <Form.Group>
                                            {/* <label className='text-white'>Status</label>
                                            <label className="right-label-radio mr-3 mb-2">Active
                                                <input name="status" disabled type="radio" checked={status} value={status} />
                                                <span className="checkmark"></span>
                                            </label>
                                            <label className="right-label-radio mr-3 mb-2">Inactive
                                                <input name="status" disabled type="radio" checked={!status} value={!status} />
                                                <span className="checkmark"></span>
                                            </label> */}
                                            <label className='text-white'>Status</label>
                                            <div className='d-flex'>
                                                <label className="right-label-radio mr-3 mb-2">Active
                                                    <input name="status" disabled={props.modalType === 2} type="radio" checked={status} value={status} onChange={(e) => setStatus(true)} />
                                                    <span className="checkmark"></span>
                                                </label>
                                                <label className="right-label-radio mr-3 mb-2">Inactive
                                                    <input name="status" disabled={props.modalType === 2} type="radio" checked={!status} value={!status} onChange={(e) => setStatus(false)} />
                                                    <span className="checkmark"></span>
                                                </label>
                                            </div>
                                        </Form.Group>
                                    </Form>
                                </Modal.Body>

                                <Modal.Footer>
                                    <Button className="btn btn-danger" onClick={() => setContentModal(!contentModal)}>Close</Button>
                                </Modal.Footer>
                            </Modal>
                        }
                    </Container>
            }
        </>
    )
}

export default Faq;