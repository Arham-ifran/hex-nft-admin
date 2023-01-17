import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ENV } from '../../config/config';
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';
import localeInfo from 'rc-pagination/lib/locale/en_US';
import Swal from 'sweetalert2';
import { getRole, beforeRole } from 'views/AdminStaff/permissions/permissions.actions';
import { getNftReports, updateNftReport, deleteNftReport, addReportResponse, beforeReports, getReportMessages } from './nftReportings.action';
import { getUsers, beforeUser } from 'views/Users/Users.action';
import moment from 'moment';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { uploadPlugin } from '../../components/CkEditor/ckEditor'
import validator from 'validator';
import { Button, Card, Form, Table, Container, Row, Col, OverlayTrigger, Tooltip, Modal } from "react-bootstrap";
var CryptoJS = require("crypto-js");

const NftReportings = (props) => {
    const dispatch = useDispatch()
    const [admin, setAdmin] = useState()
    const [nftReportId, setNftReportId] = useState('')
    const [nftTitle, setNftTitle] = useState()
    const [description, setDescription] = useState('')
    const [status, setStatus] = useState()
    const [reportedTo, setReportedTo] = useState()
    const [reportedBy, setReportedBy] = useState()
    const [createdAt, setCreatedAt] = useState('')
    const [users, setUsers] = useState()
    const [pagination, setPagination] = useState(null)
    const [nftReports, setNftReports] = useState({})
    const [loader, setLoader] = useState(true)
    const [permissions, setPermissions] = useState({})
    const [reportsModal, setReportsModal] = useState(false)
    const [modalType, setModalType] = useState(0) // 0- Manage responses , 1- view , 2- edit
    const [messageContent, setContent] = useState()
    const [reportMessages, setReportMessages] = useState()
    const [msg, setMsg] = useState('')

    const [searchTitle, setSearchTitle] = useState('')
    const [searchStatus, setSearchStatus] = useState('')
    const [searchReportedTo, setSearchReportedTo] = useState('')
    const [searchReportedBy, setSearchReportedBy] = useState('')
    const [searchAtFrom, setSearchCreatedAtFrom] = useState('')
    const [searchAtTo, setSearchCreatedAtTo] = useState('')

    const getNftReportsRes = useSelector(state => state.reports.getNftReports)
    const getRoleRes = useSelector(state => state.role.getRoleRes)
    const user = useSelector(state => state.user)
    const deleteNftReportsRes = useSelector(state => state.reports.deleteNftReport)
    const updateNftReportRes = useSelector(state => state.reports.updateNftReport)
    const getReportMessagesRes = useSelector(state => state.reports.getReportMessagesRes)
    const getReportMessagesAuth = useSelector(state => state.reports.getReportMessagesAuth)
    const addReportRes = useSelector((state) => state.reports.addReportResponseData)

    useEffect(() => {
        window.scroll(0, 0)
        let id = localStorage.getItem('userID') ? localStorage.getItem('userID') : ''
        let name = localStorage.getItem('userName') ? localStorage.getItem('userName') : ''

        setAdmin({ id, name })
        let roleEncrypted = localStorage.getItem('role');
        let role = ''
        if (roleEncrypted) {
            let roleDecrypted = CryptoJS.AES.decrypt(roleEncrypted, ENV.secretKey).toString(CryptoJS.enc.Utf8);
            role = roleDecrypted
            dispatch(getRole(role))
        }
        
        dispatch(getNftReports())
        dispatch(getUsers())
    }, [])

    useEffect(() => {
        if (Object.keys(getRoleRes).length > 0) {
            setPermissions(getRoleRes.role)
            dispatch(beforeRole())
        }
    }, [getRoleRes])

    useEffect(() => {
        if (user.getUserAuth) {
            const { users } = user
            setUsers(users)
            beforeUser()
        }
    }, [user.getUserAuth])


    useEffect(() => {
        if (getNftReportsRes && Object.keys(getNftReportsRes).length > 0) {
            setLoader(false)
            setNftReports(getNftReportsRes.nftReports)
            // setReportedTo(getNftReportsRes.nftReports.reportedUser.)
            setPagination(getNftReportsRes.pagination)
            dispatch(beforeReports())
        }
    }, [getNftReportsRes])

    useEffect(() => {
        if (deleteNftReportsRes && Object.keys(deleteNftReportsRes).length > 0) {
            // setLoader(false)
            dispatch(getNftReports())
        }
    }, [deleteNftReportsRes])

    useEffect(() => {
        if (getReportMessagesRes.success) {
            setReportMessages(getReportMessagesRes.reportMessages)
            setLoader(false)
            dispatch(beforeReports())
        }
    }, [getReportMessagesRes])

    useEffect(()=>{
        if(addReportRes && Object.keys(addReportRes).length > 0){
            if(addReportRes.success){
                setLoader(false)
            }
        }

    },[addReportRes])


    const deleteNftReportHandler = (reportId) => {
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
                dispatch(deleteNftReport(reportId))
                dispatch(getNftReports())
            }
        })
    }

    const onPageChange = async (page) => {
        const filter = {}
        if (searchTitle && searchTitle !== '') {
            filter.name = searchTitle
        }
        if (searchStatus !== '') {
            filter.status = searchStatus
        }
        if (searchReportedTo && searchReportedTo !== '') {
            filter.reportedTo = searchReportedTo
        }

        if (searchReportedBy && searchReportedBy !== '') {
            filter.reportedBy = searchReportedBy
        }

        if (searchAtFrom && searchAtFrom !== '') {
            filter.createdAtFrom = searchAtFrom
        }

        if (searchAtTo && searchAtTo !== '') {
            filter.createdAtTo = searchAtTo
        }


        setLoader(true)
        const qs = ENV.objectToQueryString({ page })
        dispatch(getNftReports(qs, filter))
    }

    const setModal = (data, type) => {

        if (type === 0) {
            setContent('')
            dispatch(getReportMessages({ reportId: data._id }))
            setLoader(true)
        }
        setNftReportId(data._id)
        setModalType(type)
        setReportsModal(!reportsModal)
        setNftTitle(data.nft)
        setDescription(data.description)
        setStatus(data.status)
        setReportedBy(data.reportedFrom)
        setReportedTo(data.reportedUser)
        setCreatedAt(data.createdAt)
    }

    const applyFilters = () => {
        const filter = {}
        if (searchTitle && searchTitle !== '') {
            filter.nftId = searchTitle
        }
        if (searchStatus !== '') {
            filter.status = searchStatus
        }
        if (searchReportedTo && searchReportedTo !== '') {
            filter.reportedTo = searchReportedTo
        }

        if (searchReportedBy && searchReportedBy !== '') {
            filter.reportedBy = searchReportedBy
        }

        if (searchAtFrom && searchAtFrom !== '') {
            filter.createdAtFrom = searchAtFrom
        }

        if (searchAtTo && searchAtTo !== '') {
            filter.createdAtTo = searchAtTo
       }


        const qs = ENV.objectToQueryString({ page: 1, limit: 10 })
        dispatch(getNftReports(qs, filter))
        setLoader(true)
    }

    const reset = () => {
        setSearchTitle('')
        setSearchStatus('')
        setSearchReportedBy('')
        setSearchReportedTo('')
        setSearchCreatedAtTo('')
        setSearchCreatedAtFrom('')
        dispatch(getNftReports())
        setLoader(true)
    }

    const updateNftReportHandler = () => {
        let payload = {
            _id: nftReportId,
            status,
        }

        dispatch(updateNftReport(payload))
        dispatch(getNftReports())
        setLoader(true)
        setReportsModal(!reportsModal)
    }

    const onEditorChange = (event, editor) => {
        let editorData = editor.getData();
        setContent(editorData)
        setMsg('')
    }


    const addReportResponseHandler = () => {
        if(messageContent !== ''){
            setReportMessages([...reportMessages, { reportId: nftReportId, admin: { _id: admin.id, name: admin.name }, adminResponse: messageContent }])
        let payload = {
            reportId: nftReportId,
            id: admin.id,
            content: messageContent
        }
        setContent('')
        setMsg('')
        setLoader(true)
        dispatch(addReportResponse(payload, true))
        }
        else{
            setMsg('This field is required')
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
                                        </div>
                                    </Card.Header>
                                    <Card.Body>
                                        <Row>
                                            <Col xl={3} sm={6}>
                                                <Form.Group>
                                                    <label className='text-white'>NFT Title</label>
                                                    <Form.Control type="text" value={searchTitle} placeholder="John Doe" onChange={(e) => setSearchTitle(e.target.value)} /*onKeyDown={} */ />
                                                </Form.Group>
                                            </Col>
                                            <Col xl={3} sm={6}>
                                                <Form.Group>
                                                    <label className='text-white'>Reported To</label>
                                                    <select value={searchReportedTo} onChange={(e) => setSearchReportedTo(e.target.value)}>
                                                        <option value="">Select Reported To</option>
                                                        {
                                                            users && users.length ?
                                                                users.map((user, index) => {
                                                                    return <option key={index} value={user._id}>{user.username}</option>
                                                                })
                                                                :
                                                                <option >No users found</option>

                                                        }
                                                    </select>
                                                </Form.Group>
                                            </Col>
                                            <Col xl={3} sm={6}>
                                                <Form.Group>
                                                    <label className='text-white'>Reported By</label>
                                                    <select value={searchReportedBy} onChange={(e) => setSearchReportedBy(e.target.value)}>
                                                        <option value="">Select Reported By</option>
                                                        {
                                                            users && users.length ?
                                                                users.map((user, index) => {
                                                                    return <option key={index} value={user._id}>{user.username}</option>
                                                                })
                                                                :
                                                                <option >No users found</option>

                                                        }
                                                    </select>
                                                </Form.Group>
                                            </Col>
                                            <Col xl={3} sm={6}>
                                                <Form.Group>
                                                    <label className='text-white'>Status</label>
                                                    <select value={searchStatus} onChange={(e) => setSearchStatus(e.target.value)}>
                                                        <option value="">Select Status</option>
                                                        <option value='1'>Pending</option>
                                                        <option value="2">In Review</option>
                                                        <option value="3">Resolved</option>

                                                    </select>
                                                </Form.Group>
                                            </Col>
                                            <Col xl={3} sm={6}>
                                                <Form.Group>
                                                    <label className='text-white'>Created At From</label>
                                                    <Form.Control value={searchAtFrom} type="date" placeholder="mm/dd/yyyy" onChange={(e) => setSearchCreatedAtFrom(e.target.value)}/* onChange={} onKeyDown={} */ />
                                                </Form.Group>
                                            </Col>
                                            <Col xl={3} sm={6}>
                                                <Form.Group>
                                                    <label className='text-white'>Created At To</label>
                                                    <Form.Control value={searchAtTo} type="date" placeholder="mm/dd/yyyy" onChange={(e) => setSearchCreatedAtTo(e.target.value)}/* onChange={} onKeyDown={} */ />
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
                                <span className='text-white'>{`Total : ${pagination?.total}`}</span>
                                <label>&nbsp;</label>
                            </Col>
                        </Row>
                        <Row>
                            <Col md="12">
                                <Card className="table-big-boy">
                                    <Card.Header>
                                        <div className="d-block d-md-flex align-items-center justify-content-between">
                                            <Card.Title as="h4">NFTs Reporting</Card.Title>
                                        </div>
                                    </Card.Header>
                                    <Card.Body className="table-full-width">
                                        <div className="table-responsive">
                                            <Table className="table-bigboy">
                                                <thead>
                                                    <tr>
                                                        <th className="text-center serial-col">#</th>
                                                        <th>Nft Title</th>
                                                        <th>Reported To</th>
                                                        <th>Reported By</th>
                                                        <th className='reporting-status'>Status</th>
                                                        <th>Created At</th>
                                                        <th className="td-actions text-center">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        nftReports && nftReports.length ?
                                                            nftReports.map((item, index) => {
                                                                return (
                                                                    <tr key={index}>
                                                                        <td className="text-center serial-col text-white">{pagination && ((pagination.limit * pagination.page) - pagination.limit) + index + 1}</td>
                                                                        <td className="td-name text-weight text-white">
                                                                            {item.nft.name}
                                                                        </td>
                                                                        <td className="td-name text-weight text-white">
                                                                            {item.reportedUser.name}
                                                                        </td>
                                                                        <td className="td-name text-weight text-white">
                                                                            {item.reportedFrom.name}
                                                                        </td>
                                                                        <td>
                                                                            <span className={`text-white badge p-1 ${item.status === 1 ? `badge-danger` : item.status === 2 ? `badge-warning` : item.status === 3 ? `badge-success` : ``}`}>
                                                                                {item.status === 1 ? 'Pending' : item.status === 2 ? 'In Review' : 'Resolved'}
                                                                            </span>
                                                                        </td>
                                                                        <td className="td-name text-weight text-white">
                                                                            {moment(item.createdAt).format('DD MMM YYYY')}
                                                                        </td>
                                                                        <td className="td-actions">
                                                                            <ul className="list-unstyled mb-0">
                                                                                {
                                                                                    permissions && permissions.viewReportResponses &&
                                                                                    <li className="d-inline-block align-top">
                                                                                        <OverlayTrigger overlay={<Tooltip id="tooltip-436082023"> Manage Report Responses </Tooltip>} placement="left">
                                                                                            <Button
                                                                                                className="btn-link btn-icon"
                                                                                                type="button"
                                                                                                variant="success"
                                                                                                onClick={() => setModal(item, 0)}
                                                                                            >
                                                                                                <i className="fa fa-comments"></i>
                                                                                            </Button>
                                                                                        </OverlayTrigger>
                                                                                    </li>
                                                                                }
                                                                                {/* <li className="d-inline-block align-top">
                                                                                <OverlayTrigger overlay={ <Tooltip id="tooltip-436082023"> View </Tooltip>} placement="left">
                                                                                    <Button
                                                                                        className="btn-link btn-icon"
                                                                                        type="button"
                                                                                        variant="info"
                                                                                        onClick={()=>setModal(item, 1)}
                                                                                    >
                                                                                        <i className="fa fa-eye"></i>
                                                                                    </Button>
                                                                                </OverlayTrigger>
                                                                                </li> */}

                                                                                {
                                                                                    permissions && permissions.editReports &&
                                                                                    <li className="d-inline-block align-top">
                                                                                        <OverlayTrigger overlay={<Tooltip id="tooltip-436082023"> Edit </Tooltip>} placement="left">
                                                                                            <Button
                                                                                                className="btn-link btn-icon"
                                                                                                type="button"
                                                                                                variant="success"
                                                                                                onClick={() => setModal(item, 2)}
                                                                                            >
                                                                                                <i className="fas fa-edit"></i>
                                                                                            </Button>
                                                                                        </OverlayTrigger>
                                                                                    </li>
                                                                                }
                                                                                {
                                                                                    permissions && permissions.deleteNft &&
                                                                                    <li className="d-inline-block align-top">
                                                                                        <OverlayTrigger overlay={<Tooltip id="tooltip-334669391"> Delete </Tooltip>} placement="left">
                                                                                            <Button
                                                                                                className="btn-link btn-icon"
                                                                                                type="button"
                                                                                                variant="danger"
                                                                                                onClick={() => deleteNftReportHandler(item._id)}
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
                                                                <td colSpan="7" className="text-center">
                                                                    <div className="alert alert-info" role="alert">No NFTs Reporting Found</div>
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
                            nftReports &&
                            <Modal className="modal-nft-reports" id="content-Modal" onHide={() => setReportsModal(!reportsModal)} show={reportsModal}>
                                <Modal.Header className="justify-content-center">
                                    <Row>
                                        <div className="col-12">
                                            <h4 className="mb-0 mb-md-3 mt-0">
                                                {/* modalType === 1 ? 'View Nft Report' :  */modalType === 2 ? 'Edit NFT Report' : 'Manage Report Responses'}
                                            </h4>
                                        </div>
                                    </Row>
                                </Modal.Header>
                                <Modal.Body>
                                    {
                                        // modalType !== 0 ?
                                        // <Form>
                                        // <Form.Group>
                                        //     <label>Title <span className="text-danger">*</span></label>
                                        //     <Form.Control
                                        //         readOnly
                                        //         type="text"
                                        //         value ={nftTitle?.name}
                                        //     />
                                        // </Form.Group>
                                        // <Form.Group>
                                        //     <label>Reported By <span className="text-danger">*</span></label>
                                        //     <Form.Control
                                        //         readOnly
                                        //         type="text"
                                        //         value ={reportedBy?.name}
                                        //     />
                                        // </Form.Group>
                                        // <Form.Group>
                                        //     <label>Reported To <span className="text-danger">*</span></label>
                                        //     <Form.Control
                                        //         readOnly
                                        //         type="text"
                                        //         value ={reportedTo?.name}
                                        //     />
                                        // </Form.Group>
                                        // <Form.Group>
                                        //     <label>Description</label>
                                        //     <div
                                        //         dangerouslySetInnerHTML = {{__html: description}}
                                        //         >
                                        //     </div>

                                        // </Form.Group>
                                        // <Form.Group>
                                        //     <label>Status</label>
                                        //     <select disabled = {modalType !== 2} value={status} onChange={(e) =>  setStatus(e.target.value)}>
                                        //         <option value="">Select Status</option>
                                        //         <option value='1'>Pending</option>
                                        //         <option value="2">In Review</option>
                                        //         <option value="3">Resolved</option>

                                        //     </select>
                                        // </Form.Group>
                                        // </Form>
                                        // :
                                        <Form>
                                            <Form.Group>
                                                <label className='text-white'>Title <span className="text-danger">*</span></label>
                                                <Form.Control
                                                    readOnly
                                                    type="text"
                                                    value={nftTitle?.name}
                                                />
                                            </Form.Group>
                                            <Form.Group>
                                                <label className='text-white'>Reported By <span className="text-danger">*</span></label>
                                                <Form.Control
                                                    readOnly
                                                    type="text"
                                                    value={reportedBy?.name}
                                                />
                                            </Form.Group>
                                            <Form.Group>
                                                <label className='text-white'>Reported To <span className="text-danger">*</span></label>
                                                <Form.Control
                                                    readOnly
                                                    type="text"
                                                    value={reportedTo?.name}
                                                />
                                            </Form.Group>
                                            <Form.Group>
                                                <label className='text-white'>Description</label>
                                                <div className='text-white'
                                                    dangerouslySetInnerHTML={{ __html: description }}
                                                >
                                                </div>

                                            </Form.Group>
                                            <Form.Group>
                                                <label className='text-white d-block w-100'>Status</label>
                                                <select className='filter-card select p-2 d-flex w-100' disabled={modalType !== 2} value={status} onChange={(e) => setStatus(e.target.value)}>
                                                    <option value="">Select Status</option>
                                                    <option value='1'>Pending</option>
                                                    <option value="2">In Review</option>
                                                    <option value="3">Resolved</option>
                                                </select>
                                            </Form.Group>
                                            <Row>
                                                <Col md="12" sm="6">
                                                    <label className='text-white'>Report Responses<span className="text-danger"> *</span></label>
                                                    <div style={{ overflowY: 'scroll', maxHeight: '200px', marginBottom: '20px' }}>
                                                        {
                                                            reportMessages && reportMessages.length ?
                                                                reportMessages.map((msg, index) => {
                                                                    return <span key={index} className='text-white' dangerouslySetInnerHTML={{ __html: msg.adminResponse ? `${msg.admin.name} : ${msg.adminResponse}` : `${msg.user.name} : ${msg.userResponse}` }}></span>
                                                                    // return <span>{msg.admin && msg.adminResponse ? `${msg.admin.name} : ${msg.adminResponse}` : `${msg.user.name} : ${msg.userResponse}`}</span>
                                                                })
                                                                :
                                                                <span className='text-white'>No messages found</span>
                                                        }
                                                    </div>
                                                </Col>
                                                {
                                                    modalType !== 2 &&
                                                    <Col md="12" sm="6">
                                                        <label className='text-white'>Message Content<span className="text-danger"> *</span></label>
                                                        <CKEditor
                                                            config={{
                                                                extraPlugins: [uploadPlugin]
                                                            }}
                                                            editor={ClassicEditor}
                                                            data={messageContent ? messageContent : ''}
                                                            content={messageContent ? messageContent : ''}
                                                            onChange={(event, editor) => onEditorChange(event, editor)}
                                                        />
                                                        <span className={msg ? `` : `d-none`}>
                                                            <label className="pl-1 text-danger">{msg}</label>
                                                        </span>
                                                    </Col>
                                                }
                                            </Row>
                                        </Form>
                                    }
                                </Modal.Body>

                                <Modal.Footer>
                                    <Button className="outline-button" onClick={() => setReportsModal(!reportsModal)}>Close</Button>
                                    {
                                        modalType === 2 ?
                                            <Button className="btn-filled" onClick={updateNftReportHandler}>Update</Button>
                                            : modalType === 0 ?
                                                <Button className="btn-filled" onClick={addReportResponseHandler}>Add </Button> : null

                                    }
                                </Modal.Footer>
                            </Modal>
                        }
                    </Container>
            }
        </>
    )
}

export default NftReportings;