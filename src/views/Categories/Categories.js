import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { ENV } from '../../config/config';
import { beforeCategory, getCategories, upsertCategory, deleteCategory } from './Categories.action';
import { getRole, beforeRole } from '../AdminStaff/permissions/permissions.actions';
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';
import localeInfo from 'rc-pagination/lib/locale/en_US';
import moment from 'moment';
import $ from 'jquery';
import Swal from 'sweetalert2';
import placeholderImg from '../../assets/img/placeholder.png'
import { Button, Card, Form, Table, Container, Row, Col, OverlayTrigger, Tooltip, Modal } from "react-bootstrap";
const CryptoJS = require("crypto-js");

const Categories = (props) => {
    const [categories, setCategories] = useState(null)
    const [pagination, setPagination] = useState(null)
    const [catModal, setCatModal] = useState(false)
    const [modalType, setModalType] = useState(0)
    const [category, setCategory] = useState(null)
    const [loader, setLoader] = useState(true)
    const [permissions, setPermissions] = useState({})
    const [searchName, setSearchName] = useState('')
    const [searchStatus, setSearchStatus] = useState('')

    useEffect(() => {
        window.scroll(0, 0)
        props.getCategories()
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
        if (props.category.getCatAuth) {
            const { categories, pagination } = props.category
            setCategories(categories)
            setPagination(pagination)
            props.beforeCategory()
        }
    }, [props.category.getCatAuth])

    useEffect(() => {
        if (categories) {
            setLoader(false)
        }
    }, [categories])

    // when category is created or updated
    useEffect(() => {
        if (props.category.upsertCatAuth) {
            let catRes = props.category.category
            if (catRes.success) {
                if (modalType === 1)
                    setCategories([catRes.category, ...categories])
                else if (modalType === 2) {
                    const index = categories.findIndex((elem) => String(elem._id) === String(catRes.category._id))
                    if (index > -1) {
                        let catData = categories
                        catData[index] = catRes.category
                        setCategories([...catData])
                    }
                }

                setLoader(false)
                setCatModal(!catModal)
            } else
                setLoader(false)

            props.beforeCategory()
        }
    }, [props.category.upsertCatAuth])

    // when category is deleted
    useEffect(() => {
        if (props.category.deleteCatAuth) {
            const catRes = props.category.category
            if (catRes.success && pagination)
                onPageChange(pagination.page)
            props.beforeCategory()
        }
    }, [props.category.deleteCatAuth])

    // when an error is received
    useEffect(() => {
        if (props.error.error)
            setLoader(false)
    }, [props.error.error])

    // set modal type
    const setModal = (type = 0, catId = null) => {
        setCatModal(!catModal)
        setModalType(type)
        setLoader(false)
        // add category
        if (type === 1) {
            let category = {
                name: '', image: '', description: '', status: false
            }
            setCategory(category)
        }
        // edit category
        else if (type === 2 && catId)
            getCategory(catId)
    }

    const onChange = (e) => {
        let { name, value } = e.target
        let data = category

        // if status is provided
        if (name === 'status')
            value = !category.status
        // if name is provided
        else if (name === 'name')
            data.slug = value.replaceAll(' ', '-').toLowerCase()

        data[name] = value

        setCategory({ ...data })
    }

    const onFileChange = (e) => {
        let file = e.target.files[0]
        let fileId = e.target.id
        if (file)
            if (file.type.includes('image')) {
                let data = category
                data = { ...data, [e.target.name]: file }
                setCategory(data)
                if (file) {
                    var reader = new FileReader()
                    reader.onload = function (e) {
                        $(`#${fileId}`).attr('src', e.target.result)
                        $(`#${fileId}-label`).html('File selected')
                    }
                    reader.readAsDataURL(file)
                }
            } else {
                // TODO
                // $(`#category-${fileId}`).attr('src', placeholderImg)
                file = {}
            }
    }

    const submit = async () => {
        if (category.name && (category.image || modalType === 2) && category.slug) {
            setLoader(true)
            var formData = new FormData()
            for (const key in category)
                formData.append(key, category[key])

            props.upsertCategory(`category/${modalType === 1 ? 'create' : 'edit'}`, formData, modalType === 1 ? 'POST' : 'PUT')
        }
    }

    const applyFilters = () => {
        const filter = {}

        if (searchName && searchName !== '') {
            filter.name = searchName
        }
        if (searchStatus !== '') {
            filter.status = searchStatus === 'true' ? true : false
        }

        const qs = ENV.objectToQueryString({ page: 1, limit: 10 })
        props.getCategories(qs, filter)
        setLoader(true)
    }

    const reset = () => {
        setSearchName('')
        setSearchStatus('')
        props.getCategories()
        setLoader(true)
    }

    const deleteCategory = (catId) => {
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
                props.deleteCategory(catId)
            }
        })
    }

    const getCategory = async (catId) => {
        setLoader(true)
        const catData = await categories.find((elem) => String(elem._id) === String(catId))
        if (catData)
            setCategory({ ...catData })
        setLoader(false)
    }

    const onPageChange = async (page) => {
        const filter = {}

        if (searchName && searchName !== '') {
            filter.name = searchName
        }
        if (searchStatus !== '') {
            filter.status = searchStatus === 'true' ? true : false
        }

        const qs = ENV.objectToQueryString({ page, limit: 10 })
        props.getCategories(qs, filter)
        setLoader(true)
    }

    return (
        <>
            {
                loader ?
                    <FullPageLoader />
                    :
                    <Container fluid>
                        <Row className="pb-3 d-flex align-items-center">
                            <Col sm={12}>
                                <Card className="filter-card">
                                    <Card.Header>
                                        <div className="d-block d-md-flex align-items-center justify-content-between">
                                            <Card.Title as="h4">Filters</Card.Title>
                                            {/* <p className="card-collection">List of Auctions</p> */}
                                        </div>
                                    </Card.Header>
                                    <Card.Body>
                                        <Row>
                                            <Col xl={3} sm={6}>
                                                <label className='text-white'>Name</label>
                                                <Form.Control type="text" value={searchName} placeholder="John" onChange={(e) => setSearchName(e.target.value)} /*onKeyDown={} */ />
                                            </Col>
                                            <Col xl={3} sm={6}>
                                                <label className='text-white'>Status</label>
                                                <select value={searchStatus} onChange={(e) => setSearchStatus(e.target.value)}>
                                                    <option value="">Select Status</option>
                                                    <option value='true'>Active</option>
                                                    <option value="false">Inactive</option>
                                                </select>
                                            </Col>
                                            <Col xl={3} sm={6}>
                                                <Form.Group>
                                                    <Form.Label className="d-block mb-2">&nbsp;</Form.Label>
                                                    <div className="d-flex justify-content-between filter-btns-holder">
                                                        <Button className='btn-filled' onClick={applyFilters}>Search</Button>
                                                        <Button className='outline-button' onClick={reset}>Reset</Button>
                                                    </div>

                                                </Form.Group>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>

                        <Row>
                            <Col>
                                <span className='text-white'>{`Total : ${pagination?.total}`}</span>
                                <label>&nbsp;</label>
                            </Col>
                        </Row>
                        <Row>
                            <Col md="12">
                                <Card className="table-big-boy">
                                    <Card.Header>
                                        <div className="d-flex align-items-center justify-content-between">
                                            <Card.Title as="h4">Categories</Card.Title>
                                            {
                                                permissions && permissions.addCategory &&
                                                <Button className="float-sm-right btn-filled mb-0" onClick={() => setModal(1)}> Add Category</Button>
                                            }
                                        </div>
                                    </Card.Header>
                                    <Card.Body className="table-full-width">
                                        <div className="table-responsive">
                                            <Table className="table-bigboy">
                                                <thead>
                                                    <tr>
                                                        <th className="serial-col">#</th>
                                                        <th className='text-center'>Image</th>
                                                        <th>Name</th>
                                                        <th className="text-description">
                                                            <div className='categories-table'> Description</div></th>
                                                        <th className="text-center">
                                                            <div className='cetegories-creAted text-center'>Created At</div>
                                                        </th>
                                                        <th className="text-center">Status</th>
                                                        <th className="td-action text-center">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        categories && categories.length ?
                                                            categories.map((category, index) => {
                                                                return (
                                                                    <tr key={index}>
                                                                        <td className="serial-col text-white">{pagination && ((pagination.limit * pagination.page) - pagination.limit) + index + 1}</td>
                                                                        <td>
                                                                            <div className="user-image">
                                                                                <img className="img-fluid" alt="Category Image" src={category.image ? category.image : placeholderImg} />
                                                                            </div>
                                                                        </td>
                                                                        <td className="text-white">
                                                                            {category.name}
                                                                        </td>
                                                                        <td className='text-white'>
                                                                            <div className="text-truncate">
                                                                                {category.description ? category.description : 'N/A'}
                                                                            </div>
                                                                        </td>
                                                                        <td className="td-number text-white text-center">
                                                                            <div className='date-categories'>
                                                                                {moment(category.createdAt).format('DD MMM YYYY')}
                                                                            </div>
                                                                        </td>
                                                                        <td className='text-center text-white'>
                                                                            {
                                                                                category.status ?
                                                                                    <label className="label label-success m-0">Active</label>
                                                                                    : <label className="label label-danger m-0">Inactive</label>
                                                                            }
                                                                        </td>
                                                                        <td className="td-actions">
                                                                            <ul className="list-unstyled mb-0 d-flex">
                                                                                {
                                                                                    permissions && permissions.editCategory &&
                                                                                    <li className="d-inline-block align-top">
                                                                                        <OverlayTrigger overlay={<Tooltip id="tooltip-436082023">Edit</Tooltip>} placement="left">
                                                                                            <Button
                                                                                                className="btn-link btn-icon"
                                                                                                type="button"
                                                                                                variant="success"
                                                                                                onClick={() => setModal(2, category._id)}
                                                                                            >
                                                                                                <i className="fas fa-edit"></i>
                                                                                            </Button>
                                                                                        </OverlayTrigger>
                                                                                    </li>
                                                                                }
                                                                                {
                                                                                    permissions && permissions.deleteCategory &&
                                                                                    <li className="d-inline-block align-top">
                                                                                        <OverlayTrigger
                                                                                            overlay={<Tooltip id="tooltip-334669391"> Delete </Tooltip>} placement="left" >
                                                                                            <Button
                                                                                                className="btn-link btn-icon"
                                                                                                type="button"
                                                                                                variant="danger"
                                                                                                onClick={() => deleteCategory(category._id)}
                                                                                            >
                                                                                                <i className="fas fa-trash"></i>
                                                                                            </Button>
                                                                                        </OverlayTrigger>
                                                                                    </li>
                                                                                }
                                                                            </ul>
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            })
                                                            :
                                                            <tr>
                                                                <td colSpan="7" className="text-center">
                                                                    <div className="alert alert-info" role="alert">No Category Found</div>
                                                                </td>
                                                            </tr>
                                                    }
                                                </tbody>
                                            </Table>
                                            {
                                                pagination &&
                                                <Pagination
                                                    className="m-3"
                                                    defaultCurrent={1}
                                                    pageSize // items per page
                                                    current={pagination.page} // current active page
                                                    total={pagination.pages} // total pages
                                                    onChange={onPageChange}
                                                    locale={localeInfo}
                                                />
                                            }
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>

                        {
                            modalType > 0 && category &&
                            <Modal className="modal-primary" onHide={() => setCatModal(!catModal)} show={catModal}>
                                <Modal.Header className="justify-content-center">
                                    <Row>
                                        <div className="col-12">
                                            <h4 className="mb-0 mb-md-3 mt-0">
                                                {modalType === 1 ? 'Add' : modalType === 2 ? 'Edit' : ''} Category
                                            </h4>
                                        </div>
                                    </Row>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form>
                                        <Form.Group>
                                            <label className='text-white'>Name <span className="text-danger">*</span></label>
                                            <Form.Control
                                                placeholder="Enter name"
                                                type="text"
                                                name="name"
                                                onChange={(e) => onChange(e)}
                                                defaultValue={category.name}
                                                required
                                            />
                                        </Form.Group>
                                        <Form.Group>
                                            <label className='text-white'>Slug <span className="text-danger">*</span></label>
                                            <Form.Control
                                                placeholder="Slug"
                                                type="text"
                                                name="slug"
                                                value={category.slug}
                                                required
                                                disabled={true}
                                                readOnly={true}
                                            />
                                        </Form.Group>
                                        <Form.Group>
                                            <label className='text-white'>Description</label>
                                            <textarea
                                                placeholder="Enter Description"
                                                type="text"
                                                name="description"
                                                onChange={(e) => onChange(e)}
                                                defaultValue={category.description}
                                                className="form-control"
                                                rows={5}
                                            />
                                        </Form.Group>
                                        <Form.Group>
                                            <label className='text-white'>Image {modalType === 1 && <span className="text-danger">*</span>}</label>
                                            <div className="input-group form-group">
                                                <div className="custom-file">
                                                    <input type="file" className="custom-file-input" id="category-image" accept=".png,.jpeg,.jpg" onChange={(e) => onFileChange(e)} name="image" />
                                                    <label id="category-image-label" className="custom-file-label" htmlFor="image">Choose file</label>
                                                </div>
                                            </div>
                                        </Form.Group>
                                        <Form.Group>
                                            <label className='text-white'>Banner</label>
                                            <div className="input-group form-group">
                                                <div className="custom-file">
                                                    <input type="file" className="custom-file-input" id="category-banner" accept=".png,.jpeg,.jpg" onChange={(e) => onFileChange(e)} name="banner" />
                                                    <label id="category-banner-label" className="custom-file-label" htmlFor="banner">Choose file</label>
                                                </div>
                                            </div>
                                        </Form.Group>
                                        <Form.Group>
                                            <label className='text-white'>Status</label>
                                            <Form.Check
                                                type="switch"
                                                id="category-status"
                                                className="mb-1"
                                                onChange={(e) => onChange(e)}
                                                name="status"
                                                defaultValue={false}
                                                checked={category.status}
                                            />
                                        </Form.Group>
                                    </Form>
                                </Modal.Body>

                                <Modal.Footer>
                                    <Button className="outline-button" onClick={() => setCatModal(!catModal)}>Close</Button>
                                    <Button className="btn-filled" onClick={() => submit()} disabled={loader}>Save</Button>
                                </Modal.Footer>
                            </Modal>
                        }
                    </Container>
            }
        </>
    )
}

const mapStateToProps = state => ({
    category: state.category,
    error: state.error,
    getRoleRes: state.role.getRoleRes
});

export default connect(mapStateToProps, { beforeCategory, getCategories, upsertCategory, deleteCategory, getRole, beforeRole })(Categories);