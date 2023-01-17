import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { ENV } from '../../../config/config';
import { beforeRole, updateRole, deleteRole, getRole, getPermission, getRoles } from './permissions.actions'
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify'
import validator from 'validator';
import Pagination from 'rc-pagination';
import { Link } from 'react-router-dom'
import 'rc-pagination/assets/index.css';
import PermissionsModal from './permissionsModalComponent'
import localeInfo from 'rc-pagination/lib/locale/en_US';
import { Button, Card, Form, Table, Container, Row, Col, OverlayTrigger, Tooltip, Modal, FormGroup } from "react-bootstrap";
var CryptoJS = require("crypto-js");

const StaffPermissions = (props) => {
    const [roleModal, setroleModal] = useState(false)
    const [modalType, setModalType] = useState(0)
    const [isLoader, setLoader] = useState(true)
    const [currentUserRole, setCurrentUserRole] = useState({})
    const [currentRoleId, setCurrentRoleId] = useState('')
    const [roles, setRoles] = useState()
    const [search, setSearch] = useState('')
    const [limit, setLimit] = useState(10)
    const [page, setPage] = useState(1)
    const [pages, setPages] = useState(0)
    const [total, setTotal] = useState(0)
    const [status, setStatus] = useState(false)
    const [title, setTitle] = useState('')
    const [selectAll, setSelectAll] = useState(false)
    const [role, setRole] = useState({
        /**  system permissions **/

        // dashboard
        viewDashboard: false,

        // staff's records
        addStaff: false,
        editStaff: false,
        deleteStaff: false,
        viewStaff: false,

        // users records
        addUser: false,
        editUser: false,
        deleteUser: false,
        viewUsers: false,

        // categories
        addCategory: false,
        editCategory: false,
        deleteCategory: false,
        viewCategory: false,

        // collections
        addCollection: false,
        editCollection: false,
        deleteCollection: false,
        viewCollection: false,

        // stakings
        addStaking: false,
        editStaking: false,
        deleteStaking: false,
        viewStaking: false,

        // NFTs
        addNft: false,
        editNft: false,
        viewNft: false,
        deleteNft: false,

        //NFTs reportings
        viewReports: false,
        editReports: false,
        deleteReports: false,
        viewReportResponses: false,

        // permissions
        addRole: false,
        editRole: false,
        deleteRole: false,
        viewRole: false,


        // FAQs / articles
        addFaq: false,
        editFaq: false,
        deleteFaq: false,
        viewFaqs: false,

        // contact
        viewContact: false,
        editContact: false,

        // activity
        viewActivity: false,

        // settings
        editSetting: false,
        viewSetting: false,

        //    // site settings
        //    editSiteSetting: false,
        //    viewSiteSetting: false,

        //    // social settings
        //    editSocialSetting: false,
        //    viewSocialSetting: false,

        //    // percentage settings
        //    editPercentageSetting: false,
        //    viewPercentageSetting: false,

        // content
        addContent: false,
        editContent: false,
        viewContent: false,
        deleteContent: false,

        //email-templates
        editEmails: false,
        viewEmails: false,

        // reporting digital assets
        addDigitalAssets: false,
        viewDigitalassets: false,
        editDigitalAssets: false,
        deleteDigitalAssets: false,

        // help center pages
        addHelpCenterPage: false,
        editHelpCenterPage: false,
        viewHelpCenterPage: false,
        deleteHelpCenterPage: false,

        // payment Gateways
        addPaymentGateway: false,
        editPaymentGateway: false,
        viewPaymentGateway: false,
        deletePaymentGateway: false,

        // third party Management
        viewThirdParty: false,
        editThirdParty: false,

        // view newsletter/subscriptions
        viewNewsLetter : false,

        // notable drops on homepage
        viewNotableDropsSettings : false,
        editNotableDropsSettings : false,

        // nft slider on homepage
        viewHomepageNftSettings : false,
        editHomepageNftSettings : false

        // status (i.e: true for active & false for in-active)

    })


    // set modal type
    const setModal = (type = 0, role = {}) => {
        setroleModal(!roleModal)
        setModalType(type)
        setLoader(false)
        if ((type === 2 || type === 3) && role) { //2 -> view, 3 -> edit
            setRole(role)
        }
        if (type === 1) { // 1 -> add Role
            setEmpty()
            // props.getRoles()
        }
        // getCategory(catId)
    }
    const setEmpty = () => {
        props.getRoles()
        setTitle('')
        setStatus(false)
        setSelectAll(false)
        for (let key in role) {
            role[key] = false
        }
    }

    const getData = (role) => {
        setRole(role)
        props.getRoles()
    }

    const deleteRoleHandler = (roleId) => {
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
                props.deleteRole(roleId)
            }
        })
    }

    const onSearch = () => {
        props.getRoles(1, limit, search)
        setModalType(0)
        setLoader(true)
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            onSearch();
        }
    }

    const reset = () => {
        setLoader(true)
        setSearch('')
        props.getRoles()
    }

    const onPageChange = (page) => {
        props.getRoles({ page, limit, search })
        setLoader(true)
    }

    useEffect(() => {
        props.getRoles()
        let roleEncrypted = localStorage.getItem('role');
        let role = '';
        if (roleEncrypted) {
            let roleDecrypted = CryptoJS.AES.decrypt(roleEncrypted, ENV.secretKey).toString(CryptoJS.enc.Utf8);
            props.getPermission(roleDecrypted)
            role = roleDecrypted
        }
        setCurrentRoleId(role !== '' ? role : null)
    }, [])

    useEffect(() => {
        if (Object.keys(props.getRolesRes).length > 0 && props.authenticate === true) {
            setLoader(false)
            setRoles(props.getRolesRes.data)
            setPage(props.getRolesRes.page)
            setPages(props.getRolesRes.pages)
            setTotal(props.getRolesRes.total)
            setLimit(props.getRolesRes.limit)

            props.beforeRole();
        }
    }, [props.getRolesRes])

    useEffect(() => {
        if (props.currentUserPermission.authPermission) {
            setCurrentUserRole(props.currentUserPermission.permission.role)
        }

    }, [props.currentUserPermission.authPermission])

    useEffect(() => {
        if (Object.keys(props.deleteRoleRes).length > 0 && props.authenticate === true) {
            setModalType(1)
            setLoader(false)
            toast.success(`Success! ${props.deleteRoleRes.message}`);
            props.beforeRole();
            props.getRoles();
        }
    }, [props.deleteRoleRes])


    return (
        <>
            {
                isLoader ?
                    <FullPageLoader />
                    :
                    <Container fluid>
                        <Row>
                            <Col md="12">
                                <Card className="filter-card card">
                                    <Card.Header>
                                        <div className="d-flex align-items-center justify-content-between">
                                            <Card.Title as="h4">Filters</Card.Title>
                                        </div>
                                    </Card.Header>
                                    <Card.Body>
                                        <Row>
                                            <Col xl={3} sm={6} className="search-wrap">
                                                <Form.Group>
                                                    <Form.Label className="d-block mb-2">Search with title...</Form.Label>
                                                    <Form.Control type="email" onKeyPress={handleKeyPress} name="search" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)}></Form.Control>
                                                    {/* <button type="button" className="btn btn-default" onClick={onSearch} ><i className="fa fa-search" /></button> */}
                                                </Form.Group>
                                                {/* <form className="navbar-form navbar-left search-form">
                                                    <input type="text" className="form-control" placeholder="Search with title..." onKeyPress={handleKeyPress} name="search" value={search} onChange={(e) => setSearch(e.target.value)} />
                                                    <button type="button" className="btn btn-default" onClick={onSearch} ><i className="fa fa-search" /></button>
                                                </form> */}
                                            </Col>
                                            <Col xl={3} sm={6}>
                                                <Form.Group>
                                                    <label className="d-none d-sm-block mb-2 form-label">&nbsp;</label>
                                                    <div className="d-flex justify-content-between filter-btns-holder">
                                                        <button type="button" className="btn-filled" onClick={onSearch} >
                                                            Search
                                                            {/* <i className="fa fa-search" /> */}
                                                        </button>
                                                        <button type="button" className="outline-button" onClick={reset}>Reset</button>
                                                    </div>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                                <Card className="table-big-boy">
                                    <Card.Header>
                                        <div className="d-flex align-items-center justify-content-between">
                                            <Card.Title as="h4">Permissions</Card.Title>
                                            {/* <p className="card-category">List of Categories</p> */}
                                            <Button className="float-sm-right btn-filled" onClick={() => setModal(1)}> Add New Staff Role</Button>
                                        </div>
                                    </Card.Header>
                                    <Card.Body className="table-full-width">
                                        <div className="table-responsive">
                                            <Table className="table-bigboy">
                                                <thead>
                                                    <tr>
                                                        <th className="serial-col">#</th>
                                                        <th>Title</th>
                                                        <th>Permissions</th>
                                                        <th className="text-center">Status</th>
                                                        <th className="td-action">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        roles && roles.length > 0 ?
                                                            roles.map((val, key) => {
                                                                return (
                                                                    <tr key={key} className="align-items-center">
                                                                        <td className='text-white'>{((limit * page) - limit) + key + 1}</td>
                                                                        <td><Link data-toggle="modal" data-target="modal-primary" className="text-capitalize" onClick={() => setModal(2, val)}>{val.title}</Link></td>
                                                                        <td className="permissions-pills">
                                                                            {
                                                                                Object.entries(val).map((permission, index) => {
                                                                                    if (permission[1] === true && permission[0] !== 'status') {
                                                                                        var pVal = permission[0];
                                                                                        return (
                                                                                            <label key={index} className="label label-info mr-2 px-2">
                                                                                                {
                                                                                                    pVal.split(/(?=[A-Z])/).map((keyText, i) => {
                                                                                                        return (<span key={i} className="text-capitalized">{keyText.replace(/\b\w/g, l => l.toUpperCase())} </span>)
                                                                                                    })
                                                                                                }
                                                                                            </label>
                                                                                        )
                                                                                    }
                                                                                })
                                                                            }
                                                                        </td>
                                                                        <td className='text-center'>
                                                                            {
                                                                                val.status ?
                                                                                    <label className="label label-success m-0">Active</label>
                                                                                    : <label className="label label-danger m-0">Inactive</label>
                                                                            }
                                                                        </td>
                                                                        <td className="td-actions">
                                                                            <ul className="list-unstyled mb-0 d-flex">{
                                                                                currentUserRole?.viewRole ?
                                                                                    <li className="d-inline-block align-top">
                                                                                        <OverlayTrigger overlay={<Tooltip id="tooltip-436082023" >View</Tooltip>} placement="left">
                                                                                            <button type="button" className="btn-link btn-icon btn btn-info" onClick={() => setModal(2, val)}><i className="fas fa-eye"></i></button>
                                                                                        </OverlayTrigger>
                                                                                    </li>
                                                                                    : null
                                                                            }
                                                                                {currentUserRole?.editRole ?
                                                                                    currentRoleId !== val._id && !val.isSuperAdmin ?
                                                                                        <li className="d-inline-block align-top">
                                                                                            <OverlayTrigger overlay={<Tooltip id="tooltip-436082023">Edit</Tooltip>} placement="left">
                                                                                                <button type="button" className="btn-link btn-icon btn btn-success" onClick={() => setModal(3, val)}><i className="fas fa-edit"></i></button>
                                                                                            </OverlayTrigger>
                                                                                        </li>
                                                                                        :
                                                                                        <button type="button" className="btn-link btn-icon btn btn-success disabled" disabled><i className="fas fa-edit"></i></button>
                                                                                    : null
                                                                                }
                                                                                {
                                                                                    currentUserRole?.deleteRole ?
                                                                                        currentRoleId !== val._id && !val.isSuperAdmin ?
                                                                                            <li className="d-inline-block align-top">
                                                                                                <OverlayTrigger overlay={<Tooltip id="tooltip-436082023">Delete</Tooltip>} placement="left">
                                                                                                    <button type="button" className="btn-link btn-icon btn btn-danger" onClick={() => deleteRoleHandler(val._id)}><i className="fas fa-trash"></i></button>
                                                                                                </OverlayTrigger>
                                                                                            </li>
                                                                                            :
                                                                                            <button type="button" className="btn-link btn-icon btn btn-danger disabled" disabled><i className="fas fa-trash"></i></button>
                                                                                        : null
                                                                                }
                                                                            </ul>
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            })
                                                            :
                                                            <tr>
                                                                <td className="text-center px-0" colSpan="6">
                                                                    <span className="alert alert-danger d-block text-center">No Record Found</span>
                                                                </td>
                                                            </tr>
                                                    }
                                                </tbody>
                                            </Table>
                                            <Col className="pb-4">
                                                <Pagination
                                                    defaultCurrent={1}
                                                    pageSize // items per page
                                                    current={page} // current active page
                                                    total={pages} // total pages
                                                    onChange={onPageChange}
                                                    locale={localeInfo}
                                                />
                                            </Col>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                        <PermissionsModal setData={getData} modalType={modalType} setModalType={setModalType}
                            roleModal={roleModal} setroleModal={setroleModal} role={role}
                            setLoader={setLoader} title={title} status={status}
                            setTitle={setTitle} setStatus={setStatus}
                            selectAll={selectAll} setSelectAll={setSelectAll} />
                    </Container>
            }
        </>
    )
}

const mapStateToProps = state => ({
    addRoleRes: state.role.addRoleRes,
    updateRoleRes: state.role.updateRoleRes,
    deleteRoleRes: state.role.deleteRoleRes,
    getRoleRes: state.role.getRoleRes,
    getRolesRes: state.role.getRolesRes,
    authenticate: state.role.authenticate,
    errors: state.errors,
    // roles and permission
    currentUserPermission: state.role,
});

export default connect(mapStateToProps, { beforeRole, updateRole, deleteRole, getRole, getRoles, getPermission })(StaffPermissions);