import { useState, useEffect } from "react";
import { ENV } from '../../config/config';
import { getSettings, beforeSettings, editSettings } from './settings.action';
import { connect } from 'react-redux';
import { getRole, beforeRole } from "views/AdminStaff/permissions/permissions.actions";
import FullPageLoader from "components/FullPageLoader/FullPageLoader";
var CryptoJS = require("crypto-js");
import validator from 'validator';


// react-bootstrap components
import {
	Button,
	Card,
	Form,
	Container,
	Row,
	Col,
} from "react-bootstrap";


const SiteSettings = (props) => {
	const [tokenMYNT, setTokenMYNT] = useState(false)
	const [tokenBNB, setTokenBNB] = useState(false)
	const [permissions, setPermissions] = useState({})
	const [loader, setLoader] = useState(true)
	const [msg, setMsg] = useState({
		email: ''
	})

	useEffect(() => {
		window.scroll(0, 0)
		props.getSettings()
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
		if (props.settings.settingsAuth) {
			if (props.settings.settings) {
				setLoader(false)
				const settingsData = props.settings.settings
				setSettings({ ...settings, ...settingsData })

				if (settingsData?.paymentTokens?.includes('MYNT'))
					setTokenMYNT(true)

				if (settingsData?.paymentTokens?.includes('BNB'))
					setTokenBNB(true)
			}
			props.beforeSettings()
		}
	}, [props.settings.settingsAuth])

	const [settings, setSettings] = useState({
		email: '',
		mobile: '',
		phone: '',
		address: '',
		desc: '',
		domain: '',
		api: ''
	})

	const submit = () => {
		let check = true
		if (!validator.isEmpty(settings.email) && !validator.isEmail(settings.email)) {
			setMsg({ email: "Invalid Email" })
			check = false
		}
		if (!validator.isEmpty(settings.phone) && !validator.isDecimal(settings.phone)) {
			setMsg({ phone: "Invalid Phone No" })
			check = false
		}
		if (!validator.isEmpty(settings.mobile) && !validator.isDecimal(settings.mobile)) {
			setMsg({ mobile: "Invalid Mobile No" })
			check = false
		}
		if (check) {
			setMsg({ email: '', mobil: '', phone: '' })
			let formData = new FormData()
			for (const key in settings)
				formData.append(key, settings[key])

			let paymentTokens = []

			if (tokenMYNT)
				paymentTokens.push('MYNT')

			if (tokenBNB)
				paymentTokens.push('BNB')

			formData.delete('paymentTokens')
			formData.append('paymentTokens', window.btoa(JSON.stringify(paymentTokens)))

			const qs = ENV.objectToQueryString({ type: '1' })
			props.editSettings(formData, qs)
			setLoader(true)
		}
	}

	return (
		<>
			{
				loader ? <FullPageLoader /> :
					<Container fluid>
						<Row>
							<Col md="12">
								<Form action="" className="form-horizontal" id="TypeValidation" method="">
									<Card className="table-big-boy">
										<Card.Header>
											<div className="d-block d-md-flex align-items-center justify-content-between">
												<Card.Title as="h4">Site Settings</Card.Title>
											</div>
										</Card.Header>

										<Card.Body>
											<Row>
												<Col xl={4} sm={6}>
													<Form.Group>
														<Form.Label className="d-block mb-2">Site Email</Form.Label>
														<Form.Control type="email" value={settings.email} onChange={(e) => { setSettings({ ...settings, email: e.target.value }) }}></Form.Control>
													</Form.Group>
													<span className={msg.email ? `` : `d-none`}>
														<label className="pl-1 pt-0 text-danger">{msg.email}</label>
													</span>

												</Col>
												<Col xl={4} sm={6}>
													<Form.Group>
														<Form.Label className="d-block mb-2">Mobile No</Form.Label>
														<Form.Control type="text" maxLength={12} value={settings.mobile} onChange={(e) => { setSettings({ ...settings, mobile: e.target.value }) }} ></Form.Control>
													</Form.Group>
													<span className={msg.mobile ? `` : `d-none`}>
														<label className="pl-1 pt-0 text-danger">{msg.mobile}</label>
													</span>
												</Col>
												<Col xl={4} sm={6}>
													<Form.Group>
														<Form.Label className="d-block mb-2">Phone No</Form.Label>
														<Form.Control type="text" maxLength={12} value={settings.phone} onChange={(e) => { setSettings({ ...settings, phone: e.target.value }) }} ></Form.Control>
													</Form.Group>
													<span className={msg.phone ? `` : `d-none`}>
														<label className="pl-1 pt-0 text-danger">{msg.phone}</label>
													</span>
												</Col>
												<Col xl={4} sm={6}>
													<Form.Group>
														<Form.Label className="d-block mb-2">Address</Form.Label>
														<Form.Control type="text" value={settings.address} onChange={(e) => { setSettings({ ...settings, address: e.target.value }) }} ></Form.Control>
													</Form.Group>
												</Col>
												<Col xl={4} sm={6}>
													<Form.Group>
														<Form.Label className="d-block mb-2">Description</Form.Label>
														<Form.Control type="text" value={settings.desc} onChange={(e) => { setSettings({ ...settings, desc: e.target.value }) }} ></Form.Control>
													</Form.Group>
												</Col>
												<Col xl={4} sm={6}>
													<Form.Group>
														<Form.Label className="d-block mb-2">Mailgun Domain</Form.Label>
														<Form.Control type="text" value={settings.domain} onChange={(e) => { setSettings({ ...settings, domain: e.target.value }) }} ></Form.Control>
													</Form.Group>
												</Col>
												<Col xl={4} sm={6}>
													<Form.Group>
														<Form.Label className="d-block mb-2">Mailgun Api-Key</Form.Label>
														<Form.Control type="text" value={settings.api} onChange={(e) => { setSettings({ ...settings, api: e.target.value }) }} ></Form.Control>
													</Form.Group>
												</Col>
											</Row>
										</Card.Body>

										<Card.Header>
											<div className="d-block d-md-flex align-items-center justify-content-between">
												<Card.Title as="h4">Payment Tokens</Card.Title>
											</div>
										</Card.Header>

										<Card.Body>
											<Row>
												<Col xl={2} sm={3}>
													<Form.Group>
														<label>MYNT</label>
														<Form.Check
															type="switch"
															id="token-MYNT"
															className="mb-1"
															onChange={(e) => setTokenMYNT(!tokenMYNT)}
															name="token-MYNT"
															defaultValue={false}
															checked={tokenMYNT}
														/>
													</Form.Group>
												</Col>
												<Col xl={2} sm={3}>
													<Form.Group>
														<label>BNB</label>
														<Form.Check
															type="switch"
															id="token-BNB"
															className="mb-1"
															onChange={(e) => setTokenBNB(!tokenBNB)}
															name="token-BNB"
															defaultValue={false}
															checked={tokenBNB}
														/>
													</Form.Group>
												</Col>
											</Row>
										</Card.Body>

										<Card.Footer>
											<Row className="float-right">
												{
													permissions && permissions.editSetting &&
													<Col sm={12}>
														<Button className="btn-filled" onClick={submit}>Save Settings</Button>
													</Col>
												}
											</Row>
										</Card.Footer>
									</Card>
								</Form>
							</Col>
						</Row>
					</Container>
			}
		</>
	);
}

const mapStateToProps = state => ({
	settings: state.settings,
	error: state.error,
	getRoleRes: state.role.getRoleRes

});

export default connect(mapStateToProps, { getSettings, beforeSettings, editSettings, getRole, beforeRole })(SiteSettings);
