import { useState, useEffect } from "react";
import { ENV } from '../../config/config';
import { toast } from 'react-toastify';
import { getPercentagesWeb3, updatePercentagesWeb3 } from '../../utils/web3'
import FullPageLoader from "components/FullPageLoader/FullPageLoader";
import { useSelector, useDispatch } from "react-redux";
import { getRole, beforeRole } from "views/AdminStaff/permissions/permissions.actions";
const { integerNumberValidator } = ENV
var CryptoJS = require("crypto-js");

// react-bootstrap components
import {
	Button,
	Card,
	Form,
	Container,
	Row,
	Col,
} from "react-bootstrap";

const NftsSettings = (props) => {
	const dispatch = useDispatch()
	const [loader, setLoader] = useState(true)
	const [permissions, setPermissions] = useState({})
	const getRoleRes = useSelector(state => state.role.getRoleRes)

	useEffect(async () => {
		toast.dismiss()
		window.scroll(0, 0)
		const royaltySplit = await getPercentagesWeb3()
		setData({
			royaltySplit: Number(royaltySplit)
		})

		let roleEncrypted = localStorage.getItem('role');
		let role = ''
		if (roleEncrypted) {
			let roleDecrypted = CryptoJS.AES.decrypt(roleEncrypted, ENV.secretKey).toString(CryptoJS.enc.Utf8);
			role = roleDecrypted
			dispatch(getRole(role))
		}

		setLoader(false)
	}, [])

	useEffect(() => {
		if (Object.keys(getRoleRes).length > 0) {
			setPermissions(getRoleRes.role)
			dispatch(beforeRole())
		}
	}, [getRoleRes])


	const [data, setData] = useState({
		royaltySplit: null
	})

	const [msg, setMsg] = useState({
		royaltySplit: ''
	})

	const save = async () => {
		if (data.royaltySplit) {
			if (data.royaltySplit < 0 || data.royaltySplit > 100) {
				setMsg({
					royaltySplit: 'Value should be in range 0-100'
				})
			}
			else {
				setLoader(true)
				setMsg({
					royaltySplit: ''
				})
				let updatedPercentage = await updatePercentagesWeb3(
					data.royaltySplit
				)
				if (updatedPercentage) {
					setLoader(false)
				}
			}
		}
		else {
			let royaltySplit = ''
			if (!data.royaltySplit) {
				royaltySplit = "Royalty split is required"
			}
			setMsg({
				royaltySplit
			})
		}
	}


	return (
		<>
			{
				loader ?
					<FullPageLoader />
					:
					<Container fluid>
						<Row>
							<Col md="12">
								<Form action="" className="form-horizontal" id="TypeValidation" method="" >
									<Card className="table-big-boy">
										<Card.Header>
											<div className="d-block d-md-flex align-items-center justify-content-between">
												<Card.Title as="h4">Percentage Settings</Card.Title>
											</div>
										</Card.Header>
										<Card.Body>
											<Row>
												<Col xl={4} sm={6}>
													<Form.Group>
														<Form.Label className="d-block mb-2">Royalty Split Percentage <span className="text-danger">*</span></Form.Label>
														<Form.Control type="text" value={data.royaltySplit ? data.royaltySplit : 0} onChange={(e) => setData({ ...data, royaltySplit: e.target.value })} onKeyDown={(e) => integerNumberValidator(e)}></Form.Control>
														<span className={msg.royaltySplit ? `` : `d-none`}>
															<label className="pl-1 pt-0 text-danger">{msg.royaltySplit}</label>
														</span>
													</Form.Group>
												</Col>
											</Row>
										</Card.Body>
										<Card.Footer>
											<Row className="float-right">
												{
													permissions && permissions.editSetting &&
													<Col sm={12}>
														<Button variant="info" onClick={save}>Save Settings</Button>
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

export default NftsSettings;
