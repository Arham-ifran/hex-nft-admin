import React from "react";
import { NavLink } from "react-router-dom";
import {
	Button,
	Dropdown,
	Form,
	Navbar,
	Nav,
	Container
} from "react-bootstrap";

function AdminNavbar() {
	const [collapseOpen, setCollapseOpen] = React.useState(false);
	return (
		<>
			<Navbar expand="lg">
				<Container fluid>
					<div className="navbar-wrapper">
						<div className="navbar-minimize">
							<Button className="btn-fill btn-icon d-none d-lg-block" onClick={() => document.body.classList.toggle("sidebar-mini")}>
								<i className="fas fa-ellipsis-v visible-on-sidebar-regular"></i>
								<i className="fas fa-bars visible-on-sidebar-mini"></i>
							</Button>
							<Button className="btn-fill btn-icon d-block d-lg-none" onClick={() => document.documentElement.classList.toggle("nav-open")}>
								<i className="fas fa-ellipsis-v visible-on-sidebar-regular"></i>
								<i className="fas fa-bars visible-on-sidebar-mini"></i>
							</Button>
						</div>
					</div>
					<div className="d-flex">
						<Dropdown as={Nav.Item}>
							<Dropdown.Toggle as={Nav.Link} id="dropdown-41471887333" variant="default">
								<i className="nc-icon nc-bullet-list-67"></i>
							</Dropdown.Toggle>
							<Dropdown.Menu alignRight aria-labelledby="navbarDropdownMenuLink" >
								<NavLink to="/profile" className="dropdown-item">
									<i className="nc-icon nc-settings-90"></i>
									Profile
								</NavLink>
								<a style={{ "cursor": "pointer" }} className="dropdown-item" onClick={() => { localStorage.removeItem("accessToken"); window.location.replace('/admin'); localStorage.removeItem("role"); localStorage.removeItem("userName"); localStorage.removeItem("userID"); }}>
									<i className="nc-icon nc-button-power"></i>
									Log out
								</a>
							</Dropdown.Menu>
						</Dropdown>
						{/* <button className="navbar-toggler navbar-toggler-right border-0" type="button" onClick={() => setCollapseOpen(!collapseOpen)}>
							<span className="navbar-toggler-bar burger-lines"></span>
							<span className="navbar-toggler-bar burger-lines"></span>
							<span className="navbar-toggler-bar burger-lines"></span>
						</button> */}
						{/* <Navbar.Collapse className="justify-content-end" in={collapseOpen}>
					<Nav className="nav mr-auto" navbar>
						<Form className="navbar-form navbar-left navbar-search-form ml-3 ml-lg-0" role="search">
						</Form>
					</Nav>
					<Nav navbar> */}
						{/* <NavLink to="/profile" className="dropdown-item">
							<i className="nc-icon nc-settings-90"></i>
							Profile
						</NavLink>
						<NavLink to="/login" className="dropdown-item">
							<i className="nc-icon nc-button-power"></i>
							Log out
						</NavLink> */}
						{/* </Nav>
				</Navbar.Collapse> */}
					</div>
				</Container>
			</Navbar>
		</>
	);
}

export default AdminNavbar;
