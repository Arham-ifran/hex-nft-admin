import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { beforeAdmin, login } from '../Admin/Admin.action'
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import { NavLink } from "react-router-dom";
import HexMainLogo from "../../assets/img/myntist-logo.png";
import { toast } from 'react-toastify';
import validator from 'validator';
import { ENV } from "../../config/config";
var CryptoJS = require("crypto-js");

// react-bootstrap components
import { Badge, Button, Card, Form, Navbar, Nav, Container, Col } from "react-bootstrap";

function Login(props) {
    const [user, setUser] = useState({ email: '', password: '' })
    const [loader, setLoader] = useState(false)
    const [msg, setMsg] = useState({emailMsg : '', passwordMsg : ''})

    // when response from login is received
    useEffect(() => {
        if (props.admin.loginAdminAuth) {
            let roleId = props.admin.admin?.data?.roleId
            var encryptedRole = CryptoJS.AES.encrypt(roleId, ENV.secretKey).toString();
            localStorage.setItem('role', encryptedRole);
            localStorage.setItem('userID', props.admin.admin?.data?._id);
            localStorage.setItem('userName', props.admin.admin?.data?.name);        
            props.history.push('/dashboard')
           
        }
    }, [props.admin.loginAdminAuth])

    // when an error is received
    useEffect(() => {
        if (props.error.error)
            setLoader(false)
    }, [props.error.error])

    const onChange = (e) => {
        
        let { name, value } = e.target
        let data = user
        data[name] = value
        setUser({ ...data })
    }

    const submit = async () => {

        let check = true
        if(validator.isEmpty(user.email)){
            check = false
            setMsg({ emailMsg : 'Email is Required'})
        }
        else if(!validator.isEmail(user.email)){
            check = false
            setMsg({ emailMsg : 'Invalid Email' })
        }

        if(validator.isEmpty(user.password)){
            check = false
            setMsg({ passwordMsg : 'Password is required'})
        }

        
        if (check) {
            setMsg({emailMsg : '', passwordMsg : ''})
            setLoader(true)
            props.login(user)
        }
        
    }

    const handleKeyPress = (e) =>{
        if (e.key === 'Enter') {
            e.preventDefault();
            submit();
        }
    }

    return (
        <>
            {
                loader ?
                    <FullPageLoader />
                    :
                    <div className="full-page section-image" data-color="black" data-image={"https://res.cloudinary.com/arhamsoft-ltd/image/upload/v1655727483/hex-nft/assets/bg-banner-img_gpjreo.png"}>
                        <div className="content d-flex align-items-center p-0">
                            <Container>
                                <Col className="mx-auto" lg="4" md="8">
                                    <Form action="" className="form" method="">
                                        <Card className="card-login">
                                            {/* <h3 className="header text-center">Login</h3> */}
                                            <Card.Header className="text-center">
                                                <div className="logo-holder d-inline-block align-top">
                                                    <img src="https://res.cloudinary.com/arhamsoft-ltd/image/upload/v1654510130/hex-nft/assets/myntist-logo_fnnuqb.png" className="img-fluid" alt=""/>
                                                </div>
                                            </Card.Header>
                                            <Card.Body>
                                                <Card.Body>
                                                    <Form.Group onKeyPress={handleKeyPress}>
                                                        <label>Email address <span className="text-danger">*</span></label>
                                                        <Form.Control placeholder="Enter email" type="text" name="email" onChange={(e) => onChange(e)} defaultValue={user.email} />
                                                        <span className={msg.emailMsg ? `` : `d-none`}>
                                                            <label className="pl-1 text-danger">{msg.emailMsg}</label>
                                                        </span>
                                                    </Form.Group>
                                                    <Form.Group onKeyPress={handleKeyPress}>
                                                        <label>Password <span className="text-danger">*</span></label>
                                                        <Form.Control placeholder="Enter Password" type="password" name="password" onChange={(e) => onChange(e)} defaultValue={user.password}/>
                                                        <span className={msg.passwordMsg ? `` : `d-none`}>
                                                            <label className="pl-1 text-danger">{msg.passwordMsg}</label>
                                                        </span>
                                                    </Form.Group>
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <Form.Check className="pl-0"></Form.Check>
                                                        <NavLink to="/forgot-password" className="btn-no-bg" type="submit" variant="warning">
                                                            Forgot Password ?
                                                        </NavLink>
                                                    </div>
                                                </Card.Body>
                                            </Card.Body>
                                            <Card.Footer className="ml-auto mr-auto">
                                                <Button className="btn-filled" type="button" disabled={loader} onClick={() => submit()}>Login</Button>
                                            </Card.Footer>
                                        </Card>
                                    </Form>
                                </Col>
                            </Container>
                        </div>
                        <div className="full-page-background" style={{ backgroundImage: "url(https://res.cloudinary.com/arhamsoft-ltd/image/upload/v1655727483/hex-nft/assets/bg-banner-img_gpjreo.png)" }}></div>
                    </div>

            }
        </>
    );
}

const mapStateToProps = state => ({
    admin: state.admin,
    error: state.error,

});

export default connect(mapStateToProps, { beforeAdmin, login})(Login);