import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { ENV } from '../../../config/config';
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import Swal from 'sweetalert2';
import validator from 'validator';
import { addStaffAdmin, updateAdmin } from 'views/Admin/Admin.action';
import $ from 'jquery';
import { Button, Card, Form, Table, Container, Row, Col, OverlayTrigger, Tooltip, Modal, FormGroup } from "react-bootstrap";
var CryptoJS = require("crypto-js");

const StaffPermissionModal = (props) => {
    const dispatch = useDispatch()
    const [userId, setUserId] = useState('')
    const [roleId, setRoleId] = useState('')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [admin, setAdmin] = useState('')
    const [password, setPasssword] = useState('')
    const [confirmPassword, setConfirmPass] = useState('')
    const [status, setStatus] = useState(true)
    const [showPassword, setShowPassword] = useState(false)
    const [adminPassword, setAdminPassword] = useState('')
    const [selectedUserPassword, setSelectedUserPass] = useState('')
    const [adminPasswordVerified, setPasswordVerified] = useState(false)
    const [staff, setStaff] = useState({
        name: '',
        roleId: '',
        email: '',
        password: '',
        phone: '',

    })

    const [roles, setRoles] = useState({})
    const [role, setRole] = useState({})
    const [phone, setPhone] = useState('')
    const [nameMsg, setNameMsg] = useState('')
    const [phoneMsg, setPhoneMsg] = useState('')
    const [emailMsg, setEmailMsg] = useState('')
    const [passwordMsg, setPassMsg] = useState('')
    const [roleMsg, setRoleMsg] = useState('')
    const [confirmPassMsg, setConfirmPassMsg] = useState('')
    const [verifyPassMsg, setVerifyPassMsg] = useState('')
    const [formValid, setFormValid] = useState(false)

    const adminSelector = useSelector(state => state.admin)
    const addAdminRes = useSelector(state => state.admin.addAdminRes)
    const updateAdminRes = useSelector(state => state.admin.updateAdminRes)
    const userVerifyRes = useSelector(state => state.admin.userVerifyRes)
    const userVerifyAuth = useSelector(state => state.admin.userVerifyAuth)


    useEffect(() => {
        if (Object.keys(addAdminRes).length > 0) {
            // props.setroleModal(!props.roleModal)
            props.setModalType(1)
            setEmpty()
            if (addAdminRes.success) {
                toast.success(addAdminRes.message)
            }
            else {
                toast.error(addAdminRes.message)
            }


        }
    }, [addAdminRes])

    useEffect(() => {
        if (Object.keys(updateAdminRes).length > 0) {
            // props.setroleModal(!props.roleModal)
            props.setModalType(1)
            setEmpty()
            // props.setLoader(false)
            // props.getData()
        }
    }, [updateAdminRes])

    useEffect(() => {
        if (Object.keys(props.admin).length > 0) {
            if (props.modalType === 1) {
                setEmpty()
            }
            else if (props.modalType === 2 || props.modalType === 3) {
                setUserId(props.admin._id)
                setName(props.admin.name)
                // setRole(props.admin.role.title)
                setRoleId(props.admin.roleId)
                setEmail(props.admin.email)
                setPhone(props.admin.phone)
                setStatus(props.admin.status)
                setPasssword('')
            }

        }
    }, [props.admin])

    useEffect(() => {
        if (props.roles) {
            setRoles(props.roles)
        }
    }, [props.roles])

    

    const setEmpty = () => {
        setName('')
        setRoleId('')
        // setRoleId('')
        setEmail('')
        setPasssword('')
        setConfirmPass('')
        setPhone('')
        setStatus(true)

        setNameMsg('')
        setRoleMsg('')
        setEmailMsg('')
        setPassMsg('')
        setConfirmPassMsg('')
    }

    const submit = (e) => {
        let check = true
        if (validator.isEmpty(name)) {
            setNameMsg('This field is Required.')
            check = false
        }
        if (validator.isEmpty(roleId)) {
            setRoleMsg('Please select a role')
            check = false
        }
        if (validator.isEmpty(email)) {
            setEmailMsg('This field is Required.')
            check = false
        }
        else {
            if (!validator.isEmail(email)) {
                setEmailMsg('Please enter a valid email address')
                check = false
            }
        }

        if (!validator.isEmpty(phone)) {
            if (!validator.isDecimal(phone)) {
                setPhoneMsg('Please enter a valid phone number')
                check = false
            }
        }

        // if(validator.isEmpty(password) && props.modalType !== 3){
        //     setPassMsg('This field is Required.')
        //     check = false
        // }

        // if(validator.isEmpty(confirmPassword) && props.modalType !== 3){
        //     setConfirmPassMsg('This field is Required.')
        //     check = false
        // }
        // else {
        if (!validator.equals(password, confirmPassword) && props.modalType !== 3) {
            setConfirmPassMsg('Passwords do not match')
            check = false
        }
        // }

        if (check) {
            setFormValid(false)

            let payload = { name, email, password, status, phone, roleId }
            let formData = new FormData()
            for (const key in payload)
                formData.append(key, payload[key])
            if (props.modalType === 1) { // add modal type
                dispatch(addStaffAdmin(payload));
            }
            else if (props.modalType === 3) { // update modal type
                formData.append('_id', userId)
                dispatch(updateAdmin(formData));
            }

            props.setLoader(true)
            props.getData(payload)
            props.setroleModal(!props.roleModal)

        }
        else {
            $('#modal-primary').scrollTop(0, 0)
            setFormValid(true)
        }

    }

    const onCloseHandler = () => {
        props.setroleModal(!props.roleModal)
        setEmpty()
    }

    return (
        <Container fluid>
            {
                formValid ?
                    <div className="text-danger">Please fill the required fields</div> : null
            }
            {
                props.modalType > 0 &&
                <Modal className="modal-primary" id="admin-modal" onHide={() => onCloseHandler()} show={props.roleModal}>
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
                                <label className="text-white">Name <span className="text-danger">*</span></label>
                                <Form.Control
                                    placeholder="Enter name"
                                    disabled={props.modalType === 2}
                                    type="text"
                                    name="name"
                                    onChange={(e) => setName(e.target.value)}
                                    value={name}
                                    required
                                />
                                <span className={nameMsg ? `` : `d-none`}>
                                    <label className="pl-1 text-danger">{nameMsg}</label>
                                </span>

                            </Form.Group>

                            <Form.Group>
                                <label className="text-white d-block">User Role <span className="text-danger">*</span></label>
                                <select disabled={props.modalType === 2} className="form-select pr-3 mr-3" aria-label="Default select example" name="roleId" value={roleId} onChange={(e) => setRoleId(e.target.value)} >
                                    <option value='' className='text-dark'>Select Role</option>
                                    {
                                        props.roles ?
                                            props.roles.length > 0 ?
                                                props.roles.map((role, key) => {
                                                    return (<option className='text-dark'  key={key} value={role._id}>{role.title}</option>);
                                                }) : <option value='' disabled>No role found</option>
                                            : ''
                                    }
                                </select>
                                <span className={roleMsg ? `` : `d-none`}>
                                    <label className="pl-1 text-danger">{roleMsg}</label>
                                </span>
                            </Form.Group>

                            <Form.Group>
                                <label className='text-white'>Email <span className="text-danger">*</span></label>
                                <Form.Control
                                    placeholder="xyz@example.com"
                                    disabled={props.modalType === 2}
                                    type="text"
                                    name="email"
                                    onChange={(e) => setEmail(e.target.value)}
                                    value={email}
                                    required
                                />
                                <span className={emailMsg ? `` : `d-none`}>
                                    <label className="pl-1 text-danger">{emailMsg}</label>
                                </span>

                            </Form.Group>
                            {
                                props.modalType !== 2 ?
                                    <Form.Group>
                                        <Form.Group>
                                            <label className='text-white'>Password <span className="text-danger">{props.modalType === 1 ? '*' : ''}</span></label>
                                            <Form.Control
                                                placeholder="password"
                                                disabled={props.modalType === 2}
                                                type="password"
                                                autoComplete="off"
                                                name="password"
                                                onChange={(e) => setPasssword(e.target.value)}
                                                value={password}
                                                required
                                            />
                                            <span className={passwordMsg ? `` : `d-none`}>
                                                <label className="pl-1 text-danger">{passwordMsg}</label>
                                            </span>
                                        </Form.Group>

                                        <Form.Group>
                                            <label className='text-white'>Confirm Password <span className="text-danger">{props.modalType === 1 ? '*' : ''}</span></label>
                                            <Form.Control
                                                placeholder="confirmPassword"
                                                disabled={props.modalType === 2}
                                                type="password"
                                                autoComplete="off"
                                                name="confirmPassword"
                                                onChange={(e) => setConfirmPass(e.target.value)}
                                                value={confirmPassword}
                                                required
                                            />
                                            <span className={confirmPassMsg ? `` : `d-none`}>
                                                <label className="pl-1 text-danger">{confirmPassMsg}</label>
                                            </span>

                                        </Form.Group>
                                    </Form.Group>
                                    :
                                    null
                            }

                            <Form.Group>
                                <label className='text-white'>Phone <span className="text-danger">*</span></label>
                                <Form.Control
                                    placeholder="+921111111111"
                                    disabled={props.modalType === 2}
                                    type="text"
                                    name="phone"
                                    onChange={(e) => setPhone(e.target.value)}
                                    value={phone}
                                    maxLength={11}

                                />
                                <span className={phoneMsg ? `` : `d-none`}>
                                    <label className="pl-1 text-danger">{phoneMsg}</label>
                                </span>
                            </Form.Group>
                            <FormGroup >
                                <label className='text-white'>Status</label>

                                {/* <label className="fancy-radio custom-color-blue">
                                        <input disabled={props.modalType === 2} name="status" type="radio" checked={status} value={status} onChange={(e) => setStatus(true)} />
                                        <span onChange={(e) => setStatus(true)} ><i />Active</span>
                                    </label> */}
                                {/* <label className="fancy-radio custom-color-blue">
                                    <input disabled={props.modalType === 2} name="status" type="radio" checked={!status} value={!status} onChange={(e) => setStatus(false)} />
                                    <span className='text-white' onChange={(e) => setStatus(false)} ><i />Inactive</span>
                                </label> */}
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
                            </FormGroup>
                        </Form>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button className="outline-button" onClick={() => onCloseHandler()}>Close</Button>
                        {
                            props.modalType === 2 ? '' :
                                <Button className="btn-filled" onClick={() => submit()} /* disabled={isLoader} */>Save</Button>
                        }
                    </Modal.Footer>
                </Modal>
            }
        </Container >
    )
}

export default StaffPermissionModal;