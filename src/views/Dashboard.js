import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { Button, Card, Form, Table, Container, Row, Col, OverlayTrigger, Tooltip, Modal } from "react-bootstrap";
import moment from 'moment';
import Swal from 'sweetalert2';
import { beforeDashboard, getDashboard } from './Dashboard.action';
import { beforeUser, getUsers, deleteUser } from '../views/Users/Users.action'
import FullPageLoader from 'components/FullPageLoader/FullPageLoader'
import userDefaultImg from '../assets/img/transparent-placeholder.png'
import { connect } from 'react-redux';

function Dashboard(props) {

	const [data, setData] = useState({
		users: 0,
		categories: 0,
		collections: 0,
		nfts: 0,
		auctions: 0
	})
	const [users, setUsers] = useState(null)
	const [modalType, setModalType] = useState(0)
	const [userModal, setUserModal] = useState(false)
	const [loader, setLoader] = useState(true)
	const [user, setUser] = useState(null)

	useEffect(() => {
		props.getDashboard()
		props.getUsers('', {}, false)
	}, [])

	useEffect(() => {
		if (props.dashboard.dataAuth) {
			const { users, categories, collections, nfts, auctions } = props.dashboard.data
			setData({ users, categories, collections, nfts, auctions })
			props.beforeDashboard()
		}
	}, [props.dashboard.dataAuth])

	useEffect(() => {
		if (props.user.getUserAuth) {
			setUsers(props.user.users)
			props.beforeUser()
		}
	}, [props.user.getUserAuth])

	useEffect(() => {
		if (props.user.deleteUserAuth) {
			let filtered = users.filter((item) => {
				if (item._id !== props.user.userId)
					return item
			})
			setUsers(filtered)
			props.beforeUser()
		}
	}, [props.user.deleteUserAuth])

	useEffect(() => {
		if (users) {
			setLoader(false)
			if (window.location.search) {
				const urlParams = new URLSearchParams(window.location.search);
				setModal(3, urlParams.get('userId'))
			}
		}
	}, [users])

	// when an error is received
	useEffect(() => {
		if (props.error.error)
			setLoader(false)
	}, [props.error.error])


	// set modal type
	const setModal = (type = 0, userId = null) => {
		setUserModal(!userModal)
		setModalType(type)
		setLoader(false)
		// add user
		if (type === 1) {
			let user = {
				name: '', image: '', description: '', status: false
			}
			setUser(user)
		}
		// edit or view user
		else if ((type === 2 || type === 3) && userId)
			getUser(userId)
	}

	const getUser = async (userId) => {
		setLoader(true)
		const userData = await users.find((elem) => String(elem._id) === String(userId))
		if (userData)
			setUser({ ...userData })
		setLoader(false)
	}

	const deleteUser = (userId) => {
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
				props.deleteUser(userId)
			}
		})
	}

	return (
		<div className="pt-3 pt-md-5">
			{
				loader ?
					<FullPageLoader />
					:
					<Container fluid>
						<Row>
							<Col xl={3} lg={4} sm={6}>
								<Card className="card-stats">
									<Card.Body>
										<Link to="/users">
											<div className="d-flex">
												<div className="numbers">
													<p className="card-category">Users</p>
													<Card.Title as="h4">{data.users}</Card.Title>
												</div>
												<div className="icon-big text-center icon-warning">
													<i className="nc-icon nc-single-02"></i>
												</div>
											</div>
										</Link>
									</Card.Body>
								</Card>
							</Col>
							<Col xl={3} lg={4} sm={6}>
								<Card className="card-stats">
									<Card.Body>
										<Link to='/categories'>
											<div className="d-flex">
												<div className="numbers">
													<p className="card-category">Categories</p>
													<Card.Title as="h4">{data.categories}</Card.Title>
												</div>
												<div className="icon-big text-center icon-warning">
													<i className="nc-icon nc-bullet-list-67"></i>
												</div>
											</div>
										</Link>
									</Card.Body>
								</Card>
							</Col>
							<Col xl={3} lg={4} sm={6}>
								<Card className="card-stats">
									<Card.Body>
										<Link to="/collections">
											<div className="d-flex">
												<div className="numbers">
													<p className="card-category">Collections</p>
													<Card.Title as="h4">{data.collections}</Card.Title>
												</div>
												<div className="icon-big text-center icon-warning">
													<i className="nc-icon nc-cart-simple"></i>
												</div>
											</div>
										</Link>
									</Card.Body>
								</Card>
							</Col>
							<Col xl={3} lg={4} sm={6}>
								<Card className="card-stats">
									<Card.Body>
										<Link to="/nfts">
											<div className="d-flex">
												<div className="numbers">
													<p className="card-category">NFTs</p>
													<Card.Title as="h4">{data.nfts}</Card.Title>
												</div>
												<div className="icon-big text-center icon-warning">
													<i className="nc-icon nc-grid-45"></i>
												</div>
											</div>
										</Link>
									</Card.Body>
								</Card>
							</Col>
							<Col xl={3} lg={4} sm={6}>
								<Card className="card-stats">
									<Card.Body>
										<Link to="/Live Auctions">
											<div className="d-flex">
												<div className="numbers">
													<p className="card-category">Live Auctions</p>
													<Card.Title as="h4">{data.auctions}</Card.Title>
												</div>
												<div className="icon-big text-center icon-warning">
													<i className="nc-icon nc-money-coins"></i>
												</div>
											</div>
										</Link>
									</Card.Body>
								</Card>
							</Col>
						</Row>
						<Row>
							<Col sm={12}>
								<Card className="table-big-boy">
									<Card.Header>
										<div className="d-block d-md-flex align-items-center justify-content-between">
											<h4 className="card-title">Users</h4>
										</div>
									</Card.Header>
									<Card.Body className="table-full-width">
										<div className="table-responsive">
											<Table className="table-bigboy">
												<thead>
													<tr>
														<th className="serial-col">#</th>
														<th className="text-center">Image</th>
														<th>Username</th>
														{/* <th>Email</th> */}
														<th>Address</th>
														{/* <th className="text-center">Status</th> */}
														<th className="text-center">Created At</th>
														<th className="td-actions text-center">Actions</th>
													</tr>
												</thead>
												<tbody>
													{
														users && users.length ?
															users.map((user, index) => {
																return (
																	<tr key={index}>
																		<td className="serial-col text-white">{index + 1}</td>
																		<td>
																			<div className="user-image">
																				<img className="img-fluid" alt="User Image" src={user.profileImage ? user.profileImage : userDefaultImg} />
																			</div>
																		</td>
																		<td className="text-white">
																			{user.username}
																		</td>
																		{/* <td>
																			{user.email}
																		</td> */}
																		<td className="text-white">
																			{user.address}
																		</td>
																		{/* <td className="text-center">{user.emailVerified ? 'Verified' : 'Unverified'}</td> */}
																		<td className="td-number text-white text-center">{moment(user.createdAt).format('DD MMM YYYY')}</td>

																		<td className="td-actions text-center">
																			<ul className="list-unstyled mb-0">
																				<li className="d-inline-block align-top">
																					<OverlayTrigger overlay={<Tooltip id="tooltip-897993903">View</Tooltip>} placement="left" >
																						<Button
																							className="btn-link btn-icon"
																							type="button"
																							variant="info"
																							onClick={() => setModal(3, user._id)}
																						>
																							<i className="fas fa-eye"></i>
																						</Button>
																					</OverlayTrigger>
																				</li>
																				{/* <li className="d-inline-block align-top">
																					<OverlayTrigger overlay={<Tooltip id="tooltip-334669391">Delete</Tooltip>} placement="left">
																						<Button
																							className="btn-link btn-icon"
																							type="button"
																							variant="danger"
																							onClick={() => deleteUser(user._id)}
																						>
																							<i className="fas fa-trash"></i>
																						</Button>
																					</OverlayTrigger>
																				</li> */}
																			</ul>
																		</td>
																	</tr>
																)
															})
															:
															<tr>
																<td colSpan="8" className="text-center">
																	<div className="alert alert-info" role="alert">No User Found</div>
																</td>
															</tr>
													}
												</tbody>
											</Table>
											{
												<div className="text-right px-3 pt-3 pb-4">
													<Link to="/users" className="btn-filled">View All Users</Link>
												</div>
											}
										</div>
									</Card.Body>
								</Card>
							</Col>
						</Row>
						{
							modalType > 0 && user &&
							<Modal className="modal-primary" onHide={() => setUserModal(!userModal)} show={userModal}>
								<Modal.Header className="justify-content-center">
									<Row>
										<div className="col-12">
											<h4 className="mb-0 mb-md-3 mt-0">
												{modalType === 1 ? 'Add' : modalType === 2 ? 'Edit' : ''} User
											</h4>
										</div>
									</Row>
								</Modal.Header>
								<Modal.Body>
									<Form className="text-left">
										<Form.Group>
											<label className="label-font mr-2">Profile Image: </label>
											<div>
												<div className="user-view-image">
													<img src={user.profileImage ? user.profileImage : userDefaultImg} />
												</div>
											</div>
										</Form.Group>
										<div className="d-flex name-email">
											<Form.Group className="flex-fill d-flex align-items-center">
												<label className="label-font mr-2">Username: </label><span className="field-value text-white">{user.username}</span>
											</Form.Group>
										</div>
										{/* <div className="d-flex name-email">
											<Form.Group className="flex-fill">
												<label className="label-font mr-2">Email: </label><span className="field-value">{user.email}</span>
											</Form.Group>
										</div> */}
										{/* <div className="d-flex name-email">
											<Form.Group>
												<label className="label-font mr-2">Status: </label><span className="field-value">{user.emailVerified ? 'Verified' : 'Unverified'}</span>
											</Form.Group>
										</div> */}
										<div className="d-flex name-email">
											<Form.Group className="d-flex">
												<label className="label-font mr-2">Description:</label><span className="field-value text-white"> {user.description ? user.description : 'N/A'}</span>
											</Form.Group>
										</div>
										<div className="d-flex name-email align-items-center">
											<Form.Group className="d-flex align-items-center">
												<label className="label-font mr-2">Facebook: </label><span className="field-value text-white">{user.facebookLink ? user.facebookLink : 'N/A'}</span>
											</Form.Group>
										</div>
										<div className="d-flex name-email align-items-center">
											<Form.Group className="d-flex align-items-center">
												<label className="label-font mr-2">Twitter: </label><span className="field-value text-white">{user.twitterLink ? user.twitterLink : 'N/A'}</span>
											</Form.Group>
										</div>
										<div className="d-flex name-email align-items-center">
											<Form.Group className="d-flex align-items-center">
												<label className="label-font mr-2">G Plus: </label><span className="field-value text-white">{user.gPlusLink ? user.gPlusLink : 'N/A'}</span>
											</Form.Group>
										</div>
										<div className="d-flex name-email align-items-center">
											<Form.Group className="d-flex align-items-center">
												<label className="label-font mr-2">Vine: </label><span className="field-value text-white">{user.vineLink ? user.vineLink : 'N/A'}</span>
											</Form.Group>
										</div>
									</Form>
								</Modal.Body>

								<Modal.Footer>
									<Button className="outline-button" onClick={() => setUserModal(!userModal)}>Close</Button>
								</Modal.Footer>
							</Modal>
						}
					</Container>
			}
		</div>
	);
}

const mapStateToProps = state => ({
	dashboard: state.dashboard,
	user: state.user,
	error: state.error,
});

export default connect(mapStateToProps, { beforeDashboard, getDashboard, beforeUser, getUsers, deleteUser })(Dashboard);
