import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import validator from 'validator';
import { addRole, updateRole, beforeRole } from './permissions.actions';
import $ from 'jquery';
import { Button, Card, Form, Table, Container, Row, Col, OverlayTrigger, Tooltip, Modal, FormGroup } from "react-bootstrap";

const StaffPermissionModal = (props) => {
    const dispatch = useDispatch()
    const [titleMsg, setTitleMsg] = useState('')
    const [formValid, setFormValid] = useState(false)
    const [permissions, setPermissions] = useState({
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

        // newsletter/subscriptions
        viewNewsLetter : false,

        // notable drops on homepage
        viewNotableDropsSettings : false,
        editNotableDropsSettings : false,

        // nft slider on homepage
        viewHomepageNftSettings : false,
        editHomepageNftSettings : false


        // props.status (i.e: true for active & false for in-active)

    })
    const addRoleRes = useSelector(state => state.role.addRoleRes)
    const updateRoleRes = useSelector(state => state.role.updateRoleRes)
    const authenticate = useSelector(state => state.role.authenticate)

    const onChangeCheckbox = (name, value) => {
        let roles = permissions
        if (name === 'selectAll') {
            Object.keys(roles).forEach((val, key) => {
                if (val !== 'title' && val !== '_id' && val !== 'status' && val !== 'isSuperAdmin')
                    roles = { ...roles, [val]: value }
            });
            props.setSelectAll(value)
        }
        else {
            roles = { ...roles, [name]: value }

            // select all state settings
            let count = 0;

            Object.keys(roles).forEach((key, index) => {
                if (roles[key] === true && key !== 'status' && key !== '_id' && key !== 'isSuperAdmin') {
                    count++;
                }
            });
            let selectCount = count === 67 ? true : false
            props.setSelectAll(selectCount)
        }
        setPermissions(roles)
    }
    const submit = (e) => {
        if (props.title === undefined) {
            setTitleMsg("Title Required.")
            $('.modal-primary').scrollTop(0, 0)
            setFormValid(true)
        }
        else {
            if (!validator.isEmpty(props.title)) {
                setTitleMsg('')
                setFormValid(false)
                if (props.modalType === 1) delete permissions['_id']
                const role = { ...permissions, title: props.title, status: props.status }

                if (props.modalType === 1) // add modal type
                    dispatch(addRole(role));
                else if (props.modalType === 3) // update modal type
                    dispatch(updateRole(role));

                setPermissions(role)
                props.setroleModal(!props.roleModal)
                props.setModalType(0)
                props.setData(role)
                props.setLoader(true)
            }
            else {
                setTitleMsg("Title Required.")
                $('.modal-primary').scrollTop(0, 0)
                setFormValid(true)
            }
        }

    }


    useEffect(() => {
        if (Object.keys(props.role).length > 0) {
            updateInitialData({ ...props });
        }
    }, [props.role])

    const updateInitialData = (props) => {
        let newprops = { ...props };
        let count = 0
        Object.keys(newprops.role).forEach((key, index) => {
            if (newprops.role[key] === true && key !== 'status' && key !== '_id' && key !== 'isSuperAdmin') {
                count++;
            }

        });
        let selectCount = count === 67 ? true : false
        props.setSelectAll(selectCount)
        setPermissions(newprops.role)
        props.setTitle(newprops.role.title)
        props.setStatus(newprops.role.status)
    }

    useEffect(() => {
        if (props.modalType === 2) {
            $(".modal-primary input").prop("disabled", true);
        } else {
            $(".modal-primary input").prop("disabled", false);
        }
    }, [props.modalType])

    useEffect(() => {
        if (addRoleRes.success && authenticate === true) {
            props.setLoader(false)
            setEmpty()
            dispatch(beforeRole())
        }
    }, [addRoleRes])

    const onCloseHandler = () => {
        props.setroleModal(!props.roleModal)
        // setEmpty()
    }

    useEffect(() => {
        if (Object.keys(updateRoleRes).length > 0 && authenticate === true) {
            props.setLoader(false)
            dispatch(beforeRole());
        }
    }, [updateRoleRes])

    const setEmpty = () => {
        props.setStatus(false)
        props.setTitle('')
        props.setSelectAll(false)
        for (let key in permissions) {
            permissions[key] = false
        }
    }


    return (
        <Container fluid>
            {
                formValid ?
                    <div className="text-danger">Please fill the required fields</div> : null
            }
            {
                props.modalType > 0 &&
                <Modal className="modal-primary" onHide={() => props.setroleModal(!props.roleModal)} show={props.roleModal}>
                    <Modal.Header className="justify-content-center">
                        <Row>
                            <div className="col-12">
                                <h4 className="mb-0 mb-md-3 mt-0">
                                    {props.modalType === 1 ? 'Add New' : props.modalType === 2 ? 'View' : 'Edit'} Staff Role
                                </h4>
                            </div>
                        </Row>
                    </Modal.Header>
                    <Modal.Body className="modal-body">
                        <Form>
                            <Form.Group>
                                <Row>
                                    <Col md={12}>
                                        <label className="label-font">Title <span className="text-danger">*</span></label>
                                        <Form.Control
                                            className='mb-3'
                                            placeholder="Enter title"
                                            type="text"
                                            name="title"
                                            onChange={(e) => props.setTitle(e.target.value)}
                                            disabled={props.modalType === 2}
                                            value={props.title}
                                            required
                                        />
                                        <div className='d-flex justify-content-between align-items-center edit-title'>
                                            <span className={titleMsg ? `` : `d-none`}>
                                                <label className="pl-1 text-danger">{titleMsg}</label>
                                            </span>
                                            <label className="right-label-checkbox">Select All
                                                <input type="checkbox" name="selectAll" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !props.selectAll)} checked={props.selectAll} />
                                                <span className="checkmark"></span>
                                            </label>
                                        </div>
                                    </Col>

                                    {/* <Col md={4}>
                                           
                                            <label className="right-label-checkbox">Select All
                                                <input type="checkbox" name="selectAll" disabled = {props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !props.selectAll)} checked={props.selectAll} />
                                                <span className="checkmark"></span>
                                            </label>

                                            <label className="label-font">Select All</label>
                                            <input type="checkbox" name="selectAll" disabled = {props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !selectAll)} checked={selectAll}></input>
                                        </Col> */}
                                </Row>
                            </Form.Group>
                            <Form.Group>
                                <Row className="align-items-start">
                                    <Col md={4}>
                                        <label className="label-font">Dashboard</label>
                                    </Col>
                                    <Col md={8}>
                                        <label className="right-label-checkbox">View
                                            <input type="checkbox" name="viewDashboard" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewDashboard)} checked={permissions.viewDashboard} />
                                            <span className="checkmark"></span>
                                            {/* <input type="checkbox" name="viewDashboard" disabled = {props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewDashboard)} checked={permissions.viewDashboard}></input>  */}

                                        </label>
                                        {/* <label className="label-font">View</label>
                                            <input type="checkbox" name="viewDashboard" disabled = {props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewDashboard)} checked={permissions.viewDashboard}></input> */}
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group>
                                <Row>
                                    <Col md={4}>
                                        <label className="label-font">Staff</label>
                                    </Col>
                                    <Col md={8} className="check-inline d-flex" >
                                        <label className="right-label-checkbox mr-3 mb-2">View
                                            <input type="checkbox" name="viewStaff" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewStaff)} checked={permissions.viewStaff} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Add
                                            <input type="checkbox" name="addStaff" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.addStaff)} checked={permissions.addStaff} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Edit
                                            <input type="checkbox" name="editStaff" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.editStaff)} checked={permissions.editStaff} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Delete
                                            <input type="checkbox" name="deleteStaff" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.deleteStaff)} checked={permissions.deleteStaff} />
                                            <span className="checkmark"></span>
                                        </label>
                                        {/* <label className="fancy-checkbox custom-bgcolor-blue">
                                                <input type="checkbox" name="viewStaff" disabled = {props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewStaff)} checked={permissions.viewStaff}></input>
                                                <span>View</span>
                                            </label>
                                            <label className="fancy-checkbox custom-bgcolor-blue">
                                                <input type="checkbox" name="addStaff" disabled = {props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.addStaff)} checked={permissions.addStaff}></input>
                                                <span>Add</span>
                                            </label>
                                            <label className="fancy-checkbox custom-bgcolor-blue">
                                                <input type="checkbox" name="editStaff" disabled = {props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.editStaff)} checked={permissions.editStaff}></input>
                                                <span>Edit</span>
                                            </label>
                                            <label className="fancy-checkbox custom-bgcolor-blue">
                                                <input type="checkbox" name="deleteStaff" disabled = {props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.deleteStaff)} checked={permissions.deleteStaff}></input>
                                                <span>Delete</span>
                                            </label> */}
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group>
                                <Row>
                                    <Col md={4}>
                                        <label className="label-font">Users</label>
                                    </Col>
                                    <Col md={8} className="check-inline d-flex">
                                        <label className="right-label-checkbox mr-3 mb-2">View
                                            <input type="checkbox" name="viewUsers" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewUsers)} checked={permissions.viewUsers} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Add
                                            <input type="checkbox" name="addUser" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.addUser)} checked={permissions.addUser} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Edit
                                            <input type="checkbox" name="editUser" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.editUser)} checked={permissions.editUser} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Delete
                                            <input type="checkbox" name="deleteUser" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.deleteUser)} checked={permissions.deleteUser} />
                                            <span className="checkmark"></span>
                                        </label>
                                        {/* <label className="fancy-checkbox custom-bgcolor-blue">
                                                <input type="checkbox" name="viewUsers" disabled = {props.modalType === 2}onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewUsers)} checked={permissions.viewUsers}></input>
                                                <span>View</span>
                                            </label>
                                            <label className="fancy-checkbox custom-bgcolor-blue">
                                                <input type="checkbox" name="addUser" disabled = {props.modalType === 2}onChange={(e) => onChangeCheckbox(e.target.name, !permissions.addUser)} checked={permissions.addUser}></input>
                                                <span>Add</span>
                                            </label>
                                            <label className="fancy-checkbox custom-bgcolor-blue">
                                                <input type="checkbox" name="editUser" disabled = {props.modalType === 2}onChange={(e) => onChangeCheckbox(e.target.name, !permissions.editUser)} checked={permissions.editUser}></input>
                                                <span>Edit</span>
                                            </label>
                                            <label className="fancy-checkbox custom-bgcolor-blue">
                                                <input type="checkbox" name="deleteUser" disabled = {props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.deleteUser)} checked={permissions.deleteUser}></input>
                                                <span>Delete</span>
                                            </label>*/}
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group>
                                <Row>
                                    <Col md={4}>
                                        <label className="label-font">Categories</label>
                                    </Col>
                                    <Col md={8} className="check-inline d-flex">
                                        <label className="right-label-checkbox mr-3 mb-2">View
                                            <input type="checkbox" name="viewCategory" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewCategory)} checked={permissions.viewCategory} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Add
                                            <input type="checkbox" name="addCategory" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.addCategory)} checked={permissions.addCategory} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Edit
                                            <input type="checkbox" name="editCategory" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.editCategory)} checked={permissions.editCategory} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Delete
                                            <input type="checkbox" name="deleteCategory" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.deleteCategory)} checked={permissions.deleteCategory} />
                                            <span className="checkmark"></span>
                                        </label>
                                        {/* <label className="fancy-checkbox custom-bgcolor-blue">
                                                <input type="checkbox" name="viewCategory" disabled = {props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewCategory)} checked={permissions.viewCategory}></input>
                                                <span>View</span>
                                            </label>
                                            <label className="fancy-checkbox custom-bgcolor-blue">
                                                <input type="checkbox" name="addCategory" disabled = {props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.addCategory)} checked={permissions.addCategory}></input>
                                                <span>Add</span>
                                            </label>
                                            <label className="fancy-checkbox custom-bgcolor-blue">
                                                <input type="checkbox" name="editCategory" disabled = {props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.editCategory)} checked={permissions.editCategory}></input>
                                                <span>Edit</span>
                                            </label>
                                            <label className="fancy-checkbox custom-bgcolor-blue">
                                                <input type="checkbox" name="deleteCategory" disabled = {props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.deleteCategory)} checked={permissions.deleteCategory}></input>
                                                <span>Delete</span>
                                            </label> */}
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group>
                                <Row>
                                    <Col md={4}>
                                        <label className="label-font">Collections</label>
                                    </Col>
                                    <Col md={8} className="check-inline d-flex">
                                        {/* <label className="right-label-checkbox mr-3 mb-2">View
                                                <input type="checkbox" name="viewCategory" disabled = {props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewCategory)} checked={permissions.viewCategory} />
                                                <span className="checkmark"></span>
                                            </label>
                                            <label className="right-label-checkbox mr-3 mb-2">Add
                                                <input type="checkbox" name="addCategory" disabled = {props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.addCategory)} checked={permissions.addCategory} />
                                                <span className="checkmark"></span>
                                            </label>
                                            <label className="right-label-checkbox mr-3 mb-2">Edit
                                                <input type="checkbox" name="editCategory" disabled = {props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.editCategory)} checked={permissions.editCategory} />
                                                <span className="checkmark"></span>
                                            </label>
                                            <label className="right-label-checkbox mr-3 mb-2">Delete
                                                <input type="checkbox" name="deleteCategory" disabled = {props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.deleteCategory)} checked={permissions.deleteCategory} />
                                                <span className="checkmark"></span>
                                            </label> */}
                                        <label className="right-label-checkbox mr-3 mb-2">View
                                            <input type="checkbox" name="viewCollection" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewCollection)} checked={permissions.viewCollection} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Add
                                            <input type="checkbox" name="addCollection" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.addCollection)} checked={permissions.addCollection} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Edit
                                            <input type="checkbox" name="editCollection" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.editCollection)} checked={permissions.editCollection} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Delete
                                            <input type="checkbox" name="deleteCollection" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.deleteCollection)} checked={permissions.deleteCollection} />
                                            <span className="checkmark"></span>
                                        </label>
                                        {/* <label className="fancy-checkbox custom-bgcolor-blue">
                                                <input type="checkbox" name="viewCollection" disabled = {props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewCollection)} checked={permissions.viewCollection}></input>
                                                <span>View</span>
                                            </label>
                                            <label className="fancy-checkbox custom-bgcolor-blue">
                                                <input type="checkbox" name="addCollection" disabled = {props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.addCollection)} checked={permissions.addCollection}></input>
                                                <span>Add</span>
                                            </label>
                                            <label className="fancy-checkbox custom-bgcolor-blue">
                                                <input type="checkbox" name="editCollection" disabled = {props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.editCollection)} checked={permissions.editCollection}></input>
                                                <span>Edit</span>
                                            </label>
                                            <label className="fancy-checkbox custom-bgcolor-blue">
                                                <input type="checkbox" name="deleteCollection" disabled = {props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.deleteCollection)} checked={permissions.deleteCollection}></input>
                                                <span>Delete</span>
                                            </label> */}
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group>
                                <Row>
                                    <Col md={4}>
                                        <label className="label-font">Stakings</label>
                                    </Col>
                                    <Col md={8} className="check-inline d-flex">
                                        <label className="right-label-checkbox mr-3 mb-2">View
                                            <input type="checkbox" name="viewStaking" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewStaking)} checked={permissions.viewStaking} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Add
                                            <input type="checkbox" name="addStaking" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.addStaking)} checked={permissions.addStaking} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Edit
                                            <input type="checkbox" name="editStaking" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.editStaking)} checked={permissions.editStaking} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Delete
                                            <input type="checkbox" name="deleteStaking" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.deleteStaking)} checked={permissions.deleteStaking} />
                                            <span className="checkmark"></span>
                                        </label>
                                        {/* <label className="fancy-checkbox custom-bgcolor-blue">
                                                <input type="checkbox" name="viewStaking" disabled = {props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewStaking)} checked={permissions.viewStaking}></input>
                                                <span>View</span>
                                            </label>
                                            <label className="fancy-checkbox custom-bgcolor-blue">
                                                <input type="checkbox" name="addStaking" disabled = {props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.addStaking)} checked={permissions.addStaking}></input>
                                                <span>Add</span>
                                            </label>
                                            <label className="fancy-checkbox custom-bgcolor-blue">
                                                <input type="checkbox" name="editStaking" disabled = {props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.editStaking)} checked={permissions.editStaking}></input>
                                                <span>Edit</span>
                                            </label>
                                            <label className="fancy-checkbox custom-bgcolor-blue">
                                                <input type="checkbox" name="deleteStaking" disabled = {props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.deleteStaking)} checked={permissions.deleteStaking}></input>
                                                <span>Delete</span>
                                            </label> */}
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group>
                                <Row>
                                    <Col md={4}>
                                        <label className="label-font">NFTs</label>
                                    </Col>
                                    <Col md={8} className="check-inline d-flex">
                                        <label className="right-label-checkbox mr-3 mb-2">View
                                            <input type="checkbox" name="viewNft" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewNft)} checked={permissions.viewNft} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Add
                                            <input type="checkbox" name="addNft" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.addNft)} checked={permissions.addNft} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Edit
                                            <input type="checkbox" name="editNft" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.editNft)} checked={permissions.editNft} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Delete
                                            <input type="checkbox" name="deleteNft" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.deleteNft)} checked={permissions.deleteNft} />
                                            <span className="checkmark"></span>
                                        </label>
                                        {/* <label className="fancy-checkbox custom-bgcolor-blue">
                                                <input type="checkbox" name="viewNft" disabled = {props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewNft)} checked={permissions.viewNft}></input>
                                                <span>View</span>
                                            </label>
                                            <label className="fancy-checkbox custom-bgcolor-blue">
                                                <input type="checkbox" name="addNft" disabled = {props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.addNft)} checked={permissions.addNft}></input>
                                                <span>Add</span>
                                            </label>
                                            <label className="fancy-checkbox custom-bgcolor-blue">
                                                <input type="checkbox" name="editNft" disabled = {props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.editNft)} checked={permissions.editNft}></input>
                                                <span>Edit</span>
                                            </label>
                                            <label className="fancy-checkbox custom-bgcolor-blue">
                                                <input type="checkbox" name="deleteNft" disabled = {props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.deleteNft)} checked={permissions.deleteNft}></input>
                                                <span>Delete</span>
                                            </label> */}
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group>
                                <Row>
                                    <Col md={4}>
                                        <label className="label-font">NFTs Reportings</label>
                                    </Col>
                                    <Col md={8} className="check-inline d-flex">
                                        <label className="right-label-checkbox mr-3 mb-2">View
                                            <input type="checkbox" name="viewReports" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewReports)} checked={permissions.viewReports} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Edit
                                            <input type="checkbox" name="editReports" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.editReports)} checked={permissions.editReports} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Delete
                                            <input type="checkbox" name="deleteReports" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.deleteReports)} checked={permissions.deleteReports} />
                                            <span className="checkmark"></span>
                                        </label>
                                        {/* <label className="fancy-checkbox custom-bgcolor-blue">
                                                <input type="checkbox" name="viewNft" disabled = {props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewNft)} checked={permissions.viewNft}></input>
                                                <span>View</span>
                                            </label>
                                            <label className="fancy-checkbox custom-bgcolor-blue">
                                                <input type="checkbox" name="addNft" disabled = {props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.addNft)} checked={permissions.addNft}></input>
                                                <span>Add</span>
                                            </label>
                                            <label className="fancy-checkbox custom-bgcolor-blue">
                                                <input type="checkbox" name="editNft" disabled = {props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.editNft)} checked={permissions.editNft}></input>
                                                <span>Edit</span>
                                            </label>
                                            <label className="fancy-checkbox custom-bgcolor-blue">
                                                <input type="checkbox" name="deleteNft" disabled = {props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.deleteNft)} checked={permissions.deleteNft}></input>
                                                <span>Delete</span>
                                            </label> */}
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group>
                                <Row>
                                    <Col md={4}>
                                        <label className="label-font">NFT Report Responses</label>
                                    </Col>
                                    <Col md={8} className="check-inline d-flex">
                                        <label className="right-label-checkbox mr-3 mb-2">View
                                            <input type="checkbox" name="viewReportResponses" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewReportResponses)} checked={permissions.viewReportResponses} />
                                            <span className="checkmark"></span>
                                        </label>
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group>
                                <Row>
                                    <Col md={4}>
                                        <label className="label-font">Staff Roles</label>
                                    </Col>
                                    <Col md={8} className="check-inline d-flex">
                                        <label className="right-label-checkbox mr-3 mb-2">View
                                            <input type="checkbox" name="viewRole" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewRole)} checked={permissions.viewRole} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Add
                                            <input type="checkbox" name="addRole" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.addRole)} checked={permissions.addRole} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Edit
                                            <input type="checkbox" name="editRole" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.editRole)} checked={permissions.editRole} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Delete
                                            <input type="checkbox" name="deleteRole" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.deleteRole)} checked={permissions.deleteRole} />
                                            <span className="checkmark"></span>
                                        </label>
                                        {/* <label className="fancy-checkbox custom-bgcolor-blue">
                                                <input type="checkbox" name="viewRole" disabled = {props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewRole)} checked={permissions.viewRole}></input>
                                                <span>View</span>
                                            </label>
                                            <label className="fancy-checkbox custom-bgcolor-blue">
                                                <input type="checkbox" name="addRole" disabled = {props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.addRole)} checked={permissions.addRole}></input>
                                                <span>Add</span>
                                            </label>
                                            <label className="fancy-checkbox custom-bgcolor-blue">
                                                <input type="checkbox" name="editRole" disabled = {props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.editRole)} checked={permissions.editRole}></input>
                                                <span>Edit</span>
                                            </label>
                                            <label className="fancy-checkbox custom-bgcolor-blue">
                                                <input type="checkbox" name="deleteRole" disabled = {props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.deleteNft)} checked={permissions.deleteRole}></input>
                                                <span>Delete</span>
                                            </label> */}
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group>
                                <Row>
                                    <Col md={4}>
                                        <label className="label-font">FAQs</label>
                                    </Col>
                                    <Col md={8} className="check-inline d-flex">
                                        <label className="right-label-checkbox mr-3 mb-2">View
                                            <input type="checkbox" name="viewFaqs" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewFaqs)} checked={permissions.viewFaqs} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Add
                                            <input type="checkbox" name="addFaq" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.addFaq)} checked={permissions.addFaq} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Edit
                                            <input type="checkbox" name="editFaq" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.editFaq)} checked={permissions.editFaq} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Delete
                                            <input type="checkbox" name="deleteFaq" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.deleteFaq)} checked={permissions.deleteFaq} />
                                            <span className="checkmark"></span>
                                        </label>
                                        {/* <label className="fancy-checkbox custom-bgcolor-blue">
                                                <input type="checkbox" name="viewFaqs" disabled = {props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewFaqs)} checked={permissions.viewFaqs}></input>
                                                <span>View</span>
                                            </label>
                                            <label className="fancy-checkbox custom-bgcolor-blue">
                                                <input type="checkbox" name="addFaq" disabled = {props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.addFaq)} checked={permissions.addFaq}></input>
                                                <span>Add</span>
                                            </label>
                                            <label className="fancy-checkbox custom-bgcolor-blue">
                                                <input type="checkbox" name="editFaq" disabled = {props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.editFaq)} checked={permissions.editFaq}></input>
                                                <span>Edit</span>
                                            </label>
                                            <label className="fancy-checkbox custom-bgcolor-blue">
                                                <input type="checkbox" name="deleteFaq" disabled = {props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.deleteFaq)} checked={permissions.deleteFaq}></input>
                                                <span>Delete</span>
                                            </label> */}
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group>
                                <Row>
                                    <Col md={4}>
                                        <label className="label-font">Contacts</label>
                                    </Col>
                                    <Col md={8} className="check-inline d-flex">
                                        <label className="right-label-checkbox mr-3 mb-2">View
                                            <input type="checkbox" name="viewContact" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewContact)} checked={permissions.viewContact} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Edit
                                            <input type="checkbox" name="editContact" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.editContact)} checked={permissions.editContact} />
                                            <span className="checkmark"></span>
                                        </label>
                                        {/* <label className="fancy-checkbox custom-bgcolor-blue">
                                                <input type="checkbox" name="viewContact" disabled = {props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewContact)} checked={permissions.viewContact}></input>
                                                <span>View</span>
                                            </label>
                                            <label className="fancy-checkbox custom-bgcolor-blue">
                                                <input type="checkbox" name="editContact" disabled = {props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.editContact)} checked={permissions.editContact}></input>
                                                <span>Edit</span>
                                            </label> */}
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group>
                                <Row>
                                    <Col md={4}>
                                        <label className="label-font">Emails</label>
                                    </Col>
                                    <Col md={8} className="check-inline d-flex">
                                        <label className="right-label-checkbox mr-3 mb-2">View
                                            <input type="checkbox" name="viewEmails" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewEmails)} checked={permissions.viewEmails} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Edit
                                            <input type="checkbox" name="editEmails" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.editEmails)} checked={permissions.editEmails} />
                                            <span className="checkmark"></span>
                                        </label>
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group>
                                <Row>
                                    <Col md={4}>
                                        <label className="label-font">Activities</label>
                                    </Col>
                                    <Col md={8} className="check-inline d-flex">
                                        <label className="right-label-checkbox mr-3 mb-2">View
                                            <input type="checkbox" name="viewActivity" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewActivity)} checked={permissions.viewActivity} />
                                            <span className="checkmark"></span>
                                        </label>
                                        {/* <label className="fancy-checkbox custom-bgcolor-blue">
                                                <input type="checkbox" name="viewActivity" disabled = {props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewActivity)} checked={permissions.viewActivity}></input>
                                                <span>View</span>
                                            </label>            */}
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group>
                                <Row>
                                    <Col md={4}>
                                        <label className="label-font">Settings</label>
                                    </Col>
                                    <Col md={8} className="check-inline d-flex">
                                        <label className="right-label-checkbox mr-3 mb-2">View
                                            <input type="checkbox" name="viewSetting" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewSetting)} checked={permissions.viewSetting} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Edit
                                            <input type="checkbox" name="editSetting" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.editSetting)} checked={permissions.editSetting} />
                                            <span className="checkmark"></span>
                                        </label>
                                        {/* <label className="fancy-checkbox custom-bgcolor-blue">
                                                <input type="checkbox" name="viewSetting" disabled = {props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewSetting)} checked={permissions.viewSetting}></input>
                                                <span>View</span>
                                            </label>
                                            <label className="fancy-checkbox custom-bgcolor-blue">
                                                <input type="checkbox" name="editSetting" disabled = {props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.editSetting)} checked={permissions.editSetting}></input>
                                                <span>Edit</span>
                                            </label> */}
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group>
                                <Row>
                                    <Col md={4}>
                                        <label className="label-font">Content</label>
                                    </Col>
                                    <Col md={8} className="check-inline d-flex">
                                        <label className="right-label-checkbox mr-3 mb-2">View
                                            <input type="checkbox" name="viewContent" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewContent)} checked={permissions.viewContent} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Edit
                                            <input type="checkbox" name="editContent" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.editContent)} checked={permissions.editContent} />
                                            <span className="checkmark"></span>
                                        </label>
                                        {/* <label className="fancy-checkbox custom-bgcolor-blue">
                                                <input type="checkbox" name="viewContent" disabled = {props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewContent)} checked={permissions.viewContent}></input>
                                                <span>View</span>
                                            </label>
                                            <label className="fancy-checkbox custom-bgcolor-blue">
                                                <input type="checkbox" name="editContent" disabled = {props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.editContent)} checked={permissions.editContent}></input>
                                                <span>Edit</span>
                                            </label> */}
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group>
                                <Row>
                                    <Col md={4}>
                                        <label className="label-font">Digital Assets</label>
                                    </Col>
                                    <Col md={8} className="check-inline d-flex">
                                        <label className="right-label-checkbox mr-3 mb-2">View
                                            <input type="checkbox" name="viewDigitalassets" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewDigitalassets)} checked={permissions.viewDigitalassets} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Add
                                            <input type="checkbox" name="addDigitalAssets" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.addDigitalAssets)} checked={permissions.addDigitalAssets} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Edit
                                            <input type="checkbox" name="editDigitalAssets" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.editDigitalAssets)} checked={permissions.editDigitalAssets} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Delete
                                            <input type="checkbox" name="deleteDigitalAssets" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.deleteDigitalAssets)} checked={permissions.deleteDigitalAssets} />
                                            <span className="checkmark"></span>
                                        </label>
                                        {/* <label className="fancy-checkbox custom-bgcolor-blue">
                                                <input type="checkbox" name="viewDigitalassets" disabled = {props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewDigitalassets)} checked={permissions.viewDigitalassets}></input>
                                                <span>View</span>
                                            </label>
                                            <label className="fancy-checkbox custom-bgcolor-blue">
                                                <input type="checkbox" name="addDigitalAssets" disabled = {props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.addDigitalAssets)} checked={permissions.addDigitalAssets}></input>
                                                <span>Add</span>
                                            </label>
                                            <label className="fancy-checkbox custom-bgcolor-blue">
                                                <input type="checkbox" name="editDigitalAssets" disabled = {props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.editDigitalAssets)} checked={permissions.editDigitalAssets}></input>
                                                <span>Edit</span>
                                            </label>
                                            <label className="fancy-checkbox custom-bgcolor-blue">
                                                <input type="checkbox" name="deleteDigitalAssets" disabled = {props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.deleteDigitalAssets)} checked={permissions.deleteDigitalAssets}></input>
                                                <span>Delete</span>
                                            </label> */}
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group>
                                <Row>
                                    <Col md={4}>
                                        <label className="label-font">Help Center Page</label>
                                    </Col>
                                    <Col md={8} className="check-inline d-flex">
                                        <label className="right-label-checkbox mr-3 mb-2">View
                                            <input type="checkbox" name="viewHelpCenterPage" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewHelpCenterPage)} checked={permissions.viewHelpCenterPage} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Add
                                            <input type="checkbox" name="addHelpCenterPage" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.addHelpCenterPage)} checked={permissions.addHelpCenterPage} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Edit
                                            <input type="checkbox" name="editHelpCenterPage" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.editHelpCenterPage)} checked={permissions.editHelpCenterPage} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Delete
                                            <input type="checkbox" name="deleteHelpCenterPage" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.deleteHelpCenterPage)} checked={permissions.deleteHelpCenterPage} />
                                            <span className="checkmark"></span>
                                        </label>
                                        {/* <label className="fancy-checkbox custom-bgcolor-blue">
                                                <input type="checkbox" name="viewHelpCenterPage" disabled = {props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewHelpCenterPage)} checked={permissions.viewHelpCenterPage}></input>
                                                <span>View</span>
                                            </label>
                                            <label className="fancy-checkbox custom-bgcolor-blue">
                                                <input type="checkbox" name="addHelpCenterPage" disabled = {props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.addHelpCenterPage)} checked={permissions.addHelpCenterPage}></input>
                                                <span>Add</span>
                                            </label>
                                            <label className="fancy-checkbox custom-bgcolor-blue">
                                                <input type="checkbox" name="editHelpCenterPage" disabled = {props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.editHelpCenterPage)} checked={permissions.editHelpCenterPage}></input>
                                                <span>Edit</span>
                                            </label>
                                            <label className="fancy-checkbox custom-bgcolor-blue">
                                                <input type="checkbox" name="deleteHelpCenterPage" disabled = {props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.deleteHelpCenterPage)} checked={permissions.deleteHelpCenterPage}></input>
                                                <span>Delete</span>
                                            </label> */}
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group>
                                <Row>
                                    <Col md={4}>
                                        <label className="label-font">Payment Gateway</label>
                                    </Col>
                                    <Col md={8} className="check-inline d-flex">
                                        <label className="right-label-checkbox mr-3 mb-2">View
                                            <input type="checkbox" name="viewPaymentGateway" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewPaymentGateway)} checked={permissions.viewPaymentGateway} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Add
                                            <input type="checkbox" name="addPaymentGateway" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.addPaymentGateway)} checked={permissions.addPaymentGateway} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Edit
                                            <input type="checkbox" name="editPaymentGateway" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.editPaymentGateway)} checked={permissions.editPaymentGateway} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Delete
                                            <input type="checkbox" name="deletePaymentGateway" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.deletePaymentGateway)} checked={permissions.deletePaymentGateway} />
                                            <span className="checkmark"></span>
                                        </label>
                                        {/* <label className="fancy-checkbox custom-bgcolor-blue">
                                                <input type="checkbox" name="viewPaymentGateway" disabled = {props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewPaymentGateway)} checked={permissions.viewPaymentGateway}></input>
                                                <span>View</span>
                                            </label>
                                            <label className="fancy-checkbox custom-bgcolor-blue">
                                                <input type="checkbox" name="addPaymentGateway" disabled = {props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.addPaymentGateway)} checked={permissions.addPaymentGateway}></input>
                                                <span>Add</span>
                                            </label>
                                            <label className="fancy-checkbox custom-bgcolor-blue">
                                                <input type="checkbox" name="editPaymentGateway" disabled = {props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.editPaymentGateway)} checked={permissions.editPaymentGateway}></input>
                                                <span>Edit</span>
                                            </label>
                                            <label className="fancy-checkbox custom-bgcolor-blue">
                                                <input type="checkbox" name="deletePaymentGateway" disabled = {props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.deletePaymentGateway)} checked={permissions.deletePaymentGateway}></input>
                                                <span>Delete</span>
                                            </label> */}
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group>
                                <Row>
                                    <Col md={4}>
                                        <label className="label-font">Third Parties</label>
                                    </Col>
                                    <Col md={8} className="check-inline d-flex">
                                        <label className="right-label-checkbox mr-3 mb-2">View
                                            <input type="checkbox" name="viewThirdParty" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewThirdParty)} checked={permissions.viewThirdParty} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Edit
                                            <input type="checkbox" name="editThirdParty" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.editThirdParty)} checked={permissions.editThirdParty} />
                                            <span className="checkmark"></span>
                                        </label>
                                        {/* <label className="fancy-checkbox custom-bgcolor-blue">
                                                <input type="checkbox" name="viewThirdParty" disabled = {props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewThirdParty)} checked={permissions.viewThirdParty}></input>
                                                <span>View</span>
                                            </label>
                                            <label className="fancy-checkbox custom-bgcolor-blue">
                                                <input type="checkbox" name="editThirdParty" disabled = {props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.editThirdParty)} checked={permissions.editThirdParty}></input>
                                                <span>Edit</span>
                                            </label> */}
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group>
                                <Row>
                                    <Col md={4}>
                                        <label className="label-font">Newsletters</label>
                                    </Col>
                                    <Col md={8} className="check-inline d-flex">
                                        <label className="right-label-checkbox mr-3 mb-2">View
                                            <input type="checkbox" name="viewNewsLetter" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewNewsLetter)} checked={permissions.viewNewsLetter} />
                                            <span className="checkmark"></span>
                                        </label>
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group>
                                <Row>
                                    <Col md={4}>
                                        <label className="label-font">Notable Drops Settings</label>
                                    </Col>
                                    <Col md={8} className="check-inline d-flex">
                                        <label className="right-label-checkbox mr-3 mb-2">View
                                            <input type="checkbox" name="viewNotableDropsSettings" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewNotableDropsSettings)} checked={permissions.viewNotableDropsSettings} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Edit
                                            <input type="checkbox" name="editNotableDropsSettings" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.editNotableDropsSettings)} checked={permissions.editNotableDropsSettings} />
                                            <span className="checkmark"></span>
                                        </label>
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group>
                                <Row>
                                    <Col md={4}>
                                        <label className="label-font">Homepage Nfts Settings</label>
                                    </Col>
                                    <Col md={8} className="check-inline d-flex">
                                        <label className="right-label-checkbox mr-3 mb-2">View
                                            <input type="checkbox" name="viewHomepageNftSettings" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewHomepageNftSettings)} checked={permissions.viewHomepageNftSettings} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Edit
                                            <input type="checkbox" name="editHomepageNftSettings" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.editHomepageNftSettings)} checked={permissions.editHomepageNftSettings} />
                                            <span className="checkmark"></span>
                                        </label>
                                    </Col>
                                </Row>
                            </Form.Group>

                            <FormGroup>
                                <Row>
                                    <Col md={4}>
                                        <label className="label-font">Status</label>
                                    </Col>
                                    <Col md={8} className="check-inline d-flex">
                                        <label className="right-label-radio mr-3 mb-2">Active
                                            <input name="status" disabled={props.modalType === 2} type="radio" checked={props.status} value={props.status} onChange={(e) => props.setStatus(true)} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-radio mr-3 mb-2">Inactive
                                            <input name="status" disabled={props.modalType === 2} type="radio" checked={!props.status} value={!props.status} onChange={(e) => props.setStatus(false)} />
                                            <span className="checkmark"></span>
                                        </label>
                                        {/* <label className="fancy-radio custom-color-blue">
                                                <input name="props.status" disabled={props.modalType === 2} type="radio" checked={props.status} value={props.status} onChange={(e) => props.setStatus(true)} />
                                                <span disabled = {props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, true)} ><i />Active</span>
                                            </label>
                                            <label className="fancy-radio custom-color-blue">
                                                <input name="props.status" disabled={props.modalType === 2} type="radio" checked={!props.status} value={!props.status} onChange={(e) => props.setStatus(false)} />
                                                <span disabled = {props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, false)} ><i />Inactive</span>
                                            </label> */}
                                    </Col>
                                </Row>
                            </FormGroup>
                        </Form>
                    </Modal.Body>

                    <Modal.Footer>
                        {/* <Button className="btn btn-warnign" onClick={(e) => onCloseHandler()}>Close</Button> */}
                        <Button className="outline-button" onClick={() => onCloseHandler()}>Close</Button>
                        {props.modalType === 2 ? '' :
                            <Button className="btn-filled" onClick={() => submit()} /* disabled={isLoader} */>Save</Button>
                        }
                    </Modal.Footer>
                </Modal>
            }
        </Container>
    )
}

export default StaffPermissionModal;