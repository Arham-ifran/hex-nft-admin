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


const SocialSettings = (props) => {

	const [links, setLinks] = useState({
		discord: '',
		twitter: '',
		youtube: '',
		instagram: '',
		linkedIn: '',
		medium: '',
		telegram: '',
		reddit: '',
		github: '',
		facebook: ''
	})
	const [permissions, setPermissions] = useState({})
	const [loader, setLoader] = useState(true)
	const [msg, setMsg] = useState({
		discord: '',
		twitter: '',
		youtube: '',
		instagram: '',
		medium: '',
		telegram: '',
		reddit: '',
		github: '',
		linkedIn: '',
		facebook: ''
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

	useEffect(()=>{
        if (Object.keys(props.getRoleRes).length > 0) {
            setPermissions(props.getRoleRes.role)
			props.beforeRole()
        }
    },[props.getRoleRes])

	useEffect(() => {
		if (props.settings.settingsAuth) {
			if (props.settings.settings) {
				setLoader(false)
				setLinks({ ...links, ...props.settings.settings })
			}
			props.beforeSettings()
		}
	}, [props.settings.settingsAuth])

	const isValidUrl = (userInput) => {
		if(userInput.includes('www')){
			let value = userInput.split('www.')[1]
			return isValidUrl(value ? value : '')
		}
		var res = userInput.match(/^(http(s)?:\/\/)?(www.)?([a-zA-Z0-9])+([\-\.]{1}[a-zA-Z0-9]+)*\.[a-zA-Z]{2,5}(:[0-9]{1,5})?(\/[^\s]*)?$/gm);
        if (res == null)
            return false;
        else
            return true;
		
    }


	const save = () => {
		let check = true
		if(!validator.isEmpty(links.discord) && !isValidUrl(links.discord)){
			setMsg({discord : 'Invalid Url'})
			check = false
		}
		if(!validator.isEmpty(links.twitter) && !isValidUrl(links.twitter)){
			setMsg({twitter : 'Invalid Url'})
			check = false
		}
		if(!validator.isEmpty(links.youtube) && !isValidUrl(links.youtube)){
			setMsg({youtube : 'Invalid Url'})
			check = false
		}
		if(!validator.isEmpty(links.instagram) && !isValidUrl(links.instagram)){
			setMsg({instagram : 'Invalid Url'})
			check = false
		}
		if(!validator.isEmpty(links.medium) && !isValidUrl(links.medium)){
			setMsg({medium : 'Invalid Url'})
			check = false
		}
		if(!validator.isEmpty(links.reddit) && !isValidUrl(links.reddit)){
			setMsg({reddit : 'Invalid Url'})
			check = false
		}
		if(!validator.isEmpty(links.telegram) && !isValidUrl(links.telegram)){
			setMsg({telegram : 'Invalid Url'})
			check = false
		}
		if(!validator.isEmpty(links.github) && !isValidUrl(links.github)){
			setMsg({github : 'Invalid Url'})
			check = false
		}
		if(!validator.isEmpty(links.linkedIn) && !isValidUrl(links.linkedIn)){
			setMsg({linkedIn : 'Invalid Url'})
			check = false
		}
		if(!validator.isEmpty(links.facebook) && !isValidUrl(links.facebook)){
			setMsg({facebook : 'Invalid Url'})
			check = false
		}

		if(check){
			setMsg({})
			let formData = new FormData()
			for (const key in links)
				formData.append(key, links[key])
			const qs = ENV.objectToQueryString({ type: '2' })
			props.editSettings(formData, qs)
			setLoader(true)
		}
	}


	return (
		<>
		{

		loader? <FullPageLoader/> : 
			<Container fluid>
				<Row>
					<Col md="12">
						<Form action="" className="form-horizontal" id="TypeValidation" method="">
							<Card className="table-big-boy">
								<Card.Header>
									<div className="d-block d-md-flex align-items-center justify-content-between">
										<Card.Title as="h4">Social Settings</Card.Title>
									</div>
								</Card.Header>
								
									<Card.Body>
									<Row>
										<Col xl={4} sm={6}>
											<Form.Group>
												<Form.Label className="d-block mb-2">Discord</Form.Label>
												<Form.Control type="text" value={links.discord} onChange={(e) => setLinks({ ...links, discord: e.target.value })} ></Form.Control>
											</Form.Group>
											<span className={msg.discord ? `` : `d-none`}>
												<label className="pl-1 pt-0 text-danger">{msg.discord}</label>
											</span>

										</Col>
										<Col xl={4} sm={6}>
											<Form.Group>
												<Form.Label className="d-block mb-2">Twitter</Form.Label>
												<Form.Control type="text" value={links.twitter} onChange={(e) => setLinks({ ...links, twitter: e.target.value })}></Form.Control>
											</Form.Group>
											<span className={msg.twitter ? `` : `d-none`}>
												<label className="pl-1 pt-0 text-danger">{msg.twitter}</label>
											</span>

										</Col>
										<Col xl={4} sm={6}>
											<Form.Group>
												<Form.Label className="d-block mb-2">YouTube</Form.Label>
												<Form.Control type="text" value={links.youtube} onChange={(e) => setLinks({ ...links, youtube: e.target.value })}></Form.Control>
											</Form.Group>
											<span className={msg.youtube ? `` : `d-none`}>
												<label className="pl-1 pt-0 text-danger">{msg.youtube}</label>
											</span>

										</Col>
										<Col xl={4} sm={6}>
											<Form.Group>
												<Form.Label className="d-block mb-2">Instagram </Form.Label>
												<Form.Control type="text" value={links.instagram} onChange={(e) => setLinks({ ...links, instagram: e.target.value })} ></Form.Control>
											</Form.Group>
											<span className={msg.instagram ? `` : `d-none`}>
												<label className="pl-1 pt-0 text-danger">{msg.instagram}</label>
											</span>

										</Col>
										<Col xl={4} sm={6}>
											<Form.Group>
												<Form.Label className="d-block mb-2">Medium</Form.Label>
												<Form.Control type="text" value={links.medium} onChange={(e) => setLinks({ ...links, medium: e.target.value })} ></Form.Control>
											</Form.Group>
											<span className={msg.medium ? `` : `d-none`}>
												<label className="pl-1 pt-0 text-danger">{msg.medium}</label>
											</span>

										</Col>
										<Col xl={4} sm={6}>
											<Form.Group>
												<Form.Label className="d-block mb-2">Telegram</Form.Label>
												<Form.Control type="text" value={links.telegram} onChange={(e) => setLinks({ ...links, telegram: e.target.value })} ></Form.Control>
											</Form.Group>
											<span className={msg.telegram ? `` : `d-none`}>
												<label className="pl-1 pt-0 text-danger">{msg.telegram}</label>
											</span>

										</Col>
										<Col xl={4} sm={6}>
											<Form.Group>
												<Form.Label className="d-block mb-2">Linked In</Form.Label>
												<Form.Control type="text" value={links.linkedIn} onChange={(e) => setLinks({ ...links, linkedIn: e.target.value })} ></Form.Control>
											</Form.Group>
											<span className={msg.linkedIn ? `` : `d-none`}>
												<label className="pl-1 pt-0 text-danger">{msg.linkedIn}</label>
											</span>

										</Col>
										<Col xl={4} sm={6}>
											<Form.Group>
												<Form.Label className="d-block mb-2">Facebook</Form.Label>
												<Form.Control type="text" value={links.facebook} onChange={(e) => setLinks({ ...links, facebook: e.target.value })} ></Form.Control>
											</Form.Group>
											<span className={msg.facebook ? `` : `d-none`}>
												<label className="pl-1 pt-0 text-danger">{msg.facebook}</label>
											</span>

										</Col>
										<Col xl={4} sm={6}>
											<Form.Group>
												<Form.Label className="d-block mb-2">Reddit</Form.Label>
												<Form.Control type="text" value={links.reddit} onChange={(e) => setLinks({ ...links, reddit: e.target.value })} ></Form.Control>
											</Form.Group>
											<span className={msg.reddit ? `` : `d-none`}>
												<label className="pl-1 pt-0 text-danger">{msg.reddit}</label>
											</span>

										</Col>
										<Col xl={4} sm={6}>
											<Form.Group>
												<Form.Label className="d-block mb-2">Github</Form.Label>
												<Form.Control type="text" value={links.github} onChange={(e) => setLinks({ ...links, github: e.target.value })} ></Form.Control>
											</Form.Group>
											<span className={msg.github ? `` : `d-none`}>
												<label className="pl-1 pt-0 text-danger">{msg.github}</label>
											</span>

										</Col>
									</Row>
								</Card.Body>
								<Card.Footer>
									<Row className="float-right">
										{
											permissions && permissions.editSetting &&
												<Col sm={12}>
													<Button className="btn-filled" onClick={save} > Save Settings </Button>
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

export default connect(mapStateToProps, { getSettings, beforeSettings, editSettings, getRole , beforeRole})(SocialSettings);
