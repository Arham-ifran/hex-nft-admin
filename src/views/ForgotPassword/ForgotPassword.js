import React from "react";

import './ForgotPassword.css'

// react-bootstrap components
import { Button, Card, Form, Container, Col } from "react-bootstrap";
import validator from 'validator';

import { forgotPassword, beforeAdmin } from '../Admin/Admin.action'
import { connect } from 'react-redux';
import { NavLink } from "react-router-dom";
import { Alert } from "react-bootstrap";

import HexMainLogo from "../../assets/img/hex-main-logo.svg";

function ForgotPassword(props) {
const [cardClasses, setCardClasses] = React.useState("card-hidden");
const [email, setEmail] = React.useState('')
const [emailMsg, setEmailMsg] = React.useState('')
const [emailCheck, setEmailCheck] = React.useState(false)
const [msg, setMsg] = React.useState('')

const resetPassword = (e) => {
	e.preventDefault();
	if(validator.isEmpty(email)){
		// setEmailCheck(false)
		setEmailMsg('Email address is required')
	}
	else if (!validator.isEmail(email)) {
		// setEmailCheck(false)
		setEmailMsg('Invalid Email')
	}
	else {
	// setEmailCheck(true)
		setEmailMsg('')
		props.forgotPassword({ email })

	}
}

React.useEffect(() => {
	setTimeout(function () {
	setCardClasses("");
	}, 500);
});

React.useEffect(() => {
	if (props.admin.forgotPasswordAuth) {
	setEmail('')
	setMsg(props.admin.forgotMsg)
	props.beforeAdmin()
	}
}, [props.admin.forgotPasswordAuth])

const getAlert = () => {
	if (msg) {
	return (
		<Alert variant="info">
		<span>{msg}</span>
		</Alert>
	)
	}
}

return (
	<>
		<div className="full-page section-image" data-color="black" data-image={"https://res.cloudinary.com/arhamsoft-ltd/image/upload/v1655727483/hex-nft/assets/bg-banner-img_gpjreo.png"} >
			<div className="content d-flex align-items-center p-0">
				<Container>
					<Col className="mx-auto" lg="4" md="8">
						<Form action="" className="form" method="">
							<Card className={"card-login " + cardClasses}>
								<Card.Header className="text-center">
									<div className="logo-holder d-inline-block align-top">
										<img src="https://res.cloudinary.com/arhamsoft-ltd/image/upload/v1654510130/hex-nft/assets/myntist-logo_fnnuqb.png" className="img-fluid" alt="" />
									</div>
								</Card.Header>
								<Card.Body>
									{getAlert()}
									<Form.Group>
										<label>Email address</label>
										<Form.Control placeholder="Enter email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}></Form.Control>
									</Form.Group>
									<span className={emailMsg ? `` : `d-none`}>
										<label className="pl-1 text-danger">{emailMsg}</label>
									</span>
									<div className="d-flex justify-content-between align-items-center">
										<Form.Check className="pl-0"></Form.Check>
										<a href="/" className="btn-no-bg" type="submit" variant="warning">Login Page</a>
									</div>
								</Card.Body>
								<Card.Footer className="ml-auto mr-auto">
									<Button className="btn-filled" type="submit" onClick={resetPassword} >Submit</Button>
								</Card.Footer>
							</Card>
						</Form>
					</Col>
				</Container>
			</div>
			<div className="full-page-background" style={{ backgroundImage: "url(https://res.cloudinary.com/arhamsoft-ltd/image/upload/v1655727483/hex-nft/assets/bg-banner-img_gpjreo.png)" }}></div>
		</div>
	</>
);
}

const mapStateToProps = state => ({
admin: state.admin,
error: state.error
});

export default connect(mapStateToProps, { forgotPassword, beforeAdmin })(ForgotPassword);
